import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ephesus Ancient City Tours - Dream Destination Turkey",
  description: "Visit Ephesus, one of the world's best-preserved ancient cities. See the Library of Celsus, Great Theatre, Temple of Artemis & House of Virgin Mary.",
  keywords: ["Ephesus tours", "Ephesus ancient city", "Library of Celsus", "Ephesus Turkey", "ancient Ephesus", "House of Virgin Mary", "Ephesus ruins"],
  openGraph: {
    title: "Ephesus Ancient City Tours",
    description: "Visit Ephesus, one of the world's best-preserved ancient cities. See the Library of Celsus, Great Theatre, Temple of Artemis & House of Virgin Mary.",
    url: "https://funnytourism.com/destinations/ephesus",
    type: "website",
    images: [
      {
        url: "/images/ephesus.jpg",
        width: 1200,
        height: 630,
        alt: "Library of Celsus, Ephesus"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Ephesus Ancient City Tours",
    description: "Visit Ephesus, one of the world's best-preserved ancient cities.",
    images: ["/images/ephesus.jpg"]
  }
};

export default function EphesusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
