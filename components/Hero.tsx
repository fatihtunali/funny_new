'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { FaMagic } from 'react-icons/fa';
import { useTranslations } from 'next-intl';

export default function Hero() {
  const t = useTranslations('hero');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  return (
    <section className="relative min-h-[700px] md:min-h-[85vh] lg:min-h-[90vh] xl:min-h-[95vh] flex items-center justify-center overflow-hidden">
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

      {/* Hero content */}
      <div className="relative z-10 section-container text-center text-white px-4 py-8 md:py-0">
        {/* Main Headline - More focused */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
          {t('titleLine1')}
          <span className="block text-accent-400 mt-2">{t('titleLine2')}</span>
        </h1>

        <p className="text-lg md:text-2xl mb-6 md:mb-8 max-w-3xl mx-auto font-light drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          {t('subtitle')}
        </p>

        {/* AI Trip Planner CTA - Single, prominent */}
        <div className="max-w-2xl mx-auto">
          {/* Main CTA Button */}
          <Link
            href="/smart-trip-planner"
            className="group relative inline-flex items-center justify-center gap-3 px-12 py-6 bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white rounded-2xl text-xl font-bold transition-all shadow-2xl hover:shadow-xl hover:scale-105"
          >
            <FaMagic className="text-2xl" />
            <div className="text-left">
              <div>{t('ctaButton')}</div>
              <div className="text-sm font-normal opacity-90">{t('ctaSubtext')}</div>
            </div>
          </Link>

          {/* Secondary link */}
          <div className="mt-6">
            <Link
              href="/packages"
              className="text-white/90 hover:text-white text-sm font-medium underline decoration-white/50 hover:decoration-white transition-all drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]"
            >
              {t('browsePackagesLink')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
