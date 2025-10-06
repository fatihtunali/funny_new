import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://funnytourism.com';

  // Fetch all packages for dynamic URLs
  const packages = await prisma.package.findMany({
    select: {
      packageId: true,
      updatedAt: true,
    },
  });

  const packageUrls = packages.map((pkg) => ({
    url: `${baseUrl}/packages/${pkg.packageId}`,
    lastModified: pkg.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Fetch all daily tours for dynamic URLs
  const dailyTours = await prisma.dailyTour.findMany({
    select: {
      tourCode: true,
      updatedAt: true,
    },
  });

  const dailyTourUrls = dailyTours.map((tour) => ({
    url: `${baseUrl}/daily-tours/${tour.tourCode.toLowerCase()}`,
    lastModified: tour.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/packages`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/daily-tours`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/transfers`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/destinations`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/destinations/istanbul`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/destinations/cappadocia`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/destinations/ephesus`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/destinations/pamukkale`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/destinations/antalya`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/destinations/bodrum`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/destinations/fethiye`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/destinations/marmaris`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/inquiry`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ];

  return [...staticPages, ...packageUrls, ...dailyTourUrls];
}
