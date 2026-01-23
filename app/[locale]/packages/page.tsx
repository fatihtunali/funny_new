import { prisma } from '@/lib/prisma';
import { getLocale } from 'next-intl/server';
import AllPackagesClient from '@/components/AllPackagesClient';

interface PackageData {
  id: string;
  packageId: string;
  title: string;
  slug: string;
  duration: string;
  description: string;
  destinations: string;
  image: string;
  pricing: string;
  packageType: string;
  highlights: string;
  pdfUrl: string | null;
  region?: string;
}

export default async function AllPackagesPage() {
  const locale = await getLocale();

  // Fetch all active packages from database at build/request time
  const packagesFromDb = await prisma.package.findMany({
    where: {
      isActive: true,
    },
    select: {
      id: true,
      packageId: true,
      slug: true,
      title: true,
      titleEs: true,
      duration: true,
      description: true,
      descriptionEs: true,
      destinations: true,
      region: true,
      image: true,
      pricing: true,
      packageType: true,
      highlights: true,
      highlightsEs: true,
      pdfUrl: true,
    },
    orderBy: { packageId: 'asc' },
  });

  // Transform packages with locale-specific content
  const packages = packagesFromDb.map((pkg) => ({
    id: pkg.id,
    packageId: pkg.packageId,
    slug: pkg.slug,
    title: locale === 'es' && pkg.titleEs ? pkg.titleEs : pkg.title,
    duration: pkg.duration,
    description: locale === 'es' && pkg.descriptionEs ? pkg.descriptionEs : pkg.description,
    destinations: pkg.destinations,
    region: pkg.region,
    image: pkg.image,
    pricing: pkg.pricing,
    packageType: pkg.packageType,
    highlights: locale === 'es' && pkg.highlightsEs ? pkg.highlightsEs : pkg.highlights,
    pdfUrl: pkg.pdfUrl,
  }));

  // Also fetch daily tours and add them to packages list
  const dailyToursFromDb = await prisma.dailyTour.findMany({
    where: { isActive: true },
    orderBy: { tourCode: 'asc' },
  });

  // Map daily tours to package format
  const dailyToursAsPackages = dailyToursFromDb.map(tour => ({
    id: tour.tourCode,
    packageId: tour.tourCode,
    slug: tour.tourCode.toLowerCase(),
    title: locale === 'es' && tour.titleEs ? tour.titleEs : tour.title,
    duration: tour.duration,
    description: locale === 'es' && tour.descriptionEs ? tour.descriptionEs : tour.description,
    destinations: tour.city,
    region: 'Turkey',
    image: tour.image || '/images/destinations/istanbul.jpg',
    pricing: JSON.stringify({
      sicPrice: tour.sicPrice,
      privateMin2: tour.privateMin2,
      privateMin4: tour.privateMin4,
      privateMin6: tour.privateMin6,
      privateMin8: tour.privateMin8,
      privateMin10: tour.privateMin10,
    }),
    packageType: 'DAILY_TOUR',
    highlights: locale === 'es' && tour.descriptionEs ? tour.descriptionEs : tour.description,
    pdfUrl: tour.pdfUrl,
  }));

  // Combine packages and daily tours
  const allPackages = [...packages, ...dailyToursAsPackages];

  return <AllPackagesClient packages={allPackages} />;
}
