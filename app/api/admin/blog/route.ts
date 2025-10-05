import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';
import { BlogStatus } from '@prisma/client';

// GET all blog posts (admin)
export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const where = status ? { status: status as BlogStatus } : {};

    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        category: true,
        status: true,
        isAIGenerated: true,
        views: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch blog posts' },
      { status: error instanceof Error && error.message?.includes('Unauthorized') ? 401 : 500 }
    );
  }
}

// POST - Create new blog post
export async function POST(req: NextRequest) {
  try {
    await requireAdmin();

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
      isAIGenerated,
      aiPrompt,
    } = body;

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImage,
        category,
        tags: tags ? JSON.stringify(tags) : null,
        status: status || 'DRAFT',
        metaTitle: metaTitle || title,
        metaDescription: metaDescription || excerpt,
        isAIGenerated: isAIGenerated || false,
        aiPrompt,
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
      },
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create blog post' },
      { status: error instanceof Error && error.message?.includes('Unauthorized') ? 401 : 500 }
    );
  }
}
