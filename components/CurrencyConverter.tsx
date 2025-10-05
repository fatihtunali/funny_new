'use client';

import { useState } from 'react';
import { FaEuroSign, FaDollarSign, FaPoundSign } from 'react-icons/fa';

interface CurrencyConverterProps {
  basePrice: number; // Price in EUR
  className?: string;
}

export default function CurrencyConverter({ basePrice, className = '' }: CurrencyConverterProps) {
  const [currency, setCurrency] = useState<'EUR' | 'USD' | 'GBP'>('EUR');
  const rates = { USD: 1.09, GBP: 0.86 }; // Approximate rates as fallback

  const convertedPrice = () => {
    switch (currency) {
      case 'USD':
        return Math.round(basePrice * rates.USD);
      case 'GBP':
        return Math.round(basePrice * rates.GBP);
      default:
        return basePrice;
    }
  };

  const getCurrencyIcon = () => {
    switch (currency) {
      case 'USD':
        return <FaDollarSign className="inline" />;
      case 'GBP':
        return <FaPoundSign className="inline" />;
      default:
        return <FaEuroSign className="inline" />;
    }
  };

  return (
    <div className={className}>
      <div className="flex items-center space-x-2 mb-2">
        <button
          onClick={() => setCurrency('EUR')}
          className={`px-3 py-1 rounded-md text-sm font-semibold transition-colors ${
            currency === 'EUR'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          EUR
        </button>
        <button
          onClick={() => setCurrency('USD')}
          className={`px-3 py-1 rounded-md text-sm font-semibold transition-colors ${
            currency === 'USD'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          USD
        </button>
        <button
          onClick={() => setCurrency('GBP')}
          className={`px-3 py-1 rounded-md text-sm font-semibold transition-colors ${
            currency === 'GBP'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          GBP
        </button>
      </div>
      <div className="text-3xl font-bold text-primary-600 flex items-center">
        {getCurrencyIcon()}
        <span className="ml-1">{convertedPrice()}</span>
      </div>
    </div>
  );
}
