const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function list() {
  const pkgs = await prisma.package.findMany({
    where: {isActive: true},
    select: {packageId: true, title: true, packageType: true, pricing: true},
    orderBy: {packageId: 'asc'}
  });

  pkgs.forEach(p => {
    const pricing = p.pricing ? JSON.parse(p.pricing) : {};
    const keys = Object.keys(pricing);
    console.log(`${p.packageId} | ${p.packageType} | ${keys.join(',')}`);
  });

  await prisma.$disconnect();
}

list().catch(console.error);
