'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const packages = [
  {
    id: 'istanbul-cappadocia-kusadasi',
    title: 'Istanbul, Cappadocia & Kusadasi',
    duration: '9 Nights / 10 Days',
    price: 1029,
    image: '/images/cappadociaballoonride.jpg',
    highlights: [
      'Topkapi Palace & Blue Mosque',
      'Cappadocia Hot Air Balloon',
      'Ancient Ephesus',
      'Pamukkale Travertines'
    ],
    rating: 4.9
  },
  {
    id: 'istanbul-special',
    title: 'Istanbul Special',
    duration: '4 Nights / 5 Days',
    price: 599,
    image: '/images/BlueMosqueIstanbul.jpg',
    highlights: [
      'Bosphorus Cruise',
      'Grand Bazaar Shopping',
      'Hagia Sophia',
      'Topkapi Palace'
    ],
    rating: 4.8
  },
  {
    id: 'cappadocia-adventure',
    title: 'Cappadocia Adventure',
    duration: '3 Nights / 4 Days',
    price: 449,
    image: '/images/FairyChimneysCapppadocia.jpeg',
    highlights: [
      'Hot Air Balloon Ride',
      'Underground Cities',
      'Goreme Open Air Museum',
      'Pottery Workshop'
    ],
    rating: 5.0
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};

export default function FeaturedPackages() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Tour Packages</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Carefully crafted itineraries to help you experience the best of Turkey
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {packages.map((pkg) => (
            <motion.div
              key={pkg.id}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={pkg.image}
                  alt={pkg.title}
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <div className="text-white p-6 w-full">
                    <p className="text-sm font-semibold mb-1">{pkg.duration}</p>
                    <h3 className="text-2xl font-bold">{pkg.title}</h3>
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-accent-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  ⭐ {pkg.rating}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <ul className="space-y-2 mb-6">
                  {pkg.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start text-gray-700">
                      <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm">{highlight}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between border-t pt-4">
                  <div>
                    <p className="text-sm text-gray-500">Starting from</p>
                    <p className="text-2xl font-bold text-primary-600">€{pkg.price}</p>
                    <p className="text-xs text-gray-500">per person</p>
                  </div>
                  <Link
                    href={`/packages/${pkg.id}`}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center mt-12">
          <Link href="/packages" className="btn-primary text-lg">
            View All Packages
          </Link>
        </div>
      </div>
    </section>
  );
}
