import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';

// GET single blog post
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const post = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch blog post' },
      { status: error instanceof Error && error.message?.includes('Unauthorized') ? 401 : 500 }
    );
  }
}

// PUT - Update blog post
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await req.json();

    const {
      title,
      excerpt,
      content,
      coverImage,
      category,
      tags,
      status,
      metaTitle,
      metaDescription,
    } = body;

    // Generate new slug if title changed
    const slug = title
      ? title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      : undefined;

    const updateData: {
      title?: string;
      slug?: string;
      excerpt?: string;
      content?: string;
      coverImage?: string | null;
      category?: string;
      tags?: string;
      metaTitle?: string;
      metaDescription?: string;
      status?: string;
      publishedAt?: Date;
    } = {
      ...(title && { title }),
      ...(slug && { slug }),
      ...(excerpt && { excerpt }),
      ...(content && { content }),
      ...(coverImage !== undefined && { coverImage }),
      ...(category && { category }),
      ...(tags && { tags: JSON.stringify(tags) }),
      ...(metaTitle && { metaTitle }),
      ...(metaDescription && { metaDescription }),
    };

    console.log('Updating blog post with data:', updateData);

    // Handle status change
    if (status) {
      updateData.status = status;
      if (status === 'PUBLISHED') {
        const existingPost = await prisma.blogPost.findUnique({
          where: { id },
          select: { publishedAt: true },
        });
        if (!existingPost?.publishedAt) {
          updateData.publishedAt = new Date();
        }
      }
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ post });
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update blog post' },
      { status: error instanceof Error && error.message?.includes('Unauthorized') ? 401 : 500 }
    );
  }
}

// DELETE blog post
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    await prisma.blogPost.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete blog post' },
      { status: error instanceof Error && error.message?.includes('Unauthorized') ? 401 : 500 }
    );
  }
}
