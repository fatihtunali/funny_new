import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message, source } = await request.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
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
