import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import prisma from '@/lib/prisma';
import { AgentStatus } from '@prisma/client';

interface Params {
  params: Promise<{
    id: string;
  }>;
}

// Get single agent with details
export async function GET(request: NextRequest, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;

    const agent = await prisma.agent.findUnique({
      where: { id },
      include: {
        _count: {
          select: { bookings: true },
        },
        bookings: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            tourDate: true,
            totalPrice: true,
            status: true,
            package: {
              select: {
                title: true,
              },
            },
          },
        },
      },
    });

    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    return NextResponse.json({ agent });
  } catch (error) {
    if (error instanceof Error && error.message?.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Get agent error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update agent status (approve, reject, suspend)
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const admin = await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const { status, commissionRate } = body;

    const updateData: {
      status?: AgentStatus;
      approvedAt?: Date;
      approvedBy?: string;
      commissionRate?: number;
    } = {};

    if (status) {
      if (!['PENDING', 'ACTIVE', 'SUSPENDED', 'REJECTED'].includes(status)) {
        return NextResponse.json(
          { error: 'Invalid status' },
          { status: 400 }
        );
      }
      updateData.status = status as AgentStatus;

      // Set approved date and admin when activating
      if (status === 'ACTIVE') {
        updateData.approvedAt = new Date();
        updateData.approvedBy = admin.adminId;
      }
    }

    if (commissionRate !== undefined) {
      if (typeof commissionRate !== 'number' || commissionRate < 0 || commissionRate > 100) {
        return NextResponse.json(
          { error: 'Invalid commission rate' },
          { status: 400 }
        );
      }
      updateData.commissionRate = commissionRate;
    }

    const agent = await prisma.agent.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      message: 'Agent updated successfully',
      agent,
    });
  } catch (error) {
    if (error instanceof Error && error.message?.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Update agent error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Delete agent
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;

    await prisma.agent.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Agent deleted successfully' });
  } catch (error) {
    if (error instanceof Error && error.message?.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Delete agent error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
