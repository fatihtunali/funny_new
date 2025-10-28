'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { locales } from '@/i18n';
import { useState, useTransition } from 'react';
import { FaGlobe } from 'react-icons/fa';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const switchLocale = (newLocale: string) => {
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
      setIsOpen(false);
    });
  };

  const localeNames: Record<string, { name: string; code: string }> = {
    en: { name: 'English', code: 'EN' },
    es: { name: 'Español', code: 'ES' },
  };

  const currentLocale = localeNames[locale];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1.5 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors group"
        aria-label={`Change language (Current: ${currentLocale.name})`}
        disabled={isPending}
        title={currentLocale.name}
      >
        <FaGlobe className="text-primary-600 text-lg" />
        <span className="text-xs font-bold text-gray-700 group-hover:text-primary-600 transition-colors">
          {currentLocale.code}
        </span>
        <svg
          className={`w-3 h-3 text-gray-600 transition-transform group-hover:text-gray-800 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg py-2 z-20 border border-gray-200">
            {locales.map((loc) => (
              <button
                key={loc}
                onClick={() => switchLocale(loc)}
                className={`w-full flex items-center space-x-2 px-4 py-2 hover:bg-primary-50 transition-colors ${
                  locale === loc ? 'bg-primary-50 text-primary-700' : 'text-gray-700'
                }`}
                disabled={isPending}
              >
                <span className="text-xs font-bold">{localeNames[loc].code}</span>
                <span className="font-medium text-sm">{localeNames[loc].name}</span>
                {locale === loc && (
                  <svg className="w-4 h-4 ml-auto text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
