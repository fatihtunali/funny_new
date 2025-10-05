'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaClock, FaHotjar } from 'react-icons/fa';

export default function CappadociaPage() {
  const attractions = [
    {
      name: 'Hot Air Balloon Ride',
      description: 'Experience the magical sunrise over fairy chimneys from a hot air balloon',
      image: '/images/cappadociaballoonride.jpg',
      duration: '1-2 hours'
    },
    {
      name: 'Göreme Open Air Museum',
      description: 'UNESCO World Heritage site with rock-carved churches and stunning frescoes',
      image: '/images/cappadocianight.jpg',
      duration: '2-3 hours'
    },
    {
      name: 'Underground Cities',
      description: 'Explore ancient underground cities carved deep into volcanic rock',
      image: '/images/cappadocianight.jpg',
      duration: '2-3 hours'
    },
    {
      name: 'Cave Hotels',
      description: 'Stay in unique cave hotels carved into the natural rock formations',
      image: '/images/cappadocianight.jpg',
      duration: 'Overnight'
    }
  ];

  const experiences = [
    'Hot air balloon flight at sunrise',
    'Cave hotel accommodation',
    'Valley hiking and trekking',
    'Traditional pottery workshops',
    'Turkish night show with dinner',
    'ATV tours through valleys'
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px]">
        <Image
          src="/images/cappadociaballoonride.jpg"
          alt="Cappadocia Hot Air Balloons"
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
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Cappadocia</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              A Magical Landscape of Fairy Chimneys and Ancient Wonders
            </p>
          </motion.div>
        </div>
      </div>

      {/* Introduction */}
      <section className="section-container py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Discover Cappadocia</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Cappadocia is a geological wonderland featuring unique rock formations called &quot;fairy chimneys,&quot;
            ancient cave dwellings, and underground cities carved thousands of years ago. This UNESCO World
            Heritage site offers one of the most extraordinary landscapes on Earth.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Famous for its spectacular hot air balloon flights, Cappadocia provides unforgettable views
            of valleys, rock formations, and ancient cave churches that make this region truly magical.
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
                  <div className="flex items-center text-orange-600">
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
              className="flex items-start space-x-3 p-4 bg-orange-50 rounded-lg"
            >
              <FaHotjar className="text-orange-600 mt-1 flex-shrink-0" />
              <span className="text-gray-800">{experience}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 py-16">
        <div className="section-container text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Experience Cappadocia?</h2>
          <p className="text-xl text-white mb-8">
            Book our Istanbul & Cappadocia & Kusadasi package and witness this magical landscape
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/packages/istanbul-cappadocia-kusadasi" className="btn-primary bg-white text-orange-600 hover:bg-gray-100">
              View Package Details
            </Link>
            <Link href="/#contact" className="btn-primary bg-transparent border-2 border-white text-white hover:bg-white hover:text-orange-600">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
