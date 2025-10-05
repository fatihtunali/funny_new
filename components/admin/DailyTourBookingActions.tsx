'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaCheck, FaTimes, FaCheckCircle, FaWhatsapp } from 'react-icons/fa';

interface DailyTourBookingActionsProps {
  bookingId: string;
  currentStatus: string;
  customerPhone?: string | null;
}

export default function DailyTourBookingActions({ bookingId, currentStatus, customerPhone }: DailyTourBookingActionsProps) {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  const updateStatus = async (newStatus: string) => {
    if (!confirm(`Are you sure you want to mark this tour booking as ${newStatus}?`)) {
      return;
    }

    setUpdating(true);
    setError('');

    try {
      const res = await fetch(`/api/admin/bookings/daily-tours/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to update tour booking');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Actions</h3>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm mb-4">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {currentStatus === 'PENDING' && (
          <>
            <button
              onClick={() => updateStatus('CONFIRMED')}
              disabled={updating}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
            >
              <FaCheck className="mr-2" />
              {updating ? 'Updating...' : 'Confirm Tour'}
            </button>

            <button
              onClick={() => updateStatus('CANCELLED')}
              disabled={updating}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
            >
              <FaTimes className="mr-2" />
              {updating ? 'Updating...' : 'Reject Tour'}
            </button>
          </>
        )}

        {currentStatus === 'CONFIRMED' && (
          <>
            <button
              onClick={() => updateStatus('IN_PROGRESS')}
              disabled={updating}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
            >
              <FaCheckCircle className="mr-2" />
              {updating ? 'Updating...' : 'Mark as In Progress'}
            </button>

            <button
              onClick={() => updateStatus('CANCELLED')}
              disabled={updating}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
            >
              <FaTimes className="mr-2" />
              {updating ? 'Updating...' : 'Cancel Tour'}
            </button>
          </>
        )}

        {currentStatus === 'IN_PROGRESS' && (
          <button
            onClick={() => updateStatus('COMPLETED')}
            disabled={updating}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
          >
            <FaCheckCircle className="mr-2" />
            {updating ? 'Updating...' : 'Mark as Completed'}
          </button>
        )}

        {/* WhatsApp Contact - Always available */}
        <div className="relative pt-3">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Contact Customer</span>
          </div>
        </div>

        <button
          onClick={() => {
            if (customerPhone) {
              // Clean phone number (remove spaces, dashes, etc)
              const cleanPhone = customerPhone.replace(/\D/g, '');
              window.open(`https://wa.me/${cleanPhone}`, '_blank');
            } else {
              alert('Customer phone number not available');
            }
          }}
          disabled={!customerPhone}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaWhatsapp className="mr-2 text-xl" />
          Contact via WhatsApp
        </button>
      </div>

      {currentStatus === 'CANCELLED' && (
        <div className="mt-4 text-center text-sm text-gray-500">
          This tour booking has been cancelled
        </div>
      )}

      {currentStatus === 'COMPLETED' && (
        <div className="mt-4 text-center text-sm text-gray-500">
          This tour has been completed
        </div>
      )}
    </div>
  );
}
