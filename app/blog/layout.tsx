import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Turkey Travel Blog - Tips, Guides & Stories | Dream Destination Turkey",
  description: "Read our Turkey travel blog for insider tips, destination guides, cultural insights, and travel stories. Expert advice for your perfect Turkey vacation.",
  keywords: ["Turkey travel blog", "Turkey travel tips", "Turkey guide", "Turkey travel advice", "Istanbul tips", "Cappadocia guide", "Turkey culture"],
  openGraph: {
    title: "Turkey Travel Blog - Tips, Guides & Stories",
    description: "Read our Turkey travel blog for insider tips, destination guides, cultural insights, and travel stories.",
    url: "https://dreamdestinationturkey.com/blog",
    type: "website",
    images: [
      {
        url: "/images/IstanbulatNight.jpeg",
        width: 1200,
        height: 630,
        alt: "Turkey Travel Blog"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Turkey Travel Blog - Tips, Guides & Stories",
    description: "Read our Turkey travel blog for insider tips, destination guides, cultural insights, and travel stories.",
    images: ["/images/IstanbulatNight.jpeg"]
  }
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
