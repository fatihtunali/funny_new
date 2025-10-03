'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaCalendarDay, FaClock, FaMapMarkerAlt } from 'react-icons/fa';

export default function DailyToursPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[40vh] min-h-[250px] bg-gradient-to-r from-orange-600 to-orange-800">
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white px-4"
          >
            <div className="flex justify-center mb-4">
              <FaCalendarDay className="text-6xl" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Daily Tours</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              Explore Turkey's best attractions with expert local guides
            </p>
          </motion.div>
        </div>
      </div>

      {/* Description Section */}
      <section className="section-container py-12">
        <div className="max-w-4xl mx-auto text-center bg-gray-50 rounded-lg p-8 shadow-md">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What's Included</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Explore the best attractions with our daily guided tours. Whether you're looking for a historical
            walking tour of Istanbul, a hot air balloon ride in Cappadocia, or a boat excursion along the
            Turkish coast, our daily tours provide memorable experiences with expert local guides.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white p-4 rounded-lg shadow">
              <FaMapMarkerAlt className="text-3xl text-orange-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">Expert Guides</h3>
              <p className="text-sm text-gray-600">Local professionals</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <FaClock className="text-3xl text-orange-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">Flexible Duration</h3>
              <p className="text-sm text-gray-600">Half-day to full-day</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <FaCalendarDay className="text-3xl text-orange-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">Daily Departures</h3>
              <p className="text-sm text-gray-600">Available every day</p>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="bg-gray-50 py-16">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center bg-white rounded-lg p-12 shadow-lg"
          >
            <FaCalendarDay className="text-6xl text-orange-600 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Coming Soon</h2>
            <p className="text-lg text-gray-700 mb-8">
              We're currently preparing our daily tour offerings. These will include historical tours,
              adventure activities, cultural experiences, and more across all major Turkish destinations.
            </p>
            <p className="text-gray-600 mb-8">
              Contact us to arrange custom daily tours in Istanbul, Cappadocia, Ephesus, and beyond.
            </p>
            <Link href="/contact" className="btn-primary">
              Contact Us for Custom Tours
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-800 py-16">
        <div className="section-container text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Plan Your Daily Adventure</h2>
          <p className="text-xl text-white mb-8">
            We can arrange custom daily tours tailored to your interests
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-primary bg-white text-orange-600 hover:bg-gray-100">
              Contact Us
            </Link>
            <Link href="/tours" className="btn-primary bg-transparent border-2 border-white text-white hover:bg-white hover:text-orange-600">
              Browse All Tours
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
