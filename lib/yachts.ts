// Yacht data for Funny Tourism yacht charters section
// Connected to TravelQuoteBot for inquiries

export interface SeasonalPricing {
  aprilMay: number;
  juneSeptember: number;
  julyAugust: number;
  october: number;
}

export interface Yacht {
  id: string;
  slug: string;
  name: string;
  type: 'gulet' | 'motor-yacht' | 'sailing-yacht';
  length: number;
  beam: number;
  cabins: number;
  guests: number;
  crew: number;
  year: number;
  renovated?: number;
  engine?: string;
  cruisingSpeed?: string;
  fuelCapacity?: number;
  waterCapacity?: number;
  description: string;
  shortDescription: string;
  features: string[];
  amenities: string[];
  images: string[];
  thumbnail: string;
  pricePerDay?: SeasonalPricing;
  pricePerWeek?: {
    low: number;
    mid: number;
    high: number;
  };
  minDays: number;
  inclusions: string[];
  exclusions: string[];
  currency: 'EUR';
  available: boolean;
  tqbYachtId: number; // TravelQuoteBot yacht ID
}

export const yachts: Yacht[] = [
  {
    id: "holiday10",
    slug: "ms-holiday-10",
    name: "M/S Holiday 10",
    type: "gulet",
    length: 39,
    beam: 8.1,
    cabins: 10,
    guests: 22,
    crew: 5,
    year: 2005,
    renovated: 2017,
    engine: "2x MAN 500 HP",
    cruisingSpeed: "10-12 knots",
    fuelCapacity: 6000,
    waterCapacity: 5000,
    description: "M/S Holiday 10 is a magnificent 39-meter luxury gulet that perfectly combines traditional Turkish craftsmanship with modern comfort. With 10 elegant cabins, she comfortably accommodates up to 22 guests for an unforgettable blue cruise experience along Turkey's stunning coastline. Built in 2005 and renovated in 2017, Holiday 10 offers spacious sun decks, a stylish salon, and world-class amenities. Her experienced crew of 5-6 ensures impeccable service throughout your voyage, from gourmet Mediterranean cuisine to personalized excursions.",
    shortDescription: "39m luxury gulet with 10 cabins, perfect for groups up to 22 guests.",
    features: [
      "39m Length",
      "22 Guests",
      "10 Cabins",
      "5-6 Crew",
      "Built 2005",
      "Renovated 2017"
    ],
    amenities: [
      "Air Conditioning",
      "Generator",
      "WiFi",
      "TV/DVD",
      "Sound System",
      "Water Maker",
      "Ice Maker",
      "Snorkeling Equipment",
      "Fishing Equipment",
      "Kayak",
      "Paddleboard",
      "Sun Loungers",
      "Deck Shower",
      "BBQ"
    ],
    images: [
      "/images/yachts/holiday10/01.jpg",
      "/images/yachts/holiday10/02.jpg",
      "/images/yachts/holiday10/03.jpg",
      "/images/yachts/holiday10/04.jpg",
      "/images/yachts/holiday10/05.jpg"
    ],
    thumbnail: "/images/yachts/holiday10.jpg",
    pricePerDay: {
      aprilMay: 3500,
      juneSeptember: 4000,
      julyAugust: 4500,
      october: 3500,
    },
    minDays: 7,
    inclusions: [
      "Fuel",
      "Yacht charter, equipment and crew",
      "Clean linens, beach towels and bath towels",
      "Port taxes and permits",
      "Turkish transit log",
      "Fresh water",
      "Yacht insurance"
    ],
    exclusions: [
      "20% VAT",
      "Food and beverages (including crew)",
      "Airport transfers (available for extra fee)",
      "Motorized water sports equipment",
      "Göcek buoy and mooring fees"
    ],
    currency: "EUR",
    available: true,
    tqbYachtId: 1
  },
  {
    id: "holiday5",
    slug: "ms-holiday-5",
    name: "M/S Holiday 5",
    type: "gulet",
    length: 31,
    beam: 8,
    cabins: 10,
    guests: 20,
    crew: 4,
    year: 1995,
    renovated: 2025,
    engine: "2x 250 HP",
    fuelCapacity: 3000,
    waterCapacity: 4000,
    description: "M/S Holiday 5 is the impressive 31-meter flagship motor sailer of our fleet. With 10 spacious cabins (8 double and 2 twin), she accommodates up to 20 guests, making her ideal for large groups, family reunions, and corporate events. Completely renovated in 2025, Holiday 5 offers modern interiors, expansive deck areas with multiple dining and lounging spaces, and comprehensive water toys including kayaks and paddleboards. Her professional crew of 4 delivers exceptional service and authentic Turkish hospitality.",
    shortDescription: "31m flagship motor sailer with 10 cabins, perfect for large groups up to 20.",
    features: [
      "31m Length",
      "20 Guests",
      "10 Cabins",
      "4 Crew",
      "Built 1995",
      "Renovated 2025"
    ],
    amenities: [
      "Air Conditioning",
      "Generator",
      "WiFi",
      "TV",
      "Sound System",
      "Snorkeling Equipment",
      "2 Kayaks",
      "2 Paddleboards",
      "Sun Loungers",
      "Deck Shower",
      "BBQ",
      "Multiple Dining Areas"
    ],
    images: [
      "/images/yachts/holiday5/01.jpg",
      "/images/yachts/holiday5/02.jpg",
      "/images/yachts/holiday5/03.jpg",
      "/images/yachts/holiday5/04.jpg",
      "/images/yachts/holiday5/05.jpg"
    ],
    thumbnail: "/images/yachts/holiday5.jpg",
    pricePerDay: {
      aprilMay: 2250,
      juneSeptember: 2750,
      julyAugust: 3250,
      october: 2250,
    },
    minDays: 7,
    inclusions: [
      "Fuel",
      "Yacht charter, equipment and crew",
      "Clean linens, beach towels and bath towels",
      "Port taxes and permits",
      "Turkish transit log",
      "Fresh water",
      "Yacht insurance"
    ],
    exclusions: [
      "20% VAT",
      "Food and beverages (including crew)",
      "Airport transfers (available for extra fee)",
      "Motorized water sports equipment",
      "Göcek buoy and mooring fees"
    ],
    currency: "EUR",
    available: true,
    tqbYachtId: 2
  },
  {
    id: "holiday6",
    slug: "ms-holiday-6",
    name: "M/S Holiday 6",
    type: "gulet",
    length: 24,
    beam: 6.2,
    cabins: 4,
    guests: 8,
    crew: 3,
    year: 2019,
    description: "M/S Holiday 6 is a modern 24-meter gulet designed for comfort and style. With 4 well-appointed cabins, she comfortably accommodates up to 8 guests, making her perfect for small groups and families seeking a premium sailing experience. Built in 2019 with attention to every detail, Holiday 6 offers contemporary interiors, efficient deck layout, and state-of-the-art navigation equipment. Her dedicated crew of 3 provides personalized service and expert local knowledge.",
    shortDescription: "Modern 24m gulet with 4 cabins, ideal for families and small groups up to 8.",
    features: [
      "24m Length",
      "8 Guests",
      "4 Cabins",
      "3 Crew",
      "Built 2019"
    ],
    amenities: [
      "Air Conditioning",
      "Generator",
      "WiFi",
      "TV",
      "Sound System",
      "Snorkeling Equipment",
      "Kayak",
      "Sun Loungers",
      "Deck Shower",
      "BBQ"
    ],
    images: [
      "/images/yachts/holiday6/01.jpg",
      "/images/yachts/holiday6/02.jpg",
      "/images/yachts/holiday6/03.jpg",
      "/images/yachts/holiday6/04.jpg"
    ],
    thumbnail: "/images/yachts/holiday6.jpg",
    pricePerWeek: {
      low: 9000,
      mid: 12000,
      high: 16000,
    },
    minDays: 7,
    inclusions: [
      "Fuel",
      "Yacht charter, equipment and crew",
      "Clean linens, beach towels and bath towels",
      "Port taxes and permits",
      "Turkish transit log",
      "Fresh water",
      "Yacht insurance"
    ],
    exclusions: [
      "20% VAT",
      "Food and beverages (including crew)",
      "Airport transfers (available for extra fee)",
      "Motorized water sports equipment",
      "Göcek buoy and mooring fees"
    ],
    currency: "EUR",
    available: true,
    tqbYachtId: 3
  },
  {
    id: "holidaym",
    slug: "ms-holiday-m",
    name: "M/S Holiday M",
    type: "gulet",
    length: 15,
    beam: 5,
    cabins: 3,
    guests: 12,
    crew: 2,
    year: 2011,
    renovated: 2014,
    description: "M/S Holiday M is an elegant 15-meter gulet that combines traditional charm with modern refinement. Renovated in 2014, she accommodates up to 12 guests in 3 cabins, each designed with comfort and privacy in mind. Holiday M is ideal for daily tours, offering an intimate blue cruise experience with attention to detail. Her professional crew of 2 takes pride in delivering an exceptional charter experience.",
    shortDescription: "Elegant 15m gulet with 3 cabins, ideal for daily tours up to 12 guests.",
    features: [
      "15m Length",
      "12 Guests",
      "3 Cabins",
      "2 Crew",
      "Built 2011",
      "Renovated 2014"
    ],
    amenities: [
      "Sun Loungers",
      "Deck Shower",
      "BBQ",
      "Snorkeling Equipment",
      "Sound System",
      "Toilet"
    ],
    images: [
      "/images/yachts/holidayM/01.jpg",
      "/images/yachts/holidayM/02.jpg",
      "/images/yachts/holidayM/03.jpg"
    ],
    thumbnail: "/images/yachts/holidayM.jpg",
    pricePerDay: {
      aprilMay: 400,
      juneSeptember: 500,
      julyAugust: 600,
      october: 400,
    },
    minDays: 1,
    inclusions: [
      "Fuel",
      "Yacht charter, equipment and crew",
      "Fresh water",
      "Yacht insurance"
    ],
    exclusions: [
      "20% VAT",
      "Food and beverages",
      "Port fees (if applicable)"
    ],
    currency: "EUR",
    available: true,
    tqbYachtId: 4
  }
];

export function getYachtBySlug(slug: string): Yacht | undefined {
  return yachts.find((yacht) => yacht.slug === slug);
}

export function getYachtById(id: string): Yacht | undefined {
  return yachts.find((yacht) => yacht.id === id);
}

export function getAllYachts(): Yacht[] {
  return yachts.filter((yacht) => yacht.available);
}

export function getYachtPrice(yacht: Yacht): { price: number; period: string } {
  if (yacht.pricePerDay) {
    return { price: yacht.pricePerDay.aprilMay, period: 'day' };
  }
  if (yacht.pricePerWeek) {
    return { price: yacht.pricePerWeek.low, period: 'week' };
  }
  return { price: 0, period: 'day' };
}
