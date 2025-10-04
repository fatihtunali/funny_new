import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/agent/', '/api/', '/dashboard/'],
      },
    ],
    sitemap: 'https://dreamdestinationturkey.com/sitemap.xml',
  };
}
