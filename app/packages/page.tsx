'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaClock, FaHotel, FaMapMarkerAlt, FaUsers } from 'react-icons/fa';

export default function PackagesPage() {
  const packages = [
    {
      id: 'istanbul-cappadocia-kusadasi',
      title: 'Istanbul & Cappadocia & Kusadasi Package',
      duration: '9 Nights / 10 Days',
      image: '/images/cappadociaballoonride.jpg',
      description: 'Experience the best of Turkey with this comprehensive tour covering Istanbul\'s historical treasures, Cappadocia\'s magical landscapes, and the ancient wonders of Kusadasi.',
      highlights: [
        'Blue Mosque & Hagia Sophia in Istanbul',
        'Hot air balloon ride in Cappadocia',
        'Ancient city of Ephesus',
        'Pamukkale travertine terraces',
        'Professional English-speaking guide',
        'Premium hotel accommodation'
      ],
      destinations: ['Istanbul', 'Cappadocia', 'Kusadasi', 'Pamukkale'],
      priceFrom: 1029,
      currency: 'EUR'
    }
  ];

  const features = [
    {
      icon: <FaHotel className="text-4xl text-primary-600" />,
      title: 'Premium Accommodation',
      description: 'Choose from 3-star, 4-star, or 5-star hotels with breakfast included'
    },
    {
      icon: <FaUsers className="text-4xl text-primary-600" />,
      title: 'Expert Guides',
      description: 'Professional English-speaking guides throughout your journey'
    },
    {
      icon: <FaMapMarkerAlt className="text-4xl text-primary-600" />,
      title: 'Top Destinations',
      description: 'Visit Istanbul, Cappadocia, Ephesus, and Pamukkale'
    },
    {
      icon: <FaClock className="text-4xl text-primary-600" />,
      title: 'Flexible Booking',
      description: 'Customizable itineraries to match your preferences'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[50vh] min-h-[300px]">
        <Image
          src="/images/cappadociaballoonride.jpg"
          alt="Turkey Tour Packages"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70" />
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white px-4"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Turkey Tour Packages</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              Discover unforgettable experiences with our carefully curated tours
            </p>
          </motion.div>
        </div>
      </div>

      {/* Introduction */}
      <section className="section-container py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose Our Packages?</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            We specialize in creating memorable Turkey experiences with carefully planned itineraries,
            premium accommodations, and expert local guides. Each package is designed to showcase
            the best of Turkey's history, culture, and natural beauty.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-gray-50 py-16">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="section-container py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Featured Packages</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            All-inclusive tours designed for unforgettable experiences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 max-w-4xl mx-auto">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-80 overflow-hidden">
                <Image
                  src={pkg.image}
                  alt={pkg.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-accent-500 text-white px-4 py-2 rounded-full font-bold">
                  From €{pkg.priceFrom}
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="flex items-center text-gray-600 mb-3">
                  <FaClock className="mr-2" />
                  <span className="font-semibold">{pkg.duration}</span>
                </div>

                <h3 className="text-3xl font-bold text-gray-900 mb-4">{pkg.title}</h3>
                <p className="text-gray-700 mb-6 text-lg">{pkg.description}</p>

                {/* Destinations */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-primary-600" />
                    Destinations Covered:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {pkg.destinations.map((dest) => (
                      <span
                        key={dest}
                        className="bg-blue-50 text-primary-700 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {dest}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Highlights */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Package Highlights:</h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {pkg.highlights.map((highlight, i) => (
                      <li key={i} className="flex items-start text-gray-700">
                        <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href={`/packages/${pkg.id}`}
                    className="flex-1 btn-primary text-center"
                  >
                    View Full Itinerary
                  </Link>
                  <Link
                    href="/#contact"
                    className="flex-1 btn-secondary text-center"
                  >
                    Request Quote
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 py-16">
        <div className="section-container text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Explore Turkey?</h2>
          <p className="text-xl text-white mb-8">
            Contact us today to customize your perfect Turkish adventure
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/#contact" className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
              Get in Touch
            </Link>
            <a
              href="https://wa.me/1234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary bg-green-500 text-white hover:bg-green-600 border-0"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
