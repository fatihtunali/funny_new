'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { FaCar, FaPlane, FaShieldAlt, FaClock, FaHeadset, FaCheckCircle } from 'react-icons/fa';

export default function TransfersWidgetPage() {
  const t = useTranslations('transfersPage');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Compact Hero */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-10 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-3">{t('title')}</h1>
            <p className="text-lg text-primary-100 max-w-2xl mx-auto">
              {t('subtitle')}
            </p>
            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 mt-6 text-sm">
              <span className="flex items-center gap-2">
                <FaCheckCircle className="text-green-400" />
                Free Cancellation
              </span>
              <span className="flex items-center gap-2">
                <FaCheckCircle className="text-green-400" />
                Flight Tracking
              </span>
              <span className="flex items-center gap-2">
                <FaCheckCircle className="text-green-400" />
                Meet & Greet
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Widget Section - Full Width */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-xl shadow-2xl overflow-hidden"
        >
          <iframe
            src="https://airporttransferportal.com/widget/search?partner=funny-tourism&locale=en&currency=EUR&theme=blue"
            width="100%"
            height="700"
            style={{ border: 'none', display: 'block' }}
            title="Book Airport Transfer"
            loading="eager"
            allow="payment"
          />
        </motion.div>
      </div>

      {/* Quick Features - Compact */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { icon: FaPlane, title: '35+ Airports', desc: 'Turkey-wide coverage' },
            { icon: FaCar, title: 'Modern Fleet', desc: 'Sedan, Van, Minibus' },
            { icon: FaShieldAlt, title: 'Licensed Drivers', desc: 'Insured & professional' },
            { icon: FaHeadset, title: '24/7 Support', desc: 'Always available' },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg p-4 shadow-md text-center hover:shadow-lg transition-shadow"
            >
              <item.icon className="text-2xl text-primary-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900 text-sm md:text-base">{item.title}</h3>
              <p className="text-xs md:text-sm text-gray-500">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Popular Routes - Compact Grid */}
      <div className="bg-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            {t('popularRoutes')}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { from: 'Istanbul Airport (IST)', to: 'Sultanahmet', duration: '45-60 min' },
              { from: 'Istanbul Airport (IST)', to: 'Taksim', duration: '50-70 min' },
              { from: 'Sabiha Gokcen (SAW)', to: 'Kadikoy', duration: '30-45 min' },
              { from: 'Antalya Airport (AYT)', to: 'City Center', duration: '20-30 min' },
              { from: 'Antalya Airport (AYT)', to: 'Kemer / Belek', duration: '40-60 min' },
              { from: 'Kayseri Airport (ASR)', to: 'Cappadocia', duration: '60-80 min' },
            ].map((route, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50/30 transition-all cursor-pointer"
                onClick={() => {
                  // Scroll to widget
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaPlane className="text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">{route.from}</p>
                  <p className="text-xs text-gray-500">→ {route.to}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-xs text-primary-600 flex items-center gap-1">
                    <FaClock className="text-[10px]" />
                    {route.duration}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA for Group Bookings */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
            {t('groupTransfers')}
          </h2>
          <p className="text-primary-100 mb-5 text-sm md:text-base max-w-xl mx-auto">
            {t('groupTransfersDesc')}
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-primary-600 px-6 py-2.5 rounded-lg font-semibold hover:bg-primary-50 transition-colors text-sm md:text-base"
          >
            {t('contactUs')}
          </Link>
        </div>
      </div>
    </div>
  );
}
