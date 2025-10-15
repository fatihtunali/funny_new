import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import prisma from '@/lib/prisma';
import DestinationDetailClient from '@/components/DestinationDetailClient';

interface DestinationPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const destinations = await prisma.destination.findMany({
    where: { isActive: true },
    select: { slug: true },
  });

  return destinations.map((destination) => ({
    slug: destination.slug,
  }));
}

export async function generateMetadata({ params }: DestinationPageProps) {
  const destination = await prisma.destination.findUnique({
    where: { slug: params.slug },
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
  const destination = await prisma.destination.findUnique({
    where: { slug: params.slug },
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
      gradient={destination.gradient}
      attractions={attractions}
      experiences={experiences}
      category={destination.category}
    />
  );
}
