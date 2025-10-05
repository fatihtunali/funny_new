import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import prisma from '@/lib/prisma';

// GET single transfer
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const transfer = await prisma.transfer.findUnique({
      where: { id },
      include: {
        fromLocation: true,
        toLocation: true,
      }
    });

    if (!transfer) {
      return NextResponse.json(
        { error: 'Transfer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ transfer });
  } catch (error) {
    console.error('Error fetching transfer:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transfer' },
      { status: 500 }
    );
  }
}

// PUT update transfer
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const data = await req.json();

    const transfer = await prisma.transfer.update({
      where: { id },
      data: {
        fromLocationId: data.fromLocationId,
        toLocationId: data.toLocationId,
        sicPricePerPerson: data.sicPricePerPerson ? parseFloat(data.sicPricePerPerson) : null,
        price1to2Pax: data.price1to2Pax ? parseFloat(data.price1to2Pax) : null,
        price3to5Pax: data.price3to5Pax ? parseFloat(data.price3to5Pax) : null,
        price6to10Pax: data.price6to10Pax ? parseFloat(data.price6to10Pax) : null,
        onRequestOnly: data.onRequestOnly || false,
        vehicleType1to2: data.vehicleType1to2,
        vehicleType3to5: data.vehicleType3to5,
        vehicleType6to10: data.vehicleType6to10,
        distance: data.distance || null,
        duration: data.duration || null,
        isActive: data.isActive,
      },
      include: {
        fromLocation: true,
        toLocation: true,
      }
    });

    return NextResponse.json({ success: true, transfer });
  } catch (error: any) {
    console.error('Error updating transfer:', error);

    // Handle unique constraint violation
    if (error.code === 'P2002') {
      return NextResponse.json(
        {
          success: false,
          error: 'A transfer route between these two locations already exists'
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update transfer',
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// DELETE transfer
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    await prisma.transfer.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting transfer:', error);
    return NextResponse.json(
      { error: 'Failed to delete transfer' },
      { status: 500 }
    );
  }
}
