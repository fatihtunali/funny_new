'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { FaCheckCircle, FaUsers, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { trackQuoteRequest } from '@/lib/gtag';
import { useTranslations } from 'next-intl';

function InquiryFormContent() {
  const t = useTranslations('inquiryPage');
  const searchParams = useSearchParams();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Contact Info
    name: '',
    email: '',
    phone: '',
    whatsapp: '',
    country: '',

    // Trip Preferences
    destinations: [] as string[],
    interests: [] as string[],
    duration: searchParams.get('duration') || '',
    budgetRange: '',
    packageType: searchParams.get('packageType') || 'WITH_HOTEL',
    hotelCategory: searchParams.get('hotel') || 'fourstar',

    // Group Details
    adults: searchParams.get('adults') || '2',
    children3to5: searchParams.get('children3to5') || '0',
    children6to10: searchParams.get('children6to10') || '0',
    travelDate: '',

    // Additional
    packageName: searchParams.get('package') || '',
    specialRequests: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const destinationOptions = [
    { value: 'Istanbul', label: t('destinations.istanbul'), icon: '🕌' },
    { value: 'Cappadocia', label: t('destinations.cappadocia'), icon: '🎈' },
    { value: 'Ephesus', label: t('destinations.ephesus'), icon: '🏛️' },
    { value: 'Pamukkale', label: t('destinations.pamukkale'), icon: '💎' },
    { value: 'Antalya', label: t('destinations.antalya'), icon: '🏖️' },
    { value: 'Bodrum', label: t('destinations.bodrum'), icon: '⛵' },
    { value: 'Fethiye', label: t('destinations.fethiye'), icon: '🌊' },
    { value: 'Trabzon', label: t('destinations.trabzon'), icon: '⛰️' },
  ];

  const interestOptions = [
    { value: 'Historical Sites', label: t('interests.historical'), icon: '🏛️' },
    { value: 'Hot Air Balloon', label: t('interests.balloon'), icon: '🎈' },
    { value: 'Beach', label: t('interests.beach'), icon: '🏖️' },
    { value: 'Cuisine', label: t('interests.cuisine'), icon: '🍽️' },
    { value: 'Shopping', label: t('interests.shopping'), icon: '🛍️' },
    { value: 'Adventure', label: t('interests.adventure'), icon: '🏔️' },
    { value: 'Culture', label: t('interests.culture'), icon: '🎭' },
    { value: 'Photography', label: t('interests.photography'), icon: '📸' },
  ];

  const durationOptions = [
    t('duration.short'),
    t('duration.week'),
    t('duration.twoWeeks'),
    t('duration.long'),
  ];

  const budgetOptions = [
    t('budget.low'),
    t('budget.medium'),
    t('budget.high'),
    t('budget.premium'),
  ];

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.name.trim()) newErrors.name = t('validation.nameRequired');
      if (!formData.email.trim()) {
        newErrors.email = t('validation.emailRequired');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = t('validation.emailInvalid');
      }
      if (!formData.phone.trim()) newErrors.phone = t('validation.phoneRequired');
      if (!formData.country.trim()) newErrors.country = t('validation.countryRequired');
    }

    if (currentStep === 2) {
      if (formData.destinations.length === 0) newErrors.destinations = t('validation.destinationRequired');
      if (!formData.duration) newErrors.duration = t('validation.durationRequired');
      if (!formData.budgetRange) newErrors.budgetRange = t('validation.budgetRequired');
    }

    if (currentStep === 3) {
      if (!formData.travelDate) newErrors.travelDate = t('validation.dateRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(3)) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: 'Quote Request',
          phone: formData.phone,
          message: `
QUOTE REQUEST

Contact Info:
- WhatsApp: ${formData.whatsapp || formData.phone}
- Country: ${formData.country}

Trip Preferences:
- Destinations: ${formData.destinations.join(', ')}
- Interests: ${formData.interests.join(', ') || 'None specified'}
- Duration: ${formData.duration}
- Budget: ${formData.budgetRange}
- Package Type: ${formData.packageType === 'LAND_ONLY' ? 'Land Services Only' : 'With Hotels'}
${formData.packageType === 'WITH_HOTEL' ? `- Hotel Category: ${formData.hotelCategory}` : ''}

Group Details:
- Adults: ${formData.adults}
- Children (3-5): ${formData.children3to5}
- Children (6-10): ${formData.children6to10}
- Travel Date: ${formData.travelDate}

${formData.packageName ? `Package Interest: ${formData.packageName}\n` : ''}
${formData.specialRequests ? `Special Requests:\n${formData.specialRequests}` : ''}
          `.trim(),
        }),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        // Track Google Ads conversion
        trackQuoteRequest();
      } else {
        throw new Error('Failed to submit');
      }
    } catch {
      alert(t('error.submitFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSelection = (field: 'destinations' | 'interests', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 py-16">
        <div className="section-container">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('success.title')}</h2>
            <p className="text-lg text-gray-700 mb-2">
              {t('success.message')}
            </p>
            <p className="text-gray-600 mb-8">
              {t('success.followUp')}
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800 font-medium mb-2">{t('success.emailCheck')}</p>
              <p className="text-sm text-blue-700">{t('success.emailSent', { email: formData.email })}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`https://wa.me/905XXXXXXXXX?text=${encodeURIComponent('Hi! I just submitted a quote request. My email is ' + formData.email)}`}
                className="inline-flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                {t('success.whatsappButton')}
              </a>
              <Link
                href="/packages"
                className="inline-block bg-white hover:bg-gray-50 text-primary-600 border-2 border-primary-600 font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                {t('success.browseButton')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 py-12">
      <div className="section-container">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">{t('header.title')}</h1>
            <p className="text-lg text-gray-600">
              {t('header.subtitle')}
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex justify-between items-center max-w-2xl mx-auto">
              {[
                { num: 1, label: t('steps.step1') },
                { num: 2, label: t('steps.step2') },
                { num: 3, label: t('steps.step3') },
              ].map((item, idx) => (
                <div key={item.num} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                      step >= item.num
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {step > item.num ? '✓' : item.num}
                    </div>
                    <span className={`text-xs mt-2 font-medium ${
                      step >= item.num ? 'text-primary-600' : 'text-gray-500'
                    }`}>
                      {item.label}
                    </span>
                  </div>
                  {idx < 2 && (
                    <div className={`h-1 flex-1 mx-2 transition-all ${
                      step > item.num ? 'bg-primary-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Contact Info */}
              {step === 1 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <FaEnvelope className="text-primary-600 text-xl" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{t('step1.title')}</h2>
                      <p className="text-sm text-gray-600">{t('step1.subtitle')}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t('step1.nameLabel')}
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all ${
                          errors.name ? 'border-red-500' : 'border-gray-200'
                        }`}
                        placeholder={t('step1.namePlaceholder')}
                      />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t('step1.emailLabel')}
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all ${
                          errors.email ? 'border-red-500' : 'border-gray-200'
                        }`}
                        placeholder={t('step1.emailPlaceholder')}
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t('step1.phoneLabel')}
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all ${
                          errors.phone ? 'border-red-500' : 'border-gray-200'
                        }`}
                        placeholder={t('step1.phonePlaceholder')}
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t('step1.whatsappLabel')}
                      </label>
                      <input
                        type="tel"
                        value={formData.whatsapp}
                        onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                        placeholder={t('step1.whatsappPlaceholder')}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t('step1.countryLabel')}
                      </label>
                      <input
                        type="text"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all ${
                          errors.country ? 'border-red-500' : 'border-gray-200'
                        }`}
                        placeholder={t('step1.countryPlaceholder')}
                      />
                      {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="button"
                      onClick={handleNext}
                      className="btn-primary px-8 py-3 text-lg"
                    >
                      {t('buttons.continue')}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Trip Preferences */}
              {step === 2 && (
                <div className="space-y-8 animate-fadeIn">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center">
                      <FaMapMarkerAlt className="text-accent-600 text-xl" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{t('step2.title')}</h2>
                      <p className="text-sm text-gray-600">{t('step2.subtitle')}</p>
                    </div>
                  </div>

                  {/* Destinations */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      {t('step2.destinationsLabel')}
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {destinationOptions.map((dest) => (
                        <button
                          key={dest.value}
                          type="button"
                          onClick={() => toggleSelection('destinations', dest.value)}
                          className={`p-4 rounded-xl border-2 transition-all text-center hover:shadow-md ${
                            formData.destinations.includes(dest.value)
                              ? 'border-primary-600 bg-primary-50 shadow-md'
                              : 'border-gray-200 hover:border-primary-300'
                          }`}
                        >
                          <div className="text-3xl mb-2">{dest.icon}</div>
                          <div className="text-sm font-medium text-gray-900">{dest.label}</div>
                        </button>
                      ))}
                    </div>
                    {errors.destinations && <p className="text-red-500 text-xs mt-2">{errors.destinations}</p>}
                  </div>

                  {/* Interests */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      {t('step2.interestsLabel')}
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {interestOptions.map((interest) => (
                        <label
                          key={interest.value}
                          className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                            formData.interests.includes(interest.value)
                              ? 'border-accent-600 bg-accent-50'
                              : 'border-gray-200 hover:border-accent-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.interests.includes(interest.value)}
                            onChange={() => toggleSelection('interests', interest.value)}
                            className="w-5 h-5 text-accent-600 rounded focus:ring-accent-500"
                          />
                          <span className="text-2xl">{interest.icon}</span>
                          <span className="text-sm font-medium text-gray-900 flex-1">{interest.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Duration & Budget */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t('step2.durationLabel')}
                      </label>
                      <select
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all ${
                          errors.duration ? 'border-red-500' : 'border-gray-200'
                        }`}
                      >
                        <option value="">{t('step2.durationPlaceholder')}</option>
                        {durationOptions.map((dur) => (
                          <option key={dur} value={dur}>{dur}</option>
                        ))}
                      </select>
                      {errors.duration && <p className="text-red-500 text-xs mt-1">{errors.duration}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t('step2.budgetLabel')}
                      </label>
                      <select
                        value={formData.budgetRange}
                        onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all ${
                          errors.budgetRange ? 'border-red-500' : 'border-gray-200'
                        }`}
                      >
                        <option value="">{t('step2.budgetPlaceholder')}</option>
                        {budgetOptions.map((budget) => (
                          <option key={budget} value={budget}>{budget}</option>
                        ))}
                      </select>
                      {errors.budgetRange && <p className="text-red-500 text-xs mt-1">{errors.budgetRange}</p>}
                    </div>
                  </div>

                  {/* Package Type */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      {t('step2.packageTypeLabel')}
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.packageType === 'WITH_HOTEL'
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-200 hover:border-primary-300'
                      }`}>
                        <input
                          type="radio"
                          checked={formData.packageType === 'WITH_HOTEL'}
                          onChange={() => setFormData({ ...formData, packageType: 'WITH_HOTEL' })}
                          className="w-5 h-5 text-primary-600"
                        />
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">{t('step2.withHotel')}</div>
                          <div className="text-xs text-gray-600">{t('step2.withHotelDesc')}</div>
                        </div>
                      </label>

                      <label className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.packageType === 'LAND_ONLY'
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-200 hover:border-primary-300'
                      }`}>
                        <input
                          type="radio"
                          checked={formData.packageType === 'LAND_ONLY'}
                          onChange={() => setFormData({ ...formData, packageType: 'LAND_ONLY' })}
                          className="w-5 h-5 text-primary-600"
                        />
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">{t('step2.landOnly')}</div>
                          <div className="text-xs text-gray-600">{t('step2.landOnlyDesc')}</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Hotel Category (conditional) */}
                  {formData.packageType === 'WITH_HOTEL' && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        {t('step2.hotelCategoryLabel')}
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {[t('step2.threeStar'), t('step2.fourStar'), t('step2.fiveStar')].map((category, idx) => (
                          <label
                            key={category}
                            className={`flex items-center justify-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                              formData.hotelCategory === ['threestar', 'fourstar', 'fivestar'][idx]
                                ? 'border-accent-600 bg-accent-50'
                                : 'border-gray-200 hover:border-accent-300'
                            }`}
                          >
                            <input
                              type="radio"
                              checked={formData.hotelCategory === ['threestar', 'fourstar', 'fivestar'][idx]}
                              onChange={() => setFormData({ ...formData, hotelCategory: ['threestar', 'fourstar', 'fivestar'][idx] })}
                              className="w-5 h-5 text-accent-600"
                            />
                            <span className="font-semibold text-gray-900">{category}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="px-8 py-3 text-gray-600 hover:text-gray-900 font-semibold transition-colors"
                    >
                      {t('buttons.back')}
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="btn-primary px-8 py-3 text-lg"
                    >
                      {t('buttons.continue')}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Group & Date */}
              {step === 3 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <FaUsers className="text-green-600 text-xl" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{t('step3.title')}</h2>
                      <p className="text-sm text-gray-600">{t('step3.subtitle')}</p>
                    </div>
                  </div>

                  {/* Pre-filled Package Name */}
                  {formData.packageName && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-800">
                        <strong>{t('step3.packageLabel')}</strong> {formData.packageName}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t('step3.adultsLabel')}
                      </label>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, adults: String(Math.max(1, parseInt(formData.adults) - 1)) })}
                          className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold transition-colors"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={formData.adults}
                          onChange={(e) => setFormData({ ...formData, adults: e.target.value })}
                          className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg text-center font-semibold focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          min="1"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, adults: String(parseInt(formData.adults) + 1) })}
                          className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t('step3.children3to5Label')}
                      </label>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, children3to5: String(Math.max(0, parseInt(formData.children3to5) - 1)) })}
                          className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold transition-colors"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={formData.children3to5}
                          onChange={(e) => setFormData({ ...formData, children3to5: e.target.value })}
                          className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg text-center font-semibold focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          min="0"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, children3to5: String(parseInt(formData.children3to5) + 1) })}
                          className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t('step3.children6to10Label')}
                      </label>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, children6to10: String(Math.max(0, parseInt(formData.children6to10) - 1)) })}
                          className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold transition-colors"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={formData.children6to10}
                          onChange={(e) => setFormData({ ...formData, children6to10: e.target.value })}
                          className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg text-center font-semibold focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          min="0"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, children6to10: String(parseInt(formData.children6to10) + 1) })}
                          className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('step3.travelDateLabel')}
                    </label>
                    <input
                      type="date"
                      value={formData.travelDate}
                      onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all ${
                        errors.travelDate ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {errors.travelDate && <p className="text-red-500 text-xs mt-1">{errors.travelDate}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('step3.specialRequestsLabel')}
                    </label>
                    <textarea
                      value={formData.specialRequests}
                      onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder={t('step3.specialRequestsPlaceholder')}
                    />
                  </div>

                  {/* Summary */}
                  <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl p-6 border border-primary-200">
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <FaCheckCircle className="text-primary-600" />
                      {t('step3.summaryTitle')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">{t('step3.summaryDestinations')}</span>
                        <p className="font-semibold text-gray-900">{formData.destinations.join(', ') || t('step3.notSpecified')}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">{t('step3.summaryDuration')}</span>
                        <p className="font-semibold text-gray-900">{formData.duration || t('step3.notSpecified')}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">{t('step3.summaryBudget')}</span>
                        <p className="font-semibold text-gray-900">{formData.budgetRange || t('step3.notSpecified')}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">{t('step3.summaryTravelers')}</span>
                        <p className="font-semibold text-gray-900">
                          {formData.adults} {parseInt(formData.adults) !== 1 ? t('step3.adults') : t('step3.adult')}
                          {(parseInt(formData.children3to5) + parseInt(formData.children6to10)) > 0 && `, ${parseInt(formData.children3to5) + parseInt(formData.children6to10)} ${t('step3.children')}`}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="px-8 py-3 text-gray-600 hover:text-gray-900 font-semibold transition-colors"
                    >
                      {t('buttons.back')}
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`btn-primary px-8 py-3 text-lg ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isSubmitting ? t('buttons.sending') : t('buttons.submit')}
                    </button>
                  </div>

                  <p className="text-xs text-center text-gray-500 mt-4">
                    {t('step3.securityNote')}
                  </p>
                </div>
              )}
            </form>
          </div>

          {/* Contact Alternatives */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">{t('footer.contactText')}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:info@funnytourism.com"
                className="inline-flex items-center justify-center bg-white hover:bg-gray-50 text-primary-600 font-semibold py-3 px-6 rounded-lg border-2 border-primary-600 transition-colors"
              >
                <FaEnvelope className="mr-2" />
                {t('footer.emailButton')}
              </a>
              <a
                href="https://wa.me/905395025310?text=Hello!%20I%27m%20interested%20in%20getting%20a%20quote%20for%20Turkey%20tours."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                {t('footer.whatsappButton')}
              </a>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

function LoadingFallback() {
  const t = useTranslations('inquiryPage');
  return (
    <div className="min-h-screen bg-gray-50 py-16 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">{t('loading')}</p>
      </div>
    </div>
  );
}

export default function InquiryPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <InquiryFormContent />
    </Suspense>
  );
}
