import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyTranslations() {
  console.log('🔍 Verifying Spanish translations in database...\n');

  const tours = await prisma.dailyTour.findMany({
    where: { isActive: true },
    select: {
      tourCode: true,
      title: true,
      titleEs: true,
      city: true
    },
    orderBy: { tourCode: 'asc' }
  });

  let translatedCount = 0;
  let missingCount = 0;

  console.log('Tour Code | English Title | Spanish Title | Has Translation');
  console.log('='.repeat(100));

  tours.forEach(tour => {
    const hasTranslation = !!tour.titleEs;
    if (hasTranslation) {
      translatedCount++;
      console.log(`${tour.tourCode.padEnd(10)} | ${tour.title.substring(0, 25).padEnd(25)} | ${(tour.titleEs || '').substring(0, 30).padEnd(30)} | ✅`);
    } else {
      missingCount++;
      console.log(`${tour.tourCode.padEnd(10)} | ${tour.title.substring(0, 25).padEnd(25)} | ${'[MISSING]'.padEnd(30)} | ❌`);
    }
  });

  console.log('='.repeat(100));
  console.log(`\n✅ Tours with Spanish translation: ${translatedCount}`);
  console.log(`❌ Tours missing Spanish translation: ${missingCount}`);
  console.log(`📊 Total active tours: ${tours.length}`);
  console.log(`📈 Translation coverage: ${((translatedCount / tours.length) * 100).toFixed(1)}%\n`);
}

verifyTranslations()
  .finally(() => prisma.$disconnect());
