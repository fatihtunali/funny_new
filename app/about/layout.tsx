import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - Your Trusted Turkey Tour Operator",
  description: "Learn about Funny Tourism - 10+ years of creating unforgettable Turkey experiences. Licensed tour operator with expert local guides and 500+ happy travelers.",
  keywords: ["about Funny Tourism", "Turkey tour operator", "licensed Turkey tours", "professional tour guides Turkey"],
  openGraph: {
    title: "About Us - Your Trusted Turkey Tour Operator",
    description: "10+ years of creating unforgettable Turkey experiences with expert local guides.",
    url: "https://dreamdestinationturkey.com/about",
    type: "website"
  }
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
