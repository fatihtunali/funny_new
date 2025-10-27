import PricingCalculator from '@/components/PricingCalculator';
import ItineraryTimeline from '@/components/ItineraryTimeline';
import Link from 'next/link';

const packageData = {
  title: 'Istanbul & Cappadocia & Kusadasi Package',
  duration: '9 Nights / 10 Days',
  description: 'Experience the best of Turkey with our comprehensive tour covering Istanbul\'s historic sites, Cappadocia\'s fairy chimneys, and the ancient wonders of Ephesus and Pamukkale.',

  itinerary: [
    {
      day: 1,
      title: 'Fly / Istanbul',
      meals: '-',
      description: 'Arrive to Istanbul or SAW airport in Istanbul. Arrival transfer to the hotel and check-in. The rest of the day is yours. Overnight in Istanbul.'
    },
    {
      day: 2,
      title: 'Istanbul – Full Day Tour',
      meals: 'B',
      description: 'After breakfast at the hotel, a guided tour to Hippodrome, Topkapi Palace St. Sophia, Blue Mosque and the Grand Bazaar will commence. After the tour, transfer back to hotel. Overnight in Istanbul.',
      highlights: ['Hippodrome', 'Topkapi Palace', 'Hagia Sophia', 'Blue Mosque', 'Grand Bazaar']
    },
    {
      day: 3,
      title: 'Istanbul – Full Day Tour incl. Bosphorus Cruise',
      meals: 'B',
      description: 'After breakfast, your tour will start with Spice Bazaar and then it goes on with Bosphorus Cruise (Boat is not private). In the afternoon cross over the Bosphorus Bridge to Asia and visit Camlica Hill. Transfer back to your hotel for overnight.',
      highlights: ['Spice Bazaar', 'Bosphorus Cruise', 'Camlica Hill']
    },
    {
      day: 4,
      title: 'Istanbul / Fly / Cappadocia',
      meals: 'B',
      description: 'After breakfast, according to your flight time you will transfer to Istanbul or SAW airport for your flight to Kayseri or Nevsehir. Arrive in Kayseri or Nevsehir airport and transfer to your hotel. Overnight in Cappadocia.'
    },
    {
      day: 5,
      title: 'Cappadocia – Full Day Tour',
      meals: 'B',
      description: 'After breakfast, depart for our Cappadocia tour including Dervent (Imagination Valley) Zelve Open Air Museum, Pasabag Valley, Cavusin Village. After lunch break, we will make a shopping tour in which you will be aware of the ancient arts of Turkey like carpet weaving, leather manufacturing and jewellery.',
      highlights: ['Dervent Valley', 'Zelve Open Air Museum', 'Pasabag Valley', 'Cavusin Village']
    },
    {
      day: 6,
      title: 'Cappadocia – Full Day Tour',
      meals: 'B',
      description: 'After breakfast, depart for our Cappadocia tour including Ozkonak Underground City Goreme Panorama, Pigeon Valley, Uchisar Castle from outside. After the tour, transfer to your hotel.',
      highlights: ['Ozkonak Underground City', 'Goreme Panorama', 'Pigeon Valley', 'Uchisar Castle']
    },
    {
      day: 7,
      title: 'Cappadocia - Kayseri / Fly / Izmir - Kusadasi',
      meals: 'B',
      description: 'After breakfast, we will transfer you to Kayseri Airport for your domestic flight to Izmir. On arrival you will check in to your hotel. The rest of the day is yours. Overnight in Kusadasi.'
    },
    {
      day: 8,
      title: 'Kusadasi – Ephesus & Sirince Full Day Tour',
      meals: 'B',
      description: 'After breakfast, departure for full day tour for ancient city of Ephesus, one of the most well-preserved archaeological sites in the world and also includes a visit to the iconic Temple of Artemis, one of the Seven Wonders of the Ancient World.',
      highlights: ['Ancient Ephesus', 'Temple of Artemis', 'Grand Theater', 'Library of Celsus', 'Sirince Village']
    },
    {
      day: 9,
      title: 'Kusadasi – Pamukkale Full Day Tour',
      meals: 'B',
      description: 'After breakfast drive to Pamukkale which is the center of natural thermal spring waters with healing properties. Then visit the travertines and the ancient city of Hierapolis which has the biggest Nekropol with 1200 gravestones in Anatolia.',
      highlights: ['Pamukkale Travertines', 'Ancient Hierapolis', 'Thermal Pools']
    },
    {
      day: 10,
      title: 'Kusadasi / Fly / Istanbul / Fly',
      meals: 'B',
      description: 'After breakfast, check out from the hotel. You will have free time until transfer to Izmir airport for your flight back to Istanbul to catch your flight to your next destination. The tour ends with great memories.'
    }
  ],

  inclusions: [
    '9 nights accommodation in selected hotels',
    'Meals as per itinerary (B=Breakfast)',
    'Return airport transfers on Private basis',
    'Bosphorus Cruise Ticket',
    'Professional English-Speaking Guidance on tour days',
    'Sightseeing as per itinerary on Private basis with entrance fees',
    'Local Taxes'
  ],

  exclusions: [
    'International flights',
    'Domestic flights (Turkey)',
    'Personal expenses',
    'Drinks at meals',
    'Tips and porterage at hotels',
    'Tips to the driver and the guide',
    'Hot air balloon ride (optional extra)'
  ],

  importantInfo: [
    'Grand Bazaar and Spice Market closed on official holidays and religious festivals',
    'Grand Bazaar is closed on Sundays',
    'Topkapi Palace is closed on Tuesdays',
    'Comfortable shoes and cotton clothing recommended',
    'Shorts not allowed in mosques - bring a scarf for Blue Mosque & Hagia Sophia',
    'Be ready in hotel lobby 5 minutes prior to pick-up time'
  ],

  hotels: {
    threestar: {
      istanbul: 'Hera Montagna or similar',
      cappadocia: 'Floria or similar',
      kusadasi: 'By Karaaslan Inn or similar'
    },
    fourstar: {
      istanbul: 'Elite World Comfy Taksim or similar',
      cappadocia: 'Burcu Kaya or similar',
      kusadasi: 'Suhan Seaport 360 or similar'
    },
    fivestar: {
      istanbul: 'Elite World Istanbul Taksim or similar',
      cappadocia: 'Signature Garden Avanos or similar',
      kusadasi: 'Seven For Life or similar'
    }
  },

  pricing: {
    threestar: {
      twoAdults: 1765,
      fourAdults: 1245,
      sixAdults: 1029
    },
    fourstar: {
      twoAdults: 1875,
      fourAdults: 1355,
      sixAdults: 1139
    },
    fivestar: {
      twoAdults: 2019,
      fourAdults: 1499,
      sixAdults: 1285
    },
    children: {
      age3to5: 320,
      age6to10: 695
    }
  }
};

