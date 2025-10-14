'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaTimes, FaClock, FaMapMarkerAlt, FaCheck } from 'react-icons/fa';
import { useComparison } from '@/contexts/ComparisonContext';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PackageData {
  id: string;
  packageId: string;
  slug: string;
  title: string;
  image: string;
  pricing: string | Record<string, unknown>;
  duration: string;
  destinations: string | string[];
  description: string;
  highlights?: string | string[];
}

export default function ComparisonModal({ isOpen, onClose }: ComparisonModalProps) {
  const { comparisonList, removeFromComparison, clearComparison } = useComparison();
  const [packages, setPackages] = useState<PackageData[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPackages = useCallback(async () => {
    setLoading(true);
    try {
      const promises = comparisonList.map(id =>
        fetch(`/api/packages/${id}`).then(res => res.json())
      );
      const results = await Promise.all(promises);
      setPackages(results.map(r => r.package).filter(Boolean));
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  }, [comparisonList]);

  useEffect(() => {
    if (isOpen && comparisonList.length > 0) {
      fetchPackages();
    }
  }, [isOpen, comparisonList, fetchPackages]);

  const getMinPrice = (pkg: PackageData) => {
    try {
      const pricing = typeof pkg.pricing === 'string' ? JSON.parse(pkg.pricing) : pkg.pricing;
      if (pricing?.paxTiers) {
        const tier6 = pricing.paxTiers['6']?.threestar?.double;
        if (tier6) return tier6;
        const tiers = Object.keys(pricing.paxTiers).map(Number).sort((a, b) => b - a);
        for (const tier of tiers) {
          const price = pricing.paxTiers[tier]?.threestar?.double;
          if (price) return price;
        }
      }
      if (pricing?.perPerson) return pricing.perPerson;
    } catch {
      // Ignore parsing errors
    }
    return 0;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative min-h-screen flex items-start justify-center p-4 pt-20">
        <div className="relative bg-white rounded-lg shadow-2xl max-w-7xl w-full max-h-[85vh] overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between z-10">
            <h2 className="text-2xl font-bold text-gray-900">
              Compare Packages ({packages.length})
            </h2>
            <div className="flex items-center gap-3">
              {packages.length > 0 && (
                <button
                  onClick={() => {
                    clearComparison();
                    onClose();
                  }}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={onClose}
                className="bg-gray-100 rounded-full p-2 hover:bg-gray-200 transition-colors"
              >
                <FaTimes className="text-gray-600" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : packages.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-600 text-lg mb-4">No packages to compare</p>
              <p className="text-sm text-gray-500">Add packages from the packages page to start comparing</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <tbody>
                  {/* Images */}
                  <tr className="border-b">
                    <td className="p-4 font-semibold text-gray-700 bg-gray-50 sticky left-0">Image</td>
                    {packages.map((pkg) => (
                      <td key={pkg.id} className="p-4">
                        <div className="relative h-48 w-full">
                          <Image
                            src={pkg.image}
                            alt={pkg.title}
                            fill
                            className="object-cover rounded-lg"
                          />
                          <button
                            onClick={() => removeFromComparison(pkg.packageId)}
                            className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-lg hover:bg-gray-100"
                          >
                            <FaTimes className="text-gray-600 text-sm" />
                          </button>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Title */}
                  <tr className="border-b">
                    <td className="p-4 font-semibold text-gray-700 bg-gray-50 sticky left-0">Package</td>
                    {packages.map((pkg) => (
                      <td key={pkg.id} className="p-4">
                        <h3 className="font-bold text-lg text-gray-900 mb-2">{pkg.title}</h3>
                        <Link
                          href={`/packages/${pkg.slug}`}
                          className="text-sm text-primary-600 hover:text-primary-700"
                        >
                          View Details →
                        </Link>
                      </td>
                    ))}
                  </tr>

                  {/* Price */}
                  <tr className="border-b bg-green-50">
                    <td className="p-4 font-semibold text-gray-700 bg-gray-50 sticky left-0">Price (from)</td>
                    {packages.map((pkg) => (
                      <td key={pkg.id} className="p-4">
                        <div className="text-3xl font-bold text-green-600">€{getMinPrice(pkg)}</div>
                        <p className="text-xs text-gray-600 mt-1">per person</p>
                      </td>
                    ))}
                  </tr>

                  {/* Duration */}
                  <tr className="border-b">
                    <td className="p-4 font-semibold text-gray-700 bg-gray-50 sticky left-0">
                      <FaClock className="inline mr-2" />
                      Duration
                    </td>
                    {packages.map((pkg) => (
                      <td key={pkg.id} className="p-4">
                        <span className="font-semibold">{pkg.duration}</span>
                      </td>
                    ))}
                  </tr>

                  {/* Destinations */}
                  <tr className="border-b">
                    <td className="p-4 font-semibold text-gray-700 bg-gray-50 sticky left-0">
                      <FaMapMarkerAlt className="inline mr-2" />
                      Destinations
                    </td>
                    {packages.map((pkg) => (
                      <td key={pkg.id} className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {(Array.isArray(pkg.destinations)
                            ? pkg.destinations
                            : pkg.destinations.split(',')
                          ).map((dest: string, idx: number) => (
                            <span
                              key={idx}
                              className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium"
                            >
                              {dest.trim()}
                            </span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Description */}
                  <tr className="border-b">
                    <td className="p-4 font-semibold text-gray-700 bg-gray-50 sticky left-0">Description</td>
                    {packages.map((pkg) => (
                      <td key={pkg.id} className="p-4">
                        <p className="text-sm text-gray-600">{pkg.description}</p>
                      </td>
                    ))}
                  </tr>

                  {/* Highlights */}
                  <tr className="border-b">
                    <td className="p-4 font-semibold text-gray-700 bg-gray-50 sticky left-0 align-top">Highlights</td>
                    {packages.map((pkg) => (
                      <td key={pkg.id} className="p-4">
                        {pkg.highlights && (
                          <ul className="space-y-1">
                            {(Array.isArray(pkg.highlights) ? pkg.highlights : pkg.highlights.split('\n')).filter((h: string) => h.trim()).slice(0, 5).map((highlight: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2 text-sm">
                                <FaCheck className="text-green-600 mt-1 flex-shrink-0" size={12} />
                                <span className="text-gray-700">{highlight}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Action */}
                  <tr>
                    <td className="p-4 bg-gray-50 sticky left-0"></td>
                    {packages.map((pkg) => (
                      <td key={pkg.id} className="p-4">
                        <Link
                          href={`/packages/${pkg.slug}`}
                          className="btn-primary w-full text-center block"
                        >
                          Book Now
                        </Link>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
