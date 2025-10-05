'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Package {
  id: string;
  packageId: string;
  title: string;
  duration: string;
  destinations: string;
  pricing: string;
  b2bPricing: string | null;
  image: string;
  packageType: string;
}

export default function AgentPackagesClient() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const res = await fetch('/api/packages');
      if (!res.ok) throw new Error('Failed to fetch packages');
      const data = await res.json();
      setPackages(data.packages);
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPackages = packages.filter(pkg =>
    pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.destinations.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPriceRange = (pkg: Package) => {
    try {
      // Use B2B pricing if available, otherwise regular pricing
      const pricingStr = pkg.b2bPricing || pkg.pricing;
      const pricing = JSON.parse(pricingStr);

      if (pkg.packageType === 'LAND_ONLY') {
        return `€${pricing.perPerson}/person`;
      } else {
        const prices = [
          pricing.threestar?.double,
          pricing.fourstar?.double,
          pricing.fivestar?.double
        ].filter(Boolean);
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        return `€${min} - €${max}`;
      }
    } catch {
      return 'Contact for pricing';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading packages...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Available Packages</h1>
              <p className="text-sm text-gray-600">Browse and book tours for your customers</p>
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
        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search packages by name or destination..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map((pkg) => (
            <div key={pkg.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={pkg.image}
                  alt={pkg.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2">
                  <span className="bg-white px-2 py-1 rounded text-xs font-medium text-gray-700">
                    #{pkg.packageId}
                  </span>
                </div>
                {pkg.b2bPricing && (
                  <div className="absolute top-2 left-2">
                    <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                      B2B Rate
                    </span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{pkg.title}</h3>
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <p>📍 {pkg.destinations}</p>
                  <p>📅 {pkg.duration}</p>
                  <p className="text-primary-600 font-semibold">💰 {getPriceRange(pkg)}</p>
                </div>
                <Link
                  href={`/agent/packages/${pkg.packageId}`}
                  className="block w-full text-center bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  View & Book
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredPackages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No packages found</p>
          </div>
        )}
      </main>
    </div>
  );
}
