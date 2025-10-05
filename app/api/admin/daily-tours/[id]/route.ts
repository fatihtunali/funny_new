import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import prisma from '@/lib/prisma';

// GET single daily tour
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await context.params;

    const tour = await prisma.dailyTour.findUnique({
      where: { id },
    });

    if (!tour) {
      return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
    }

    return NextResponse.json({ tour });
  } catch (error) {
    console.error('Error fetching daily tour:', error);
    return NextResponse.json(
      { error: 'Failed to fetch daily tour' },
      { status: 500 }
    );
  }
}

// PUT update daily tour
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await context.params;
    const data = await req.json();

    const updatedTour = await prisma.dailyTour.update({
      where: { id },
      data: {
        tourCode: data.tourCode,
        title: data.title,
        description: data.description,
        duration: data.duration,
        city: data.city,
        sicPrice: parseFloat(data.sicPrice),
        privateMin2: parseFloat(data.privateMin2),
        privateMin4: parseFloat(data.privateMin4),
        privateMin6: parseFloat(data.privateMin6),
        privateMin8: parseFloat(data.privateMin8),
        privateMin10: parseFloat(data.privateMin10),
        included: data.included || null,
        notIncluded: data.notIncluded || null,
        notes: data.notes || null,
        port: data.port || null,
        pickupLocations: data.pickupLocations || null,
        isActive: data.isActive,
      },
    });

    return NextResponse.json({
      success: true,
      tour: updatedTour,
    });
  } catch (error) {
    console.error('Error updating daily tour:', error);
    return NextResponse.json(
      {
        error: 'Failed to update daily tour',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// DELETE daily tour
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await context.params;

    await prisma.dailyTour.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Tour deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting daily tour:', error);
    return NextResponse.json(
      {
        error: 'Failed to delete daily tour',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
