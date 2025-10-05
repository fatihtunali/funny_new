import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth/session';

// GET - Get user's wishlist
export async function GET() {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const wishlist = await prisma.wishlist.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    // Fetch package details for each wishlist item
    const packageIds = wishlist.map(w => w.packageId);
    const packages = await prisma.package.findMany({
      where: {
        packageId: { in: packageIds }
      }
    });

    const wishlistWithPackages = wishlist.map(w => ({
      ...w,
      package: packages.find(p => p.packageId === w.packageId)
    }));

    return NextResponse.json({ wishlist: wishlistWithPackages });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Add to wishlist
export async function POST(req: NextRequest) {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { packageId } = await req.json();
    if (!packageId) {
      return NextResponse.json({ error: 'Package ID is required' }, { status: 400 });
    }

    // Check if already in wishlist
    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_packageId: {
          userId: user.id,
          packageId
        }
      }
    });

    if (existing) {
      return NextResponse.json({ message: 'Already in wishlist', wishlist: existing });
    }

    const wishlist = await prisma.wishlist.create({
      data: {
        userId: user.id,
        packageId
      }
    });

    return NextResponse.json({ message: 'Added to wishlist', wishlist });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Remove from wishlist
export async function DELETE(req: NextRequest) {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const packageId = searchParams.get('packageId');

    if (!packageId) {
      return NextResponse.json({ error: 'Package ID is required' }, { status: 400 });
    }

    await prisma.wishlist.deleteMany({
      where: {
        userId: user.id,
        packageId
      }
    });

    return NextResponse.json({ message: 'Removed from wishlist' });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
