import prisma from '../lib/prisma';

async function main() {
  // Single pricing for everyone (public, agents, PDFs)
  // Agents earn commission based on their commission rate
  const pricing = {
    threestar: {
      single: 540,
      double: 384,
      triple: 348
    },
    fourstar: {
      single: 696,
      double: 504,
      triple: 456
    },
    fivestar: {
      single: 900,
      double: 660,
      triple: 600
    }
  };

  const result = await prisma.package.update({
    where: { packageId: '01' },
    data: {
      pricing: JSON.stringify(pricing)
    }
  });

  console.log('✅ Updated package 01 with single pricing:');
  console.log('Pricing (same for everyone):', JSON.stringify(pricing, null, 2));
  console.log('\nExample commission calculation:');
  console.log('- Package price: €504 (4-star double)');
  console.log('- Agent with 15% commission earns: €' + (504 * 0.15).toFixed(2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
