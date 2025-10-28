import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function listTours() {
  const tours = await prisma.dailyTour.findMany({
    where: { isActive: true },
    select: { tourCode: true, title: true },
    orderBy: { tourCode: 'asc' }
  });

  console.log('Active tours in database:');
  console.log('='.repeat(60));
  tours.forEach(t => console.log(`${t.tourCode}: ${t.title}`));
  console.log('='.repeat(60));
  console.log(`Total: ${tours.length} tours`);
}

listTours()
  .finally(() => prisma.$disconnect());
