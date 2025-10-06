import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Turkey Land Packages - Tours Without Hotels | Dream Destination Turkey",
  description: "Book Turkey land-only packages. Professional tours with guide, transfers & entrance fees. Arrange your own accommodation. Flexible & affordable Turkey tours.",
  keywords: ["Turkey land packages", "Turkey tours without hotels", "land only Turkey", "Turkey tour services", "Turkey guided tours", "flexible Turkey packages"],
  openGraph: {
    title: "Turkey Land Packages - Tours Without Hotels",
    description: "Book Turkey land-only packages. Professional tours with guide, transfers & entrance fees. Arrange your own accommodation.",
    url: "https://funnytourism.com/tours/land-packages",
    type: "website",
    images: [
      {
        url: "/images/cappadociaballoonride.jpg",
        width: 1200,
        height: 630,
        alt: "Turkey Land Packages"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Turkey Land Packages - Tours Without Hotels",
    description: "Book Turkey land-only packages. Professional tours with guide, transfers & entrance fees.",
    images: ["/images/cappadociaballoonride.jpg"]
  }
};

export default function LandPackagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
