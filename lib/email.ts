// Email notification system
// For production, configure SMTP settings in environment variables

interface EmailData {
  to: string;
  subject: string;
  html: string;
  bccAdmin?: boolean; // Optional flag to BCC admin (default: true)
}

export async function sendEmail({ to, subject, html, bccAdmin = true }: EmailData) {
  // Always log emails for debugging
  console.log('📧 Sending email to:', to, 'Subject:', subject);

  try {
    // Use Brevo (formerly Sendinblue) API
    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    const FROM_EMAIL = process.env.EMAIL_FROM || 'info@funnytourism.com';
    const FROM_NAME = process.env.EMAIL_FROM_NAME || 'Funny Tourism';
    const BCC_EMAIL = 'info@funnytourism.com'; // Always BCC to operations email

    if (!BREVO_API_KEY) {
      console.warn('⚠️ BREVO_API_KEY not configured. Email will be logged only.');
      console.log('Email preview:', { to, subject, html: html.substring(0, 200) + '...' });
      return { success: true, message: 'Email logged (no API key)' };
    }

    // Prepare BCC array - always send copy to info@funnytourism.com unless recipient is that address
    const bccArray = bccAdmin && to !== BCC_EMAIL ? [
      {
        email: BCC_EMAIL,
        name: 'Funny Tourism Operations'
      }
    ] : [];

    if (bccArray.length > 0) {
      console.log('📋 BCC copy to:', BCC_EMAIL);
    }

    // Prepare email payload - only include bcc if there are recipients
    const emailPayload: any = {
      sender: {
        name: FROM_NAME,
        email: FROM_EMAIL
      },
      to: [
        {
          email: to,
          name: to.split('@')[0] // Use email username as name
        }
      ],
      subject: subject,
      htmlContent: html
    };

    // Only add bcc field if there are BCC recipients
    if (bccArray.length > 0) {
      emailPayload.bcc = bccArray;
    }

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY
      },
      body: JSON.stringify(emailPayload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Brevo API error:', data);
      throw new Error(`Brevo API error: ${data.message || 'Unknown error'}`);
    }

    console.log('✅ Email sent successfully via Brevo:', data.messageId);
    return { success: true, message: 'Email sent successfully', messageId: data.messageId };
  } catch (error) {
    console.error('❌ Email sending error:', error);
    return { success: false, message: 'Failed to send email', error: String(error) };
  }
}

// Email Templates

interface BookingEmailData {
  guestName?: string;
  packageName: string;
  travelDate: string | Date;
  duration: string;
  adults: number;
  children3to5?: number;
  children6to10?: number;
  hotelCategory: string;
  totalPrice: number;
}

