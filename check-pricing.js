const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkPricing() {
  try {
    const count = await prisma.package.count({
      where: { packageType: 'LAND_ONLY' }
    });
    console.log(`Total LAND_ONLY packages: ${count}`);

    const packages = await prisma.package.findMany({
      where: {
        packageType: 'LAND_ONLY'
      },
      select: {
        packageId: true,
        packageType: true,
        isActive: true,
        pricing: true,
        b2bPricing: true,
      },
      take: 5
    });

    packages.forEach(pkg => {
      console.log(`\n=== Package ${pkg.packageId} (${pkg.packageType}) ===`);
      console.log('Regular pricing:', pkg.pricing);
      console.log('B2B pricing:', pkg.b2bPricing);
      if (pkg.pricing) {
        const parsed = JSON.parse(pkg.pricing);
        console.log('Parsed pricing keys:', Object.keys(parsed));
        console.log('Parsed pricing:', parsed);
      }
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPricing();
