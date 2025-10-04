'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Props {
  packageId: string;
}

interface Package {
  id: string;
  packageId: string;
  title: string;
  duration: string;
  description: string;
  destinations: string;
  pricing: string;
  b2bPricing: string | null;
  packageType: string;
  image: string;
  itinerary: string;
  highlights: string;
  included: string;
  notIncluded: string;
}

export default function AgentPackageDetailClient({ packageId }: Props) {
  const router = useRouter();
  const [pkg, setPkg] = useState<Package | null>(null);
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
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');

  useEffect(() => {
    fetchPackage();
  }, [packageId]);

  const fetchPackage = async () => {
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
  };

  const calculatePrice = () => {
    if (!pkg) return 0;

    try {
      // Agents should use B2B pricing if available, otherwise fall back to public pricing
      const pricingStr = pkg.b2bPricing || pkg.pricing;
      console.log('📦 Package pricing data:', {
        hasB2BPricing: !!pkg.b2bPricing,
        hasPricing: !!pkg.pricing,
        usingB2B: !!pkg.b2bPricing,
        pricingStr: pricingStr
      });

      if (!pricingStr) {
        console.error('❌ No pricing data available for package');
        return 0;
      }

      const pricing = JSON.parse(pricingStr);
      console.log('💰 Parsed pricing:', pricing);

      if (pkg.packageType === 'LAND_ONLY') {
        const total = bookingData.adults + bookingData.children3to5 + bookingData.children6to10;
        if (!pricing.perPerson) {
          console.error('❌ Land only package missing perPerson pricing');
          return 0;
        }
        const totalPrice = pricing.perPerson * total;
        console.log('✅ Calculated land-only price:', totalPrice);
        return totalPrice;
      } else {
        const hotelPricing = pricing[bookingData.hotelCategory];
        console.log(`🏨 Looking for hotel category: ${bookingData.hotelCategory}`, {
          availableCategories: Object.keys(pricing),
          foundPricing: hotelPricing
        });

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

        let total = (doubleRooms * (hotelPricing.double || 0) * 2) + (singleRooms * (hotelPricing.single || 0));

        // Add children (assuming they share with adults)
        if (children > 0 && hotelPricing.double) {
          total += children * (hotelPricing.double * 0.5);
        }

        console.log('✅ Calculated hotel package price:', {
          adults,
          children,
          doubleRooms,
          singleRooms,
          hotelCategory: bookingData.hotelCategory,
          total
        });

        return total;
      }
    } catch (error) {
      console.error('❌ Price calculation error:', error);
      return 0;
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError('');
    setBookingLoading(true);

    try {
      const totalPrice = calculatePrice();

      const res = await fetch('/api/agent/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageName: pkg?.title,
          packageId: pkg?.packageId,
          travelDate: bookingData.travelDate,
          duration: pkg?.duration,
          hotelCategory: bookingData.hotelCategory,
          adults: bookingData.adults,
          children3to5: bookingData.children3to5,
          children6to10: bookingData.children6to10,
          totalPrice,
          currency: 'EUR',
          specialRequests: bookingData.specialRequests,
          guestName: bookingData.guestName,
          guestEmail: bookingData.guestEmail,
          guestPhone: bookingData.guestPhone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setBookingError(data.error || 'Failed to create booking');
        return;
      }

      // Success - redirect to bookings
      router.push('/agent/bookings');
    } catch (error) {
      setBookingError('An error occurred. Please try again.');
    } finally {
      setBookingLoading(false);
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
            <Link
              href="/agent/packages"
              className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← Back to Packages
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Package Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <img src={pkg.image} alt={pkg.title} className="w-full h-64 object-cover" />
              <div className="p-6">
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                  <span>📍 {pkg.destinations}</span>
                  <span>📅 {pkg.duration}</span>
                  <span>#{pkg.packageId}</span>
                  {pkg.b2bPricing && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                      B2B Rate Applied
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

          {/* Booking Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 lg:sticky lg:top-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Create Booking</h2>

              {!showBookingForm ? (
                <button
                  onClick={() => setShowBookingForm(true)}
                  className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
                >
                  Book for Customer
                </button>
              ) : (
                <form onSubmit={handleBooking} className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
                  {bookingError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
                      {bookingError}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Customer Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={bookingData.guestName}
                      onChange={(e) => setBookingData({ ...bookingData, guestName: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Customer Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="customer@email.com"
                      value={bookingData.guestEmail}
                      onChange={(e) => setBookingData({ ...bookingData, guestEmail: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Customer Phone
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 234 567 8900"
                      value={bookingData.guestPhone}
                      onChange={(e) => setBookingData({ ...bookingData, guestPhone: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Travel Date *
                    </label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={bookingData.travelDate}
                      onChange={(e) => setBookingData({ ...bookingData, travelDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                    />
                  </div>

                  {pkg.packageType !== 'LAND_ONLY' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hotel Category
                      </label>
                      <select
                        value={bookingData.hotelCategory}
                        onChange={(e) => setBookingData({ ...bookingData, hotelCategory: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="threestar">3-Star</option>
                        <option value="fourstar">4-Star</option>
                        <option value="fivestar">5-Star</option>
                      </select>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Adults</label>
                      <input
                        type="number"
                        min="1"
                        value={bookingData.adults}
                        onChange={(e) => setBookingData({ ...bookingData, adults: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">3-5y</label>
                      <input
                        type="number"
                        min="0"
                        value={bookingData.children3to5}
                        onChange={(e) => setBookingData({ ...bookingData, children3to5: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">6-10y</label>
                      <input
                        type="number"
                        min="0"
                        value={bookingData.children6to10}
                        onChange={(e) => setBookingData({ ...bookingData, children6to10: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Special Requests
                    </label>
                    <textarea
                      rows={3}
                      value={bookingData.specialRequests}
                      onChange={(e) => setBookingData({ ...bookingData, specialRequests: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-700 font-medium">Total Price:</span>
                      {totalPrice > 0 ? (
                        <span className="text-2xl font-bold text-primary-600">€{totalPrice.toFixed(2)}</span>
                      ) : (
                        <div className="text-right">
                          <span className="text-sm text-red-600 block">Price unavailable</span>
                          <span className="text-xs text-gray-500">Check console for details</span>
                        </div>
                      )}
                    </div>
                    {totalPrice === 0 && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                        <p className="text-sm text-yellow-800">
                          <strong>Note:</strong> This package may not have B2B pricing configured yet.
                          Please check the browser console for details or contact admin.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <button
                      type="submit"
                      disabled={bookingLoading}
                      className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50"
                    >
                      {bookingLoading ? 'Creating Booking...' : 'Create Booking'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowBookingForm(false)}
                      className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
