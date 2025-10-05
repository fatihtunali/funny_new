'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaClock, FaFortAwesome } from 'react-icons/fa';

export default function BodrumPage() {
  const attractions = [
    {
      name: 'Bodrum Castle',
      description: 'Magnificent 15th-century castle housing the Museum of Underwater Archaeology',
      image: '/images/cappadocianight.jpg',
      duration: '2-3 hours'
    },
    {
      name: 'Ancient Theater',
      description: 'Well-preserved 4th-century BC theater with stunning views of the bay',
      image: '/images/cappadocianight.jpg',
      duration: '1 hour'
    },
    {
      name: 'Bodrum Windmills',
      description: 'Iconic whitewashed windmills offering panoramic views of the peninsula',
      image: '/images/cappadocianight.jpg',
      duration: '30 minutes'
    },
    {
      name: 'Beach Clubs',
      description: 'Trendy beach clubs and pristine beaches along the turquoise coast',
      image: '/images/cappadocianight.jpg',
      duration: 'Half day'
    }
  ];

  const experiences = [
    'Boat trips to Greek islands',
    'Diving and snorkeling adventures',
    'Exploring charming white-washed streets',
    'Visiting Mausoleum of Halicarnassus site',
    'Shopping in Bodrum Marina',
    'Nightlife at beach clubs'
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px]">
        <Image
          src="/images/cappadocianight.jpg"
          alt="Bodrum"
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
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Bodrum</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              Aegean Gem with Historic Castle and Vibrant Beach Culture
            </p>
          </motion.div>
        </div>
      </div>

      {/* Introduction */}
      <section className="section-container py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Discover Bodrum</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Bodrum is the pearl of Turkey&apos;s Aegean coast, where ancient history meets modern luxury.
            Built on the ruins of ancient Halicarnassus, home to one of the Seven Wonders of the Ancient
            World, Bodrum today is a sophisticated resort town with pristine beaches and vibrant culture.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            From the magnificent castle overlooking the marina to charming whitewashed houses and
            world-class beach clubs, Bodrum offers an elegant blend of history, culture, and seaside luxury.
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
                  <div className="flex items-center text-pink-600">
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
              className="flex items-start space-x-3 p-4 bg-pink-50 rounded-lg"
            >
              <FaFortAwesome className="text-pink-600 mt-1 flex-shrink-0" />
              <span className="text-gray-800">{experience}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-pink-500 to-pink-600 py-16">
        <div className="section-container text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Discover Bodrum?</h2>
          <p className="text-xl text-white mb-8">
            Contact us to plan your perfect Aegean escape
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/packages" className="btn-primary bg-white text-pink-600 hover:bg-gray-100">
              View Packages
            </Link>
            <Link href="/contact" className="btn-primary bg-transparent border-2 border-white text-white hover:bg-white hover:text-pink-600">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
