'use client';

import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface Destination {
  name: string;
  description: string;
  slug: string;
  attractions: string;
  image: string;
  gradient: string;
  category: string;
  region: string;
}

interface DestinationsClientProps {
  destinations: Destination[];
}

export default function DestinationsClient({ destinations }: DestinationsClientProps) {
  const t = useTranslations('destinationsPage');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');

  // Filter destinations based on search and filters
  const filteredDestinations = destinations.filter(destination => {
    const matchesSearch = destination.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         destination.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         destination.attractions.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || destination.category === categoryFilter;
    const matchesRegion = regionFilter === 'all' || destination.region === regionFilter;

    return matchesSearch && matchesCategory && matchesRegion;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">{t('header.title')}</h1>
          <p className="text-xl text-primary-100">{t('header.subtitle')}</p>
        </div>
      </div>

      {/* Destinations Grid */}
      <section className="section-container py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('section.title')}</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('section.description')}
          </p>
        </motion.div>

        {/* Search and Filters */}
        <div className="mb-8 bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Bar */}
            <div className="md:col-span-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                {t('filters.searchLabel')}
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  placeholder={t('filters.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                {t('filters.category')}
              </label>
              <select
                id="category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">{t('filters.allCategories')}</option>
                <option value="Historical">{t('filters.categories.historical')}</option>
                <option value="Coastal">{t('filters.categories.coastal')}</option>
                <option value="Natural">{t('filters.categories.natural')}</option>
                <option value="Cultural">{t('filters.categories.cultural')}</option>
                <option value="Adventure">{t('filters.categories.adventure')}</option>
              </select>
            </div>

            {/* Region Filter */}
            <div>
              <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-2">
                {t('filters.region')}
              </label>
              <select
                id="region"
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">{t('filters.allRegions')}</option>
                <option value="Europe">{t('filters.regions.europe')}</option>
                <option value="Marmara">{t('filters.regions.marmara')}</option>
                <option value="Aegean">{t('filters.regions.aegean')}</option>
                <option value="Mediterranean">{t('filters.regions.mediterranean')}</option>
                <option value="Central Anatolia">{t('filters.regions.centralAnatolia')}</option>
                <option value="Black Sea">{t('filters.regions.blackSea')}</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            {t('filters.showing')} <span className="font-semibold text-primary-600">{filteredDestinations.length}</span> {t('filters.of')} <span className="font-semibold">{destinations.length}</span> {t('filters.destinations')}
          </div>
        </div>

        {filteredDestinations.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">{t('noResults.title')}</h3>
            <p className="mt-1 text-sm text-gray-500">{t('noResults.message')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDestinations.map((destination, index) => (
              <motion.div
                key={destination.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Image with overlay */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={destination.image}
                    alt={destination.name}
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${destination.gradient} opacity-20`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                    <h3 className="text-4xl font-bold text-white p-6">{destination.name}</h3>
                  </div>
                  {/* Category and Region Badges */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-semibold">
                      {destination.category}
                    </span>
                    <span className="bg-primary-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {destination.region}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-gray-700 mb-4">{destination.description}</p>
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-900 mb-2">{t('card.topAttractions')}</p>
                    <p className="text-sm text-gray-600">{destination.attractions}</p>
                  </div>
                  <Link
                    href={`/destinations/${destination.slug}`}
                    className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold group"
                  >
                    {t('card.explore')} {destination.name}
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 py-16">
        <div className="section-container text-center">
          <h2 className="text-3xl font-bold text-white mb-4">{t('cta.title')}</h2>
          <p className="text-xl text-white mb-8">
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/packages/istanbul-cappadocia-kusadasi" className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
              {t('cta.viewPackages')}
            </Link>
            <Link href="/#contact" className="btn-primary bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600">
              {t('cta.contactUs')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
