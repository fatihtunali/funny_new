import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const transferRoutes = [
  // ========== ISTANBUL ==========
  {
    region: 'Istanbul',
    fromLocation: 'IST or SAW Airport',
    toLocation: 'Taksim',
    price1to2Pax: 120,
    price3to5Pax: 120,
    price6to10Pax: 140,
    onRequestOnly: false,
    vehicleType1to2: 'Sedan',
    vehicleType3to5: 'Minivan',
    vehicleType6to10: 'Minibus',
    duration: '45 minutes',
  },
  {
    region: 'Istanbul',
    fromLocation: 'IST or SAW Airport',
    toLocation: 'Sultanahmet',
    price1to2Pax: 120,
    price3to5Pax: 120,
    price6to10Pax: 140,
    onRequestOnly: false,
    vehicleType1to2: 'Sedan',
    vehicleType3to5: 'Minivan',
    vehicleType6to10: 'Minibus',
    duration: '45 minutes',
  },

  // ========== ANTALYA ==========
  {
    region: 'Antalya',
    fromLocation: 'Antalya Airport',
    toLocation: 'City Center',
    price1to2Pax: 70,
    price3to5Pax: 70,
    price6to10Pax: 100,
    onRequestOnly: false,
    vehicleType1to2: 'Sedan',
    vehicleType3to5: 'Minivan',
    vehicleType6to10: 'Minibus',
    duration: '30 minutes',
  },
  {
    region: 'Antalya',
    fromLocation: 'Antalya Airport',
    toLocation: 'Belek - Kundu',
    price1to2Pax: 90,
    price3to5Pax: 90,
    price6to10Pax: 120,
    onRequestOnly: false,
    vehicleType1to2: 'Sedan',
    vehicleType3to5: 'Minivan',
    vehicleType6to10: 'Minibus',
    duration: '40 minutes',
  },

  // ========== BODRUM ==========
  {
    region: 'Bodrum',
    fromLocation: 'Bodrum Airport',
    toLocation: 'Gümbet / Torba',
    price1to2Pax: 100,
    price3to5Pax: 100,
    price6to10Pax: 120,
    onRequestOnly: false,
    vehicleType1to2: 'Sedan',
    vehicleType3to5: 'Minivan',
    vehicleType6to10: 'Minibus',
    duration: '35 minutes',
  },
  {
    region: 'Bodrum',
    fromLocation: 'Bodrum Airport',
    toLocation: 'Türkbükü',
    price1to2Pax: 120,
    price3to5Pax: 120,
    price6to10Pax: 150,
    onRequestOnly: false,
    vehicleType1to2: 'Sedan',
    vehicleType3to5: 'Minivan',
    vehicleType6to10: 'Minibus',
    duration: '45 minutes',
  },
  {
    region: 'Bodrum',
    fromLocation: 'Bodrum Airport',
    toLocation: 'Yalıkavak',
    price1to2Pax: 120,
    price3to5Pax: 120,
    price6to10Pax: 150,
    onRequestOnly: false,
    vehicleType1to2: 'Sedan',
    vehicleType3to5: 'Minivan',
    vehicleType6to10: 'Minibus',
    duration: '45 minutes',
  },
  {
    region: 'Bodrum',
    fromLocation: 'Bodrum Airport',
    toLocation: 'Turgutreis',
    price1to2Pax: 120,
    price3to5Pax: 120,
    price6to10Pax: 150,
    onRequestOnly: false,
    vehicleType1to2: 'Sedan',
    vehicleType3to5: 'Minivan',
    vehicleType6to10: 'Minibus',
    duration: '50 minutes',
  },

  // ========== CAPPADOCIA ==========
  {
    region: 'Cappadocia',
    fromLocation: 'Nevşehir or Kayseri Airport',
    toLocation: 'Cappadocia',
    sicPricePerPerson: 30,
    price1to2Pax: 100,
    price3to5Pax: 100,
    price6to10Pax: 120,
    onRequestOnly: false,
    vehicleType1to2: 'Sedan',
    vehicleType3to5: 'Minivan',
    vehicleType6to10: 'Minibus',
    duration: '60 minutes',
  },

  // ========== KUSADASI / PAMUKKALE ==========
  {
    region: 'Kusadasi',
    fromLocation: 'Kusadasi City',
    toLocation: 'Kusadasi Port',
    price1to2Pax: 70,
    price3to5Pax: 70,
    price6to10Pax: 100,
    onRequestOnly: false,
    vehicleType1to2: 'Sedan',
    vehicleType3to5: 'Minivan (VITO)',
    vehicleType6to10: 'Minibus',
    duration: '15 minutes',
  },
  {
    region: 'Kusadasi',
    fromLocation: 'Izmir Airport (ADB)',
    toLocation: 'Kusadasi',
    price1to2Pax: 110,
    price3to5Pax: 110,
    price6to10Pax: 130,
    onRequestOnly: false,
    vehicleType1to2: 'Sedan',
    vehicleType3to5: 'Minivan (VITO)',
    vehicleType6to10: 'Minibus',
    duration: '75 minutes',
  },
  {
    region: 'Kusadasi',
    fromLocation: 'Izmir City',
    toLocation: 'Kusadasi',
    price1to2Pax: 110,
    price3to5Pax: 110,
    price6to10Pax: 130,
    onRequestOnly: false,
    vehicleType1to2: 'Sedan',
    vehicleType3to5: 'Minivan (VITO)',
    vehicleType6to10: 'Minibus',
    duration: '75 minutes',
  },
  {
    region: 'Kusadasi',
    fromLocation: 'Izmir Airport (ADB)',
    toLocation: 'Izmir',
    price1to2Pax: 85,
    price3to5Pax: 85,
    price6to10Pax: 100,
    onRequestOnly: false,
    vehicleType1to2: 'Sedan',
    vehicleType3to5: 'Minivan (VITO)',
    vehicleType6to10: 'Minibus',
    duration: '30 minutes',
  },
  {
    region: 'Pamukkale',
    fromLocation: 'Denizli Airport (DNZ)',
    toLocation: 'Pamukkale',
    price1to2Pax: 100,
    price3to5Pax: 100,
    price6to10Pax: 120,
    onRequestOnly: false,
    vehicleType1to2: 'Sedan',
    vehicleType3to5: 'Minivan (VITO)',
    vehicleType6to10: 'Minibus',
    duration: '60 minutes',
  },
];

async function main() {
  console.log('🚗 Starting transfer routes seeding...');

  // Clear existing transfers
  await prisma.transfer.deleteMany({});
  console.log('✓ Cleared existing transfer routes');

  // Seed new transfers
  for (const route of transferRoutes) {
    await prisma.transfer.create({
      data: route,
    });
  }

  console.log(`✓ Successfully seeded ${transferRoutes.length} transfer routes`);

  // Display summary by region
  const regions = await prisma.transfer.groupBy({
    by: ['region'],
    _count: true,
  });

  console.log('\n📊 Transfer Routes Summary:');
  for (const region of regions) {
    console.log(`   ${region.region}: ${region._count} routes`);
  }
}

main()
  .catch((e) => {
    console.error('❌ Error seeding transfers:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
