'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaCheckCircle, FaUserPlus, FaWhatsapp } from 'react-icons/fa';
import { useState, Suspense } from 'react';

function BookingSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const referenceNumber = searchParams.get('ref');
  const isGuest = searchParams.get('guest') === 'true';

  const [showAccountForm, setShowAccountForm] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Hello! I just completed a booking.\n\nBooking Reference: ${referenceNumber}\n\nI would like to confirm the details.`
    );
    window.open(`https://wa.me/905373743134?text=${message}`, '_blank');
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setCreating(true);

    try {
      const res = await fetch('/api/auth/create-from-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referenceNumber,
          password,
        }),
      });

      if (res.ok) {
        alert('Account created successfully! You can now login.');
        router.push('/login');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to create account');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  if (!referenceNumber) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Booking</h1>
          <Link href="/" className="btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        <div className="bg-white rounded-lg shadow-lg p-8 text-center mb-6">
          <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your booking. We&apos;ll contact you shortly to confirm all details.
          </p>

          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <p className="text-sm text-gray-600 mb-2">Your Booking Reference</p>
            <p className="text-3xl font-bold text-blue-600">{referenceNumber}</p>
          </div>

          <p className="text-sm text-gray-600">
            Please save this reference number for your records.
          </p>
        </div>

        {/* WhatsApp Contact */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Need Immediate Assistance?</h2>
          <p className="text-gray-600 mb-4">
            Contact us on WhatsApp for quick responses to your questions.
          </p>
          <button
            onClick={handleWhatsApp}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center transition-colors"
          >
            <FaWhatsapp className="mr-2 text-xl" />
            Contact Us on WhatsApp
          </button>
        </div>

        {/* Create Account (for guests only) */}
        {isGuest && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <FaUserPlus className="mr-2 text-blue-600" />
              Create an Account
            </h2>

            {!showAccountForm ? (
              <>
                <p className="text-gray-600 mb-4">
                  Create an account to track your booking and manage future reservations easily.
                </p>
                <button
                  onClick={() => setShowAccountForm(true)}
                  className="btn-primary w-full"
                >
                  Create Account
                </button>
                <p className="text-xs text-gray-500 mt-3 text-center">
                  Skip this step if you prefer. You can always create an account later.
                </p>
              </>
            ) : (
              <form onSubmit={handleCreateAccount} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                    required
                    placeholder="Enter password (min 6 characters)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                    required
                    placeholder="Confirm password"
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={creating}
                    className="flex-1 btn-primary"
                  >
                    {creating ? 'Creating Account...' : 'Create Account'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAccountForm(false)}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 text-center">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Back to Home
          </Link>
          {!isGuest && (
            <>
              <span className="mx-3 text-gray-400">|</span>
              <Link href="/dashboard" className="text-blue-600 hover:underline">
                View My Bookings →
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <BookingSuccessContent />
    </Suspense>
  );
}
