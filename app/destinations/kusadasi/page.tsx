'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaClock, FaUmbrellaBeach } from 'react-icons/fa';

export default function KusadasiPage() {
  const attractions = [
    {
      name: 'Ancient Ephesus',
      description: 'Visit one of the best-preserved ancient cities, just 20 minutes away',
      image: '/images/Ephesus_Library2.jpg',
      duration: '3-4 hours'
    },
    {
      name: 'House of Virgin Mary',
      description: 'Sacred pilgrimage site where Virgin Mary is believed to have spent her last days',
      image: '/images/MeryemAnaEvi.jpeg',
      duration: '1 hour'
    },
    {
      name: 'Pigeon Island & Castle',
      description: 'Iconic symbol of Kusadasi with Byzantine fortress and stunning sea views',
      image: '/images/antalya-port.jpg',
      duration: '1-2 hours'
    },
    {
      name: 'Ladies Beach',
      description: 'Beautiful sandy beach with crystal-clear waters and beach clubs',
      image: '/images/FethiyeBay.jpg',
      duration: 'Half day'
    }
  ];

  const experiences = [
    'Swimming at pristine Aegean beaches',
    'Exploring ancient Ephesus ruins',
    'Shopping at Kusadasi Grand Bazaar',
    'Visiting nearby Sirince village',
    'Day trip to Priene-Miletus-Didyma',
    'Turkish bath experience',
    'Fresh seafood dining at marina',
    'Sunset walks along the promenade'
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px]">
        <Image
          src="/images/Ephesus_Library2.jpg"
          alt="Kusadasi - Gateway to Ancient Ephesus"
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
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Kusadasi</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              Where Ancient History Meets Aegean Paradise
            </p>
          </motion.div>
        </div>
      </div>

      {/* Introduction */}
      <section className="section-container py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Discover Kusadasi</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Kusadasi, meaning "Bird Island" in Turkish, is a vibrant coastal resort town on Turkey's
            stunning Aegean coast. Known as the gateway to the ancient city of Ephesus, this charming
            destination perfectly combines rich historical heritage with modern beach resort amenities.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            With its beautiful beaches, crystal-clear waters, bustling bazaars, and proximity to some of
            Turkey's most important archaeological sites, Kusadasi offers an unforgettable blend of
            relaxation, culture, and adventure. It's also one of the Mediterranean's busiest cruise ports,
            welcoming visitors from around the world.
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
                  <div className="flex items-center text-blue-600">
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
              className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg"
            >
              <FaUmbrellaBeach className="text-blue-600 mt-1 flex-shrink-0" />
              <span className="text-gray-800">{experience}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-500 to-blue-600 py-16">
        <div className="section-container text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Explore Kusadasi?</h2>
          <p className="text-xl text-white mb-8">
            Book our Istanbul & Cappadocia & Kusadasi package for the complete Turkish experience
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/packages/istanbul-cappadocia-kusadasi" className="btn-primary bg-white text-blue-600 hover:bg-gray-100">
              View Package Details
            </Link>
            <Link href="/#contact" className="btn-primary bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
