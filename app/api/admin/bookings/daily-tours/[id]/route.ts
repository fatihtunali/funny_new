import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import prisma from '@/lib/prisma';
import { BookingStatus } from '@prisma/client';

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
    const existingBooking = await prisma.dailyTourBooking.findUnique({
      where: { id },
    });

    if (!existingBooking) {
      return NextResponse.json(
        { error: 'Daily tour booking not found' },
        { status: 404 }
      );
    }

    // Update the booking
    const updateData: {
      status: BookingStatus;
      updatedAt: Date;
      confirmedAt?: Date;
    } = {
      status: status as BookingStatus,
      updatedAt: new Date(),
    };

    // Set confirmed timestamp (DailyTourBooking doesn't have completedAt field)
    if (status === 'CONFIRMED' && !existingBooking.confirmedAt) {
      updateData.confirmedAt = new Date();
    }

    const booking = await prisma.dailyTourBooking.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        status: booking.status,
        confirmedAt: booking.confirmedAt,
      },
    });
  } catch (error) {
    console.error('Update daily tour booking error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update daily tour booking' },
      { status: 500 }
    );
  }
}
