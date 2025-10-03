'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaHotel, FaMap, FaCalendarDay, FaBus } from 'react-icons/fa';

export default function ToursPage() {
  const categories = [
    {
      name: 'Package with Hotels',
      slug: 'hotels-packages',
      icon: <FaHotel className="text-4xl" />,
      description: 'Our comprehensive hotel packages include accommodations, guided tours, airport transfers, and more. These all-inclusive options make your travel planning effortless and ensure you experience the best Turkey has to offer. Packages are available for various durations, from short 4-day trips to extended 11-day adventures.',
      image: '/images/cappadociaballoonride.jpg',
      color: 'from-blue-500 to-blue-700'
    },
    {
      name: 'Land Only Packages',
      slug: 'land-packages',
      icon: <FaMap className="text-4xl" />,
      description: 'Our land-only packages provide guided tours, transportation between attractions, and all entrance fees without hotel accommodations. These packages are perfect for travelers who prefer to arrange their own lodging while still benefiting from our expertly guided experiences throughout Turkey.',
      image: '/images/cappadociaballoonride.jpg',
      color: 'from-green-500 to-green-700'
    },
    {
      name: 'Daily Tours',
      slug: 'daily-tours',
      icon: <FaCalendarDay className="text-4xl" />,
      description: 'Explore the best attractions with our daily guided tours. Whether you\'re looking for a historical walking tour of Istanbul, a hot air balloon ride in Cappadocia, or a boat excursion along the Turkish coast, our daily tours provide memorable experiences with expert local guides.',
      image: '/images/IstanbulatNight.jpeg',
      color: 'from-orange-500 to-orange-700'
    },
    {
      name: 'Transfers',
      slug: 'transfers',
      icon: <FaBus className="text-4xl" />,
      description: 'We offer convenient and reliable transportation services between airports, hotels, and attractions. Our professional drivers ensure a comfortable journey in modern vehicles, allowing you to relax and enjoy the scenery without the stress of navigating unfamiliar roads.',
      image: '/images/IstanbulatNight.jpeg',
      color: 'from-purple-500 to-purple-700'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[40vh] min-h-[250px] bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white px-4"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Our Tours</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              Join our uniquely guided tours for an unforgettable travel experience!
            </p>
          </motion.div>
        </div>
      </div>

      {/* Intro Section */}
      <section className="section-container py-12">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg text-gray-600 leading-relaxed">
            Select a tour category below to explore our packages and find the perfect Turkish adventure for you.
          </p>
        </div>
      </section>

      {/* Category Pills */}
      <section className="bg-gray-50 py-8">
        <div className="section-container">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={`/tours/${category.slug}`}
                  className="inline-block px-6 py-3 bg-white border-2 border-gray-300 rounded-full hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all duration-300 font-semibold text-gray-700"
                >
                  {category.name}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Detail Section */}
      <section className="section-container py-16">
        <div className="space-y-16">
          {categories.map((category, index) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="max-w-5xl mx-auto"
            >
              {/* Category Image */}
              <div className="relative h-64 rounded-lg overflow-hidden shadow-xl mb-8">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-30`} />
              </div>

              {/* Category Description */}
              <div className="bg-gray-50 rounded-lg p-8 shadow-md">
                <div className="flex items-center justify-center mb-4">
                  <div className="text-primary-600 mr-3">{category.icon}</div>
                  <h3 className="text-3xl font-bold text-primary-600">{category.name}</h3>
                </div>
                <p className="text-gray-700 text-center leading-relaxed mb-6">
                  {category.description}
                </p>
                <div className="text-center">
                  <Link
                    href={`/tours/${category.slug}`}
                    className="btn-primary inline-block"
                  >
                    View {category.name}
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 py-16">
        <div className="section-container text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Need Help Choosing?</h2>
          <p className="text-xl text-white mb-8">
            Contact our travel experts to find the perfect tour package for your needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
              Contact Us
            </Link>
            <a
              href="https://wa.me/905395025310"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary bg-green-500 text-white hover:bg-green-600 border-0"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
