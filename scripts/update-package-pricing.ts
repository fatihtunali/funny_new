import prisma from '../lib/prisma';

async function main() {
  // B2B nett rates (what agents see)
  const b2bPricing = {
    threestar: {
      single: 450,
      double: 320,
      triple: 290
    },
    fourstar: {
      single: 580,
      double: 420,
      triple: 380
    },
    fivestar: {
      single: 750,
      double: 550,
      triple: 500
    }
  };

  // Public pricing with 20% markup
  const publicPricing = {
    threestar: {
      single: 540,  // 450 * 1.2
      double: 384,  // 320 * 1.2
      triple: 348   // 290 * 1.2
    },
    fourstar: {
      single: 696,  // 580 * 1.2
      double: 504,  // 420 * 1.2
      triple: 456   // 380 * 1.2
    },
    fivestar: {
      single: 900,  // 750 * 1.2
      double: 660,  // 550 * 1.2
      triple: 600   // 500 * 1.2
    }
  };

  const result = await prisma.package.update({
    where: { packageId: '01' },
    data: {
      pricing: JSON.stringify(publicPricing),
      b2bPricing: JSON.stringify(b2bPricing)
    }
  });

  console.log('✅ Updated package 01 with pricing:');
  console.log('B2B Pricing (for agents):', JSON.stringify(b2bPricing, null, 2));
  console.log('\nPublic Pricing (20% markup):', JSON.stringify(publicPricing, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
