import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const packageType = searchParams.get('type');

    const where: any = { isActive: true };

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
      }
    });

    return NextResponse.json({ packages });
  } catch (error: any) {
    console.error('Fetch packages error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch packages' },
      { status: 500 }
    );
  }
}
