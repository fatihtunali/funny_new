'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaMap, FaClock, FaMapMarkerAlt, FaBus, FaFilePdf } from 'react-icons/fa';

interface LandPackage {
  [key: string]: unknown;
}

export default function LandPackagesPage() {
  const [packages, setPackages] = useState<LandPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPackages() {
      try {
        const res = await fetch('/api/packages?type=LAND_ONLY');
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
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What&apos;s Included</h2>
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

      {/* Packages List */}
      <section className="bg-gray-50 py-16">
        <div className="section-container">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
            Available Packages {!loading && packages.length > 0 && `(${packages.length})`}
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">Loading packages...</p>
            </div>
          ) : packages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center bg-white rounded-lg p-12 shadow-lg"
            >
              <FaMap className="text-6xl text-green-600 mx-auto mb-6" />
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Coming Soon</h3>
              <p className="text-lg text-gray-700 mb-8">
                We&apos;re currently preparing our land-only packages. Contact us for custom arrangements.
              </p>
              <Link href="/contact" className="btn-primary">
                Contact Us for Custom Packages
              </Link>
            </motion.div>
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
                        {pkg.destinations.split(',').map((dest: string) => (
                          <span
                            key={dest}
                            className="bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs font-medium"
                          >
                            {dest.trim()}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Link
                        href={`/tours/land-packages/package/${pkg.packageId}`}
                        className="flex items-center justify-center btn-primary text-sm bg-green-600 hover:bg-green-700"
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
