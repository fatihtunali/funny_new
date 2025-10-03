'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaClock, FaAnchor } from 'react-icons/fa';

export default function MarmarisPage() {
  const attractions = [
    {
      name: 'Marmaris Marina',
      description: 'Stroll along one of Turkey\'s most beautiful marinas with luxury yachts and cafes',
      image: '/images/IstanbulatNight.jpeg',
      duration: '2-3 hours'
    },
    {
      name: 'Marmaris Castle & Museum',
      description: 'Explore the historic castle offering panoramic views of the bay',
      image: '/images/IstanbulatNight.jpeg',
      duration: '1-2 hours'
    },
    {
      name: 'Boat Tours',
      description: 'Daily boat trips to stunning bays, islands, and swimming spots',
      image: '/images/IstanbulatNight.jpeg',
      duration: 'Full day'
    },
    {
      name: 'Beach Clubs',
      description: 'Relax at world-class beach clubs with music, food, and water sports',
      image: '/images/IstanbulatNight.jpeg',
      duration: 'Half day'
    }
  ];

  const experiences = [
    'Boat trips to Dalyan and Cleopatra Island',
    'Scuba diving in crystal-clear waters',
    'Water sports and jet skiing',
    'Vibrant nightlife and beach parties',
    'Shopping in the Grand Bazaar',
    'Turkish bath experience'
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px]">
        <Image
          src="/images/IstanbulatNight.jpeg"
          alt="Marmaris"
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
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Marmaris</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              Vibrant Coastal Resort with Marina, Beaches, and Nightlife
            </p>
          </motion.div>
        </div>
      </div>

      {/* Introduction */}
      <section className="section-container py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Discover Marmaris</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Marmaris is one of Turkey\'s most popular coastal resorts, famous for its stunning natural
            harbor, beautiful beaches, and vibrant atmosphere. Nestled between pine-covered mountains
            and the crystal-clear Mediterranean, it offers the perfect blend of relaxation and excitement.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            From world-class marinas and water sports to bustling bazaars and legendary nightlife,
            Marmaris caters to every type of traveler seeking sun, sea, and entertainment.
          </p>
        </div>
      </section>

      {/* Top Attractions */}
      <section className="bg-gray-50 py-16">
        <div className="section-container">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Must-See Attractions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {attractions.map((attraction, index) => (
              <motion.div
                key={attraction.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative h-48">
                  <Image
                    src={attraction.image}
                    alt={attraction.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{attraction.name}</h3>
                  <p className="text-gray-600 mb-4">{attraction.description}</p>
                  <div className="flex items-center text-indigo-600">
                    <FaClock className="mr-2" />
                    <span className="text-sm">{attraction.duration}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Experiences */}
      <section className="section-container py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Unique Experiences</h2>
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {experiences.map((experience, index) => (
            <motion.div
              key={experience}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start space-x-3 p-4 bg-indigo-50 rounded-lg"
            >
              <FaAnchor className="text-indigo-600 mt-1 flex-shrink-0" />
              <span className="text-gray-800">{experience}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-indigo-500 to-indigo-600 py-16">
        <div className="section-container text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Explore Marmaris?</h2>
          <p className="text-xl text-white mb-8">
            Contact us to plan your perfect coastal getaway
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/packages" className="btn-primary bg-white text-indigo-600 hover:bg-gray-100">
              View Packages
            </Link>
            <Link href="/contact" className="btn-primary bg-transparent border-2 border-white text-white hover:bg-white hover:text-indigo-600">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
