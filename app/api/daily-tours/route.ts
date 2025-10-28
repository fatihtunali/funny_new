import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

// GET daily tours (public endpoint)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';
    const tourCode = searchParams.get('tourCode');

    const tours = await prisma.dailyTour.findMany({
      where: {
        isActive: true,
        ...(tourCode && { tourCode })
      },
      orderBy: { tourCode: 'asc' },
    });

    // Map tours to include locale-specific content
    const localizedTours = tours.map(tour => {
      if (locale === 'es') {
        return {
          ...tour,
          title: tour.titleEs || tour.title,
          description: tour.descriptionEs || tour.description,
          included: tour.includedEs || tour.included,
          notIncluded: tour.excludedEs || tour.notIncluded,
          notes: tour.notesEs || tour.notes,
        };
      }
      return tour;
    });

    return NextResponse.json({ tours: localizedTours });
  } catch (error) {
    console.error('Error fetching daily tours:', error);
    return NextResponse.json(
      { error: 'Failed to fetch daily tours' },
      { status: 500 }
    );
  }
}
