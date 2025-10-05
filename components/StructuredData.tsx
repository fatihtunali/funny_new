import Script from 'next/script';

interface StructuredDataProps {
  data: Record<string, unknown>;
}

export default function StructuredData({ data }: StructuredDataProps) {
  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

interface PackageSchemaData {
  title: string;
  description: string;
  image: string;
  packageId: string;
  pricing: string | Record<string, unknown>;
}

// Helper function to generate Product schema for tour packages
export function generateTourPackageSchema(pkg: PackageSchemaData, baseUrl: string = 'https://dreamdestinationturkey.com') {
  // Extract min price
  let minPrice = 0;
  try {
    const pricing = typeof pkg.pricing === 'string' ? JSON.parse(pkg.pricing) : pkg.pricing;
    if (pricing?.paxTiers) {
      const tier6 = pricing.paxTiers['6']?.threestar?.double;
      if (tier6) minPrice = tier6;
      else {
        const tiers = Object.keys(pricing.paxTiers).map(Number).sort((a, b) => b - a);
        for (const tier of tiers) {
          const price = pricing.paxTiers[tier]?.threestar?.double;
          if (price) {
            minPrice = price;
            break;
          }
        }
      }
    } else if (pricing?.perPerson) {
      minPrice = pricing.perPerson;
    }
  } catch (e) {
    console.error('Error extracting price:', e);
  }

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": pkg.title,
    "description": pkg.description,
    "image": `${baseUrl}${pkg.image}`,
    "brand": {
      "@type": "Brand",
      "name": "Funny Tourism"
    },
    "offers": {
      "@type": "Offer",
      "url": `${baseUrl}/tours/hotels-packages/package/${pkg.packageId}`,
      "priceCurrency": "EUR",
      "price": minPrice.toString(),
      "availability": "https://schema.org/InStock",
      "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      "seller": {
        "@type": "Organization",
        "name": "Funny Tourism"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "500"
    }
  };
}

interface TouristTripSchemaData {
  title: string;
  description: string;
  image: string;
  destinations?: string;
  duration?: string;
}

// Generate TouristTrip schema (more specific for tours)
export function generateTouristTripSchema(pkg: TouristTripSchemaData, baseUrl: string = 'https://dreamdestinationturkey.com') {
  const destinations = pkg.destinations ? pkg.destinations.split(',').map((d: string) => d.trim()) : [];
  const duration = pkg.duration || '';

  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "name": pkg.title,
    "description": pkg.description,
    "image": `${baseUrl}${pkg.image}`,
    "touristType": "International tourists",
    "itinerary": destinations.map((dest: string) => ({
      "@type": "City",
      "name": dest
    })),
    "duration": duration,
    "provider": {
      "@type": "TouristInformationCenter",
      "name": "Funny Tourism",
      "url": baseUrl
    }
  };
}

// Generate Organization schema for homepage
export function generateOrganizationSchema(baseUrl: string = 'https://dreamdestinationturkey.com') {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": "Funny Tourism",
    "alternateName": "Dream Destination Turkey",
    "url": baseUrl,
    "logo": `${baseUrl}/images/FunnyLogo1.png`,
    "description": "Turkey tour operator offering expertly curated tour packages to Istanbul, Cappadocia, Ephesus, and more.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "TR"
    },
    "sameAs": [
      "https://www.facebook.com/funnytourism",
      "https://www.instagram.com/funnytourism"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "500"
    }
  };
}

// Generate BreadcrumbList schema
export function generateBreadcrumbSchema(items: { name: string; url: string }[], baseUrl: string = 'https://dreamdestinationturkey.com') {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `${baseUrl}${item.url}`
    }))
  };
}
