'use client';

import { notFound } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { FaClock, FaMapMarkerAlt, FaEuroSign, FaUsers, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import BookingModal from '@/components/BookingModal';

interface PageProps {
  params: Promise<{ tourCode: string }>;
}

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
  included: string | null;
  notIncluded: string | null;
  notes: string | null;
  port: string | null;
  pickupLocations: string | null;
  image: string | null;
  pdfUrl: string | null;
}

export default function DailyTourDetailPage({ params }: PageProps) {
  const [tour, setTour] = useState<DailyTour | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [tourCode, setTourCode] = useState('');

  useEffect(() => {
    const fetchTour = async () => {
      const resolvedParams = await params;
      setTourCode(resolvedParams.tourCode);

      try {
        const res = await fetch(`/api/daily-tours?tourCode=${resolvedParams.tourCode.toUpperCase()}`);
        if (res.ok) {
          const data = await res.json();
          const foundTour = data.tours?.find((t: DailyTour) =>
            t.tourCode.toLowerCase() === resolvedParams.tourCode.toLowerCase()
          );
          setTour(foundTour || null);
        }
      } catch (error) {
        console.error('Error fetching tour:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tour details...</p>
        </div>
      </div>
    );
  }

  if (!tour) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[400px]">
        <Image
          src={tour.image || '/images/destinations/istanbul.jpg'}
          alt={tour.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
            <div className="text-white">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-orange-600 text-white px-4 py-1 rounded-lg text-sm font-semibold">
                  {tour.tourCode}
                </span>
              </div>
              <h1 className="text-5xl font-bold mb-4">{tour.title}</h1>
              <div className="flex items-center gap-6 text-lg">
                <div className="flex items-center gap-2">
                  <FaClock />
                  <span>{tour.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt />
                  <span>{tour.city}</span>
                </div>
                {tour.port && (
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt />
                    <span>Port: {tour.port}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Description */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Tour Description</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{tour.description}</p>
            </div>

            {/* Included/Not Included */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {tour.included && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FaCheckCircle className="text-green-600" />
                    What&apos;s Included
                  </h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{tour.included}</p>
                </div>
              )}

              {tour.notIncluded && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FaTimesCircle className="text-red-600" />
                    Not Included
                  </h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{tour.notIncluded}</p>
                </div>
              )}
            </div>

            {/* Notes */}
            {tour.notes && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Important Notes</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{tour.notes}</p>
              </div>
            )}

            {/* Pickup Locations */}
            {tour.pickupLocations && (
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-blue-600" />
                  Pickup Information
                </h3>
                <p className="text-gray-700">{tour.pickupLocations}</p>
              </div>
            )}
          </div>

          {/* Sidebar - Pricing */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-xl p-6 sticky top-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Pricing</h3>

              {/* SIC Pricing */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-gray-900">SIC (Group Tour)</h4>
                    <p className="text-xs text-gray-600">Guaranteed from 1 pax</p>
                  </div>
                  <FaUsers className="text-2xl text-orange-600" />
                </div>
                <div className="flex items-center gap-2">
                  <FaEuroSign className="text-orange-700" />
                  <span className="text-3xl font-bold text-orange-700">{tour.sicPrice}</span>
                  <span className="text-gray-600">/ person</span>
                </div>
              </div>

              {/* Private Pricing */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6 mb-6">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaUsers className="text-blue-600" />
                  Private Tour Pricing
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">2 Passengers</span>
                    <span className="font-bold text-gray-900">€{tour.privateMin2} / person</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">4 Passengers</span>
                    <span className="font-bold text-gray-900">€{tour.privateMin4} / person</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">6 Passengers</span>
                    <span className="font-bold text-gray-900">€{tour.privateMin6} / person</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">8 Passengers</span>
                    <span className="font-bold text-gray-900">€{tour.privateMin8} / person</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">10+ Passengers</span>
                    <span className="font-bold text-gray-900">€{tour.privateMin10} / person</span>
                  </div>
                </div>
              </div>

              {/* Book Now Button */}
              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="block w-full text-center bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-lg transition-colors"
              >
                Book This Tour
              </button>

              {/* PDF Download */}
              {tour.pdfUrl && (
                <a
                  href={tour.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center border-2 border-gray-300 hover:border-orange-600 text-gray-700 hover:text-orange-600 font-semibold py-3 rounded-lg transition-colors mt-3"
                >
                  Download PDF Details
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        packageData={{
          id: tourCode,
          title: tour.title,
          duration: tour.duration,
          selectedHotel: 'N/A',
          rooms: [1],
          totalPrice: tour.sicPrice,
        }}
      />
    </div>
  );
}
