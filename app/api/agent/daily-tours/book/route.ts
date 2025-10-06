import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      tourId,
      agentId,
      guestName,
      guestEmail,
      guestPhone,
      tourDate,
      tourType,
      numberOfPax,
      totalPrice,
      commissionAmount,
      commissionRate,
      pickupLocation,
      hotelName,
      specialRequests,
    } = body;

    // Validate required fields
    if (!tourId || !agentId || !guestEmail || !guestPhone || !tourDate || !tourType || !numberOfPax || !totalPrice) {
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
        agentId,
        guestName: guestName || null,
        guestEmail,
        guestPhone,
        tourDate: new Date(tourDate),
        tourType,
        numberOfPax: parseInt(numberOfPax),
        totalPrice: parseFloat(totalPrice),
        commissionAmount: parseFloat(commissionAmount),
        commissionRate: parseFloat(commissionRate),
        paidAmount: 0,
        remainingAmount: parseFloat(commissionAmount),
        pickupLocation: pickupLocation || null,
        hotelName: hotelName || null,
        specialRequests: specialRequests || null,
        referenceNumber,
        status: 'PENDING',
        paymentStatus: 'PENDING',
      },
      include: {
        tour: true,
        agent: true,
      },
    });

    // Send confirmation email to customer
    const customerEmailHtml = generateAgentDailyTourBookingEmail({
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
      agentCompany: booking.agent?.companyName,
    });

    await sendEmail({
      to: guestEmail,
      subject: `Daily Tour Booking Confirmation - ${referenceNumber}`,
      html: customerEmailHtml,
    });

    // Send notification email to admin
    const adminEmail = process.env.ADMIN_EMAIL || 'info@funnytourism.com';
    const adminEmailHtml = generateAgentBookingNotification({
      agentCompany: booking.agent?.companyName || 'Unknown Agent',
      agentEmail: booking.agent?.email || '',
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
      commissionAmount: parseFloat(commissionAmount),
      commissionRate: parseFloat(commissionRate),
    });

    await sendEmail({
      to: adminEmail,
      subject: `New Agent Booking - ${referenceNumber} (${booking.agent?.companyName})`,
      html: adminEmailHtml,
    });

    return NextResponse.json({
      success: true,
      booking,
      referenceNumber,
    });
  } catch (error) {
    console.error('Error creating agent daily tour booking:', error);
    return NextResponse.json(
      {
        error: 'Failed to create booking',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function generateAgentDailyTourBookingEmail(data: any) {
  return `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #14b8a6 0%, #0f766e 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1>🎭 Tour Booking Confirmed!</h1>
        </div>
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2>Hello ${data.guestName},</h2>
          <p>Your daily tour booking has been confirmed through ${data.agentCompany}!</p>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #14b8a6;">Booking Details</h3>
            <p><strong>Reference:</strong> ${data.referenceNumber}</p>
            <p><strong>Tour:</strong> ${data.tourTitle} (${data.tourCode})</p>
            <p><strong>Date:</strong> ${new Date(data.tourDate).toLocaleDateString()}</p>
            <p><strong>Type:</strong> ${data.tourType === 'SIC' ? 'Shared Tour (SIC)' : 'Private Tour'}</p>
            <p><strong>Guests:</strong> ${data.numberOfPax}</p>
            <p><strong>Total Price:</strong> €${data.totalPrice.toFixed(2)}</p>
          </div>
          <p>Our team will contact you within 24 hours to confirm pickup details.</p>
          <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
            Booked through: ${data.agentCompany}<br>
            For support: info@funnytourism.com
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function generateAgentBookingNotification(data: any) {
  return `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #1f2937; color: white; padding: 20px;">
          <h2>🎭 New Agent Booking - Daily Tour</h2>
          <p>Reference: ${data.referenceNumber}</p>
        </div>
        <div style="background: white; padding: 20px; border: 1px solid #e5e7eb;">
          <p><strong>Agent:</strong> ${data.agentCompany} (${data.agentEmail})</p>
          <p><strong>Customer:</strong> ${data.guestName} (${data.guestEmail}, ${data.guestPhone})</p>
          <p><strong>Tour:</strong> ${data.tourTitle} (${data.tourCode})</p>
          <p><strong>Date:</strong> ${new Date(data.tourDate).toLocaleDateString()}</p>
          <p><strong>Type:</strong> ${data.tourType === 'SIC' ? 'Shared Tour (SIC)' : 'Private Tour'}</p>
          <p><strong>Guests:</strong> ${data.numberOfPax}</p>
          <p><strong>Total Price:</strong> €${data.totalPrice.toFixed(2)}</p>
          <p><strong>Agent Commission:</strong> €${data.commissionAmount.toFixed(2)} (${data.commissionRate}%)</p>
          <p style="margin-top: 20px; padding: 15px; background: #fef3c7; border-radius: 6px;">
            <strong>Action Required:</strong> Confirm pickup time and location with customer within 24 hours.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}
