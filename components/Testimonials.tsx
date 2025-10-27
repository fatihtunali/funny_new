'use client';

import { useState } from 'react';

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      country: 'United States',
      rating: 5,
      text: 'Absolutely amazing experience! Our guide was knowledgeable and friendly. The hot air balloon ride in Cappadocia was a dream come true. Funny Tourism took care of everything!',
      date: 'September 2024'
    },
    {
      name: 'James Smith',
      country: 'United Kingdom',
      rating: 5,
      text: 'Best vacation we\'ve ever had! The itinerary was perfect, hotels were comfortable, and the tours were incredibly well-organized. Highly recommend the 10-day package.',
      date: 'August 2024'
    },
    {
      name: 'Maria Garcia',
      country: 'Spain',
      rating: 5,
      text: 'Turkey exceeded all my expectations. The history, the food, the people - everything was wonderful. Thank you Funny Tourism for making this trip so special!',
      date: 'July 2024'
    },
    {
      name: 'Michael Chen',
      country: 'Australia',
      rating: 5,
      text: 'Professional service from start to finish. The private transfers were convenient and our guide\'s English was excellent. Great value for money!',
      date: 'June 2024'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="pt-12 pb-16 bg-primary-50">
      <div className="section-container">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Travelers Say</h2>
          <p className="text-xl text-gray-600">Real experiences from real travelers</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-8 md:p-12 relative">
            {/* Quote icon */}
            <div className="text-primary-200 text-6xl absolute top-4 left-4">&quot;</div>

            {/* Testimonial content */}
            <div className="relative z-10">
              <div className="flex items-center mb-2">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <svg key={i} className="w-6 h-6 text-accent-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="text-gray-700 text-lg mb-6 italic">
                {testimonials[currentIndex].text}
              </p>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{testimonials[currentIndex].name}</p>
                  <p className="text-sm text-gray-600">{testimonials[currentIndex].country} • {testimonials[currentIndex].date}</p>
                </div>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-center space-x-4 mt-8">
              <button
                onClick={prevTestimonial}
                className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextTestimonial}
                className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Dots indicator */}
            <div className="flex justify-center space-x-2 mt-4">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
