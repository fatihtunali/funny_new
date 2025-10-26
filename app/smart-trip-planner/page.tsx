'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FaMapMarkerAlt, FaHotel, FaUsers, FaCalendar, FaEnvelope, FaPhone, FaWhatsapp, FaCheckCircle, FaStar } from 'react-icons/fa';

interface CityNight {
  city: string;
  nights: number;
}

function SmartTripPlannerContent() {
  const router = useRouter();

  const [step, setStep] = useState(1); // 1=destinations, 2=preferences, 3=contact, 4=generating
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    city_nights: [{ city: '', nights: 2 }] as CityNight[],
    start_date: '',
    adults: 2,
    children: 0,
    hotel_category: '4',
    tour_type: 'PRIVATE',
    special_requests: '',
    // Contact info
    name: '',
    email: '',
    phone: '',
    whatsapp: ''
  });

  // Autocomplete state
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [activeInputIndex, setActiveInputIndex] = useState<number | null>(null);
  const [loadingCities, setLoadingCities] = useState(false);
  const autocompleteRef = useRef<HTMLDivElement>(null);

  // Fetch cities from our API
  const fetchCities = async (search: string) => {
    if (search.length < 2) {
      setCitySuggestions([]);
      return;
    }

    setLoadingCities(true);
    try {
      const response = await fetch(`/api/tqa/cities?search=${encodeURIComponent(search)}`);
      if (response.ok) {
        const data = await response.json();
        setCitySuggestions(data.cities || []);
      } else {
        setCitySuggestions([]);
      }
    } catch (err) {
      console.error('Error fetching cities:', err);
      setCitySuggestions([]);
    } finally {
      setLoadingCities(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target as Node)) {
        setActiveInputIndex(null);
        setCitySuggestions([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addCity = () => {
    setFormData(prev => ({
      ...prev,
      city_nights: [...prev.city_nights, { city: '', nights: 2 }]
    }));
  };

  const removeCity = (index: number) => {
    setFormData(prev => ({
      ...prev,
      city_nights: prev.city_nights.filter((_, i) => i !== index)
    }));
  };

  const updateCity = (index: number, field: 'city' | 'nights', value: string | number) => {
    setFormData(prev => ({
      ...prev,
      city_nights: prev.city_nights.map((cn, i) =>
        i === index ? { ...cn, [field]: value } : cn
      )
    }));

    if (field === 'city' && typeof value === 'string') {
      setActiveInputIndex(index);
      fetchCities(value);
    }
  };

  const selectCity = (index: number, cityName: string) => {
    setFormData(prev => ({
      ...prev,
      city_nights: prev.city_nights.map((cn, i) =>
        i === index ? { ...cn, city: cityName } : cn
      )
    }));
    setActiveInputIndex(null);
    setCitySuggestions([]);
  };

  const handleNext = () => {
    if (step === 1) {
      const validCities = formData.city_nights.filter(cn => cn.city.trim() !== '');
      if (validCities.length === 0 || !formData.start_date) {
        setError('Please add at least one destination and select a start date');
        return;
      }
      setError(null);
      setStep(2);
    } else if (step === 2) {
      setError(null);
      setStep(3);
    }
  };

  const handleGenerateItinerary = async () => {
    if (!formData.name || !formData.email) {
      setError('Please provide your name and email address');
      return;
    }

    setLoading(true);
    setError(null);
    setStep(4);

    try {
      const validCities = formData.city_nights.filter(cn => cn.city.trim() !== '');

      const response = await fetch('/api/tqa/generate-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city_nights: validCities,
          start_date: formData.start_date,
          adults: formData.adults,
          children: formData.children,
          hotel_category: formData.hotel_category,
          tour_type: formData.tour_type,
          special_requests: formData.special_requests,
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone || formData.whatsapp || null
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate itinerary');
      }

      const data = await response.json();

      // Redirect to itinerary view page
      if (data.uuid) {
        router.push(`/itinerary/${data.uuid}`);
      } else {
        throw new Error('No itinerary ID returned');
      }

    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setStep(3);
    } finally {
      setLoading(false);
    }
  };

  const totalNights = formData.city_nights.reduce((sum, cn) => sum + (cn.nights || 0), 0);
  const totalDays = totalNights + 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 text-white py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
            <FaStar className="text-yellow-300 mr-2" />
            <span className="text-sm font-semibold">AI-Powered Trip Planning</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Smart Trip Planner
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
            Create your perfect Turkey itinerary in minutes. Get instant pricing with <strong>real, bookable rates</strong> - not estimates!
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <FaCheckCircle className="text-green-300" />
              <span className="text-sm">Instant Pricing</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <FaCheckCircle className="text-green-300" />
              <span className="text-sm">Real Hotel Rates</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <FaCheckCircle className="text-green-300" />
              <span className="text-sm">Book Immediately</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center gap-2 md:gap-4">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>
              {step > 1 ? <FaCheckCircle /> : '1'}
            </div>
            <span className="text-sm md:text-base font-semibold hidden sm:inline">Destinations</span>
          </div>
          <div className="h-px w-8 md:w-16 bg-gray-300"></div>
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>
              {step > 2 ? <FaCheckCircle /> : '2'}
            </div>
            <span className="text-sm md:text-base font-semibold hidden sm:inline">Preferences</span>
          </div>
          <div className="h-px w-8 md:w-16 bg-gray-300"></div>
          <div className={`flex items-center gap-2 ${step >= 3 ? 'text-primary-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>
              {step > 3 ? <FaCheckCircle /> : '3'}
            </div>
            <span className="text-sm md:text-base font-semibold hidden sm:inline">Contact</span>
          </div>
          <div className="h-px w-8 md:w-16 bg-gray-300"></div>
          <div className={`flex items-center gap-2 ${step >= 4 ? 'text-primary-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 4 ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>
              4
            </div>
            <span className="text-sm md:text-base font-semibold hidden sm:inline">Itinerary</span>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          {/* Step 1: Destinations */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <FaMapMarkerAlt className="text-3xl text-primary-600" />
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Where do you want to go?
                  </h2>
                </div>

                {formData.city_nights.length > 0 && (
                  <div className="grid grid-cols-12 gap-4 mb-3 text-sm font-semibold text-gray-700">
                    <div className="col-span-7 md:col-span-8">Destination</div>
                    <div className="col-span-3 md:col-span-2">Nights</div>
                    {formData.city_nights.length > 1 && <div className="col-span-2"></div>}
                  </div>
                )}

                {formData.city_nights.map((cityNight, index) => (
                  <div key={index} className="grid grid-cols-12 gap-4 mb-4">
                    <div className="col-span-7 md:col-span-8 relative" ref={activeInputIndex === index ? autocompleteRef : null}>
                      <input
                        type="text"
                        required
                        value={cityNight.city}
                        onChange={(e) => updateCity(index, 'city', e.target.value)}
                        onFocus={() => {
                          setActiveInputIndex(index);
                          if (cityNight.city.length >= 2) {
                            fetchCities(cityNight.city);
                          }
                        }}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                        placeholder="e.g., Istanbul, Cappadocia, Antalya..."
                        autoComplete="off"
                      />

                      {activeInputIndex === index && citySuggestions.length > 0 && (
                        <div className="absolute z-50 w-full mt-1 bg-white border-2 border-primary-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                          {citySuggestions.map((city, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => selectCity(index, city)}
                              className="w-full text-left px-4 py-3 hover:bg-primary-50 transition-colors border-b border-gray-100 last:border-b-0 font-medium"
                            >
                              <FaMapMarkerAlt className="inline text-primary-600 mr-2" />
                              {city}
                            </button>
                          ))}
                        </div>
                      )}

                      {activeInputIndex === index && loadingCities && (
                        <div className="absolute right-3 top-3.5">
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary-200 border-t-primary-600"></div>
                        </div>
                      )}
                    </div>
                    <div className="col-span-3 md:col-span-2">
                      <input
                        type="number"
                        required
                        min="1"
                        value={cityNight.nights}
                        onChange={(e) => updateCity(index, 'nights', parseInt(e.target.value) || 1)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    {formData.city_nights.length > 1 && (
                      <div className="col-span-2">
                        <button
                          type="button"
                          onClick={() => removeCity(index)}
                          className="w-full px-3 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addCity}
                  className="mt-3 px-6 py-3 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors font-semibold"
                >
                  + Add Another City
                </button>

                {totalNights > 0 && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-blue-900 font-semibold">
                      Total Trip: {totalDays} days / {totalNights} nights
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    <FaCalendar className="inline mr-2" />
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.start_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    <FaUsers className="inline mr-2" />
                    Adults *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.adults}
                    onChange={(e) => setFormData(prev => ({ ...prev, adults: parseInt(e.target.value) || 1 }))}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Children (0-12)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.children}
                    onChange={(e) => setFormData(prev => ({ ...prev, children: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="w-full px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl font-bold text-lg shadow-lg transition-all duration-200"
              >
                Next: Choose Preferences →
              </button>
            </div>
          )}

          {/* Step 2: Preferences */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <FaHotel className="text-3xl text-primary-600" />
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Your Travel Preferences
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Hotel Category *
                  </label>
                  <select
                    required
                    value={formData.hotel_category}
                    onChange={(e) => setFormData(prev => ({ ...prev, hotel_category: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-medium"
                  >
                    <option value="3">⭐⭐⭐ 3-Star (Budget-Friendly)</option>
                    <option value="4">⭐⭐⭐⭐ 4-Star (Comfort)</option>
                    <option value="5">⭐⭐⭐⭐⭐ 5-Star (Luxury)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Tour Type *
                  </label>
                  <select
                    required
                    value={formData.tour_type}
                    onChange={(e) => setFormData(prev => ({ ...prev, tour_type: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-medium"
                  >
                    <option value="PRIVATE">Private Tours (Just your group)</option>
                    <option value="SIC">Group Tours (Join others, save money)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Special Requests (Optional)
                </label>
                <textarea
                  value={formData.special_requests}
                  onChange={(e) => setFormData(prev => ({ ...prev, special_requests: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Dietary requirements, accessibility needs, special interests, preferred activities..."
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold text-lg transition-all duration-200"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl font-bold text-lg shadow-lg transition-all duration-200"
                >
                  Next: Contact Info →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Contact Info */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <FaEnvelope className="text-3xl text-primary-600" />
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Your Contact Information
                  </h2>
                </div>
                <p className="text-gray-600 mb-6">
                  We'll email your personalized itinerary with <strong>real, bookable prices</strong>. You can book immediately!
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="John Smith"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      <FaEnvelope className="inline mr-2" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      <FaPhone className="inline mr-2" />
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      <FaWhatsapp className="inline mr-2 text-green-600" />
                      WhatsApp Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="+90 532 123 4567"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-primary-600 p-4 rounded-r-lg">
                <div className="flex items-start">
                  <FaCheckCircle className="text-primary-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Real Prices, Instant Booking</h4>
                    <p className="text-sm text-gray-700">
                      All prices are <strong>real and bookable</strong>. No hidden fees, no estimates.
                      What you see is what you pay. Book immediately or request changes!
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold text-lg transition-all duration-200"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={handleGenerateItinerary}
                  disabled={loading}
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-bold text-lg shadow-lg transition-all duration-200 disabled:opacity-50"
                >
                  ✨ Generate My Itinerary
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Generating */}
          {step === 4 && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-200 border-t-primary-600 mx-auto mb-6"></div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Creating Your Perfect Turkey Itinerary...
              </h3>
              <p className="text-lg text-gray-600 mb-4">
                Our AI is selecting the best hotels, tours, and experiences for you
              </p>
              <div className="max-w-md mx-auto space-y-2 text-left">
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse"></div>
                  <span>Analyzing your preferences...</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse delay-100"></div>
                  <span>Finding best hotels in each city...</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse delay-200"></div>
                  <span>Calculating real-time pricing...</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse delay-300"></div>
                  <span>Creating day-by-day itinerary...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Trust Signals */}
        {step < 4 && (
          <div className="mt-8 text-center">
            <div className="inline-flex flex-wrap items-center justify-center gap-6 bg-white px-6 py-4 rounded-xl shadow-sm">
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-green-600" />
                <span className="text-sm font-medium text-gray-700">Licensed by Turkish Tourism</span>
              </div>
              <div className="h-6 w-px bg-gray-300 hidden md:block"></div>
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-green-600" />
                <span className="text-sm font-medium text-gray-700">500+ Happy Travelers</span>
              </div>
              <div className="h-6 w-px bg-gray-300 hidden md:block"></div>
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-green-600" />
                <span className="text-sm font-medium text-gray-700">10+ Years Experience</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SmartTripPlanner() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Smart Trip Planner...</p>
        </div>
      </div>
    }>
      <SmartTripPlannerContent />
    </Suspense>
  );
}
