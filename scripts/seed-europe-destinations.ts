import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const europeDestinations = [
  {
    name: 'Budapest',
    slug: 'budapest',
    description: 'Budapest, the Pearl of the Danube, is one of Europe\'s most beautiful cities. Straddling the mighty Danube River, this stunning capital combines the historic Buda with its castle and thermal baths, and the vibrant Pest with its grand boulevards and ruin bars. From magnificent thermal spas to breathtaking architecture, Budapest offers an unforgettable Central European experience.',
    category: 'Historical',
    region: 'Europe',
    heroImage: '/images/budapest.webp',
    gradient: 'from-amber-500 to-amber-700',
    attractions: JSON.stringify([
      {
        name: 'Buda Castle',
        description: 'UNESCO World Heritage royal palace with stunning Danube views',
        image: '/images/budapest.webp',
        duration: '2-3 hours'
      },
      {
        name: 'Széchenyi Thermal Bath',
        description: 'One of Europe\'s largest thermal bath complexes in City Park',
        image: '/images/budapest.webp',
        duration: '3-4 hours'
      },
      {
        name: 'Hungarian Parliament Building',
        description: 'Iconic Gothic Revival masterpiece on the Danube riverbank',
        image: '/images/budapest.webp',
        duration: '1-2 hours'
      },
      {
        name: 'Fisherman\'s Bastion',
        description: 'Fairy-tale terrace with panoramic views of Budapest',
        image: '/images/budapest.webp',
        duration: '1 hour'
      }
    ]),
    experiences: JSON.stringify([
      'Danube River evening cruise',
      'Traditional Hungarian cuisine tasting',
      'Thermal bath relaxation',
      'Ruin bar exploration',
      'Chain Bridge walking tour',
      'Opera House visit'
    ]),
    displayOrder: 20
  },
  {
    name: 'Vienna',
    slug: 'vienna',
    description: 'Vienna, the Imperial City, is a treasure trove of classical music, grand architecture, and café culture. Once the seat of the powerful Habsburg Empire, Vienna enchants visitors with its magnificent palaces, world-class museums, and timeless elegance. Experience the city of Mozart, Strauss, and the legendary Viennese coffee houses.',
    category: 'Cultural',
    region: 'Europe',
    heroImage: '/images/vienna.webp',
    gradient: 'from-rose-500 to-rose-700',
    attractions: JSON.stringify([
      {
        name: 'Schönbrunn Palace',
        description: 'Magnificent imperial summer residence with stunning gardens',
        image: '/images/vienna.webp',
        duration: '3-4 hours'
      },
      {
        name: 'St. Stephen\'s Cathedral',
        description: 'Gothic masterpiece and symbol of Vienna',
        image: '/images/vienna.webp',
        duration: '1-2 hours'
      },
      {
        name: 'Belvedere Palace',
        description: 'Baroque palace housing Klimt\'s famous "The Kiss"',
        image: '/images/vienna.webp',
        duration: '2-3 hours'
      },
      {
        name: 'Vienna State Opera',
        description: 'World-renowned opera house with exceptional performances',
        image: '/images/vienna.webp',
        duration: '2-3 hours'
      }
    ]),
    experiences: JSON.stringify([
      'Classical music concert',
      'Viennese coffee house experience',
      'Sachertorte tasting',
      'Ringstrasse walking tour',
      'Naschmarkt food exploration',
      'Spanish Riding School show'
    ]),
    displayOrder: 21
  },
  {
    name: 'Prague',
    slug: 'prague',
    description: 'Prague, the City of a Hundred Spires, is one of Europe\'s most enchanting destinations. This fairy-tale city boasts an incredibly well-preserved medieval center, Gothic cathedrals, and a vibrant cultural scene. Walk across the famous Charles Bridge, explore the majestic Prague Castle, and discover why this magical city has captivated travelers for centuries.',
    category: 'Historical',
    region: 'Europe',
    heroImage: '/images/prague.webp',
    gradient: 'from-red-500 to-red-700',
    attractions: JSON.stringify([
      {
        name: 'Prague Castle',
        description: 'Largest ancient castle complex in the world',
        image: '/images/prague.webp',
        duration: '3-4 hours'
      },
      {
        name: 'Charles Bridge',
        description: 'Iconic 14th-century stone bridge with baroque statues',
        image: '/images/prague.webp',
        duration: '1-2 hours'
      },
      {
        name: 'Old Town Square',
        description: 'Historic square with Astronomical Clock and Tyn Church',
        image: '/images/prague.webp',
        duration: '2-3 hours'
      },
      {
        name: 'St. Vitus Cathedral',
        description: 'Gothic cathedral within the Prague Castle complex',
        image: '/images/prague.webp',
        duration: '1-2 hours'
      }
    ]),
    experiences: JSON.stringify([
      'Astronomical Clock viewing',
      'Czech beer tasting',
      'Vltava River cruise',
      'Jewish Quarter exploration',
      'Traditional Czech cuisine',
      'Classical music performance'
    ]),
    displayOrder: 22
  },
  {
    name: 'Zagreb',
    slug: 'zagreb',
    description: 'Zagreb, Croatia\'s charming capital, is a city of cafe culture, green parks, and fascinating museums. The historic Upper Town features medieval architecture and the iconic St. Mark\'s Church, while the Lower Town showcases elegant Austro-Hungarian buildings. Zagreb offers an authentic Croatian experience away from the coastal crowds.',
    category: 'Cultural',
    region: 'Europe',
    heroImage: '/images/zagreb.webp',
    gradient: 'from-blue-500 to-blue-700',
    attractions: JSON.stringify([
      {
        name: 'St. Mark\'s Church',
        description: 'Gothic church with its famous colorful tiled roof',
        image: '/images/zagreb.webp',
        duration: '30 minutes'
      },
      {
        name: 'Dolac Market',
        description: 'Vibrant open-air market selling local produce and crafts',
        image: '/images/zagreb.webp',
        duration: '1-2 hours'
      },
      {
        name: 'Museum of Broken Relationships',
        description: 'Unique museum showcasing mementos of failed relationships',
        image: '/images/zagreb.webp',
        duration: '1-2 hours'
      },
      {
        name: 'Ban Jelačić Square',
        description: 'Main city square and meeting point of Zagreb',
        image: '/images/zagreb.webp',
        duration: '1 hour'
      }
    ]),
    experiences: JSON.stringify([
      'Zagreb funicular ride',
      'Croatian wine tasting',
      'Cafe culture immersion',
      'Upper Town walking tour',
      'Traditional Zagreb cuisine',
      'Street art exploration'
    ]),
    displayOrder: 23
  },
  {
    name: 'Split',
    slug: 'split',
    description: 'Split is a stunning Dalmatian coastal city built around the ancient Roman Diocletian\'s Palace. This UNESCO World Heritage site is a living monument where locals still reside within the palace walls. Combine ancient history with Mediterranean beaches, vibrant nightlife, and a gateway to Croatia\'s beautiful islands.',
    category: 'Coastal',
    region: 'Europe',
    heroImage: '/images/split.webp',
    gradient: 'from-cyan-500 to-cyan-700',
    attractions: JSON.stringify([
      {
        name: 'Diocletian\'s Palace',
        description: 'Ancient Roman palace and UNESCO World Heritage Site',
        image: '/images/split.webp',
        duration: '2-3 hours'
      },
      {
        name: 'Riva Promenade',
        description: 'Beautiful waterfront promenade with cafes and views',
        image: '/images/split.webp',
        duration: '1-2 hours'
      },
      {
        name: 'Cathedral of St. Domnius',
        description: 'One of the oldest cathedrals in the world still in use',
        image: '/images/split.webp',
        duration: '1 hour'
      },
      {
        name: 'Marjan Hill',
        description: 'Forested park peninsula with hiking trails and beaches',
        image: '/images/split.webp',
        duration: '2-3 hours'
      }
    ]),
    experiences: JSON.stringify([
      'Island hopping to Hvar and Brac',
      'Beach relaxation',
      'Fresh seafood dining',
      'Game of Thrones filming locations',
      'Traditional Dalmatian peka dinner',
      'Sunset watching from Marjan'
    ]),
    displayOrder: 24
  },
  {
    name: 'Dubrovnik',
    slug: 'dubrovnik',
    description: 'Dubrovnik, the Pearl of the Adriatic, is one of the world\'s most magnificent walled cities. Walking along its ancient walls overlooking the crystal-clear Adriatic Sea is an unforgettable experience. This UNESCO World Heritage Site perfectly preserves its medieval architecture while offering stunning beaches and vibrant culture.',
    category: 'Coastal',
    region: 'Europe',
    heroImage: '/images/dubrovnik.webp',
    gradient: 'from-orange-500 to-orange-700',
    attractions: JSON.stringify([
      {
        name: 'City Walls Walk',
        description: 'Walk the complete 2km circuit of ancient defensive walls',
        image: '/images/dubrovnik.webp',
        duration: '2-3 hours'
      },
      {
        name: 'Stradun',
        description: 'Limestone-paved main street lined with cafes and shops',
        image: '/images/dubrovnik.webp',
        duration: '1-2 hours'
      },
      {
        name: 'Fort Lovrijenac',
        description: 'Imposing fortress offering spectacular views of the old town',
        image: '/images/dubrovnik.webp',
        duration: '1 hour'
      },
      {
        name: 'Banje Beach',
        description: 'Popular pebble beach with stunning Old Town views',
        image: '/images/dubrovnik.webp',
        duration: 'Half day'
      }
    ]),
    experiences: JSON.stringify([
      'Game of Thrones tour',
      'Kayaking around the walls',
      'Cable car to Mount Srd',
      'Island hopping to Lokrum',
      'Fresh oysters in Ston',
      'Sunset from the city walls'
    ]),
    displayOrder: 25
  },
  {
    name: 'Helsinki',
    slug: 'helsinki',
    description: 'Helsinki, Finland\'s vibrant capital, is a city of design, nature, and Nordic cool. Surrounded by the Baltic Sea and dotted with islands, Helsinki seamlessly blends modern Scandinavian design with art nouveau architecture. Experience authentic Finnish sauna culture, innovative cuisine, and the unique Nordic lifestyle.',
    category: 'Cultural',
    region: 'Europe',
    heroImage: '/images/helsinki.webp',
    gradient: 'from-indigo-500 to-indigo-700',
    attractions: JSON.stringify([
      {
        name: 'Helsinki Cathedral',
        description: 'Iconic white neoclassical cathedral on Senate Square',
        image: '/images/helsinki.webp',
        duration: '1 hour'
      },
      {
        name: 'Suomenlinna Fortress',
        description: 'UNESCO World Heritage sea fortress on six islands',
        image: '/images/helsinki.webp',
        duration: '3-4 hours'
      },
      {
        name: 'Design District',
        description: 'Over 200 design shops, galleries, and studios',
        image: '/images/helsinki.webp',
        duration: '2-3 hours'
      },
      {
        name: 'Market Square',
        description: 'Waterfront market with local food and Finnish crafts',
        image: '/images/helsinki.webp',
        duration: '1-2 hours'
      }
    ]),
    experiences: JSON.stringify([
      'Traditional Finnish sauna',
      'Nordic cuisine tasting',
      'Island hopping by ferry',
      'Temppeliaukio Rock Church visit',
      'Finnish design shopping',
      'Baltic Sea cruise'
    ]),
    displayOrder: 26
  },
  {
    name: 'Finnish Lapland',
    slug: 'finnish-lapland',
    description: 'Finnish Lapland is a magical winter wonderland and the official home of Santa Claus. Experience the spectacular Northern Lights dancing across the Arctic sky, stay in a glass igloo, meet reindeer, and enjoy thrilling husky safaris. In summer, witness the midnight sun and pristine Arctic nature.',
    category: 'Adventure',
    region: 'Europe',
    heroImage: '/images/finland-aurora.webp',
    gradient: 'from-purple-500 to-purple-700',
    attractions: JSON.stringify([
      {
        name: 'Northern Lights',
        description: 'Witness the magical Aurora Borealis in the Arctic sky',
        image: '/images/finland-aurora.webp',
        duration: 'Evening'
      },
      {
        name: 'Santa Claus Village',
        description: 'Meet Santa Claus and cross the Arctic Circle',
        image: '/images/finland-aurora.webp',
        duration: '3-4 hours'
      },
      {
        name: 'Glass Igloo',
        description: 'Sleep under the Northern Lights in a heated glass dome',
        image: '/images/finland-aurora.webp',
        duration: 'Overnight'
      },
      {
        name: 'Husky Safari',
        description: 'Thrilling dog sled adventure through snowy forests',
        image: '/images/finland-aurora.webp',
        duration: '2-4 hours'
      }
    ]),
    experiences: JSON.stringify([
      'Aurora Borealis hunting',
      'Reindeer sleigh ride',
      'Ice fishing on frozen lakes',
      'Snowmobile safari',
      'Traditional Lappish dinner',
      'Arctic icebreaker cruise'
    ]),
    displayOrder: 27
  }
];

async function seedEuropeDestinations() {
  console.log('Starting Europe destination seeding...');

  for (const dest of europeDestinations) {
    try {
      const existing = await prisma.destination.findUnique({
        where: { slug: dest.slug }
      });

      if (existing) {
        // Update existing destination
        await prisma.destination.update({
          where: { slug: dest.slug },
          data: dest
        });
        console.log(`✓ Updated destination: ${dest.name}`);
      } else {
        // Create new destination
        await prisma.destination.create({
          data: dest
        });
        console.log(`✓ Created destination: ${dest.name}`);
      }
    } catch (error) {
      console.error(`✗ Error with destination ${dest.name}:`, error);
    }
  }

  console.log('Europe destination seeding completed!');
}

seedEuropeDestinations()
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
