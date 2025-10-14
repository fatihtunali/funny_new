import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Get the blog post
    const post = await prisma.blogPost.findUnique({
      where: { slug },
      select: {
        title: true,
        category: true,
        tags: true,
        excerpt: true,
      },
    });

    if (!post) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    // Parse tags
    let tags: string[] = [];
    if (post.tags) {
      try {
        tags = JSON.parse(post.tags);
      } catch (e) {
        console.error('Error parsing tags:', e);
      }
    }

    // Determine search keywords based on blog content
    const searchKeywords = [
      ...tags.map(t => t.toLowerCase()),
      post.title.toLowerCase(),
      post.category.toLowerCase(),
    ];

    // Get all active packages
    const packages = await prisma.package.findMany({
      where: { isActive: true },
      select: {
        id: true,
        packageId: true,
        slug: true,
        title: true,
        duration: true,
        destinations: true,
        image: true,
        pricing: true,
        b2bPricing: true,
        packageType: true,
      },
    });

    // Score packages based on relevance to blog post
    const scoredPackages = packages.map(pkg => {
      let score = 0;
      const pkgText = `${pkg.title} ${pkg.destinations}`.toLowerCase();

      // Check for destination matches
      if (searchKeywords.some(keyword =>
        keyword.includes('istanbul') && pkgText.includes('istanbul')
      )) score += 10;

      if (searchKeywords.some(keyword =>
        keyword.includes('cappadocia') && pkgText.includes('cappadocia')
      )) score += 10;

      if (searchKeywords.some(keyword =>
        keyword.includes('ephesus') && (pkgText.includes('ephesus') || pkgText.includes('kusadasi'))
      )) score += 10;

      if (searchKeywords.some(keyword =>
        keyword.includes('kusadasi') && pkgText.includes('kusadasi')
      )) score += 10;

      if (searchKeywords.some(keyword =>
        keyword.includes('antalya') && pkgText.includes('antalya')
      )) score += 10;

      if (searchKeywords.some(keyword =>
        keyword.includes('pamukkale') && pkgText.includes('pamukkale')
      )) score += 10;

      if (searchKeywords.some(keyword =>
        keyword.includes('troy') && pkgText.includes('troy')
      )) score += 10;

      // Category-based scoring
      if (post.category === 'Destinations' || post.category === 'Activities') {
        score += 5;
      }

      if (post.category === 'History' && (pkgText.includes('ancient') || pkgText.includes('ephesus'))) {
        score += 8;
      }

      if (post.category === 'Food' && pkgText.includes('istanbul')) {
        score += 5; // Istanbul is the culinary center
      }

      // Prefer WITH_HOTEL packages slightly
      if (pkg.packageType === 'WITH_HOTEL') {
        score += 2;
      }

      return { ...pkg, score };
    });

    // Filter packages with score > 0 and sort by score
    const relatedPackages = scoredPackages
      .filter(pkg => pkg.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3) // Return top 3
      .map(({ score, ...pkg }) => pkg); // Remove score from response

    return NextResponse.json({ packages: relatedPackages });
  } catch (error) {
    console.error('Error fetching related packages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch related packages' },
      { status: 500 }
    );
  }
}
