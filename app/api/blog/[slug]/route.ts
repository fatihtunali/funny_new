import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET single blog post by slug (public)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const post = await prisma.blogPost.findUnique({
      where: { slug, status: 'PUBLISHED' },
    });

    if (!post) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    // Increment view count
    await prisma.blogPost.update({
      where: { id: post.id },
      data: { views: { increment: 1 } },
    });

    // Parse tags
    const formattedPost = {
      ...post,
      tags: post.tags ? JSON.parse(post.tags) : [],
    };

    return NextResponse.json({ post: formattedPost });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}
