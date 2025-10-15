import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function addCappadociaGuideBlog() {
  try {
    console.log('\n=== Adding Cappadocia Travel Guide Blog Post ===\n');

    const contentPath = path.join(process.cwd(), 'blog_cappadocia_guide.html');
    const content = fs.readFileSync(contentPath, 'utf-8');

    const existingPost = await prisma.blogPost.findUnique({
      where: { slug: 'cappadocia-travel-guide-2025' }
    });

    if (existingPost) {
      console.error('Blog post with slug "cappadocia-travel-guide-2025" already exists!');
      process.exit(1);
    }

    const blogPost = await prisma.blogPost.create({
      data: {
        title: 'Cappadocia Travel Guide 2025: Hot Air Balloons, Cave Hotels & More',
        slug: 'cappadocia-travel-guide-2025',
        excerpt: 'Complete Cappadocia guide 2025: Everything about the famous hot air balloon rides, best cave hotels, underground cities, valley hikes, tours, and insider tips for experiencing Turkey\'s most magical destination.',
        content: content,
        coverImage: '/images/Cappadocia.jpg',
        category: 'Destinations',
        tags: JSON.stringify([
          'Cappadocia guide',
          'Hot air balloon Turkey',
          'Cave hotels Cappadocia',
          'Cappadocia tours',
          'Goreme',
          'Underground cities',
          'Fairy chimneys',
          'Rose Valley',
          'Cappadocia hiking',
          'Turkey travel'
        ]),
        metaTitle: 'Cappadocia Travel Guide 2025 - Balloons, Cave Hotels & Complete Guide',
        metaDescription: 'Ultimate Cappadocia guide: Hot air balloon rides (tips & prices), best cave hotels, underground cities, valley hikes, Red/Green tours, where to stay, getting around, and expert tips for your Cappadocia adventure.',
        status: 'PUBLISHED',
        publishedAt: new Date(),
        authorName: 'Funny Tourism',
        isAIGenerated: false,
        views: 0
      }
    });

    console.log('\n✅ Cappadocia guide blog post created successfully!\n');
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

addCappadociaGuideBlog();
