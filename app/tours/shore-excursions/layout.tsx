import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Turkey Shore Excursions - Cruise Port Tours | Dream Destination Turkey",
  description: "Book shore excursions in Turkey for cruise passengers. Port pickup from Istanbul, Kusadasi, Izmir, Bodrum & Antalya. Back-to-ship guarantee. Private & group tours.",
  keywords: ["Turkey shore excursions", "cruise excursions Turkey", "Istanbul port tours", "Kusadasi shore tours", "Ephesus cruise tours", "Turkey port pickup", "Mediterranean cruise tours"],
  openGraph: {
    title: "Turkey Shore Excursions - Cruise Port Tours",
    description: "Book shore excursions in Turkey for cruise passengers. Port pickup from Istanbul, Kusadasi, Izmir, Bodrum & Antalya. Back-to-ship guarantee.",
    url: "https://funnytourism.com/tours/shore-excursions",
    type: "website",
    images: [
      {
        url: "/images/IstanbulatNight.jpeg",
        width: 1200,
        height: 630,
        alt: "Turkey Shore Excursions"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Turkey Shore Excursions - Cruise Port Tours",
    description: "Book shore excursions in Turkey for cruise passengers. Port pickup, back-to-ship guarantee.",
    images: ["/images/IstanbulatNight.jpeg"]
  }
};

export default function ShoreExcursionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
