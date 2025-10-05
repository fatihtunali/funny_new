import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const packageType = searchParams.get('type');

    const where: { isActive: boolean; packageType?: string } = { isActive: true };

    // Filter by package type if specified
    if (packageType) {
      where.packageType = packageType;
    }

    const packages = await prisma.package.findMany({
      where,
      orderBy: { packageId: 'asc' },
      select: {
        packageId: true,
        packageType: true,
        title: true,
        duration: true,
        destinations: true,
        image: true,
        description: true,
        pdfUrl: true,
        highlights: true,
        pricing: true,
      }
    });

    return NextResponse.json({ packages });
  } catch (error) {
    console.error('Fetch packages error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch packages' },
      { status: 500 }
    );
  }
}
