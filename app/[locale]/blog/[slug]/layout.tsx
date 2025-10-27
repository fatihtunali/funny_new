import { Metadata } from 'next';
import prisma from '@/lib/prisma';

interface Props {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;

  // Fetch blog post data from database
  const post = await prisma.blogPost.findUnique({
    where: {
      slug: resolvedParams.slug,
    },
    select: {
      title: true,
      excerpt: true,
      slug: true,
      coverImage: true,
      category: true,
      tags: true,
      metaTitle: true,
      metaDescription: true,
      authorName: true,
      publishedAt: true,
    }
  });

  if (!post || !post.publishedAt) {
    return {
      title: 'Blog Post Not Found | Funny Tourism',
      description: 'The blog post you are looking for could not be found.',
    };
  }

  // Parse tags if they exist
  let tagsArray: string[] = [];
  try {
    if (post.tags) {
      tagsArray = typeof post.tags === 'string' ? JSON.parse(post.tags) : post.tags;
    }
  } catch {
    // Ignore parsing errors
  }

  const pageUrl = `https://funnytourism.com/blog/${post.slug}`;
  const imageUrl = post.coverImage.startsWith('http')
    ? post.coverImage
    : `https://funnytourism.com${post.coverImage}`;

  // Use custom meta title/description if available, otherwise use title/excerpt
  const metaTitle = post.metaTitle || `${post.title} | Funny Tourism Blog`;
  const metaDescription = post.metaDescription || post.excerpt;

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: [
      post.title,
      post.category,
      'Turkey travel',
      'Turkey blog',
      'travel tips',
      ...tagsArray,
    ].filter(Boolean),
    authors: [{ name: post.authorName }],
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: pageUrl,
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
      authors: [post.authorName],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [imageUrl],
    },
  };
}

export default function BlogPostLayout({ children }: Props) {
  return <>{children}</>;
}
