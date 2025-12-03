import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

// TravelQuoteBot API configuration
const TQB_API_URL = process.env.TQB_API_URL || 'http://134.209.137.11:3004';
const TQB_API_KEY = process.env.TQB_API_KEY || 'myg_live_sk_7f8a9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a';

export async function POST(request: NextRequest) {
  try {
    const {
      name,
      email,
      phone,
      startDate,
      endDate,
      guests,
      message,
      yachtId,
      yachtName,
      tqbYachtId,
      turnstileToken,
      honeypot,
      timestamp,
    } = await request.json();

    // 1. HONEYPOT CHECK
    if (honeypot && honeypot.trim() !== '') {
      console.log('Spam detected: Honeypot filled');
      return NextResponse.json({ success: true, message: 'success' });
    }

    // 2. TIME-BASED CHECK
    if (timestamp) {
      const submissionTime = Date.now() - parseInt(timestamp);
      if (submissionTime < 3000) {
        console.log('Spam detected: Form submitted too fast');
        return NextResponse.json({ success: true, message: 'success' });
      }
    }

    // 3. RATE LIMITING
    const clientIp = getClientIp(request);
    const rateLimitResult = checkRateLimit(clientIp, {
      maxAttempts: 5,
      windowMs: 60 * 60 * 1000,
      blockDurationMs: 30 * 60 * 1000,
    });

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { success: false, error: rateLimitResult.message || 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // 4. TURNSTILE VERIFICATION
    if (!turnstileToken) {
      return NextResponse.json(
        { success: false, error: 'CAPTCHA verification required' },
        { status: 400 }
      );
    }

    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
    if (turnstileSecret) {
      const turnstileResponse = await fetch(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            secret: turnstileSecret,
            response: turnstileToken,
            remoteip: clientIp,
          }),
        }
      );

      const turnstileData = await turnstileResponse.json();
      if (!turnstileData.success) {
        return NextResponse.json(
          { success: false, error: 'CAPTCHA verification failed. Please try again.' },
          { status: 400 }
        );
      }
    }

    // 5. VALIDATE REQUIRED FIELDS
    if (!name || !email || !startDate || !endDate || !guests) {
      return NextResponse.json(
        { success: false, error: 'All required fields must be filled' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // 6. SAVE TO LOCAL DATABASE (as ContactInquiry for backup)
    const inquiry = await prisma.contactInquiry.create({
      data: {
        name,
        email,
        subject: `Yacht Charter Inquiry - ${yachtName}`,
        message: `
YACHT CHARTER INQUIRY
=====================
Yacht: ${yachtName}
Dates: ${startDate} to ${endDate}
Guests: ${guests}
Phone: ${phone || 'Not provided'}

Message:
${message || 'No additional message'}
        `.trim(),
        source: 'yacht-charter',
      },
    });

    // 7. SEND TO TRAVELQUOTEBOT
    let tqbResult = null;
    try {
      const tqbResponse = await fetch(`${TQB_API_URL}/api/external/yacht-quote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': TQB_API_KEY,
        },
        body: JSON.stringify({
          yacht_id: tqbYachtId,
          start_date: startDate,
          end_date: endDate,
          guests: parseInt(guests),
          customer_name: name,
          customer_email: email,
          customer_phone: phone || '',
          special_requests: message || '',
          source: 'funnytourism.com',
        }),
      });

      tqbResult = await tqbResponse.json();
      console.log('TravelQuoteBot response:', tqbResult);
    } catch (tqbError) {
      console.error('TravelQuoteBot error:', tqbError);
      // Continue anyway - we have the local backup
    }

    // 8. SEND CONFIRMATION EMAIL TO CUSTOMER
    const customerEmailHtml = generateCustomerConfirmationEmail({
      name,
      yachtName,
      startDate,
      endDate,
      guests,
    });

    await sendEmail({
      to: email,
      subject: `Yacht Charter Inquiry Received - ${yachtName}`,
      html: customerEmailHtml,
    });

    // 9. SEND NOTIFICATION EMAIL TO ADMIN
    const adminEmail = process.env.ADMIN_EMAIL || 'info@funnytourism.com';
    const adminEmailHtml = generateAdminNotificationEmail({
      name,
      email,
      phone,
      yachtName,
      startDate,
      endDate,
      guests,
      message,
      tqbResult,
      createdAt: inquiry.createdAt,
    });

    await sendEmail({
      to: adminEmail,
      subject: `🛥️ New Yacht Charter Inquiry - ${yachtName}`,
      html: adminEmailHtml,
    });

    return NextResponse.json({
      success: true,
      message: 'Inquiry sent successfully',
      quoteId: tqbResult?.quote_id,
    });
  } catch (error) {
    console.error('Yacht inquiry error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateCustomerConfirmationEmail(data: {
  name: string;
  yachtName: string;
  startDate: string;
  endDate: string;
  guests: string;
}) {
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
        .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🛥️ Yacht Charter Inquiry Received!</h1>
          <p>Thank you for your interest</p>
        </div>

        <div class="content">
          <h2>Hello ${data.name},</h2>

          <p>Thank you for your interest in chartering <strong>${data.yachtName}</strong> with Funny Tourism!</p>

          <div class="highlight">
            <h4 style="margin: 0 0 10px 0; color: #0284c7;">What happens next?</h4>
            <p style="margin: 0;">Our yacht charter specialists will review your request and get back to you with availability and a detailed quote within <strong>24 hours</strong>.</p>
          </div>

          <div class="details">
            <h3 style="color: #0284c7; margin-top: 0;">Your Request Details:</h3>
            <p><strong>Yacht:</strong> ${data.yachtName}</p>
            <p><strong>Dates:</strong> ${data.startDate} to ${data.endDate}</p>
            <p><strong>Guests:</strong> ${data.guests}</p>
          </div>

          <p>If you have any immediate questions, feel free to reach out:</p>

          <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
            📞 Phone: +90 252 614 4757<br>
            📧 Email: info@funnytourism.com<br>
            💬 WhatsApp: +90 539 614 4757
          </p>
        </div>

        <div class="footer">
          <p>© ${new Date().getFullYear()} Funny Tourism - Yacht Charters Turkey</p>
          <p>Creating unforgettable sailing experiences</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateAdminNotificationEmail(data: {
  name: string;
  email: string;
  phone: string | null;
  yachtName: string;
  startDate: string;
  endDate: string;
  guests: string;
  message: string | null;
  tqbResult: { quote_id?: string; success?: boolean } | null;
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
        .yacht-box { background: #0284c7; color: white; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
        .tqb-status { background: ${data.tqbResult?.success ? '#d1fae5' : '#fef3c7'}; padding: 10px; border-radius: 6px; margin-top: 15px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2 style="margin: 0;">🛥️ New Yacht Charter Inquiry</h2>
          <p style="margin: 5px 0 0 0;">Received: ${new Date(data.createdAt).toLocaleString()}</p>
        </div>

        <div class="content">
          <div class="yacht-box">
            <h3 style="margin: 0;">${data.yachtName}</h3>
            <p style="margin: 5px 0 0 0;">${data.startDate} → ${data.endDate} | ${data.guests} guests</p>
          </div>

          <div class="detail">
            <span class="label">Name:</span>
            <span><strong>${data.name}</strong></span>
          </div>

          <div class="detail">
            <span class="label">Email:</span>
            <span><a href="mailto:${data.email}">${data.email}</a></span>
          </div>

          <div class="detail">
            <span class="label">Phone:</span>
            <span>${data.phone || 'Not provided'}</span>
          </div>

          ${data.message ? `
          <div style="margin-top: 15px; padding: 15px; background: #f9fafb; border-radius: 6px; border-left: 4px solid #0284c7;">
            <h4 style="margin: 0 0 10px 0; color: #0284c7;">Message:</h4>
            <p style="margin: 0; white-space: pre-wrap;">${data.message}</p>
          </div>
          ` : ''}

          <div class="tqb-status">
            <strong>TravelQuoteBot:</strong>
            ${data.tqbResult?.success
              ? `✅ Quote created (ID: ${data.tqbResult.quote_id})`
              : '⚠️ Not synced (check TQB manually)'}
          </div>

          <p style="margin-top: 20px; padding: 15px; background: #fef3c7; border-radius: 6px; border-left: 4px solid #f59e0b;">
            <strong>Action Required:</strong> Please respond with availability and quote within 24 hours.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}
