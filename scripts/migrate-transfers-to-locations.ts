import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting transfer migration to location-based system...\n');

  // Step 1: Get all existing transfers
  const existingTransfers = await prisma.transfer.findMany();
  console.log(`Found ${existingTransfers.length} existing transfers\n`);

  // Step 2: Extract unique locations from existing transfers
  const locationMap = new Map<string, {
    name: string;
    region: string;
    type: 'AIRPORT' | 'CITY_CENTER' | 'HOTEL_ZONE' | 'TOURIST_AREA' | 'CUSTOM';
  }>();

  existingTransfers.forEach(transfer => {
    const fromKey = `${transfer.region}|${transfer.fromLocation}`;
    const toKey = `${transfer.region}|${transfer.toLocation}`;

    if (!locationMap.has(fromKey)) {
      locationMap.set(fromKey, {
        name: transfer.fromLocation,
        region: transfer.region,
        type: transfer.fromLocation.toLowerCase().includes('airport') ? 'AIRPORT' :
              transfer.fromLocation.toLowerCase().includes('port') ? 'CRUISE_PORT' :
              transfer.fromLocation.toLowerCase().includes('hotel') ? 'HOTEL_ZONE' :
              transfer.fromLocation.toLowerCase().includes('center') ||
              transfer.fromLocation.toLowerCase().includes('taksim') ||
              transfer.fromLocation.toLowerCase().includes('sultanahmet') ? 'CITY_CENTER' : 'CUSTOM'
      });
    }

    if (!locationMap.has(toKey)) {
      locationMap.set(toKey, {
        name: transfer.toLocation,
        region: transfer.region,
        type: transfer.toLocation.toLowerCase().includes('airport') ? 'AIRPORT' :
              transfer.toLocation.toLowerCase().includes('port') ? 'CRUISE_PORT' :
              transfer.toLocation.toLowerCase().includes('hotel') ? 'HOTEL_ZONE' :
              transfer.toLocation.toLowerCase().includes('center') ||
              transfer.toLocation.toLowerCase().includes('taksim') ||
              transfer.toLocation.toLowerCase().includes('sultanahmet') ? 'CITY_CENTER' : 'CUSTOM'
      });
    }
  });

  console.log(`Identified ${locationMap.size} unique locations\n`);

  // Store this data to a JSON file for reference
  const migrationData = {
    locations: Array.from(locationMap.entries()).map(([key, data]) => ({
      key,
      ...data
    })),
    transfers: existingTransfers.map(t => ({
      id: t.id,
      fromKey: `${t.region}|${t.fromLocation}`,
      toKey: `${t.region}|${t.toLocation}`,
      ...t
    }))
  };

  const fs = require('fs');
  fs.writeFileSync(
    'scripts/transfer-migration-backup.json',
    JSON.stringify(migrationData, null, 2)
  );

  console.log('Migration data saved to scripts/transfer-migration-backup.json');
  console.log('\nNext steps:');
  console.log('1. Review the migration backup file');
  console.log('2. Run: npx prisma db push --force-reset (WARNING: This will delete all data)');
  console.log('3. Run: npx tsx scripts/restore-transfers-with-locations.ts');
  console.log('\nOr manually import locations and recreate transfers in the admin panel.');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
