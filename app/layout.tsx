import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Funny Tourism - Turkey Tour Packages | Istanbul, Cappadocia & More",
  description: "Explore Turkey with expertly curated tour packages. Visit Istanbul, Cappadocia, Ephesus, and Pamukkale with professional English-speaking guides. Book your dream Turkey vacation today!",
  keywords: "Turkey tours, Istanbul packages, Cappadocia tours, Turkey vacation, Ephesus tours, Pamukkale, Turkey travel packages",
  icons: {
    icon: '/images/faviconfunny.png',
    shortcut: '/images/faviconfunny.png',
    apple: '/images/faviconfunny.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation />
        <main>{children}</main>
        <Footer />
        <WhatsAppWidget />
      </body>
    </html>
  );
}
