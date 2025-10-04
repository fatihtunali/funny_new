import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Turkey Airport Transfers & Private Transportation | Dream Destination Turkey",
  description: "Book reliable airport transfers and private transportation in Turkey. Istanbul, Cappadocia, Antalya airports. Meet & greet service, comfortable vehicles, professional drivers.",
  keywords: ["Turkey airport transfers", "Istanbul airport transfer", "Cappadocia transfer", "Turkey private transfer", "airport taxi Turkey", "VIP transfer Turkey"],
  openGraph: {
    title: "Turkey Airport Transfers & Private Transportation",
    description: "Book reliable airport transfers and private transportation in Turkey. Meet & greet service, comfortable vehicles, professional drivers.",
    url: "https://dreamdestinationturkey.com/tours/transfers",
    type: "website",
    images: [
      {
        url: "/images/IstanbulatNight.jpeg",
        width: 1200,
        height: 630,
        alt: "Turkey Airport Transfers"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Turkey Airport Transfers & Private Transportation",
    description: "Book reliable airport transfers and private transportation in Turkey.",
    images: ["/images/IstanbulatNight.jpeg"]
  }
};

export default function TransfersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
