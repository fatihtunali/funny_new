'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaClock, FaUmbrellaBeach } from 'react-icons/fa';

export default function AntalyaPage() {
  const attractions = [
    {
      name: 'Old Town (Kaleiçi)',
      description: 'Wander through narrow cobblestone streets filled with Ottoman-era houses and charming cafes',
      image: '/images/IstanbulatNight.jpeg',
      duration: '2-3 hours'
    },
    {
      name: 'Düden Waterfalls',
      description: 'Visit stunning waterfalls that cascade directly into the Mediterranean Sea',
      image: '/images/IstanbulatNight.jpeg',
      duration: '1-2 hours'
    },
    {
      name: 'Aspendos Theater',
      description: 'Explore one of the best-preserved Roman theaters in the world',
      image: '/images/IstanbulatNight.jpeg',
      duration: '1-2 hours'
    },
    {
      name: 'Konyaaltı Beach',
      description: 'Relax on beautiful pebble beaches with crystal clear turquoise waters',
      image: '/images/IstanbulatNight.jpeg',
      duration: 'Half day'
    }
  ];

  const experiences = [
    'Swimming in Mediterranean waters',
    'Exploring ancient Perge and Termessos',
    'Shopping in traditional bazaars',
    'Boat tours along the coast',
    'Trying traditional Turkish cuisine',
    'Cable car ride to Tunektepe'
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px]">
        <Image
          src="/images/IstanbulatNight.jpeg"
          alt="Antalya"
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
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Antalya</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              Mediterranean Paradise of Beaches and Ancient Ruins
            </p>
          </motion.div>
        </div>
      </div>

      {/* Introduction */}
      <section className="section-container py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Discover Antalya</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Antalya is Turkey's most popular Mediterranean resort city, combining beautiful beaches,
            a charming old town, and impressive ancient ruins. With over 300 days of sunshine per year,
            it's the perfect destination for beach lovers and history enthusiasts alike.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            From the picturesque old harbor to the stunning waterfalls and nearby ancient cities,
            Antalya offers a perfect blend of relaxation and exploration.
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
                  <div className="flex items-center text-cyan-600">
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
              className="flex items-start space-x-3 p-4 bg-cyan-50 rounded-lg"
            >
              <FaUmbrellaBeach className="text-cyan-600 mt-1 flex-shrink-0" />
              <span className="text-gray-800">{experience}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-cyan-500 to-cyan-600 py-16">
        <div className="section-container text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Experience Antalya?</h2>
          <p className="text-xl text-white mb-8">
            Contact us to plan your perfect Mediterranean getaway
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/packages" className="btn-primary bg-white text-cyan-600 hover:bg-gray-100">
              View Packages
            </Link>
            <Link href="/contact" className="btn-primary bg-transparent border-2 border-white text-white hover:bg-white hover:text-cyan-600">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
