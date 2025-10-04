import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Turkey Tour Packages - Hotels & Land Packages",
  description: "Browse all our Turkey tour packages. Filter by destination, duration, and price. Find the perfect Turkey vacation package for your needs.",
  keywords: ["Turkey packages", "Turkey tours", "all inclusive Turkey", "Turkey vacation packages", "Turkey holiday deals"],
  openGraph: {
    title: "All Turkey Tour Packages - Hotels & Land Packages",
    description: "Browse all our Turkey tour packages. Filter by destination, duration, and price.",
    url: "https://dreamdestinationturkey.com/packages",
    type: "website",
    images: [
      {
        url: "/images/IstanbulatNight.jpeg",
        width: 1200,
        height: 630,
        alt: "Turkey Tour Packages"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "All Turkey Tour Packages",
    description: "Browse all our Turkey tour packages. Filter by destination, duration, and price.",
    images: ["/images/IstanbulatNight.jpeg"]
  }
};

export default function PackagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
