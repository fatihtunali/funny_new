'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaDownload } from 'react-icons/fa';
import AgentBookingModal from '@/components/agent/AgentBookingModal';
import ItineraryTimeline from '@/components/ItineraryTimeline';

interface Props {
  packageId: string;
}

interface PricingData {
  paxTiers?: Record<string, Record<string, { double: number; triple: number; singleSupplement: number | null }>>;
  perPerson?: number;
  twoAdults?: number;
  fourAdults?: number;
  sixAdults?: number;
  [key: string]: unknown;
}

interface ItineraryDay {
  day: number;
  title: string;
  meals: string;
  description: string;
  highlights?: string[];
}

interface Package {
  id: string;
  packageId: string;
  title: string;
  duration: string;
  description: string;
  destinations: string;
  pricing: PricingData;
  packageType: string;
  image: string;
  itinerary: string | ItineraryDay[];
  highlights: string;
  included: string;
  notIncluded: string;
  pdfUrl?: string;
  hotels?: Record<string, string[]>;
}

interface Agent {
  id: string;
  email: string;
  companyName: string;
  commissionRate: number;
}

export default function AgentPackageDetailClient({ packageId }: Props) {
  const router = useRouter();
  const [pkg, setPkg] = useState<Package | null>(null);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    travelDate: '',
    adults: 2,
    children3to5: 0,
    children6to10: 0,
    hotelCategory: 'fourstar',
    specialRequests: '',
  });

  const fetchPackage = useCallback(async () => {
    try {
      const res = await fetch(`/api/packages/${packageId}`);
      if (!res.ok) throw new Error('Package not found');
      const data = await res.json();
      setPkg(data.package);
    } catch (error) {
      console.error('Error fetching package:', error);
      router.push('/agent/packages');
    } finally {
      setLoading(false);
    }
  }, [packageId, router]);

  const fetchAgentData = useCallback(async () => {
    try {
      const res = await fetch('/api/agent/me');
      if (!res.ok) throw new Error('Not authenticated');
      const data = await res.json();
      setAgent(data.agent);
    } catch (error) {
      console.error('Error fetching agent data:', error);
    }
  }, []);

  useEffect(() => {
    fetchPackage();
    fetchAgentData();
  }, [fetchPackage, fetchAgentData]);

  const parseItinerary = (): ItineraryDay[] => {
    if (!pkg?.itinerary) return [];
    try {
      return typeof pkg.itinerary === 'string' ? JSON.parse(pkg.itinerary) : pkg.itinerary;
    } catch (error) {
      console.error('Error parsing itinerary:', error);
      return [];
    }
  };

  const calculatePrice = () => {
    if (!pkg) return 0;

    try {
      // Single pricing for everyone (agents see same prices as customers)
      const pricing = pkg.pricing;
      console.log('📦 Package pricing data:', JSON.stringify({
        hasPricing: !!pkg.pricing,
        pricingData: pricing,
        agentCommission: agent?.commissionRate || 0
      }, null, 2));

      if (!pricing) {
        console.error('❌ No pricing data available for package');
        return 0;
      }

      if (pkg.packageType === 'LAND_ONLY') {
        const totalPax = bookingData.adults + bookingData.children3to5 + bookingData.children6to10;

        // Handle different pricing formats
        let pricePerPerson = 0;

        // Format 1: { perPerson: 500 }
        if (pricing.perPerson) {
          pricePerPerson = pricing.perPerson;
        }
        // Format 2: { twoAdults: 415, fourAdults: 369, sixAdults: 355 }
        else if (pricing.twoAdults || pricing.fourAdults || pricing.sixAdults) {
          // Select price based on group size
          if (totalPax >= 6 && pricing.sixAdults) {
            pricePerPerson = pricing.sixAdults;
          } else if (totalPax >= 4 && pricing.fourAdults) {
            pricePerPerson = pricing.fourAdults;
          } else if (pricing.twoAdults) {
            pricePerPerson = pricing.twoAdults;
          } else {
            console.error('❌ No valid land-only pricing found');
            return 0;
          }
        } else {
          console.error('❌ Land only package missing pricing data');
          return 0;
        }

        const totalPrice = pricePerPerson * totalPax;
        console.log('✅ Calculated land-only price:', {
          totalPax,
          pricePerPerson,
          totalPrice,
          pricingStructure: pricing
        });
        return totalPrice;
      } else {
        // Check if using paxTiers pricing structure (new format)
        if (pricing.paxTiers) {
          const adults = bookingData.adults || 0;
          const children = (bookingData.children3to5 || 0) + (bookingData.children6to10 || 0);
          const totalPax = adults + children;

          // Find appropriate pax tier (use the tier >= totalPax, or highest available)
          const availableTiers = Object.keys(pricing.paxTiers).map(Number).sort((a, b) => a - b);
          const selectedTier = availableTiers.find(tier => tier >= totalPax) || availableTiers[availableTiers.length - 1];

          console.log('📊 PaxTiers calculation:', JSON.stringify({
            totalPax,
            availableTiers,
            selectedTier,
            hotelCategory: bookingData.hotelCategory
          }, null, 2));

          const tierPricing = pricing.paxTiers[selectedTier]?.[bookingData.hotelCategory];

          if (!tierPricing) {
            console.error('❌ Tier pricing not found for:', selectedTier, bookingData.hotelCategory);
            return 0;
          }

          // Calculate based on room configuration
          const doubleRooms = Math.floor(adults / 2);
          const singleRooms = adults % 2;

          const doublePrice = tierPricing.double || 0;
          const singleSupplement = tierPricing.singleSupplement || 0;

          // Calculate total: (double rooms * 2 people * PP in DBL) + (single rooms * (PP in DBL + single supplement))
          let total = (doubleRooms * 2 * doublePrice);

          if (singleRooms > 0) {
            total += singleRooms * (doublePrice + singleSupplement);
          }

          // Add children pricing (50% of double price)
          if (children > 0 && doublePrice) {
            total += children * (doublePrice * 0.5);
          }

          console.log('✅ PaxTiers price calculation:', JSON.stringify({
            selectedTier,
            adults,
            children,
            doubleRooms,
            singleRooms,
            doublePrice,
            singleSupplement,
            calculation: `(${doubleRooms} * 2 * ${doublePrice}) + (${singleRooms} * (${doublePrice} + ${singleSupplement})) + (${children} * ${doublePrice} * 0.5)`,
            total
          }, null, 2));

          return total;

        } else {
          // Fallback: Old simple pricing format (for backward compatibility)
          const hotelPricing = pricing[bookingData.hotelCategory] as { double?: number; single?: number; triple?: number } | undefined;
          console.log(`🏨 Hotel category lookup (legacy):`, JSON.stringify({
            lookingFor: bookingData.hotelCategory,
            availableCategories: Object.keys(pricing),
            foundPricing: hotelPricing,
            pricingStructure: pricing
          }, null, 2));

          if (!hotelPricing) {
            console.error('❌ Hotel pricing not found for category:', bookingData.hotelCategory);
            console.error('Available categories:', Object.keys(pricing));
            return 0;
          }

          const adults = bookingData.adults || 0;
          const children = (bookingData.children3to5 || 0) + (bookingData.children6to10 || 0);

          // Calculate based on room configuration
          const doubleRooms = Math.floor(adults / 2);
          const singleRooms = adults % 2;

          const doublePrice = hotelPricing.double || 0;
          const singlePrice = hotelPricing.single || 0;

          let total = (doubleRooms * doublePrice * 2) + (singleRooms * singlePrice);

          // Add children (assuming they share with adults)
          if (children > 0 && doublePrice) {
            total += children * (doublePrice * 0.5);
          }

          console.log('✅ Legacy price calculation:', JSON.stringify({
            adults,
            children,
            doubleRooms,
            singleRooms,
            doublePrice,
            singlePrice,
            hotelCategory: bookingData.hotelCategory,
            calculation: `(${doubleRooms} * ${doublePrice} * 2) + (${singleRooms} * ${singlePrice}) + (${children} * ${doublePrice} * 0.5)`,
            total
          }, null, 2));

          return total;
        }
      }
    } catch (error) {
      console.error('❌ Price calculation error:', error);
      return 0;
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading package...</p>
        </div>
      </div>
    );
  }

  if (!pkg) return null;

  // Calculate price dynamically based on current booking data
  const totalPrice = calculatePrice();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">{pkg.title}</h1>
            <div className="flex gap-3">
              {pkg.pdfUrl && (
                <a
                  href={pkg.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-primary-600 hover:text-primary-700 border border-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
                >
                  <FaDownload /> Download PDF
                </a>
              )}
              <Link
                href="/agent/packages"
                className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ← Back to Packages
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Package Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="relative w-full h-64">
                <Image src={pkg.image} alt={pkg.title} fill className="object-cover" />
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                  <span>📍 {pkg.destinations}</span>
                  <span>📅 {pkg.duration}</span>
                  <span>#{pkg.packageId}</span>
                  {agent && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                      {agent.commissionRate}% Commission
                    </span>
                  )}
                </div>
                <p className="text-gray-700">{pkg.description}</p>
              </div>
            </div>

            {/* Highlights */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Highlights</h2>
              <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: pkg.highlights }} />
            </div>

            {/* Itinerary */}
            {parseItinerary().length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Day by Day Itinerary</h2>
                <ItineraryTimeline itinerary={parseItinerary()} />
              </div>
            )}

            {/* Hotels */}
            {pkg.hotels && Object.keys(pkg.hotels).length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Accommodation Options</h2>
                <div className="space-y-4">
                  {Object.entries(pkg.hotels).map(([category, hotelList]) => (
                    <div key={category}>
                      <h3 className="text-sm font-semibold text-gray-700 uppercase mb-2">
                        {category.replace('star', '-Star Hotels')}
                      </h3>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        {hotelList.map((hotel, idx) => (
                          <li key={idx} className="text-sm">{hotel}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Included/Not Included */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">✅ Included</h3>
                <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: pkg.included }} />
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">❌ Not Included</h3>
                <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: pkg.notIncluded }} />
              </div>
            </div>
          </div>

          {/* Booking Configuration */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 lg:sticky lg:top-4 space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Create Booking</h2>

              {/* Hotel Category */}
              {pkg.packageType !== 'LAND_ONLY' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hotel Category</label>
                  <select
                    value={bookingData.hotelCategory}
                    onChange={(e) => setBookingData({ ...bookingData, hotelCategory: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="threestar">3-Star</option>
                    <option value="fourstar">4-Star</option>
                    <option value="fivestar">5-Star</option>
                  </select>
                </div>
              )}

              {/* Travelers */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Travelers</label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Adults</label>
                    <input
                      type="number"
                      min="1"
                      value={bookingData.adults}
                      onChange={(e) => setBookingData({ ...bookingData, adults: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">3-5y</label>
                    <input
                      type="number"
                      min="0"
                      value={bookingData.children3to5}
                      onChange={(e) => setBookingData({ ...bookingData, children3to5: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">6-10y</label>
                    <input
                      type="number"
                      min="0"
                      value={bookingData.children6to10}
                      onChange={(e) => setBookingData({ ...bookingData, children6to10: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing Summary */}
              <div className="pt-4 border-t">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Customer Price:</span>
                    {totalPrice > 0 ? (
                      <span className="text-2xl font-bold text-primary-600">€{totalPrice.toFixed(2)}</span>
                    ) : (
                      <span className="text-sm text-red-600">Configure options</span>
                    )}
                  </div>

                  {totalPrice > 0 && agent && (
                    <>
                      <div className="flex justify-between items-center pt-3 border-t border-gray-300">
                        <span className="text-sm text-gray-600">Your Commission ({agent.commissionRate}%):</span>
                        <span className="text-lg font-semibold text-green-600">
                          €{(totalPrice * (agent.commissionRate / 100)).toFixed(2)}
                        </span>
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded p-2 mt-2">
                        <p className="text-xs text-blue-800">
                          💡 Customer pays €{totalPrice.toFixed(2)} • You earn €{(totalPrice * (agent.commissionRate / 100)).toFixed(2)} commission
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Book Button */}
              <button
                onClick={() => setShowBookingForm(true)}
                disabled={totalPrice === 0}
                className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Book
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Booking Modal */}
      <AgentBookingModal
        isOpen={showBookingForm}
        onClose={() => setShowBookingForm(false)}
        packageData={{
          id: pkg.id,
          packageId: pkg.packageId,
          title: pkg.title,
          duration: pkg.duration,
          packageType: pkg.packageType
        }}
        bookingConfig={{
          hotelCategory: bookingData.hotelCategory,
          adults: bookingData.adults,
          children3to5: bookingData.children3to5,
          children6to10: bookingData.children6to10,
          totalPrice: totalPrice
        }}
        agent={agent}
      />
    </div>
  );
}
