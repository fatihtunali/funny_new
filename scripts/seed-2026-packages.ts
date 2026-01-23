import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// We'll use a Python script to extract Word data and save as JSON
// Then this script reads the JSON and seeds the database

const prisma = new PrismaClient();

interface PackageData {
  packageId: string;
  title: string;
  slug: string;
  duration: string;
  description: string;
  packageType: 'WITH_HOTEL' | 'LAND_ONLY';
  tourType: 'SIC' | 'PRIVATE';
  transferType: 'PRIVATE' | 'SIC';
  destinations: string;
  itinerary: Array<{
    day: number;
    title: string;
    description: string;
    meals: string;
  }>;
  highlights: string[];
  included: string[];
  notIncluded: string[];
  information: string[];
  hotels: {
    threestar: string[];
    fourstar: string[];
    fivestar: string[];
  };
  pricing: {
    paxTiers: {
      [key: string]: {
        threestar: { double: number; singleSupplement: number };
        fourstar: { double: number; singleSupplement: number };
        fivestar: { double: number; singleSupplement: number };
      };
    };
    childRates: {
      age0to6: { threestar: number; fourstar: number; fivestar: number };
      age6to12: { threestar: number; fourstar: number; fivestar: number };
    };
  };
  image: string;
  region?: string;
  // Spanish translations
  titleEs?: string;
  descriptionEs?: string;
  itineraryEs?: Array<{
    day: number;
    title: string;
    description: string;
    meals: string;
  }>;
  highlightsEs?: string[];
  includedEs?: string[];
  notIncludedEs?: string[];
}

async function seedPackages() {
  // Read the extracted JSON data
  const dataPath = path.join(__dirname, '..', 'data', '2026-packages.json');

  if (!fs.existsSync(dataPath)) {
    console.error('Error: 2026-packages.json not found!');
    console.log('Please run the Python extraction script first:');
    console.log('  python scripts/extract-packages-from-word.py');
    process.exit(1);
  }

  const packages: PackageData[] = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  console.log(`Found ${packages.length} packages to import\n`);

  for (const pkg of packages) {
    try {
      // Check if package already exists
      const existing = await prisma.package.findFirst({
        where: {
          OR: [
            { packageId: pkg.packageId },
            { slug: pkg.slug }
          ]
        }
      });

      if (existing) {
        // Update existing package
        await prisma.package.update({
          where: { id: existing.id },
          data: {
            title: pkg.title,
            duration: pkg.duration,
            description: pkg.description,
            packageType: pkg.packageType,
            tourType: pkg.tourType,
            transferType: pkg.transferType,
            destinations: pkg.destinations,
            itinerary: JSON.stringify(pkg.itinerary),
            highlights: JSON.stringify(pkg.highlights),
            included: JSON.stringify(pkg.included),
            notIncluded: JSON.stringify(pkg.notIncluded),
            hotels: JSON.stringify(pkg.hotels),
            pricing: JSON.stringify(pkg.pricing),
            image: pkg.image,
            region: pkg.region || 'Turkey',
            isActive: true,
            updatedAt: new Date(),
            // Spanish translations
            titleEs: pkg.titleEs,
            descriptionEs: pkg.descriptionEs,
            itineraryEs: pkg.itineraryEs ? JSON.stringify(pkg.itineraryEs) : null,
            highlightsEs: pkg.highlightsEs ? JSON.stringify(pkg.highlightsEs) : null,
            includedEs: pkg.includedEs ? JSON.stringify(pkg.includedEs) : null,
            excludedEs: pkg.notIncludedEs ? JSON.stringify(pkg.notIncludedEs) : null,
          }
        });
        console.log(`Updated: ${pkg.title}`);
      } else {
        // Create new package
        await prisma.package.create({
          data: {
            packageId: pkg.packageId,
            title: pkg.title,
            slug: pkg.slug,
            duration: pkg.duration,
            description: pkg.description,
            packageType: pkg.packageType,
            tourType: pkg.tourType,
            transferType: pkg.transferType,
            destinations: pkg.destinations,
            itinerary: JSON.stringify(pkg.itinerary),
            highlights: JSON.stringify(pkg.highlights),
            included: JSON.stringify(pkg.included),
            notIncluded: JSON.stringify(pkg.notIncluded),
            hotels: JSON.stringify(pkg.hotels),
            pricing: JSON.stringify(pkg.pricing),
            image: pkg.image,
            region: pkg.region || 'Turkey',
            isActive: true,
            // Spanish translations
            titleEs: pkg.titleEs,
            descriptionEs: pkg.descriptionEs,
            itineraryEs: pkg.itineraryEs ? JSON.stringify(pkg.itineraryEs) : null,
            highlightsEs: pkg.highlightsEs ? JSON.stringify(pkg.highlightsEs) : null,
            includedEs: pkg.includedEs ? JSON.stringify(pkg.includedEs) : null,
            excludedEs: pkg.notIncludedEs ? JSON.stringify(pkg.notIncludedEs) : null,
          }
        });
        console.log(`Created: ${pkg.title}`);
      }
    } catch (error) {
      console.error(`Error with package ${pkg.packageId}: ${error}`);
    }
  }

  console.log('\n=== Seeding complete ===');
}

seedPackages()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
