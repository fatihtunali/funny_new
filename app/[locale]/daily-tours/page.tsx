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

  // Fetch daily tours from DailyTour table at build/request time
  const toursFromDb = await prisma.dailyTour.findMany({
    where: {
      isActive: true,
    },
    orderBy: { tourCode: 'asc' },
  });

  // Transform to match expected format with locale-specific content
  const tours = toursFromDb.map((tour) => ({
    id: tour.id,
    tourCode: tour.tourCode,
    title: locale === 'es' && tour.titleEs ? tour.titleEs : tour.title,
    description: locale === 'es' && tour.descriptionEs ? tour.descriptionEs : tour.description,
    duration: tour.duration,
    city: tour.city,
    sicPrice: tour.sicPrice,
    image: tour.image,
  }));

  return <DailyToursClient tours={tours} />;
}
