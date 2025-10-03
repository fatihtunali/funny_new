import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import prisma from '@/lib/prisma';

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

    if (!session) {
      return NextResponse.json(
        { error: 'You must be logged in to create a booking' },
        { status: 401 }
      );
    }

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
    } = body;

    // Validation
    if (!packageName || !travelDate || !hotelCategory || !totalPrice) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId: session.id,
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
        referenceNumber: generateReferenceNumber(),
        status: 'PENDING',
        paymentStatus: 'PENDING',
      },
    });

    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        referenceNumber: booking.referenceNumber,
        status: booking.status,
        createdAt: booking.createdAt,
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
