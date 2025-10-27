import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your Turkey Itinerary | Funny Tourism',
  description: 'View your personalized Turkey travel itinerary with day-by-day plans, hotel recommendations, and real pricing. Book your dream Turkey vacation with confidence.',
  keywords: [
    'Turkey itinerary',
    'Turkey travel plan',
    'personalized Turkey tour',
    'Turkey vacation itinerary',
    'Istanbul Cappadocia itinerary',
    'Turkey trip details',
    'custom Turkey tour package',
    'Turkey travel guide'
  ],
  openGraph: {
    title: 'Your Personalized Turkey Travel Itinerary',
    description: 'View your custom Turkey itinerary with day-by-day plans, hotel details, and real pricing for your perfect vacation.',
    type: 'website',
    images: [
      {
        url: 'https://funnytourism.com/images/turkey-itinerary-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Personalized Turkey Travel Itinerary'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Your Personalized Turkey Travel Itinerary',
    description: 'View your custom Turkey itinerary with day-by-day plans and real pricing.',
    images: ['https://funnytourism.com/images/turkey-itinerary-og.jpg']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function ItineraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
