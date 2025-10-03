import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative h-[600px] md:h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <Image
        src="/images/IstanbulatNight.jpeg"
        alt="Istanbul at Night"
        fill
        className="object-cover"
        priority
        quality={90}
      />
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Hero content */}
      <div className="relative z-10 section-container text-center text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Discover the Magic of Turkey
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
          Expertly curated tour packages to Istanbul, Cappadocia, Ephesus & Pamukkale with professional English-speaking guides
        </p>

        {/* Search/Filter Box */}
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-2xl p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-left">
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                <option>Any Duration</option>
                <option>5-7 Days</option>
                <option>8-10 Days</option>
                <option>11+ Days</option>
              </select>
            </div>

            <div className="text-left">
              <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                <option>All Destinations</option>
                <option>Istanbul</option>
                <option>Cappadocia</option>
                <option>Ephesus</option>
                <option>Pamukkale</option>
              </select>
            </div>

            <div className="text-left">
              <label className="block text-sm font-medium text-gray-700 mb-2">Budget</label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                <option>Any Budget</option>
                <option>€1000 - €1500</option>
                <option>€1500 - €2000</option>
                <option>€2000+</option>
              </select>
            </div>
          </div>

          <Link href="/packages" className="btn-primary w-full md:w-auto text-lg">
            Find Your Perfect Tour
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 max-w-4xl mx-auto">
          <div>
            <div className="text-4xl font-bold text-accent-100">500+</div>
            <div className="text-sm mt-2">Happy Travelers</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-accent-100">15+</div>
            <div className="text-sm mt-2">Tour Packages</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-accent-100">10+</div>
            <div className="text-sm mt-2">Years Experience</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-accent-100">4.9/5</div>
            <div className="text-sm mt-2">Customer Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
}
