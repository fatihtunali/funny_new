import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

// Cities with direct flights to Istanbul
const TARGET_CITIES = {
  USA: ['New York', 'Los Angeles', 'Chicago', 'Washington DC', 'Miami', 'Boston', 'San Francisco'],
  UK: ['London', 'Manchester', 'Birmingham'],
  Canada: ['Toronto', 'Montreal', 'Vancouver'],
  Australia: ['Sydney', 'Melbourne'],
  Ireland: ['Dublin'],
  'New Zealand': ['Auckland'],
};

// Search query templates
const SEARCH_QUERIES = [
  'turkey tour packages',
  'turkey tours travel agency',
  'istanbul tours',
  'turkey vacation packages',
  'cappadocia tours',
  'turkey holiday specialist',
];

/**
 * Google Custom Search API Discovery
 *
 * Setup:
 * 1. Get API key: https://console.cloud.google.com/apis/credentials
 * 2. Create Custom Search Engine: https://programmablesearchengine.google.com/
 * 3. Add to .env:
 *    GOOGLE_SEARCH_API_KEY=your-api-key
 *    GOOGLE_SEARCH_ENGINE_ID=your-engine-id
 */
async function searchGoogleAPI(query: string, country: string): Promise<any[]> {
  const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
  const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;

  if (!apiKey || !searchEngineId) {
    console.log('⚠️  Google Search API not configured. Skipping API search.');
    console.log('   Add GOOGLE_SEARCH_API_KEY and GOOGLE_SEARCH_ENGINE_ID to .env');
    return [];
  }

  try {
    const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
      params: {
        key: apiKey,
        cx: searchEngineId,
        q: query,
        num: 10, // Max results per query
      }
    });

    return response.data.items || [];
  } catch (error: any) {
    console.error(`❌ Google API error: ${error.message}`);
    return [];
  }
}

/**
 * Extract company info from search result
 */
function extractLeadInfo(item: any, query: string, city: string, country: string) {
  const title = item.title || '';
  const snippet = item.snippet || '';
  const website = item.link || '';

  // Try to extract company name from title
  let companyName = title.split('|')[0].trim();
  companyName = companyName.split('-')[0].trim();

  return {
    companyName,
    website,
    city,
    country,
    source: 'google',
    searchQuery: query,
    notes: snippet.substring(0, 500),
  };
}

/**
 * Check if lead already exists
 */
async function leadExists(website: string): Promise<boolean> {
  const existing = await prisma.agentLead.findFirst({
    where: { website }
  });
  return !!existing;
}

/**
 * Save lead to database
 */
async function saveLead(leadData: any): Promise<boolean> {
  try {
    // Check if already exists
    if (leadData.website && await leadExists(leadData.website)) {
      return false; // Skip duplicate
    }

    await prisma.agentLead.create({
      data: leadData
    });

    return true;
  } catch (error) {
    console.error('Error saving lead:', error);
    return false;
  }
}

/**
 * Main discovery function
 */
async function discoverAgents() {
  console.log('\n🔍 Starting Agent Discovery...\n');

  let totalFound = 0;
  let totalSaved = 0;
  let totalSkipped = 0;

  // Loop through countries and cities
  for (const [country, cities] of Object.entries(TARGET_CITIES)) {
    console.log(`\n📍 Searching ${country}...\n`);

    for (const city of cities) {
      for (const queryTemplate of SEARCH_QUERIES) {
        const query = `${queryTemplate} ${city} ${country}`;
        console.log(`   🔎 ${query}`);

        // Search Google
        const results = await searchGoogleAPI(query, country);

        if (results.length === 0) {
          console.log('      No results (API not configured or quota exceeded)');
          continue;
        }

        // Process each result
        for (const item of results) {
          const leadInfo = extractLeadInfo(item, query, city, country);
          totalFound++;

          const saved = await saveLead(leadInfo);
          if (saved) {
            console.log(`      ✅ ${leadInfo.companyName}`);
            totalSaved++;
          } else {
            console.log(`      ⏭️  ${leadInfo.companyName} (duplicate)`);
            totalSkipped++;
          }
        }

        // Respect API rate limits (1 second between requests)
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }

  console.log('\n📊 Discovery Summary:');
  console.log(`   🔍 Total Found: ${totalFound}`);
  console.log(`   ✅ Saved: ${totalSaved}`);
  console.log(`   ⏭️  Skipped (duplicates): ${totalSkipped}\n`);
}

/**
 * Manual lead entry (for testing or manual adds)
 */
async function addManualLead() {
  const lead = {
    companyName: 'Test Travel Agency',
    email: 'info@testagency.com',
    phone: '+1-555-0123',
    website: 'https://testagency.com',
    address: '123 Main Street, New York, NY 10001',
    city: 'New York',
    country: 'USA',
    source: 'manual',
    searchQuery: null,
    notes: 'Manually added for testing',
  };

  const saved = await saveLead(lead);
  if (saved) {
    console.log('✅ Manual lead added successfully');
  } else {
    console.log('❌ Lead already exists');
  }
}

/**
 * View recent leads
 */
async function viewLeads(limit: number = 20) {
  const leads = await prisma.agentLead.findMany({
    take: limit,
    orderBy: { discovered: 'desc' }
  });

  console.log(`\n📋 Recent Leads (${leads.length}):\n`);

  leads.forEach((lead, index) => {
    console.log(`${index + 1}. ${lead.companyName}`);
    console.log(`   🌐 ${lead.website || 'No website'}`);
    console.log(`   📍 ${lead.city}, ${lead.country}`);
    console.log(`   📧 ${lead.email || 'No email'}`);
    console.log(`   📞 ${lead.phone || 'No phone'}`);
    console.log(`   📅 Found: ${lead.discovered.toLocaleDateString()}`);
    console.log('');
  });
}

/**
 * Export leads to CSV
 */
async function exportLeads() {
  const leads = await prisma.agentLead.findMany({
    where: { contacted: false },
    orderBy: { discovered: 'desc' }
  });

  console.log('companyName,email,phone,website,city,country,discovered');

  leads.forEach(lead => {
    console.log(
      `"${lead.companyName}","${lead.email || ''}","${lead.phone || ''}","${lead.website || ''}","${lead.city || ''}","${lead.country}","${lead.discovered.toISOString()}"`
    );
  });
}

// Run based on command
const command = process.argv[2] || 'discover';

async function main() {
  switch (command) {
    case 'discover':
      await discoverAgents();
      break;
    case 'manual':
      await addManualLead();
      break;
    case 'view':
      await viewLeads(20);
      break;
    case 'export':
      await exportLeads();
      break;
    default:
      console.log('Usage:');
      console.log('  npm run discover-agents          # Run discovery');
      console.log('  npm run discover-agents manual   # Add manual lead');
      console.log('  npm run discover-agents view     # View recent leads');
      console.log('  npm run discover-agents export   # Export to CSV');
  }

  await prisma.$disconnect();
}

main().catch(console.error);
