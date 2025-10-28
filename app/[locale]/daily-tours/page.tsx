import { prisma } from '@/lib/prisma';
import { getLocale } from 'next-intl/server';
import DailyToursClient from '@/components/DailyToursClient';

interface DailyTourData {
  id: string;
  tourCode: string;
  title: string;
  description: string;
  duration: string;
  city: string;
  sicPrice: number;
  image: string | null;
}

export default async function DailyToursPage() {
  const locale = await getLocale();

  // Fetch daily tours from database at build/request time
  const toursFromDb = await prisma.package.findMany({
    where: {
      packageType: 'DAILY_TOUR',
      isActive: true,
    },
    select: {
      id: true,
      packageId: true,
      title: true,
      titleEs: true,
      description: true,
      descriptionEs: true,
      duration: true,
      destinations: true,
      pricing: true,
      image: true,
    },
    orderBy: { packageId: 'asc' },
  });

  // Transform to match expected format with locale-specific content
  const tours = toursFromDb.map((tour) => {
    // Parse pricing to get SIC price
    let sicPrice = 0;
    try {
      const pricing = typeof tour.pricing === 'string' ? JSON.parse(tour.pricing) : tour.pricing;
      sicPrice = pricing?.sicPrice || 0;
    } catch {
      sicPrice = 0;
    }

    return {
      id: tour.id,
      tourCode: tour.packageId,
      title: locale === 'es' && tour.titleEs ? tour.titleEs : tour.title,
      description: locale === 'es' && tour.descriptionEs ? tour.descriptionEs : tour.description,
      duration: tour.duration,
      city: tour.destinations, // Using destinations field as city
      sicPrice: sicPrice,
      image: tour.image,
    };
  });

  return <DailyToursClient tours={tours} />;
}
