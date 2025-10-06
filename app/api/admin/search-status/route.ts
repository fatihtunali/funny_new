import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const TARGET_CITIES: Record<string, string[]> = {
  USA: ['New York', 'Los Angeles', 'Chicago', 'Washington DC', 'Miami', 'Boston', 'San Francisco'],
  UK: ['London', 'Manchester', 'Birmingham'],
  Canada: ['Toronto', 'Montreal', 'Vancouver'],
  Australia: ['Sydney', 'Melbourne'],
  Ireland: ['Dublin'],
  'New Zealand': ['Auckland'],
};

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const method = searchParams.get('method') || 'google-api';

    // Get all searched cities
    const searchedCities = await prisma.searchedCity.findMany({
      where: { method },
      orderBy: { searchedAt: 'desc' }
    });

    // Calculate total cities and searched cities per country
    const statusByCountry: Record<string, {
      total: number;
      searched: number;
      remaining: number;
      cities: { name: string; searched: boolean; searchedAt?: Date; leadsFound?: number }[];
    }> = {};

    for (const [country, cities] of Object.entries(TARGET_CITIES)) {
      statusByCountry[country] = {
        total: cities.length,
        searched: 0,
        remaining: cities.length,
        cities: cities.map(cityName => {
          const searched = searchedCities.find(
            sc => sc.city === cityName && sc.country === country
          );

          if (searched) {
            statusByCountry[country].searched++;
            statusByCountry[country].remaining--;
          }

          return {
            name: cityName,
            searched: !!searched,
            searchedAt: searched?.searchedAt,
            leadsFound: searched?.leadsFound
          };
        })
      };
    }

    // Overall stats
    const totalCities = Object.values(TARGET_CITIES).flat().length;
    const totalSearched = searchedCities.length;
    const totalRemaining = totalCities - totalSearched;

    return NextResponse.json({
      success: true,
      overall: {
        total: totalCities,
        searched: totalSearched,
        remaining: totalRemaining,
        percentage: Math.round((totalSearched / totalCities) * 100)
      },
      byCountry: statusByCountry
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to get search status';
    console.error('Search status error:', error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
