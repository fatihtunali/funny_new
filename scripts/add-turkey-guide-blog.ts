import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function addTurkeyGuideBlog() {
  try {
    console.log('\n=== Adding Turkey Travel Guide Blog Post ===\n');

    // Read the HTML content
    const contentPath = path.join(process.cwd(), 'temp_blog_content.html');
    const content = fs.readFileSync(contentPath, 'utf-8');

    // Check if blog post with this slug already exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug: 'ultimate-turkey-travel-guide-2025' }
    });

    if (existingPost) {
      console.error('Blog post with slug "ultimate-turkey-travel-guide-2025" already exists!');
      console.log('Existing post ID:', existingPost.id);
      console.log('Would you like to update it? Delete it first if needed.');
      process.exit(1);
    }

    // Create the blog post
    const blogPost = await prisma.blogPost.create({
      data: {
        title: 'Ultimate Turkey Travel Guide 2025: Everything You Need to Know',
        slug: 'ultimate-turkey-travel-guide-2025',
        excerpt: 'Planning a trip to Turkey? This comprehensive 2025 travel guide covers the best destinations, when to visit, what to eat, budget tips, sample itineraries, and everything you need for an unforgettable Turkish adventure.',
        content: content,
        coverImage: '/images/IstanbulatNight.jpeg',
        category: 'Travel Tips',
        tags: JSON.stringify([
          'Turkey travel guide',
          'Turkey tourism',
          'Istanbul guide',
          'Cappadocia travel',
          'Turkey itinerary',
          'Turkey travel tips',
          'Turkey budget',
          'Turkish cuisine',
          'Best time to visit Turkey',
          'Turkey visa'
        ]),
        metaTitle: 'Ultimate Turkey Travel Guide 2025 - Complete Trip Planning Resource',
        metaDescription: 'Complete Turkey travel guide for 2025: best destinations (Istanbul, Cappadocia, Ephesus), when to visit, sample itineraries, budget tips, visa info, Turkish cuisine, cultural etiquette, and expert travel advice.',
        status: 'PUBLISHED',
        publishedAt: new Date(),
        authorName: 'Funny Tourism',
        isAIGenerated: false,
        views: 0
      }
    });

    console.log('\n✅ Blog post created successfully!\n');
    console.log('Details:');
    console.log('  ID:', blogPost.id);
    console.log('  Title:', blogPost.title);
    console.log('  Slug:', blogPost.slug);
    console.log('  Category:', blogPost.category);
    console.log('  Status:', blogPost.status);
    console.log('  Published:', blogPost.publishedAt);
    console.log('\n📝 View at: https://funnytourism.com/blog/' + blogPost.slug);
    console.log('🔧 Admin edit: https://funnytourism.com/admin/blog/edit/' + blogPost.id + '\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error creating blog post:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

addTurkeyGuideBlog();
