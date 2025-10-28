'use client';

import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import { useTranslations } from 'next-intl';

interface Attraction {
  name: string;
  description: string;
  image: string;
  duration: string;
}

interface DestinationDetailClientProps {
  name: string;
  description: string;
  heroImage: string;
  attractions: Attraction[];
  experiences: string[];
  category: string;
}

export default function DestinationDetailClient({
  name,
  description,
  heroImage,
  attractions,
  experiences,
  category
}: DestinationDetailClientProps) {
  const t = useTranslations('destinationDetailPage');

  // Determine background color for experiences based on category
  const getBgColor = (category: string) => {
    const colors: Record<string, string> = {
      'Historical': 'bg-blue-50',
      'Coastal': 'bg-cyan-50',
      'Natural': 'bg-green-50',
      'Cultural': 'bg-purple-50',
      'Adventure': 'bg-orange-50'
    };
    return colors[category] || 'bg-gray-50';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px]">
        <Image
          src={heroImage}
          alt={`${name} - Destination`}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70" />
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white px-4"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4">{name}</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              {description}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Introduction */}
      <section className="section-container py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('introduction.discover')} {name}</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            {description}
          </p>
        </div>
      </section>

      {/* Top Attractions */}
      {attractions.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="section-container">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">{t('attractions.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {attractions.map((attraction, index) => (
                <motion.div
                  key={attraction.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="relative h-48">
                    <Image
                      src={attraction.image}
                      alt={attraction.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{attraction.name}</h3>
                    <p className="text-gray-600 mb-4">{attraction.description}</p>
                    <div className="flex items-center text-primary-600">
                      <FaClock className="mr-2" />
                      <span className="text-sm">{attraction.duration}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Experiences */}
      {experiences.length > 0 && (
        <section className="section-container py-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">{t('experiences.title')}</h2>
          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {experiences.map((experience, index) => (
              <motion.div
                key={experience}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-start space-x-3 p-4 ${getBgColor(category)} rounded-lg`}
              >
                <FaMapMarkerAlt className="text-primary-600 mt-1 flex-shrink-0" />
                <span className="text-gray-800">{experience}</span>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-primary-600 py-16">
        <div className="section-container text-center">
          <h2 className="text-3xl font-bold text-white mb-4">{t('cta.title', { name })}</h2>
          <p className="text-xl text-white mb-8">
            {t('cta.subtitle', { name })}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/packages" className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
              {t('cta.viewPackages')}
            </Link>
            <Link href="/contact" className="btn-primary bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600">
              {t('cta.contactUs')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
