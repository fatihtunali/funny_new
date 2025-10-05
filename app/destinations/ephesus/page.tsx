'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaClock, FaLandmark } from 'react-icons/fa';

export default function EphesusPage() {
  const attractions = [
    {
      name: 'Library of Celsus',
      description: 'One of the most beautiful structures in the ancient world, built in 135 AD',
      image: '/images/Ephesus_Library2.jpg',
      duration: '30-45 minutes'
    },
    {
      name: 'Great Theater',
      description: 'Massive amphitheater with 25,000 seat capacity and incredible acoustics',
      image: '/images/Ephesus_Library2.jpg',
      duration: '30-45 minutes'
    },
    {
      name: 'Temple of Artemis',
      description: 'One of the Seven Wonders of the Ancient World (ruins)',
      image: '/images/Ephesus_Library2.jpg',
      duration: '30 minutes'
    },
    {
      name: 'Terrace Houses',
      description: 'Luxurious homes of wealthy Ephesians with stunning mosaics and frescoes',
      image: '/images/Ephesus_Library2.jpg',
      duration: '1 hour'
    }
  ];

  const experiences = [
    'Walking the ancient Marble Street',
    'Exploring the Temple of Hadrian',
    'Visiting the House of Virgin Mary',
    'Ancient Roman baths tour',
    'Archaeological museum visit',
    'Local Turkish lunch in Selçuk'
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px]">
        <Image
          src="/images/Ephesus_Library2.jpg"
          alt="Ephesus - Library of Celsus"
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
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Ephesus</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              Walk Through History in One of the Best-Preserved Ancient Cities
            </p>
          </motion.div>
        </div>
      </div>

      {/* Introduction */}
      <section className="section-container py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Discover Ephesus</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Ephesus is one of the most magnificent ancient cities in the Mediterranean region.
            Founded in the 10th century BC, it was once the second largest city in the Roman Empire,
            with a population of over 250,000 people.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Today, Ephesus is one of the most complete classical cities in the world, featuring
            remarkably well-preserved ruins including the iconic Library of Celsus, the Great Theater,
            and the Temple of Artemis - one of the Seven Wonders of the Ancient World.
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
                  <div className="flex items-center text-green-600">
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
              className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg"
            >
              <FaLandmark className="text-green-600 mt-1 flex-shrink-0" />
              <span className="text-gray-800">{experience}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-500 to-green-600 py-16">
        <div className="section-container text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Explore Ancient Ephesus?</h2>
          <p className="text-xl text-white mb-8">
            Book our Istanbul & Cappadocia & Kusadasi package and walk through history
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/packages/istanbul-cappadocia-kusadasi" className="btn-primary bg-white text-green-600 hover:bg-gray-100">
              View Package Details
            </Link>
            <Link href="/#contact" className="btn-primary bg-transparent border-2 border-white text-white hover:bg-white hover:text-green-600">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
