'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaTimes, FaClock, FaMapMarkerAlt, FaHeart, FaExternalLinkAlt, FaCheck } from 'react-icons/fa';

interface QuickViewModalProps {
  packageId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({ packageId, isOpen, onClose }: QuickViewModalProps) {
  const [pkg, setPkg] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (packageId && isOpen) {
      fetchPackage();
    }
  }, [packageId, isOpen]);

  const fetchPackage = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/packages/${packageId}`);
      if (res.ok) {
        const data = await res.json();
        setPkg(data.package);
      }
    } catch (error) {
      console.error('Error fetching package:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMinPrice = () => {
    if (!pkg) return 0;
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
    } catch (e) {
      console.error('Error getting price:', e);
    }
    return 0;
  };

  const parseItinerary = () => {
    if (!pkg?.itinerary) return [];
    try {
      return typeof pkg.itinerary === 'string' ? JSON.parse(pkg.itinerary) : pkg.itinerary;
    } catch {
      return [];
    }
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
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
          >
            <FaTimes className="text-gray-600" />
          </button>

          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : pkg ? (
            <div className="grid md:grid-cols-2 gap-0">
              {/* Left: Image */}
              <div className="relative h-64 md:h-full min-h-[400px]">
                <Image
                  src={pkg.image}
                  alt={pkg.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg">
                  <span className="text-lg font-bold">From €{getMinPrice()}</span>
                </div>
              </div>

              {/* Right: Content */}
              <div className="p-6 overflow-y-auto max-h-[90vh]">
                {/* Header */}
                <div className="mb-4">
                  <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                    <span className="flex items-center">
                      <FaClock className="mr-1" />
                      {pkg.duration}
                    </span>
                    <span className="flex items-center">
                      <FaMapMarkerAlt className="mr-1" />
                      {pkg.destinations}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">{pkg.title}</h2>
                  <p className="text-gray-600">{pkg.description}</p>
                </div>

                {/* Highlights */}
                {pkg.highlights && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Highlights</h3>
                    <div className="space-y-2">
                      {(Array.isArray(pkg.highlights)
                        ? pkg.highlights
                        : pkg.highlights.split('\n').filter((h: string) => h.trim())
                      ).map((highlight: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-2">
                          <FaCheck className="text-green-600 mt-1 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Itinerary Preview */}
                {parseItinerary().length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Itinerary Preview</h3>
                    <div className="space-y-3">
                      {parseItinerary().slice(0, 3).map((day: any, idx: number) => (
                        <div key={idx} className="border-l-4 border-primary-600 pl-4">
                          <h4 className="font-semibold text-gray-900">Day {day.day}: {day.title}</h4>
                          <p className="text-sm text-gray-600 line-clamp-2">{day.description}</p>
                        </div>
                      ))}
                      {parseItinerary().length > 3 && (
                        <p className="text-sm text-gray-500 italic">+ {parseItinerary().length - 3} more days...</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Included/Excluded */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {pkg.included && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 text-sm">Included</h4>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {(Array.isArray(pkg.included)
                          ? pkg.included
                          : pkg.included.split('\n').filter((i: string) => i.trim())
                        ).slice(0, 4).map((item: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-1">
                            <FaCheck className="text-green-600 mt-0.5 flex-shrink-0" size={10} />
                            <span className="line-clamp-1">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {(pkg.notIncluded || pkg.excluded) && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 text-sm">Not Included</h4>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {(Array.isArray(pkg.notIncluded || pkg.excluded)
                          ? (pkg.notIncluded || pkg.excluded)
                          : (pkg.notIncluded || pkg.excluded).split('\n').filter((i: string) => i.trim())
                        ).slice(0, 4).map((item: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-1">
                            <FaTimes className="text-red-600 mt-0.5 flex-shrink-0" size={10} />
                            <span className="line-clamp-1">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <Link
                    href={`/tours/hotels-packages/package/${pkg.packageId}`}
                    className="flex-1 btn-primary text-center flex items-center justify-center gap-2"
                    onClick={onClose}
                  >
                    View Full Details
                    <FaExternalLinkAlt size={14} />
                  </Link>
                  <button className="btn-secondary px-4">
                    <FaHeart />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center">
              <p className="text-gray-600">Package not found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
