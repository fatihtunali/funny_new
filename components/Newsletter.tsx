'use client';

import { useState } from 'react';
import { FaPaperPlane, FaCheckCircle } from 'react-icons/fa';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setStatus('error');
      setMessage('Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');

    // For now, we'll just simulate a subscription
    // In production, you'd send this to your email marketing service
    setTimeout(() => {
      setStatus('success');
      setMessage('Thank you for subscribing! Check your inbox for exclusive deals.');
      setEmail('');

      // Reset after 5 seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);
    }, 1000);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="section-container relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Get Exclusive Travel Deals
            </h2>
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
              Subscribe to our newsletter and receive special offers, insider tips, and early access to new tour packages
            </p>
          </div>

          {status === 'success' ? (
            <div className="bg-white/20 backdrop-blur-sm border-2 border-white/50 rounded-2xl p-8 text-center">
              <FaCheckCircle className="text-green-400 text-6xl mx-auto mb-4" />
              <p className="text-white text-lg font-medium">{message}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl shadow-2xl p-2 flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-6 py-4 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  disabled={status === 'loading'}
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white px-8 py-4 rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {status === 'loading' ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Subscribing...</span>
                    </>
                  ) : (
                    <>
                      <FaPaperPlane />
                      <span>Subscribe</span>
                    </>
                  )}
                </button>
              </div>

              {status === 'error' && (
                <p className="text-red-200 text-sm mt-3 text-center">{message}</p>
              )}

              <p className="text-blue-100 text-sm mt-4 text-center">
                We respect your privacy. Unsubscribe at any time. No spam, we promise!
              </p>
            </form>
          )}

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="text-white font-semibold mb-1">Exclusive Discounts</h3>
              <p className="text-blue-100 text-sm">Up to 20% off selected tours</p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl">🎁</span>
              </div>
              <h3 className="text-white font-semibold mb-1">Special Offers</h3>
              <p className="text-blue-100 text-sm">Members-only flash sales</p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl">✈️</span>
              </div>
              <h3 className="text-white font-semibold mb-1">Travel Tips</h3>
              <p className="text-blue-100 text-sm">Expert advice for Turkey</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
