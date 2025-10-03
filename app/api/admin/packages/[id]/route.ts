import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const data = await req.json();

    const package_ = await prisma.package.update({
      where: { id },
      data: {
        packageId: data.packageId,
        title: data.title,
        slug: data.slug,
        duration: data.duration,
        description: data.description,
        destinations: data.destinations,
        image: data.image,
        pdfUrl: data.pdfUrl || null,
        isActive: data.isActive,
        highlights: data.highlights,
        included: data.included,
        notIncluded: data.notIncluded,
        itinerary: data.itinerary,
        pricing: data.pricing,
        hotels: data.hotels,
      },
    });

    return NextResponse.json({ success: true, package: package_ });
  } catch (error: any) {
    console.error('Update package error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    await prisma.package.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete package error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
