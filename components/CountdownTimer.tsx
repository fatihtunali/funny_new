'use client';

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  endDate: Date;
}

export default function CountdownTimer({ endDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = endDate.getTime() - new Date().getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <div className="mb-6 bg-gradient-to-r from-accent-500 to-accent-600 rounded-lg p-4 text-white">
      <p className="text-sm font-semibold mb-2 text-center">Special Offer Ends In:</p>
      <div className="flex justify-center space-x-2">
        <div className="bg-white/20 rounded-lg p-2 min-w-[50px] text-center">
          <div className="text-2xl font-bold">{timeLeft.days}</div>
          <div className="text-xs">Days</div>
        </div>
        <div className="bg-white/20 rounded-lg p-2 min-w-[50px] text-center">
          <div className="text-2xl font-bold">{timeLeft.hours}</div>
          <div className="text-xs">Hours</div>
        </div>
        <div className="bg-white/20 rounded-lg p-2 min-w-[50px] text-center">
          <div className="text-2xl font-bold">{timeLeft.minutes}</div>
          <div className="text-xs">Mins</div>
        </div>
        <div className="bg-white/20 rounded-lg p-2 min-w-[50px] text-center">
          <div className="text-2xl font-bold">{timeLeft.seconds}</div>
          <div className="text-xs">Secs</div>
        </div>
      </div>
    </div>
  );
}
