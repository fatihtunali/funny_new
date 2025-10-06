import { PrismaClient } from '@prisma/client';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

const prisma = new PrismaClient();

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

const TARGET_CITIES: Record<string, string[]> = {
  USA: ['New York', 'Los Angeles', 'Chicago', 'Washington DC', 'Miami', 'Boston', 'San Francisco'],
  UK: ['London', 'Manchester', 'Birmingham'],
  Canada: ['Toronto', 'Montreal', 'Vancouver'],
  Australia: ['Sydney', 'Melbourne'],
  Ireland: ['Dublin'],
  'New Zealand': ['Auckland'],
};

interface ScrapedLead {
  companyName: string;
  email: string;
  phone: string | null;
  website: string | null;
  address: string | null;
  city: string;
  country: string;
}

function extractEmails(text: string): string[] {
  const matches = text.match(EMAIL_REGEX) || [];
  const invalid = ['example.com', 'domain.com', 'google.com', 'facebook.com', 'instagram.com'];
  return matches.filter(email =>
    !invalid.some(inv => email.toLowerCase().includes(inv))
  );
}

async function scrapeGoogleMaps(city: string, country: string): Promise<ScrapedLead[]> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  const searchQuery = `travel agency turkey tours ${city}`;
  const url = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`;

  console.log(`Scraping: ${url}`);

  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    // Wait for results to load
    await page.waitForSelector('div[role="article"]', { timeout: 10000 });

    // Scroll to load more results
    await page.evaluate(async () => {
      const scrollContainer = document.querySelector('div[role="feed"]');
      if (scrollContainer) {
        for (let i = 0; i < 3; i++) {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    });

    // Get all business listings
    const listings = await page.$$('div[role="article"]');
    console.log(`Found ${listings.length} listings`);

    const leads: ScrapedLead[] = [];

    for (let i = 0; i < Math.min(listings.length, 20); i++) {
      try {
        await listings[i].click();
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Extract business name
        const nameElement = await page.$('h1.DUwDvf');
        const companyName = nameElement ? await nameElement.evaluate(el => el.textContent) : null;

        if (!companyName) continue;

        // Extract phone
        const phoneElement = await page.$('button[data-item-id^="phone:"]');
        const phone = phoneElement ? await phoneElement.evaluate(el => el.getAttribute('data-item-id')?.replace('phone:tel:', '')) : null;

        // Extract website
        const websiteElement = await page.$('a[data-item-id="authority"]');
        const website = websiteElement ? await websiteElement.evaluate(el => el.href) : null;

        // Extract address
        const addressElement = await page.$('button[data-item-id^="address"]');
        const address = addressElement ? await addressElement.evaluate(el => el.getAttribute('aria-label')) : null;

        // Try to find email from website button text or any visible text
        const pageText = await page.evaluate(() => document.body.innerText);
        const emails = extractEmails(pageText);

        // If we found an email, save this lead
        if (emails.length > 0) {
          const lead: ScrapedLead = {
            companyName: companyName.trim(),
            email: emails[0],
            phone,
            website,
            address,
            city,
            country,
          };

          leads.push(lead);
          console.log(`✅ Found lead with email: ${companyName} - ${emails[0]}`);
        } else {
          console.log(`❌ Skipped (no email): ${companyName}`);
        }

      } catch (error) {
        console.error(`Error processing listing ${i}:`, error);
        continue;
      }
    }

    await browser.close();
    return leads;

  } catch (error) {
    await browser.close();
    throw error;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const countries = args[0] ? JSON.parse(args[0]) : ['USA'];
  const limit = args[1] ? parseInt(args[1]) : 5;

  const results: any[] = [];
  const breakdown: Record<string, number> = {};
  let totalScraped = 0;
  let withEmail = 0;
  let duplicates = 0;

  for (const country of countries) {
    const cities = TARGET_CITIES[country] || [];
    breakdown[country] = 0;

    // Limit cities based on user input
    const citiesToScrape = cities.slice(0, Math.ceil(limit / countries.length));

    for (const city of citiesToScrape) {
      console.log(`\n🔍 Scraping ${city}, ${country}...`);

      try {
        const leads = await scrapeGoogleMaps(city, country);
        totalScraped += leads.length;

        for (const lead of leads) {
          // Check for duplicate by email or company name
          const existing = await prisma.agentLead.findFirst({
            where: {
              OR: [
                { email: lead.email },
                { companyName: lead.companyName }
              ]
            }
          });

          if (existing) {
            duplicates++;
            console.log(`Duplicate: ${lead.companyName}`);
            continue;
          }

          // Save to database (only leads with emails!)
          await prisma.agentLead.create({
            data: {
              companyName: lead.companyName,
              email: lead.email,
              phone: lead.phone,
              website: lead.website,
              address: lead.address,
              city: lead.city,
              country: lead.country,
              source: 'google-maps',
              searchQuery: `travel agency turkey tours ${city}`,
              emailExtractionAttempted: true, // We already have the email
            }
          });

          withEmail++;
          breakdown[country]++;

          results.push({
            companyName: lead.companyName,
            email: lead.email,
            phone: lead.phone,
            website: lead.website,
            city: lead.city,
            country: lead.country,
          });
        }

        // Delay between cities to avoid detection
        await new Promise(resolve => setTimeout(resolve, 3000));

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`Error scraping ${city}:`, errorMessage);
        continue;
      }
    }
  }

  // Output results as JSON
  console.log('\n===RESULTS_START===');
  console.log(JSON.stringify({
    success: true,
    summary: {
      totalScraped,
      withEmail,
      duplicates,
      breakdown,
    },
    results: results.slice(0, 50),
  }));
  console.log('===RESULTS_END===');

  await prisma.$disconnect();
}

main().catch(error => {
  console.error('Scraping error:', error);
  console.log('\n===RESULTS_START===');
  console.log(JSON.stringify({
    success: false,
    error: error instanceof Error ? error.message : 'Unknown error'
  }));
  console.log('===RESULTS_END===');
  process.exit(1);
});
