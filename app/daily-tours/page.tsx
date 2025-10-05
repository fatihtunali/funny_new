'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaCalendarDay, FaClock, FaMapMarkerAlt, FaEuroSign } from 'react-icons/fa';
import { PackageGridSkeleton } from '@/components/LoadingSkeleton';

interface DailyTour {
  id: string;
  tourCode: string;
  title: string;
  description: string;
  duration: string;
  city: string;
  sicPrice: number;
  image: string | null;
}

export default function DailyToursPage() {
  const [tours, setTours] = useState<DailyTour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await fetch('/api/daily-tours?category=DAILY_TOUR');
        const data = await res.json();
        setTours(data.tours || []);
      } catch (error) {
        console.error('Error fetching daily tours:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

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
              Explore Turkey&apos;s best attractions with expert local guides
            </p>
          </motion.div>
        </div>
      </div>

      {/* Description Section */}
      <section className="section-container py-12">
        <div className="max-w-4xl mx-auto text-center bg-gray-50 rounded-lg p-8 shadow-md">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What&apos;s Included</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Explore the best attractions with our daily guided tours. Whether you&apos;re looking for a historical
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

      {/* Tours Section */}
      <section className="bg-gray-50 py-16">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Available Daily Tours</h2>
            <p className="text-lg text-gray-600">
              Choose from our selection of expertly curated daily tours
            </p>
          </div>

          {loading ? (
            <PackageGridSkeleton count={6} />
          ) : tours.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center bg-white rounded-lg p-12 shadow-lg"
            >
              <FaCalendarDay className="text-6xl text-orange-600 mx-auto mb-6" />
              <h3 className="text-4xl font-bold text-gray-900 mb-4">Coming Soon</h3>
              <p className="text-lg text-gray-700 mb-8">
                We&apos;re currently preparing our daily tour offerings. These will include historical tours,
                adventure activities, cultural experiences, and more across all major Turkish destinations.
              </p>
              <p className="text-gray-600 mb-8">
                Contact us to arrange custom daily tours in Istanbul, Cappadocia, Ephesus, and beyond.
              </p>
              <Link href="/contact" className="btn-primary">
                Contact Us for Custom Tours
              </Link>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tours.map((tour) => (
                <motion.div
                  key={tour.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="relative h-48">
                    <Image
                      src={tour.image || '/images/destinations/istanbul.jpg'}
                      alt={tour.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-orange-600 text-white px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
                      <FaCalendarDay />
                      {tour.tourCode}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between text-gray-600 mb-2 text-sm">
                      <div className="flex items-center">
                        <FaClock className="mr-2" />
                        <span className="font-semibold">{tour.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <FaMapMarkerAlt className="mr-2" />
                        <span>{tour.city}</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2 min-h-[3.5rem] line-clamp-2">
                      {tour.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{tour.description}</p>

                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">From</span>
                        <div className="flex items-center gap-1 text-orange-700 text-lg font-bold">
                          <FaEuroSign className="text-sm" />
                          {tour.sicPrice}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">per person</p>
                    </div>

                    <Link
                      href={`/daily-tours/${tour.tourCode.toLowerCase()}`}
                      className="block w-full text-center btn-primary text-sm"
                    >
                      View Details & Book
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
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
