import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
  try {
    const {
      name,
      email,
      subject,
      message,
      source,
      turnstileToken, // CAPTCHA token
      honeypot, // Honeypot field (should be empty)
      timestamp, // Form render timestamp
    } = await request.json();

    // 1. HONEYPOT CHECK - Bots usually fill hidden fields
    if (honeypot && honeypot.trim() !== '') {
      console.log('Spam detected: Honeypot filled');
      // Return success to not alert the bot
      return NextResponse.json({
        success: true,
        message: 'success'
      });
    }

    // 2. TIME-BASED CHECK - Bots submit too fast
    if (timestamp) {
      const submissionTime = Date.now() - parseInt(timestamp);
      const minTimeMs = 3000; // Minimum 3 seconds to fill form

      if (submissionTime < minTimeMs) {
        console.log('Spam detected: Form submitted too fast');
        return NextResponse.json({
          success: true,
          message: 'success'
        });
      }
    }

    // 3. RATE LIMITING - Check IP address
    const clientIp = getClientIp(request);
    const rateLimitResult = checkRateLimit(clientIp, {
      maxAttempts: 3, // 3 submissions
      windowMs: 60 * 60 * 1000, // per hour
      blockDurationMs: 30 * 60 * 1000, // block for 30 minutes
    });

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: rateLimitResult.message || 'Too many requests. Please try again later.',
        },
        { status: 429 }
      );
    }

    // 4. CLOUDFLARE TURNSTILE VERIFICATION
    if (!turnstileToken) {
      return NextResponse.json(
        { success: false, error: 'CAPTCHA verification required' },
        { status: 400 }
      );
    }

    // Verify Turnstile token with Cloudflare
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
    if (turnstileSecret) {
      const turnstileResponse = await fetch(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            secret: turnstileSecret,
            response: turnstileToken,
            remoteip: clientIp,
          }),
        }
      );

      const turnstileData = await turnstileResponse.json();

      if (!turnstileData.success) {
        console.log('CAPTCHA verification failed:', turnstileData);
        return NextResponse.json(
          { success: false, error: 'CAPTCHA verification failed. Please try again.' },
          { status: 400 }
        );
      }
    }

    // 5. VALIDATE REQUIRED FIELDS
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    // 6. ENHANCED VALIDATION - Check field lengths and content
    if (name.length < 2 || name.length > 100) {
      return NextResponse.json(
        { success: false, error: 'Name must be between 2 and 100 characters' },
        { status: 400 }
      );
    }

    if (subject.length < 3 || subject.length > 200) {
      return NextResponse.json(
        { success: false, error: 'Subject must be between 3 and 200 characters' },
        { status: 400 }
      );
    }

    if (message.length < 10 || message.length > 5000) {
      return NextResponse.json(
        { success: false, error: 'Message must be between 10 and 5000 characters' },
        { status: 400 }
      );
    }

    // 7. VALIDATE EMAIL FORMAT
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // 8. SPAM CONTENT CHECK - Basic keyword filtering
    const spamKeywords = [
      'viagra', 'cialis', 'casino', 'lottery', 'bitcoin', 'crypto',
      'investment opportunity', 'click here', 'buy now', 'limited time',
      'act now', 'congratulations you won', 'free money'
    ];

    const contentToCheck = `${name} ${email} ${subject} ${message}`.toLowerCase();
    const containsSpam = spamKeywords.some(keyword =>
      contentToCheck.includes(keyword.toLowerCase())
    );

    if (containsSpam) {
      console.log('Spam detected: Suspicious keywords found');
      // Return success to not alert the spammer
      return NextResponse.json({
        success: true,
        message: 'success'
      });
    }

    // Save to database
    const contactInquiry = await prisma.contactInquiry.create({
      data: {
        name,
        email,
        subject,
        message,
        source: source || 'contact'
      }
    });

    // Send confirmation email to guest
    const isQuoteRequest = subject === 'Quote Request' || message.includes('QUOTE REQUEST');

    const guestEmailHtml = isQuoteRequest ? generateQuoteRequestConfirmationEmail(name, message) : generateContactConfirmationEmail(name, subject);

    await sendEmail({
      to: email,
      subject: isQuoteRequest ? 'Quote Request Received - Funny Tourism' : 'Message Received - Funny Tourism',
      html: guestEmailHtml,
    });

    // Send notification email to admin
    const adminEmail = process.env.ADMIN_EMAIL || 'info@funnytourism.com';
    const adminEmailHtml = generateAdminNotificationEmail({
      name,
      email,
      subject,
      message,
      source: source || 'contact',
      createdAt: contactInquiry.createdAt
    });

    await sendEmail({
      to: adminEmail,
      subject: `New ${isQuoteRequest ? 'Quote Request' : 'Contact'} - ${name}`,
      html: adminEmailHtml,
    });

    return NextResponse.json({
      success: true,
      message: 'success',
      data: contactInquiry
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Email template for guest confirmation (Quote Request)
function generateQuoteRequestConfirmationEmail(name: string, message: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .highlight { background: #dbeafe; padding: 15px; border-radius: 8px; border-left: 4px solid #0284c7; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Thank You for Your Quote Request!</h1>
          <p>We've received your inquiry</p>
        </div>

        <div class="content">
          <h2>Hello ${name},</h2>

          <p>Thank you for your interest in exploring Turkey with Funny Tourism! We've successfully received your quote request.</p>

          <div class="highlight">
            <h4 style="margin: 0 0 10px 0; color: #0284c7;">What happens next?</h4>
            <p style="margin: 0;">Our travel experts will review your preferences and create a personalized itinerary tailored just for you. You'll receive a detailed quote within <strong>24 hours</strong>.</p>
          </div>

          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #0284c7; margin-top: 0;">Your Request Details:</h3>
            <div style="white-space: pre-wrap; color: #4b5563; font-size: 14px;">${message}</div>
          </div>

          <p>In the meantime, feel free to explore our website or reach out if you have any questions!</p>

          <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
            📞 Phone: +90 539 502 5310<br>
            📧 Email: info@funnytourism.com<br>
            💬 WhatsApp: +90 539 502 5310
          </p>
        </div>

        <div class="footer">
          <p>© ${new Date().getFullYear()} Funny Tourism - Dream Destination Turkey</p>
          <p>Creating unforgettable memories across Turkey since 2013</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Email template for guest confirmation (General Contact)
function generateContactConfirmationEmail(name: string, subject: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Message Received!</h1>
        </div>

        <div class="content">
          <h2>Hello ${name},</h2>

          <p>Thank you for contacting Funny Tourism! We've received your message regarding "<strong>${subject}</strong>" and will get back to you shortly.</p>

          <p>Our team typically responds within 24 hours during business days.</p>

          <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
            📞 Phone: +90 539 502 5310<br>
            📧 Email: info@funnytourism.com<br>
            💬 WhatsApp: +90 539 502 5310
          </p>
        </div>

        <div class="footer">
          <p>© ${new Date().getFullYear()} Funny Tourism - Dream Destination Turkey</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Email template for admin notification
function generateAdminNotificationEmail(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
  source: string;
  createdAt: Date;
}) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1f2937; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; }
        .detail { padding: 8px 0; border-bottom: 1px solid #f3f4f6; }
        .label { font-weight: 600; color: #6b7280; display: inline-block; width: 120px; }
        .message-box { background: #f9fafb; padding: 15px; border-radius: 6px; margin-top: 15px; border-left: 4px solid #0284c7; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2 style="margin: 0;">📬 New ${data.subject === 'Quote Request' ? 'Quote Request' : 'Contact Message'}</h2>
          <p style="margin: 5px 0 0 0;">Received: ${new Date(data.createdAt).toLocaleString()}</p>
        </div>

        <div class="content">
          <div class="detail">
            <span class="label">Name:</span>
            <span><strong>${data.name}</strong></span>
          </div>

          <div class="detail">
            <span class="label">Email:</span>
            <span><a href="mailto:${data.email}">${data.email}</a></span>
          </div>

          <div class="detail">
            <span class="label">Subject:</span>
            <span>${data.subject}</span>
          </div>

          <div class="detail">
            <span class="label">Source:</span>
            <span>${data.source}</span>
          </div>

          <div class="message-box">
            <h4 style="margin: 0 0 10px 0; color: #0284c7;">Message:</h4>
            <div style="white-space: pre-wrap; color: #4b5563;">${data.message}</div>
          </div>

          <p style="margin-top: 20px; padding: 15px; background: #fef3c7; border-radius: 6px; border-left: 4px solid #f59e0b;">
            <strong>Action Required:</strong> Please respond to this ${data.subject === 'Quote Request' ? 'quote request' : 'inquiry'} within 24 hours.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}
