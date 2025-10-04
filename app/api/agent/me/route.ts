import { NextResponse } from 'next/server';
import { getAgentFromToken } from '@/lib/agentAuth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const agent = await getAgentFromToken();

    if (!agent) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get full agent details
    const fullAgent = await prisma.agent.findUnique({
      where: { id: agent.id },
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
        logoUrl: true,
        primaryColor: true,
        companyWebsite: true,
        createdAt: true,
        approvedAt: true,
      },
    });

    if (!fullAgent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ agent: fullAgent });
  } catch (error) {
    console.error('Get agent error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
