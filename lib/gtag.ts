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

// Conversion event: Quote Request Submitted
export const trackQuoteRequest = (value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: `${GA_ADS_ID}/J2dCCK_5i6gbEJXZ8tVB`,
      value: value || 50,
      currency: 'EUR',
    });
  }
};

// Conversion event: Package Booking Completed (Purchase)
export const trackPackageBooking = (value: number, transactionId?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: `${GA_ADS_ID}/gQ5FCJSXjKgbEJXZ8tVB`,
      value: value,
      currency: 'TRY',
      transaction_id: transactionId,
    });
  }
};

// Conversion event: Daily Tour Booking
export const trackDailyTourBooking = (value: number, transactionId?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: `${GA_ADS_ID}/1BJ0CIChjKgbEJXZ8tVB`,
      value: value,
      currency: 'EUR',
      transaction_id: transactionId,
    });
  }
};

// Conversion event: Transfer Booking
export const trackTransferBooking = (value: number, transactionId?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
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