export default function PackagePage() {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="section-container">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{packageData.title}</h1>
            <p className="text-xl mb-4">{packageData.duration}</p>
            <p className="text-lg opacity-90">{packageData.description}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="section-container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Itinerary */}
          <div className="lg:col-span-2 space-y-8">
            {/* Itinerary */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Day-by-Day Itinerary</h2>
              <ItineraryTimeline itinerary={packageData.itinerary} />
            </div>

            {/* What's Included/Excluded */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-2xl font-bold text-green-600 mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  What&apos;s Included
                </h3>
                <ul className="space-y-2">
                  {packageData.inclusions.map((item, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-2xl font-bold text-red-600 mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Not Included
                </h3>
                <ul className="space-y-2">
                  {packageData.exclusions.map((item, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <svg className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Important Information */}
            <div className="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-6">
              <h3 className="text-xl font-bold text-amber-900 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Important Information
              </h3>
              <ul className="space-y-2 text-sm text-amber-900">
                {packageData.importantInfo.map((info, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{info}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column - Pricing & Booking */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <PricingCalculator packageData={packageData} />

              {/* Contact Info */}
              <div className="bg-primary-50 rounded-lg p-6 mt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Need Help?</h3>
                <p className="text-sm text-gray-700 mb-4">Our travel experts are here to help you plan your perfect Turkey vacation.</p>
                <a href="https://wa.me/905XXXXXXXXX" className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors mb-3">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                  WhatsApp Us
                </a>
                <Link href="/inquiry" className="block text-center bg-white hover:bg-gray-50 text-primary-600 font-semibold py-3 px-4 rounded-lg border-2 border-primary-600 transition-colors">
                  Email Inquiry
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
