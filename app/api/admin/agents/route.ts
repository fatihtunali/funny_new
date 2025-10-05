import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import prisma from '@/lib/prisma';

// Get all agents (for admin review)
export async function GET() {
  try {
    await requireAdmin();

    const agents = await prisma.agent.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        companyName: true,
        contactName: true,
        phone: true,
        country: true,
        address: true,
        commissionRate: true,
        status: true,
        companyWebsite: true,
        createdAt: true,
        approvedAt: true,
        approvedBy: true,
        _count: {
          select: { bookings: true }
        }
      }
    });

    return NextResponse.json({ agents });
  } catch (error) {
    if (error instanceof Error && error.message?.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Get agents error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
