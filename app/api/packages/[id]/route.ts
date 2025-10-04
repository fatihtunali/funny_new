import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const packageId = id;

    const pkg = await prisma.package.findUnique({
      where: { packageId: packageId },
    });

    if (!pkg) {
      return NextResponse.json(
        { error: 'Package not found' },
        { status: 404 }
      );
    }

    // Parse JSON fields
    const packageData = {
      ...pkg,
      highlights: pkg.highlights ? JSON.parse(pkg.highlights) : [],
      included: pkg.included ? JSON.parse(pkg.included) : [],
      notIncluded: pkg.notIncluded ? JSON.parse(pkg.notIncluded) : [],
      itinerary: pkg.itinerary ? JSON.parse(pkg.itinerary) : [],
      pricing: pkg.pricing ? JSON.parse(pkg.pricing) : {},
      hotels: pkg.hotels ? JSON.parse(pkg.hotels) : {},
      destinations: pkg.destinations ? pkg.destinations.split(',').map(d => d.trim()) : [],
    };

    return NextResponse.json({ package: packageData });
  } catch (error) {
    console.error('Error fetching package:', error);
    return NextResponse.json(
      { error: 'Failed to fetch package' },
      { status: 500 }
    );
  }
}
