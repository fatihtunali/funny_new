import { PrismaClient, LocationType } from '@prisma/client';

const prisma = new PrismaClient();

// All Turkish airports + common destinations
const locations = [
  // MAJOR AIRPORTS
  { name: 'Istanbul Airport (IST)', code: 'IST', type: 'AIRPORT' as LocationType, region: 'Istanbul', city: 'Istanbul', displayOrder: 1 },
  { name: 'Sabiha Gökçen Airport (SAW)', code: 'SAW', type: 'AIRPORT' as LocationType, region: 'Istanbul', city: 'Istanbul', displayOrder: 2 },
  { name: 'Antalya Airport (AYT)', code: 'AYT', type: 'AIRPORT' as LocationType, region: 'Antalya', city: 'Antalya', displayOrder: 3 },
  { name: 'Ankara Esenboğa Airport (ESB)', code: 'ESB', type: 'AIRPORT' as LocationType, region: 'Central Anatolia', city: 'Ankara', displayOrder: 4 },
  { name: 'İzmir Adnan Menderes Airport (ADB)', code: 'ADB', type: 'AIRPORT' as LocationType, region: 'Aegean', city: 'Izmir', displayOrder: 5 },
  { name: 'Bodrum Milas Airport (BJV)', code: 'BJV', type: 'AIRPORT' as LocationType, region: 'Bodrum', city: 'Bodrum', displayOrder: 6 },
  { name: 'Dalaman Airport (DLM)', code: 'DLM', type: 'AIRPORT' as LocationType, region: 'Aegean', city: 'Dalaman', displayOrder: 7 },
  { name: 'Nevşehir Kapadokya Airport (NAV)', code: 'NAV', type: 'AIRPORT' as LocationType, region: 'Cappadocia', city: 'Nevşehir', displayOrder: 8 },
  { name: 'Kayseri Erkilet Airport (ASR)', code: 'ASR', type: 'AIRPORT' as LocationType, region: 'Cappadocia', city: 'Kayseri', displayOrder: 9 },

  // OTHER AIRPORTS
  { name: 'Trabzon Airport (TZX)', code: 'TZX', type: 'AIRPORT' as LocationType, region: 'Black Sea', city: 'Trabzon', displayOrder: 10 },
  { name: 'Adana Şakirpaşa Airport (ADA)', code: 'ADA', type: 'AIRPORT' as LocationType, region: 'Mediterranean', city: 'Adana', displayOrder: 11 },
  { name: 'Gaziantep Airport (GZT)', code: 'GZT', type: 'AIRPORT' as LocationType, region: 'Southeast Anatolia', city: 'Gaziantep', displayOrder: 12 },
  { name: 'Diyarbakır Airport (DIY)', code: 'DIY', type: 'AIRPORT' as LocationType, region: 'Southeast Anatolia', city: 'Diyarbakır', displayOrder: 13 },
  { name: 'Van Ferit Melen Airport (VAN)', code: 'VAN', type: 'AIRPORT' as LocationType, region: 'Eastern Anatolia', city: 'Van', displayOrder: 14 },
  { name: 'Erzurum Airport (ERZ)', code: 'ERZ', type: 'AIRPORT' as LocationType, region: 'Eastern Anatolia', city: 'Erzurum', displayOrder: 15 },
  { name: 'Samsun Çarşamba Airport (SZF)', code: 'SZF', type: 'AIRPORT' as LocationType, region: 'Black Sea', city: 'Samsun', displayOrder: 16 },
  { name: 'Denizli Çardak Airport (DNZ)', code: 'DNZ', type: 'AIRPORT' as LocationType, region: 'Aegean', city: 'Denizli', displayOrder: 17 },
  { name: 'Konya Airport (KYA)', code: 'KYA', type: 'AIRPORT' as LocationType, region: 'Central Anatolia', city: 'Konya', displayOrder: 18 },
  { name: 'Hatay Airport (HTY)', code: 'HTY', type: 'AIRPORT' as LocationType, region: 'Mediterranean', city: 'Hatay', displayOrder: 19 },
  { name: 'Şanlıurfa GAP Airport (GNY)', code: 'GNY', type: 'AIRPORT' as LocationType, region: 'Southeast Anatolia', city: 'Şanlıurfa', displayOrder: 20 },
  { name: 'Mardin Airport (MQM)', code: 'MQM', type: 'AIRPORT' as LocationType, region: 'Southeast Anatolia', city: 'Mardin', displayOrder: 21 },
  { name: 'Batman Airport (BAL)', code: 'BAL', type: 'AIRPORT' as LocationType, region: 'Southeast Anatolia', city: 'Batman', displayOrder: 22 },
  { name: 'Elazığ Airport (EZS)', code: 'EZS', type: 'AIRPORT' as LocationType, region: 'Eastern Anatolia', city: 'Elazığ', displayOrder: 23 },
  { name: 'Malatya Erhaç Airport (MLX)', code: 'MLX', type: 'AIRPORT' as LocationType, region: 'Eastern Anatolia', city: 'Malatya', displayOrder: 24 },
  { name: 'Kars Harakani Airport (KSY)', code: 'KSY', type: 'AIRPORT' as LocationType, region: 'Eastern Anatolia', city: 'Kars', displayOrder: 25 },
  { name: 'Ağrı Ahmed-i Hani Airport (AJI)', code: 'AJI', type: 'AIRPORT' as LocationType, region: 'Eastern Anatolia', city: 'Ağrı', displayOrder: 26 },
  { name: 'Muş Airport (MSR)', code: 'MSR', type: 'AIRPORT' as LocationType, region: 'Eastern Anatolia', city: 'Muş', displayOrder: 27 },
  { name: 'Siirt Airport (SXZ)', code: 'SXZ', type: 'AIRPORT' as LocationType, region: 'Southeast Anatolia', city: 'Siirt', displayOrder: 28 },
  { name: 'Şırnak Şerafettin Elçi Airport (NKT)', code: 'NKT', type: 'AIRPORT' as LocationType, region: 'Southeast Anatolia', city: 'Şırnak', displayOrder: 29 },
  { name: 'Hakkari Yüksekova Airport (YKO)', code: 'YKO', type: 'AIRPORT' as LocationType, region: 'Southeast Anatolia', city: 'Hakkari', displayOrder: 30 },
  { name: 'Bursa Yenişehir Airport (YEI)', code: 'YEI', type: 'AIRPORT' as LocationType, region: 'Marmara', city: 'Bursa', displayOrder: 31 },
  { name: 'Çanakkale Airport (CKZ)', code: 'CKZ', type: 'AIRPORT' as LocationType, region: 'Marmara', city: 'Çanakkale', displayOrder: 32 },
  { name: 'Balıkesir Koca Seyit Airport (EDO)', code: 'EDO', type: 'AIRPORT' as LocationType, region: 'Marmara', city: 'Balıkesir', displayOrder: 33 },
  { name: 'Tekirdağ Çorlu Airport (TEQ)', code: 'TEQ', type: 'AIRPORT' as LocationType, region: 'Marmara', city: 'Tekirdağ', displayOrder: 34 },
  { name: 'Zafer Airport (Kütahya/Afyon)', code: 'KZR', type: 'AIRPORT' as LocationType, region: 'Aegean', city: 'Kütahya', displayOrder: 35 },

  // ISTANBUL DESTINATIONS
  { name: 'Taksim', type: 'CITY_CENTER' as LocationType, region: 'Istanbul', city: 'Istanbul', displayOrder: 100 },
  { name: 'Sultanahmet', type: 'TOURIST_AREA' as LocationType, region: 'Istanbul', city: 'Istanbul', displayOrder: 101 },
  { name: 'Beyoğlu', type: 'CITY_CENTER' as LocationType, region: 'Istanbul', city: 'Istanbul', displayOrder: 102 },
  { name: 'Kadıköy', type: 'CITY_CENTER' as LocationType, region: 'Istanbul', city: 'Istanbul', displayOrder: 103 },
  { name: 'Beşiktaş', type: 'CITY_CENTER' as LocationType, region: 'Istanbul', city: 'Istanbul', displayOrder: 104 },
  { name: 'Şişli', type: 'CITY_CENTER' as LocationType, region: 'Istanbul', city: 'Istanbul', displayOrder: 105 },
  { name: 'Laleli Hotels', type: 'HOTEL_ZONE' as LocationType, region: 'Istanbul', city: 'Istanbul', displayOrder: 106 },
  { name: 'Aksaray Hotels', type: 'HOTEL_ZONE' as LocationType, region: 'Istanbul', city: 'Istanbul', displayOrder: 107 },

  // ANTALYA DESTINATIONS
  { name: 'Antalya City Center', type: 'CITY_CENTER' as LocationType, region: 'Antalya', city: 'Antalya', displayOrder: 200 },
  { name: 'Kaleiçi (Old Town)', type: 'TOURIST_AREA' as LocationType, region: 'Antalya', city: 'Antalya', displayOrder: 201 },
  { name: 'Lara Hotels', type: 'HOTEL_ZONE' as LocationType, region: 'Antalya', city: 'Antalya', displayOrder: 202 },
  { name: 'Konyaaltı Hotels', type: 'HOTEL_ZONE' as LocationType, region: 'Antalya', city: 'Antalya', displayOrder: 203 },
  { name: 'Belek Hotels', type: 'HOTEL_ZONE' as LocationType, region: 'Antalya', city: 'Belek', displayOrder: 204 },
  { name: 'Side Hotels', type: 'HOTEL_ZONE' as LocationType, region: 'Antalya', city: 'Side', displayOrder: 205 },
  { name: 'Alanya Hotels', type: 'HOTEL_ZONE' as LocationType, region: 'Antalya', city: 'Alanya', displayOrder: 206 },
  { name: 'Kemer Hotels', type: 'HOTEL_ZONE' as LocationType, region: 'Antalya', city: 'Kemer', displayOrder: 207 },

  // BODRUM DESTINATIONS
  { name: 'Bodrum City Center', type: 'CITY_CENTER' as LocationType, region: 'Bodrum', city: 'Bodrum', displayOrder: 300 },
  { name: 'Bodrum Marina', type: 'TOURIST_AREA' as LocationType, region: 'Bodrum', city: 'Bodrum', displayOrder: 301 },
  { name: 'Bodrum Hotels', type: 'HOTEL_ZONE' as LocationType, region: 'Bodrum', city: 'Bodrum', displayOrder: 302 },
  { name: 'Gümbet', type: 'TOURIST_AREA' as LocationType, region: 'Bodrum', city: 'Bodrum', displayOrder: 303 },
  { name: 'Bitez', type: 'TOURIST_AREA' as LocationType, region: 'Bodrum', city: 'Bodrum', displayOrder: 304 },
  { name: 'Turgutreis', type: 'TOURIST_AREA' as LocationType, region: 'Bodrum', city: 'Bodrum', displayOrder: 305 },

  // CAPPADOCIA DESTINATIONS
  { name: 'Göreme', type: 'TOURIST_AREA' as LocationType, region: 'Cappadocia', city: 'Nevşehir', displayOrder: 400 },
  { name: 'Ürgüp Hotels', type: 'HOTEL_ZONE' as LocationType, region: 'Cappadocia', city: 'Nevşehir', displayOrder: 401 },
  { name: 'Avanos', type: 'TOURIST_AREA' as LocationType, region: 'Cappadocia', city: 'Nevşehir', displayOrder: 402 },
  { name: 'Uçhisar', type: 'TOURIST_AREA' as LocationType, region: 'Cappadocia', city: 'Nevşehir', displayOrder: 403 },

  // AEGEAN COAST DESTINATIONS
  { name: 'Kuşadası Hotels', type: 'HOTEL_ZONE' as LocationType, region: 'Aegean', city: 'Kuşadası', displayOrder: 500 },
  { name: 'Kuşadası Port', type: 'CRUISE_PORT' as LocationType, region: 'Aegean', city: 'Kuşadası', displayOrder: 501 },
  { name: 'Pamukkale', type: 'TOURIST_AREA' as LocationType, region: 'Aegean', city: 'Denizli', displayOrder: 502 },
  { name: 'Selçuk (Ephesus)', type: 'TOURIST_AREA' as LocationType, region: 'Aegean', city: 'Izmir', displayOrder: 503 },
  { name: 'İzmir City Center', type: 'CITY_CENTER' as LocationType, region: 'Aegean', city: 'Izmir', displayOrder: 504 },
  { name: 'Çeşme Hotels', type: 'HOTEL_ZONE' as LocationType, region: 'Aegean', city: 'Izmir', displayOrder: 505 },
  { name: 'Alaçatı', type: 'TOURIST_AREA' as LocationType, region: 'Aegean', city: 'Izmir', displayOrder: 506 },
  { name: 'Fethiye Hotels', type: 'HOTEL_ZONE' as LocationType, region: 'Aegean', city: 'Fethiye', displayOrder: 507 },
  { name: 'Ölüdeniz', type: 'TOURIST_AREA' as LocationType, region: 'Aegean', city: 'Fethiye', displayOrder: 508 },
  { name: 'Marmaris Hotels', type: 'HOTEL_ZONE' as LocationType, region: 'Aegean', city: 'Marmaris', displayOrder: 509 },
  { name: 'Kalkan Hotels', type: 'HOTEL_ZONE' as LocationType, region: 'Aegean', city: 'Kalkan', displayOrder: 510 },
  { name: 'Kaş Hotels', type: 'HOTEL_ZONE' as LocationType, region: 'Aegean', city: 'Kaş', displayOrder: 511 },
];

async function main() {
  console.log('Seeding transfer locations...\n');

  let created = 0;
  let skipped = 0;

  for (const location of locations) {
    try {
      await prisma.transferLocation.create({
        data: location,
      });
      created++;
      console.log(`✓ Created: ${location.name} (${location.type})`);
    } catch (error: any) {
      if (error.code === 'P2002') {
        skipped++;
        console.log(`⊘ Skipped (already exists): ${location.name}`);
      } else {
        console.error(`✗ Error creating ${location.name}:`, error.message);
      }
    }
  }

  console.log(`\n✅ Seeding completed!`);
  console.log(`   - Created: ${created} locations`);
  console.log(`   - Skipped: ${skipped} locations`);
  console.log(`   - Total: ${locations.length} locations\n`);
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
