import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';

// GET all transfer locations
export async function GET(req: NextRequest) {
  await requireAdmin();

  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');
  const region = searchParams.get('region');

  const where: Record<string, string> = {};
  if (type) where.type = type;
  if (region) where.region = region;

  const locations = await prisma.transferLocation.findMany({
    where,
    orderBy: [
      { displayOrder: 'asc' },
      { name: 'asc' }
    ],
  });

  // Get unique regions for filter
  const regions = await prisma.transferLocation.findMany({
    select: { region: true },
    distinct: ['region'],
    orderBy: { region: 'asc' }
  });

  return NextResponse.json({
    locations,
    regions: regions.map(r => r.region)
  });
}

// POST create new location
export async function POST(req: NextRequest) {
  await requireAdmin();

  try {
    const data = await req.json();

    const location = await prisma.transferLocation.create({
      data: {
        name: data.name,
        code: data.code || null,
        type: data.type,
        region: data.region,
        city: data.city || null,
        address: data.address || null,
        isActive: data.isActive !== undefined ? data.isActive : true,
        displayOrder: data.displayOrder || 0,
      },
    });

    return NextResponse.json({ success: true, location });
  } catch (error) {
    console.error('Error creating location:', error);
    const message = error instanceof Error ? error.message : 'Failed to create location';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
