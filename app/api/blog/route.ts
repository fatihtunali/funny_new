import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all published blog posts (public)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const limit = searchParams.get('limit');

    const where: any = { status: 'PUBLISHED' };
    if (category) {
      where.category = category;
    }

    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      take: limit ? parseInt(limit) : undefined,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        category: true,
        tags: true,
        views: true,
        publishedAt: true,
        authorName: true,
      },
    });

    // Parse tags
    const formattedPosts = posts.map((post) => ({
      ...post,
      tags: post.tags ? JSON.parse(post.tags) : [],
    }));

    return NextResponse.json({ posts: formattedPosts });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}
