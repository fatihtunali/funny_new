import type { NextConfig } from "next";
import path from 'path';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'], // Serve modern formats when supported
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840], // Responsive image sizes
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Smaller image sizes
    minimumCacheTTL: 60 * 60 * 24 * 30, // Cache images for 30 days
  },
  // Enable compression
  compress: true,
  // Silence workspace root warning by specifying the correct root
  outputFileTracingRoot: path.join(__dirname),
  // Redirects for agent and admin portals (no locale prefix)
  async redirects() {
    return [
      // Redirect /en/agent/* to /agent/*
      {
        source: '/en/agent/:path*',
        destination: '/agent/:path*',
        permanent: true,
      },
      // Redirect /es/agent/* to /agent/*
      {
        source: '/es/agent/:path*',
        destination: '/agent/:path*',
        permanent: true,
      },
      // Redirect /en/admin/* to /admin/*
      {
        source: '/en/admin/:path*',
        destination: '/admin/:path*',
        permanent: true,
      },
      // Redirect /es/admin/* to /admin/*
      {
        source: '/es/admin/:path*',
        destination: '/admin/:path*',
        permanent: true,
      },
    ];
  },
  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
