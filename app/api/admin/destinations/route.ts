import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';

// GET /api/admin/destinations - List all destinations
export async function GET() {
  try {
    await requireAdmin();

    const destinations = await prisma.destination.findMany({
      orderBy: [
        { displayOrder: 'asc' },
        { name: 'asc' }
      ]
    });

    return NextResponse.json(destinations);
  } catch (error) {
    console.error('Error fetching destinations:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch destinations';
    return NextResponse.json(
      { error: message },
      { status: message.includes('Unauthorized') ? 401 : 500 }
    );
  }
}

// POST /api/admin/destinations - Create new destination
export async function POST(request: Request) {
  try {
    await requireAdmin();

    const body = await request.json();
    const {
      name,
      slug,
      description,
      category,
      region,
      heroImage,
      gradient,
      attractions,
      experiences,
      bestTimeToVisit,
      gettingThere,
      isActive,
      displayOrder,
      metaTitle,
      metaDescription
    } = body;

    // Validate required fields
    if (!name || !slug || !description || !category || !region || !heroImage) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existing = await prisma.destination.findUnique({
      where: { slug }
    });

    if (existing) {
      return NextResponse.json(
        { error: 'A destination with this slug already exists' },
        { status: 400 }
      );
    }

    // Create destination
    const destination = await prisma.destination.create({
      data: {
        name,
        slug,
        description,
        category,
        region,
        heroImage,
        gradient: gradient || 'from-blue-500 to-blue-700',
        attractions: typeof attractions === 'string' ? attractions : JSON.stringify(attractions || []),
        experiences: typeof experiences === 'string' ? experiences : JSON.stringify(experiences || []),
        bestTimeToVisit,
        gettingThere,
        isActive: isActive !== undefined ? isActive : true,
        displayOrder: displayOrder || 0,
        metaTitle,
        metaDescription
      }
    });

    // Revalidate destinations pages
    revalidatePath('/destinations');
    revalidatePath(`/destinations/${destination.slug}`);

    return NextResponse.json(destination, { status: 201 });
  } catch (error) {
    console.error('Error creating destination:', error);
    const message = error instanceof Error ? error.message : 'Failed to create destination';
    return NextResponse.json(
      { error: message },
      { status: message.includes('Unauthorized') ? 401 : 500 }
    );
  }
}
