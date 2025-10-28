'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { FaTimes, FaUser, FaEnvelope, FaPhone, FaPlane, FaSuitcase } from 'react-icons/fa';
import { trackTransferBooking } from '@/lib/gtag';

interface TransferBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  transferData: {
    transferId: string;
    fromLocation: string;
    toLocation: string;
    price: number;
    vehicleType: string;
    passengers: number;
    date: string;
    time: string;
    duration?: string;
  };
}

export default function TransferBookingModal({ isOpen, onClose, transferData }: TransferBookingModalProps) {
  const t = useTranslations('transferBookingModal');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState('');

  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    flightNumber: '',
    numberOfLuggage: '',
    specialRequests: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/transfers/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transferId: transferData.transferId,
          ...formData,
          transferDate: transferData.date,
          transferTime: transferData.time,
          numberOfPassengers: transferData.passengers,
          totalPrice: transferData.price,
          vehicleType: transferData.vehicleType,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setReferenceNumber(data.referenceNumber);
        // Track Google Ads conversion
        trackTransferBooking(transferData.price, data.referenceNumber);
      } else {
        alert(t('errors.bookingFailed') + ': ' + (data.error || t('errors.unknown')));
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert(t('errors.errorCreating'));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('success.title')}</h2>
            <p className="text-gray-600 mb-4">
              {t('success.message')}
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">{t('success.referenceLabel')}</p>
              <p className="text-xl font-bold text-primary-600">{referenceNumber}</p>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              {t('success.confirmationEmail', { email: formData.guestEmail })}
            </p>
            <button
              onClick={() => {
                setSuccess(false);
                onClose();
              }}
              className="w-full btn-primary"
            >
              {t('success.closeButton')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-2xl w-full my-8">
        {/* Header */}
        <div className="bg-primary-600 text-white p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{t('title')}</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200"
            >
              <FaTimes className="text-2xl" />
            </button>
          </div>
        </div>

        {/* Booking Summary */}
        <div className="bg-gray-50 p-6 border-b">
          <h3 className="font-semibold text-gray-900 mb-3">{t('sections.transferDetails')}</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">{t('fields.from')}</p>
              <p className="font-semibold">{transferData.fromLocation}</p>
            </div>
            <div>
              <p className="text-gray-600">{t('fields.to')}</p>
              <p className="font-semibold">{transferData.toLocation}</p>
            </div>
            <div>
              <p className="text-gray-600">{t('fields.dateTime')}</p>
              <p className="font-semibold">{transferData.date} {t('fields.at')} {transferData.time}</p>
            </div>
            <div>
              <p className="text-gray-600">{t('fields.passengers')}</p>
              <p className="font-semibold">{transferData.passengers} {t('passengerCount', { count: transferData.passengers })}</p>
            </div>
            <div>
              <p className="text-gray-600">{t('fields.vehicle')}</p>
              <p className="font-semibold">{transferData.vehicleType}</p>
            </div>
            <div>
              <p className="text-gray-600">{t('fields.totalPrice')}</p>
              <p className="font-semibold text-primary-600">€{transferData.price}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaUser className="inline mr-2 text-gray-400" />
                {t('fields.fullName')} *
              </label>
              <input
                type="text"
                required
                value={formData.guestName}
                onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder={t('placeholders.name')}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaEnvelope className="inline mr-2 text-gray-400" />
                {t('fields.email')} *
              </label>
              <input
                type="email"
                required
                value={formData.guestEmail}
                onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder={t('placeholders.email')}
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaPhone className="inline mr-2 text-gray-400" />
                {t('fields.phone')} *
              </label>
              <input
                type="tel"
                required
                value={formData.guestPhone}
                onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder={t('placeholders.phone')}
              />
            </div>

            {/* Flight Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaPlane className="inline mr-2 text-gray-400" />
                {t('fields.flightNumber')}
              </label>
              <input
                type="text"
                value={formData.flightNumber}
                onChange={(e) => setFormData({ ...formData, flightNumber: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder={t('placeholders.flightNumber')}
              />
              <p className="text-xs text-gray-500 mt-1">{t('fields.flightNumberHint')}</p>
            </div>

            {/* Number of Luggage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaSuitcase className="inline mr-2 text-gray-400" />
                {t('fields.numberOfLuggage')}
              </label>
              <input
                type="number"
                min="0"
                value={formData.numberOfLuggage}
                onChange={(e) => setFormData({ ...formData, numberOfLuggage: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder={t('placeholders.luggage')}
              />
            </div>

            {/* Special Requests */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('fields.specialRequests')}
              </label>
              <textarea
                value={formData.specialRequests}
                onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder={t('placeholders.specialRequests')}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t('buttons.cancel')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-bold rounded-lg transition-colors"
            >
              {loading ? t('buttons.processing') : t('buttons.confirmBooking', { price: transferData.price })}
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center mt-4">
            {t('termsNotice')}
          </p>
        </form>
      </div>
    </div>
  );
}
