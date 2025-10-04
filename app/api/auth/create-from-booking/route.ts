import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

export async function POST(request: NextRequest) {
  try {
    const { referenceNumber, password } = await request.json();

    if (!referenceNumber || !password) {
      return NextResponse.json(
        { error: 'Reference number and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Find the booking by reference number
    const booking = await prisma.booking.findUnique({
      where: { referenceNumber },
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Check if this booking already has a user account
    if (booking.userId) {
      return NextResponse.json(
        { error: 'This booking is already linked to an account' },
        { status: 400 }
      );
    }

    // Check if booking has guest details
    if (!booking.guestEmail || !booking.guestName) {
      return NextResponse.json(
        { error: 'Guest information not found in booking' },
        { status: 400 }
      );
    }

    // Check if user with this email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: booking.guestEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists. Please login instead.' },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user account
    const user = await prisma.user.create({
      data: {
        email: booking.guestEmail,
        name: booking.guestName,
        phone: booking.guestPhone || undefined,
        password: hashedPassword,
      },
    });

    // Link the booking to the new user account
    await prisma.booking.update({
      where: { id: booking.id },
      data: { userId: user.id },
    });

    // Create JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set the cookie
    (await cookies()).set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Create account from booking error:', error);
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}
