import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { FaPlane, FaPassport, FaCheckCircle, FaDollarSign, FaStar, FaShieldAlt, FaWhatsapp, FaClock } from 'react-icons/fa';

export const metadata: Metadata = {
  title: 'Turkey Tours from USA | No Visa Required | Direct Flights from NYC, LA, Chicago',
  description: 'Book Turkey tour packages from America. No visa needed for US citizens! Direct flights from New York, Los Angeles, Chicago, Miami. All-inclusive packages from $1,199. Expert guides, premium hotels.',
  keywords: 'Turkey tours from USA, Turkey vacation packages America, Istanbul tours from New York, Cappadocia tours American tourists, Turkey travel no visa, Turkey tours from Los Angeles, Turkey tours from Chicago',
  openGraph: {
    title: 'Turkey Tours from USA - No Visa Required | Funny Tourism',
    description: 'Discover Turkey from America. No visa needed! Direct flights, all-inclusive packages from $1,199.',
    images: ['/images/destinations/istanbul.jpg'],
  },
};

// USD conversion rate (approximate - you could make this dynamic)
const EUR_TO_USD = 1.10;

function formatUSD(eurPrice: number): string {
  return Math.round(eurPrice * EUR_TO_USD).toLocaleString();
}

export default async function TurkeyToursFromUSA() {
  // Fetch featured packages
  const packages = await prisma.package.findMany({
    where: { isActive: true },
    select: {
      id: true,
      packageId: true,
      slug: true,
      title: true,
      duration: true,
      description: true,
      destinations: true,
      image: true,
      pricing: true,
      packageType: true,
      highlights: true,
    },
    orderBy: { packageId: 'asc' },
    take: 6,
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section - USA Specific */}
      <section className="relative min-h-[600px] md:min-h-[700px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/MaidenTowerIstanbul.webp"
            alt="Istanbul Skyline - Turkey Tours from USA"
            fill
            className="object-cover"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </div>

        <div className="relative z-10 text-center text-white px-4 py-12 max-w-5xl mx-auto">
          {/* USA Badge */}
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <span className="text-2xl">🇺🇸</span>
            <span className="font-semibold">Exclusive for American Travelers</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Turkey Tours from
            <span className="block text-accent-400 mt-2">The United States</span>
          </h1>

          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto font-light opacity-90">
            No visa required for US citizens! Direct flights from NYC, LA, Chicago & more.
          </p>

          {/* Key Benefits */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <div className="flex items-center gap-2 bg-green-500/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <FaPassport className="text-green-400" />
              <span className="font-medium">No Visa Needed</span>
            </div>
            <div className="flex items-center gap-2 bg-blue-500/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <FaPlane className="text-blue-400" />
              <span className="font-medium">Direct Flights</span>
            </div>
            <div className="flex items-center gap-2 bg-accent-500/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <FaDollarSign className="text-accent-400" />
              <span className="font-medium">From $1,199/person</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/smart-trip-planner"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent-500 hover:bg-accent-600 text-white rounded-xl text-lg font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              Plan My Turkey Trip
            </Link>
            <Link
              href="/packages"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-xl text-lg font-semibold transition-all border border-white/30"
            >
              View All Packages
            </Link>
          </div>
        </div>
      </section>

      {/* Why Turkey from USA Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Why American Travelers Love Turkey
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Turkey offers incredible value for US travelers - stunning history, amazing food, and warm hospitality at a fraction of European prices.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Visa Free */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <FaPassport className="text-2xl text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">No Visa Required</h3>
              <p className="text-gray-600">
                US passport holders can visit Turkey visa-free for up to 90 days. Just pack your bags and go!
              </p>
            </div>

            {/* Direct Flights */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <FaPlane className="text-2xl text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Direct Flights Daily</h3>
              <p className="text-gray-600">
                Non-stop flights from New York (10h), Los Angeles (13h), Chicago (11h), Miami (11h), and more.
              </p>
            </div>

            {/* Value */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="w-14 h-14 bg-accent-100 rounded-xl flex items-center justify-center mb-4">
                <FaDollarSign className="text-2xl text-accent-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Amazing Value</h3>
              <p className="text-gray-600">
                Your dollar goes far in Turkey! 5-star hotels, gourmet meals, and private tours at unbeatable prices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Direct Flights Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Direct Flights to Istanbul
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { city: 'New York (JFK)', time: '10 hours', airlines: 'Turkish Airlines' },
              { city: 'Los Angeles (LAX)', time: '13 hours', airlines: 'Turkish Airlines' },
              { city: 'Chicago (ORD)', time: '11 hours', airlines: 'Turkish Airlines' },
              { city: 'Washington (IAD)', time: '10.5 hours', airlines: 'Turkish Airlines' },
              { city: 'Miami (MIA)', time: '11 hours', airlines: 'Turkish Airlines' },
              { city: 'Boston (BOS)', time: '9.5 hours', airlines: 'Turkish Airlines' },
              { city: 'San Francisco (SFO)', time: '13 hours', airlines: 'Turkish Airlines' },
              { city: 'Houston (IAH)', time: '12 hours', airlines: 'Turkish Airlines' },
            ].map((flight, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-4 text-center hover:shadow-md transition-shadow">
                <FaPlane className="text-primary-600 mx-auto mb-2" />
                <h3 className="font-bold text-sm md:text-base">{flight.city}</h3>
                <p className="text-gray-500 text-sm">{flight.time}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-500 mt-8">
            Turkish Airlines operates daily direct flights from major US cities to Istanbul Airport (IST)
          </p>
        </div>
      </section>

      {/* Featured Packages - USD Pricing */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Popular Turkey Packages for Americans
          </h2>
          <p className="text-gray-600 text-center mb-12">
            All prices in USD. Includes hotels, tours, transfers, and English-speaking guides.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => {
              // Parse pricing to get base price
              let basePrice = 0;
              try {
                const pricing = JSON.parse(pkg.pricing || '{}');
                if (pkg.packageType === 'WITH_HOTEL' && pricing.categories) {
                  const threeStarPricing = pricing.categories?.['3_star'];
                  if (threeStarPricing?.['6+']) {
                    basePrice = threeStarPricing['6+'].double || threeStarPricing['6+'].triple || 0;
                  }
                } else if (pricing.perPerson) {
                  basePrice = pricing.perPerson['6+'] || pricing.perPerson['4-5'] || 0;
                }
              } catch (e) {
                basePrice = 0;
              }

              return (
                <div key={pkg.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                  <div className="relative h-48">
                    <Image
                      src={pkg.image || '/images/destinations/istanbul.jpg'}
                      alt={pkg.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-accent-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {pkg.duration}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2">{pkg.title}</h3>
                    <p className="text-gray-500 text-sm mb-4">{pkg.destinations}</p>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-gray-400 text-sm">From</span>
                        <p className="text-2xl font-bold text-primary-600">
                          ${basePrice > 0 ? formatUSD(basePrice) : '999'}
                          <span className="text-sm font-normal text-gray-500">/person</span>
                        </p>
                      </div>
                      <Link
                        href={`/packages/${pkg.slug}`}
                        className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/packages"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition-colors"
            >
              View All Turkey Packages
            </Link>
          </div>
        </div>
      </section>

      {/* Trust & Safety Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Book with Confidence
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaShieldAlt className="text-2xl text-green-600" />
              </div>
              <h3 className="font-bold mb-2">Licensed & Insured</h3>
              <p className="text-gray-600 text-sm">TURSAB License #7747</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaStar className="text-2xl text-yellow-600" />
              </div>
              <h3 className="font-bold mb-2">4.9/5 Rating</h3>
              <p className="text-gray-600 text-sm">500+ Happy Travelers</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="text-2xl text-blue-600" />
              </div>
              <h3 className="font-bold mb-2">Free Cancellation</h3>
              <p className="text-gray-600 text-sm">Up to 24 hours before</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaWhatsapp className="text-2xl text-green-600" />
              </div>
              <h3 className="font-bold mb-2">24/7 US Support</h3>
              <p className="text-gray-600 text-sm">WhatsApp & Phone</p>
            </div>
          </div>
        </div>
      </section>

      {/* Best Time to Visit */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Best Time for Americans to Visit Turkey
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🌸</span>
                </div>
                <div>
                  <h3 className="font-bold">Spring Break</h3>
                  <p className="text-sm text-gray-500">March - May</p>
                </div>
              </div>
              <p className="text-gray-600">Perfect weather, fewer crowds. Ideal for hot air balloon rides in Cappadocia and exploring Istanbul.</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-accent-500">
              <div className="absolute -mt-10 ml-auto mr-auto">
                <span className="bg-accent-500 text-white px-3 py-1 rounded-full text-xs font-bold">MOST POPULAR</span>
              </div>
              <div className="flex items-center gap-3 mb-4 mt-2">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🍂</span>
                </div>
                <div>
                  <h3 className="font-bold">Fall Season</h3>
                  <p className="text-sm text-gray-500">September - November</p>
                </div>
              </div>
              <p className="text-gray-600">Best value! Perfect temperatures, harvest festivals, and beautiful autumn colors across Turkey.</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🎄</span>
                </div>
                <div>
                  <h3 className="font-bold">Holiday Season</h3>
                  <p className="text-sm text-gray-500">December - February</p>
                </div>
              </div>
              <p className="text-gray-600">Escape the cold! Mild winters, Christmas markets in Istanbul, and lowest prices of the year.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Explore Turkey?
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Get a personalized quote in minutes. Our travel experts are standing by!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/inquiry"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary-600 rounded-xl text-lg font-bold transition-all hover:bg-gray-100"
            >
              Get Free Quote
            </Link>
            <a
              href="https://wa.me/905395025310?text=Hi!%20I'm%20interested%20in%20Turkey%20tours%20from%20the%20USA"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl text-lg font-bold transition-all"
            >
              <FaWhatsapp className="text-xl" />
              WhatsApp Us
            </a>
          </div>
          <p className="mt-6 text-sm opacity-75">
            Call us: +90 539 502 53 10 (WhatsApp available)
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {[
              {
                q: 'Do Americans need a visa to visit Turkey?',
                a: 'No! US passport holders can visit Turkey visa-free for up to 90 days within any 180-day period. Just bring your valid passport with at least 6 months validity.',
              },
              {
                q: 'How long is the flight from the US to Turkey?',
                a: 'Direct flights range from 9.5 hours (Boston) to 13 hours (Los Angeles/San Francisco). Turkish Airlines operates daily non-stop flights from 8 major US cities to Istanbul.',
              },
              {
                q: 'Is Turkey safe for American tourists?',
                a: 'Yes! Turkey is very safe for tourists. Tourist areas are well-policed, and locals are known for their hospitality. We provide 24/7 support throughout your trip.',
              },
              {
                q: 'What is the best time to visit Turkey from the USA?',
                a: 'Spring (April-May) and Fall (September-November) offer the best weather and fewer crowds. Summer is great for beaches, while winter offers lower prices and magical snowy landscapes in Cappadocia.',
              },
              {
                q: 'Can I pay in US dollars?',
                a: 'Our packages are priced in USD for your convenience. We accept all major credit cards, PayPal, and wire transfers. No currency conversion hassles!',
              },
            ].map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
