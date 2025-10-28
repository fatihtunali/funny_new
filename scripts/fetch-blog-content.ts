import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const slugs = [
  'indian-restaurants-in-turkey',
  'turkey-visa-for-indians-2025',
  'turkey-tour-cost-from-india-2025',
  '10-day-turkey-itinerary-from-india',
  'ultimate-turkey-travel-guide-2025-everything-you-need-to-know',
  'istanbul-travel-guide-2025',
  'cappadocia-travel-guide-2025-hot-air-balloons-cave-hotels-more',
  'best-turkey-tour-packages-2025-how-to-choose-the-perfect-trip',
  'ephesus-ancient-turkey-complete-guide-to-historical-sites'
];

async function fetchContent() {
  for (const slug of slugs) {
    const post = await prisma.blogPost.findUnique({
      where: { slug },
      select: {
        title: true,
        excerpt: true,
        content: true
      }
    });

    if (post) {
      console.log('\n' + '='.repeat(80));
      console.log(`SLUG: ${slug}`);
      console.log('='.repeat(80));
      console.log(`TITLE: ${post.title}`);
      console.log(`\nEXCERPT: ${post.excerpt}`);
      console.log(`\nCONTENT LENGTH: ${post.content?.length || 0} characters`);
      console.log('='.repeat(80));
    }
  }

  await prisma.$disconnect();
}

fetchContent();
