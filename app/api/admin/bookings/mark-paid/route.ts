import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin();

    const { bookingId, amount, paymentMethod, transactionRef, notes } = await request.json();

    if (!bookingId || !amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Booking ID and valid amount are required' },
        { status: 400 }
      );
    }

    // Get booking details
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { agent: true },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    if (!booking.agentId || !booking.commissionAmount) {
      return NextResponse.json({ error: 'Not an agent booking' }, { status: 400 });
    }

    const currentPaid = booking.paidAmount || 0;
    const newPaidAmount = currentPaid + amount;

    if (newPaidAmount > booking.commissionAmount) {
      return NextResponse.json(
        { error: `Payment amount exceeds remaining commission (€${(booking.commissionAmount - currentPaid).toFixed(2)})` },
        { status: 400 }
      );
    }

    // Create payment record
    await prisma.commissionPayment.create({
      data: {
        agentId: booking.agentId,
        bookingType: 'Package',
        bookingId: booking.id,
        referenceNumber: booking.referenceNumber,
        amount,
        paymentMethod,
        transactionRef,
        notes,
        paidBy: admin.email,
      },
    });

    // Update booking
    const isFullyPaid = newPaidAmount >= booking.commissionAmount;
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        paidAmount: newPaidAmount,
        remainingAmount: booking.commissionAmount - newPaidAmount,
        fullyPaidAt: isFullyPaid ? new Date() : null,
      },
    });

    return NextResponse.json({
      success: true,
      booking: updatedBooking,
      isFullyPaid,
    });
  } catch (error) {
    console.error('Error marking booking as paid:', error);
    return NextResponse.json(
      { error: 'Failed to mark as paid' },
      { status: 500 }
    );
  }
}
