'use client';

import { useState } from 'react';
import { FaTimes, FaCalendar, FaUsers, FaMapMarkerAlt, FaHotel } from 'react-icons/fa';

interface DailyTourBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  tourData: {
    id: string;
    title: string;
    tourCode: string;
    sicPrice: number;
    privateMin2: number;
    privateMin4: number;
    privateMin6: number;
    privateMin8: number;
    privateMin10: number;
  };
}

export default function DailyTourBookingModal({ isOpen, onClose, tourData }: DailyTourBookingModalProps) {
  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    tourDate: '',
    tourType: 'SIC', // 'SIC' or 'PRIVATE'
    numberOfPax: 2,
    pickupLocation: '',
    hotelName: '',
    specialRequests: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState('');

  // Calculate price based on tour type and number of guests
  const calculatePrice = () => {
    if (formData.tourType === 'SIC') {
      return tourData.sicPrice * formData.numberOfPax;
    } else {
      // Private tour pricing - per person rate based on group size, multiplied by number of pax
      let perPersonRate = 0;
      if (formData.numberOfPax <= 2) perPersonRate = tourData.privateMin2;
      else if (formData.numberOfPax <= 4) perPersonRate = tourData.privateMin4;
      else if (formData.numberOfPax <= 6) perPersonRate = tourData.privateMin6;
      else if (formData.numberOfPax <= 8) perPersonRate = tourData.privateMin8;
      else perPersonRate = tourData.privateMin10;

      return perPersonRate * formData.numberOfPax;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const totalPrice = calculatePrice();

      const res = await fetch('/api/daily-tours/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tourId: tourData.id,
          guestName: formData.guestName,
          guestEmail: formData.guestEmail,
          guestPhone: formData.guestPhone,
          tourDate: formData.tourDate,
          tourType: formData.tourType,
          numberOfPax: formData.numberOfPax,
          totalPrice,
          pickupLocation: formData.pickupLocation || null,
          hotelName: formData.hotelName || null,
          specialRequests: formData.specialRequests || null,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setReferenceNumber(data.referenceNumber);
      } else {
        setError(data.error || 'Failed to create booking');
      }
    } catch (err) {
      console.error('Booking error:', err);
      setError('Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <FaTimes className="w-6 h-6" />
          </button>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
            <p className="text-gray-600 mb-4">
              Your tour booking has been successfully created.
            </p>

            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Your Reference Number:</p>
              <p className="text-xl font-bold text-teal-700">{referenceNumber}</p>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              We&apos;ve sent a confirmation email to <strong>{formData.guestEmail}</strong>.
              Our team will contact you within 24 hours to confirm pickup details.
            </p>

            <button
              onClick={onClose}
              className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalPrice = calculatePrice();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white p-6 rounded-t-lg relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200"
          >
            <FaTimes className="w-6 h-6" />
          </button>

          <h2 className="text-2xl font-bold mb-2">Book Your Tour</h2>
          <p className="text-teal-100">{tourData.title}</p>
          <p className="text-sm text-teal-200 mt-1">Tour Code: {tourData.tourCode}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Contact Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.guestName}
                  onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.guestEmail}
                  onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.guestPhone}
                  onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="+90 XXX XXX XX XX"
                />
              </div>
            </div>
          </div>

          {/* Tour Details */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tour Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaCalendar className="inline mr-2" />
                  Tour Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.tourDate}
                  onChange={(e) => setFormData({ ...formData, tourDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tour Type *
                </label>
                <select
                  required
                  value={formData.tourType}
                  onChange={(e) => setFormData({ ...formData, tourType: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="SIC">Shared Tour (SIC) - €{tourData.sicPrice}/person</option>
                  <option value="PRIVATE">Private Tour</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaUsers className="inline mr-2" />
                  Number of Guests *
                </label>
                <select
                  required
                  value={formData.numberOfPax}
                  onChange={(e) => setFormData({ ...formData, numberOfPax: parseInt(e.target.value) })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'guest' : 'guests'}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Pickup Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pickup Information</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaMapMarkerAlt className="inline mr-2" />
                  Pickup Location (Optional)
                </label>
                <input
                  type="text"
                  value={formData.pickupLocation}
                  onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="e.g., Sultanahmet, Taksim, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaHotel className="inline mr-2" />
                  Hotel Name (Optional)
                </label>
                <input
                  type="text"
                  value={formData.hotelName}
                  onChange={(e) => setFormData({ ...formData, hotelName: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Your hotel name"
                />
              </div>
            </div>
          </div>

          {/* Special Requests */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special Requests (Optional)
            </label>
            <textarea
              value={formData.specialRequests}
              onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Any dietary requirements, accessibility needs, or special requests..."
            />
          </div>

          {/* Price Summary */}
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Total Price</p>
                <p className="text-xs text-gray-500 mt-1">
                  {formData.tourType === 'SIC'
                    ? `${formData.numberOfPax} guests × €${tourData.sicPrice.toFixed(2)}/person`
                    : (() => {
                        let perPersonRate = 0;
                        if (formData.numberOfPax <= 2) perPersonRate = tourData.privateMin2;
                        else if (formData.numberOfPax <= 4) perPersonRate = tourData.privateMin4;
                        else if (formData.numberOfPax <= 6) perPersonRate = tourData.privateMin6;
                        else if (formData.numberOfPax <= 8) perPersonRate = tourData.privateMin8;
                        else perPersonRate = tourData.privateMin10;
                        return `${formData.numberOfPax} guests × €${perPersonRate.toFixed(2)}/person (private)`;
                      })()}
                </p>
              </div>
              <p className="text-3xl font-bold text-teal-700">€{totalPrice.toFixed(2)}</p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Confirm Booking'}
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            By clicking &quot;Confirm Booking&quot;, you agree to our terms and conditions.
            You&apos;ll receive a confirmation email with all the details.
          </p>
        </form>
      </div>
    </div>
  );
}
