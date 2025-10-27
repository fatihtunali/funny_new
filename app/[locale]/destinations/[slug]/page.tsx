import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import DestinationDetailClient from '@/components/DestinationDetailClient';

interface DestinationPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Enable ISR with on-demand revalidation
export const revalidate = 0; // Revalidate on every request
export const dynamicParams = true; // Allow new slugs not generated at build time

export async function generateMetadata({ params }: DestinationPageProps) {
  const resolvedParams = await params;
  const destination = await prisma.destination.findUnique({
    where: { slug: resolvedParams.slug },
  });

  if (!destination) {
    return {
      title: 'Destination Not Found',
    };
  }

  return {
    title: destination.metaTitle || `${destination.name} - Funny Tourism`,
    description: destination.metaDescription || destination.description,
  };
}

export default async function DestinationPage({ params }: DestinationPageProps) {
  const resolvedParams = await params;
  const destination = await prisma.destination.findUnique({
    where: { slug: resolvedParams.slug },
  });

  if (!destination || !destination.isActive) {
    notFound();
  }

  // Parse JSON fields
  const attractions = JSON.parse(destination.attractions);
  const experiences = JSON.parse(destination.experiences);

  return (
    <DestinationDetailClient
      name={destination.name}
      description={destination.description}
      heroImage={destination.heroImage}
      attractions={attractions}
      experiences={experiences}
      category={destination.category}
    />
  );
}
