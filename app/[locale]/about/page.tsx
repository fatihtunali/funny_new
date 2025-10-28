'use client';

import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { FaLaugh, FaGlobeAmericas, FaHandshake, FaSeedling } from 'react-icons/fa';
import { useTranslations } from 'next-intl';

export default function AboutPage() {
  const t = useTranslations('aboutPage');
  const teamMembers = [
    {
      name: 'Fatih TUNALI',
      title: t('team.fatih.title'),
      image: '/images/fatih.png',
      bio: t('team.fatih.bio')
    },
    {
      name: 'Diler TUNALI',
      title: t('team.diler.title'),
      image: '/images/diler.png',
      bio: t('team.diler.bio')
    },
    {
      name: 'Gul AKBURAK',
      title: t('team.gul.title'),
      image: null,
      bio: t('team.gul.bio')
    }
  ];

  const values = [
    {
      icon: <FaLaugh className="text-5xl text-accent-500" />,
      title: t('values.laugh.title'),
      description: t('values.laugh.description')
    },
    {
      icon: <FaGlobeAmericas className="text-5xl text-primary-600" />,
      title: t('values.respect.title'),
      description: t('values.respect.description')
    },
    {
      icon: <FaHandshake className="text-5xl text-green-600" />,
      title: t('values.connect.title'),
      description: t('values.connect.description')
    },
    {
      icon: <FaSeedling className="text-5xl text-green-500" />,
      title: t('values.responsible.title'),
      description: t('values.responsible.description')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">{t('header.title')}</h1>
          <p className="text-xl text-primary-100">{t('header.subtitle')}</p>
        </div>
      </div>

      {/* Our Story Section */}
      <section className="section-container py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-96 rounded-lg overflow-hidden shadow-xl"
            >
              <Image
                src="/images/IstanbulatNight.jpeg"
                alt="Funny Tourism"
                fill
                className="object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">{t('story.title')}</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  {t('story.paragraph1')}
                </p>
                <p>
                  {t('story.paragraph2')}
                </p>
                <p>
                  {t('story.paragraph3')}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-gray-50 py-16">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('team.title')}</h2>
            <p className="text-xl text-gray-600">
              {t('team.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative h-80 bg-gray-200">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-400 to-primary-600">
                      <span className="text-6xl text-white font-bold">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-primary-600 font-semibold mb-4">{member.title}</p>
                  <p className="text-gray-700 text-sm leading-relaxed">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-container py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('values.title')}</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex justify-center mb-4">{value.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
              <p className="text-gray-600 leading-relaxed">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 py-16">
        <div className="section-container text-center">
          <h2 className="text-3xl font-bold text-white mb-4">{t('cta.title')}</h2>
          <p className="text-xl text-white mb-8">
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/packages" className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
              {t('cta.packagesButton')}
            </Link>
            <Link href="/#contact" className="btn-primary bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600">
              {t('cta.contactButton')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
