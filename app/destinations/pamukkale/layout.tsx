import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pamukkale Tours - Cotton Castle & Hierapolis - Dream Destination Turkey",
  description: "Explore Pamukkale's stunning white travertine terraces and ancient Hierapolis ruins. UNESCO World Heritage Site. Natural thermal pools and historical wonders.",
  keywords: ["Pamukkale tours", "Cotton Castle", "Pamukkale Turkey", "white terraces", "Hierapolis", "thermal pools", "Pamukkale travertines", "UNESCO Turkey"],
  alternates: {
    canonical: 'https://funnytourism.com/destinations/pamukkale',
  },
  openGraph: {
    title: "Pamukkale Tours - Cotton Castle & Hierapolis",
    description: "Explore Pamukkale's stunning white travertine terraces and ancient Hierapolis ruins. UNESCO World Heritage Site.",
    url: "https://funnytourism.com/destinations/pamukkale",
    type: "website",
    images: [
      {
        url: "/images/PamukkaleTravertenler.jpg",
        width: 1200,
        height: 630,
        alt: "Pamukkale White Travertine Terraces"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Pamukkale Tours - Cotton Castle & Hierapolis",
    description: "Explore Pamukkale's stunning white travertine terraces and ancient Hierapolis ruins.",
    images: ["/images/PamukkaleTravertenler.jpg"]
  }
};

export default function PamukkaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
