'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
}

export default function AgentDailyTourBookingClient({
  tourId,
  agentId,
  commissionRate
}: {
  tourId: string;
  agentId: string;
  commissionRate: number;
}) {
  const router = useRouter();
  const [tour, setTour] = useState<DailyTour | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    tourDate: '',
    tourType: 'SIC' as 'SIC' | 'PRIVATE',
    numberOfPax: 2,
    pickupLocation: '',
    hotelName: '',
    specialRequests: '',
  });

  useEffect(() => {
    fetchTour();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tourId]);

  const fetchTour = async () => {
    try {
      const res = await fetch('/api/daily-tours');
      const data = await res.json();
      const foundTour = data.tours.find((t: DailyTour) => t.id === tourId);
      setTour(foundTour || null);
    } catch (error) {
      console.error('Error fetching tour:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculatePrice = () => {
    if (!tour) return 0;

    if (formData.tourType === 'SIC') {
      return tour.sicPrice * formData.numberOfPax;
    } else {
      // Private tour pricing based on number of pax
      if (formData.numberOfPax >= 10) return tour.privateMin10 * formData.numberOfPax;
      if (formData.numberOfPax >= 8) return tour.privateMin8 * formData.numberOfPax;
      if (formData.numberOfPax >= 6) return tour.privateMin6 * formData.numberOfPax;
      if (formData.numberOfPax >= 4) return tour.privateMin4 * formData.numberOfPax;
      return tour.privateMin2 * formData.numberOfPax;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const totalPrice = calculatePrice();
      const commissionAmount = (totalPrice * commissionRate) / 100;

      const response = await fetch('/api/agent/daily-tours/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tourId,
          agentId,
          totalPrice,
          commissionAmount,
          commissionRate,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Booking successful! Reference: ${data.referenceNumber}\nYour commission: €${commissionAmount.toFixed(2)}`);
        router.push('/agent/bookings');
      } else {
        alert(data.error || 'Booking failed');
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tour details...</p>
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Tour not found</p>
          <Link href="/agent/daily-tours" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
            ← Back to Daily Tours
          </Link>
        </div>
      </div>
    );
  }

  const totalPrice = calculatePrice();
  const commissionAmount = (totalPrice * commissionRate) / 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Link href="/agent/daily-tours" className="text-primary-600 hover:text-primary-700 mb-4 inline-block">
          ← Back to Daily Tours
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{tour.title}</h1>
          <p className="text-gray-600 mb-4">{tour.city} • {tour.duration} • Code: {tour.tourCode}</p>
          <p className="text-gray-700">{tour.description}</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Book for Customer</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name *</label>
              <input
                type="text"
                required
                value={formData.guestName}
                onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Customer Email *</label>
              <input
                type="email"
                required
                value={formData.guestEmail}
                onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Customer Phone *</label>
              <input
                type="tel"
                required
                value={formData.guestPhone}
                onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tour Date *</label>
              <input
                type="date"
                required
                value={formData.tourDate}
                onChange={(e) => setFormData({ ...formData, tourDate: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tour Type *</label>
              <select
                value={formData.tourType}
                onChange={(e) => setFormData({ ...formData, tourType: e.target.value as 'SIC' | 'PRIVATE' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="SIC">Shared Tour (SIC)</option>
                <option value="PRIVATE">Private Tour</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Number of Guests *</label>
              <input
                type="number"
                required
                min="1"
                max="50"
                value={formData.numberOfPax}
                onChange={(e) => setFormData({ ...formData, numberOfPax: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Location</label>
              <input
                type="text"
                value={formData.pickupLocation}
                onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                placeholder="Optional"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hotel Name</label>
              <input
                type="text"
                value={formData.hotelName}
                onChange={(e) => setFormData({ ...formData, hotelName: e.target.value })}
                placeholder="Optional"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests</label>
              <textarea
                value={formData.specialRequests}
                onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                rows={3}
                placeholder="Any special requirements..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-700">Total Price:</span>
              <span className="text-2xl font-bold text-gray-900">€{totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Your Commission ({commissionRate}%):</span>
              <span className="font-semibold text-green-600">€{commissionAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <Link
              href="/agent/daily-tours"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {submitting ? 'Creating Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
