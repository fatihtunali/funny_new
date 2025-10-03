import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    await requireAdmin();

    // Get the latest package by packageId
    const latestPackage = await prisma.package.findFirst({
      orderBy: { packageId: 'desc' },
      select: { packageId: true }
    });

    let nextId = '01';

    if (latestPackage && latestPackage.packageId) {
      // Convert to number, increment, and pad with zeros
      const currentNum = parseInt(latestPackage.packageId, 10);
      const nextNum = currentNum + 1;
      nextId = nextNum.toString().padStart(2, '0');
    }

    return NextResponse.json({ nextId });
  } catch (error: any) {
    console.error('Next package ID error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get next package ID' },
      { status: 500 }
    );
  }
}
