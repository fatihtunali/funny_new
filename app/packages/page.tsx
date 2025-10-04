'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaFilter, FaTh, FaList, FaMapMarkerAlt, FaClock, FaEuroSign } from 'react-icons/fa';

interface Package {
  id: string;
  packageId: string;
  title: string;
  slug: string;
  duration: string;
  description: string;
  destinations: string;
  image: string;
  pricing: any;
  packageType: string;
  highlights: string;
}

export default function AllPackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Filters
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedDurations, setSelectedDurations] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchPackages();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [packages, selectedDestinations, selectedTypes, selectedDurations, priceRange, searchQuery, sortBy]);

  const fetchPackages = async () => {
    try {
      const res = await fetch('/api/packages');
      const data = await res.json();
      setPackages(data.packages || []);
      setFilteredPackages(data.packages || []);
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
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
  };

  const getPackageMinPrice = (pkg: Package): number => {
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

      // Land only packages
      if (pricing?.perPerson) {
        return pricing.perPerson;
      }

      return 0;
    } catch {
      return 0;
    }
  };

  const toggleFilter = (filterArray: string[], setFilterArray: Function, value: string) => {
    if (filterArray.includes(value)) {
      setFilterArray(filterArray.filter((item: string) => item !== value));
    } else {
      setFilterArray([...filterArray, value]);
    }
  };

  const destinations = ['Istanbul', 'Cappadocia', 'Ephesus', 'Pamukkale', 'Antalya', 'Bodrum'];
  const packageTypes = [
    { value: 'WITH_HOTEL', label: 'Hotel Packages' },
    { value: 'LAND_ONLY', label: 'Land Packages' }
  ];
  const durations = [
    { value: '1', label: '1 Day' },
    { value: '2-5', label: '2-5 Days' },
    { value: '6-10', label: '6-10 Days' },
    { value: '10+', label: '10+ Days' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Explore All Turkey Tours</h1>
          <p className="text-xl text-primary-100">Discover amazing experiences across Turkey</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Filters Sidebar */}
          <aside className={`lg:col-span-1 mb-6 lg:mb-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-sm p-6 lg:sticky lg:top-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Filters</h2>
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
                  Clear All
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tours..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Destinations */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Destinations</label>
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">Package Type</label>
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">Duration</label>
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
                  Price Range: €{priceRange[0]} - €{priceRange[1]}
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
            {/* Top Bar */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <FaFilter className="mr-2" />
                    Filters
                  </button>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">{filteredPackages.length}</span> tours found
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="duration">Duration</option>
                  </select>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 border rounded-lg ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600'}`}
                      title="Grid view"
                    >
                      <FaTh />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 border rounded-lg ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600'}`}
                      title="List view"
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
                <p className="text-gray-600 text-lg">No tours found matching your criteria.</p>
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
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
                {filteredPackages.map((pkg) => (
                  <Link
                    key={pkg.id}
                    href={`/tours/hotels-packages/package/${pkg.packageId}`}
                    className={`bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow ${
                      viewMode === 'list' ? 'flex' : 'block'
                    }`}
                  >
                    <img
                      src={pkg.image}
                      alt={pkg.title}
                      className={viewMode === 'list' ? 'w-48 h-48 object-cover flex-shrink-0' : 'w-full h-48 object-cover'}
                    />
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
                            <span className="text-xs text-green-700 font-medium mr-1">From</span>
                            <span className="text-2xl font-bold text-green-600">€{getPackageMinPrice(pkg)}</span>
                            <span className="text-xs text-green-700 ml-1">per person</span>
                          </div>
                          <p className="text-xs text-green-600 text-center">Per person in double room (6+ adults)</p>
                        </div>
                      )}
                      <div className="text-center">
                        <span className="text-sm text-primary-600 font-semibold hover:text-primary-700">
                          View Details & Book →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
