/**
 * Google Ads Conversion Tracking
 *
 * Track conversions for Google Ads campaigns
 * Conversion ID: AW-17628441749
 */

// Declare gtag function for TypeScript
declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
    dataLayer?: unknown[];
  }
}

// Google Ads Conversion ID
export const GA_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || 'AW-17628441749';

// Google Analytics Measurement ID (used by the shared gtag.js loader)
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-5FM0WYP1P4';

// Conversion event: Quote Request Submitted (Purchase - Inquiry Form)
export const trackQuoteRequest = (value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    // Google Ads conversion
    window.gtag('event', 'conversion', {
      send_to: `${GA_ADS_ID}/gQ5FCJSXjKgbEJXZ8tVB`,
      value: value || 5.0,
      currency: 'TRY',
    });

    // GA4 event for analytics
    window.gtag('event', 'generate_lead', {
      value: value || 5.0,
      currency: 'TRY',
    });
  }
};

// Conversion event: Package Booking Completed
export const trackPackageBooking = (value: number, transactionId?: string, packageTitle?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    // GA4 purchase event (for analytics & ecommerce tracking)
    window.gtag('event', 'purchase', {
      transaction_id: transactionId,
      value: value,
      currency: 'TRY',
      items: [{
        item_id: transactionId,
        item_name: packageTitle || 'Tour Package',
        item_category: 'Tour Package',
        price: value,
        quantity: 1
      }]
    });

    // Google Ads conversion (optional - create conversion action in Google Ads first)
    // Once you create a package booking conversion in Google Ads, uncomment and add label:
    // window.gtag('event', 'conversion', {
    //   send_to: `${GA_ADS_ID}/YOUR_PACKAGE_BOOKING_LABEL`,
    //   value: value,
    //   currency: 'TRY',
    //   transaction_id: transactionId,
    // });
  }
};

// Conversion event: Daily Tour Booking
export const trackDailyTourBooking = (value: number, transactionId?: string, tourName?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    // GA4 purchase event
    window.gtag('event', 'purchase', {
      transaction_id: transactionId,
      value: value,
      currency: 'EUR',
      items: [{
        item_id: transactionId,
        item_name: tourName || 'Daily Tour',
        item_category: 'Daily Tour',
        price: value,
        quantity: 1
      }]
    });

    // Google Ads conversion
    window.gtag('event', 'conversion', {
      send_to: `${GA_ADS_ID}/1BJ0CIChjKgbEJXZ8tVB`,
      value: value,
      currency: 'EUR',
      transaction_id: transactionId,
    });
  }
};

// Conversion event: Transfer Booking
export const trackTransferBooking = (value: number, transactionId?: string, transferRoute?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    // GA4 purchase event
    window.gtag('event', 'purchase', {
      transaction_id: transactionId,
      value: value,
      currency: 'EUR',
      items: [{
        item_id: transactionId,
        item_name: transferRoute || 'Transfer Service',
        item_category: 'Transfer',
        price: value,
        quantity: 1
      }]
    });

    // Google Ads conversion
    window.gtag('event', 'conversion', {
      send_to: `${GA_ADS_ID}/JNxvCNTLk6gbEJXZ8tVB`,
      value: value,
      currency: 'EUR',
      transaction_id: transactionId,
    });
  }
};

// General page view tracking for Google Ads
export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_ADS_ID, {
      page_path: url,
    });
  }
};

// Track phone call clicks
export const trackPhoneClick = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'phone_click', {
      event_category: 'Contact',
      event_label: 'Phone Number Click',
    });
  }
};

// Track WhatsApp clicks
export const trackWhatsAppClick = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'whatsapp_click', {
      event_category: 'Contact',
      event_label: 'WhatsApp Click',
    });
  }
};
