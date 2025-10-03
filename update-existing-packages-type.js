const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateExistingPackages() {
  try {
    // Update all existing packages to WITH_HOTEL type (they all have hotels since they were created before land-only support)
    const result = await prisma.package.updateMany({
      data: {
        packageType: 'WITH_HOTEL'
      }
    });

    console.log(`✓ Updated ${result.count} packages to WITH_HOTEL type`);

    // Show all packages
    const packages = await prisma.package.findMany({
      select: {
        packageId: true,
        title: true,
        packageType: true,
      },
      orderBy: { packageId: 'asc' }
    });

    console.log('\nAll packages:');
    packages.forEach(pkg => {
      console.log(`  ${pkg.packageId} - ${pkg.title} - Type: ${pkg.packageType}`);
    });

    console.log('\n✅ All existing packages updated successfully!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateExistingPackages();
