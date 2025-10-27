import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Funny Tourism",
  description: "Funny Tourism's terms and conditions. Read our booking policies, cancellation terms, and service conditions for Turkey tours and travel services.",
  keywords: ["terms and conditions", "booking policy", "cancellation policy", "Funny Tourism terms", "Turkey tours terms"],
  alternates: {
    canonical: 'https://funnytourism.com/terms',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
