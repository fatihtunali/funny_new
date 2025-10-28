'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaCalendarDay, FaClock, FaMapMarkerAlt, FaEuroSign } from 'react-icons/fa';
import { useTranslations } from 'next-intl';

interface DailyTour {
  id: string;
  tourCode: string;
  title: string;
  description: string;
  duration: string;
  city: string;
  sicPrice: number;
  image: string | null;
}

interface DailyToursClientProps {
  tours: DailyTour[];
}

export default function DailyToursClient({ tours }: DailyToursClientProps) {
  const t = useTranslations('dailyToursPage');
  const [filteredTours, setFilteredTours] = useState<DailyTour[]>(tours);

  // Filter states
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedDurations, setSelectedDurations] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);

  // Apply filters
  useEffect(() => {
    let filtered = [...tours];

    // City filter
    if (selectedCities.length > 0) {
      filtered = filtered.filter(tour => selectedCities.includes(tour.city));
    }

    // Duration filter
    if (selectedDurations.length > 0) {
      filtered = filtered.filter(tour => selectedDurations.includes(tour.duration));
    }

    // Price filter
    filtered = filtered.filter(tour =>
      tour.sicPrice >= priceRange[0] && tour.sicPrice <= priceRange[1]
    );

    setFilteredTours(filtered);
  }, [selectedCities, selectedDurations, priceRange, tours]);

  // Get unique values for filters
  const cities = Array.from(new Set(tours.map(t => t.city))).sort();
  const durations = Array.from(new Set(tours.map(t => t.duration))).sort();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">{t('header.title')}</h1>
          <p className="text-xl text-primary-100">{t('header.subtitle')}</p>
        </div>
      </div>

      {/* Tours Section with Filters */}
      <section className="bg-gray-50 py-16">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('section.title')}</h2>
            <p className="text-lg text-gray-600">
              {t('section.description')}
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filter Sidebar */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4">{t('filters.title')}</h3>

                {/* City Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">{t('filters.city')}</label>
                  <div className="space-y-2">
                    {cities.map(city => (
                      <label key={city} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedCities.includes(city)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCities([...selectedCities, city]);
                            } else {
                              setSelectedCities(selectedCities.filter(c => c !== city));
                            }
                          }}
                          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{city}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Duration Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">{t('filters.duration')}</label>
                  <div className="space-y-2">
                    {durations.map(duration => (
                      <label key={duration} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedDurations.includes(duration)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedDurations([...selectedDurations, duration]);
                            } else {
                              setSelectedDurations(selectedDurations.filter(d => d !== duration));
                            }
                          }}
                          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{duration}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('filters.priceRange')}: €{priceRange[0]} - €{priceRange[1]}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full"
                  />
                </div>

                {/* Reset Filters */}
                <button
                  onClick={() => {
                    setSelectedCities([]);
                    setSelectedDurations([]);
                    setPriceRange([0, 500]);
                  }}
                  className="w-full text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  {t('filters.reset')}
                </button>

                {/* Results Count */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    {t('filters.showing')} <span className="font-semibold">{filteredTours.length}</span> {t('filters.of')}{' '}
                    <span className="font-semibold">{tours.length}</span> {t('filters.tours')}
                  </p>
                </div>
              </div>
            </div>

            {/* Tours Grid */}
            <div className="flex-1">
              {filteredTours.length === 0 && tours.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="max-w-3xl mx-auto text-center bg-white rounded-lg p-12 shadow-lg"
                >
                  <FaCalendarDay className="text-6xl text-orange-600 mx-auto mb-6" />
                  <h3 className="text-4xl font-bold text-gray-900 mb-4">{t('comingSoon.title')}</h3>
                  <p className="text-lg text-gray-700 mb-8">
                    {t('comingSoon.description')}
                  </p>
                  <p className="text-gray-600 mb-8">
                    {t('comingSoon.contact')}
                  </p>
                  <Link href="/contact" className="btn-primary">
                    {t('comingSoon.cta')}
                  </Link>
                </motion.div>
              ) : filteredTours.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg mb-4">{t('noResults.message')}</p>
                  <button
                    onClick={() => {
                      setSelectedCities([]);
                      setSelectedDurations([]);
                      setPriceRange([0, 500]);
                    }}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    {t('noResults.reset')}
                  </button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredTours.map((tour) => (
                    <motion.div
                      key={tour.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                    >
                      <div className="relative h-48">
                        <Image
                          src={tour.image || '/images/destinations/istanbul.jpg'}
                          alt={tour.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-3 left-3 bg-orange-600 text-white px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
                          <FaCalendarDay />
                          {tour.tourCode}
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="flex items-center justify-between text-gray-600 mb-2 text-sm">
                          <div className="flex items-center">
                            <FaClock className="mr-2" />
                            <span className="font-semibold">{tour.duration}</span>
                          </div>
                          <div className="flex items-center">
                            <FaMapMarkerAlt className="mr-2" />
                            <span>{tour.city}</span>
                          </div>
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 mb-2 min-h-[3.5rem] line-clamp-2">
                          {tour.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{tour.description}</p>

                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">{t('tourCard.sicPrice')}</span>
                            {tour.sicPrice > 0 ? (
                              <div className="flex items-center gap-1 text-orange-700 text-lg font-bold">
                                <FaEuroSign className="text-sm" />
                                {tour.sicPrice}
                              </div>
                            ) : (
                              <span className="text-sm font-bold text-gray-600">N/A</span>
                            )}
                          </div>
                          {tour.sicPrice > 0 && (
                            <p className="text-xs text-gray-500 mt-1">{t('tourCard.perPerson')}</p>
                          )}
                        </div>

                        <Link
                          href={`/daily-tours/${tour.tourCode.toLowerCase()}`}
                          className="block w-full text-center btn-primary text-sm"
                        >
                          {t('tourCard.cta')}
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Kusadasi/Izmir Tours Information */}
      {filteredTours.some(tour => tour.city === 'Izmir' || tour.city === 'Kusadasi') && (
        <section className="section-container py-12">
          <div className="max-w-6xl mx-auto bg-blue-50 border border-blue-200 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('kusadasiInfo.title')}</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>{t('kusadasiInfo.item1')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>{t('kusadasiInfo.item2')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>{t('kusadasiInfo.item3')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>{t('kusadasiInfo.item4')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>{t('kusadasiInfo.item5')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>{t('kusadasiInfo.item6')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>{t('kusadasiInfo.item7')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>{t('kusadasiInfo.item8')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>{t('kusadasiInfo.item9')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>{t('kusadasiInfo.item10')}</span>
              </li>
            </ul>
          </div>
        </section>
      )}

      {/* What's Included Section */}
      <section className="section-container py-16">
        <div className="max-w-4xl mx-auto text-center bg-white rounded-lg p-8 shadow-md">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('whatsIncluded.title')}</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            {t('whatsIncluded.description')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <FaMapMarkerAlt className="text-3xl text-orange-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">{t('whatsIncluded.feature1Title')}</h3>
              <p className="text-sm text-gray-600">{t('whatsIncluded.feature1Desc')}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <FaClock className="text-3xl text-orange-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">{t('whatsIncluded.feature2Title')}</h3>
              <p className="text-sm text-gray-600">{t('whatsIncluded.feature2Desc')}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <FaCalendarDay className="text-3xl text-orange-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">{t('whatsIncluded.feature3Title')}</h3>
              <p className="text-sm text-gray-600">{t('whatsIncluded.feature3Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-800 py-16">
        <div className="section-container text-center">
          <h2 className="text-3xl font-bold text-white mb-4">{t('cta.title')}</h2>
          <p className="text-xl text-white mb-8">
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-primary bg-white text-orange-600 hover:bg-gray-100">
              {t('cta.contact')}
            </Link>
            <Link href="/tours" className="btn-primary bg-transparent border-2 border-white text-white hover:bg-white hover:text-orange-600">
              {t('cta.browse')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
