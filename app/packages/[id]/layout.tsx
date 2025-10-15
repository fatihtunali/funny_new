import { Metadata } from 'next';
import prisma from '@/lib/prisma';

interface Props {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}

// Helper to get min price from pricing JSON
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getMinPrice(pricing: any): number {
  try {
    if (pricing.sicPrice) return pricing.sicPrice;
    if (pricing.paxTiers) {
      const tiers = Object.keys(pricing.paxTiers).map(Number).sort((a, b) => b - a);
      for (const tier of tiers) {
        const price = pricing.paxTiers[tier]?.threestar?.double;
        if (price) return price;
      }
    }
    if (pricing.threestar?.double) return pricing.threestar.double;
    if (pricing.sixAdults) return pricing.sixAdults;
    if (pricing.fourAdults) return pricing.fourAdults;
    if (pricing.twoAdults) return pricing.twoAdults;
    if (pricing.perPerson) return pricing.perPerson;
    return 0;
  } catch {
    return 0;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;

  // Fetch package data from database
  const pkg = await prisma.package.findFirst({
    where: {
      OR: [
        { slug: resolvedParams.id },
        { packageId: resolvedParams.id }
      ]
    },
    select: {
      title: true,
      description: true,
      slug: true,
      packageId: true,
      duration: true,
      destinations: true,
      image: true,
      pricing: true,
      packageType: true,
      highlights: true,
    }
  });

  if (!pkg) {
    return {
      title: 'Package Not Found | Funny Tourism',
      description: 'The package you are looking for could not be found.',
    };
  }

  // Parse pricing to get min price
  const pricingData = typeof pkg.pricing === 'string' ? JSON.parse(pkg.pricing) : pkg.pricing;
  const minPrice = getMinPrice(pricingData);
  const priceText = minPrice > 0 ? ` - From €${minPrice}` : '';

  // Parse highlights
  let highlights = '';
  if (pkg.highlights) {
    const highlightsArray = typeof pkg.highlights === 'string'
      ? [pkg.highlights]
      : Array.isArray(pkg.highlights)
        ? pkg.highlights
        : [];
    highlights = highlightsArray.slice(0, 3).join(', ');
  }

  const pageUrl = `https://funnytourism.com/packages/${pkg.slug}`;
  const imageUrl = pkg.image.startsWith('http')
    ? pkg.image
    : `https://funnytourism.com${pkg.image}`;

  return {
    title: `${pkg.title} - ${pkg.duration}${priceText} | Funny Tourism`,
    description: `${pkg.description} ${highlights ? `Highlights: ${highlights}.` : ''} Book now!`,
    keywords: [
      pkg.title,
      'Turkey tour',
      'Turkey package',
      pkg.destinations,
      pkg.duration,
      'guided tour Turkey',
      'Turkey vacation',
      pkg.packageType === 'LAND_ONLY' ? 'land package Turkey' : 'hotel package Turkey',
    ].filter(Boolean),
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${pkg.title} - ${pkg.duration}${priceText}`,
      description: pkg.description,
      url: pageUrl,
      type: 'website',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: pkg.title,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${pkg.title} - ${pkg.duration}`,
      description: pkg.description,
      images: [imageUrl],
    },
  };
}

export default function PackageLayout({ children }: Props) {
  return <>{children}</>;
}
