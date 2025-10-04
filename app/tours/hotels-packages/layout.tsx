import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Turkey Hotel Packages - Multi-Day Tours with Accommodation",
  description: "Explore Turkey with our all-inclusive hotel packages. Visit Istanbul, Cappadocia, Ephesus & more. 3-star to 5-star hotels included. Professional guides, transfers & meals.",
  keywords: ["Turkey hotel packages", "Turkey all inclusive", "Istanbul Cappadocia tour", "Turkey vacation packages", "Turkey tour with hotels"],
  openGraph: {
    title: "Turkey Hotel Packages - Multi-Day Tours with Accommodation",
    description: "Explore Turkey with our all-inclusive hotel packages. Visit Istanbul, Cappadocia, Ephesus & more.",
    url: "https://dreamdestinationturkey.com/tours/hotels-packages",
    type: "website",
    images: [
      {
        url: "/images/cappadociaballoonride.jpg",
        width: 1200,
        height: 630,
        alt: "Turkey Hotel Packages"
      }
    ]
  }
};

export default function HotelPackagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
