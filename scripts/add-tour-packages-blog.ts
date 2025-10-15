import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function addTourPackagesBlog() {
  try {
    console.log('\n=== Adding Best Turkey Tour Packages Blog Post ===\n');

    const contentPath = path.join(process.cwd(), 'blog_tour_packages_guide.html');
    const content = fs.readFileSync(contentPath, 'utf-8');

    const existingPost = await prisma.blogPost.findUnique({
      where: { slug: 'best-turkey-tour-packages-2025' }
    });

    if (existingPost) {
      console.error('Blog post with slug "best-turkey-tour-packages-2025" already exists!');
      process.exit(1);
    }

    const blogPost = await prisma.blogPost.create({
      data: {
        title: 'Best Turkey Tour Packages 2025: How to Choose the Perfect Trip',
        slug: 'best-turkey-tour-packages-2025',
        excerpt: 'Complete guide to choosing the perfect Turkey tour package in 2025. Compare package types, popular itineraries, pricing, what\'s included, group vs private tours, and expert tips for booking the best value Turkey vacation.',
        content: content,
        coverImage: '/images/Cappadocia.jpg',
        category: 'Travel Tips',
        tags: JSON.stringify([
          'Turkey tour packages',
          'Turkey tours',
          'Turkey vacation packages',
          'Turkey group tours',
          'Turkey private tours',
          'Istanbul Cappadocia tours',
          'Turkey itinerary',
          'Best Turkey tours',
          'Turkey travel packages',
          'Turkey holiday packages'
        ]),
        metaTitle: 'Best Turkey Tour Packages 2025 - Complete Buying Guide & Comparison',
        metaDescription: 'Choose the perfect Turkey tour package: Compare types (hotel vs land-only), popular 7-14 day itineraries, pricing by hotel category, group vs private tours, what\'s included, booking tips, and how to get best value.',
        status: 'PUBLISHED',
        publishedAt: new Date(),
        authorName: 'Funny Tourism',
        isAIGenerated: false,
        views: 0
      }
    });

    console.log('\n✅ Turkey tour packages blog post created successfully!\n');
    console.log('Details:');
    console.log('  ID:', blogPost.id);
    console.log('  Title:', blogPost.title);
    console.log('  Slug:', blogPost.slug);
    console.log('\n📝 View at: https://funnytourism.com/blog/' + blogPost.slug + '\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error creating blog post:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

addTourPackagesBlog();
