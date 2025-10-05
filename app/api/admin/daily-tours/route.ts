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

    // Create all tours
    const createdTours = await Promise.all(
      tours.map((tour) =>
        prisma.dailyTour.create({
          data: {
            tourCode: tour.tourCode,
            title: tour.title,
            description: tour.description,
            duration: tour.duration,
            city: tour.city,
            category: tour.category || 'DAILY_TOUR',
            sicPrice: parseFloat(tour.sicPrice),
            privateMin2: parseFloat(tour.privateMin2),
            privateMin4: parseFloat(tour.privateMin4),
            privateMin6: parseFloat(tour.privateMin6),
            privateMin8: parseFloat(tour.privateMin8),
            privateMin10: parseFloat(tour.privateMin10),
            included: tour.included || null,
            notIncluded: tour.notIncluded || null,
            notes: tour.notes || null,
            port: tour.port || null,
            pickupLocations: tour.pickupLocations || null,
            image: tour.image || '/images/destinations/istanbul.jpg',
            pdfUrl: tour.pdfUrl || null,
          },
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
