'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaPlane, FaSearch, FaTag, FaShieldAlt } from 'react-icons/fa';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppWidget from '@/components/WhatsAppWidget';

export default function FlightsPage() {
  useEffect(() => {
    // Load the Aviasales widget script
    const script = document.createElement('script');
    script.src = 'https://tp.media/content?currency=usd&trs=483583&shmarker=692458&locale=en&searchTypeId=498&show_hotels=true&powered_by=true';
    script.async = true;
    script.charset = 'utf-8';

    const widgetContainer = document.getElementById('aviasales-widget');
    if (widgetContainer) {
      widgetContainer.appendChild(script);
    }

    return () => {
      if (widgetContainer && script.parentNode === widgetContainer) {
        widgetContainer.removeChild(script);
      }
    };
  }, []);

  const benefits = [
    {
      icon: <FaSearch className="text-4xl text-primary-600" />,
      title: 'Compare Prices',
      description: 'Search hundreds of airlines and travel sites at once to find the best deals'
    },
    {
      icon: <FaTag className="text-4xl text-accent-500" />,
      title: 'Best Prices Guaranteed',
      description: 'Find the lowest fares available with our comprehensive search engine'
    },
    {
      icon: <FaShieldAlt className="text-4xl text-green-600" />,
      title: 'Book with Confidence',
      description: 'Secure booking through trusted airline partners worldwide'
    }
  ];

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="flex justify-center mb-6">
                <FaPlane className="text-6xl text-white/90" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Search Flights to Turkey
              </h1>
              <p className="text-xl text-primary-100 max-w-3xl mx-auto">
                Find the best deals on flights to Istanbul, Antalya, Izmir, and other Turkish destinations.
                Compare prices from hundreds of airlines and book your perfect flight.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Flight Search Widget */}
        <section className="py-12 -mt-8">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl p-6 md:p-8"
            >
              <div id="aviasales-widget" className="min-h-[300px] flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                  <p>Loading flight search...</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Why Book Flights With Us?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                We partner with Aviasales to bring you the best flight deals to Turkey
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-8 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-center mb-4">{benefit.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Destinations */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Popular Turkish Destinations
              </h2>
              <p className="text-xl text-gray-600">
                Explore the best airports in Turkey for your vacation
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { city: 'Istanbul', code: 'IST', airport: 'Istanbul Airport' },
                { city: 'Antalya', code: 'AYT', airport: 'Antalya Airport' },
                { city: 'Izmir', code: 'ADB', airport: 'Adnan Menderes' },
                { city: 'Ankara', code: 'ESB', airport: 'Esenboga Airport' },
                { city: 'Bodrum', code: 'BJV', airport: 'Milas-Bodrum' },
                { city: 'Dalaman', code: 'DLM', airport: 'Dalaman Airport' },
                { city: 'Trabzon', code: 'TZX', airport: 'Trabzon Airport' },
                { city: 'Gaziantep', code: 'GZT', airport: 'Gaziantep Airport' }
              ].map((dest, index) => (
                <motion.div
                  key={dest.code}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="text-3xl font-bold text-primary-600 mb-1">{dest.code}</div>
                  <div className="text-lg font-semibold text-gray-900">{dest.city}</div>
                  <div className="text-sm text-gray-500">{dest.airport}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Need Help Planning Your Trip?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Our team can help you plan the perfect Turkey vacation including flights,
              tours, transfers, and accommodations.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </section>
      </div>
      <Footer />
      <WhatsAppWidget />
    </>
  );
}
