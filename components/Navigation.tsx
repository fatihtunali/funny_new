'use client';

import { Link } from '@/i18n/routing';
import NextLink from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { FaUser, FaSignInAlt, FaMagic } from 'react-icons/fa';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navigation() {
  const t = useTranslations('navigation');
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch {
      // User not logged in
    }
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="section-container">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image
              src="/images/FunnyLogo1.png"
              alt="Funny Tourism"
              width={100}
              height={42}
              className="object-contain hover:opacity-90 transition-opacity"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
            <Link href="/" className="text-sm text-gray-700 hover:text-primary-600 transition-colors whitespace-nowrap">
              {t('home')}
            </Link>
            <Link href="/packages" className="text-sm text-gray-700 hover:text-primary-600 transition-colors whitespace-nowrap">
              {t('packages')}
            </Link>
            <Link href="/daily-tours" className="text-sm text-gray-700 hover:text-primary-600 transition-colors whitespace-nowrap">
              {t('dailyTours')}
            </Link>
            <Link href="/transfers" className="text-sm text-gray-700 hover:text-primary-600 transition-colors whitespace-nowrap">
              {t('transfers')}
            </Link>
            <Link href="/destinations" className="text-sm text-gray-700 hover:text-primary-600 transition-colors whitespace-nowrap">
              {t('destinations')}
            </Link>

            <NextLink href="/agent/register" className="text-xs text-primary-600 hover:text-primary-700 font-medium transition-colors whitespace-nowrap">
              {t('partnerWithUs')}
            </NextLink>

            <LanguageSwitcher />

            {user ? (
              <Link href="/dashboard" className="flex items-center btn-primary text-sm px-3 py-2 whitespace-nowrap">
                <FaUser className="mr-1.5" />
                {t('myBookings')}
              </Link>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login" className="flex items-center text-sm text-gray-700 hover:text-primary-600 transition-colors whitespace-nowrap">
                  <FaSignInAlt className="mr-1.5" />
                  {t('login')}
                </Link>
                <Link href="/smart-trip-planner" className="flex items-center bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-all shadow-md whitespace-nowrap">
                  <FaMagic className="mr-1.5" />
                  {t('smartPlanner')}
                </Link>
                <Link href="/inquiry" className="btn-primary text-sm px-3 py-2 whitespace-nowrap">
                  {t('getQuote')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-3 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 relative z-50"
            aria-label={isOpen ? t('closeMenu') : t('openMenu')}
          >
            <svg
              className="h-7 w-7"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 space-y-2">
            <div className="px-4 py-2">
              <LanguageSwitcher />
            </div>
            <Link href="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded" onClick={closeMenu}>
              {t('home')}
            </Link>
            <Link href="/packages" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded" onClick={closeMenu}>
              {t('packages')}
            </Link>
            <Link href="/daily-tours" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded" onClick={closeMenu}>
              {t('dailyTours')}
            </Link>
            <Link href="/transfers" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded" onClick={closeMenu}>
              {t('transfers')}
            </Link>
            <Link href="/destinations" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded" onClick={closeMenu}>
              {t('destinations')}
            </Link>

            <NextLink href="/agent/register" className="block px-4 py-2 text-primary-600 font-medium hover:bg-primary-50 rounded" onClick={closeMenu}>
              {t('partnerWithUs')}
            </NextLink>

            {user ? (
              <Link href="/dashboard" className="block mx-4 text-center btn-primary" onClick={closeMenu}>
                {t('myBookings')}
              </Link>
            ) : (
              <>
                <Link href="/login" className="block mx-4 text-center btn-secondary" onClick={closeMenu}>
                  {t('login')}
                </Link>
                <Link href="/smart-trip-planner" className="block mx-4 text-center bg-gradient-to-r from-accent-500 to-accent-600 text-white px-4 py-3 rounded-lg font-semibold" onClick={closeMenu}>
                  ✨ {t('smartPlanner')}
                </Link>
                <Link href="/inquiry" className="block mx-4 text-center btn-primary" onClick={closeMenu}>
                  {t('getQuote')}
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
