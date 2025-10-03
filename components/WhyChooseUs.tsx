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
    <section className="py-16 bg-white">
      <div className="section-container">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Funny Tourism?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We make your Turkey vacation unforgettable with our commitment to excellence
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
