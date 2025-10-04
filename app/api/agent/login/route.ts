import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find agent by email
    const agent = await prisma.agent.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!agent) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if agent is active
    if (agent.status !== 'ACTIVE') {
      let message = 'Your account is not active';
      if (agent.status === 'PENDING') {
        message = 'Your account is pending approval. Please wait for admin approval.';
      } else if (agent.status === 'SUSPENDED') {
        message = 'Your account has been suspended. Please contact support.';
      } else if (agent.status === 'REJECTED') {
        message = 'Your account application was rejected. Please contact support.';
      }
      return NextResponse.json({ error: message }, { status: 403 });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, agent.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = jwt.sign(
      {
        id: agent.id,
        email: agent.email,
        companyName: agent.companyName,
        status: agent.status,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('agent-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return NextResponse.json({
      message: 'Login successful',
      agent: {
        id: agent.id,
        email: agent.email,
        companyName: agent.companyName,
        contactName: agent.contactName,
        status: agent.status,
        commissionRate: agent.commissionRate,
      },
    });
  } catch (error) {
    console.error('Agent login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
