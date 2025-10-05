import { NextRequest, NextResponse } from 'next/server';
import { requireAgent } from '@/lib/agentAuth';
import prisma from '@/lib/prisma';

// Get agent's bookings
export async function GET() {
  try {
    const agent = await requireAgent();

    const bookings = await prisma.booking.findMany({
      where: { agentId: agent.id },
      orderBy: { createdAt: 'desc' },
      include: {
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
    if (error instanceof Error && error.message?.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Get agent bookings error:', error);

    // Return more detailed error for debugging
    return NextResponse.json(
      {
        error: 'Failed to fetch bookings',
        details: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined,
        hint: 'Make sure to run "npx prisma db push" to update the database schema'
      },
      { status: 500 }
    );
  }
}

// Create booking as agent (for customer)
export async function POST(request: NextRequest) {
  try {
    const agentToken = await requireAgent();
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
      // Customer details
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

    // Validate required fields
    if (!packageName || !travelDate || !duration || !hotelCategory || !totalPrice || !guestName || !guestEmail) {
      return NextResponse.json(
        { error: 'Missing required booking fields' },
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

    // Get full agent data to access commission rate
    const agent = await prisma.agent.findUnique({
      where: { id: agentToken.id },
      select: { commissionRate: true },
    });

    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    // Calculate commission
    const commissionAmount = (totalPrice * agent.commissionRate) / 100;

    // Generate unique reference number
    const referenceNumber = `AG-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const booking = await prisma.booking.create({
      data: {
        agentId: agentToken.id,
        packageName,
        packageId: packageId || null,
        travelDate: new Date(travelDate),
        duration,
        hotelCategory,
        adults: adults || 2,
        children3to5: children3to5 || 0,
        children6to10: children6to10 || 0,
        totalPrice,
        currency: currency || 'EUR',
        commissionAmount,
        commissionRate: agent.commissionRate,
        specialRequests: specialRequests || null,
        guestName,
        guestEmail,
        guestPhone: guestPhone || null,
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
        referenceNumber,
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

    return NextResponse.json({
      message: 'Booking created successfully',
      booking,
    }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message?.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Create agent booking error:', error);

    // Return more detailed error for debugging
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
