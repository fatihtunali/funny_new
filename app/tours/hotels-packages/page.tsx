'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaHotel, FaClock, FaMapMarkerAlt, FaFilePdf, FaDownload } from 'react-icons/fa';

export default function HotelsPackagesPage() {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPackages() {
      try {
        const res = await fetch('/api/packages');
        const data = await res.json();
        setPackages(data.packages || []);
      } catch (error) {
        console.error('Error fetching packages:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPackages();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[40vh] min-h-[250px] bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white px-4"
          >
            <div className="flex justify-center mb-4">
              <FaHotel className="text-6xl" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Packages with Hotels</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              SIC Tours with Private Airport Transfers - 2025
            </p>
          </motion.div>
        </div>
      </div>

      {/* Description Section */}
      <section className="section-container py-12">
        <div className="max-w-4xl mx-auto text-center bg-gray-50 rounded-lg p-8 shadow-md">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What's Included</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Our comprehensive hotel packages include accommodations, SIC (Seat-In-Coach) guided tours,
            private airport transfers, and more. These all-inclusive options make your travel planning effortless
            and ensure you experience the best Turkey has to offer. Packages available from 4 to 11 days.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white p-4 rounded-lg shadow">
              <FaHotel className="text-3xl text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">Hotel Accommodation</h3>
              <p className="text-sm text-gray-600">3, 4, or 5-star hotels with breakfast</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <FaMapMarkerAlt className="text-3xl text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">SIC Guided Tours</h3>
              <p className="text-sm text-gray-600">Expert local guides in groups</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <FaClock className="text-3xl text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">Private Transfers</h3>
              <p className="text-sm text-gray-600">Airport pick-up and drop-off</p>
            </div>
          </div>
        </div>
      </section>

      {/* Packages List */}
      <section className="bg-gray-50 py-16">
        <div className="section-container">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
            Available Packages {!loading && `(${packages.length})`}
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">Loading packages...</p>
            </div>
          ) : packages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No packages available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg, index) => (
                <motion.div
                  key={pkg.packageId}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="relative h-48">
                    <Image
                      src={pkg.image}
                      alt={pkg.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="p-6">
                    <div className="flex items-center text-gray-600 mb-2">
                      <FaClock className="mr-2 text-sm" />
                      <span className="text-sm font-semibold">{pkg.duration}</span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2 min-h-[3.5rem] line-clamp-2">{pkg.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 h-[4.5rem] line-clamp-3">{pkg.description}</p>

                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {pkg.destinations.split(',').map((dest) => (
                          <span
                            key={dest}
                            className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium"
                          >
                            {dest.trim()}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Link
                        href={`/tours/hotels-packages/package/${pkg.packageId}`}
                        className="flex items-center justify-center btn-primary text-sm"
                      >
                        View Details & Book
                      </Link>
                      {pkg.pdfUrl && (
                        <a
                          href={pkg.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center btn-secondary text-sm"
                        >
                          <FaFilePdf className="mr-2" />
                          Download PDF
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-16">
        <div className="section-container text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Book Your Package?</h2>
          <p className="text-xl text-white mb-8">
            Contact us for personalized packages and special offers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-primary bg-white text-blue-600 hover:bg-gray-100">
              Contact Us
            </Link>
            <Link href="/tours" className="btn-primary bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600">
              Browse All Tours
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
