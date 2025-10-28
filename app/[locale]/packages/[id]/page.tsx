'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { FaClock, FaHotel, FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaDownload } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import BookingModal from '@/components/BookingModal';
import StructuredData, { generateTourPackageSchema, generateBreadcrumbSchema, type PackageSchemaData } from '@/components/StructuredData';
import { PackageDetailSkeleton } from '@/components/LoadingSkeleton';
import { useTranslations, useLocale } from 'next-intl';

export default function PackageDetailPage() {
  const params = useParams();
  const packageId = params.id as string;
  const t = useTranslations('packageDetailPage');
  const locale = useLocale();

  interface PkgData {
    title: string;
    description: string;
    image: string;
    packageId: string;
    slug: string;
    packageType?: string;
    duration: string;
    destinations: string[];
    itinerary: Array<{ day: number; title: string; description: string; meals: string }>;
    included: string[];
    notIncluded: string[];
    hotels: Record<string, string[]>;
    highlights: string | string[];
    pdfUrl?: string;
    pricing?: {
      paxTiers?: Record<string, Record<string, Record<string, number>>>;
    };
  }

  const [pkg, setPkg] = useState<PkgData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedHotel, setSelectedHotel] = useState('fourstar');
  const [rooms, setRooms] = useState<number[]>([2]); // Array of people per room, default: 1 room with 2 people
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const res = await fetch(`/api/packages/${packageId}?locale=${locale}`);
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
    fetchPackage();
  }, [packageId, locale]);

  if (loading) {
    return <PackageDetailSkeleton />;
  }

  if (!pkg) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('packageNotFound')}</h1>
          <Link href="/packages" className="btn-primary">
            {t('backToPackages')}
          </Link>
        </div>
      </div>
    );
  }

  const getTotalPax = () => {
    return rooms.reduce((sum, pax) => sum + pax, 0);
  };

  const calculatePrice = () => {
    const totalPax = getTotalPax();
    let totalPrice = 0;

    if (!pkg.pricing) return 0;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pricing = pkg.pricing as any;

    // Handle LAND_ONLY packages with tiered per-person pricing
    if (pricing.twoAdults || pricing.fourAdults || pricing.sixAdults) {
      let pricePerPerson = 0;

      // Select price based on total group size
      if (totalPax >= 6 && pricing.sixAdults) {
        pricePerPerson = pricing.sixAdults;
      } else if (totalPax >= 4 && pricing.fourAdults) {
        pricePerPerson = pricing.fourAdults;
      } else if (pricing.twoAdults) {
        pricePerPerson = pricing.twoAdults;
      } else if (pricing.perPerson) {
        pricePerPerson = pricing.perPerson;
      }

      totalPrice = pricePerPerson * totalPax;
    }
    // Check if pricing uses new paxTiers structure
    else if (pricing.paxTiers) {
      // Find the appropriate pax tier (use the tier >= totalPax, or highest available)
      const availableTiers = Object.keys(pricing.paxTiers).map(Number).sort((a, b) => a - b);
      const paxTier = availableTiers.find(tier => tier >= totalPax) || availableTiers[availableTiers.length - 1];
      const tierPricing = pricing.paxTiers[paxTier]?.[selectedHotel];

      if (tierPricing) {
        rooms.forEach(paxInRoom => {
          let pricePerPerson = 0;

          if (paxInRoom === 1) {
            // Single room: use singleSupplement if available, otherwise double + 50%
            pricePerPerson = tierPricing.singleSupplement || (tierPricing.double * 1.5);
          } else if (paxInRoom === 2) {
            pricePerPerson = tierPricing.double || 0;
          } else {
            pricePerPerson = tierPricing.triple || tierPricing.double || 0;
          }

          totalPrice += pricePerPerson * paxInRoom;
        });
      }
    } else {
      // Fallback to old hotel structure
      rooms.forEach(paxInRoom => {
        const roomType = paxInRoom === 1 ? 'single' : paxInRoom === 2 ? 'double' : 'triple';
        const pricePerPerson = pricing[selectedHotel]?.[roomType] || 0;
        totalPrice += pricePerPerson * paxInRoom;
      });
    }

    return Math.round(totalPrice);
  };

  const addRoom = () => {
    if (getTotalPax() < 10) {
      setRooms([...rooms, 1]);
    }
  };

  const removeRoom = (index: number) => {
    if (rooms.length > 1) {
      setRooms(rooms.filter((_, i) => i !== index));
    }
  };

  const updateRoomPax = (index: number, pax: number) => {
    const newRooms = [...rooms];
    newRooms[index] = pax;
    setRooms(newRooms);
  };

  // Generate structured data
  const packageSchema = generateTourPackageSchema(pkg as unknown as PackageSchemaData);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Packages', url: '/packages' },
    { name: pkg.title, url: `/packages/${pkg.slug}` }
  ]);

  return (
    <div className="min-h-screen bg-white">
      <StructuredData data={packageSchema} />
      <StructuredData data={breadcrumbSchema} />

      {/* Hero Section */}
      <div className="relative h-[50vh] min-h-[400px]">
        <Image
          src={pkg.image}
          alt={pkg.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70" />
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white px-4"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{pkg.title}</h1>
            <p className="text-xl md:text-2xl mb-4">{pkg.duration}</p>
            <div className="flex flex-wrap justify-center gap-2">
              {pkg.destinations.map((dest: string) => (
                <span key={dest} className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  {dest}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="section-container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Package Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('overview')}</h2>
              <p className="text-gray-700 leading-relaxed text-lg">{pkg.description}</p>
            </section>

            {/* Highlights */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('packageHighlights')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(Array.isArray(pkg.highlights) ? pkg.highlights : [pkg.highlights]).map((highlight: string, index: number) => (
                  <div key={index} className="flex items-start">
                    <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{highlight}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Itinerary */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('dayByDayItinerary')}</h2>
              <div className="space-y-6">
                {pkg.itinerary.map((day) => (
                  <motion.div
                    key={day.day}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center mb-3">
                      <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4">
                        {day.day}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{day.title}</h3>
                    </div>
                    <p className="text-gray-700 mb-2">{day.description}</p>
                    <p className="text-sm text-gray-500">
                      <span className="font-semibold">{t('meals')}:</span> {day.meals}
                    </p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* What's Included / Not Included */}
            <section>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <svg className="w-6 h-6 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {t('whatsIncluded')}
                  </h3>
                  <ul className="space-y-2">
                    {pkg.included.map((item, index) => (
                      <li key={index} className="text-gray-700 text-sm flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-red-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <svg className="w-6 h-6 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {t('notIncluded')}
                  </h3>
                  <ul className="space-y-2">
                    {pkg.notIncluded.map((item, index) => (
                      <li key={index} className="text-gray-700 text-sm flex items-start">
                        <span className="text-red-600 mr-2">✗</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Hotels - Only show for WITH_HOTEL packages */}
            {pkg.packageType !== 'LAND_ONLY' && Object.keys(pkg.hotels).length > 0 && (
              <section>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('accommodationOptions')}</h2>
                <div className="space-y-4">
                  {Object.entries(pkg.hotels).map(([category, hotels]) => (
                    <div key={category} className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-bold text-gray-900 capitalize mb-2">
                        {category.replace('star', '-Star')} Hotels
                      </h3>
                      <p className="text-gray-700 text-sm">{(hotels as string[]).join(', ')}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column - Booking Widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {/* Price Calculator */}
              <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('bookThisPackage')}</h3>

                {/* Hotel Category - Only show for WITH_HOTEL packages */}
                {pkg.packageType !== 'LAND_ONLY' && (
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t('hotelCategory')}</label>
                    <select
                      value={selectedHotel}
                      onChange={(e) => setSelectedHotel(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="threestar">{t('threeStarHotels')}</option>
                      <option value="fourstar">{t('fourStarHotels')}</option>
                      <option value="fivestar">{t('fiveStarHotels')}</option>
                    </select>
                  </div>
                )}

                {/* Room Configuration - Only show for WITH_HOTEL packages */}
                {pkg.packageType !== 'LAND_ONLY' && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      {t('roomConfiguration')}
                    </label>
                    <span className="text-xs text-gray-500">
                      {t('total')}: {getTotalPax()} {getTotalPax() === 1 ? t('person') : t('people')}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {rooms.map((pax, index) => {
                      const roomType = pax === 1 ? t('single') : pax === 2 ? t('double') : t('triple');
                      return (
                        <div key={index} className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-gray-700">
                              {t('room')} {index + 1}: {roomType}
                            </span>
                            {rooms.length > 1 && (
                              <button
                                onClick={() => removeRoom(index)}
                                className="text-red-500 hover:text-red-700 text-xs"
                              >
                                {t('remove')}
                              </button>
                            )}
                          </div>
                          <select
                            value={pax}
                            onChange={(e) => updateRoomPax(index, parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 text-sm"
                          >
                            <option value={1}>{t('onePerson')}</option>
                            <option value={2}>{t('twoPeople')}</option>
                            <option value={3}>{t('threePeople')}</option>
                          </select>
                        </div>
                      );
                    })}
                  </div>

                  {getTotalPax() < 10 && (
                    <button
                      onClick={addRoom}
                      className="mt-3 w-full px-4 py-2 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 hover:bg-blue-50 text-sm font-semibold transition-colors"
                    >
                      {t('addAnotherRoom')}
                    </button>
                  )}

                  <p className="text-xs text-gray-500 mt-2">
                    {t('maximumRoomInfo')}
                  </p>
                </div>
                )}

                {/* Travelers - For LAND_ONLY packages */}
                {pkg.packageType === 'LAND_ONLY' && (
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t('numberOfTravelers')}</label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={getTotalPax()}
                      onChange={(e) => setRooms([parseInt(e.target.value) || 1])}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      {t('perPersonPricing')}
                    </p>
                  </div>
                )}

                {/* Price Display */}
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">{t('totalPrice')}:</span>
                    <span className="text-3xl font-bold text-blue-600">€{calculatePrice()}</span>
                  </div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <p>{t('perPerson')}: €{getTotalPax() > 0 ? (calculatePrice() / getTotalPax()).toFixed(0) : 0}</p>
                    <p>{t('rooms')}: {rooms.length}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={() => setIsBookingModalOpen(true)}
                    className="btn-primary w-full text-center flex items-center justify-center"
                  >
                    <FaCalendarAlt className="mr-2" />
                    {t('requestBooking')}
                  </button>
                  <a
                    href={pkg.pdfUrl}
                    download
                    className="btn-secondary w-full text-center flex items-center justify-center"
                  >
                    <FaDownload className="mr-2" />
                    {t('downloadPDF')}
                  </a>
                </div>
              </div>

              {/* Quick Info */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-bold text-gray-900 mb-4">{t('quickInfo')}</h4>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center text-gray-700">
                    <FaClock className="mr-3 text-blue-600" />
                    {pkg.duration}
                  </li>
                  <li className="flex items-center text-gray-700">
                    <FaMapMarkerAlt className="mr-3 text-blue-600" />
                    {pkg.destinations.join(', ')}
                  </li>
                  {pkg.packageType !== 'LAND_ONLY' && (
                    <li className="flex items-center text-gray-700">
                      <FaHotel className="mr-3 text-blue-600" />
                      {t('hotelStars')}
                    </li>
                  )}
                  <li className="flex items-center text-gray-700">
                    <FaUsers className="mr-3 text-blue-600" />
                    {pkg.packageType === 'LAND_ONLY' ? t('landServicesOnly') : t('sicGroupTours')}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        packageData={{
          id: packageId,
          title: pkg.title,
          duration: pkg.duration,
          selectedHotel: selectedHotel,
          rooms: rooms,
          totalPrice: calculatePrice(),
        }}
      />
    </div>
  );
}
