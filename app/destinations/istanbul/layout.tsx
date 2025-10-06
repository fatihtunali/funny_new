import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Istanbul Tours & Travel Guide - Dream Destination Turkey",
  description: "Explore Istanbul with our expertly curated tours. Visit Hagia Sophia, Blue Mosque, Topkapi Palace, Grand Bazaar & more. Professional English-speaking guides included.",
  keywords: ["Istanbul tours", "Istanbul travel", "Istanbul packages", "Hagia Sophia", "Blue Mosque", "Topkapi Palace", "Grand Bazaar", "Istanbul guide", "Istanbul vacation"],
  openGraph: {
    title: "Istanbul Tours & Travel Guide",
    description: "Explore Istanbul with our expertly curated tours. Visit Hagia Sophia, Blue Mosque, Topkapi Palace, Grand Bazaar & more.",
    url: "https://funnytourism.com/destinations/istanbul",
    type: "website",
    images: [
      {
        url: "/images/IstanbulatNight.jpeg",
        width: 1200,
        height: 630,
        alt: "Istanbul at Night"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Istanbul Tours & Travel Guide",
    description: "Explore Istanbul with our expertly curated tours. Visit Hagia Sophia, Blue Mosque, Topkapi Palace, Grand Bazaar & more.",
    images: ["/images/IstanbulatNight.jpeg"]
  }
};

export default function IstanbulLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
