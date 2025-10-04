'use client';

import { useState, useEffect } from 'react';
import { FaTimes, FaCalendarAlt, FaWhatsapp } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageData: {
    id: string;
    title: string;
    duration: string;
    selectedHotel: string;
    rooms: number[];
    totalPrice: number;
  };
}

export default function BookingModal({ isOpen, onClose, packageData }: BookingModalProps) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Form fields
  const [travelDate, setTravelDate] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      checkAuth();
    }
  }, [isOpen]);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setIsLoggedIn(true);
        // Pre-fill guest fields for logged-in users
        setGuestName(data.user.name || '');
        setGuestEmail(data.user.email || '');
        setGuestPhone(data.user.phone || '');
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      setIsLoggedIn(false);
    } finally {
      setCheckingAuth(false);
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const totalPax = packageData.rooms.reduce((sum, pax) => sum + pax, 0);

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageName: packageData.title,
          packageId: packageData.id,
          travelDate,
          duration: packageData.duration,
          hotelCategory: packageData.selectedHotel,
          adults: totalPax,
          children3to5: 0,
          children6to10: 0,
          totalPrice: packageData.totalPrice,
          currency: 'EUR',
          specialRequests,
          // Guest fields (only sent if not logged in)
          guestName: isLoggedIn ? null : guestName,
          guestEmail: isLoggedIn ? null : guestEmail,
          guestPhone: isLoggedIn ? null : guestPhone,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        // Redirect to success page with booking reference
        router.push(`/booking-success?ref=${data.booking.referenceNumber}&guest=${!isLoggedIn}`);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to create booking');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleWhatsAppBooking = () => {
    const totalPax = packageData.rooms.reduce((sum, pax) => sum + pax, 0);
    const roomDetails = packageData.rooms.map((pax, idx) => {
      const type = pax === 1 ? 'Single' : pax === 2 ? 'Double' : 'Triple';
      return `Room ${idx + 1}: ${type} (${pax} ${pax === 1 ? 'person' : 'people'})`;
    }).join('\n');

    const message = encodeURIComponent(
      `Hello! I'm interested in booking:\n\n` +
      `📦 Package: ${packageData.title}\n` +
      `🏨 Hotel Category: ${packageData.selectedHotel.replace('star', '-Star')}\n` +
      `👥 Total Guests: ${totalPax}\n` +
      `🛏️ Rooms:\n${roomDetails}\n` +
      `💰 Total Price: €${packageData.totalPrice}\n` +
      `📅 Duration: ${packageData.duration}\n\n` +
      `Please help me complete this booking.`
    );

    window.open(`https://wa.me/905373743134?text=${message}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <FaTimes className="w-6 h-6" />
          </button>

          {/* Header */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Request Booking</h2>

          {checkingAuth ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading...</p>
            </div>
          ) : (
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              {/* Package Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h3 className="font-bold text-gray-900 mb-2">{packageData.title}</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Hotel: {packageData.selectedHotel.replace('star', '-Star')}</p>
                  <p>Guests: {packageData.rooms.reduce((sum, pax) => sum + pax, 0)}</p>
                  <p>Rooms: {packageData.rooms.length}</p>
                  <p className="font-bold text-blue-600 text-lg mt-2">Total: €{packageData.totalPrice}</p>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm">
                  {error}
                </div>
              )}

              {/* Contact Information */}
              {!isLoggedIn && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                      required
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                      required
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                      required
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                </>
              )}

              {/* Travel Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Travel Date *
                </label>
                <input
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Special Requests (Optional)
                </label>
                <textarea
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  placeholder="Any special requirements or requests..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-primary flex items-center justify-center"
              >
                <FaCalendarAlt className="mr-2" />
                {submitting ? 'Creating Booking...' : 'Confirm Booking'}
              </button>

              {/* WhatsApp Alternative */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleWhatsAppBooking}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center transition-colors"
              >
                <FaWhatsapp className="mr-2 text-xl" />
                Book via WhatsApp
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
