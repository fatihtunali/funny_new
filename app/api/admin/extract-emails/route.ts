import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import * as cheerio from 'cheerio';

const prisma = new PrismaClient();

// Email patterns
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

const CONTACT_PATHS = [
  '/contact',
  '/contact-us',
  '/about',
  '/about-us',
  '/get-in-touch',
  '/reach-us',
  '/contactus',
];

function isValidEmail(email: string): boolean {
  const invalid = [
    'example.com',
    'domain.com',
    'email.com',
    'yoursite.com',
    'sentry.io',
    'wixpress.com',
    '.png',
    '.jpg',
    '.gif',
    '.css',
    '.js',
  ];

  const lowerEmail = email.toLowerCase();

  if (invalid.some(inv => lowerEmail.includes(inv))) {
    return false;
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

async function fetchPage(url: string, timeout = 8000): Promise<string | null> {
  try {
    const response = await axios.get(url, {
      timeout,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      maxRedirects: 5,
      validateStatus: (status) => status >= 200 && status < 400,
    });

    return response.data;
  } catch {
    return null;
  }
}

function extractEmails(html: string): string[] {
  const $ = cheerio.load(html);

  $('script, style, noscript').remove();

  const text = $.text();
  const matches = text.match(EMAIL_REGEX) || [];

  const mailtoLinks = $('a[href^="mailto:"]').map((_, el) => {
    const href = $(el).attr('href') || '';
    return href.replace('mailto:', '').split('?')[0];
  }).get();

  const allEmails = [...matches, ...mailtoLinks];
  const uniqueEmails = Array.from(new Set(allEmails));
  const validEmails = uniqueEmails.filter(isValidEmail);

  return validEmails;
}

async function extractEmailFromWebsite(website: string): Promise<{ emails: string[]; source: string }> {
  const normalizedUrl = website.startsWith('http') ? website : `https://${website}`;

  try {
    const url = new URL(normalizedUrl);
    const baseUrl = `${url.protocol}//${url.host}`;

    // Try homepage
    let html = await fetchPage(baseUrl);

    if (html) {
      const emails = extractEmails(html);
      if (emails.length > 0) {
        return { emails, source: 'homepage' };
      }
    }

    // Try contact pages
    for (const path of CONTACT_PATHS) {
      const contactUrl = `${baseUrl}${path}`;
      html = await fetchPage(contactUrl, 6000);

      if (html) {
        const emails = extractEmails(html);
        if (emails.length > 0) {
          return { emails, source: `contact-page` };
        }
      }

      await new Promise(resolve => setTimeout(resolve, 500));
    }

    return { emails: [], source: 'not-found' };

  } catch {
    return { emails: [], source: 'invalid-url' };
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const { limit = 10 } = await request.json();

    // Get leads without emails that haven't been attempted yet
    const leads = await prisma.agentLead.findMany({
      where: {
        AND: [
          { email: null },
          { website: { not: null } },
          { website: { not: '' } },
          { emailExtractionAttempted: false }, // Skip already attempted
        ],
      },
      take: Math.min(limit, 100), // Max 100 at once
      orderBy: { discovered: 'desc' },
    });

    const results = [];
    let successCount = 0;

    for (const lead of leads) {
      const { emails, source } = await extractEmailFromWebsite(lead.website!);

      if (emails.length > 0) {
        // Update lead with email
        await prisma.agentLead.update({
          where: { id: lead.id },
          data: {
            email: emails[0],
            emailExtractionAttempted: true,
            notes: `Email extracted from ${source} on ${new Date().toISOString()}`,
          },
        });

        successCount++;

        results.push({
          companyName: lead.companyName,
          email: emails[0],
          source,
          city: lead.city,
          country: lead.country,
        });
      } else {
        // Mark as attempted even if no email found
        await prisma.agentLead.update({
          where: { id: lead.id },
          data: {
            emailExtractionAttempted: true,
            notes: `Email extraction attempted but not found on ${new Date().toISOString()}`,
          },
        });
      }

      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return NextResponse.json({
      success: true,
      processed: leads.length,
      emailsFound: successCount,
      successRate: ((successCount / leads.length) * 100).toFixed(1),
      results,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Email extraction failed';
    console.error('Email extraction error:', error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET() {
  try {
    await requireAdmin();

    // Get statistics
    const total = await prisma.agentLead.count();
    const withEmail = await prisma.agentLead.count({
      where: { email: { not: null } },
    });
    const withWebsite = await prisma.agentLead.count({
      where: {
        AND: [
          { website: { not: null } },
          { website: { not: '' } },
        ],
      },
    });
    const attempted = await prisma.agentLead.count({
      where: { emailExtractionAttempted: true },
    });
    const remaining = await prisma.agentLead.count({
      where: {
        AND: [
          { email: null },
          { website: { not: null } },
          { website: { not: '' } },
          { emailExtractionAttempted: false }, // Only count not-yet-attempted
        ],
      },
    });

    return NextResponse.json({
      success: true,
      stats: {
        total,
        withEmail,
        withWebsite,
        attempted,
        remaining,
        successRate: total > 0 ? ((withEmail / total) * 100).toFixed(1) : '0.0',
      },
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to get stats';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
