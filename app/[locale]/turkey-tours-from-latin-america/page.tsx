import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { FaPlane, FaPassport, FaCheckCircle, FaDollarSign, FaStar, FaShieldAlt, FaWhatsapp, FaLanguage } from 'react-icons/fa';
import { getLocale } from 'next-intl/server';

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
  title: 'Turkey Tours from Latin America | Viajes a Turquía desde Latinoamérica',
  description: 'Book Turkey tour packages from Latin America. Flights from Mexico City, Buenos Aires, Sao Paulo. Spanish-speaking guides, all-inclusive packages from $1,099. Paquetes turísticos a Turquía.',
  keywords: 'Turkey tours Latin America, viajes a Turquía, paquetes turísticos Turquía, Istanbul tours Mexico, Cappadocia tours Argentina, Turkey travel Brazil, Turquía desde México, Turquía desde Argentina, Turquía desde Colombia',
  alternates: {
    canonical: 'https://funnytourism.com/en/turkey-tours-from-latin-america',
    languages: {
      'en': 'https://funnytourism.com/en/turkey-tours-from-latin-america',
      'es': 'https://funnytourism.com/es/turkey-tours-from-latin-america',
    },
  },
  openGraph: {
    title: 'Turkey Tours from Latin America | Viajes a Turquía | Funny Tourism',
    description: 'Discover Turkey from Latin America. Spanish-speaking guides, all-inclusive packages from $1,099.',
    url: 'https://funnytourism.com/en/turkey-tours-from-latin-america',
    siteName: 'Funny Tourism',
    images: [
      {
        url: 'https://funnytourism.com/images/MaidenTowerIstanbul.webp',
        width: 1200,
        height: 630,
        alt: 'Turkey Tours from Latin America - Viajes a Turquía',
      },
    ],
    locale: 'es_MX',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Turkey Tours from Latin America | Viajes a Turquía',
    description: 'Book Turkey tours from LATAM. Spanish guides, packages from $1,099.',
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

// USD conversion rate
const EUR_TO_USD = 1.10;

function formatUSD(eurPrice: number): string {
  return Math.round(eurPrice * EUR_TO_USD).toLocaleString();
}

// Content translations
const content = {
  en: {
    badge: 'For Latin American Travelers',
    heroTitle1: 'Turkey Tours from',
    heroTitle2: 'Latin America',
    heroSubtitle: 'Spanish-speaking guides, convenient connections, unforgettable experiences!',
    benefit1: 'Spanish Guides',
    benefit2: 'Easy Connections',
    benefit3: 'From $1,099/person',
    ctaPrimary: 'Plan My Turkey Trip',
    ctaSecondary: 'View All Packages',
    whyTitle: 'Why Latin Americans Love Turkey',
    whySubtitle: 'Turkey offers an exotic blend of cultures, stunning landscapes, and warm hospitality that resonates with Latin American travellers.',
    spanishTitle: 'Spanish-Speaking Guides',
    spanishDesc: 'All our tours include professional Spanish-speaking guides. No language barriers - enjoy every moment!',
    cultureTitle: 'Similar Culture',
    cultureDesc: 'Turkey\'s warm hospitality, family values, and love of good food will make you feel right at home.',
    valueTitle: 'Amazing Value',
    valueDesc: 'Your dollar goes far in Turkey! Luxury experiences at prices that make sense.',
    flightsTitle: 'Connections to Istanbul',
    packagesTitle: 'Popular Turkey Packages',
    packagesSubtitle: 'All prices in USD. Includes hotels, tours, transfers, and Spanish-speaking guides.',
    trustTitle: 'Book with Confidence',
    seasonTitle: 'Best Time to Visit Turkey',
    ctaTitle: 'Ready to Explore Turkey?',
    ctaSubtitle: 'Get a personalized quote in minutes. Our Spanish-speaking travel experts are here to help!',
    faqTitle: 'Frequently Asked Questions',
    viewDetails: 'View Details',
    viewAll: 'View All Turkey Packages',
    getQuote: 'Get Free Quote',
  },
  es: {
    badge: 'Para Viajeros Latinoamericanos',
    heroTitle1: 'Viajes a Turquía desde',
    heroTitle2: 'Latinoamérica',
    heroSubtitle: '¡Guías en español, conexiones convenientes, experiencias inolvidables!',
    benefit1: 'Guías en Español',
    benefit2: 'Conexiones Fáciles',
    benefit3: 'Desde $1,099/persona',
    ctaPrimary: 'Planificar Mi Viaje',
    ctaSecondary: 'Ver Todos los Paquetes',
    whyTitle: 'Por Qué los Latinoamericanos Aman Turquía',
    whySubtitle: 'Turquía ofrece una mezcla exótica de culturas, paisajes impresionantes y hospitalidad cálida.',
    spanishTitle: 'Guías en Español',
    spanishDesc: 'Todos nuestros tours incluyen guías profesionales de habla hispana. ¡Sin barreras idiomáticas!',
    cultureTitle: 'Cultura Similar',
    cultureDesc: 'La cálida hospitalidad turca, los valores familiares y el amor por la buena comida te harán sentir como en casa.',
    valueTitle: 'Excelente Valor',
    valueDesc: '¡Tu dólar rinde mucho en Turquía! Experiencias de lujo a precios accesibles.',
    flightsTitle: 'Conexiones a Estambul',
    packagesTitle: 'Paquetes Populares a Turquía',
    packagesSubtitle: 'Todos los precios en USD. Incluye hoteles, tours, traslados y guías en español.',
    trustTitle: 'Reserva con Confianza',
    seasonTitle: 'Mejor Época para Visitar Turquía',
    ctaTitle: '¿Listo para Explorar Turquía?',
    ctaSubtitle: 'Obtén una cotización personalizada en minutos. ¡Nuestros expertos hablan español!',
    faqTitle: 'Preguntas Frecuentes',
    viewDetails: 'Ver Detalles',
    viewAll: 'Ver Todos los Paquetes',
    getQuote: 'Cotización Gratis',
  },
};

export default async function TurkeyToursFromLatinAmerica() {
  const locale = await getLocale();
  const t = content[locale as keyof typeof content] || content.en;

  const packages = await prisma.package.findMany({
    where: { isActive: true },
    select: {
      id: true,
      packageId: true,
      slug: true,
      title: true,
      titleEs: true,
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
            alt="Istanbul - Turkey Tours from Latin America"
            fill
            className="object-cover"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </div>

        <div className="relative z-10 text-center text-white px-4 py-12 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <span className="text-2xl">🌎</span>
            <span className="font-semibold">{t.badge}</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            {t.heroTitle1}
            <span className="block text-accent-400 mt-2">{t.heroTitle2}</span>
          </h1>

          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto font-light opacity-90">
            {t.heroSubtitle}
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <div className="flex items-center gap-2 bg-purple-500/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <FaLanguage className="text-purple-400" />
              <span className="font-medium">{t.benefit1}</span>
            </div>
            <div className="flex items-center gap-2 bg-blue-500/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <FaPlane className="text-blue-400" />
              <span className="font-medium">{t.benefit2}</span>
            </div>
            <div className="flex items-center gap-2 bg-accent-500/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <FaDollarSign className="text-accent-400" />
              <span className="font-medium">{t.benefit3}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/smart-trip-planner"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent-500 hover:bg-accent-600 text-white rounded-xl text-lg font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              {t.ctaPrimary}
            </Link>
            <Link
              href="/packages"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-xl text-lg font-semibold transition-all border border-white/30"
            >
              {t.ctaSecondary}
            </Link>
          </div>
        </div>
      </section>

      {/* Why Turkey */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t.whyTitle}
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            {t.whySubtitle}
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <FaLanguage className="text-2xl text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">{t.spanishTitle}</h3>
              <p className="text-gray-600">{t.spanishDesc}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">❤️</span>
              </div>
              <h3 className="text-xl font-bold mb-2">{t.cultureTitle}</h3>
              <p className="text-gray-600">{t.cultureDesc}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <FaDollarSign className="text-2xl text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">{t.valueTitle}</h3>
              <p className="text-gray-600">{t.valueDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Flight Connections */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {t.flightsTitle}
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { city: 'Ciudad de México (MEX)', connection: 'via Madrid/Paris', flag: '🇲🇽' },
              { city: 'Buenos Aires (EZE)', connection: 'via Madrid/Rome', flag: '🇦🇷' },
              { city: 'São Paulo (GRU)', connection: 'via Frankfurt/Paris', flag: '🇧🇷' },
              { city: 'Bogotá (BOG)', connection: 'via Madrid/Miami', flag: '🇨🇴' },
              { city: 'Lima (LIM)', connection: 'via Madrid/Amsterdam', flag: '🇵🇪' },
              { city: 'Santiago (SCL)', connection: 'via Madrid/Paris', flag: '🇨🇱' },
              { city: 'Cancún (CUN)', connection: 'via Madrid/London', flag: '🇲🇽' },
              { city: 'Panama City (PTY)', connection: 'via Madrid/Frankfurt', flag: '🇵🇦' },
            ].map((flight, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-4 text-center hover:shadow-md transition-shadow">
                <span className="text-3xl mb-2 block">{flight.flag}</span>
                <h3 className="font-bold text-sm md:text-base">{flight.city}</h3>
                <p className="text-gray-500 text-xs mt-1">{flight.connection}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-500 mt-8">
            {locale === 'es'
              ? 'Conexiones convenientes a través de ciudades europeas principales con Turkish Airlines, Iberia, Air France y más'
              : 'Convenient connections through major European cities with Turkish Airlines, Iberia, Air France and more'
            }
          </p>
        </div>
      </section>

      {/* Featured Packages */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t.packagesTitle}
          </h2>
          <p className="text-gray-600 text-center mb-12">
            {t.packagesSubtitle}
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => {
              const basePrice = getBestPriceEUR(pkg.pricing || '');
              const title = locale === 'es' && pkg.titleEs ? pkg.titleEs : pkg.title;

              return (
                <div key={pkg.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                  <div className="relative h-48">
                    <Image
                      src={pkg.image || '/images/destinations/istanbul.jpg'}
                      alt={title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-accent-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {pkg.duration}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2">{title}</h3>
                    <p className="text-gray-500 text-sm mb-4">{pkg.destinations}</p>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-gray-400 text-sm">{locale === 'es' ? 'Desde' : 'From'}</span>
                        <p className="text-2xl font-bold text-primary-600">
                          ${basePrice > 0 ? formatUSD(basePrice) : '399'}
                          <span className="text-sm font-normal text-gray-500">/{locale === 'es' ? 'persona' : 'person'}</span>
                        </p>
                      </div>
                      <Link
                        href={`/packages/${pkg.slug}`}
                        className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
                      >
                        {t.viewDetails}
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
              {t.viewAll}
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t.trustTitle}
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaShieldAlt className="text-2xl text-green-600" />
              </div>
              <h3 className="font-bold mb-2">{locale === 'es' ? 'Licencia TURSAB' : 'TURSAB Licensed'}</h3>
              <p className="text-gray-600 text-sm">{locale === 'es' ? 'Licencia Oficial #7747' : 'Official License #7747'}</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaStar className="text-2xl text-yellow-600" />
              </div>
              <h3 className="font-bold mb-2">4.9/5 Rating</h3>
              <p className="text-gray-600 text-sm">{locale === 'es' ? '500+ Viajeros Felices' : '500+ Happy Travelers'}</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="text-2xl text-blue-600" />
              </div>
              <h3 className="font-bold mb-2">{locale === 'es' ? 'Cancelación Gratis' : 'Free Cancellation'}</h3>
              <p className="text-gray-600 text-sm">{locale === 'es' ? 'Hasta 24 horas antes' : 'Up to 24 hours before'}</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaLanguage className="text-2xl text-purple-600" />
              </div>
              <h3 className="font-bold mb-2">{locale === 'es' ? 'Atención en Español' : 'Spanish Support'}</h3>
              <p className="text-gray-600 text-sm">WhatsApp 24/7</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t.ctaTitle}
          </h2>
          <p className="text-xl opacity-90 mb-8">
            {t.ctaSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/inquiry"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary-600 rounded-xl text-lg font-bold transition-all hover:bg-gray-100"
            >
              {t.getQuote}
            </Link>
            <a
              href="https://wa.me/905395025310?text=Hola!%20Estoy%20interesado%20en%20tours%20a%20Turquía%20desde%20Latinoamérica"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl text-lg font-bold transition-all"
            >
              <FaWhatsapp className="text-xl" />
              WhatsApp
            </a>
          </div>
          <p className="mt-6 text-sm opacity-75">
            {locale === 'es' ? 'Llámanos: +90 539 502 53 10 (WhatsApp disponible)' : 'Call us: +90 539 502 53 10 (WhatsApp available)'}
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t.faqTitle}
          </h2>

          <div className="space-y-6">
            {(locale === 'es' ? [
              {
                q: '¿Necesito visa para visitar Turquía?',
                a: 'Depende de tu nacionalidad. Ciudadanos de México, Argentina, Chile y varios países latinoamericanos pueden obtener una e-Visa en línea. Brasileños necesitan visa de embajada. Te ayudamos con todo el proceso.',
              },
              {
                q: '¿Hay guías que hablen español?',
                a: '¡Sí! Todos nuestros tours incluyen guías profesionales de habla hispana. No tendrás ninguna barrera idiomática durante tu viaje.',
              },
              {
                q: '¿Cómo llego a Turquía desde Latinoamérica?',
                a: 'Las conexiones más convenientes son a través de Madrid (Iberia), París (Air France), o Frankfurt (Lufthansa). Turkish Airlines también ofrece conexiones excelentes. El viaje total es de 14-18 horas.',
              },
              {
                q: '¿Puedo pagar en dólares?',
                a: 'Sí, todos nuestros precios están en USD. Aceptamos tarjetas de crédito internacionales, PayPal y transferencias bancarias.',
              },
              {
                q: '¿Es seguro viajar a Turquía?',
                a: 'Sí, Turquía es un destino muy seguro para turistas. Las zonas turísticas están bien protegidas y los turcos son conocidos por su hospitalidad. Ofrecemos soporte 24/7 durante tu viaje.',
              },
            ] : [
              {
                q: 'Do I need a visa to visit Turkey?',
                a: 'It depends on your nationality. Citizens of Mexico, Argentina, Chile and several Latin American countries can get an e-Visa online. Brazilians need an embassy visa. We help you with the entire process.',
              },
              {
                q: 'Are there Spanish-speaking guides?',
                a: 'Yes! All our tours include professional Spanish-speaking guides. You won\'t have any language barriers during your trip.',
              },
              {
                q: 'How do I get to Turkey from Latin America?',
                a: 'The most convenient connections are through Madrid (Iberia), Paris (Air France), or Frankfurt (Lufthansa). Turkish Airlines also offers excellent connections. Total travel time is 14-18 hours.',
              },
              {
                q: 'Can I pay in dollars?',
                a: 'Yes, all our prices are in USD. We accept international credit cards, PayPal, and bank transfers.',
              },
              {
                q: 'Is it safe to travel to Turkey?',
                a: 'Yes, Turkey is a very safe destination for tourists. Tourist areas are well-protected and Turks are known for their hospitality. We offer 24/7 support during your trip.',
              },
            ]).map((faq, index) => (
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
