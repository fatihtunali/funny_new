import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get a Quote - Custom Turkey Tour Packages | Dream Destination Turkey",
  description: "Request a personalized Turkey tour quote. Tell us your preferences and we'll create a custom itinerary with the best prices. Free consultation.",
  keywords: ["Turkey tour quote", "custom Turkey package", "Turkey vacation quote", "personalized Turkey tour", "Turkey travel inquiry"],
  openGraph: {
    title: "Get a Quote - Custom Turkey Tour Packages",
    description: "Request a personalized Turkey tour quote. Tell us your preferences and we'll create a custom itinerary with the best prices.",
    url: "https://funnytourism.com/inquiry",
    type: "website",
    images: [
      {
        url: "/images/IstanbulatNight.jpeg",
        width: 1200,
        height: 630,
        alt: "Turkey Tour Inquiry"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Get a Quote - Custom Turkey Tour Packages",
    description: "Request a personalized Turkey tour quote. We'll create a custom itinerary with the best prices.",
    images: ["/images/IstanbulatNight.jpeg"]
  }
};

export default function InquiryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
