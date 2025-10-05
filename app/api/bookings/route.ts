import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import prisma from '@/lib/prisma';
import { sendEmail, generateBookingConfirmationEmail } from '@/lib/email';

// Generate booking reference number
function generateReferenceNumber(): string {
  const prefix = 'FT';
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${timestamp}${random}`;
}

// Create new booking
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    const body = await request.json();
    const {
      packageName,
      packageId,
      travelDate,
      duration,
      hotelCategory,
      adults,
      children3to5,
      children6to10,
      totalPrice,
      currency,
      specialRequests,
      guestName,
      guestEmail,
      guestPhone,
      // New fields
      arrivalFlightNumber,
      arrivalFlightTime,
      departureFlightNumber,
      departureFlightTime,
      dietaryRequirements,
      roomPreferences,
      emergencyContactName,
      emergencyContactPhone,
      travelInsurance,
      celebrationOccasion,
      passengers,
    } = body;

    // Validation
    if (!packageName || !travelDate || !hotelCategory || !totalPrice) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // If no session, require guest details
    if (!session && (!guestName || !guestEmail || !guestPhone)) {
      return NextResponse.json(
        { error: 'Please provide your contact information' },
        { status: 400 }
      );
    }

    // Validate passengers array
    if (!passengers || !Array.isArray(passengers) || passengers.length === 0) {
      return NextResponse.json(
        { error: 'Passenger information is required' },
        { status: 400 }
      );
    }

    // Validate emergency contact
    if (!emergencyContactName || !emergencyContactPhone) {
      return NextResponse.json(
        { error: 'Emergency contact information is required' },
        { status: 400 }
      );
    }

    // Create booking with passengers
    const booking = await prisma.booking.create({
      data: {
        userId: session ? session.id : null,
        guestName: !session ? guestName : null,
        guestEmail: !session ? guestEmail : null,
        guestPhone: !session ? guestPhone : null,
        packageName,
        packageId: packageId || null,
        travelDate: new Date(travelDate),
        duration: duration || '9 Nights / 10 Days',
        hotelCategory,
        adults: adults || 2,
        children3to5: children3to5 || 0,
        children6to10: children6to10 || 0,
        totalPrice: parseFloat(totalPrice),
        currency: currency || 'EUR',
        specialRequests: specialRequests || null,
        // New fields
        arrivalFlightNumber: arrivalFlightNumber || null,
        arrivalFlightTime: arrivalFlightTime || null,
        departureFlightNumber: departureFlightNumber || null,
        departureFlightTime: departureFlightTime || null,
        dietaryRequirements: dietaryRequirements || null,
        roomPreferences: roomPreferences || null,
        emergencyContactName: emergencyContactName || null,
        emergencyContactPhone: emergencyContactPhone || null,
        travelInsurance: travelInsurance || false,
        celebrationOccasion: celebrationOccasion || null,
        referenceNumber: generateReferenceNumber(),
        status: 'PENDING',
        paymentStatus: 'PENDING',
        // Create passengers
        passengers: {
          create: passengers.map((passenger: {
            firstName: string;
            middleName?: string;
            lastName: string;
            dateOfBirth: string;
            gender: string;
            nationality: string;
            passportNumber: string;
            passportExpiry: string;
            passportIssuingCountry: string;
            passengerType?: string;
          }) => ({
            firstName: passenger.firstName,
            middleName: passenger.middleName || null,
            lastName: passenger.lastName,
            dateOfBirth: new Date(passenger.dateOfBirth),
            gender: passenger.gender,
            nationality: passenger.nationality,
            passportNumber: passenger.passportNumber,
            passportExpiry: new Date(passenger.passportExpiry),
            passportIssuingCountry: passenger.passportIssuingCountry,
            passengerType: passenger.passengerType || 'ADULT',
          })),
        },
      },
      include: {
        passengers: true,
      },
    });

    // Send confirmation email
    try {
      const emailTo = session?.email || guestEmail;
      if (emailTo) {
        await sendEmail({
          to: emailTo,
          subject: `Booking Confirmation - ${booking.referenceNumber}`,
          html: generateBookingConfirmationEmail({
            guestName: booking.guestName || undefined,
            packageName: booking.packageName,
            travelDate: booking.travelDate,
            duration: booking.duration,
            adults: booking.adults,
            children3to5: booking.children3to5,
            children6to10: booking.children6to10,
            hotelCategory: booking.hotelCategory,
            totalPrice: booking.totalPrice,
          })
        });
      }
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the booking if email fails
    }

    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        referenceNumber: booking.referenceNumber,
        status: booking.status,
        createdAt: booking.createdAt,
        passengersCount: booking.passengers.length,
      },
    });
  } catch (error) {
    console.error('Create booking error:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}

// Get user's bookings
export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'You must be logged in to view bookings' },
        { status: 401 }
      );
    }

    const bookings = await prisma.booking.findMany({
      where: { userId: session.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        referenceNumber: true,
        packageName: true,
        travelDate: true,
        duration: true,
        hotelCategory: true,
        adults: true,
        children3to5: true,
        children6to10: true,
        totalPrice: true,
        currency: true,
        status: true,
        paymentStatus: true,
        createdAt: true,
        confirmedAt: true,
        completedAt: true,
        passengers: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            passengerType: true,
          },
        },
      },
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error('Get bookings error:', error);
    return NextResponse.json(
      { error: 'Failed to get bookings' },
      { status: 500 }
    );
  }
}
