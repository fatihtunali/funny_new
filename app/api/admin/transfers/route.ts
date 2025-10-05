import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import prisma from '@/lib/prisma';

// GET all transfers
export async function GET() {
  try {
    await requireAdmin();

    const transfers = await prisma.transfer.findMany({
      include: {
        fromLocation: true,
        toLocation: true,
        _count: {
          select: { bookings: true }
        }
      },
      orderBy: [
        { fromLocation: { region: 'asc' } },
        { fromLocation: { name: 'asc' } },
      ],
    });

    return NextResponse.json({ transfers });
  } catch (error) {
    console.error('Error fetching transfers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transfers' },
      { status: 500 }
    );
  }
}

// POST create transfer
export async function POST(req: NextRequest) {
  try {
    await requireAdmin();

    const data = await req.json();

    const transfer = await prisma.transfer.create({
      data: {
        fromLocationId: data.fromLocationId,
        toLocationId: data.toLocationId,
        sicPricePerPerson: data.sicPricePerPerson ? parseFloat(data.sicPricePerPerson) : null,
        price1to2Pax: data.price1to2Pax ? parseFloat(data.price1to2Pax) : null,
        price3to5Pax: data.price3to5Pax ? parseFloat(data.price3to5Pax) : null,
        price6to10Pax: data.price6to10Pax ? parseFloat(data.price6to10Pax) : null,
        onRequestOnly: data.onRequestOnly || false,
        vehicleType1to2: data.vehicleType1to2 || 'Sedan',
        vehicleType3to5: data.vehicleType3to5 || 'Minivan (Transporter)',
        vehicleType6to10: data.vehicleType6to10 || 'Minibus (Sprinter)',
        distance: data.distance || null,
        duration: data.duration || null,
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
      include: {
        fromLocation: true,
        toLocation: true,
      }
    });

    return NextResponse.json({ success: true, transfer });
  } catch (error) {
    console.error('Error creating transfer:', error);

    // Handle unique constraint violation
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json(
        {
          success: false,
          error: 'A transfer route between these two locations already exists'
        },
        { status: 400 }
      );
    }

    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create transfer',
        details: message
      },
      { status: 500 }
    );
  }
}
