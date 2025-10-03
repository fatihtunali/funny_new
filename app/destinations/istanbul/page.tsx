'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaClock, FaCamera, FaUtensils } from 'react-icons/fa';

export default function IstanbulPage() {
  const attractions = [
    {
      name: 'Blue Mosque (Sultan Ahmed Mosque)',
      description: 'Marvel at the stunning blue tiles and six minarets of this iconic mosque',
      image: '/images/BlueMosqueIstanbul6minarets.jpg',
      duration: '1-2 hours'
    },
    {
      name: 'Hagia Sophia',
      description: 'Ancient Byzantine basilica turned mosque, a masterpiece of architecture',
      image: '/images/IstanbulatNight.jpeg',
      duration: '2-3 hours'
    },
    {
      name: 'Grand Bazaar',
      description: 'One of the largest covered markets in the world with over 4,000 shops',
      image: '/images/IstanbulatNight.jpeg',
      duration: '2-4 hours'
    },
    {
      name: 'Topkapi Palace',
      description: 'Former residence of Ottoman sultans with stunning views of the Bosphorus',
      image: '/images/IstanbulatNight.jpeg',
      duration: '2-3 hours'
    }
  ];

  const experiences = [
    'Bosphorus cruise between Europe and Asia',
    'Turkish bath (Hamam) experience',
    'Traditional Turkish cuisine tasting',
    'Whirling Dervishes show',
    'Spice Bazaar exploration',
    'Dolmabahçe Palace visit'
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px]">
        <Image
          src="/images/BlueMosqueIstanbul6minarets.jpg"
          alt="Istanbul - Blue Mosque"
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
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Istanbul</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              Where East Meets West - A City of Timeless Beauty
            </p>
          </motion.div>
        </div>
      </div>

      {/* Introduction */}
      <section className="section-container py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Discover Istanbul</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Istanbul is the only city in the world that spans two continents - Europe and Asia.
            With over 2,500 years of history, this magnificent city has been the capital of three great empires:
            Roman, Byzantine, and Ottoman.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            From ancient mosques and palaces to bustling bazaars and modern shopping districts,
            Istanbul offers an unforgettable blend of old and new, traditional and contemporary.
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
              className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg"
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
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Explore Istanbul?</h2>
          <p className="text-xl text-white mb-8">
            Book our Istanbul & Cappadocia & Kusadasi package and experience the best of Turkey
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/packages/istanbul-cappadocia-kusadasi" className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
              View Package Details
            </Link>
            <Link href="/#contact" className="btn-primary bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
