import prisma from '../lib/prisma';

const destinations = [
  {
    name: 'Istanbul',
    slug: 'istanbul',
    description: 'Istanbul is the only city in the world that spans two continents - Europe and Asia. With over 2,500 years of history, this magnificent city has been the capital of three great empires: Roman, Byzantine, and Ottoman. From ancient mosques and palaces to bustling bazaars and modern shopping districts, Istanbul offers an unforgettable blend of old and new, traditional and contemporary.',
    category: 'Historical',
    region: 'Marmara',
    heroImage: '/images/BlueMosqueIstanbul6minarets.jpg',
    gradient: 'from-blue-500 to-blue-700',
    attractions: JSON.stringify([
      {
        name: 'Blue Mosque (Sultan Ahmed Mosque)',
        description: 'Marvel at the stunning blue tiles and six minarets of this iconic mosque',
        image: '/images/BlueMosqueIstanbul6minarets.jpg',
        duration: '1-2 hours'
      },
      {
        name: 'Hagia Sophia',
        description: 'Ancient Byzantine basilica turned mosque, a masterpiece of architecture',
        image: '/images/ayasofya.jpg',
        duration: '2-3 hours'
      },
      {
        name: 'Grand Bazaar',
        description: 'One of the largest covered markets in the world with over 4,000 shops',
        image: '/images/IstanbulatNight.jpeg',
        duration: '2-4 hours'
      },
      {
        name: 'Topkapi Palace',
        description: 'Former residence of Ottoman sultans with stunning views of the Bosphorus',
        image: '/images/topkapipalacegeneraldrone.jpg',
        duration: '2-3 hours'
      }
    ]),
    experiences: JSON.stringify([
      'Bosphorus cruise between Europe and Asia',
      'Turkish bath (Hamam) experience',
      'Traditional Turkish cuisine tasting',
      'Whirling Dervishes show',
      'Spice Bazaar exploration',
      'Dolmabahçe Palace visit'
    ]),
    displayOrder: 1
  },
  {
    name: 'Cappadocia',
    slug: 'cappadocia',
    description: 'Cappadocia is a unique region famous for its surreal landscape of fairy chimneys, hot air balloon rides, underground cities, and cave hotels. This magical destination offers breathtaking views and unforgettable experiences.',
    category: 'Natural',
    region: 'Central Anatolia',
    heroImage: '/images/cappadociaballoonride.jpg',
    gradient: 'from-orange-500 to-orange-700',
    attractions: JSON.stringify([
      {
        name: 'Hot Air Balloon Ride',
        description: 'Float above the fairy chimneys at sunrise for breathtaking views',
        image: '/images/cappadociaballoonride.jpg',
        duration: '3 hours'
      },
      {
        name: 'Goreme Open Air Museum',
        description: 'Ancient cave churches with beautiful frescoes',
        image: '/images/cappadocianight.jpg',
        duration: '2-3 hours'
      },
      {
        name: 'Underground Cities',
        description: 'Explore ancient multi-level underground settlements',
        image: '/images/underground.webp',
        duration: '1-2 hours'
      },
      {
        name: 'Cave Hotels',
        description: 'Unique accommodation carved into fairy chimneys',
        image: '/images/FairyChimneysCapppadocia.jpeg',
        duration: 'Overnight'
      }
    ]),
    experiences: JSON.stringify([
      'Sunrise hot air balloon flight',
      'Cave hotel stay',
      'Turkish night show',
      'ATV valley tours',
      'Pottery workshop',
      'Hiking through Rose Valley'
    ]),
    displayOrder: 2
  },
  {
    name: 'Antalya',
    slug: 'antalya',
    description: 'Antalya is a stunning Mediterranean paradise combining beautiful beaches, ancient ruins, and a charming old town. Known as the Turkish Riviera, Antalya offers the perfect blend of history, nature, and modern resort amenities.',
    category: 'Coastal',
    region: 'Mediterranean',
    heroImage: '/images/AntalyaOldCity.jpg',
    gradient: 'from-cyan-500 to-cyan-700',
    attractions: JSON.stringify([
      {
        name: 'Old Town (Kaleiçi)',
        description: 'Historic Ottoman quarter with narrow streets and traditional houses',
        image: '/images/AntalyaOldCity.jpg',
        duration: '2-3 hours'
      },
      {
        name: 'Düden Waterfalls',
        description: 'Spectacular waterfalls cascading into the Mediterranean',
        image: '/images/duden.jpg',
        duration: '1-2 hours'
      },
      {
        name: 'Ancient Ruins',
        description: 'Visit nearby Perge, Aspendos, and Side ancient cities',
        image: '/images/side-aspendos.jpg',
        duration: 'Half day'
      },
      {
        name: 'Beautiful Beaches',
        description: 'Crystal-clear waters and golden sands',
        image: '/images/antalya-sea-view-with-mountain.jpg',
        duration: 'Full day'
      }
    ]),
    experiences: JSON.stringify([
      'Boat tours along the coast',
      'Paragliding from mountains',
      'Scuba diving adventures',
      'Cable car to Tunektepe',
      'Marina promenade walks',
      'Traditional Turkish restaurants'
    ]),
    displayOrder: 3
  },
  {
    name: 'Kusadasi',
    slug: 'kusadasi',
    description: 'Kusadasi is a vibrant coastal resort town and the gateway to Ancient Ephesus. This charming seaside destination combines beautiful beaches, bustling bazaars, and easy access to some of Turkey\'s most impressive archaeological sites.',
    category: 'Coastal',
    region: 'Aegean',
    heroImage: '/images/MeryemAnaEvi.jpeg',
    gradient: 'from-blue-500 to-blue-700',
    attractions: JSON.stringify([
      {
        name: 'Ancient Ephesus',
        description: 'One of the best-preserved ancient cities in the Mediterranean',
        image: '/images/Ephesus_Library.jpg',
        duration: '3-4 hours'
      },
      {
        name: 'House of Virgin Mary',
        description: 'Sacred pilgrimage site where Mary is believed to have spent her last days',
        image: '/images/MeryemAnaEvi.jpeg',
        duration: '1 hour'
      },
      {
        name: 'Pigeon Island',
        description: 'Historic castle on a small island connected by causeway',
        image: '/images/MeryemAnaEvi2.jpeg',
        duration: '1-2 hours'
      },
      {
        name: 'Ladies Beach',
        description: 'Popular beach with clear waters and beach clubs',
        image: '/images/PataraBeach.jpg',
        duration: 'Half day'
      }
    ]),
    experiences: JSON.stringify([
      'Ephesus archaeological tour',
      'Turkish carpet shopping',
      'Beach club relaxation',
      'Boat trips to Greek islands',
      'Priene, Miletus & Didyma tour',
      'Local bazaar exploration'
    ]),
    displayOrder: 4
  },
  {
    name: 'Ephesus',
    slug: 'ephesus',
    description: 'Ephesus is one of the best-preserved ancient cities in the Mediterranean. Walk through history on marble streets where St. Paul once preached, and marvel at the magnificent Library of Celsus and the Great Theater.',
    category: 'Historical',
    region: 'Aegean',
    heroImage: '/images/Ephesus_Library.jpg',
    gradient: 'from-green-500 to-green-700',
    attractions: JSON.stringify([
      {
        name: 'Library of Celsus',
        description: 'Stunning two-story facade of ancient Roman library',
        image: '/images/Ephesus_Library.jpg',
        duration: '30 minutes'
      },
      {
        name: 'Grand Theater',
        description: 'Massive amphitheater seating 25,000 spectators',
        image: '/images/Ephesus_Library2.jpg',
        duration: '30 minutes'
      },
      {
        name: 'Temple of Artemis',
        description: 'Ruins of one of the Seven Wonders of the Ancient World',
        image: '/images/didyma.jpg',
        duration: '30 minutes'
      },
      {
        name: 'Terrace Houses',
        description: 'Luxurious homes of wealthy Romans with beautiful mosaics',
        image: '/images/Ephesus_Library2.jpg',
        duration: '1 hour'
      }
    ]),
    experiences: JSON.stringify([
      'Guided archaeological tour',
      'Historical reenactments',
      'Ancient city photography',
      'Temple of Artemis visit',
      'Selcuk Museum exploration',
      'House of Virgin Mary pilgrimage'
    ]),
    displayOrder: 5
  },
  {
    name: 'Pamukkale',
    slug: 'pamukkale',
    description: 'Pamukkale, meaning "Cotton Castle," is a natural wonder featuring stunning white travertine terraces formed by mineral-rich thermal waters. The ancient spa city of Hierapolis crowns this unique geological formation.',
    category: 'Natural',
    region: 'Aegean',
    heroImage: '/images/PamukkaleTravertenler.jpg',
    gradient: 'from-purple-500 to-purple-700',
    attractions: JSON.stringify([
      {
        name: 'Travertine Terraces',
        description: 'Stunning white calcium pools cascading down the hillside',
        image: '/images/PamukkaleTravertenler.jpg',
        duration: '2-3 hours'
      },
      {
        name: 'Hierapolis Ancient City',
        description: 'Greco-Roman spa city with theater and necropolis',
        image: '/images/HierapolisAntikKentiPamukkale.jpg',
        duration: '2-3 hours'
      },
      {
        name: 'Thermal Pools',
        description: 'Natural hot springs with healing properties',
        image: '/images/PamukkaleTravertenler1.jpg',
        duration: '1-2 hours'
      },
      {
        name: 'Cleopatra\'s Pool',
        description: 'Ancient thermal pool with submerged Roman columns',
        image: '/images/HierapolisAntikKentiPamukkale1.jpg',
        duration: '1 hour'
      }
    ]),
    experiences: JSON.stringify([
      'Walking barefoot on travertines',
      'Swimming in Cleopatra\'s Pool',
      'Sunset photography',
      'Hierapolis exploration',
      'Hot air balloon ride',
      'Thermal water therapy'
    ]),
    displayOrder: 6
  },
  {
    name: 'Fethiye',
    slug: 'fethiye',
    description: 'Fethiye is a beautiful coastal gem on the Turkish Riviera, famous for its stunning beaches, crystal-clear waters, and thrilling paragliding opportunities. The Blue Lagoon at Ölüdeniz is one of Turkey\'s most photographed spots.',
    category: 'Adventure',
    region: 'Mediterranean',
    heroImage: '/images/fethiye-paragliding.jpg',
    gradient: 'from-teal-500 to-teal-700',
    attractions: JSON.stringify([
      {
        name: 'Ölüdeniz Beach',
        description: 'Stunning Blue Lagoon with turquoise waters',
        image: '/images/FethiyeBay.jpg',
        duration: 'Full day'
      },
      {
        name: 'Paragliding',
        description: 'Tandem paragliding from Babada Mountain',
        image: '/images/fethiye-paragliding.jpg',
        duration: '2-3 hours'
      },
      {
        name: 'Blue Lagoon',
        description: 'Protected nature reserve with calm shallow waters',
        image: '/images/Fethiye.jpg',
        duration: 'Half day'
      },
      {
        name: 'Butterfly Valley',
        description: 'Secluded canyon beach accessible by boat',
        image: '/images/fethiye-paragliding2.jpg',
        duration: 'Half day'
      }
    ]),
    experiences: JSON.stringify([
      'Tandem paragliding adventure',
      'Boat trips to 12 Islands',
      'Kayaking in Butterfly Valley',
      'Scuba diving',
      'Jeep safari tours',
      'Ancient Lycian ruins tour'
    ]),
    displayOrder: 7
  },
  {
    name: 'Marmaris',
    slug: 'marmaris',
    description: 'Marmaris is a popular coastal resort known for its beautiful marina, vibrant nightlife, and water sports. This picturesque town is surrounded by pine-clad mountains and offers stunning Mediterranean views.',
    category: 'Coastal',
    region: 'Mediterranean',
    heroImage: '/images/FethiyeMarina.jpg',
    gradient: 'from-indigo-500 to-indigo-700',
    attractions: JSON.stringify([
      {
        name: 'Marmaris Marina',
        description: 'Luxury yacht harbor with waterfront restaurants',
        image: '/images/FethiyeMarina.jpg',
        duration: '2-3 hours'
      },
      {
        name: 'Marmaris Castle',
        description: 'Historic fortress with panoramic bay views',
        image: '/images/Ferhiye-Marina.jpg',
        duration: '1-2 hours'
      },
      {
        name: 'Beach Clubs',
        description: 'Trendy beach venues with music and entertainment',
        image: '/images/FethiyeMarina.jpg',
        duration: 'Full day'
      },
      {
        name: 'Boat Tours',
        description: 'Daily cruises to hidden bays and islands',
        image: '/images/Ferhiye-Marina.jpg',
        duration: 'Full day'
      }
    ]),
    experiences: JSON.stringify([
      'Blue cruise sailing',
      'Water sports adventures',
      'Nightlife and dancing',
      'Turkish bath experience',
      'Dalyan and Turtle Beach tour',
      'Shopping in Grand Bazaar'
    ]),
    displayOrder: 8
  },
  {
    name: 'Bodrum',
    slug: 'bodrum',
    description: 'Bodrum is an Aegean gem combining ancient history with modern sophistication. This cosmopolitan resort town features a magnificent castle, pristine beaches, and a vibrant atmosphere that attracts visitors from around the world.',
    category: 'Coastal',
    region: 'Aegean',
    heroImage: '/images/antalyakekova.jpg',
    gradient: 'from-pink-500 to-pink-700',
    attractions: JSON.stringify([
      {
        name: 'Bodrum Castle',
        description: 'Crusader castle housing the Museum of Underwater Archaeology',
        image: '/images/antalyakekova.jpg',
        duration: '2-3 hours'
      },
      {
        name: 'Ancient Theater',
        description: 'Well-preserved Hellenistic amphitheater with sea views',
        image: '/images/antalyakekova.jpg',
        duration: '1 hour'
      },
      {
        name: 'Windmills',
        description: 'Iconic white windmills overlooking the bay',
        image: '/images/antalyakekova.jpg',
        duration: '30 minutes'
      },
      {
        name: 'Beach Clubs',
        description: 'Trendy waterfront venues and crystal-clear coves',
        image: '/images/antalyakekova.jpg',
        duration: 'Full day'
      }
    ]),
    experiences: JSON.stringify([
      'Blue cruise adventures',
      'Beach club hopping',
      'Ancient city exploration',
      'Marina dining',
      'Shopping in bazaars',
      'Nightlife entertainment'
    ]),
    displayOrder: 9
  },
  {
    name: 'Izmir',
    slug: 'izmir',
    description: 'Izmir, Turkey\'s third-largest city, is a vibrant coastal metropolis on the Aegean Sea. With a history dating back over 5,000 years, Izmir (ancient Smyrna) combines modern urban life with rich archaeological heritage.',
    category: 'Historical',
    region: 'Aegean',
    heroImage: '/images/izmir.jpg',
    gradient: 'from-red-500 to-red-700',
    attractions: JSON.stringify([
      {
        name: 'Agora of Smyrna',
        description: 'Ancient Roman marketplace ruins with impressive columns and arches',
        image: '/images/izmir.jpg',
        duration: '1-2 hours'
      },
      {
        name: 'Konak Square',
        description: 'Historic clock tower and central plaza, heart of modern Izmir',
        image: '/images/izmir-2.jpg',
        duration: '1 hour'
      },
      {
        name: 'Kordon Promenade',
        description: 'Beautiful waterfront walkway with cafes, restaurants and sea views',
        image: '/images/izmir.jpg',
        duration: '2-3 hours'
      },
      {
        name: 'Kemeralti Bazaar',
        description: 'Vibrant historic market with traditional goods, spices and local crafts',
        image: '/images/izmir-2.jpg',
        duration: '2-4 hours'
      }
    ]),
    experiences: JSON.stringify([
      'Ancient Ephesus day trip',
      'Sirince village wine tasting',
      'Pergamon ancient city visit',
      'Cesme beach resort getaway',
      'Izmir Bay boat cruise',
      'Turkish Aegean cuisine tasting'
    ]),
    displayOrder: 10
  },
  {
    name: 'Ankara',
    slug: 'ankara',
    description: 'Ankara, Turkey\'s capital city, is a modern metropolis with deep historical roots. From ancient Hittite settlements to the center of modern Turkish politics, Ankara represents the heart of contemporary Turkey.',
    category: 'Cultural',
    region: 'Central Anatolia',
    heroImage: '/images/anitkabir.jpg',
    gradient: 'from-gray-600 to-gray-800',
    attractions: JSON.stringify([
      {
        name: 'Anitkabir',
        description: 'Mausoleum of Mustafa Kemal Ataturk, founder of modern Turkey',
        image: '/images/anitkabir.jpg',
        duration: '2-3 hours'
      },
      {
        name: 'Museum of Anatolian Civilizations',
        description: 'Showcases archaeological treasures from ancient Anatolia',
        image: '/images/anitkabir-new.jpg',
        duration: '2-3 hours'
      },
      {
        name: 'Ankara Castle',
        description: 'Historic fortress offering panoramic views of the city',
        image: '/images/anitkabir.jpg',
        duration: '1-2 hours'
      },
      {
        name: 'Atakule Tower',
        description: 'Modern observation tower with 360-degree city views',
        image: '/images/anitkabir-new.jpg',
        duration: '1 hour'
      }
    ]),
    experiences: JSON.stringify([
      'Traditional Ankara kebab tasting',
      'Haci Bayram Mosque visit',
      'Kizilay shopping district',
      'Genclik Park relaxation',
      'Turkish Parliament area tour',
      'Museum of Turkish Republic history'
    ]),
    displayOrder: 11
  },
  {
    name: 'Bursa',
    slug: 'bursa',
    description: 'Bursa, known as "Green Bursa" for its lush parks and gardens, was the first capital of the Ottoman Empire. This historic city at the foot of Mount Uludag combines rich Ottoman heritage with natural beauty.',
    category: 'Historical',
    region: 'Marmara',
    heroImage: '/images/bursa.jpg',
    gradient: 'from-emerald-500 to-emerald-700',
    attractions: JSON.stringify([
      {
        name: 'Grand Mosque (Ulu Camii)',
        description: 'Magnificent Ottoman mosque with 20 domes and beautiful calligraphy',
        image: '/images/bursa.jpg',
        duration: '1 hour'
      },
      {
        name: 'Green Tomb (Yesil Turbe)',
        description: 'Stunning turquoise-tiled mausoleum of Sultan Mehmed I',
        image: '/images/bursa1.jpg',
        duration: '30 minutes'
      },
      {
        name: 'Uludag Mountain',
        description: 'Premier ski resort in winter, hiking paradise in summer',
        image: '/images/bursa.jpg',
        duration: 'Full day'
      },
      {
        name: 'Historic Silk Market',
        description: 'Traditional covered bazaar selling silk products and local crafts',
        image: '/images/bursa1.jpg',
        duration: '2-3 hours'
      }
    ]),
    experiences: JSON.stringify([
      'Traditional Turkish bath experience',
      'Skiing at Uludag resort',
      'Iskender kebab tasting',
      'Ottoman heritage tour',
      'Cable car ride to Uludag',
      'Cumalikizik village visit'
    ]),
    displayOrder: 12
  },
  {
    name: 'Trabzon',
    slug: 'trabzon',
    description: 'Trabzon is a stunning Black Sea city known for its lush green mountains, dramatic cliffs, and the iconic Sumela Monastery. This historic city has been an important trade center for centuries along the ancient Silk Road.',
    category: 'Natural',
    region: 'Black Sea',
    heroImage: '/images/trabzon.jpg',
    gradient: 'from-green-600 to-green-800',
    attractions: JSON.stringify([
      {
        name: 'Sumela Monastery',
        description: 'Spectacular cliff-side monastery with breathtaking mountain views',
        image: '/images/trabzon.jpg',
        duration: '3-4 hours'
      },
      {
        name: 'Uzungol Lake',
        description: 'Picturesque mountain lake surrounded by green valleys and forests',
        image: '/images/trabzon.jpg',
        duration: 'Half day'
      },
      {
        name: 'Ataturk Pavilion',
        description: 'Beautiful historic mansion set in lush gardens',
        image: '/images/trabzon.jpg',
        duration: '1-2 hours'
      },
      {
        name: 'Trabzon Castle',
        description: 'Ancient fortress with Byzantine and Ottoman heritage',
        image: '/images/trabzon.jpg',
        duration: '1 hour'
      }
    ]),
    experiences: JSON.stringify([
      'Black Sea coast exploration',
      'Traditional Trabzon cuisine',
      'Highland plateaus (yayla) visit',
      'Tea plantation tours',
      'Ayder plateau hot springs',
      'Local cheese and honey tasting'
    ]),
    displayOrder: 13
  },
  {
    name: 'Konya',
    slug: 'konya',
    description: 'Konya is Turkey\'s spiritual heart and the home of Rumi, the great 13th-century Persian poet and Sufi mystic. This ancient city was once the capital of the Seljuk Sultanate and remains a center of Islamic scholarship and mysticism.',
    category: 'Cultural',
    region: 'Central Anatolia',
    heroImage: '/images/konya-mevlana.jpg',
    gradient: 'from-amber-600 to-amber-800',
    attractions: JSON.stringify([
      {
        name: 'Mevlana Museum',
        description: 'Mausoleum of Rumi, the famous Persian poet and Sufi mystic',
        image: '/images/konya-mevlana.jpg',
        duration: '2-3 hours'
      },
      {
        name: 'Whirling Dervishes Ceremony',
        description: 'Mesmerizing spiritual dance performance of the Mevlevi Order',
        image: '/images/konya.jpg',
        duration: '1 hour'
      },
      {
        name: 'Alaeddin Mosque',
        description: 'Historic Seljuk mosque with beautiful architecture',
        image: '/images/konya-mevlana.jpg',
        duration: '1 hour'
      },
      {
        name: 'Ince Minare Museum',
        description: 'Former Seljuk madrasa showcasing Islamic art and woodwork',
        image: '/images/konya.jpg',
        duration: '1-2 hours'
      }
    ]),
    experiences: JSON.stringify([
      'Whirling Dervishes sema ceremony',
      'Sufi mysticism exploration',
      'Traditional Konya etli ekmek',
      'Seljuk architecture tour',
      'Catalhoyuk archaeological site',
      'Rumi poetry and philosophy'
    ]),
    displayOrder: 14
  },
  {
    name: 'Gallipoli',
    slug: 'gallipoli',
    description: 'The Gallipoli Peninsula holds profound historical significance as the site of one of World War I\'s most famous campaigns. In 1915, Allied forces attempted to capture Constantinople from the Ottoman Empire. Today, it stands as a place of remembrance honoring soldiers from both sides.',
    category: 'Historical',
    region: 'Marmara',
    heroImage: '/images/gallipoli.jpg',
    gradient: 'from-slate-600 to-slate-800',
    attractions: JSON.stringify([
      {
        name: 'ANZAC Cove',
        description: 'Historic landing site of Australian and New Zealand forces in 1915',
        image: '/images/gallipoli.jpg',
        duration: '1-2 hours'
      },
      {
        name: 'Lone Pine Cemetery',
        description: 'Moving memorial and cemetery honoring fallen Australian soldiers',
        image: '/images/gallipoli-2.jpg',
        duration: '1 hour'
      },
      {
        name: 'Chunuk Bair',
        description: 'Strategic hilltop battle site with panoramic views',
        image: '/images/gallipoli.jpg',
        duration: '1 hour'
      },
      {
        name: 'Turkish Martyrs Memorial',
        description: 'Impressive monument commemorating Turkish fallen soldiers',
        image: '/images/gallipoli-2.jpg',
        duration: '30 minutes'
      }
    ]),
    experiences: JSON.stringify([
      'Dawn Service at ANZAC Cove',
      'Guided battlefield tours',
      'War memorials exploration',
      'Museum visit',
      'Respect ceremony attendance',
      'Historical photography'
    ]),
    displayOrder: 15
  },
  {
    name: 'Troy',
    slug: 'troy',
    description: 'Troy is one of the most famous archaeological sites in the world, immortalized in Homer\'s epic poem, the Iliad. This UNESCO World Heritage Site reveals nine distinct layers of settlement, spanning from the Bronze Age to the Byzantine era.',
    category: 'Historical',
    region: 'Marmara',
    heroImage: '/images/pergamon.jpg',
    gradient: 'from-yellow-600 to-yellow-800',
    attractions: JSON.stringify([
      {
        name: 'Trojan Horse Replica',
        description: 'Famous wooden horse from the legendary tale, perfect for photos',
        image: '/images/pergamon.jpg',
        duration: '30 minutes'
      },
      {
        name: 'Ancient City Ruins',
        description: 'Nine layers of ancient cities spanning 4,000 years of history',
        image: '/images/pergamon.jpg',
        duration: '2-3 hours'
      },
      {
        name: 'Archaeological Museum',
        description: 'Artifacts and treasures from the excavations of Troy',
        image: '/images/pergamon.jpg',
        duration: '1-2 hours'
      },
      {
        name: 'City Walls',
        description: 'Impressive fortifications from multiple historical periods',
        image: '/images/pergamon.jpg',
        duration: '1 hour'
      }
    ]),
    experiences: JSON.stringify([
      'Homer\'s Iliad storytelling',
      'Archaeological site exploration',
      'Ancient warfare history',
      'Greek mythology tour',
      'Professional photography',
      'UNESCO World Heritage site visit'
    ]),
    displayOrder: 16
  },
  {
    name: 'Alanya',
    slug: 'alanya',
    description: 'Alanya is one of Turkey\'s most popular Mediterranean resort destinations, famous for its beautiful beaches, warm climate, and spectacular medieval castle. This vibrant coastal city perfectly combines historical heritage with modern beach resort amenities.',
    category: 'Coastal',
    region: 'Mediterranean',
    heroImage: '/images/alanya.jpg',
    gradient: 'from-orange-600 to-orange-800',
    attractions: JSON.stringify([
      {
        name: 'Alanya Castle',
        description: 'Medieval fortress on hilltop with stunning panoramic sea views',
        image: '/images/alanya.jpg',
        duration: '2-3 hours'
      },
      {
        name: 'Cleopatra Beach',
        description: 'Beautiful sandy beach with crystal-clear turquoise waters',
        image: '/images/alanya.jpg',
        duration: 'Half day'
      },
      {
        name: 'Damlatas Cave',
        description: 'Stunning stalactite cave with therapeutic microclimate',
        image: '/images/alanya.jpg',
        duration: '30 minutes'
      },
      {
        name: 'Red Tower (Kizil Kule)',
        description: 'Historic Seljuk tower and symbol of Alanya',
        image: '/images/alanya.jpg',
        duration: '1 hour'
      }
    ]),
    experiences: JSON.stringify([
      'Mediterranean beach relaxation',
      'Boat tours along the coast',
      'Water sports activities',
      'Sunset castle views',
      'Shopping at harbor area',
      'Nightlife and entertainment'
    ]),
    displayOrder: 17
  }
];

async function seedDestinations() {
  console.log('Starting destination seeding...');

  for (const dest of destinations) {
    try {
      const existing = await prisma.destination.findUnique({
        where: { slug: dest.slug }
      });

      if (existing) {
        console.log(`✓ Destination "${dest.name}" already exists, skipping...`);
        continue;
      }

      await prisma.destination.create({
        data: dest
      });

      console.log(`✓ Created destination: ${dest.name}`);
    } catch (error) {
      console.error(`✗ Error creating destination ${dest.name}:`, error);
    }
  }

  console.log('Destination seeding completed!');
}

seedDestinations()
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
