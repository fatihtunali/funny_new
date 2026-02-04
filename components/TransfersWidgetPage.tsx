'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { FaCar, FaPlane, FaShieldAlt, FaClock, FaHeadset, FaEuroSign } from 'react-icons/fa';

export default function TransfersWidgetPage() {
  const t = useTranslations('transfersPage');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('title')}</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              {t('subtitle')}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Widget Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <iframe
            src="https://airporttransferportal.com/widget/search?partner=funny-tourism&locale=en&currency=EUR"
            width="100%"
            height="650"
            style={{ border: 'none' }}
            title="Book Airport Transfer"
            loading="lazy"
            allow="payment"
          />
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-center text-gray-900 mb-12"
        >
          {t('whyBookWithUs')}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <FaPlane className="text-2xl text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('features.airports')}</h3>
            <p className="text-gray-600">{t('features.airportsDesc')}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <FaEuroSign className="text-2xl text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('features.fixedPricing')}</h3>
            <p className="text-gray-600">{t('features.fixedPricingDesc')}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <FaCar className="text-2xl text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('features.modernFleet')}</h3>
            <p className="text-gray-600">{t('features.modernFleetDesc')}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <FaShieldAlt className="text-2xl text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('features.safeReliable')}</h3>
            <p className="text-gray-600">{t('features.safeReliableDesc')}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <FaClock className="text-2xl text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('features.flightTracking')}</h3>
            <p className="text-gray-600">{t('features.flightTrackingDesc')}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <FaHeadset className="text-2xl text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('features.support')}</h3>
            <p className="text-gray-600">{t('features.supportDesc')}</p>
          </motion.div>
        </div>
      </div>

      {/* Popular Routes Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center text-gray-900 mb-12"
          >
            {t('popularRoutes')}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { from: 'Istanbul Airport (IST)', to: 'Sultanahmet / Old City', duration: '45-60 min' },
              { from: 'Istanbul Airport (IST)', to: 'Taksim / Beyoglu', duration: '50-70 min' },
              { from: 'Sabiha Gokcen (SAW)', to: 'Kadikoy / Asian Side', duration: '30-45 min' },
              { from: 'Antalya Airport (AYT)', to: 'Antalya City Center', duration: '20-30 min' },
              { from: 'Antalya Airport (AYT)', to: 'Kemer / Belek', duration: '40-60 min' },
              { from: 'Kayseri Airport (ASR)', to: 'Cappadocia / Goreme', duration: '60-80 min' },
            ].map((route, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-3">
                  <FaCar className="text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">{route.from}</p>
                    <p className="text-gray-500 text-sm my-1">to</p>
                    <p className="font-semibold text-gray-900">{route.to}</p>
                    <p className="text-sm text-blue-600 mt-2">
                      <FaClock className="inline mr-1" /> {route.duration}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Group/Custom Transfers CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {t('groupTransfers')}
            </h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              {t('groupTransfersDesc')}
            </p>
            <Link
              href="/contact"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              {t('contactUs')}
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
