'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { FaShieldAlt, FaLock, FaHeadset } from 'react-icons/fa';

function BookingContent() {
  const searchParams = useSearchParams();

  // Build the booking URL with all parameters
  const bookingParams = new URLSearchParams();

  // Forward all search params to the booking iframe
  searchParams.forEach((value, key) => {
    bookingParams.set(key, value);
  });

  // Always include the partner code
  if (!bookingParams.has('partner')) {
    bookingParams.set('partner', 'funny-tourism');
  }

  const bookingUrl = `https://airporttransferportal.com/booking?${bookingParams.toString()}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Compact Header */}
      <div className="bg-primary-600 text-white py-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">Complete Your Booking</h1>
              <p className="text-primary-100 text-sm">Secure payment & instant confirmation</p>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm">
              <span className="flex items-center gap-2">
                <FaLock className="text-green-400" />
                Secure Payment
              </span>
              <span className="flex items-center gap-2">
                <FaShieldAlt className="text-green-400" />
                Free Cancellation
              </span>
              <span className="flex items-center gap-2">
                <FaHeadset className="text-green-400" />
                24/7 Support
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Form Iframe */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <iframe
            src={bookingUrl}
            width="100%"
            height="800"
            style={{ border: 'none', display: 'block' }}
            title="Complete Your Transfer Booking"
            allow="payment"
          />
        </div>

        {/* Trust Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Powered by Airport Transfer Portal • All bookings are secured with SSL encryption</p>
          <p className="mt-1">Need help? Contact us via WhatsApp: +90 539 502 53 10</p>
        </div>
      </div>
    </div>
  );
}

export default function TransferBookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading booking form...</p>
        </div>
      </div>
    }>
      <BookingContent />
    </Suspense>
  );
}
