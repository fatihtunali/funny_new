import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { BlogStatus } from '@prisma/client';

// GET all published blog posts (public)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const limit = searchParams.get('limit');
    const locale = searchParams.get('locale') || 'en';

    const where: { status: BlogStatus; category?: string } = { status: BlogStatus.PUBLISHED };
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
        titleEs: true,
        slug: true,
        excerpt: true,
        excerptEs: true,
        coverImage: true,
        category: true,
        tags: true,
        views: true,
        publishedAt: true,
        authorName: true,
      },
    });

    // Parse tags and return locale-specific content
    const formattedPosts = posts.map((post) => ({
      ...post,
      title: locale === 'es' && post.titleEs ? post.titleEs : post.title,
      excerpt: locale === 'es' && post.excerptEs ? post.excerptEs : post.excerpt,
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
