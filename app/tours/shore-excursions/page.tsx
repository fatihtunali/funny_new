'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaShip, FaMapMarkerAlt, FaClock, FaCheckCircle, FaFilter, FaTimes } from 'react-icons/fa';
import { PackageGridSkeleton } from '@/components/LoadingSkeleton';

interface ShoreExcursion {
  id: string;
  packageId: string;
  title: string;
  slug: string;
  duration: string;
  description: string;
  destinations: string;
  port?: string;
  pickupType?: string;
  image: string;
  pricing: Record<string, unknown>;
  highlights: string;
}

export default function ShoreExcursionsPage() {
  const [excursions, setExcursions] = useState<ShoreExcursion[]>([]);
  const [filteredExcursions, setFilteredExcursions] = useState<ShoreExcursion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Filters
  const [selectedPorts, setSelectedPorts] = useState<string[]>([]);
  const [selectedDurations, setSelectedDurations] = useState<string[]>([]);
  const [selectedPickupTypes, setSelectedPickupTypes] = useState<string[]>([]);

  const ports = [
    { value: 'Istanbul', label: 'Istanbul (Galataport)' },
    { value: 'Kusadasi', label: 'Kusadasi' },
    { value: 'Izmir', label: 'Izmir (Alsancak)' },
    { value: 'Bodrum', label: 'Bodrum' },
    { value: 'Antalya', label: 'Antalya' },
    { value: 'Marmaris', label: 'Marmaris' }
  ];

  const durations = [
    { value: '4h', label: '4 Hours' },
    { value: '6h', label: '6 Hours' },
    { value: '8h', label: '8 Hours' },
    { value: 'full', label: 'Full Day (10+ hours)' }
  ];

  const pickupTypes = [
    { value: 'port', label: 'Port Pickup' },
    { value: 'hotel', label: 'Hotel Pickup' },
    { value: 'both', label: 'Port & Hotel Pickup' }
  ];

  const fetchExcursions = async () => {
    try {
      // Fetch daily tours with SHORE_EXCURSION category
      const res = await fetch('/api/daily-tours?category=SHORE_EXCURSION');
      const data = await res.json();

      // Map daily tours to shore excursion format
      const shoreExcursions = (data.tours || []).map((tour: {
        id: string;
        tourCode: string;
        title: string;
        description: string;
        duration: string;
        city: string;
        port: string | null;
        pickupLocations: string | null;
        image: string | null;
        sicPrice: number;
      }) => ({
        id: tour.id,
        packageId: tour.tourCode,
        title: tour.title,
        slug: tour.tourCode.toLowerCase(),
        duration: tour.duration,
        description: tour.description,
        destinations: tour.city,
        port: tour.port || tour.city,
        pickupType: tour.pickupLocations || 'Port Pickup',
        image: tour.image || '/images/destinations/istanbul.jpg',
        pricing: { sicPrice: tour.sicPrice },
        highlights: tour.description,
      }));

      setExcursions(shoreExcursions);
      setFilteredExcursions(shoreExcursions);
    } catch (error) {
      console.error('Error fetching excursions:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = useCallback(() => {
    let filtered = [...excursions];

    // Port filter
    if (selectedPorts.length > 0) {
      filtered = filtered.filter(exc =>
        selectedPorts.some(port => exc.destinations?.toLowerCase().includes(port.toLowerCase()))
      );
    }

    // Duration filter
    if (selectedDurations.length > 0) {
      filtered = filtered.filter(exc => {
        const duration = exc.duration.toLowerCase();
        return selectedDurations.some(dur => {
          if (dur === '4h') return duration.includes('4') || duration.includes('half');
          if (dur === '6h') return duration.includes('6');
          if (dur === '8h') return duration.includes('8');
          if (dur === 'full') return duration.includes('full') || duration.includes('10');
          return false;
        });
      });
    }

    setFilteredExcursions(filtered);
  }, [excursions, selectedPorts, selectedDurations]);

  useEffect(() => {
    fetchExcursions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [excursions, selectedPorts, selectedDurations, selectedPickupTypes, applyFilters]);

  const toggleFilter = (filterArray: string[], setFilterArray: (value: string[]) => void, value: string) => {
    if (filterArray.includes(value)) {
      setFilterArray(filterArray.filter((item: string) => item !== value));
    } else {
      setFilterArray([...filterArray, value]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-4">Shore Excursions</h1>
            <p className="text-xl text-blue-100">Cruise port tours with guaranteed return</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PackageGridSkeleton count={6} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <FaShip className="text-4xl" />
            <h1 className="text-4xl font-bold">Turkey Shore Excursions</h1>
          </div>
          <p className="text-xl text-blue-100 mb-6">
            Premium cruise port tours with guaranteed back-to-ship timing
          </p>
          <div className="grid md:grid-cols-3 gap-4 mt-8">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur rounded-lg p-4">
              <FaCheckCircle className="text-2xl text-green-300" />
              <div>
                <div className="font-semibold">Back-to-Ship Guarantee</div>
                <div className="text-sm text-blue-100">We ensure timely return</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur rounded-lg p-4">
              <FaMapMarkerAlt className="text-2xl text-green-300" />
              <div>
                <div className="font-semibold">Port & Hotel Pickup</div>
                <div className="text-sm text-blue-100">Convenient meeting points</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur rounded-lg p-4">
              <FaClock className="text-2xl text-green-300" />
              <div>
                <div className="font-semibold">Flexible Durations</div>
                <div className="text-sm text-blue-100">4 to 10+ hour tours</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden fixed bottom-24 right-6 z-30 bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:bg-blue-700 transition-all hover:scale-110 flex items-center gap-2"
          >
            <FaFilter size={20} />
          </button>

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
                <h2 className="text-lg font-bold text-gray-900">Filter Excursions</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden text-gray-600 hover:text-gray-800"
                >
                  <FaTimes size={20} />
                </button>
              </div>

              {/* Cruise Ports */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaShip className="inline mr-2" />
                  Cruise Port
                </label>
                <div className="space-y-2">
                  {ports.map(port => (
                    <label key={port.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedPorts.includes(port.value)}
                        onChange={() => toggleFilter(selectedPorts, setSelectedPorts, port.value)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{port.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaClock className="inline mr-2" />
                  Tour Duration
                </label>
                <div className="space-y-2">
                  {durations.map(dur => (
                    <label key={dur.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedDurations.includes(dur.value)}
                        onChange={() => toggleFilter(selectedDurations, setSelectedDurations, dur.value)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{dur.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Pickup Type */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaMapMarkerAlt className="inline mr-2" />
                  Pickup Location
                </label>
                <div className="space-y-2">
                  {pickupTypes.map(type => (
                    <label key={type.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedPickupTypes.includes(type.value)}
                        onChange={() => toggleFilter(selectedPickupTypes, setSelectedPickupTypes, type.value)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedPorts([]);
                  setSelectedDurations([]);
                  setSelectedPickupTypes([]);
                }}
                className="w-full text-sm text-blue-600 hover:text-blue-700 font-semibold"
              >
                Clear All Filters
              </button>
            </div>
          </aside>

          {/* Excursions Grid */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex items-center justify-between bg-white rounded-lg shadow-sm p-4">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">{filteredExcursions.length}</span> shore excursions available
              </p>
            </div>

            {filteredExcursions.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <FaShip className="mx-auto text-6xl text-gray-300 mb-4" />
                <p className="text-gray-600 text-lg">No excursions found for selected filters.</p>
                <button
                  onClick={() => {
                    setSelectedPorts([]);
                    setSelectedDurations([]);
                    setSelectedPickupTypes([]);
                  }}
                  className="mt-4 text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredExcursions.map((exc) => (
                  <div
                    key={exc.id}
                    className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    <div className="relative h-48">
                      <Image
                        src={exc.image}
                        alt={exc.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
                        <FaShip />
                        Shore Excursion
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center text-gray-600 mb-2 text-sm">
                        <FaClock className="mr-2" />
                        <span className="font-semibold">{exc.duration}</span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-2 min-h-[3.5rem] line-clamp-2">
                        {exc.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{exc.description}</p>

                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                        <div className="flex items-center gap-2 text-green-700 text-sm font-semibold">
                          <FaCheckCircle />
                          Back-to-Ship Guarantee
                        </div>
                      </div>

                      <Link
                        href={`/tours/hotels-packages/package/${exc.packageId}`}
                        className="block w-full text-center btn-primary text-sm"
                      >
                        View Details & Book
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
