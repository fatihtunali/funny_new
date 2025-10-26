import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Smart Trip Planner - AI-Powered Turkey Itinerary Generator | Funny Tourism',
  description: 'Create your perfect Turkey itinerary in minutes with our AI-powered Smart Trip Planner. Get personalized travel plans for Istanbul, Cappadocia, Ephesus, and more destinations with real prices, hotel recommendations, and daily activities.',
  keywords: [
    'Turkey trip planner',
    'Turkey itinerary generator',
    'AI travel planner Turkey',
    'Istanbul trip planner',
    'Cappadocia itinerary',
    'Turkey vacation planner',
    'custom Turkey tour',
    'personalized Turkey itinerary',
    'Turkey travel planning',
    'Turkey tour packages'
  ],
  openGraph: {
    title: 'Smart Trip Planner - Create Your Perfect Turkey Itinerary',
    description: 'Plan your dream Turkey vacation with AI-powered itinerary generation. Get personalized travel plans with real prices for Istanbul, Cappadocia, Ephesus, Pamukkale, and more.',
    type: 'website',
    url: 'https://funnytourism.com/smart-trip-planner',
    images: [
      {
        url: 'https://funnytourism.com/images/smart-trip-planner-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Smart Trip Planner - AI-Powered Turkey Travel Planning'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Smart Trip Planner - AI-Powered Turkey Itinerary Generator',
    description: 'Create your perfect Turkey itinerary in minutes with AI. Get personalized travel plans with real prices.',
    images: ['https://funnytourism.com/images/smart-trip-planner-og.jpg']
  },
  alternates: {
    canonical: 'https://funnytourism.com/smart-trip-planner'
  }
};

export default function SmartTripPlannerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
