import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

const TARGET_CITIES: Record<string, string[]> = {
  USA: ['New York', 'Los Angeles', 'Chicago', 'Washington DC', 'Miami', 'Boston', 'San Francisco'],
  UK: ['London', 'Manchester', 'Birmingham'],
  Canada: ['Toronto', 'Montreal', 'Vancouver'],
  Australia: ['Sydney', 'Melbourne'],
  Ireland: ['Dublin'],
  'New Zealand': ['Auckland'],
};

const SEARCH_QUERIES = [
  'turkey tour packages',
  'turkey tours travel agency',
  'istanbul tours',
  'turkey vacation packages',
  'cappadocia tours',
  'turkey holiday specialist',
];

interface SearchResult {
  title?: string;
  link: string;
}

async function searchGoogleAPI(query: string): Promise<SearchResult[]> {
  const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
  const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;

  if (!apiKey || !searchEngineId) {
    throw new Error('Google API credentials not configured');
  }

  try {
    const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
      params: {
        key: apiKey,
        cx: searchEngineId,
        q: query,
        num: 10,
      },
      timeout: 10000,
    });

    return response.data.items || [];
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 429) {
      throw new Error('Daily API quota exceeded. Please try again tomorrow.');
    }
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const { countries = ['USA', 'UK', 'Canada'], limit = 10 } = await request.json();

    interface DiscoveryResult {
      companyName: string;
      website: string;
      city: string;
      country: string;
      searchQuery: string;
    }

    const results: DiscoveryResult[] = [];
    const breakdown: Record<string, number> = {};
    let totalFound = 0;
    let newLeads = 0;
    let duplicates = 0;

    for (const country of countries) {
      const cities = TARGET_CITIES[country] || [];
      breakdown[country] = 0;

      for (const city of cities) {
        // Check if this city was already searched
        const alreadySearched = await prisma.searchedCity.findUnique({
          where: {
            city_country_method: {
              city,
              country,
              method: 'google-api'
            }
          }
        });

        if (alreadySearched) {
          console.log(`⏭️  Skipping ${city}, ${country} (already searched on ${alreadySearched.searchedAt.toLocaleDateString()})`);
          continue;
        }

        // Limit queries per city
        const queriesToUse = SEARCH_QUERIES.slice(0, Math.ceil(limit / cities.length));
        let cityLeadsFound = 0;

        for (const baseQuery of queriesToUse) {
          const query = `${baseQuery} ${city}`;

          try {
            const searchResults = await searchGoogleAPI(query);

            for (const item of searchResults) {
              const companyName = item.title?.replace(/[|-].*$/, '').trim() || 'Unknown';
              const website = item.link;

              if (!website || website.includes('facebook.com') || website.includes('tripadvisor')) {
                continue;
              }

              // Check for duplicate
              const existing = await prisma.agentLead.findFirst({
                where: {
                  OR: [
                    { website: website },
                    { companyName: companyName }
                  ]
                }
              });

              if (existing) {
                duplicates++;
                continue;
              }

              // Create new lead
              await prisma.agentLead.create({
                data: {
                  companyName,
                  website,
                  city,
                  country,
                  source: 'google',
                  searchQuery: query,
                }
              });

              results.push({
                companyName,
                website,
                city,
                country,
                searchQuery: query,
              });

              totalFound++;
              newLeads++;
              breakdown[country]++;
              cityLeadsFound++;
            }

            // Small delay between searches
            await new Promise(resolve => setTimeout(resolve, 1000));

          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.error(`Search error for "${query}":`, errorMessage);
            if (errorMessage.includes('quota')) {
              return NextResponse.json({
                success: false,
                error: 'Daily API quota exceeded. Please try again tomorrow.',
              }, { status: 429 });
            }
          }
        }

        // Mark this city as searched
        await prisma.searchedCity.create({
          data: {
            city,
            country,
            searchQuery: SEARCH_QUERIES.join(', '),
            method: 'google-api',
            leadsFound: cityLeadsFound,
          }
        });

        console.log(`✅ Completed ${city}, ${country} - Found ${cityLeadsFound} leads`);
      }
    }

    return NextResponse.json({
      success: true,
      summary: {
        totalFound,
        newLeads,
        duplicates,
        breakdown,
      },
      results: results.slice(0, 50), // Return first 50 for display
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Discovery failed';
    console.error('Agent discovery error:', error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
