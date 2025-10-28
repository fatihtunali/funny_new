import { prisma } from '@/lib/prisma';
import { getLocale } from 'next-intl/server';
import FeaturedPackagesClient from './FeaturedPackagesClient';

interface PackageData {
  packageId: string;
  slug: string;
  title: string;
  titleEs: string | null;
  duration: string;
  image: string;
  pricing: string;
  highlights: string | null;
  highlightsEs: string | null;
}

export default async function FeaturedPackages() {
  const locale = await getLocale();

  // Fetch packages from database at build/request time
  const packagesFromDb = await prisma.package.findMany({
    where: {
      isActive: true,
      packageType: 'WITH_HOTEL',
    },
    select: {
      packageId: true,
      slug: true,
      title: true,
      titleEs: true,
      duration: true,
      image: true,
      pricing: true,
      highlights: true,
      highlightsEs: true,
    },
    orderBy: { packageId: 'asc' },
    take: 3, // Take first 3 packages for featured section
  });

  // Transform to match expected format with locale-specific content
  const packages = packagesFromDb.map((pkg) => ({
    packageId: pkg.packageId,
    slug: pkg.slug,
    title: locale === 'es' && pkg.titleEs ? pkg.titleEs : pkg.title,
    duration: pkg.duration,
    image: pkg.image,
    pricing: pkg.pricing,
    highlights: locale === 'es' && pkg.highlightsEs ? pkg.highlightsEs : pkg.highlights,
  }));

  return <FeaturedPackagesClient packages={packages} />;
}
