import { getTranslations } from 'next-intl/server';
import { getAllYachts, getYachtPrice } from '@/lib/yachts';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { FaAnchor, FaUsers, FaBed, FaRuler, FaCalendarAlt } from 'react-icons/fa';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('yachtCharters');

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      images: ['/images/yachts/hero.jpg'],
    },
  };
}

export default async function YachtChartersPage() {
  const t = await getTranslations('yachtCharters');
  const yachts = getAllYachts();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center">
        <div className="absolute inset-0">
          <Image
            src="/images/yachts/hero.jpg"
            alt={t('hero.title')}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600/90 text-white text-sm font-semibold rounded-full mb-6">
            <FaAnchor className="h-4 w-4" />
            {t('hero.badge')}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            {t('hero.title')}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8">
            {t('hero.subtitle')}
          </p>
          <Link
            href="/yacht-charters#fleet"
            className="btn-primary text-lg px-8 py-4"
          >
            {t('hero.cta')}
          </Link>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-gray-50">
        <div className="section-container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {t('intro.title')}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {t('intro.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Fleet Section */}
      <section id="fleet" className="py-16">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('fleet.title')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('fleet.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {yachts.map((yacht) => {
              const { price, period } = getYachtPrice(yacht);

              return (
                <div
                  key={yacht.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
                >
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={yacht.thumbnail}
                      alt={yacht.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-primary-600 text-white text-sm font-semibold rounded-full capitalize">
                        {yacht.type.replace('-', ' ')}
                      </span>
                    </div>
                    {yacht.minDays === 1 && (
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 bg-accent-500 text-white text-sm font-semibold rounded-full">
                          {t('fleet.dailyAvailable')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {yacht.name}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {yacht.shortDescription}
                    </p>

                    {/* Specs */}
                    <div className="grid grid-cols-4 gap-4 py-4 border-y border-gray-100">
                      <div className="text-center">
                        <FaRuler className="h-5 w-5 text-primary-600 mx-auto mb-1" />
                        <span className="text-sm font-semibold text-gray-900">{yacht.length}m</span>
                        <p className="text-xs text-gray-500">{t('fleet.length')}</p>
                      </div>
                      <div className="text-center">
                        <FaBed className="h-5 w-5 text-primary-600 mx-auto mb-1" />
                        <span className="text-sm font-semibold text-gray-900">{yacht.cabins}</span>
                        <p className="text-xs text-gray-500">{t('fleet.cabins')}</p>
                      </div>
                      <div className="text-center">
                        <FaUsers className="h-5 w-5 text-primary-600 mx-auto mb-1" />
                        <span className="text-sm font-semibold text-gray-900">{yacht.guests}</span>
                        <p className="text-xs text-gray-500">{t('fleet.guests')}</p>
                      </div>
                      <div className="text-center">
                        <FaCalendarAlt className="h-5 w-5 text-primary-600 mx-auto mb-1" />
                        <span className="text-sm font-semibold text-gray-900">{yacht.year}</span>
                        <p className="text-xs text-gray-500">{t('fleet.built')}</p>
                      </div>
                    </div>

                    {/* Price & CTA */}
                    <div className="flex items-center justify-between mt-4">
                      <div>
                        <span className="text-sm text-gray-500">{t('fleet.from')}</span>
                        <p className="text-2xl font-bold text-primary-600">
                          €{price.toLocaleString()}
                          <span className="text-sm font-normal text-gray-500">
                            /{period === 'day' ? t('fleet.perDay') : t('fleet.perWeek')}
                          </span>
                        </p>
                      </div>
                      <Link
                        href={`/yacht-charters/${yacht.slug}`}
                        className="btn-primary"
                      >
                        {t('fleet.viewDetails')}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {t('whyUs.title')}
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🛥️</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('whyUs.fleet.title')}</h3>
              <p className="text-white/80">{t('whyUs.fleet.description')}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">👨‍✈️</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('whyUs.crew.title')}</h3>
              <p className="text-white/80">{t('whyUs.crew.description')}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🍽️</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('whyUs.cuisine.title')}</h3>
              <p className="text-white/80">{t('whyUs.cuisine.description')}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🏖️</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('whyUs.routes.title')}</h3>
              <p className="text-white/80">{t('whyUs.routes.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="section-container">
          <div className="bg-gradient-to-r from-accent-500 to-accent-600 rounded-2xl p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('cta.title')}
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              {t('cta.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/inquiry?type=yacht" className="btn bg-white text-accent-600 hover:bg-gray-100 text-lg px-8 py-4 font-semibold rounded-lg">
                {t('cta.getQuote')}
              </Link>
              <a
                href="https://wa.me/905396144757?text=Hello, I'm interested in yacht charter."
                target="_blank"
                rel="noopener noreferrer"
                className="btn bg-green-500 hover:bg-green-600 text-white text-lg px-8 py-4 font-semibold rounded-lg flex items-center justify-center gap-2"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
