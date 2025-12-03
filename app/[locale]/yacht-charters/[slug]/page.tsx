import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getYachtBySlug, getAllYachts, getYachtPrice } from '@/lib/yachts';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { FaAnchor, FaUsers, FaBed, FaRuler, FaCalendarAlt, FaShip, FaCheck, FaTimes, FaWhatsapp, FaEnvelope } from 'react-icons/fa';
import type { Metadata } from 'next';
import YachtInquiryForm from '@/components/YachtInquiryForm';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const yachts = getAllYachts();
  return yachts.map((yacht) => ({
    slug: yacht.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const yacht = getYachtBySlug(slug);
  const t = await getTranslations('yachtCharters');

  if (!yacht) {
    return {
      title: 'Yacht Not Found',
    };
  }

  return {
    title: `${yacht.name} | ${t('meta.title')}`,
    description: yacht.shortDescription,
    openGraph: {
      title: `${yacht.name} | ${t('meta.title')}`,
      description: yacht.shortDescription,
      images: [yacht.thumbnail],
    },
  };
}

export default async function YachtDetailPage({ params }: Props) {
  const { slug } = await params;
  const t = await getTranslations('yachtCharters');
  const yacht = getYachtBySlug(slug);

  if (!yacht) {
    notFound();
  }

  const { price, period } = getYachtPrice(yacht);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-end">
        <div className="absolute inset-0">
          <Image
            src={yacht.thumbnail}
            alt={yacht.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        </div>

        <div className="relative z-10 w-full pb-12">
          <div className="section-container">
            <Link
              href="/yacht-charters"
              className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors"
            >
              ← {t('detail.backToFleet')}
            </Link>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary-600 text-white text-sm font-semibold rounded-full mb-4 capitalize">
                  <FaAnchor className="h-3 w-3" />
                  {yacht.type.replace('-', ' ')}
                </span>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {yacht.name}
                </h1>
                <p className="text-xl text-white/90">
                  {yacht.shortDescription}
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-white">
                <span className="text-sm opacity-80">{t('fleet.from')}</span>
                <p className="text-3xl font-bold">
                  €{price.toLocaleString()}
                  <span className="text-base font-normal opacity-80">
                    /{period === 'day' ? t('fleet.perDay') : t('fleet.perWeek')}
                  </span>
                </p>
                {yacht.minDays === 1 && (
                  <span className="inline-block mt-2 px-3 py-1 bg-accent-500 text-white text-sm font-semibold rounded-full">
                    {t('fleet.dailyAvailable')}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Specs */}
      <section className="bg-primary-600 text-white py-6">
        <div className="section-container">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
            <div className="text-center">
              <FaRuler className="h-6 w-6 mx-auto mb-2 opacity-80" />
              <span className="text-2xl font-bold">{yacht.length}m</span>
              <p className="text-sm opacity-80">{t('detail.length')}</p>
            </div>
            <div className="text-center">
              <FaShip className="h-6 w-6 mx-auto mb-2 opacity-80" />
              <span className="text-2xl font-bold">{yacht.beam}m</span>
              <p className="text-sm opacity-80">{t('detail.beam')}</p>
            </div>
            <div className="text-center">
              <FaBed className="h-6 w-6 mx-auto mb-2 opacity-80" />
              <span className="text-2xl font-bold">{yacht.cabins}</span>
              <p className="text-sm opacity-80">{t('fleet.cabins')}</p>
            </div>
            <div className="text-center">
              <FaUsers className="h-6 w-6 mx-auto mb-2 opacity-80" />
              <span className="text-2xl font-bold">{yacht.guests}</span>
              <p className="text-sm opacity-80">{t('fleet.guests')}</p>
            </div>
            <div className="text-center">
              <span className="text-2xl">👨‍✈️</span>
              <span className="text-2xl font-bold ml-2">{yacht.crew}</span>
              <p className="text-sm opacity-80">{t('detail.crew')}</p>
            </div>
            <div className="text-center">
              <FaCalendarAlt className="h-6 w-6 mx-auto mb-2 opacity-80" />
              <span className="text-2xl font-bold">{yacht.year}</span>
              <p className="text-sm opacity-80">{t('fleet.built')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="section-container">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-12">
              {/* Description */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('detail.about')} {yacht.name}
                </h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {yacht.description}
                </p>
              </div>

              {/* Technical Specs */}
              {(yacht.engine || yacht.cruisingSpeed || yacht.fuelCapacity || yacht.waterCapacity) && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {t('detail.technicalSpecs')}
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {yacht.engine && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <span className="text-sm text-gray-500">{t('detail.engine')}</span>
                        <p className="font-semibold text-gray-900">{yacht.engine}</p>
                      </div>
                    )}
                    {yacht.cruisingSpeed && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <span className="text-sm text-gray-500">{t('detail.speed')}</span>
                        <p className="font-semibold text-gray-900">{yacht.cruisingSpeed}</p>
                      </div>
                    )}
                    {yacht.fuelCapacity && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <span className="text-sm text-gray-500">{t('detail.fuelCapacity')}</span>
                        <p className="font-semibold text-gray-900">{yacht.fuelCapacity.toLocaleString()} L</p>
                      </div>
                    )}
                    {yacht.waterCapacity && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <span className="text-sm text-gray-500">{t('detail.waterCapacity')}</span>
                        <p className="font-semibold text-gray-900">{yacht.waterCapacity.toLocaleString()} L</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Amenities */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('detail.amenities')}
                </h2>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {yacht.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2 text-gray-700">
                      <FaCheck className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              {yacht.pricePerDay && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {t('detail.seasonalPricing')}
                  </h2>
                  <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <span className="text-sm text-blue-600 font-medium">{t('detail.aprilMay')}</span>
                      <p className="text-2xl font-bold text-blue-700">€{yacht.pricePerDay.aprilMay.toLocaleString()}</p>
                      <span className="text-xs text-blue-600">/{t('fleet.perDay')}</span>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <span className="text-sm text-green-600 font-medium">{t('detail.juneSeptember')}</span>
                      <p className="text-2xl font-bold text-green-700">€{yacht.pricePerDay.juneSeptember.toLocaleString()}</p>
                      <span className="text-xs text-green-600">/{t('fleet.perDay')}</span>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-lg text-center">
                      <span className="text-sm text-amber-600 font-medium">{t('detail.julyAugust')}</span>
                      <p className="text-2xl font-bold text-amber-700">€{yacht.pricePerDay.julyAugust.toLocaleString()}</p>
                      <span className="text-xs text-amber-600">/{t('fleet.perDay')}</span>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg text-center">
                      <span className="text-sm text-purple-600 font-medium">{t('detail.october')}</span>
                      <p className="text-2xl font-bold text-purple-700">€{yacht.pricePerDay.october.toLocaleString()}</p>
                      <span className="text-xs text-purple-600">/{t('fleet.perDay')}</span>
                    </div>
                  </div>
                </div>
              )}

              {yacht.pricePerWeek && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {t('detail.weeklyPricing')}
                  </h2>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <span className="text-sm text-blue-600 font-medium">{t('detail.lowSeason')}</span>
                      <p className="text-2xl font-bold text-blue-700">€{yacht.pricePerWeek.low.toLocaleString()}</p>
                      <span className="text-xs text-blue-600">/{t('fleet.perWeek')}</span>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <span className="text-sm text-green-600 font-medium">{t('detail.midSeason')}</span>
                      <p className="text-2xl font-bold text-green-700">€{yacht.pricePerWeek.mid.toLocaleString()}</p>
                      <span className="text-xs text-green-600">/{t('fleet.perWeek')}</span>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-lg text-center">
                      <span className="text-sm text-amber-600 font-medium">{t('detail.highSeason')}</span>
                      <p className="text-2xl font-bold text-amber-700">€{yacht.pricePerWeek.high.toLocaleString()}</p>
                      <span className="text-xs text-amber-600">/{t('fleet.perWeek')}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Inclusions & Exclusions */}
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FaCheck className="text-green-500" />
                    {t('detail.included')}
                  </h2>
                  <ul className="space-y-2">
                    {yacht.inclusions.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700">
                        <FaCheck className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FaTimes className="text-red-500" />
                    {t('detail.excluded')}
                  </h2>
                  <ul className="space-y-2">
                    {yacht.exclusions.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700">
                        <FaTimes className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Right Column - Inquiry Form */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <YachtInquiryForm yacht={yacht} />

                {/* Quick Contact */}
                <div className="mt-6 bg-gray-50 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">{t('detail.quickContact')}</h3>
                  <div className="space-y-3">
                    <a
                      href={`https://wa.me/905396144757?text=Hello, I'm interested in ${yacht.name} yacht charter.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <FaWhatsapp className="h-5 w-5" />
                      <span className="font-medium">WhatsApp</span>
                    </a>
                    <a
                      href="mailto:info@funnytourism.com"
                      className="flex items-center gap-3 p-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      <FaEnvelope className="h-5 w-5" />
                      <span className="font-medium">Email Us</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
