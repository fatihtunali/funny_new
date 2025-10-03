import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden">
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
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Discover the Magic of Turkey
        </h1>
        <p className="text-lg md:text-xl mb-6 max-w-3xl mx-auto">
          Expertly curated tour packages to Istanbul, Cappadocia, Ephesus & Pamukkale with professional English-speaking guides
        </p>

        {/* Search/Filter Box */}
        <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-md rounded-lg shadow-2xl p-5 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <div className="text-left">
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Duration</label>
              <select className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                <option>Any Duration</option>
                <option>5-7 Days</option>
                <option>8-10 Days</option>
                <option>11+ Days</option>
              </select>
            </div>

            <div className="text-left">
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Destination</label>
              <select className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                <option>All Destinations</option>
                <option>Istanbul</option>
                <option>Cappadocia</option>
                <option>Ephesus</option>
                <option>Pamukkale</option>
              </select>
            </div>

            <div className="text-left">
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Budget</label>
              <select className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                <option>Any Budget</option>
                <option>€1000 - €1500</option>
                <option>€1500 - €2000</option>
                <option>€2000+</option>
              </select>
            </div>
          </div>

          <Link href="/tours" className="btn-primary w-full md:w-auto">
            Find Your Perfect Tour
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 max-w-4xl mx-auto">
          <div>
            <div className="text-3xl font-bold text-accent-100">500+</div>
            <div className="text-xs mt-1">Happy Travelers</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-accent-100">15+</div>
            <div className="text-xs mt-1">Tour Packages</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-accent-100">10+</div>
            <div className="text-xs mt-1">Years Experience</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-accent-100">4.9/5</div>
            <div className="text-xs mt-1">Customer Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
}
