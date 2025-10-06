import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    await requireAdmin();

    // Get all leads with emails
    const leads = await prisma.agentLead.findMany({
      where: {
        AND: [
          { email: { not: null } },
          { email: { not: '' } }
        ]
      },
      orderBy: [
        { contacted: 'asc' },
        { country: 'asc' },
        { city: 'asc' }
      ],
      select: {
        id: true,
        companyName: true,
        email: true,
        phone: true,
        website: true,
        city: true,
        country: true,
        contacted: true,
        discovered: true,
        notes: true,
      }
    });

    return NextResponse.json({
      success: true,
      leads,
      total: leads.length,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to load leads';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
