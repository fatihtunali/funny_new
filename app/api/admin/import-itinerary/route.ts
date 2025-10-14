import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import prisma from '@/lib/prisma';
import { generateSlug } from '@/lib/slugify';

/**
 * API endpoint to import itineraries from Ruzgar Gucu AI system
 * POST /api/admin/import-itinerary
 *
 * Expected JSON body format:
 * {
 *   "packageId": "string",
 *   "packageType": "WITH_HOTEL" | "LAND_ONLY" | "SHORE_EXCURSION",
 *   "title": "string",
 *   "slug": "string",
 *   "duration": "string",
 *   "description": "string",
 *   "destinations": "string",
 *   "image": "string",
 *   "highlights": ["string"],
 *   "included": ["string"],
 *   "notIncluded": ["string"],
 *   "itinerary": [{"day": number, "title": "string", "description": "string", "meals": "string"}],
 *   "pricing": object,
 *   "hotels": object (optional),
 *   "port": "string" (optional, for shore excursions),
 *   "pickupType": "string" (optional, for shore excursions)
 * }
 */

export async function POST(req: NextRequest) {
  try {
    // Check admin authentication
    await requireAdmin();

    const body = await req.json();

    // Validate required fields (slug is now optional, will be auto-generated)
    const requiredFields = ['packageId', 'packageType', 'title', 'duration', 'description', 'destinations'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Auto-generate slug from title if not provided (SEO-friendly)
    const slug = body.slug || generateSlug(body.title);

    // Check if package with this slug already exists
    const existingPackage = await prisma.package.findUnique({
      where: { slug }
    });

    if (existingPackage) {
      return NextResponse.json(
        {
          error: 'Package with this slug already exists',
          existingPackage: {
            id: existingPackage.id,
            packageId: existingPackage.packageId,
            title: existingPackage.title,
            slug: existingPackage.slug
          }
        },
        { status: 409 } // Conflict
      );
    }

    // Prepare package data
    const packageData = {
      packageId: body.packageId,
      packageType: body.packageType,
      title: body.title,
      slug: slug, // Use auto-generated or provided slug
      duration: body.duration,
      description: body.description,
      destinations: body.destinations,
      image: body.image || '/images/hotelwithpackage.jpg',
      pdfUrl: body.pdfUrl || null,
      isActive: body.isActive !== undefined ? body.isActive : true,
      port: body.port || null,
      pickupType: body.pickupType || null,
      highlights: JSON.stringify(body.highlights || []),
      included: JSON.stringify(body.included || []),
      notIncluded: JSON.stringify(body.notIncluded || []),
      itinerary: JSON.stringify(body.itinerary || []),
      pricing: JSON.stringify(body.pricing || {}),
      hotels: body.hotels ? JSON.stringify(body.hotels) : null,
    };

    // Create package in database
    const newPackage = await prisma.package.create({
      data: packageData
    });

    return NextResponse.json({
      success: true,
      message: 'Itinerary imported successfully',
      package: {
        id: newPackage.id,
        packageId: newPackage.packageId,
        title: newPackage.title,
        slug: newPackage.slug,
        url: `https://www.funnytourism.com/packages/${newPackage.packageId}`
      }
    });

  } catch (error) {
    console.error('Import itinerary error:', error);
    return NextResponse.json(
      {
        error: 'Failed to import itinerary',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to check if a slug is available
 * GET /api/admin/import-itinerary?slug=example-tour
 */
export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug parameter is required' },
        { status: 400 }
      );
    }

    const existingPackage = await prisma.package.findUnique({
      where: { slug }
    });

    return NextResponse.json({
      available: !existingPackage,
      exists: !!existingPackage,
      package: existingPackage ? {
        id: existingPackage.id,
        title: existingPackage.title,
        slug: existingPackage.slug
      } : null
    });

  } catch (error) {
    console.error('Check slug error:', error);
    return NextResponse.json(
      { error: 'Failed to check slug availability' },
      { status: 500 }
    );
  }
}
