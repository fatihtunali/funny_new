'use client';

import Image from 'next/image';
import { FaShieldAlt, FaLock, FaCreditCard } from 'react-icons/fa';

export default function TrustIndicators() {
  return (
    <section className="py-12 bg-white border-y border-gray-200">
      <div className="section-container">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
          {/* TURSAB Certification */}
          <div className="flex flex-col items-center">
            <a
              href="https://www.tursab.org.tr/tr/ddsv"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform hover:scale-105"
            >
              <Image
                src="/images/tursab-dvs-7747.png"
                alt="TURSAB Certified - License 7747"
                width={120}
                height={48}
                className="object-contain"
              />
            </a>
            <p className="text-xs text-gray-600 mt-2 font-medium">Official License: 7747</p>
          </div>

          {/* Divider */}
          <div className="hidden md:block h-12 w-px bg-gray-300"></div>

          {/* Secure Payments */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 mb-2">
              <FaLock className="text-green-600 text-xl" />
              <span className="text-sm font-semibold text-gray-900">Secure Payments</span>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <div className="bg-white border border-gray-200 rounded px-3 py-1 shadow-sm">
                <span className="text-blue-600 font-bold text-lg">VISA</span>
              </div>
              <div className="bg-white border border-gray-200 rounded px-3 py-1 shadow-sm">
                <span className="text-orange-500 font-bold text-lg">MC</span>
              </div>
              <div className="bg-white border border-gray-200 rounded px-3 py-1 shadow-sm">
                <FaCreditCard className="text-gray-600 text-xl" />
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:block h-12 w-px bg-gray-300"></div>

          {/* SSL Secure */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2">
              <FaShieldAlt className="text-blue-600 text-2xl" />
              <div>
                <div className="text-sm font-semibold text-gray-900">SSL Secured</div>
                <div className="text-xs text-gray-600">256-bit Encryption</div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:block h-12 w-px bg-gray-300"></div>

          {/* Verified Business */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2">
              <div className="bg-green-100 rounded-full p-2">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">Verified Business</div>
                <div className="text-xs text-gray-600">Since 2014</div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Trust Stats */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">500+ Happy Travelers</span> •
            <span className="font-semibold text-gray-900 ml-1">4.9/5 Rating</span> •
            <span className="font-semibold text-gray-900 ml-1">100% Money-Back Guarantee</span>
          </p>
        </div>
      </div>
    </section>
  );
}
