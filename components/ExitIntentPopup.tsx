'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaEnvelope, FaCheckCircle, FaGift } from 'react-icons/fa';

export default function ExitIntentPopup() {
  const t = useTranslations('exitPopup');
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Check if popup has been shown in this session
    const hasShown = sessionStorage.getItem('exitPopupShown');
    if (hasShown) return;

    let exitIntentTriggered = false;

    // Desktop exit intent detection
    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger when mouse leaves from top of viewport
      if (e.clientY <= 0 && !exitIntentTriggered) {
        exitIntentTriggered = true;
        setIsVisible(true);
        sessionStorage.setItem('exitPopupShown', 'true');
      }
    };

    // Mobile back button intent detection (optional - detects when user tries to go back)
    const handleBackButton = () => {
      if (!exitIntentTriggered && window.scrollY < 100) {
        exitIntentTriggered = true;
        setIsVisible(true);
        sessionStorage.setItem('exitPopupShown', 'true');
      }
    };

    // Delay before activating exit intent (give user time to engage)
    const timeout = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
      window.addEventListener('popstate', handleBackButton);
    }, 3000); // Wait 3 seconds before activating

    return () => {
      clearTimeout(timeout);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('popstate', handleBackButton);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleNoThanks = () => {
    setIsVisible(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      setMessage(t('invalidEmail'));
      return;
    }

    setStatus('loading');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setMessage(t('successMessage'));
        setEmail('');

        // Close popup after 3 seconds
        setTimeout(() => {
          setIsVisible(false);
        }, 3000);
      } else {
        setStatus('error');
        setMessage(data.message || t('errorMessage'));
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setStatus('error');
      setMessage(t('errorMessage'));
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Popup Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="exit-popup-title"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
                aria-label={t('close')}
              >
                <FaTimes className="w-6 h-6" />
              </button>

              {status === 'success' ? (
                /* Success State */
                <div className="p-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', duration: 0.6 }}
                  >
                    <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {t('successTitle')}
                  </h3>
                  <p className="text-gray-600 mb-4">{message}</p>
                  <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full">
                    <FaGift />
                    <span className="font-semibold">10% Discount Code Coming Soon!</span>
                  </div>
                </div>
              ) : (
                /* Default State */
                <>
                  {/* Header with gradient */}
                  <div className="bg-gradient-to-br from-primary-600 to-primary-700 text-white p-8 pb-12 rounded-t-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

                    <div className="relative z-10">
                      <div className="inline-flex items-center gap-2 bg-accent-500 text-white px-4 py-2 rounded-full mb-4 text-sm font-semibold">
                        <FaGift />
                        <span>Special Offer!</span>
                      </div>
                      <h2 id="exit-popup-title" className="text-3xl font-bold mb-2">
                        {t('title')}
                      </h2>
                      <p className="text-blue-100 text-lg">
                        {t('subtitle')}
                      </p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 -mt-6">
                    {/* Features list */}
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                      <ul className="space-y-3">
                        {(t.raw('features') as string[]).map((feature, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <span className="text-green-500 mt-1 flex-shrink-0">✓</span>
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Newsletter form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="relative">
                        <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={t('emailPlaceholder')}
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                          disabled={status === 'loading'}
                          required
                          aria-label={t('emailPlaceholder')}
                        />
                      </div>

                      {status === 'error' && (
                        <p className="text-red-600 text-sm">{message}</p>
                      )}

                      <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white font-bold py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {status === 'loading' ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Subscribing...</span>
                          </>
                        ) : (
                          <>
                            <FaGift />
                            <span>{t('getDiscount')}</span>
                          </>
                        )}
                      </button>
                    </form>

                    {/* No thanks button */}
                    <button
                      onClick={handleNoThanks}
                      className="w-full text-gray-500 hover:text-gray-700 text-sm mt-4 underline transition-colors"
                    >
                      {t('noThanks')}
                    </button>

                    {/* Privacy note */}
                    <p className="text-xs text-gray-500 text-center mt-4">
                      We respect your privacy. Unsubscribe anytime. No spam!
                    </p>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
