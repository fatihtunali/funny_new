'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaClock, FaMapMarkerAlt } from 'react-icons/fa';

export default function TrabzonPage() {
  const attractions = [
    {
      name: 'Sumela Monastery',
      description: 'Spectacular cliff-side monastery with breathtaking mountain views',
      image: '/images/trabzon.jpg',
      duration: '3-4 hours'
    },
    {
      name: 'Uzungol Lake',
      description: 'Picturesque mountain lake surrounded by green valleys and forests',
      image: '/images/trabzon.jpg',
      duration: 'Half day'
    },
    {
      name: 'Ataturk Pavilion',
      description: 'Beautiful historic mansion set in lush gardens',
      image: '/images/trabzon.jpg',
      duration: '1-2 hours'
    },
    {
      name: 'Trabzon Castle',
      description: 'Ancient fortress with Byzantine and Ottoman heritage',
      image: '/images/trabzon.jpg',
      duration: '1 hour'
    }
  ];

  const experiences = [
    'Black Sea coast exploration',
    'Traditional Trabzon cuisine',
    'Highland plateaus (yayla) visit',
    'Tea plantation tours',
    'Ayder plateau hot springs',
    'Local cheese and honey tasting'
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px]">
        <Image
          src="/images/trabzon.jpg"
          alt="Trabzon - Pearl of the Black Sea"
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
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Trabzon</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              Pearl of the Black Sea - Nature&apos;s Masterpiece
            </p>
          </motion.div>
        </div>
      </div>

      {/* Introduction */}
      <section className="section-container py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Discover Trabzon</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Trabzon is a stunning Black Sea city known for its lush green mountains, dramatic cliffs,
            and the iconic Sumela Monastery. This historic city has been an important trade center
            for centuries, connecting east and west along the ancient Silk Road.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            From pristine mountain lakes to misty highland plateaus and traditional Black Sea culture,
            Trabzon offers a unique escape into natural beauty and cultural heritage.
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
              className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg"
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
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Explore Trabzon?</h2>
          <p className="text-xl text-white mb-8">
            Experience the breathtaking beauty of the Black Sea region
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
