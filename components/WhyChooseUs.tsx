import { FaShieldAlt, FaClock, FaMoneyBillWave, FaUserTie, FaHeadset, FaStar, FaHotel, FaCheckCircle } from 'react-icons/fa';

export default function WhyChooseUs() {
  const benefits = [
    {
      icon: <FaShieldAlt className="text-4xl text-primary-600" />,
      title: 'Trusted & Secure',
      description: '10+ years of excellence with 500+ happy travelers'
    },
    {
      icon: <FaClock className="text-4xl text-primary-600" />,
      title: 'Free Cancellation',
      description: 'Cancel up to 24 hours before and get a full refund'
    },
    {
      icon: <FaMoneyBillWave className="text-4xl text-primary-600" />,
      title: 'Best Price Guarantee',
      description: 'Found it cheaper? We'll match the price or refund the difference'
    },
    {
      icon: <FaUserTie className="text-4xl text-primary-600" />,
      title: 'Expert Guides',
      description: 'Professional English-speaking guides with deep local knowledge'
    },
    {
      icon: <FaHeadset className="text-4xl text-primary-600" />,
      title: '24/7 Support',
      description: 'We're here to help, anytime you need us'
    },
    {
      icon: <FaHotel className="text-4xl text-primary-600" />,
      title: 'Premium Experience',
      description: 'Carefully curated hotels and exclusive experiences'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="section-container">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Funny Tourism?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We're committed to making your Turkey adventure unforgettable with exceptional service and unbeatable value
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-8 bg-white px-8 py-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-2">
              <FaStar className="text-yellow-400 text-2xl" />
              <div className="text-left">
                <div className="font-bold text-gray-900">4.9/5 Rating</div>
                <div className="text-sm text-gray-600">500+ Reviews</div>
              </div>
            </div>
            <div className="h-12 w-px bg-gray-300 hidden md:block"></div>
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-green-600 text-2xl" />
              <div className="text-left">
                <div className="font-bold text-gray-900">Licensed & Insured</div>
                <div className="text-sm text-gray-600">Turkish Tourism Authority</div>
              </div>
            </div>
            <div className="h-12 w-px bg-gray-300 hidden md:block"></div>
            <div className="flex items-center gap-2">
              <FaHeadset className="text-blue-600 text-2xl" />
              <div className="text-left">
                <div className="font-bold text-gray-900">24/7 Support</div>
                <div className="text-sm text-gray-600">WhatsApp & Email</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
