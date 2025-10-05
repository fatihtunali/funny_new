import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import prisma from '@/lib/prisma';

// GET all daily tours
export async function GET() {
  try {
    await requireAdmin();

    const tours = await prisma.dailyTour.findMany({
      orderBy: { createdAt: 'desc' },
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

// POST create daily tours (bulk)
export async function POST(req: NextRequest) {
  try {
    await requireAdmin();

    const { tours } = await req.json();

    if (!Array.isArray(tours) || tours.length === 0) {
      return NextResponse.json(
        { error: 'Invalid tours data' },
        { status: 400 }
      );
    }

    // Validate and sanitize tour data
    const sanitizedTours = tours.map((tour, index) => {
      // Validate required fields
      if (!tour.tourCode || !tour.title || !tour.description || !tour.duration || !tour.city) {
        throw new Error(`Tour ${index + 1} is missing required fields`);
      }

      // Parse and validate pricing
      const sicPrice = parseFloat(tour.sicPrice);
      const privateMin2 = parseFloat(tour.privateMin2);
      const privateMin4 = parseFloat(tour.privateMin4);
      const privateMin6 = parseFloat(tour.privateMin6);
      const privateMin8 = parseFloat(tour.privateMin8);
      const privateMin10 = parseFloat(tour.privateMin10);

      if (isNaN(sicPrice) || isNaN(privateMin2) || isNaN(privateMin4) ||
          isNaN(privateMin6) || isNaN(privateMin8) || isNaN(privateMin10)) {
        throw new Error(`Tour ${index + 1} (${tour.tourCode}) has invalid pricing values`);
      }

      return {
        tourCode: tour.tourCode.trim(),
        title: tour.title.trim(),
        description: tour.description.trim(),
        duration: tour.duration.trim(),
        city: tour.city.trim(),
        sicPrice,
        privateMin2,
        privateMin4,
        privateMin6,
        privateMin8,
        privateMin10,
        included: tour.included || null,
        notIncluded: tour.notIncluded || null,
        notes: tour.notes || null,
        port: tour.port || null,
        pickupLocations: tour.pickupLocations || null,
        image: tour.image || '/images/destinations/istanbul.jpg',
        pdfUrl: tour.pdfUrl || null,
      };
    });

    // Create all tours
    const createdTours = await Promise.all(
      sanitizedTours.map((tour) =>
        prisma.dailyTour.create({
          data: tour,
        })
      )
    );

    return NextResponse.json({
      success: true,
      count: createdTours.length,
      tours: createdTours,
    });
  } catch (error) {
    console.error('Error creating daily tours:', error);
    return NextResponse.json(
      {
        error: 'Failed to create daily tours',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
