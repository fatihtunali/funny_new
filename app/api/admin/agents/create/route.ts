import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin();
    const body = await request.json();

    const {
      email,
      password,
      companyName,
      contactName,
      phone,
      country,
      address,
      companyWebsite,
      commissionRate,
      status,
    } = body;

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

    // Validate status
    if (status && !['PENDING', 'ACTIVE', 'SUSPENDED', 'REJECTED'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Validate commission rate
    if (commissionRate !== undefined && (typeof commissionRate !== 'number' || commissionRate < 0 || commissionRate > 100)) {
      return NextResponse.json(
        { error: 'Commission rate must be between 0 and 100' },
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

    // Create agent
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
        commissionRate: commissionRate || 10.0,
        status: status || 'ACTIVE',
        approvedAt: (status === 'ACTIVE' || !status) ? new Date() : null,
        approvedBy: (status === 'ACTIVE' || !status) ? admin.adminId : null,
      },
    });

    return NextResponse.json({
      message: 'Agent created successfully',
      agent: {
        id: agent.id,
        email: agent.email,
        companyName: agent.companyName,
        contactName: agent.contactName,
        status: agent.status,
        commissionRate: agent.commissionRate,
      },
    }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message?.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Create agent error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
