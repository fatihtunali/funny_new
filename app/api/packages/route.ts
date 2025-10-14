import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const packageType = searchParams.get('type');
    const includeDailyTours = searchParams.get('includeDailyTours') !== 'false';

    const where: { isActive: boolean; packageType?: string } = { isActive: true };

    // Filter by package type if specified
    if (packageType) {
      where.packageType = packageType;
    }

    const packages = await prisma.package.findMany({
      where,
      orderBy: { packageId: 'asc' },
      select: {
        packageId: true,
        slug: true,
        packageType: true,
        title: true,
        duration: true,
        destinations: true,
        image: true,
        description: true,
        pdfUrl: true,
        highlights: true,
        pricing: true,
      }
    });

    // Fetch daily tours if included
    let allPackages = packages.map(pkg => ({
      ...pkg,
      id: pkg.packageId,
    }));

    if (includeDailyTours) {
      const dailyTours = await prisma.dailyTour.findMany({
        where: { isActive: true },
        orderBy: { tourCode: 'asc' },
      });

      // Map daily tours to package format - all daily tours use packageType: 'DAILY_TOUR'
      const dailyToursAsPackages = dailyTours.map(tour => ({
        id: tour.tourCode,
        packageId: tour.tourCode,
        packageType: 'DAILY_TOUR',
        title: tour.title,
        duration: tour.duration,
        destinations: tour.city,
        image: tour.image || '/images/destinations/istanbul.jpg',
        description: tour.description,
        pdfUrl: tour.pdfUrl,
        highlights: tour.description,
        pricing: JSON.stringify({
          sicPrice: tour.sicPrice,
          privateMin2: tour.privateMin2,
          privateMin4: tour.privateMin4,
          privateMin6: tour.privateMin6,
          privateMin8: tour.privateMin8,
          privateMin10: tour.privateMin10,
        }),
        slug: tour.tourCode.toLowerCase(),
      }));

      allPackages = [...allPackages, ...dailyToursAsPackages];
    }

    return NextResponse.json({ packages: allPackages });
  } catch (error) {
    console.error('Fetch packages error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch packages' },
      { status: 500 }
    );
  }
}
