'use client';

import { useState, useEffect, useCallback } from 'react';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { FaFilter, FaTh, FaList, FaMapMarkerAlt, FaClock, FaEye, FaBalanceScale, FaTimes } from 'react-icons/fa';
import QuickViewModal from '@/components/QuickViewModal';
import { useComparison } from '@/contexts/ComparisonContext';

interface Package {
  id: string;
  packageId: string;
  title: string;
  slug: string;
  duration: string;
  description: string;
  destinations: string;
  image: string;
  pricing: string | Record<string, unknown>;
  packageType: string;
  highlights: string;
  pdfUrl?: string | null;
}

interface AllPackagesClientProps {
  packages: Package[];
}

export default function AllPackagesClient({ packages }: AllPackagesClientProps) {
  const t = useTranslations('packagesPage');
  const [filteredPackages, setFilteredPackages] = useState<Package[]>(packages);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [quickViewPackageId, setQuickViewPackageId] = useState<string | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const { isInComparison, toggleComparison } = useComparison();

  // Filters
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedDurations, setSelectedDurations] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const applyFilters = useCallback(() => {
    let filtered = [...packages];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(pkg =>
        pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.destinations.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Destination filter
    if (selectedDestinations.length > 0) {
      filtered = filtered.filter(pkg =>
        selectedDestinations.some(dest => pkg.destinations.toLowerCase().includes(dest.toLowerCase()))
      );
    }

    // Type filter
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(pkg => selectedTypes.includes(pkg.packageType));
    }

    // Duration filter
    if (selectedDurations.length > 0) {
      filtered = filtered.filter(pkg => {
        const days = parseInt(pkg.duration.match(/\d+/)?.[0] || '0');
        return selectedDurations.some(range => {
          if (range === '1') return days === 1;
          if (range === '2-5') return days >= 2 && days <= 5;
          if (range === '6-10') return days >= 6 && days <= 10;
          if (range === '10+') return days > 10;
          return false;
        });
      });
    }

    // Price filter
    filtered = filtered.filter(pkg => {
      const price = getPackageMinPrice(pkg);
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Sort
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => getPackageMinPrice(a) - getPackageMinPrice(b));
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => getPackageMinPrice(b) - getPackageMinPrice(a));
    } else if (sortBy === 'duration') {
      filtered.sort((a, b) => {
        const daysA = parseInt(a.duration.match(/\d+/)?.[0] || '0');
        const daysB = parseInt(b.duration.match(/\d+/)?.[0] || '0');
        return daysA - daysB;
      });
    }

    setFilteredPackages(filtered);
  }, [packages, searchQuery, selectedDestinations, selectedTypes, selectedDurations, priceRange, sortBy]);

  useEffect(() => {
    applyFilters();
  }, [selectedDestinations, selectedTypes, selectedDurations, priceRange, searchQuery, sortBy, applyFilters]);

  const getPackageMinPrice = (pkg: Package): number => {
    try {
      const pricing = typeof pkg.pricing === 'string' ? JSON.parse(pkg.pricing) : pkg.pricing;

      // Daily tours and shore excursions - use SIC price
      if (pricing?.sicPrice) {
        return pricing.sicPrice;
      }

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

      // Land only packages - use lowest price (6+ pax rate)
      if (pricing?.sixAdults) {
        return pricing.sixAdults;
      }
      if (pricing?.fourAdults) {
        return pricing.fourAdults;
      }
      if (pricing?.twoAdults) {
        return pricing.twoAdults;
      }

      // Legacy land only pricing
      if (pricing?.perPerson) {
        return pricing.perPerson;
      }

      return 0;
    } catch {
      return 0;
    }
  };

  const toggleFilter = (filterArray: string[], setFilterArray: (value: string[]) => void, value: string) => {
    if (filterArray.includes(value)) {
      setFilterArray(filterArray.filter((item: string) => item !== value));
    } else {
      setFilterArray([...filterArray, value]);
    }
  };

  const destinations = ['Istanbul', 'Cappadocia', 'Ephesus', 'Pamukkale', 'Antalya', 'Bodrum'];
  const packageTypes = [
    { value: 'WITH_HOTEL', label: t('packageTypes.withHotel') },
    { value: 'LAND_ONLY', label: t('packageTypes.landOnly') },
    { value: 'DAILY_TOUR', label: t('packageTypes.dailyTour') }
  ];
  const durations = [
    { value: '1', label: t('durations.oneDay') },
    { value: '2-5', label: t('durations.twoToFive') },
    { value: '6-10', label: t('durations.sixToTen') },
    { value: '10+', label: t('durations.tenPlus') }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
          <p className="text-xl text-primary-100">{t('subtitle')}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Mobile Filter Overlay */}
          {showFilters && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setShowFilters(false)}
            />
          )}

          {/* Filters Sidebar */}
          <aside className={`
            lg:col-span-1 mb-6 lg:mb-0
            fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto
            w-80 lg:w-auto
            transform transition-transform duration-300 ease-in-out
            ${showFilters ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}>
            <div className="bg-white rounded-lg shadow-sm p-6 lg:sticky lg:top-4 h-full lg:h-auto overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">{t('filters')}</h2>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setSelectedDestinations([]);
                      setSelectedTypes([]);
                      setSelectedDurations([]);
                      setPriceRange([0, 2000]);
                      setSearchQuery('');
                    }}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    {t('clearAll')}
                  </button>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="lg:hidden text-gray-600 hover:text-gray-800"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">{t('search')}</label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('searchPlaceholder')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Destinations */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">{t('destinations')}</label>
                <div className="space-y-2">
                  {destinations.map(dest => (
                    <label key={dest} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedDestinations.includes(dest)}
                        onChange={() => toggleFilter(selectedDestinations, setSelectedDestinations, dest)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{dest}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Package Type */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">{t('packageType')}</label>
                <div className="space-y-2">
                  {packageTypes.map(type => (
                    <label key={type.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(type.value)}
                        onChange={() => toggleFilter(selectedTypes, setSelectedTypes, type.value)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">{t('duration')}</label>
                <div className="space-y-2">
                  {durations.map(dur => (
                    <label key={dur.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedDurations.includes(dur.value)}
                        onChange={() => toggleFilter(selectedDurations, setSelectedDurations, dur.value)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{dur.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('priceRange', { min: priceRange[0], max: priceRange[1] })}
                </label>
                <input
                  type="range"
                  min="0"
                  max="2000"
                  step="50"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full"
                />
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Sticky Filter Button for Mobile */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden fixed bottom-24 right-6 z-30 bg-primary-600 text-white p-4 rounded-full shadow-2xl hover:bg-primary-700 transition-all hover:scale-110"
            >
              <FaFilter size={20} />
            </button>

            {/* Top Bar */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6 lg:sticky lg:top-4 z-10">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <p className="text-sm text-gray-600">
                    {t('toursFound', { count: filteredPackages.length })}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                  >
                    <option value="newest">{t('sortBy.newest')}</option>
                    <option value="price-low">{t('sortBy.priceLow')}</option>
                    <option value="price-high">{t('sortBy.priceHigh')}</option>
                    <option value="duration">{t('sortBy.duration')}</option>
                  </select>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 border rounded-lg ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600'}`}
                      title={t('viewMode.grid')}
                    >
                      <FaTh />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 border rounded-lg ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600'}`}
                      title={t('viewMode.list')}
                    >
                      <FaList />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Packages Grid/List */}
            {filteredPackages.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <p className="text-gray-600 text-lg">{t('noToursFound')}</p>
                <button
                  onClick={() => {
                    setSelectedDestinations([]);
                    setSelectedTypes([]);
                    setSelectedDurations([]);
                    setPriceRange([0, 2000]);
                    setSearchQuery('');
                  }}
                  className="mt-4 text-primary-600 hover:text-primary-700 font-semibold"
                >
                  {t('clearFilters')}
                </button>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6' : 'space-y-4'}>
                {filteredPackages.map((pkg) => (
                  viewMode === 'grid' ? (
                    <div
                      key={pkg.id}
                      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                    >
                      <div className="relative h-48">
                        <Image
                          src={pkg.image}
                          alt={pkg.title}
                          fill
                          className="object-cover"
                        />
                        {getPackageMinPrice(pkg) > 0 && (
                          <div className="absolute top-3 left-3 bg-green-600 text-white px-3 py-1.5 rounded-lg shadow-lg">
                            <span className="text-sm font-bold">{t('fromPrice', { price: getPackageMinPrice(pkg) })}</span>
                          </div>
                        )}
                        {/* Comparison Checkbox */}
                        <label className="absolute top-3 right-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isInComparison(pkg.packageId)}
                            onChange={() => toggleComparison(pkg.packageId)}
                            className="sr-only peer"
                          />
                          <div className="bg-white/90 backdrop-blur p-2 rounded-lg shadow-lg peer-checked:bg-primary-600 peer-checked:text-white transition-all hover:scale-110">
                            <FaBalanceScale className="text-gray-700 peer-checked:text-white" />
                          </div>
                        </label>
                      </div>

                      <div className="p-6">
                        <div className="flex items-center text-gray-600 mb-2">
                          <FaClock className="mr-2 text-sm" />
                          <span className="text-sm font-semibold">{pkg.duration}</span>
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 mb-2 min-h-[3.5rem] line-clamp-2">{pkg.title}</h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3 overflow-hidden">{pkg.description}</p>

                        <div className="flex gap-2">
                          <Link
                            href={
                              pkg.packageType === 'DAILY_TOUR'
                                ? `/daily-tours/${pkg.slug}`
                                : `/packages/${pkg.slug}`
                            }
                            className="flex-1 flex items-center justify-center btn-primary text-sm"
                            onClick={(e) => {
                              // Ensure link works on first tap on iOS
                              e.stopPropagation();
                            }}
                          >
                            {t('viewDetails')}
                          </Link>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setQuickViewPackageId(pkg.packageId);
                              setIsQuickViewOpen(true);
                            }}
                            className="btn-secondary px-4 text-sm"
                            title={t('quickView')}
                          >
                            <FaEye />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Link
                      key={pkg.id}
                      href={`/packages/${pkg.slug}`}
                      className="flex bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <div className="relative w-48 h-48 flex-shrink-0">
                        <Image
                          src={pkg.image}
                          alt={pkg.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4 flex-1">
                        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">{pkg.title}</h3>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
                          <span className="flex items-center">
                            <FaMapMarkerAlt className="mr-1 text-primary-600" />
                            {pkg.destinations}
                          </span>
                          <span className="flex items-center">
                            <FaClock className="mr-1 text-primary-600" />
                            {pkg.duration}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{pkg.description}</p>
                        {getPackageMinPrice(pkg) > 0 && (
                          <div className="mb-3 bg-green-50 border border-green-200 rounded-lg p-2">
                            <div className="flex items-baseline justify-center">
                              <span className="text-xs text-green-700 font-medium mr-1">{t('fromPrice', { price: '' }).split('€')[0]}</span>
                              <span className="text-2xl font-bold text-green-600">€{getPackageMinPrice(pkg)}</span>
                              <span className="text-xs text-green-700 ml-1">{t('perPerson')}</span>
                            </div>
                          </div>
                        )}
                        <div className="text-center">
                          <span className="text-sm text-primary-600 font-semibold hover:text-primary-700">
                            {t('viewDetailsBook')}
                          </span>
                        </div>
                      </div>
                    </Link>
                  )
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        packageId={quickViewPackageId}
        isOpen={isQuickViewOpen}
        onClose={() => {
          setIsQuickViewOpen(false);
          setQuickViewPackageId(null);
        }}
      />
    </div>
  );
}
