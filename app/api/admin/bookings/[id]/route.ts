import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import prisma from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();

    const { id } = await params;
    const { status } = await request.json();

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Check if booking exists
    const existingBooking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!existingBooking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Update the booking
    const updateData: {
      status: string;
      updatedAt: Date;
      confirmedAt?: Date;
      completedAt?: Date;
    } = {
      status,
      updatedAt: new Date(),
    };

    // Set confirmed/completed timestamps
    if (status === 'CONFIRMED' && !existingBooking.confirmedAt) {
      updateData.confirmedAt = new Date();
    }

    if (status === 'COMPLETED' && !existingBooking.completedAt) {
      updateData.completedAt = new Date();
    }

    const booking = await prisma.booking.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        status: booking.status,
        confirmedAt: booking.confirmedAt,
        completedAt: booking.completedAt,
      },
    });
  } catch (error) {
    console.error('Update booking error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update booking' },
      { status: 500 }
    );
  }
}
