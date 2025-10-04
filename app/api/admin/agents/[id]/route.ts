import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import prisma from '@/lib/prisma';

interface Params {
  params: Promise<{
    id: string;
  }>;
}

// Update agent status (approve, reject, suspend)
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const admin = await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const { status, commissionRate } = body;

    const updateData: any = {};

    if (status) {
      if (!['PENDING', 'ACTIVE', 'SUSPENDED', 'REJECTED'].includes(status)) {
        return NextResponse.json(
          { error: 'Invalid status' },
          { status: 400 }
        );
      }
      updateData.status = status;

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
  } catch (error: any) {
    if (error.message?.includes('Unauthorized')) {
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
  } catch (error: any) {
    if (error.message?.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Delete agent error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
