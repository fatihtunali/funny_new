'use client';

import { useState } from 'react';
import Link from 'next/link';
import CurrencyConverter from './CurrencyConverter';
import CountdownTimer from './CountdownTimer';

interface PackageData {
  title: string;
  pricing: {
    threestar: { twoAdults: number; fourAdults: number; sixAdults: number };
    fourstar: { twoAdults: number; fourAdults: number; sixAdults: number };
    fivestar: { twoAdults: number; fourAdults: number; sixAdults: number };
    children: { age3to5: number; age6to10: number };
  };
  hotels: {
    threestar: { istanbul: string; cappadocia: string; kusadasi: string };
    fourstar: { istanbul: string; cappadocia: string; kusadasi: string };
    fivestar: { istanbul: string; cappadocia: string; kusadasi: string };
  };
}

interface Props {
  packageData: PackageData;
}

export default function PricingCalculator({ packageData }: Props) {
  const [hotelCategory, setHotelCategory] = useState<'threestar' | 'fourstar' | 'fivestar'>('fourstar');
  const [adults, setAdults] = useState(2);
  const [children3to5, setChildren3to5] = useState(0);
  const [children6to10, setChildren6to10] = useState(0);

  const calculatePrice = () => {
    let pricePerAdult = 0;

    // Determine price per adult based on group size
    if (adults >= 6) {
      pricePerAdult = packageData.pricing[hotelCategory].sixAdults;
    } else if (adults >= 4) {
      pricePerAdult = packageData.pricing[hotelCategory].fourAdults;
    } else {
      pricePerAdult = packageData.pricing[hotelCategory].twoAdults;
    }

    const adultTotal = adults * pricePerAdult;
    const child3to5Total = children3to5 * packageData.pricing.children.age3to5;
    const child6to10Total = children6to10 * packageData.pricing.children.age6to10;

    return {
      adultPrice: pricePerAdult,
      adultTotal,
      child3to5Total,
      child6to10Total,
      total: adultTotal + child3to5Total + child6to10Total
    };
  };

  const pricing = calculatePrice();

  // Create a date 7 days from now for the countdown
  const offerEndDate = new Date();
  offerEndDate.setDate(offerEndDate.getDate() + 7);

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 sticky top-20">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Calculate Your Price</h3>

      {/* Countdown Timer */}
      <CountdownTimer endDate={offerEndDate} />

      {/* Hotel Category Selection */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">Hotel Category</label>
        <div className="space-y-2">
          {(['threestar', 'fourstar', 'fivestar'] as const).map((category) => (
            <button
              key={category}
              onClick={() => setHotelCategory(category)}
              className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                hotelCategory === category
                  ? 'border-primary-600 bg-primary-50 text-primary-900'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold">
                    {category === 'threestar' ? '3-Star' : category === 'fourstar' ? '4-Star' : '5-Star'} Hotels
                  </span>
                  {hotelCategory === category && (
                    <div className="text-xs text-gray-600 mt-1">
                      {packageData.hotels[category].istanbul} • {packageData.hotels[category].cappadocia}
                    </div>
                  )}
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  hotelCategory === category ? 'border-primary-600' : 'border-gray-300'
                }`}>
                  {hotelCategory === category && (
                    <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Number of Adults */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Adults</label>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setAdults(Math.max(2, adults - 1))}
            className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold text-gray-700"
          >
            -
          </button>
          <input
            type="number"
            value={adults}
            onChange={(e) => setAdults(Math.max(2, parseInt(e.target.value) || 2))}
            min="2"
            className="w-20 px-3 py-2 text-center border border-gray-300 rounded-lg font-semibold"
          />
          <button
            onClick={() => setAdults(adults + 1)}
            className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold text-gray-700"
          >
            +
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">Minimum 2 adults required</p>
      </div>

      {/* Children 3-5 years */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Children (3-5 years)</label>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setChildren3to5(Math.max(0, children3to5 - 1))}
            className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold text-gray-700"
          >
            -
          </button>
          <input
            type="number"
            value={children3to5}
            onChange={(e) => setChildren3to5(Math.max(0, parseInt(e.target.value) || 0))}
            min="0"
            className="w-20 px-3 py-2 text-center border border-gray-300 rounded-lg font-semibold"
          />
          <button
            onClick={() => setChildren3to5(children3to5 + 1)}
            className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold text-gray-700"
          >
            +
          </button>
        </div>
      </div>

      {/* Children 6-10 years */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Children (6-10 years)</label>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setChildren6to10(Math.max(0, children6to10 - 1))}
            className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold text-gray-700"
          >
            -
          </button>
          <input
            type="number"
            value={children6to10}
            onChange={(e) => setChildren6to10(Math.max(0, parseInt(e.target.value) || 0))}
            min="0"
            className="w-20 px-3 py-2 text-center border border-gray-300 rounded-lg font-semibold"
          />
          <button
            onClick={() => setChildren6to10(children6to10 + 1)}
            className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold text-gray-700"
          >
            +
          </button>
        </div>
      </div>

      {/* Currency Converter */}
      <div className="mb-6">
        <CurrencyConverter basePrice={pricing.total} />
      </div>

      {/* Price Breakdown */}
      <div className="border-t border-gray-200 pt-4 mb-6">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-700">
            <span>{adults} Adults × €{pricing.adultPrice}</span>
            <span>€{pricing.adultTotal}</span>
          </div>
          {children3to5 > 0 && (
            <div className="flex justify-between text-gray-700">
              <span>{children3to5} Children (3-5 yrs) × €{packageData.pricing.children.age3to5}</span>
              <span>€{pricing.child3to5Total}</span>
            </div>
          )}
          {children6to10 > 0 && (
            <div className="flex justify-between text-gray-700">
              <span>{children6to10} Children (6-10 yrs) × €{packageData.pricing.children.age6to10}</span>
              <span>€{pricing.child6to10Total}</span>
            </div>
          )}
        </div>
      </div>

      {/* Total Price */}
      <div className="bg-primary-50 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Total Price</p>
            <p className="text-3xl font-bold text-primary-600">€{pricing.total}</p>
            {adults > 1 && (
              <p className="text-xs text-gray-500 mt-1">€{Math.round(pricing.total / adults)} per adult</p>
            )}
          </div>
        </div>
      </div>

      {/* Booking Button */}
      <Link
        href={`/inquiry?package=${encodeURIComponent(packageData.title)}&adults=${adults}&children3to5=${children3to5}&children6to10=${children6to10}&hotel=${hotelCategory}&price=${pricing.total}`}
        className="btn-primary w-full text-center text-lg"
      >
        Book This Package
      </Link>

      <p className="text-xs text-gray-500 text-center mt-3">
        Prices valid from 01/04/2025 till 31/10/2025
      </p>
    </div>
  );
}
