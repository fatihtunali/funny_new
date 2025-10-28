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

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const metadata = {
    en: {
      title: "Funny Tourism - Turkey Tour Packages | Istanbul, Cappadocia & More",
      description: "Explore Turkey with expertly curated tour packages. Visit Istanbul, Cappadocia, Ephesus, and Pamukkale with professional English-speaking guides.",
    },
    es: {
      title: "Funny Tourism - Paquetes Turísticos en Turquía | Estambul, Capadocia y Más",
      description: "Explore Turquía con paquetes turísticos cuidadosamente seleccionados. Visite Estambul, Capadocia, Éfeso y Pamukkale con guías profesionales de habla inglesa.",
    },
  };

  const localeMetadata = metadata[locale as keyof typeof metadata] || metadata.en;

  return {
    title: {
      default: localeMetadata.title,
      template: "%s | Funny Tourism"
    },
    description: localeMetadata.description,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'en': '/en',
        'es': '/es',
        'x-default': '/en',
      },
    },
    openGraph: {
      title: localeMetadata.title,
      description: localeMetadata.description,
      url: `https://funnytourism.com/${locale}`,
      siteName: 'Funny Tourism',
      locale: locale === 'es' ? 'es_ES' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: localeMetadata.title,
      description: localeMetadata.description,
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
