// Simple in-memory rate limiter for contact form
// Tracks IP addresses and prevents spam submissions

interface RateLimitEntry {
  count: number;
  firstAttempt: number;
  lastAttempt: number;
}

// Store rate limit data in memory (resets on server restart)
const rateLimitMap = new Map<string, RateLimitEntry>();

// Cleanup old entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  const expiryTime = 60 * 60 * 1000; // 1 hour

  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now - entry.lastAttempt > expiryTime) {
      rateLimitMap.delete(ip);
    }
  }
}, 10 * 60 * 1000);

export interface RateLimitConfig {
  maxAttempts: number; // Maximum attempts allowed
  windowMs: number; // Time window in milliseconds
  blockDurationMs?: number; // How long to block after exceeding limit
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  message?: string;
}

/**
 * Check if an IP address is allowed to submit
 */
export function checkRateLimit(
  ip: string,
  config: RateLimitConfig = {
    maxAttempts: 3, // 3 submissions
    windowMs: 60 * 60 * 1000, // per hour
    blockDurationMs: 30 * 60 * 1000, // block for 30 minutes
  }
): RateLimitResult {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  // First attempt from this IP
  if (!entry) {
    rateLimitMap.set(ip, {
      count: 1,
      firstAttempt: now,
      lastAttempt: now,
    });

    return {
      allowed: true,
      remaining: config.maxAttempts - 1,
      resetTime: now + config.windowMs,
    };
  }

  // Check if window has expired
  const windowExpired = now - entry.firstAttempt > config.windowMs;

  if (windowExpired) {
    // Reset the window
    rateLimitMap.set(ip, {
      count: 1,
      firstAttempt: now,
      lastAttempt: now,
    });

    return {
      allowed: true,
      remaining: config.maxAttempts - 1,
      resetTime: now + config.windowMs,
    };
  }

  // Within the window - check if limit exceeded
  if (entry.count >= config.maxAttempts) {
    const blockDuration = config.blockDurationMs || config.windowMs;
    const blockedUntil = entry.lastAttempt + blockDuration;
    const isStillBlocked = now < blockedUntil;

    if (isStillBlocked) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: blockedUntil,
        message: `Too many requests. Please try again in ${Math.ceil((blockedUntil - now) / 60000)} minutes.`,
      };
    }

    // Block period expired - reset
    rateLimitMap.set(ip, {
      count: 1,
      firstAttempt: now,
      lastAttempt: now,
    });

    return {
      allowed: true,
      remaining: config.maxAttempts - 1,
      resetTime: now + config.windowMs,
    };
  }

  // Still within limits - increment count
  entry.count += 1;
  entry.lastAttempt = now;
  rateLimitMap.set(ip, entry);

  return {
    allowed: true,
    remaining: config.maxAttempts - entry.count,
    resetTime: entry.firstAttempt + config.windowMs,
  };
}

/**
 * Get client IP address from request
 */
export function getClientIp(request: Request): string {
  // Check various headers for real IP (in case of proxies/CDN)
  const headers = request.headers;

  // Cloudflare
  const cfIp = headers.get('cf-connecting-ip');
  if (cfIp) return cfIp;

  // Standard forwarded headers
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    // x-forwarded-for can be a comma-separated list
    const ips = forwarded.split(',').map(ip => ip.trim());
    return ips[0];
  }

  const realIp = headers.get('x-real-ip');
  if (realIp) return realIp;

  // Fallback - this won't work in production but useful for local dev
  return 'unknown';
}
