'use client';

import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};

interface PackageData {
  packageId: string;
  slug: string;
  title: string;
  duration: string;
  image: string;
  pricing: string | Record<string, unknown>;
  highlights?: string;
}

interface FeaturedPackagesClientProps {
  packages: PackageData[];
}

export default function FeaturedPackagesClient({ packages }: FeaturedPackagesClientProps) {
  const t = useTranslations('featuredPackages');

  // Get starting price: 3-star hotel, double room (per person for 6+ adults)
  const getStartingPrice = (pkg: PackageData) => {
    try {
      const pricing = typeof pkg.pricing === 'string' ? JSON.parse(pkg.pricing) : pkg.pricing;

      // Check if using new paxTiers structure
      if (pricing?.paxTiers) {
        // Use 6 pax tier pricing if available (standard group size)
        const tier6 = pricing.paxTiers['6']?.threestar?.double;
        if (tier6) return tier6;

        // Fallback to highest tier available
        const tiers = Object.keys(pricing.paxTiers).map(Number).sort((a, b) => b - a);
        for (const tier of tiers) {
          const price = pricing.paxTiers[tier]?.threestar?.double;
          if (price) return price;
        }
      }

      // Fallback to old structure
      if (pricing?.threestar?.double) {
        return pricing.threestar.double;
      }

      return null;
    } catch {
      return null;
    }
  };

  if (packages.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="section-container text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('title')}</h2>
          <p className="text-gray-600">{t('noPackages')}</p>
          <Link href="/packages" className="btn-primary text-lg mt-6 inline-block">
            {t('viewAllTours')}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{t('title')}</h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8"
        >
          {packages.map((pkg) => {
            // Parse highlights from database
            const highlights = pkg.highlights ? JSON.parse(pkg.highlights).slice(0, 4) : [];

            return (
            <motion.div
              key={pkg.packageId}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={pkg.image}
                  alt={pkg.title}
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <div className="text-white p-6 w-full">
                    <p className="text-sm font-semibold mb-1">{pkg.duration}</p>
                    <h3 className="text-2xl font-bold">{pkg.title}</h3>
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-accent-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  ⭐ 4.9
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {highlights.length > 0 && (
                  <ul className="space-y-2 mb-6 min-h-[120px]">
                    {highlights.map((highlight: string, index: number) => (
                      <li key={index} className="flex items-start text-gray-700">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {getStartingPrice(pkg) && (
                  <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-baseline justify-center">
                      <span className="text-sm text-green-700 font-medium mr-2">{t('from')}</span>
                      <span className="text-2xl font-bold text-green-600">€{getStartingPrice(pkg)}</span>
                      <span className="text-sm text-green-700 ml-1">pp</span>
                    </div>
                    <p className="text-xs text-green-600 text-center mt-1">{t('pricingNote')}</p>
                  </div>
                )}

                <div className="flex items-center justify-between border-t pt-4">
                  <div>
                    <p className="text-sm text-gray-500">{t('viewPackage')}</p>
                    <p className="text-sm text-gray-600 font-semibold">{t('fullDetails')}</p>
                  </div>
                  <Link
                    href={`/packages/${pkg.slug}`}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                  >
                    {t('viewDetails')}
                  </Link>
                </div>
              </div>
            </motion.div>
            );
          })}
        </motion.div>

        <div className="text-center mt-12">
          <Link href="/packages" className="btn-primary text-lg">
            {t('viewAllTours')}
          </Link>
        </div>
      </div>
    </section>
  );
}
