export default function WhyChooseUs() {
  const features = [
    {
      icon: '🎯',
      title: 'Expert Local Guides',
      description: 'Professional English-speaking guides with deep knowledge of Turkish history and culture'
    },
    {
      icon: '✈️',
      title: 'All-Inclusive Packages',
      description: 'Accommodation, transfers, tours, and entrance fees all included for hassle-free travel'
    },
    {
      icon: '🏨',
      title: 'Quality Hotels',
      description: 'Carefully selected 3-star, 4-star, and 5-star hotels for your comfort'
    },
    {
      icon: '🚗',
      title: 'Private Transfers',
      description: 'Comfortable private airport transfers and transportation throughout your tour'
    },
    {
      icon: '💰',
      title: 'Best Value',
      description: 'Competitive pricing with no hidden fees. Group discounts available'
    },
    {
      icon: '🔒',
      title: 'Secure Booking',
      description: 'Safe and secure payment options with full customer protection'
    },
    {
      icon: '📱',
      title: '24/7 Support',
      description: 'WhatsApp support available throughout your journey for peace of mind'
    },
    {
      icon: '⭐',
      title: 'Highly Rated',
      description: '4.9/5 rating from 500+ satisfied travelers from around the world'
    }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="section-container">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Why Choose Funny Tourism?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We make your Turkey vacation unforgettable with our commitment to excellence
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-4 rounded-lg bg-white hover:shadow-md transition-shadow">
              <div className="text-3xl mb-2">{feature.icon}</div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">{feature.title}</h3>
              <p className="text-xs text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
