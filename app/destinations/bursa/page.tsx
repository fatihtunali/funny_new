'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaClock, FaMapMarkerAlt } from 'react-icons/fa';

export default function BursaPage() {
  const attractions = [
    {
      name: 'Grand Mosque (Ulu Camii)',
      description: 'Magnificent Ottoman mosque with 20 domes and beautiful calligraphy',
      image: '/images/bursa.jpg',
      duration: '1 hour'
    },
    {
      name: 'Green Tomb (Yesil Turbe)',
      description: 'Stunning turquoise-tiled mausoleum of Sultan Mehmed I',
      image: '/images/bursa1.jpg',
      duration: '30 minutes'
    },
    {
      name: 'Uludag Mountain',
      description: 'Premier ski resort in winter, hiking paradise in summer',
      image: '/images/bursa.jpg',
      duration: 'Full day'
    },
    {
      name: 'Historic Silk Market',
      description: 'Traditional covered bazaar selling silk products and local crafts',
      image: '/images/bursa1.jpg',
      duration: '2-3 hours'
    }
  ];

  const experiences = [
    'Traditional Turkish bath experience',
    'Skiing at Uludag resort',
    'Iskender kebab tasting',
    'Ottoman heritage tour',
    'Cable car ride to Uludag',
    'Cumalikizik village visit'
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px]">
        <Image
          src="/images/bursa.jpg"
          alt="Bursa - Green Bursa"
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
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Bursa</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              First Capital of the Ottoman Empire - Green City
            </p>
          </motion.div>
        </div>
      </div>

      {/* Introduction */}
      <section className="section-container py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Discover Bursa</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Bursa, known as &quot;Green Bursa&quot; for its lush parks and gardens, was the first capital of the Ottoman Empire.
            This historic city at the foot of Mount Uludag combines rich Ottoman heritage with natural beauty.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            From magnificent mosques and thermal baths to ski slopes and traditional silk markets,
            Bursa offers a unique blend of history, culture, and outdoor adventure.
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
              className="flex items-start space-x-3 p-4 bg-emerald-50 rounded-lg"
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
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Explore Bursa?</h2>
          <p className="text-xl text-white mb-8">
            Discover the first capital of the Ottoman Empire and its natural wonders
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
