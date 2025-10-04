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
    });

    return NextResponse.json({ bookings });
  } catch (error: any) {
    if (error.message?.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Get agent bookings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
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
    } = body;

    // Validate required fields
    if (!packageName || !travelDate || !duration || !hotelCategory || !totalPrice || !guestName || !guestEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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
        referenceNumber,
        status: 'PENDING',
        paymentStatus: 'PENDING',
      },
    });

    return NextResponse.json({
      message: 'Booking created successfully',
      booking,
    }, { status: 201 });
  } catch (error: any) {
    if (error.message?.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Create agent booking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
