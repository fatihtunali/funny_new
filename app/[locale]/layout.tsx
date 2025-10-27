import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from "next";
import { locales } from '@/i18n';
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import ComparisonBar from "@/components/ComparisonBar";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: {
      default: "Funny Tourism - Turkey Tour Packages | Istanbul, Cappadocia & More",
      template: "%s | Funny Tourism"
    },
    description: "Explore Turkey with expertly curated tour packages. Visit Istanbul, Cappadocia, Ephesus, and Pamukkale with professional English-speaking guides.",
    alternates: {
      canonical: '/',
      languages: {
        'en': '/en',
        'es': '/es',
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as 'en' | 'es')) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <Navigation />
      <main>{children}</main>
      <Footer />
      <WhatsAppWidget />
      <ComparisonBar />
    </NextIntlClientProvider>
  );
}
