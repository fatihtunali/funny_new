import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const locale = searchParams.get('locale') || 'en';

    // Try to find package by packageId first, then by slug
    let pkg = await prisma.package.findUnique({
      where: { packageId: id },
    });

    // If not found by packageId, try by slug
    if (!pkg) {
      pkg = await prisma.package.findUnique({
        where: { slug: id },
      });
    }

    if (!pkg) {
      return NextResponse.json(
        { error: 'Package not found' },
        { status: 404 }
      );
    }

    // Use Spanish content if locale is 'es' and Spanish content is available, otherwise fallback to English
    const title = locale === 'es' && pkg.titleEs ? pkg.titleEs : pkg.title;
    const description = locale === 'es' && pkg.descriptionEs ? pkg.descriptionEs : pkg.description;
    const highlights = locale === 'es' && pkg.highlightsEs ? pkg.highlightsEs : pkg.highlights;
    const included = locale === 'es' && pkg.includedEs ? pkg.includedEs : pkg.included;
    const notIncluded = locale === 'es' && pkg.excludedEs ? pkg.excludedEs : pkg.notIncluded;
    const itinerary = locale === 'es' && pkg.itineraryEs ? pkg.itineraryEs : pkg.itinerary;
    const hotels = locale === 'es' && pkg.hotelsEs ? pkg.hotelsEs : pkg.hotels;

    // Parse JSON fields
    const packageData = {
      ...pkg,
      title,
      description,
      highlights: highlights ? JSON.parse(highlights) : [],
      included: included ? JSON.parse(included) : [],
      notIncluded: notIncluded ? JSON.parse(notIncluded) : [],
      itinerary: itinerary ? JSON.parse(itinerary) : [],
      pricing: pkg.pricing ? JSON.parse(pkg.pricing) : {}, // Single pricing for everyone
      hotels: hotels ? JSON.parse(hotels) : {},
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
