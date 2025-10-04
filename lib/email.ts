// Email notification system
// For production, configure SMTP settings in environment variables

interface EmailData {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailData) {
  // In development, just log the email
  if (process.env.NODE_ENV === 'development') {
    console.log('📧 Email would be sent:');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('HTML:', html.substring(0, 200) + '...');
    return { success: true, message: 'Email logged (development mode)' };
  }

  // For production, you would use a service like:
  // - SendGrid
  // - AWS SES
  // - Resend
  // - Nodemailer with SMTP

  // Example with fetch to an email API:
  try {
    // Replace with your email service endpoint
    const response = await fetch(process.env.EMAIL_API_URL || '', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.EMAIL_API_KEY}`
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || 'noreply@dreamdestinationturkey.com',
        to,
        subject,
        html
      })
    });

    if (!response.ok) {
      throw new Error('Email service error');
    }

    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, message: 'Failed to send email' };
  }
}

// Email Templates

export function generateBookingConfirmationEmail(booking: any) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
        .detail-label { font-weight: 600; color: #6b7280; }
        .detail-value { color: #111827; }
        .button { display: inline-block; background: #0284c7; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Booking Confirmed!</h1>
          <p>Thank you for choosing Funny Tourism</p>
        </div>

        <div class="content">
          <h2>Hello ${booking.guestName || 'Valued Customer'},</h2>

          <p>We're excited to confirm your booking for an unforgettable Turkish adventure!</p>

          <div class="booking-details">
            <h3 style="color: #0284c7; margin-top: 0;">Booking Details</h3>

            <div class="detail-row">
              <span class="detail-label">Package:</span>
              <span class="detail-value">${booking.packageName}</span>
            </div>

            <div class="detail-row">
              <span class="detail-label">Travel Date:</span>
              <span class="detail-value">${new Date(booking.travelDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>

            <div class="detail-row">
              <span class="detail-label">Duration:</span>
              <span class="detail-value">${booking.duration}</span>
            </div>

            <div class="detail-row">
              <span class="detail-label">Number of Travelers:</span>
              <span class="detail-value">${booking.adults} Adults${booking.children3to5 ? `, ${booking.children3to5} Children (3-5)` : ''}${booking.children6to10 ? `, ${booking.children6to10} Children (6-10)` : ''}</span>
            </div>

            <div class="detail-row">
              <span class="detail-label">Hotel Category:</span>
              <span class="detail-value">${booking.hotelCategory === 'fivestar' ? '5-Star' : booking.hotelCategory === 'fourstar' ? '4-Star' : '3-Star'}</span>
            </div>

            <div class="detail-row" style="border-bottom: none;">
              <span class="detail-label">Total Price:</span>
              <span class="detail-value" style="font-size: 20px; font-weight: 700; color: #059669;">€${booking.totalPrice}</span>
            </div>
          </div>

          <div style="background: #dbeafe; padding: 15px; border-radius: 8px; border-left: 4px solid #0284c7;">
            <h4 style="margin: 0 0 10px 0; color: #0284c7;">What's Next?</h4>
            <p style="margin: 0;">Our travel specialist will contact you within 24 hours to finalize the details and answer any questions you may have.</p>
          </div>

          <div style="text-align: center;">
            <a href="https://dreamdestinationturkey.com/dashboard" class="button">View Booking Details</a>
          </div>

          <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
            For any questions or changes to your booking, please contact us:
            <br>📞 Phone: +90 XXX XXX XX XX
            <br>📧 Email: info@dreamdestinationturkey.com
            <br>💬 WhatsApp: +90 XXX XXX XX XX
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

export function generateBookingReminderEmail(booking: any, daysUntilTravel: number) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .highlight { background: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0; }
        .checklist { background: white; padding: 20px; border-radius: 8px; }
        .checklist-item { padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🧳 Your Turkey Adventure is ${daysUntilTravel} Days Away!</h1>
        </div>

        <div class="content">
          <h2>Hello ${booking.guestName},</h2>

          <p>We're getting excited for your upcoming trip to Turkey! Here's a friendly reminder about your booking:</p>

          <div class="highlight">
            <h3 style="margin-top: 0; color: #d97706;">Your Trip Details</h3>
            <p><strong>Package:</strong> ${booking.packageName}</p>
            <p><strong>Start Date:</strong> ${new Date(booking.travelDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p><strong>Duration:</strong> ${booking.duration}</p>
          </div>

          <div class="checklist">
            <h3 style="color: #0284c7;">Pre-Travel Checklist</h3>
            <div class="checklist-item">✓ Passport valid for at least 6 months</div>
            <div class="checklist-item">✓ Travel insurance confirmed</div>
            <div class="checklist-item">✓ Flight details shared with us</div>
            <div class="checklist-item">✓ Special requests communicated</div>
            <div class="checklist-item" style="border-bottom: none;">✓ Emergency contacts updated</div>
          </div>

          <p style="margin-top: 30px;">If you have any questions or need to make any changes, please don't hesitate to contact us!</p>

          <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
            📞 Phone: +90 XXX XXX XX XX<br>
            📧 Email: info@dreamdestinationturkey.com<br>
            💬 WhatsApp: +90 XXX XXX XX XX
          </p>
        </div>

        <div class="footer">
          <p>© ${new Date().getFullYear()} Funny Tourism - We can't wait to show you Turkey!</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
