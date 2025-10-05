import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fromLocationId = searchParams.get('fromLocationId');
    const toLocationId = searchParams.get('toLocationId');
    const region = searchParams.get('region');
    const search = searchParams.get('search');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { isActive: true };

    // Support bidirectional route matching
    if (fromLocationId && toLocationId) {
      where.OR = [
        { fromLocationId: fromLocationId, toLocationId: toLocationId },
        { fromLocationId: toLocationId, toLocationId: fromLocationId }
      ];
    } else if (fromLocationId) {
      where.OR = [
        { fromLocationId: fromLocationId },
        { toLocationId: fromLocationId }
      ];
    } else if (toLocationId) {
      where.OR = [
        { toLocationId: toLocationId },
        { fromLocationId: toLocationId }
      ];
    }

    if (region) {
      where.fromLocation = {
        region: region
      };
    }

    // Search by location name or code
    if (search) {
      where.OR = [
        { fromLocation: { name: { contains: search } } },
        { toLocation: { name: { contains: search } } },
        { fromLocation: { code: { contains: search } } },
        { toLocation: { code: { contains: search } } },
      ];
    }

    const transfers = await prisma.transfer.findMany({
      where,
      include: {
        fromLocation: true,
        toLocation: true,
      },
      orderBy: [
        { fromLocation: { region: 'asc' } },
        { fromLocation: { name: 'asc' } },
      ],
    });

    // Get unique regions
    const regions = await prisma.transferLocation.findMany({
      where: { isActive: true },
      select: { region: true },
      distinct: ['region'],
      orderBy: { region: 'asc' },
    });

    // Get all locations for filters
    const locations = await prisma.transferLocation.findMany({
      where: { isActive: true },
      orderBy: [
        { displayOrder: 'asc' },
        { name: 'asc' }
      ],
    });

    return NextResponse.json({
      transfers,
      regions: regions.map(r => r.region),
      locations,
    });
  } catch (error) {
    console.error('Error fetching transfers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transfers' },
      { status: 500 }
    );
  }
}
