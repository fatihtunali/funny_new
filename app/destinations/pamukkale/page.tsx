'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaClock, FaWater } from 'react-icons/fa';

export default function PamukkalePage() {
  const attractions = [
    {
      name: 'Travertine Terraces',
      description: 'Stunning white calcium carbonate terraces formed over thousands of years',
      image: '/images/PamukkaleTravertenler.jpg',
      duration: '2-3 hours'
    },
    {
      name: 'Hierapolis Ancient City',
      description: 'UNESCO World Heritage ancient Roman spa city with well-preserved ruins',
      image: '/images/PamukkaleTravertenler.jpg',
      duration: '2-3 hours'
    },
    {
      name: 'Cleopatra\'s Pool',
      description: 'Ancient thermal pool where Cleopatra allegedly bathed, surrounded by Roman columns',
      image: '/images/PamukkaleTravertenler.jpg',
      duration: '1-2 hours'
    },
    {
      name: 'Hierapolis Archaeology Museum',
      description: 'Exhibits from excavations including statues, sarcophagi, and ancient artifacts',
      image: '/images/PamukkaleTravertenler.jpg',
      duration: '1 hour'
    }
  ];

  const experiences = [
    'Walking barefoot on travertine terraces',
    'Swimming in Cleopatra\'s thermal pool',
    'Watching sunset over white terraces',
    'Exploring ancient theater and necropolis',
    'Soaking in natural thermal waters',
    'Photography at sunrise'
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px]">
        <Image
          src="/images/PamukkaleTravertenler.jpg"
          alt="Pamukkale Travertine Terraces"
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
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Pamukkale</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              Natural Wonder of Stunning White Terraces and Thermal Springs
            </p>
          </motion.div>
        </div>
      </div>

      {/* Introduction */}
      <section className="section-container py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Discover Pamukkale</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Pamukkale, meaning "Cotton Castle" in Turkish, is a natural wonder featuring brilliant white
            travertine terraces cascading down the mountain slope. These terraces have been formed over
            millennia by calcium-rich thermal springs.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Combined with the ancient spa city of Hierapolis, this UNESCO World Heritage Site offers
            a unique blend of natural beauty and historical significance. The warm, mineral-rich waters
            have been used for therapeutic purposes for over 2,000 years.
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
                  <div className="flex items-center text-purple-600">
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
              className="flex items-start space-x-3 p-4 bg-purple-50 rounded-lg"
            >
              <FaWater className="text-purple-600 mt-1 flex-shrink-0" />
              <span className="text-gray-800">{experience}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-500 to-purple-600 py-16">
        <div className="section-container text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Experience Pamukkale?</h2>
          <p className="text-xl text-white mb-8">
            Book our Istanbul & Cappadocia & Kusadasi package and witness this natural wonder
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/packages/istanbul-cappadocia-kusadasi" className="btn-primary bg-white text-purple-600 hover:bg-gray-100">
              View Package Details
            </Link>
            <Link href="/#contact" className="btn-primary bg-transparent border-2 border-white text-white hover:bg-white hover:text-purple-600">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
