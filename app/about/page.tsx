'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaLaugh, FaGlobeAmericas, FaHandshake, FaSeedling } from 'react-icons/fa';

export default function AboutPage() {
  const teamMembers = [
    {
      name: 'Fatih TUNALI',
      title: 'Founder & CEO',
      image: '/images/fatih.png',
      bio: `With a passion for tourism ignited at the young age of 14, Fatih Tunali has dedicated his life to the travel industry. He pursued formal education in Travel Agency and Tourism Hospitality, laying the foundation for a successful career. At 20 years old, Fatih began working for travel agencies, gaining invaluable experience and insights into the intricacies of the tourism sector. Today, with over two decades of experience under his belt, Fatih stands as a seasoned veteran in the field. As the founder, owner, and CEO of Funny Tourism & DMC, Fatih leads with vision, determination, and a deep-seated commitment to excellence. Beyond his professional endeavors, Fatih finds fulfillment as a father to his son, balancing his roles with grace and dedication.`
    },
    {
      name: 'Diler TUNALI',
      title: 'Head of Tour Operations',
      image: '/images/diler.png',
      bio: `Diler Tunali's journey in tourism began at the age of 26, where her innate talents and passion for hospitality propelled her into the industry. She pursued education in Professional Guidance, equipping herself with the knowledge and skills necessary to excel in her field. As the Head of Sales and Operations at Funny Tourism & DMC, Diler plays a pivotal role in driving the company's success. Her unwavering support, dedication, and attention to detail contribute significantly to the seamless execution of operations and the delivery of exceptional service to clients. Beyond her professional role, Diler is the supportive partner of Fatih Tunali, providing invaluable support and encouragement as they navigate the journey of entrepreneurship together.`
    },
    {
      name: 'Gul AKBURAK',
      title: 'Accounting',
      image: null,
      bio: `With 18 years of experience in accounting within the tourism sector, Gul Akburak is the numerical backbone of Funny Tourism & DMC. Her expertise ensures the financial health and stability of the company.`
    }
  ];

  const values = [
    {
      icon: <FaLaugh className="text-5xl text-accent-500" />,
      title: 'Laugh Often',
      description: 'We believe laughter is an essential part of any great journey.'
    },
    {
      icon: <FaGlobeAmericas className="text-5xl text-primary-600" />,
      title: 'Respect Cultures',
      description: 'We appreciate cultural differences and share humor in respectful ways.'
    },
    {
      icon: <FaHandshake className="text-5xl text-green-600" />,
      title: 'Build Connections',
      description: 'Humor brings people together across language and cultural barriers.'
    },
    {
      icon: <FaSeedling className="text-5xl text-green-500" />,
      title: 'Travel Responsibly',
      description: 'We\'re committed to sustainable tourism practices that protect our planet.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[50vh] min-h-[300px] bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white px-4"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4">About Funny Tourism</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              Bringing laughter and joy to every travel experience since 2010
            </p>
          </motion.div>
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
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Funny Tourism was founded by a group of travel enthusiasts who believed that the best travel experiences are those filled with laughter and joy. We noticed that most travel agencies focused solely on sightseeing, while missing the humorous and entertaining aspects of different cultures.
                </p>
                <p>
                  Our mission is to create travel experiences that not only show you the world but make you laugh along the way. Whether it&apos;s through comedy-themed tours, visits to quirky attractions, or simply embracing the funny side of cultural differences, we believe that humor enhances every journey.
                </p>
                <p>
                  Today, Funny Tourism operates in over 30 countries, bringing smiles to thousands of travelers each year. We&apos;re proud to be the pioneers of humor-focused tourism and continue to innovate with new funny travel concepts every season.
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600">
              Our staff is made up of travel experts with a great sense of humor
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
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
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
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl text-white mb-8">
            Join thousands of happy travelers who have experienced Turkey with us
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/packages" className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
              View Our Packages
            </Link>
            <Link href="/#contact" className="btn-primary bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
