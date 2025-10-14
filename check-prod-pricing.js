const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const land = await prisma.package.findFirst({
    where: {packageId: '16'}
  });
  console.log('\n=== LAND_ONLY (Package 16) ===');
  console.log(land.pricing);

  const hotel = await prisma.package.findFirst({
    where: {packageId: 'Q27'}
  });
  console.log('\n=== WITH_HOTEL (Package Q27) ===');
  console.log(hotel.pricing);

  await prisma.$disconnect();
}

check().catch(console.error);
