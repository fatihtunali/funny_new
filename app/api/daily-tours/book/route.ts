import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      tourId,
      guestName,
      guestEmail,
      guestPhone,
      tourDate,
      tourType, // 'SIC' or 'PRIVATE'
      numberOfPax,
      totalPrice,
      pickupLocation,
      hotelName,
      specialRequests,
    } = body;

    // Validate required fields
    if (!tourId || !guestEmail || !guestPhone || !tourDate || !tourType || !numberOfPax || !totalPrice) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate reference number
    const referenceNumber = `TOUR-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // Get tour details
    const tour = await prisma.dailyTour.findUnique({
      where: { id: tourId },
    });

    if (!tour) {
      return NextResponse.json(
        { error: 'Tour not found' },
        { status: 404 }
      );
    }

    // Create booking
    const booking = await prisma.dailyTourBooking.create({
      data: {
        tourId,
        guestName: guestName || null,
        guestEmail,
        guestPhone,
        tourDate: new Date(tourDate),
        tourType,
        numberOfPax: parseInt(numberOfPax),
        totalPrice: parseFloat(totalPrice),
        pickupLocation: pickupLocation || null,
        hotelName: hotelName || null,
        specialRequests: specialRequests || null,
        referenceNumber,
        status: 'PENDING',
        paymentStatus: 'PENDING',
      },
      include: {
        tour: true,
      },
    });

    // Send confirmation email to customer
    const customerEmailHtml = generateDailyTourBookingEmail({
      guestName: guestName || 'Valued Guest',
      referenceNumber,
      tourTitle: tour.title,
      tourCode: tour.tourCode,
      tourDate,
      tourType,
      numberOfPax: parseInt(numberOfPax),
      totalPrice: parseFloat(totalPrice),
      pickupLocation,
      hotelName,
      specialRequests,
    });

    await sendEmail({
      to: guestEmail,
      subject: `Daily Tour Booking Confirmation - ${referenceNumber}`,
      html: customerEmailHtml,
    });

    // Send notification email to admin
    const adminEmail = process.env.ADMIN_EMAIL || 'info@funnytourism.com';
    const adminEmailHtml = generateDailyTourAdminNotification({
      guestName: guestName || 'Guest',
      guestEmail,
      guestPhone,
      referenceNumber,
      tourTitle: tour.title,
      tourCode: tour.tourCode,
      tourDate,
      tourType,
      numberOfPax: parseInt(numberOfPax),
      totalPrice: parseFloat(totalPrice),
      pickupLocation,
      hotelName,
      specialRequests,
    });

    await sendEmail({
      to: adminEmail,
      subject: `New Daily Tour Booking - ${referenceNumber}`,
      html: adminEmailHtml,
    });

    return NextResponse.json({
      success: true,
      booking,
      referenceNumber,
    });
  } catch (error) {
    console.error('Error creating daily tour booking:', error);
    return NextResponse.json(
      {
        error: 'Failed to create booking',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Email template for customer
function generateDailyTourBookingEmail(data: {
  guestName: string;
  referenceNumber: string;
  tourTitle: string;
  tourCode: string;
  tourDate: string;
  tourType: string;
  numberOfPax: number;
  totalPrice: number;
  pickupLocation?: string;
  hotelName?: string;
  specialRequests?: string;
}) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #14b8a6 0%, #0f766e 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
        .detail-label { font-weight: 600; color: #6b7280; }
        .detail-value { color: #111827; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎭 Tour Booking Confirmed!</h1>
          <p>Get ready for an amazing experience</p>
        </div>

        <div class="content">
          <h2>Hello ${data.guestName},</h2>

          <p>Great news! Your daily tour booking has been confirmed. We're excited to show you the best of Turkey!</p>

          <div class="booking-details">
            <h3 style="color: #14b8a6; margin-top: 0;">Booking Details</h3>

            <div class="detail-row">
              <span class="detail-label">Reference Number:</span>
              <span class="detail-value" style="font-weight: 700; color: #14b8a6;">${data.referenceNumber}</span>
            </div>

            <div class="detail-row">
              <span class="detail-label">Tour:</span>
              <span class="detail-value"><strong>${data.tourTitle}</strong></span>
            </div>

            <div class="detail-row">
              <span class="detail-label">Tour Code:</span>
              <span class="detail-value">${data.tourCode}</span>
            </div>

            <div class="detail-row">
              <span class="detail-label">Tour Date:</span>
              <span class="detail-value">${new Date(data.tourDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>

            <div class="detail-row">
              <span class="detail-label">Tour Type:</span>
              <span class="detail-value">${data.tourType === 'SIC' ? 'Shared Tour (SIC)' : 'Private Tour'}</span>
            </div>

            <div class="detail-row">
              <span class="detail-label">Number of Guests:</span>
              <span class="detail-value">${data.numberOfPax} ${data.numberOfPax === 1 ? 'person' : 'people'}</span>
            </div>

            ${data.pickupLocation ? `
            <div class="detail-row">
              <span class="detail-label">Pickup Location:</span>
              <span class="detail-value">${data.pickupLocation}</span>
            </div>` : ''}

            ${data.hotelName ? `
            <div class="detail-row">
              <span class="detail-label">Hotel Name:</span>
              <span class="detail-value">${data.hotelName}</span>
            </div>` : ''}

            ${data.specialRequests ? `
            <div class="detail-row">
              <span class="detail-label">Special Requests:</span>
              <span class="detail-value">${data.specialRequests}</span>
            </div>` : ''}

            <div class="detail-row" style="border-bottom: none;">
              <span class="detail-label">Total Price:</span>
              <span class="detail-value" style="font-size: 20px; font-weight: 700; color: #059669;">€${data.totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <div style="background: #d1fae5; padding: 15px; border-radius: 8px; border-left: 4px solid #14b8a6;">
            <h4 style="margin: 0 0 10px 0; color: #14b8a6;">What's Next?</h4>
            <p style="margin: 0;">Our team will contact you within 24 hours to confirm pickup time and location details. Please keep your phone accessible!</p>
          </div>

          <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
            For any questions or changes to your tour, please contact us:
            <br>📞 Phone: +90 XXX XXX XX XX
            <br>📧 Email: info@funnytourism.com
            <br>💬 WhatsApp: +90 XXX XXX XX XX
          </p>
        </div>

        <div class="footer">
          <p>© ${new Date().getFullYear()} Funny Tourism - Dream Destination Turkey</p>
          <p>Unforgettable daily tours across Turkey since 2013</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Email template for admin
function generateDailyTourAdminNotification(data: {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  referenceNumber: string;
  tourTitle: string;
  tourCode: string;
  tourDate: string;
  tourType: string;
  numberOfPax: number;
  totalPrice: number;
  pickupLocation?: string;
  hotelName?: string;
  specialRequests?: string;
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
        .label { font-weight: 600; color: #6b7280; display: inline-block; width: 180px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2 style="margin: 0;">🎭 New Daily Tour Booking</h2>
          <p style="margin: 5px 0 0 0;">Reference: ${data.referenceNumber}</p>
        </div>

        <div class="content">
          <div class="detail">
            <span class="label">Customer Name:</span>
            <span>${data.guestName}</span>
          </div>

          <div class="detail">
            <span class="label">Email:</span>
            <span>${data.guestEmail}</span>
          </div>

          <div class="detail">
            <span class="label">Phone:</span>
            <span>${data.guestPhone}</span>
          </div>

          <div class="detail">
            <span class="label">Tour:</span>
            <span><strong>${data.tourTitle}</strong> (${data.tourCode})</span>
          </div>

          <div class="detail">
            <span class="label">Date:</span>
            <span>${new Date(data.tourDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>

          <div class="detail">
            <span class="label">Tour Type:</span>
            <span>${data.tourType === 'SIC' ? 'Shared Tour (SIC)' : 'Private Tour'}</span>
          </div>

          <div class="detail">
            <span class="label">Number of Guests:</span>
            <span>${data.numberOfPax}</span>
          </div>

          ${data.pickupLocation ? `
          <div class="detail">
            <span class="label">Pickup Location:</span>
            <span>${data.pickupLocation}</span>
          </div>` : ''}

          ${data.hotelName ? `
          <div class="detail">
            <span class="label">Hotel:</span>
            <span>${data.hotelName}</span>
          </div>` : ''}

          <div class="detail">
            <span class="label">Total Price:</span>
            <span><strong>€${data.totalPrice.toFixed(2)}</strong></span>
          </div>

          ${data.specialRequests ? `
          <div class="detail" style="border-bottom: none;">
            <span class="label">Special Requests:</span>
            <span>${data.specialRequests}</span>
          </div>` : ''}

          <p style="margin-top: 20px; padding: 15px; background: #fef3c7; border-radius: 6px; border-left: 4px solid #f59e0b;">
            <strong>Action Required:</strong> Please confirm pickup time and location with customer within 24 hours.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}
