import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET daily tours (public endpoint)
export async function GET() {
  try {
    const tours = await prisma.dailyTour.findMany({
      where: { isActive: true },
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
