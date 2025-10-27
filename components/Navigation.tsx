'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { FaUser, FaSignInAlt, FaMagic } from 'react-icons/fa';

export default function Navigation() {
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
          <Link href="/" className="flex items-center">
            <Image
              src="/images/FunnyLogo1.png"
              alt="Funny Tourism"
              width={120}
              height={50}
              className="object-contain hover:opacity-90 transition-opacity"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary-600 transition-colors">
              Home
            </Link>
            <Link href="/packages" className="text-gray-700 hover:text-primary-600 transition-colors">
              Packages
            </Link>
            <Link href="/daily-tours" className="text-gray-700 hover:text-primary-600 transition-colors">
              Daily Tours
            </Link>
            <Link href="/transfers" className="text-gray-700 hover:text-primary-600 transition-colors">
              Transfers
            </Link>
            <Link href="/destinations" className="text-gray-700 hover:text-primary-600 transition-colors">
              Destinations
            </Link>

            <Link href="/agent/register" className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors">
              Partner with Us
            </Link>

            {user ? (
              <Link href="/dashboard" className="flex items-center btn-primary">
                <FaUser className="mr-2" />
                My Bookings
              </Link>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login" className="flex items-center text-gray-700 hover:text-primary-600 transition-colors">
                  <FaSignInAlt className="mr-2" />
                  Login
                </Link>
                <Link href="/smart-trip-planner" className="flex items-center bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white px-4 py-2 rounded-lg font-semibold transition-all shadow-md">
                  <FaMagic className="mr-2" />
                  Smart Planner
                </Link>
                <Link href="/inquiry" className="btn-primary">
                  Get Quote
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-3 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 relative z-50"
            aria-label={isOpen ? "Close menu" : "Open menu"}
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
          <div className="md:hidden py-4 space-y-2">
            <Link href="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded" onClick={closeMenu}>
              Home
            </Link>
            <Link href="/packages" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded" onClick={closeMenu}>
              Packages
            </Link>
            <Link href="/daily-tours" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded" onClick={closeMenu}>
              Daily Tours
            </Link>
            <Link href="/transfers" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded" onClick={closeMenu}>
              Transfers
            </Link>
            <Link href="/destinations" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded" onClick={closeMenu}>
              Destinations
            </Link>

            <Link href="/agent/register" className="block px-4 py-2 text-primary-600 font-medium hover:bg-primary-50 rounded" onClick={closeMenu}>
              Partner with Us
            </Link>

            {user ? (
              <Link href="/dashboard" className="block mx-4 text-center btn-primary" onClick={closeMenu}>
                My Bookings
              </Link>
            ) : (
              <>
                <Link href="/login" className="block mx-4 text-center btn-secondary" onClick={closeMenu}>
                  Login
                </Link>
                <Link href="/smart-trip-planner" className="block mx-4 text-center bg-gradient-to-r from-accent-500 to-accent-600 text-white px-4 py-3 rounded-lg font-semibold" onClick={closeMenu}>
                  ✨ Smart Trip Planner
                </Link>
                <Link href="/inquiry" className="block mx-4 text-center btn-primary" onClick={closeMenu}>
                  Get Quote
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
