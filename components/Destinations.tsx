'use client';

import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export default function Destinations() {
  const t = useTranslations('destinations');

  const destinations = [
    {
      key: 'istanbul',
      slug: 'istanbul',
      image: '/images/BlueMosqueIstanbul6minarets.jpg'
    },
    {
      key: 'cappadocia',
      slug: 'cappadocia',
      image: '/images/cappadocianight.jpg'
    },
    {
      key: 'ephesus',
      slug: 'ephesus',
      image: '/images/Ephesus_Library2.jpg'
    },
    {
      key: 'pamukkale',
      slug: 'pamukkale',
      image: '/images/PamukkaleTravertenler.jpg'
    }
  ];

  const gradients = [
    'from-blue-500 to-blue-700',
    'from-orange-500 to-orange-700',
    'from-green-500 to-green-700',
    'from-purple-500 to-purple-700'
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('title')}</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {destinations.map((destination, index) => (
            <motion.div
              key={destination.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              {/* Image with overlay */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={destination.image}
                  alt={t(`${destination.key}.name`)}
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-500"
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index]} opacity-20`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <h3 className="text-4xl font-bold text-white p-6">{t(`${destination.key}.name`)}</h3>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-700 mb-4">{t(`${destination.key}.description`)}</p>
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-900 mb-2">{t('topAttractions')}</p>
                  <p className="text-sm text-gray-600">{t(`${destination.key}.attractions`)}</p>
                </div>
                <Link
                  href={`/destinations/${destination.slug}`}
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold group"
                >
                  {t('exploreButton', { destination: t(`${destination.key}.name`) })}
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
