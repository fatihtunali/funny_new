import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import * as cheerio from 'cheerio';

const prisma = new PrismaClient();

// Common email patterns
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

// Common contact page paths
const CONTACT_PATHS = [
  '/contact',
  '/contact-us',
  '/about',
  '/about-us',
  '/get-in-touch',
  '/reach-us',
  '/contactus',
];

interface EmailResult {
  leadId: string;
  companyName: string;
  website: string;
  emails: string[];
  source: string; // 'homepage' | 'contact-page' | 'about-page' | 'not-found'
}

/**
 * Clean and validate email address
 */
function isValidEmail(email: string): boolean {
  // Remove common false positives
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

  // Must have proper format
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

/**
 * Fetch HTML content from a URL with timeout and error handling
 */
async function fetchPage(url: string, timeout = 10000): Promise<string | null> {
  try {
    const response = await axios.get(url, {
      timeout,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      maxRedirects: 5,
      validateStatus: (status) => status >= 200 && status < 400,
    });

    return response.data;
  } catch (error: any) {
    if (error.code === 'ECONNABORTED') {
      console.log(`   ⏱️  Timeout: ${url}`);
    } else if (error.response) {
      console.log(`   ❌ HTTP ${error.response.status}: ${url}`);
    } else {
      console.log(`   ❌ Error: ${error.message}`);
    }
    return null;
  }
}

/**
 * Extract emails from HTML content
 */
function extractEmails(html: string): string[] {
  const $ = cheerio.load(html);

  // Remove script and style tags
  $('script, style, noscript').remove();

  // Get text content
  const text = $.text();

  // Find all email patterns
  const matches = text.match(EMAIL_REGEX) || [];

  // Also check mailto links
  const mailtoLinks = $('a[href^="mailto:"]').map((_, el) => {
    const href = $(el).attr('href') || '';
    return href.replace('mailto:', '').split('?')[0];
  }).get();

  // Combine and filter
  const allEmails = [...matches, ...mailtoLinks];
  const uniqueEmails = Array.from(new Set(allEmails));
  const validEmails = uniqueEmails.filter(isValidEmail);

  return validEmails;
}

/**
 * Try to extract email from a website
 */
async function extractEmailFromWebsite(website: string): Promise<{ emails: string[]; source: string }> {
  const normalizedUrl = website.startsWith('http') ? website : `https://${website}`;

  try {
    const url = new URL(normalizedUrl);
    const baseUrl = `${url.protocol}//${url.host}`;

    // Try homepage first
    console.log(`   🔍 Checking homepage: ${baseUrl}`);
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
      console.log(`   🔍 Checking: ${contactUrl}`);

      html = await fetchPage(contactUrl, 8000);

      if (html) {
        const emails = extractEmails(html);
        if (emails.length > 0) {
          return { emails, source: `contact-page (${path})` };
        }
      }

      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return { emails: [], source: 'not-found' };

  } catch (error: any) {
    console.log(`   ❌ Invalid URL: ${website}`);
    return { emails: [], source: 'invalid-url' };
  }
}

/**
 * Extract email for a single lead
 */
async function extractEmailForLead(lead: any): Promise<EmailResult> {
  console.log(`\n📧 Processing: ${lead.companyName} (${lead.city}, ${lead.country})`);
  console.log(`   Website: ${lead.website}`);

  const { emails, source } = await extractEmailFromWebsite(lead.website);

  if (emails.length > 0) {
    console.log(`   ✅ Found ${emails.length} email(s): ${emails.join(', ')}`);
  } else {
    console.log(`   ❌ No email found`);
  }

  return {
    leadId: lead.id,
    companyName: lead.companyName,
    website: lead.website,
    emails,
    source,
  };
}

/**
 * Update lead with extracted email
 */
async function updateLeadEmail(leadId: string, email: string): Promise<void> {
  await prisma.agentLead.update({
    where: { id: leadId },
    data: {
      email,
      notes: `Email extracted from website on ${new Date().toISOString()}`,
    },
  });
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  const limit = args[0] ? parseInt(args[0]) : 10;

  console.log(`\n🚀 Email Extraction Tool\n`);
  console.log(`📊 Extracting emails for up to ${limit} leads...\n`);

  // Get leads without emails that have websites
  const leads = await prisma.agentLead.findMany({
    where: {
      AND: [
        { email: null },
        { website: { not: null } },
        { website: { not: '' } },
      ],
    },
    take: limit,
    orderBy: { discovered: 'desc' },
  });

  console.log(`📋 Found ${leads.length} leads to process\n`);
  console.log('─'.repeat(80));

  const results: EmailResult[] = [];
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < leads.length; i++) {
    const lead = leads[i];

    try {
      const result = await extractEmailForLead(lead);
      results.push(result);

      // Update database with first valid email found
      if (result.emails.length > 0) {
        await updateLeadEmail(result.leadId, result.emails[0]);
        successCount++;
      } else {
        failCount++;
      }

      // Delay between leads to be respectful
      if (i < leads.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

    } catch (error: any) {
      console.log(`   ❌ Error processing lead: ${error.message}`);
      failCount++;
    }

    console.log('─'.repeat(80));
  }

  // Summary
  console.log(`\n📊 Extraction Summary:\n`);
  console.log(`   Total processed: ${leads.length}`);
  console.log(`   ✅ Emails found: ${successCount}`);
  console.log(`   ❌ No email found: ${failCount}`);
  console.log(`   Success rate: ${((successCount / leads.length) * 100).toFixed(1)}%\n`);

  // Show some examples
  const withEmails = results.filter(r => r.emails.length > 0).slice(0, 5);
  if (withEmails.length > 0) {
    console.log(`📧 Sample Results:\n`);
    withEmails.forEach(r => {
      console.log(`   ${r.companyName}`);
      console.log(`   📧 ${r.emails[0]}`);
      console.log(`   🔗 ${r.website}`);
      console.log(`   📍 Source: ${r.source}\n`);
    });
  }

  console.log(`✅ Email extraction complete!\n`);

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error('❌ Fatal error:', error);
  prisma.$disconnect();
  process.exit(1);
});
