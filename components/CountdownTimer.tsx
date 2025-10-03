'use client';

import { useState, useEffect } from 'react';
import { FaClock } from 'react-icons/fa';

interface CountdownTimerProps {
  endDate: Date;
  offerText?: string;
}

export default function CountdownTimer({ endDate, offerText = 'Special Offer Ends In' }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = endDate.getTime() - new Date().getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  if (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg p-4 mb-6">
      <div className="flex items-center justify-center mb-3">
        <FaClock className="mr-2" />
        <span className="font-semibold text-sm">{offerText}</span>
      </div>

      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="bg-white bg-opacity-20 rounded-lg p-2">
          <div className="text-2xl font-bold">{String(timeLeft.days).padStart(2, '0')}</div>
          <div className="text-xs opacity-90">Days</div>
        </div>
        <div className="bg-white bg-opacity-20 rounded-lg p-2">
          <div className="text-2xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</div>
          <div className="text-xs opacity-90">Hours</div>
        </div>
        <div className="bg-white bg-opacity-20 rounded-lg p-2">
          <div className="text-2xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
          <div className="text-xs opacity-90">Minutes</div>
        </div>
        <div className="bg-white bg-opacity-20 rounded-lg p-2">
          <div className="text-2xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</div>
          <div className="text-xs opacity-90">Seconds</div>
        </div>
      </div>

      <p className="text-xs text-center mt-3 opacity-90">
        Book now and save 15% on your Turkey vacation!
      </p>
    </div>
  );
}
