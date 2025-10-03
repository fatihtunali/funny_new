import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();

    const data = await req.json();

    // Check if packageId already exists
    const existingById = await prisma.package.findUnique({
      where: { packageId: data.packageId }
    });

    if (existingById) {
      return NextResponse.json(
        { error: 'Package ID already exists' },
        { status: 400 }
      );
    }

    // Auto-increment slug if it exists
    let finalSlug = data.slug;
    let slugCounter = 1;

    while (true) {
      const existingBySlug = await prisma.package.findUnique({
        where: { slug: finalSlug }
      });

      if (!existingBySlug) {
        break;
      }

      slugCounter++;
      finalSlug = `${data.slug}-${slugCounter}`;
    }

    const package_ = await prisma.package.create({
      data: {
        packageId: data.packageId,
        title: data.title,
        slug: finalSlug,
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
    console.error('Create package error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
