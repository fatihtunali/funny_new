'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function DestinationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');

  const destinations = [
    {
      name: 'Istanbul',
      description: 'Discover the magical city where East meets West, with its stunning mosques, vibrant bazaars, and scenic Bosphorus cruises',
      slug: 'istanbul',
      attractions: 'Blue Mosque, Hagia Sophia, Grand Bazaar, Topkapi Palace',
      image: '/images/BlueMosqueIstanbul6minarets.jpg',
      gradient: 'from-blue-500 to-blue-700',
      category: 'Historical',
      region: 'Marmara'
    },
    {
      name: 'Cappadocia',
      description: 'Experience the surreal landscape of fairy chimneys and take a breathtaking hot air balloon ride over this unique region',
      slug: 'cappadocia',
      attractions: 'Hot Air Balloons, Goreme, Underground Cities, Cave Hotels',
      image: '/images/cappadocianight.jpg',
      gradient: 'from-orange-500 to-orange-700',
      category: 'Natural',
      region: 'Central Anatolia'
    },
    {
      name: 'Antalya',
      description: 'Enjoy the perfect blend of beautiful beaches, ancient ruins, and charming old town in this Mediterranean paradise',
      slug: 'antalya',
      attractions: 'Old Town (Kaleiçi), Düden Waterfalls, Ancient Ruins, Beautiful Beaches',
      image: '/images/IstanbulatNight.jpeg',
      gradient: 'from-cyan-500 to-cyan-700',
      category: 'Coastal',
      region: 'Mediterranean'
    },
    {
      name: 'Kusadasi',
      description: 'Vibrant coastal resort town, gateway to Ancient Ephesus with beautiful beaches and bustling bazaars',
      slug: 'kusadasi',
      attractions: 'Ancient Ephesus, House of Virgin Mary, Pigeon Island, Ladies Beach',
      image: '/images/Ephesus_Library2.jpg',
      gradient: 'from-blue-500 to-blue-700',
      category: 'Coastal',
      region: 'Aegean'
    },
    {
      name: 'Ephesus',
      description: 'Walk through history in one of the best-preserved ancient cities in the Mediterranean',
      slug: 'ephesus',
      attractions: 'Library of Celsus, Grand Theater, Temple of Artemis, Terrace Houses',
      image: '/images/Ephesus_Library2.jpg',
      gradient: 'from-green-500 to-green-700',
      category: 'Historical',
      region: 'Aegean'
    },
    {
      name: 'Pamukkale',
      description: 'Marvel at the white travertine terraces and ancient spa of Hierapolis in this natural wonder of Turkey',
      slug: 'pamukkale',
      attractions: 'Travertine Terraces, Hierapolis, Thermal Pools, Cleopatra\'s Pool',
      image: '/images/PamukkaleTravertenler.jpg',
      gradient: 'from-purple-500 to-purple-700',
      category: 'Natural',
      region: 'Aegean'
    },
    {
      name: 'Fethiye',
      description: 'Experience thrilling paragliding adventures, beautiful beaches, and crystal clear waters in this coastal gem',
      slug: 'fethiye',
      attractions: 'Ölüdeniz Beach, Paragliding, Blue Lagoon, Butterfly Valley',
      image: '/images/cappadociaballoonride.jpg',
      gradient: 'from-teal-500 to-teal-700',
      category: 'Adventure',
      region: 'Mediterranean'
    },
    {
      name: 'Marmaris',
      description: 'Explore the beautiful marina, enjoy water sports, and discover the vibrant nightlife of this popular coastal resort',
      slug: 'marmaris',
      attractions: 'Marmaris Marina, Marmaris Castle, Beach Clubs, Boat Tours',
      image: '/images/IstanbulatNight.jpeg',
      gradient: 'from-indigo-500 to-indigo-700',
      category: 'Coastal',
      region: 'Mediterranean'
    },
    {
      name: 'Bodrum',
      description: 'Visit the historic castle, relax on pristine beaches, and enjoy the vibrant atmosphere of this Aegean gem',
      slug: 'bodrum',
      attractions: 'Bodrum Castle, Ancient Theater, Windmills, Beach Clubs',
      image: '/images/cappadocianight.jpg',
      gradient: 'from-pink-500 to-pink-700',
      category: 'Coastal',
      region: 'Aegean'
    },
    {
      name: 'Izmir',
      description: 'Turkey\'s third-largest city offers ancient ruins, vibrant markets, and beautiful Aegean coastline with modern amenities',
      slug: 'izmir',
      attractions: 'Agora of Smyrna, Konak Square, Kordon Promenade, Kemeralti Bazaar',
      image: '/images/BlueMosqueIstanbul6minarets.jpg',
      gradient: 'from-red-500 to-red-700',
      category: 'Historical',
      region: 'Aegean'
    },
    {
      name: 'Ankara',
      description: 'Turkey\'s capital city showcases modern Turkey alongside ancient Anatolian heritage and significant national monuments',
      slug: 'ankara',
      attractions: 'Anitkabir, Museum of Anatolian Civilizations, Ankara Castle, Atakule Tower',
      image: '/images/cappadociaballoonride.jpg',
      gradient: 'from-gray-600 to-gray-800',
      category: 'Cultural',
      region: 'Central Anatolia'
    },
    {
      name: 'Bursa',
      description: 'First Ottoman capital featuring stunning mosques, thermal baths, and access to Uludag ski resort',
      slug: 'bursa',
      attractions: 'Grand Mosque, Green Tomb, Uludag Mountain, Historic Silk Market',
      image: '/images/PamukkaleTravertenler.jpg',
      gradient: 'from-emerald-500 to-emerald-700',
      category: 'Historical',
      region: 'Marmara'
    },
    {
      name: 'Trabzon',
      description: 'Beautiful Black Sea city known for the stunning Sumela Monastery perched on mountain cliffs',
      slug: 'trabzon',
      attractions: 'Sumela Monastery, Uzungol Lake, Ataturk Pavilion, Trabzon Castle',
      image: '/images/cappadocianight.jpg',
      gradient: 'from-green-600 to-green-800',
      category: 'Natural',
      region: 'Black Sea'
    },
    {
      name: 'Konya',
      description: 'Spiritual center of Turkey, home to Rumi\'s mausoleum and the mesmerizing whirling dervishes ceremony',
      slug: 'konya',
      attractions: 'Mevlana Museum, Whirling Dervishes, Alaeddin Mosque, Ince Minare Museum',
      image: '/images/Ephesus_Library2.jpg',
      gradient: 'from-amber-600 to-amber-800',
      category: 'Cultural',
      region: 'Central Anatolia'
    },
    {
      name: 'Gallipoli',
      description: 'Historic WWI battleground offering moving memorials, cemeteries, and significant ANZAC heritage sites',
      slug: 'gallipoli',
      attractions: 'ANZAC Cove, Lone Pine Cemetery, Chunuk Bair, Turkish Martyrs Memorial',
      image: '/images/IstanbulatNight.jpeg',
      gradient: 'from-slate-600 to-slate-800',
      category: 'Historical',
      region: 'Marmara'
    },
    {
      name: 'Troy',
      description: 'Legendary ancient city of the Trojan War, UNESCO World Heritage Site with fascinating archaeological ruins',
      slug: 'troy',
      attractions: 'Trojan Horse Replica, Ancient City Ruins, Archaeological Museum, City Walls',
      image: '/images/Ephesus_Library2.jpg',
      gradient: 'from-yellow-600 to-yellow-800',
      category: 'Historical',
      region: 'Marmara'
    },
    {
      name: 'Alanya',
      description: 'Popular Mediterranean resort with spectacular castle, beautiful beaches, and vibrant entertainment options',
      slug: 'alanya',
      attractions: 'Alanya Castle, Cleopatra Beach, Damlatas Cave, Red Tower',
      image: '/images/IstanbulatNight.jpeg',
      gradient: 'from-orange-600 to-orange-800',
      category: 'Coastal',
      region: 'Mediterranean'
    }
  ];

  // Filter destinations based on search and filters
  const filteredDestinations = destinations.filter(destination => {
    const matchesSearch = destination.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         destination.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         destination.attractions.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || destination.category === categoryFilter;
    const matchesRegion = regionFilter === 'all' || destination.region === regionFilter;

    return matchesSearch && matchesCategory && matchesRegion;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Explore Turkey Destinations</h1>
          <p className="text-xl text-primary-100">Discover the diverse beauty and rich history of Turkey&apos;s top destinations</p>
        </div>
      </div>

      {/* Destinations Grid */}
      <section className="section-container py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Top Destinations</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the best of Turkey&apos;s rich history, stunning landscapes, and vibrant culture
          </p>
        </motion.div>

        {/* Search and Filters */}
        <div className="mb-8 bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Bar */}
            <div className="md:col-span-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Destinations
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  placeholder="Search by name, description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                id="category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="Historical">Historical</option>
                <option value="Coastal">Coastal</option>
                <option value="Natural">Natural Wonders</option>
                <option value="Cultural">Cultural</option>
                <option value="Adventure">Adventure</option>
              </select>
            </div>

            {/* Region Filter */}
            <div>
              <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-2">
                Region
              </label>
              <select
                id="region"
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Regions</option>
                <option value="Marmara">Marmara</option>
                <option value="Aegean">Aegean Coast</option>
                <option value="Mediterranean">Mediterranean Coast</option>
                <option value="Central Anatolia">Central Anatolia</option>
                <option value="Black Sea">Black Sea</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing <span className="font-semibold text-primary-600">{filteredDestinations.length}</span> of <span className="font-semibold">{destinations.length}</span> destinations
          </div>
        </div>

        {filteredDestinations.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No destinations found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDestinations.map((destination, index) => (
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
                  {/* Category and Region Badges */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-semibold">
                      {destination.category}
                    </span>
                    <span className="bg-primary-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {destination.region}
                    </span>
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
        )}
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
