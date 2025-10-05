import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin();

    const { bookingId, amount, paymentMethod, transactionRef, notes } = await request.json();

    // Validate input
    if (!bookingId || !amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid booking ID or amount' },
        { status: 400 }
      );
    }

    // Get booking details
    const booking = await prisma.dailyTourBooking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    if (!booking.agentId) {
      return NextResponse.json({ error: 'This is not an agent booking' }, { status: 400 });
    }

    // Calculate amount owed by agent (totalPrice - commission)
    const commission = booking.commissionAmount || 0;
    const amountOwed = booking.totalPrice - commission;
    const currentPaid = booking.agentPaidAmount || 0;
    const newPaidAmount = currentPaid + amount;

    // Validate payment amount doesn't exceed what's owed
    if (newPaidAmount > amountOwed) {
      return NextResponse.json(
        { error: `Payment amount exceeds what agent owes. Max: €${(amountOwed - currentPaid).toFixed(2)}` },
        { status: 400 }
      );
    }

    // Record payment in CommissionPayment table
    await prisma.commissionPayment.create({
      data: {
        agentId: booking.agentId,
        bookingType: 'DailyTour',
        bookingId: booking.id,
        amount,
        paymentMethod: paymentMethod || null,
        transactionRef: transactionRef || null,
        notes: notes || `Agent payment received: €${amount}`,
        paidBy: admin.email,
      },
    });

    // Update booking with new agent payment amount
    const isFullyPaid = newPaidAmount >= amountOwed;
    const updatedBooking = await prisma.dailyTourBooking.update({
      where: { id: bookingId },
      data: {
        agentPaidAmount: newPaidAmount,
        agentRemainingAmount: amountOwed - newPaidAmount,
        agentFullyPaidAt: isFullyPaid ? new Date() : null,
      },
    });

    return NextResponse.json({
      success: true,
      booking: updatedBooking,
      message: isFullyPaid
        ? 'Agent has paid in full!'
        : `Payment recorded. Remaining: €${(amountOwed - newPaidAmount).toFixed(2)}`,
    });
  } catch (error) {
    console.error('Error recording agent payment:', error);
    return NextResponse.json(
      { error: 'Failed to record payment' },
      { status: 500 }
    );
  }
}
