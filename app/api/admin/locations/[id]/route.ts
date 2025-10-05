import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';

// GET single location
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireAdmin();

  const { id } = await params;

  const location = await prisma.transferLocation.findUnique({
    where: { id },
  });

  if (!location) {
    return NextResponse.json(
      { success: false, error: 'Location not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({ location });
}

// PUT update location
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireAdmin();

  const { id } = await params;

  try {
    const data = await req.json();

    const location = await prisma.transferLocation.update({
      where: { id },
      data: {
        name: data.name,
        code: data.code || null,
        type: data.type,
        region: data.region,
        city: data.city || null,
        address: data.address || null,
        isActive: data.isActive,
        displayOrder: data.displayOrder || 0,
      },
    });

    return NextResponse.json({ success: true, location });
  } catch (error) {
    console.error('Error updating location:', error);
    const message = error instanceof Error ? error.message : 'Failed to update location';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

// DELETE location
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireAdmin();

  const { id } = await params;

  try {
    // Check if location is used in any transfers
    const transferCount = await prisma.transfer.count({
      where: {
        OR: [
          { fromLocationId: id },
          { toLocationId: id }
        ]
      }
    });

    if (transferCount > 0) {
      return NextResponse.json(
        { success: false, error: `Cannot delete location. It is used in ${transferCount} transfer route(s).` },
        { status: 400 }
      );
    }

    await prisma.transferLocation.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting location:', error);
    const message = error instanceof Error ? error.message : 'Failed to delete location';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
