import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      transferId,
      guestName,
      guestEmail,
      guestPhone,
      transferDate,
      transferTime,
      numberOfPassengers,
      flightNumber,
      totalPrice,
      vehicleType,
      specialRequests,
      numberOfLuggage,
    } = body;

    // Validate required fields
    if (!transferId || !guestName || !guestEmail || !guestPhone || !transferDate || !transferTime || !numberOfPassengers || !totalPrice || !vehicleType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate reference number
    const referenceNumber = `TRF-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // Create booking
    const booking = await prisma.transferBooking.create({
      data: {
        transferId,
        guestName,
        guestEmail,
        guestPhone,
        transferDate: new Date(transferDate),
        transferTime,
        numberOfPassengers: parseInt(numberOfPassengers),
        flightNumber: flightNumber || null,
        totalPrice: parseFloat(totalPrice),
        vehicleType,
        specialRequests: specialRequests || null,
        numberOfLuggage: numberOfLuggage ? parseInt(numberOfLuggage) : null,
        referenceNumber,
        status: 'PENDING',
        paymentStatus: 'PENDING',
      },
      include: {
        transfer: true,
      },
    });

    return NextResponse.json({
      success: true,
      booking,
      referenceNumber,
    });
  } catch (error) {
    console.error('Error creating transfer booking:', error);
    return NextResponse.json(
      {
        error: 'Failed to create booking',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
