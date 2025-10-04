import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const {
      email,
      password,
      companyName,
      contactName,
      phone,
      country,
      address,
      companyWebsite,
    } = await request.json();

    // Validate required fields
    if (!email || !password || !companyName || !contactName || !phone) {
      return NextResponse.json(
        { error: 'Please provide all required fields: email, password, company name, contact name, and phone' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Check if agent already exists
    const existingAgent = await prisma.agent.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingAgent) {
      return NextResponse.json(
        { error: 'An agent with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create agent with PENDING status
    const agent = await prisma.agent.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        companyName,
        contactName,
        phone,
        country: country || null,
        address: address || null,
        companyWebsite: companyWebsite || null,
        status: 'PENDING', // Requires admin approval
      },
      select: {
        id: true,
        email: true,
        companyName: true,
        contactName: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      message: 'Registration successful! Your account is pending approval. You will be notified once approved.',
      agent,
    }, { status: 201 });
  } catch (error) {
    console.error('Agent registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
