import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getTourDetails() {
  const tours = await prisma.dailyTour.findMany({
    where: { isActive: true },
    select: {
      tourCode: true,
      title: true,
      description: true,
      included: true,
      notIncluded: true,
      notes: true,
      city: true
    },
    orderBy: { tourCode: 'asc' }
  });

  console.log('Active tours in database:');
  console.log('='.repeat(80));
  tours.forEach(t => {
    console.log(`\nTour Code: ${t.tourCode}`);
    console.log(`City: ${t.city}`);
    console.log(`Title: ${t.title}`);
    console.log(`Description: ${t.description?.substring(0, 100)}...`);
  });
  console.log('\n' + '='.repeat(80));
  console.log(`Total: ${tours.length} tours`);
}

getTourDetails()
  .finally(() => prisma.$disconnect());
