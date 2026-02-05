import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

// Generate sitemap dynamically at request time (not during build)
export const dynamic = 'force-dynamic';

const locales = ['en', 'es'] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://funnytourism.com';

  // Helper function to create localized URLs
  const createLocalizedUrls = (
    path: string,
    lastModified: Date,
    changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly',
    priority: number
  ) => {
    return locales.map((locale) => ({
      url: `${baseUrl}/${locale}${path}`,
      lastModified,
      changeFrequency,
      priority,
    }));
  };

  // Fetch all packages for dynamic URLs
  const packages = await prisma.package.findMany({
    select: {
      slug: true,
      updatedAt: true,
    },
  });

  const packageUrls = packages.flatMap((pkg) =>
    createLocalizedUrls(`/packages/${pkg.slug}`, pkg.updatedAt, 'weekly', 0.8)
  );

  // Fetch all daily tours for dynamic URLs
  const dailyTours = await prisma.dailyTour.findMany({
    select: {
      tourCode: true,
      updatedAt: true,
    },
  });

  const dailyTourUrls = dailyTours.flatMap((tour) =>
    createLocalizedUrls(`/daily-tours/${tour.tourCode.toLowerCase()}`, tour.updatedAt, 'weekly', 0.7)
  );

  // Fetch all blog posts for dynamic URLs
  const blogPosts = await prisma.blogPost.findMany({
    where: {
      publishedAt: {
        not: null
      },
    },
    select: {
      slug: true,
      updatedAt: true,
    },
  });

  const blogUrls = blogPosts.flatMap((post) =>
    createLocalizedUrls(`/blog/${post.slug}`, post.updatedAt, 'weekly', 0.6)
  );

  // Static pages with localization
  const staticPaths = [
    { path: '', priority: 1, changeFrequency: 'daily' as const },
    { path: '/packages', priority: 0.9, changeFrequency: 'daily' as const },
    { path: '/turkey-tours-from-usa', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/turkey-tours-from-uk', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/turkey-tours-from-latin-america', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/daily-tours', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/transfers', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/destinations', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/destinations/istanbul', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/destinations/cappadocia', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/destinations/ephesus', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/destinations/pamukkale', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/destinations/antalya', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/destinations/bodrum', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/destinations/fethiye', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/destinations/kusadasi', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/destinations/marmaris', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/about', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/contact', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/inquiry', priority: 0.5, changeFrequency: 'monthly' as const },
    { path: '/smart-trip-planner', priority: 0.9, changeFrequency: 'daily' as const },
    { path: '/blog', priority: 0.7, changeFrequency: 'daily' as const },
    { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/terms', priority: 0.3, changeFrequency: 'yearly' as const },
  ];

  const staticPages = staticPaths.flatMap((page) =>
    createLocalizedUrls(page.path, new Date(), page.changeFrequency, page.priority)
  );

  return [...staticPages, ...packageUrls, ...dailyTourUrls, ...blogUrls];
}
