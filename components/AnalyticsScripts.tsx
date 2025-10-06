import Script from 'next/script';

import { GA_ADS_ID, GA_MEASUREMENT_ID } from '@/lib/gtag';
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || '';

const activeGtagIds = [GA_MEASUREMENT_ID, GA_ADS_ID].filter(Boolean);
const primaryGtagId = activeGtagIds[0];

function GoogleTag() {
  return (
    <Script
      id="google-gtag-init"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          ${activeGtagIds.map(tag => `gtag('config', '${tag}');`).join('\n          ')}
        `.trim(),
      }}
    />
  );
}

function GoogleTagLoader({ id }: { id: string }) {
  return (
    <Script
      id="google-gtag-loader"
      src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
      strategy="afterInteractive"
    />
  );
}

function GoogleTagManager() {
  if (!GTM_ID) return null;

  return (
    <Script
      id="google-tag-manager"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(w,d,s,l,i){
            w[l]=w[l]||[];
            w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
            var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),
              dl=l!='dataLayer'?'&l='+l:'';
            j.async=true;
            j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
            f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${GTM_ID}');
        `.trim(),
      }}
    />
  );
}

export function GoogleTagManagerNoScript() {
  if (!GTM_ID) return null;

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
      />
    </noscript>
  );
}

export default function AnalyticsScripts() {
  if (!primaryGtagId && !GTM_ID) {
    return null;
  }

  return (
    <>
      {GTM_ID ? <GoogleTagManager /> : null}
      {primaryGtagId ? (
        <>
          <GoogleTagLoader id={primaryGtagId} />
          <GoogleTag />
        </>
      ) : null}
    </>
  );
}
