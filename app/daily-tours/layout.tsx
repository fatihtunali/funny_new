import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daily Tours in Turkey - Istanbul, Cappadocia & More | Dream Destination Turkey",
  description: "Explore Turkey with our daily tours. Full-day and half-day tours in Istanbul, Cappadocia, Ephesus & more. Professional guides, lunch & transfers included.",
  keywords: ["Turkey daily tours", "Istanbul day tours", "Cappadocia day tours", "Ephesus tours", "Turkey excursions", "guided daily tours Turkey"],
  openGraph: {
    title: "Daily Tours in Turkey - Istanbul, Cappadocia & More",
    description: "Explore Turkey with our daily tours. Full-day and half-day tours in Istanbul, Cappadocia, Ephesus & more.",
    url: "https://funnytourism.com/daily-tours",
    type: "website",
    images: [
      {
        url: "/images/IstanbulatNight.jpeg",
        width: 1200,
        height: 630,
        alt: "Turkey Daily Tours"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Daily Tours in Turkey",
    description: "Explore Turkey with our daily tours. Professional guides, lunch & transfers included.",
    images: ["/images/IstanbulatNight.jpeg"]
  }
};

export default function DailyToursLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
