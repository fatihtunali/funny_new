const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  try {
    const packages = await prisma.package.findMany({
      select: {
        packageId: true,
        title: true,
        slug: true,
        image: true,
        pdfUrl: true,
        isActive: true
      },
      orderBy: { packageId: 'asc' }
    });

    console.log('Total packages:', packages.length);
    console.log('\nPackages:\n');
    packages.forEach(pkg => {
      console.log(`ID: ${pkg.packageId} | Title: ${pkg.title}`);
      console.log(`  Slug: ${pkg.slug}`);
      console.log(`  Image: ${pkg.image || 'MISSING'}`);
      console.log(`  PDF: ${pkg.pdfUrl || 'MISSING'}`);
      console.log(`  Active: ${pkg.isActive}`);
      console.log('---');
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
})();
