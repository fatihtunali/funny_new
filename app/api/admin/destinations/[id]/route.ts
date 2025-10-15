import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';

// GET /api/admin/destinations/[id] - Get single destination
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();

    const destination = await prisma.destination.findUnique({
      where: { id: params.id }
    });

    if (!destination) {
      return NextResponse.json(
        { error: 'Destination not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(destination);
  } catch (error) {
    console.error('Error fetching destination:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch destination';
    return NextResponse.json(
      { error: message },
      { status: message.includes('Unauthorized') ? 401 : 500 }
    );
  }
}

// PUT /api/admin/destinations/[id] - Update destination
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    // Check if destination exists
    const existing = await prisma.destination.findUnique({
      where: { id: params.id }
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Destination not found' },
        { status: 404 }
      );
    }

    // If slug is being changed, check if new slug already exists
    if (slug && slug !== existing.slug) {
      const slugExists = await prisma.destination.findUnique({
        where: { slug }
      });

      if (slugExists) {
        return NextResponse.json(
          { error: 'A destination with this slug already exists' },
          { status: 400 }
        );
      }
    }

    // Update destination
    const destination = await prisma.destination.update({
      where: { id: params.id },
      data: {
        name,
        slug,
        description,
        category,
        region,
        heroImage,
        gradient,
        attractions: typeof attractions === 'string' ? attractions : JSON.stringify(attractions),
        experiences: typeof experiences === 'string' ? experiences : JSON.stringify(experiences),
        bestTimeToVisit,
        gettingThere,
        isActive,
        displayOrder,
        metaTitle,
        metaDescription
      }
    });

    return NextResponse.json(destination);
  } catch (error) {
    console.error('Error updating destination:', error);
    const message = error instanceof Error ? error.message : 'Failed to update destination';
    return NextResponse.json(
      { error: message },
      { status: message.includes('Unauthorized') ? 401 : 500 }
    );
  }
}

// DELETE /api/admin/destinations/[id] - Delete destination
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();

    // Check if destination exists
    const existing = await prisma.destination.findUnique({
      where: { id: params.id }
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Destination not found' },
        { status: 404 }
      );
    }

    // Delete destination
    await prisma.destination.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'Destination deleted successfully' });
  } catch (error) {
    console.error('Error deleting destination:', error);
    const message = error instanceof Error ? error.message : 'Failed to delete destination';
    return NextResponse.json(
      { error: message },
      { status: message.includes('Unauthorized') ? 401 : 500 }
    );
  }
}
