'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaBus, FaClock, FaMapMarkerAlt, FaShieldAlt } from 'react-icons/fa';

export default function TransfersPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[40vh] min-h-[250px] bg-gradient-to-r from-purple-600 to-purple-800">
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white px-4"
          >
            <div className="flex justify-center mb-4">
              <FaBus className="text-6xl" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Transfers</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              Reliable transportation services across Turkey
            </p>
          </motion.div>
        </div>
      </div>

      {/* Description Section */}
      <section className="section-container py-12">
        <div className="max-w-4xl mx-auto text-center bg-gray-50 rounded-lg p-8 shadow-md">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What We Offer</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            We offer convenient and reliable transportation services between airports, hotels, and attractions.
            Our professional drivers ensure a comfortable journey in modern vehicles, allowing you to relax
            and enjoy the scenery without the stress of navigating unfamiliar roads.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white p-4 rounded-lg shadow">
              <FaBus className="text-3xl text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">Modern Vehicles</h3>
              <p className="text-sm text-gray-600">Comfortable and clean</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <FaShieldAlt className="text-3xl text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">Professional Drivers</h3>
              <p className="text-sm text-gray-600">Licensed and experienced</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <FaClock className="text-3xl text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">24/7 Service</h3>
              <p className="text-sm text-gray-600">Available anytime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Transfer Types Section */}
      <section className="bg-gray-50 py-16">
        <div className="section-container">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Transfer Services</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <FaMapMarkerAlt className="text-4xl text-purple-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Airport Transfers</h3>
              <p className="text-gray-700 mb-4">
                Pick-up and drop-off services for all major airports in Turkey including Istanbul, Ankara, Izmir, and Antalya.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <FaMapMarkerAlt className="text-4xl text-purple-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Hotel Transfers</h3>
              <p className="text-gray-700 mb-4">
                Comfortable transportation between hotels and tourist attractions throughout your stay.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <FaMapMarkerAlt className="text-4xl text-purple-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">City to City</h3>
              <p className="text-gray-700 mb-4">
                Long-distance transfers between major Turkish cities with rest stops and refreshments.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <FaMapMarkerAlt className="text-4xl text-purple-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Private Transfers</h3>
              <p className="text-gray-700 mb-4">
                Exclusive vehicles for individuals, families, or small groups with flexible scheduling.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <FaMapMarkerAlt className="text-4xl text-purple-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Group Transfers</h3>
              <p className="text-gray-700 mb-4">
                Large capacity vehicles for tour groups, conferences, and special events.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <FaMapMarkerAlt className="text-4xl text-purple-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">VIP Transfers</h3>
              <p className="text-gray-700 mb-4">
                Luxury vehicles with premium amenities for executive and VIP clients.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-600 to-purple-800 py-16">
        <div className="section-container text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Need a Transfer?</h2>
          <p className="text-xl text-white mb-8">
            Contact us for reliable and comfortable transportation services
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-primary bg-white text-purple-600 hover:bg-gray-100">
              Request Transfer Quote
            </Link>
            <Link href="/tours" className="btn-primary bg-transparent border-2 border-white text-white hover:bg-white hover:text-purple-600">
              Browse All Tours
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
