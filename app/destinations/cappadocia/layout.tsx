import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cappadocia Tours & Hot Air Balloon Rides - Dream Destination Turkey",
  description: "Discover Cappadocia's magical landscapes. Hot air balloon rides, fairy chimneys, underground cities, and cave hotels. Unforgettable Turkey adventure.",
  keywords: ["Cappadocia tours", "Cappadocia balloon", "hot air balloon Cappadocia", "Cappadocia travel", "fairy chimneys", "underground cities", "Cappadocia hotels", "Goreme"],
  openGraph: {
    title: "Cappadocia Tours & Hot Air Balloon Rides",
    description: "Discover Cappadocia's magical landscapes. Hot air balloon rides, fairy chimneys, underground cities, and cave hotels.",
    url: "https://funnytourism.com/destinations/cappadocia",
    type: "website",
    images: [
      {
        url: "/images/cappadociaballoonride.jpg",
        width: 1200,
        height: 630,
        alt: "Cappadocia Hot Air Balloons"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Cappadocia Tours & Hot Air Balloon Rides",
    description: "Discover Cappadocia's magical landscapes. Hot air balloon rides, fairy chimneys, underground cities, and cave hotels.",
    images: ["/images/cappadociaballoonride.jpg"]
  }
};

export default function CappadociaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
