'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaMap, FaClock, FaMapMarkerAlt, FaBus } from 'react-icons/fa';

export default function LandPackagesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[40vh] min-h-[250px] bg-gradient-to-r from-green-600 to-green-800">
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white px-4"
          >
            <div className="flex justify-center mb-4">
              <FaMap className="text-6xl" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Land Only Packages</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              Guided tours with transportation - arrange your own accommodation
            </p>
          </motion.div>
        </div>
      </div>

      {/* Description Section */}
      <section className="section-container py-12">
        <div className="max-w-4xl mx-auto text-center bg-gray-50 rounded-lg p-8 shadow-md">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What's Included</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Our land-only packages provide guided tours, transportation between attractions, and all entrance fees
            without hotel accommodations. These packages are perfect for travelers who prefer to arrange their own
            lodging while still benefiting from our expertly guided experiences throughout Turkey.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white p-4 rounded-lg shadow">
              <FaMapMarkerAlt className="text-3xl text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">Guided Tours</h3>
              <p className="text-sm text-gray-600">Expert local guides</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <FaBus className="text-3xl text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">Transportation</h3>
              <p className="text-sm text-gray-600">Between all attractions</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <FaClock className="text-3xl text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">Entrance Fees</h3>
              <p className="text-sm text-gray-600">All attractions included</p>
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
            <FaMap className="text-6xl text-green-600 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Coming Soon</h2>
            <p className="text-lg text-gray-700 mb-8">
              We're currently preparing our land-only packages. These will offer you the flexibility to choose
              your own accommodation while enjoying our expertly guided tours and seamless transportation.
            </p>
            <p className="text-gray-600 mb-8">
              Contact us for custom land-only package arrangements tailored to your preferences.
            </p>
            <Link href="/contact" className="btn-primary">
              Contact Us for Custom Packages
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 py-16">
        <div className="section-container text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Need a Custom Land Package?</h2>
          <p className="text-xl text-white mb-8">
            We can create a personalized land-only package just for you
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-primary bg-white text-green-600 hover:bg-gray-100">
              Contact Us
            </Link>
            <Link href="/tours" className="btn-primary bg-transparent border-2 border-white text-white hover:bg-white hover:text-green-600">
              Browse All Tours
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
