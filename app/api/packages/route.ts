import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const packages = await prisma.package.findMany({
      where: { isActive: true },
      orderBy: { packageId: 'asc' },
      select: {
        packageId: true,
        title: true,
        duration: true,
        destinations: true,
        image: true,
        description: true,
        pdfUrl: true,
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
