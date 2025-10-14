const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const pkg = await prisma.package.findFirst({
    where: { packageId: '16' }
  });

  console.log('\n=== Package 16 Details ===');
  console.log('Title:', pkg.title);
  console.log('packageType:', pkg.packageType);
  console.log('slug:', pkg.slug);
  console.log('packageId:', pkg.packageId);

  await prisma.$disconnect();
}

check().catch(console.error);
