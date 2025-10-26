'use client';

import Link from 'next/link';
import { FaSearch, FaEdit, FaPlane } from 'react-icons/fa';

export default function HowItWorks() {
  const steps = [
    {
      icon: <FaSearch className="text-4xl" />,
      number: "1",
      title: "Browse & Discover",
      description: "Explore our curated Turkey tour packages or use our Smart Trip Planner to create a custom itinerary",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <FaEdit className="text-4xl" />,
      number: "2",
      title: "Customize & Book",
      description: "Tailor your trip to your preferences, select hotels, and book securely with flexible payment options",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: <FaPlane className="text-4xl" />,
      number: "3",
      title: "Travel & Enjoy",
      description: "Pack your bags! We'll handle all the details while you create unforgettable memories in Turkey",
      color: "from-green-500 to-green-600"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="section-container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Planning your dream Turkey vacation is as easy as 1-2-3
          </p>
        </div>

        {/* Steps Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 relative">
          {/* Connection Line - Desktop Only */}
          <div className="hidden md:block absolute top-16 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-orange-200 to-green-200 -z-10" style={{ top: '4rem' }}></div>

          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Step Card */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 h-full">
                {/* Number Badge */}
                <div className={`absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-br ${step.color} text-white flex items-center justify-center text-xl font-bold shadow-lg`}>
                  {step.number}
                </div>

                {/* Icon */}
                <div className={`mt-4 mb-6 flex justify-center text-white`}>
                  <div className={`bg-gradient-to-br ${step.color} rounded-full p-6 shadow-lg`}>
                    {step.icon}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Arrow - Desktop Only */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 -right-4 text-gray-300 text-3xl z-10">
                  →
                </div>
              )}

              {/* Arrow - Mobile Only */}
              {index < steps.length - 1 && (
                <div className="md:hidden flex justify-center my-4 text-gray-300 text-3xl">
                  ↓
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center mt-12">
          <Link
            href="/packages"
            className="inline-block bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold px-10 py-4 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Start Planning Your Trip
          </Link>
        </div>
      </div>
    </section>
  );
}
