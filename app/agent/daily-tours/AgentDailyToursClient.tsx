'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface DailyTour {
  id: string;
  tourCode: string;
  title: string;
  description: string;
  duration: string;
  city: string;
  sicPrice: number;
  privateMin2: number;
  privateMin4: number;
  privateMin6: number;
  privateMin8: number;
  privateMin10: number;
  image: string | null;
  isActive: boolean;
}

export default function AgentDailyToursClient() {
  const [tours, setTours] = useState<DailyTour[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      const res = await fetch('/api/daily-tours');
      if (!res.ok) throw new Error('Failed to fetch tours');
      const data = await res.json();
      setTours(data.tours.filter((t: DailyTour) => t.isActive));
    } catch (error) {
      console.error('Error fetching tours:', error);
    } finally {
      setLoading(false);
    }
  };

  const cities = ['All', ...Array.from(new Set(tours.map(t => t.city)))];

  const filteredTours = tours.filter(tour => {
    const matchesSearch = tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tour.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = selectedCity === 'All' || tour.city === selectedCity;
    return matchesSearch && matchesCity;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading daily tours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Daily Tours</h1>
              <p className="text-sm text-gray-600">Browse and book daily tours for your customers</p>
            </div>
            <Link
              href="/agent/dashboard"
              className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Search tours by name or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {/* Tours Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTours.map((tour) => (
            <div key={tour.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="relative h-48">
                {tour.image ? (
                  <Image
                    src={tour.image}
                    alt={tour.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                    <span className="text-white text-4xl">🎭</span>
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span className="bg-white px-2 py-1 rounded text-xs font-medium text-gray-700">
                    {tour.tourCode}
                  </span>
                </div>
                <div className="absolute top-2 left-2">
                  <span className="bg-teal-500 text-white px-2 py-1 rounded text-xs font-medium">
                    Daily Tour
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{tour.title}</h3>
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <p>📍 {tour.city}</p>
                  <p>⏱️ {tour.duration}</p>
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="font-semibold text-gray-900 mb-1">B2B Pricing:</p>
                    <p className="text-xs">SIC: €{tour.sicPrice}/person</p>
                    <p className="text-xs">Private (2 pax): €{tour.privateMin2}/person</p>
                    <p className="text-xs">Private (4+ pax): €{tour.privateMin4}/person</p>
                  </div>
                </div>
                <Link
                  href={`/agent/daily-tours/${tour.id}`}
                  className="block w-full text-center bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Book for Customer
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredTours.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No tours found</p>
          </div>
        )}
      </main>
    </div>
  );
}
