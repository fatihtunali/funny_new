import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { FaPlane, FaPassport, FaCheckCircle, FaPoundSign, FaStar, FaShieldAlt, FaWhatsapp } from 'react-icons/fa';

// Helper function to extract best price from package pricing JSON
function getBestPriceEUR(pricing: string): number {
  try {
    const pricingData = JSON.parse(pricing || '{}');

    if (pricingData.sixAdults) return pricingData.sixAdults;
    if (pricingData.fourAdults) return pricingData.fourAdults;
    if (pricingData.twoAdults) return pricingData.twoAdults;

    if (pricingData.paxTiers) {
      const tier = pricingData.paxTiers['6'] || pricingData.paxTiers['4'] || pricingData.paxTiers['2'];
      if (tier) {
        const starPricing = tier.threestar || tier.fourstar || tier.fivestar;
        if (starPricing) return starPricing.double || starPricing.triple || 0;
      }
    }
    return 0;
  } catch {
    return 0;
  }
}

export const metadata: Metadata = {
  title: 'Turkey Tours from UK | Direct Flights from London | Holidays to Turkey',
  description: 'Book Turkey holiday packages from the UK. Direct flights from London, Manchester, Birmingham. All-inclusive packages from £999. ATOL protected, expert guides, premium hotels.',
  keywords: 'Turkey tours from UK, Turkey holidays from London, Istanbul tours British, Cappadocia tours UK, Turkey travel from Manchester, Turkey packages from Birmingham, British tourists Turkey, UK to Turkey holidays',
  alternates: {
    canonical: 'https://funnytourism.com/en/turkey-tours-from-uk',
    languages: {
      'en': 'https://funnytourism.com/en/turkey-tours-from-uk',
      'es': 'https://funnytourism.com/es/turkey-tours-from-uk',
    },
  },
  openGraph: {
    title: 'Turkey Tours from UK - Direct Flights from London | Funny Tourism',
    description: 'Discover Turkey from the UK. Direct flights from London, Manchester, Birmingham. All-inclusive packages from £999/person.',
    url: 'https://funnytourism.com/en/turkey-tours-from-uk',
    siteName: 'Funny Tourism',
    images: [
      {
        url: 'https://funnytourism.com/images/MaidenTowerIstanbul.webp',
        width: 1200,
        height: 630,
        alt: 'Turkey Tours from UK - Istanbul Skyline',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Turkey Tours from UK | Direct Flights from London',
    description: 'Book Turkey holidays from the UK. Direct flights, packages from £999.',
    images: ['https://funnytourism.com/images/MaidenTowerIstanbul.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// GBP conversion rate
const EUR_TO_GBP = 0.86;

function formatGBP(eurPrice: number): string {
  return Math.round(eurPrice * EUR_TO_GBP).toLocaleString();
}

export default async function TurkeyToursFromUK() {
  const packages = await prisma.package.findMany({
    where: { isActive: true },
    select: {
      id: true,
      packageId: true,
      slug: true,
      title: true,
      duration: true,
      destinations: true,
      image: true,
      pricing: true,
      packageType: true,
    },
    orderBy: { packageId: 'asc' },
    take: 6,
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[600px] md:min-h-[700px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/MaidenTowerIstanbul.webp"
            alt="Istanbul Skyline - Turkey Tours from UK"
            fill
            className="object-cover"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </div>

        <div className="relative z-10 text-center text-white px-4 py-12 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <span className="text-2xl">🇬🇧</span>
            <span className="font-semibold">Holidays for British Travellers</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Turkey Holidays from
            <span className="block text-accent-400 mt-2">The United Kingdom</span>
          </h1>

          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto font-light opacity-90">
            Direct flights from London, Manchester & Birmingham. Just 4 hours to paradise!
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <div className="flex items-center gap-2 bg-blue-500/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <FaPlane className="text-blue-400" />
              <span className="font-medium">4-Hour Flights</span>
            </div>
            <div className="flex items-center gap-2 bg-green-500/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <FaPassport className="text-green-400" />
              <span className="font-medium">e-Visa Online</span>
            </div>
            <div className="flex items-center gap-2 bg-accent-500/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <FaPoundSign className="text-accent-400" />
              <span className="font-medium">From £999/person</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/smart-trip-planner"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent-500 hover:bg-accent-600 text-white rounded-xl text-lg font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              Plan My Turkey Holiday
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

      {/* Why Turkey from UK */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Why British Travellers Love Turkey
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Turkey is one of the UK&apos;s favourite holiday destinations - stunning beaches, rich history, and incredible value for money.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <FaPlane className="text-2xl text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Short Flight Time</h3>
              <p className="text-gray-600">
                Just 4 hours from London to Istanbul. Perfect for a long weekend or extended holiday.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <FaPassport className="text-2xl text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Easy e-Visa</h3>
              <p className="text-gray-600">
                UK citizens can get an e-Visa online in minutes. Valid for 90 days within 180-day period.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="w-14 h-14 bg-accent-100 rounded-xl flex items-center justify-center mb-4">
                <FaPoundSign className="text-2xl text-accent-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Great Value</h3>
              <p className="text-gray-600">
                Your pound goes further in Turkey! Luxury hotels and dining at a fraction of European prices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Direct Flights */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Direct Flights to Istanbul
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { city: 'London Heathrow', time: '4 hours', airlines: 'Turkish Airlines, BA' },
              { city: 'London Gatwick', time: '4 hours', airlines: 'Turkish Airlines, easyJet' },
              { city: 'Manchester', time: '4.5 hours', airlines: 'Turkish Airlines' },
              { city: 'Birmingham', time: '4 hours', airlines: 'Turkish Airlines' },
              { city: 'Edinburgh', time: '4.5 hours', airlines: 'Turkish Airlines' },
              { city: 'London Stansted', time: '4 hours', airlines: 'Pegasus' },
              { city: 'Bristol', time: '4.5 hours', airlines: 'easyJet (seasonal)' },
              { city: 'Newcastle', time: '4.5 hours', airlines: 'Jet2 (seasonal)' },
            ].map((flight, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-4 text-center hover:shadow-md transition-shadow">
                <FaPlane className="text-primary-600 mx-auto mb-2" />
                <h3 className="font-bold text-sm md:text-base">{flight.city}</h3>
                <p className="text-gray-500 text-sm">{flight.time}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-500 mt-8">
            Multiple daily flights from UK airports to Istanbul (IST) and Antalya (AYT)
          </p>
        </div>
      </section>

      {/* Featured Packages */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Popular Turkey Holidays for Brits
          </h2>
          <p className="text-gray-600 text-center mb-12">
            All prices in GBP. Includes hotels, tours, transfers, and English-speaking guides.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => {
              const basePrice = getBestPriceEUR(pkg.pricing || '');

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
                          £{basePrice > 0 ? formatGBP(basePrice) : '349'}
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
              View All Turkey Holidays
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Section */}
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
              <h3 className="font-bold mb-2">TURSAB Licensed</h3>
              <p className="text-gray-600 text-sm">Official License #7747</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaStar className="text-2xl text-yellow-600" />
              </div>
              <h3 className="font-bold mb-2">4.9/5 Rating</h3>
              <p className="text-gray-600 text-sm">500+ Happy Travellers</p>
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
              <h3 className="font-bold mb-2">24/7 UK Support</h3>
              <p className="text-gray-600 text-sm">WhatsApp & Phone</p>
            </div>
          </div>
        </div>
      </section>

      {/* Best Time */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Best Time for Brits to Visit Turkey
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🌸</span>
                </div>
                <div>
                  <h3 className="font-bold">Easter Holidays</h3>
                  <p className="text-sm text-gray-500">April</p>
                </div>
              </div>
              <p className="text-gray-600">Perfect spring weather. Ideal for sightseeing in Istanbul and Cappadocia without the summer crowds.</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-accent-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">☀️</span>
                </div>
                <div>
                  <h3 className="font-bold">Summer Holidays</h3>
                  <p className="text-sm text-gray-500">June - August</p>
                </div>
              </div>
              <p className="text-gray-600">School holiday favourite! Beach resorts, water sports, and long sunny days. Book early!</p>
              <span className="inline-block mt-2 bg-accent-100 text-accent-700 px-2 py-1 rounded text-xs font-bold">MOST POPULAR</span>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🍂</span>
                </div>
                <div>
                  <h3 className="font-bold">Half Term</h3>
                  <p className="text-sm text-gray-500">October</p>
                </div>
              </div>
              <p className="text-gray-600">Still warm (25°C), fewer tourists, better prices. Perfect for families with school-age children.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready for Your Turkey Adventure?
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Get a personalised quote in minutes. Our UK-based travel experts are standing by!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/inquiry"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary-600 rounded-xl text-lg font-bold transition-all hover:bg-gray-100"
            >
              Get Free Quote
            </Link>
            <a
              href="https://wa.me/905395025310?text=Hi!%20I'm%20interested%20in%20Turkey%20tours%20from%20the%20UK"
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

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {[
              {
                q: 'Do British citizens need a visa for Turkey?',
                a: 'Yes, but it\'s easy! UK passport holders need an e-Visa which you can apply for online at evisa.gov.tr. It costs around £35, takes 5 minutes, and is valid for 90 days within a 180-day period.',
              },
              {
                q: 'How long is the flight from the UK to Turkey?',
                a: 'Direct flights from London to Istanbul take approximately 4 hours. Flights from Manchester and Birmingham take around 4-4.5 hours. There are multiple daily departures from most UK airports.',
              },
              {
                q: 'Is Turkey safe for British tourists?',
                a: 'Yes! Turkey is a popular and safe destination for British holidaymakers. The FCO has no travel restrictions for main tourist areas. We provide 24/7 support throughout your trip.',
              },
              {
                q: 'Can I pay in British Pounds?',
                a: 'Our packages are priced in GBP for your convenience. We accept all major UK debit/credit cards, bank transfers, and PayPal. No hidden currency conversion fees!',
              },
              {
                q: 'What\'s included in your Turkey holiday packages?',
                a: 'Our packages include accommodation, daily breakfast, airport transfers, guided tours with English-speaking guides, and all entrance fees. Flights can be arranged separately or as part of a bundle.',
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
