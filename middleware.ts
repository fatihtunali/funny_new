import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

export default createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale,

  // Automatically detect locale from Accept-Language header
  localeDetection: true,

  // Prefix the default locale in the URL (e.g., /en/packages instead of /packages)
  // Set to 'as-needed' to only prefix non-default locales
  localePrefix: 'always',
});

export const config = {
  // Match all pathnames except for:
  // - /api routes (API endpoints)
  // - /admin routes (admin panel - not translated)
  // - /agent routes (B2B portal - not translated)
  // - /_next (Next.js internals)
  // - /_vercel (Vercel internals)
  // - Static files (images, fonts, etc.)
  matcher: [
    '/((?!api|admin|agent|_next|_vercel|.*\\..*).*)',
    // Include root
    '/',
    // Include paths with locale
    '/(en|es)/:path*',
  ],
};
