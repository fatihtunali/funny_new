import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { ComparisonProvider } from "@/contexts/ComparisonContext";
import AnalyticsScripts, { GoogleTagManagerNoScript } from "@/components/AnalyticsScripts";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://funnytourism.com'),
  title: {
    default: "Funny Tourism - Turkey Tour Packages | Istanbul, Cappadocia & More",
    template: "%s | Funny Tourism"
  },
  description: "Explore Turkey with expertly curated tour packages. Visit Istanbul, Cappadocia, Ephesus, and Pamukkale with professional English-speaking guides. Book your dream Turkey vacation today!",
  keywords: ["Turkey tours", "Istanbul packages", "Cappadocia tours", "Turkey vacation", "Ephesus tours", "Pamukkale", "Turkey travel packages", "Turkey tourism", "guided tours Turkey", "Turkey holiday packages"],
  authors: [{ name: "Funny Tourism" }],
  creator: "Funny Tourism",
  publisher: "Funny Tourism",
  referrer: "origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://funnytourism.com',
    siteName: 'Funny Tourism',
    title: 'Funny Tourism - Turkey Tour Packages | Istanbul, Cappadocia & More',
    description: 'Explore Turkey with expertly curated tour packages. Visit Istanbul, Cappadocia, Ephesus, and Pamukkale with professional English-speaking guides.',
    images: [
      {
        url: '/images/IstanbulatNight.jpeg',
        width: 1200,
        height: 630,
        alt: 'Turkey Tours - Istanbul at Night',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Funny Tourism - Turkey Tour Packages',
    description: 'Explore Turkey with expertly curated tour packages. Visit Istanbul, Cappadocia, Ephesus, and more.',
    images: ['/images/IstanbulatNight.jpeg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/images/faviconfunny.png',
    shortcut: '/images/faviconfunny.png',
    apple: '/images/faviconfunny.png',
  },
  verification: {
    google: 'aUshT6plDed1SZKLMNFuyrEbqT2_GbdPOx6_cj43-8M',
    yandex: 'f61c938d7f6ad921',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Meta Pixel */}
        <script dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1223991011702108');
            fbq('track', 'PageView');
          `
        }} />
        <noscript>
          <Image height={1} width={1} style={{display: 'none'}}
            src="https://www.facebook.com/tr?id=1223991011702108&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>

        {/* Google Tag Manager + Google tag (gtag.js) */}
        <AnalyticsScripts />

        {/* Yandex.Metrika counter */}
        <script type="text/javascript" dangerouslySetInnerHTML={{
          __html: `
            (function(m,e,t,r,i,k,a){
              m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
            })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=104425825', 'ym');

            ym(104425825, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", accurateTrackBounce:true, trackLinks:true});
          `
        }} />
        <noscript>
          <div>
            <Image src="https://mc.yandex.ru/watch/104425825" width={1} height={1} style={{position: 'absolute', left: '-9999px'}} alt="" />
          </div>
        </noscript>

        {/* Brevo Tracker */}
        <script src="https://cdn.brevo.com/js/sdk-loader.js" async></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            // Version: 2.0
            window.Brevo = window.Brevo || [];
            Brevo.push([
              "init",
              {
                client_key: "f1xfsppxkuvkfuwuhbadwc3c"
              }
            ]);
          `
        }} />
      </head>
      <body className={inter.className}>
        <GoogleTagManagerNoScript />
        <WishlistProvider>
          <ComparisonProvider>
            {children}
          </ComparisonProvider>
        </WishlistProvider>
      </body>
    </html>
  );
}
