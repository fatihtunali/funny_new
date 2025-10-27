'use client';

import { FaShieldAlt, FaClock, FaMoneyBillWave, FaUserTie, FaHeadset, FaStar, FaHotel, FaCheckCircle } from 'react-icons/fa';
import { useTranslations } from 'next-intl';

export default function WhyChooseUs() {
  const t = useTranslations('whyChooseUs');

  const benefits = [
    {
      icon: <FaShieldAlt className="text-4xl text-primary-600" />,
      titleKey: 'benefit1Title',
      descKey: 'benefit1Desc'
    },
    {
      icon: <FaClock className="text-4xl text-primary-600" />,
      titleKey: 'benefit2Title',
      descKey: 'benefit2Desc'
    },
    {
      icon: <FaMoneyBillWave className="text-4xl text-primary-600" />,
      titleKey: 'benefit3Title',
      descKey: 'benefit3Desc'
    },
    {
      icon: <FaUserTie className="text-4xl text-primary-600" />,
      titleKey: 'benefit4Title',
      descKey: 'benefit4Desc'
    },
    {
      icon: <FaHeadset className="text-4xl text-primary-600" />,
      titleKey: 'benefit5Title',
      descKey: 'benefit5Desc'
    },
    {
      icon: <FaHotel className="text-4xl text-primary-600" />,
      titleKey: 'benefit6Title',
      descKey: 'benefit6Desc'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="section-container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('title')}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1"
            >
              <div className="mb-6">{benefit.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t(benefit.titleKey)}</h3>
              <p className="text-gray-600 leading-relaxed">{t(benefit.descKey)}</p>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-8 bg-white px-8 py-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-2">
              <FaStar className="text-yellow-400 text-2xl" />
              <div className="text-left">
                <div className="font-bold text-gray-900">{t('trustRating')}</div>
                <div className="text-sm text-gray-600">{t('trustReviews')}</div>
              </div>
            </div>
            <div className="h-12 w-px bg-gray-300 hidden md:block"></div>
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-green-600 text-2xl" />
              <div className="text-left">
                <div className="font-bold text-gray-900">{t('trustLicensed')}</div>
                <div className="text-sm text-gray-600">{t('trustAuthority')}</div>
              </div>
            </div>
            <div className="h-12 w-px bg-gray-300 hidden md:block"></div>
            <div className="flex items-center gap-2">
              <FaHeadset className="text-blue-600 text-2xl" />
              <div className="text-left">
                <div className="font-bold text-gray-900">{t('trustSupport')}</div>
                <div className="text-sm text-gray-600">{t('trustContact')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
