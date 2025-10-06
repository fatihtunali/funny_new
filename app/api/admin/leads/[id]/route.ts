import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();

    const { id } = await params;

    // Delete the lead
    await prisma.agentLead.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Lead deleted successfully',
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete lead';
    console.error('Delete lead error:', error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
