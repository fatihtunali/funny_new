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
      image: true,
      pricing: true,
      packageType: true,
      highlights: true,
      highlightsEs: true,
      pdfUrl: true,
    },
    orderBy: { packageId: 'asc' },
  });

  // Transform to match expected format with locale-specific content
  const packages = packagesFromDb.map((pkg) => ({
    id: pkg.id,
    packageId: pkg.packageId,
    slug: pkg.slug,
    title: locale === 'es' && pkg.titleEs ? pkg.titleEs : pkg.title,
    duration: pkg.duration,
    description: locale === 'es' && pkg.descriptionEs ? pkg.descriptionEs : pkg.description,
    destinations: pkg.destinations,
    image: pkg.image,
    pricing: pkg.pricing,
    packageType: pkg.packageType,
    highlights: locale === 'es' && pkg.highlightsEs ? pkg.highlightsEs : pkg.highlights,
    pdfUrl: pkg.pdfUrl,
  }));

  return <AllPackagesClient packages={packages} />;
}
