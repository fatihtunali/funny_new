'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaClock, FaParachuteBox } from 'react-icons/fa';

export default function FethiyePage() {
  const attractions = [
    {
      name: 'Ölüdeniz Beach & Blue Lagoon',
      description: 'One of Turkey\'s most photographed beaches with stunning turquoise waters',
      image: '/images/cappadociaballoonride.jpg',
      duration: 'Full day'
    },
    {
      name: 'Paragliding from Babadağ',
      description: 'Experience one of the world\'s best paragliding spots with breathtaking views',
      image: '/images/cappadociaballoonride.jpg',
      duration: '2-3 hours'
    },
    {
      name: 'Butterfly Valley',
      description: 'Hidden paradise accessible by boat, home to numerous butterfly species',
      image: '/images/cappadociaballoonride.jpg',
      duration: 'Half day'
    },
    {
      name: 'Saklıkent Gorge',
      description: 'Walk through stunning canyon with ice-cold mountain water',
      image: '/images/cappadociaballoonride.jpg',
      duration: '3-4 hours'
    }
  ];

  const experiences = [
    'Paragliding over Ölüdeniz',
    'Boat tours to hidden coves',
    'Kayaking in Butterfly Valley',
    'Visiting ancient Lycian rock tombs',
    'Swimming in crystal-clear waters',
    'Turkish night with traditional food'
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px]">
        <Image
          src="/images/cappadociaballoonride.jpg"
          alt="Fethiye"
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
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Fethiye</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              Adventure Paradise with Crystal Waters and Stunning Beaches
            </p>
          </motion.div>
        </div>
      </div>

      {/* Introduction */}
      <section className="section-container py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Discover Fethiye</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Fethiye is a stunning coastal town on Turkey\'s Turquoise Coast, famous for the
            legendary Blue Lagoon at Ölüdeniz and world-class paragliding. This vibrant destination
            offers perfect beaches, ancient Lycian ruins, and endless adventure opportunities.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            From soaring above the coastline to exploring hidden valleys and swimming in pristine waters,
            Fethiye is an outdoor enthusiast\'s dream destination.
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
                  <div className="flex items-center text-teal-600">
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
              className="flex items-start space-x-3 p-4 bg-teal-50 rounded-lg"
            >
              <FaParachuteBox className="text-teal-600 mt-1 flex-shrink-0" />
              <span className="text-gray-800">{experience}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-teal-500 to-teal-600 py-16">
        <div className="section-container text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready for Adventure in Fethiye?</h2>
          <p className="text-xl text-white mb-8">
            Contact us to plan your thrilling Fethiye experience
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/packages" className="btn-primary bg-white text-teal-600 hover:bg-gray-100">
              View Packages
            </Link>
            <Link href="/contact" className="btn-primary bg-transparent border-2 border-white text-white hover:bg-white hover:text-teal-600">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
