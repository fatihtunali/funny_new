import { Metadata } from 'next';
import prisma from '@/lib/prisma';

interface Props {
  params: Promise<{ tourCode: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const tourCode = resolvedParams.tourCode.toUpperCase();

  // Fetch daily tour data from database
  const tour = await prisma.dailyTour.findFirst({
    where: {
      tourCode: tourCode,
    },
    select: {
      title: true,
      description: true,
      tourCode: true,
      duration: true,
      city: true,
      sicPrice: true,
      privateMin2: true,
      image: true,
      included: true,
      port: true,
    }
  });

  if (!tour) {
    return {
      title: 'Tour Not Found | Funny Tourism',
      description: 'The daily tour you are looking for could not be found.',
    };
  }

  // Get minimum price
  const prices = [
    tour.sicPrice,
    tour.privateMin2,
  ].filter(p => p > 0);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const priceText = minPrice > 0 ? ` - From €${minPrice}` : '';

  // Create short description
  const shortDescription = tour.description.length > 160
    ? tour.description.substring(0, 157) + '...'
    : tour.description;

  const pageUrl = `https://funnytourism.com/daily-tours/${tour.tourCode.toLowerCase()}`;
  const imageUrl = tour.image
    ? (tour.image.startsWith('http') ? tour.image : `https://funnytourism.com${tour.image}`)
    : 'https://funnytourism.com/images/IstanbulatNight.jpeg';

  return {
    title: `${tour.title} ${tour.city ? `in ${tour.city}` : ''} - ${tour.duration}${priceText} | Funny Tourism`,
    description: shortDescription,
    keywords: [
      tour.title,
      `${tour.city} daily tour`,
      `${tour.city} day tour`,
      'Turkey daily tour',
      tour.duration,
      'guided tour',
      'Turkey excursion',
      tour.port ? `${tour.port} shore excursion` : '',
    ].filter(Boolean),
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${tour.title} - ${tour.duration}${priceText}`,
      description: shortDescription,
      url: pageUrl,
      type: 'website',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: tour.title,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${tour.title} - ${tour.duration}`,
      description: shortDescription,
      images: [imageUrl],
    },
  };
}

export default function DailyTourLayout({ children }: Props) {
  return <>{children}</>;
}
