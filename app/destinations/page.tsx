'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function DestinationsPage() {
  const destinations = [
    {
      name: 'Istanbul',
      description: 'Discover the magical city where East meets West, with its stunning mosques, vibrant bazaars, and scenic Bosphorus cruises',
      slug: 'istanbul',
      attractions: 'Blue Mosque, Hagia Sophia, Grand Bazaar, Topkapi Palace',
      image: '/images/BlueMosqueIstanbul6minarets.jpg',
      gradient: 'from-blue-500 to-blue-700'
    },
    {
      name: 'Cappadocia',
      description: 'Experience the surreal landscape of fairy chimneys and take a breathtaking hot air balloon ride over this unique region',
      slug: 'cappadocia',
      attractions: 'Hot Air Balloons, Goreme, Underground Cities, Cave Hotels',
      image: '/images/cappadocianight.jpg',
      gradient: 'from-orange-500 to-orange-700'
    },
    {
      name: 'Antalya',
      description: 'Enjoy the perfect blend of beautiful beaches, ancient ruins, and charming old town in this Mediterranean paradise',
      slug: 'antalya',
      attractions: 'Old Town (Kaleiçi), Düden Waterfalls, Ancient Ruins, Beautiful Beaches',
      image: '/images/IstanbulatNight.jpeg',
      gradient: 'from-cyan-500 to-cyan-700'
    },
    {
      name: 'Kusadasi - Ephesus',
      description: 'Visit one of the world\'s best preserved ancient cities and nearby House of Virgin Mary',
      slug: 'ephesus',
      attractions: 'Library of Celsus, Grand Theater, Temple of Artemis, House of Virgin Mary',
      image: '/images/Ephesus_Library2.jpg',
      gradient: 'from-green-500 to-green-700'
    },
    {
      name: 'Pamukkale',
      description: 'Marvel at the white travertine terraces and ancient spa of Hierapolis in this natural wonder of Turkey',
      slug: 'pamukkale',
      attractions: 'Travertine Terraces, Hierapolis, Thermal Pools, Cleopatra\'s Pool',
      image: '/images/PamukkaleTravertenler.jpg',
      gradient: 'from-purple-500 to-purple-700'
    },
    {
      name: 'Fethiye',
      description: 'Experience thrilling paragliding adventures, beautiful beaches, and crystal clear waters in this coastal gem',
      slug: 'fethiye',
      attractions: 'Ölüdeniz Beach, Paragliding, Blue Lagoon, Butterfly Valley',
      image: '/images/cappadociaballoonride.jpg',
      gradient: 'from-teal-500 to-teal-700'
    },
    {
      name: 'Marmaris',
      description: 'Explore the beautiful marina, enjoy water sports, and discover the vibrant nightlife of this popular coastal resort',
      slug: 'marmaris',
      attractions: 'Marmaris Marina, Marmaris Castle, Beach Clubs, Boat Tours',
      image: '/images/IstanbulatNight.jpeg',
      gradient: 'from-indigo-500 to-indigo-700'
    },
    {
      name: 'Bodrum',
      description: 'Visit the historic castle, relax on pristine beaches, and enjoy the vibrant atmosphere of this Aegean gem',
      slug: 'bodrum',
      attractions: 'Bodrum Castle, Ancient Theater, Windmills, Beach Clubs',
      image: '/images/cappadocianight.jpg',
      gradient: 'from-pink-500 to-pink-700'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[50vh] min-h-[300px] bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white px-4"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Explore Turkey</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              Discover the diverse beauty and rich history of Turkey&apos;s top destinations
            </p>
          </motion.div>
        </div>
      </div>

      {/* Destinations Grid */}
      <section className="section-container py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Top Destinations</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the best of Turkey&apos;s rich history, stunning landscapes, and vibrant culture
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((destination, index) => (
            <motion.div
              key={destination.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              {/* Image with overlay */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={destination.image}
                  alt={destination.name}
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-500"
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${destination.gradient} opacity-20`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <h3 className="text-4xl font-bold text-white p-6">{destination.name}</h3>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-700 mb-4">{destination.description}</p>
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Top Attractions:</p>
                  <p className="text-sm text-gray-600">{destination.attractions}</p>
                </div>
                <Link
                  href={`/destinations/${destination.slug}`}
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold group"
                >
                  Explore {destination.name}
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 py-16">
        <div className="section-container text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl text-white mb-8">
            Book our comprehensive package and experience all these amazing destinations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/packages/istanbul-cappadocia-kusadasi" className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
              View Our Packages
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
