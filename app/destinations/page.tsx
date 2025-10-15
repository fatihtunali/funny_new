import prisma from '@/lib/prisma';
import DestinationsClient from '@/components/DestinationsClient';

interface AttractionType {
  name: string;
  description: string;
  image: string;
  duration: string;
}

// Revalidate every 60 seconds
export const revalidate = 60;

export default async function DestinationsPage() {
  // Fetch destinations from database
  const destinationsData = await prisma.destination.findMany({
    where: {
      isActive: true
    },
    orderBy: [
      { displayOrder: 'asc' },
      { name: 'asc' }
    ]
  });

  // Transform data for client component
  const destinations = destinationsData.map(dest => {
    const attractions = JSON.parse(dest.attractions) as AttractionType[];
    const attractionNames = attractions.map((a) => a.name).join(', ');

    return {
      name: dest.name,
      description: dest.description,
      slug: dest.slug,
      attractions: attractionNames,
      image: dest.heroImage,
      gradient: dest.gradient,
      category: dest.category,
      region: dest.region
    };
  });

  /* Old hardcoded data - keeping for reference
  const oldDestinations = [
    {
      name: 'Istanbul',
      description: 'Discover the magical city where East meets West, with its stunning mosques, vibrant bazaars, and scenic Bosphorus cruises',
      slug: 'istanbul',
      attractions: 'Blue Mosque, Hagia Sophia, Grand Bazaar, Topkapi Palace',
      image: '/images/BlueMosqueIstanbul6minarets.jpg',
      gradient: 'from-blue-500 to-blue-700',
      category: 'Historical',
      region: 'Marmara'
    },
    {
      name: 'Cappadocia',
      description: 'Experience the surreal landscape of fairy chimneys and take a breathtaking hot air balloon ride over this unique region',
      slug: 'cappadocia',
      attractions: 'Hot Air Balloons, Goreme, Underground Cities, Cave Hotels',
      image: '/images/cappadociaballoonride.jpg',
      gradient: 'from-orange-500 to-orange-700',
      category: 'Natural',
      region: 'Central Anatolia'
    },
    {
      name: 'Antalya',
      description: 'Enjoy the perfect blend of beautiful beaches, ancient ruins, and charming old town in this Mediterranean paradise',
      slug: 'antalya',
      attractions: 'Old Town (Kaleiçi), Düden Waterfalls, Ancient Ruins, Beautiful Beaches',
      image: '/images/AntalyaOldCity.jpg',
      gradient: 'from-cyan-500 to-cyan-700',
      category: 'Coastal',
      region: 'Mediterranean'
    },
    {
      name: 'Kusadasi',
      description: 'Vibrant coastal resort town, gateway to Ancient Ephesus with beautiful beaches and bustling bazaars',
      slug: 'kusadasi',
      attractions: 'Ancient Ephesus, House of Virgin Mary, Pigeon Island, Ladies Beach',
      image: '/images/MeryemAnaEvi.jpeg',
      gradient: 'from-blue-500 to-blue-700',
      category: 'Coastal',
      region: 'Aegean'
    },
    {
      name: 'Ephesus',
      description: 'Walk through history in one of the best-preserved ancient cities in the Mediterranean',
      slug: 'ephesus',
      attractions: 'Library of Celsus, Grand Theater, Temple of Artemis, Terrace Houses',
      image: '/images/Ephesus_Library.jpg',
      gradient: 'from-green-500 to-green-700',
      category: 'Historical',
      region: 'Aegean'
    },
    {
      name: 'Pamukkale',
      description: 'Marvel at the white travertine terraces and ancient spa of Hierapolis in this natural wonder of Turkey',
      slug: 'pamukkale',
      attractions: 'Travertine Terraces, Hierapolis, Thermal Pools, Cleopatra\'s Pool',
      image: '/images/PamukkaleTravertenler.jpg',
      gradient: 'from-purple-500 to-purple-700',
      category: 'Natural',
      region: 'Aegean'
    },
    {
      name: 'Fethiye',
      description: 'Experience thrilling paragliding adventures, beautiful beaches, and crystal clear waters in this coastal gem',
      slug: 'fethiye',
      attractions: 'Ölüdeniz Beach, Paragliding, Blue Lagoon, Butterfly Valley',
      image: '/images/fethiye-paragliding.jpg',
      gradient: 'from-teal-500 to-teal-700',
      category: 'Adventure',
      region: 'Mediterranean'
    },
    {
      name: 'Marmaris',
      description: 'Explore the beautiful marina, enjoy water sports, and discover the vibrant nightlife of this popular coastal resort',
      slug: 'marmaris',
      attractions: 'Marmaris Marina, Marmaris Castle, Beach Clubs, Boat Tours',
      image: '/images/FethiyeMarina.jpg',
      gradient: 'from-indigo-500 to-indigo-700',
      category: 'Coastal',
      region: 'Mediterranean'
    },
    {
      name: 'Bodrum',
      description: 'Visit the historic castle, relax on pristine beaches, and enjoy the vibrant atmosphere of this Aegean gem',
      slug: 'bodrum',
      attractions: 'Bodrum Castle, Ancient Theater, Windmills, Beach Clubs',
      image: '/images/antalyakekova.jpg',
      gradient: 'from-pink-500 to-pink-700',
      category: 'Coastal',
      region: 'Aegean'
    },
    {
      name: 'Izmir',
      description: 'Turkey\'s third-largest city offers ancient ruins, vibrant markets, and beautiful Aegean coastline with modern amenities',
      slug: 'izmir',
      attractions: 'Agora of Smyrna, Konak Square, Kordon Promenade, Kemeralti Bazaar',
      image: '/images/izmir.jpg',
      gradient: 'from-red-500 to-red-700',
      category: 'Historical',
      region: 'Aegean'
    },
    {
      name: 'Ankara',
      description: 'Turkey\'s capital city showcases modern Turkey alongside ancient Anatolian heritage and significant national monuments',
      slug: 'ankara',
      attractions: 'Anitkabir, Museum of Anatolian Civilizations, Ankara Castle, Atakule Tower',
      image: '/images/anitkabir.jpg',
      gradient: 'from-gray-600 to-gray-800',
      category: 'Cultural',
      region: 'Central Anatolia'
    },
    {
      name: 'Bursa',
      description: 'First Ottoman capital featuring stunning mosques, thermal baths, and access to Uludag ski resort',
      slug: 'bursa',
      attractions: 'Grand Mosque, Green Tomb, Uludag Mountain, Historic Silk Market',
      image: '/images/bursa.jpg',
      gradient: 'from-emerald-500 to-emerald-700',
      category: 'Historical',
      region: 'Marmara'
    },
    {
      name: 'Trabzon',
      description: 'Beautiful Black Sea city known for the stunning Sumela Monastery perched on mountain cliffs',
      slug: 'trabzon',
      attractions: 'Sumela Monastery, Uzungol Lake, Ataturk Pavilion, Trabzon Castle',
      image: '/images/trabzon.jpg',
      gradient: 'from-green-600 to-green-800',
      category: 'Natural',
      region: 'Black Sea'
    },
    {
      name: 'Konya',
      description: 'Spiritual center of Turkey, home to Rumi\'s mausoleum and the mesmerizing whirling dervishes ceremony',
      slug: 'konya',
      attractions: 'Mevlana Museum, Whirling Dervishes, Alaeddin Mosque, Ince Minare Museum',
      image: '/images/konya-mevlana.jpg',
      gradient: 'from-amber-600 to-amber-800',
      category: 'Cultural',
      region: 'Central Anatolia'
    },
    {
      name: 'Gallipoli',
      description: 'Historic WWI battleground offering moving memorials, cemeteries, and significant ANZAC heritage sites',
      slug: 'gallipoli',
      attractions: 'ANZAC Cove, Lone Pine Cemetery, Chunuk Bair, Turkish Martyrs Memorial',
      image: '/images/gallipoli.jpg',
      gradient: 'from-slate-600 to-slate-800',
      category: 'Historical',
      region: 'Marmara'
    },
    {
      name: 'Troy',
      description: 'Legendary ancient city of the Trojan War, UNESCO World Heritage Site with fascinating archaeological ruins',
      slug: 'troy',
      attractions: 'Trojan Horse Replica, Ancient City Ruins, Archaeological Museum, City Walls',
      image: '/images/pergamon.jpg',
      gradient: 'from-yellow-600 to-yellow-800',
      category: 'Historical',
      region: 'Marmara'
    },
    {
      name: 'Alanya',
      description: 'Popular Mediterranean resort with spectacular castle, beautiful beaches, and vibrant entertainment options',
      slug: 'alanya',
      attractions: 'Alanya Castle, Cleopatra Beach, Damlatas Cave, Red Tower',
      image: '/images/alanya.jpg',
      gradient: 'from-orange-600 to-orange-800',
      category: 'Coastal',
      region: 'Mediterranean'
    }
  ];
  */

  return <DestinationsClient destinations={destinations} />;
}