export function generateBookingConfirmationEmail(booking: BookingEmailData) {
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
          <img src="https://funnytourism.com/images/FunnyLogo1.png" alt="Funny Tourism" style="max-width: 200px; height: auto; margin-bottom: 20px;">
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
            <a href="https://funnytourism.com/dashboard" class="button">View Booking Details</a>
          </div>

          <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
            For any questions or changes to your booking, please contact us:
            <br>📞 Phone: +90 216 557 52 52
            <br>📧 Email: info@funnytourism.com
            <br>💬 WhatsApp: +90 539 502 53 10
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

interface ReminderEmailData {
  guestName: string;
  packageName: string;
  travelDate: string | Date;
  duration: string;
}

export function generateBookingReminderEmail(booking: ReminderEmailData, daysUntilTravel: number) {
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
          <img src="https://funnytourism.com/images/FunnyLogo1.png" alt="Funny Tourism" style="max-width: 200px; height: auto; margin-bottom: 20px;">
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
            📞 Phone: +90 216 557 52 52<br>
            📧 Email: info@funnytourism.com<br>
            💬 WhatsApp: +90 539 502 53 10
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

// Transfer Booking Email Template

interface TransferBookingEmailData {
  guestName: string;
  referenceNumber: string;
  fromLocation: string;
  toLocation: string;
  transferDate: string | Date;
  transferTime: string;
  numberOfPassengers: number;
  vehicleType: string;
  totalPrice: number;
  flightNumber?: string;
  specialRequests?: string;
}

export function generateTransferBookingEmail(booking: TransferBookingEmailData) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
        .detail-label { font-weight: 600; color: #6b7280; }
        .detail-value { color: #111827; }
        .route { background: #f3e8ff; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; border: 2px solid #7c3aed; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://funnytourism.com/images/FunnyLogo1.png" alt="Funny Tourism" style="max-width: 200px; height: auto; margin-bottom: 20px;">
          <h1>🚗 Transfer Booking Confirmed!</h1>
          <p>Your comfortable ride is reserved</p>
        </div>

        <div class="content">
          <h2>Hello ${booking.guestName},</h2>

          <p>Great news! Your transfer booking has been confirmed. We'll make sure you travel in comfort and style.</p>

          <div class="route">
            <h3 style="margin: 0; color: #7c3aed; font-size: 18px;">Your Route</h3>
            <p style="font-size: 16px; margin: 15px 0;"><strong>${booking.fromLocation}</strong></p>
            <p style="margin: 10px 0; font-size: 24px; color: #7c3aed;">↓</p>
            <p style="font-size: 16px; margin: 15px 0;"><strong>${booking.toLocation}</strong></p>
          </div>

          <div class="booking-details">
            <h3 style="color: #7c3aed; margin-top: 0;">Booking Details</h3>

            <div class="detail-row">
              <span class="detail-label">Reference Number:</span>
              <span class="detail-value" style="font-weight: 700; color: #7c3aed;">${booking.referenceNumber}</span>
            </div>

            <div class="detail-row">
              <span class="detail-label">Transfer Date:</span>
              <span class="detail-value">${new Date(booking.transferDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>

            <div class="detail-row">
              <span class="detail-label">Transfer Time:</span>
              <span class="detail-value">${booking.transferTime}</span>
            </div>

            <div class="detail-row">
              <span class="detail-label">Number of Passengers:</span>
              <span class="detail-value">${booking.numberOfPassengers}</span>
            </div>

            <div class="detail-row">
              <span class="detail-label">Vehicle Type:</span>
              <span class="detail-value">${booking.vehicleType}</span>
            </div>

            ${booking.flightNumber ? `
            <div class="detail-row">
              <span class="detail-label">Flight Number:</span>
              <span class="detail-value">${booking.flightNumber}</span>
            </div>` : ''}

            ${booking.specialRequests ? `
            <div class="detail-row">
              <span class="detail-label">Special Requests:</span>
              <span class="detail-value">${booking.specialRequests}</span>
            </div>` : ''}

            <div class="detail-row" style="border-bottom: none;">
              <span class="detail-label">Total Price:</span>
              <span class="detail-value" style="font-size: 20px; font-weight: 700; color: #059669;">€${booking.totalPrice}</span>
            </div>
          </div>

          <div style="background: #ddd6fe; padding: 15px; border-radius: 8px; border-left: 4px solid #7c3aed;">
            <h4 style="margin: 0 0 10px 0; color: #7c3aed;">What's Next?</h4>
            <p style="margin: 0;">Our operations team will review your booking and contact you within 24 hours to confirm all details. Your driver will be ready and waiting at the pickup point.</p>
          </div>

          <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
            For any questions or changes to your transfer, please contact us:
            <br>📞 Phone: +90 216 557 52 52
            <br>📧 Email: info@funnytourism.com
            <br>💬 WhatsApp: +90 539 502 53 10
          </p>
        </div>

        <div class="footer">
          <p>© ${new Date().getFullYear()} Funny Tourism - Dream Destination Turkey</p>
          <p>Reliable transfers across Turkey since 2013</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Admin Notification Email for Transfer Bookings

export function generateTransferAdminNotification(booking: TransferBookingEmailData) {
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
        .label { font-weight: 600; color: #6b7280; display: inline-block; width: 180px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2 style="margin: 0;">🚗 New Transfer Booking</h2>
          <p style="margin: 5px 0 0 0;">Reference: ${booking.referenceNumber}</p>
        </div>

        <div class="content">
          <div class="detail">
            <span class="label">Customer Name:</span>
            <span>${booking.guestName}</span>
          </div>

          <div class="detail">
            <span class="label">Route:</span>
            <span><strong>${booking.fromLocation} → ${booking.toLocation}</strong></span>
          </div>

          <div class="detail">
            <span class="label">Date & Time:</span>
            <span>${new Date(booking.transferDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} at ${booking.transferTime}</span>
          </div>

          <div class="detail">
            <span class="label">Passengers:</span>
            <span>${booking.numberOfPassengers}</span>
          </div>

          <div class="detail">
            <span class="label">Vehicle:</span>
            <span>${booking.vehicleType}</span>
          </div>

          ${booking.flightNumber ? `
          <div class="detail">
            <span class="label">Flight Number:</span>
            <span>${booking.flightNumber}</span>
          </div>` : ''}

          <div class="detail">
            <span class="label">Total Price:</span>
            <span><strong>€${booking.totalPrice}</strong></span>
          </div>

          ${booking.specialRequests ? `
          <div class="detail" style="border-bottom: none;">
            <span class="label">Special Requests:</span>
            <span>${booking.specialRequests}</span>
          </div>` : ''}

          <p style="margin-top: 20px; padding: 15px; background: #fef3c7; border-radius: 6px; border-left: 4px solid #f59e0b;">
            <strong>Action Required:</strong> Please review and confirm this booking within 24 hours.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}
