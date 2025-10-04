import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - Get Your Free Turkey Tour Quote",
  description: "Contact Funny Tourism for personalized Turkey tour packages. Get a free quote, ask questions, or book your dream Turkey vacation. 24/7 customer support available.",
  keywords: ["contact Turkey tours", "Turkey tour inquiry", "book Turkey vacation", "Turkey tour quote"],
  openGraph: {
    title: "Contact Us - Get Your Free Turkey Tour Quote",
    description: "Contact Funny Tourism for personalized Turkey tour packages. Get a free quote and book your dream vacation.",
    url: "https://dreamdestinationturkey.com/contact",
    type: "website"
  }
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
