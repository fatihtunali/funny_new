'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaSearch, FaStar } from 'react-icons/fa';

export default function Hero() {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const heroImages = [
    { src: '/images/MaidenTowerIstanbul.webp', alt: 'Maiden Tower Istanbul', title: 'Discover Istanbul' },
    { src: '/images/PamukkaleTravertenler.webp', alt: 'Pamukkale Travertines', title: 'Explore Pamukkale' },
    { src: '/images/BosphorusBridgeNightIstanbul.webp', alt: 'Bosphorus Bridge at Night', title: 'Experience Istanbul' },
    { src: '/images/antalya-sea-view-with-mountain.webp', alt: 'Antalya Sea View', title: 'Relax in Antalya' },
  ];

  // Auto-scroll carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/packages?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push('/packages');
    }
  };

  return (
    <section className="relative min-h-[700px] md:h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Image Carousel */}
      {heroImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover"
            priority={index === 0}
            quality={90}
          />
        </div>
      ))}

      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"></div>

      {/* Hero content */}
      <div className="relative z-10 section-container text-center text-white px-4 py-8 md:py-0">
        {/* Trust Badge */}
        <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
          <div className="flex items-center gap-1 mr-3">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className="text-yellow-400 text-sm" />
            ))}
          </div>
          <span className="text-sm font-medium">4.9/5 from 500+ travelers</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl md:text-6xl lg:text-7xl font-bold mb-3 md:mb-4 leading-tight">
          Travel Memories You&apos;ll
          <span className="block text-accent-400">Never Forget</span>
        </h1>

        <p className="text-base md:text-2xl mb-6 md:mb-8 max-w-3xl mx-auto font-light">
          Experience Turkey&apos;s breathtaking destinations with expert guides and premium accommodations
        </p>

        {/* Large Search Bar - Viator/GetYourGuide Style */}
        <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-4 md:mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 md:pl-6 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400 text-lg md:text-xl" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Where do you want to go? (e.g., Istanbul, Cappadocia, Ephesus...)"
              className="w-full pl-12 md:pl-16 pr-6 py-4 md:py-6 text-gray-900 text-sm md:text-lg rounded-2xl shadow-2xl focus:ring-4 focus:ring-primary-300 focus:outline-none"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-600 hover:bg-primary-700 text-white px-4 md:px-8 py-2 md:py-4 rounded-xl text-sm md:text-base font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Search
            </button>
          </div>
        </form>

        {/* Quick Links */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-4 md:mb-8">
          <Link href="/packages?dest=Istanbul" className="px-6 py-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full text-sm font-medium transition-all">
            Istanbul
          </Link>
          <Link href="/packages?dest=Cappadocia" className="px-6 py-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full text-sm font-medium transition-all">
            Cappadocia
          </Link>
          <Link href="/packages?dest=Ephesus" className="px-6 py-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full text-sm font-medium transition-all">
            Ephesus
          </Link>
          <Link href="/packages?dest=Pamukkale" className="px-6 py-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full text-sm font-medium transition-all">
            Pamukkale
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 md:p-4">
            <div className="text-2xl md:text-4xl font-bold text-accent-300">500+</div>
            <div className="text-xs md:text-sm mt-1">Happy Travelers</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 md:p-4">
            <div className="text-2xl md:text-4xl font-bold text-accent-300">15+</div>
            <div className="text-xs md:text-sm mt-1">Tour Packages</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 md:p-4">
            <div className="text-2xl md:text-4xl font-bold text-accent-300">10+</div>
            <div className="text-xs md:text-sm mt-1">Years Experience</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 md:p-4">
            <div className="text-2xl md:text-4xl font-bold text-accent-300">24/7</div>
            <div className="text-xs md:text-sm mt-1">Customer Support</div>
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="flex justify-center gap-2 mt-4 md:mt-8">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentImageIndex ? 'bg-white w-8' : 'bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
