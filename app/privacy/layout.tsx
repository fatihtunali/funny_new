import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Funny Tourism",
  description: "Funny Tourism's privacy policy. Learn how we collect, use, and protect your personal information when you use our Turkey tour services.",
  keywords: ["privacy policy", "data protection", "Funny Tourism privacy", "Turkey tours privacy"],
  alternates: {
    canonical: 'https://funnytourism.com/privacy',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
