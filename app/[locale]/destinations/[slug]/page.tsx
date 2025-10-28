import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import DestinationDetailClient from '@/components/DestinationDetailClient';

interface DestinationPageProps {
  params: Promise<{
    slug: string;
    locale: string;
  }>;
}

// Enable ISR with on-demand revalidation
export const revalidate = 0; // Revalidate on every request
export const dynamicParams = true; // Allow new slugs not generated at build time

export async function generateMetadata({ params }: DestinationPageProps) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale || 'en';
  const destination = await prisma.destination.findUnique({
    where: { slug: resolvedParams.slug },
  });

  if (!destination) {
    return {
      title: 'Destination Not Found',
    };
  }

  // Use Spanish metadata if locale is 'es' and available
  const useSpanish = locale === 'es';
  const metaTitle = useSpanish && destination.metaTitleEs
    ? destination.metaTitleEs
    : destination.metaTitle || `${destination.name} - Funny Tourism`;
  const metaDescription = useSpanish && destination.metaDescriptionEs
    ? destination.metaDescriptionEs
    : destination.metaDescription || destination.description;

  return {
    title: metaTitle,
    description: metaDescription,
  };
}

export default async function DestinationPage({ params }: DestinationPageProps) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale || 'en';
  const destination = await prisma.destination.findUnique({
    where: { slug: resolvedParams.slug },
  });

  if (!destination || !destination.isActive) {
    notFound();
  }

  // Use Spanish content if locale is 'es' and Spanish content is available
  const useSpanish = locale === 'es';
  const name = useSpanish && destination.nameEs ? destination.nameEs : destination.name;
  const description = useSpanish && destination.descriptionEs ? destination.descriptionEs : destination.description;

  // Parse JSON fields - use Spanish versions if available
  const attractionsJson = useSpanish && destination.attractionsEs ? destination.attractionsEs : destination.attractions;
  const experiencesJson = useSpanish && destination.experiencesEs ? destination.experiencesEs : destination.experiences;

  const attractions = JSON.parse(attractionsJson);
  const experiences = JSON.parse(experiencesJson);

  return (
    <DestinationDetailClient
      name={name}
      description={description}
      heroImage={destination.heroImage}
      attractions={attractions}
      experiences={experiences}
      category={destination.category}
    />
  );
}
