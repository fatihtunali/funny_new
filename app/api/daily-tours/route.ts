import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET daily tours (public endpoint)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');

    const where = category
      ? { category, isActive: true }
      : { isActive: true };

    const tours = await prisma.dailyTour.findMany({
      where,
      orderBy: { tourCode: 'asc' },
    });

    return NextResponse.json({ tours });
  } catch (error) {
    console.error('Error fetching daily tours:', error);
    return NextResponse.json(
      { error: 'Failed to fetch daily tours' },
      { status: 500 }
    );
  }
}
