import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const region = searchParams.get('region');

    const where: any = { isActive: true };

    if (region) {
      where.region = region;
    }

    const transfers = await prisma.transfer.findMany({
      where,
      orderBy: [
        { region: 'asc' },
        { fromLocation: 'asc' },
      ],
    });

    // Get unique regions for filter
    const regions = await prisma.transfer.findMany({
      where: { isActive: true },
      select: { region: true },
      distinct: ['region'],
      orderBy: { region: 'asc' },
    });

    return NextResponse.json({
      transfers,
      regions: regions.map(r => r.region),
    });
  } catch (error) {
    console.error('Error fetching transfers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transfers' },
      { status: 500 }
    );
  }
}
