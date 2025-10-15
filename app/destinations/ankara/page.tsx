'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaClock, FaMapMarkerAlt } from 'react-icons/fa';

export default function AnkaraPage() {
  const attractions = [
    {
      name: 'Anitkabir',
      description: 'Mausoleum of Mustafa Kemal Ataturk, founder of modern Turkey',
      image: '/images/anitkabir.jpg',
      duration: '2-3 hours'
    },
    {
      name: 'Museum of Anatolian Civilizations',
      description: 'Showcases archaeological treasures from ancient Anatolia',
      image: '/images/anitkabir-new.jpg',
      duration: '2-3 hours'
    },
    {
      name: 'Ankara Castle',
      description: 'Historic fortress offering panoramic views of the city',
      image: '/images/anitkabir.jpg',
      duration: '1-2 hours'
    },
    {
      name: 'Atakule Tower',
      description: 'Modern observation tower with 360-degree city views',
      image: '/images/anitkabir-new.jpg',
      duration: '1 hour'
    }
  ];

  const experiences = [
    'Traditional Ankara kebab tasting',
    'Haci Bayram Mosque visit',
    'Kizilay shopping district',
    'Genclik Park relaxation',
      'Turkish Parliament area tour',
    'Museum of Turkish Republic history'
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px]">
        <Image
          src="/images/anitkabir.jpg"
          alt="Ankara - Anitkabir"
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
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Ankara</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              Heart of Modern Turkey - Capital of Culture and History
            </p>
          </motion.div>
        </div>
      </div>

      {/* Introduction */}
      <section className="section-container py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Discover Ankara</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Ankara, Turkey&apos;s capital city, is a modern metropolis with deep historical roots.
            From ancient Hittite settlements to the center of modern Turkish politics,
            Ankara represents the heart of contemporary Turkey.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Visit world-class museums, impressive monuments, and experience the dynamic pulse
            of Turkey&apos;s political and cultural center.
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
                  <div className="flex items-center text-primary-600">
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
              className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg"
            >
              <FaMapMarkerAlt className="text-primary-600 mt-1 flex-shrink-0" />
              <span className="text-gray-800">{experience}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 py-16">
        <div className="section-container text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Explore Ankara?</h2>
          <p className="text-xl text-white mb-8">
            Experience the heart of modern Turkey and its rich heritage
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/packages" className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
              View Tour Packages
            </Link>
            <Link href="/contact" className="btn-primary bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
