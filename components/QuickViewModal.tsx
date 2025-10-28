'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { FaTimes, FaClock, FaMapMarkerAlt, FaHeart, FaExternalLinkAlt, FaCheck } from 'react-icons/fa';
import { useWishlist } from '@/contexts/WishlistContext';

interface QuickViewModalProps {
  packageId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

interface PackageData {
  packageId: string;
  slug: string;
  title: string;
  duration: string;
  destinations: string;
  description: string;
  image: string;
  pricing: string | Record<string, unknown>;
  highlights?: string | string[];
  included?: string | string[];
  notIncluded?: string | string[];
  excluded?: string | string[];
  itinerary?: string | unknown[];
}

export default function QuickViewModal({ packageId, isOpen, onClose }: QuickViewModalProps) {
  const t = useTranslations('quickViewModal');

  const [pkg, setPkg] = useState<PackageData | null>(null);
  const [loading, setLoading] = useState(false);
  const { isInWishlist, toggleWishlist } = useWishlist();

  const fetchPackage = useCallback(async () => {
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
  }, [packageId]);

  useEffect(() => {
    if (packageId && isOpen) {
      fetchPackage();
    }
  }, [packageId, isOpen, fetchPackage]);

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
              <span className="sr-only">{t('loading')}</span>
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
                  <span className="text-lg font-bold">{t('priceFrom', { price: getMinPrice() })}</span>
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
                    <h3 className="text-lg font-bold text-gray-900 mb-3">{t('sections.highlights')}</h3>
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
                    <h3 className="text-lg font-bold text-gray-900 mb-3">{t('sections.itinerary')}</h3>
                    <div className="space-y-3">
                      {parseItinerary().slice(0, 3).map((day: { day: number; title: string; description: string }, idx: number) => (
                        <div key={idx} className="border-l-4 border-primary-600 pl-4">
                          <h4 className="font-semibold text-gray-900">{t('dayLabel', { day: day.day })}: {day.title}</h4>
                          <p className="text-sm text-gray-600 line-clamp-2">{day.description}</p>
                        </div>
                      ))}
                      {parseItinerary().length > 3 && (
                        <p className="text-sm text-gray-500 italic">{t('moreDays', { count: parseItinerary().length - 3 })}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Included/Excluded */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {pkg.included && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 text-sm">{t('sections.included')}</h4>
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
                      <h4 className="font-semibold text-gray-900 mb-2 text-sm">{t('sections.notIncluded')}</h4>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {(() => {
                          const items = pkg.notIncluded || pkg.excluded;
                          if (!items) return [];
                          if (Array.isArray(items)) return items;
                          if (typeof items === 'string') return items.split('\n').filter((i: string) => i.trim());
                          return [];
                        })().slice(0, 4).map((item: string, idx: number) => (
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
                    href={`/packages/${pkg.slug}`}
                    className="flex-1 btn-primary text-center flex items-center justify-center gap-2"
                    onClick={onClose}
                  >
                    {t('buttons.viewFullDetails')}
                    <FaExternalLinkAlt size={14} />
                  </Link>
                  <button
                    onClick={() => toggleWishlist(pkg.packageId)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      isInWishlist(pkg.packageId)
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    title={isInWishlist(pkg.packageId) ? t('buttons.removeFromWishlist') : t('buttons.addToWishlist')}
                  >
                    <FaHeart className={isInWishlist(pkg.packageId) ? 'text-white' : ''} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center">
              <p className="text-gray-600">{t('notFound')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
