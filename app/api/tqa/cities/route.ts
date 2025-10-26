import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/tqa/cities?search=ist
 * Search Turkish cities for autocomplete
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    if (search.length < 2) {
      return NextResponse.json({ cities: [] });
    }

    // Search cities from database (MySQL string search is case-insensitive by default)
    const cities = await prisma.turkishCity.findMany({
      where: {
        AND: [
          { isActive: true },
          {
            OR: [
              { name: { contains: search } },
              { displayName: { contains: search } },
            ],
          },
        ],
      },
      orderBy: [
        { popularityScore: 'desc' },
        { name: 'asc' },
      ],
      take: 10,
      select: {
        name: true,
        displayName: true,
        region: true,
        type: true,
      },
    });

    // Return in format expected by frontend (array of city names)
    const cityNames = cities.map(city => city.name);

    return NextResponse.json({ cities: cityNames });
  } catch (error) {
    console.error('Error fetching cities:', error);
    return NextResponse.json({ cities: [] }, { status: 500 });
  }
}
