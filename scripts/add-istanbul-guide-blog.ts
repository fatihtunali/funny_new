import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function addIstanbulGuideBlog() {
  try {
    console.log('\n=== Adding Istanbul Travel Guide Blog Post ===\n');

    const contentPath = path.join(process.cwd(), 'blog_istanbul_guide.html');
    const content = fs.readFileSync(contentPath, 'utf-8');

    const existingPost = await prisma.blogPost.findUnique({
      where: { slug: 'istanbul-travel-guide-2025' }
    });

    if (existingPost) {
      console.error('Blog post with slug "istanbul-travel-guide-2025" already exists!');
      process.exit(1);
    }

    const blogPost = await prisma.blogPost.create({
      data: {
        title: 'Istanbul Travel Guide 2025: Complete City Guide & Things to Do',
        slug: 'istanbul-travel-guide-2025',
        excerpt: 'Discover Istanbul with our comprehensive 2025 guide. From Hagia Sophia to hidden gems, learn the best neighborhoods, where to eat, how to get around, and insider tips for experiencing the city where East meets West.',
        content: content,
        coverImage: '/images/IstanbulatNight.jpeg',
        category: 'Destinations',
        tags: JSON.stringify([
          'Istanbul guide',
          'Istanbul tourism',
          'Things to do Istanbul',
          'Istanbul attractions',
          'Istanbul neighborhoods',
          'Hagia Sophia',
          'Blue Mosque',
          'Topkapi Palace',
          'Bosphorus cruise',
          'Istanbul food'
        ]),
        metaTitle: 'Istanbul Travel Guide 2025 - Best Attractions, Food & Neighborhoods',
        metaDescription: 'Complete Istanbul guide 2025: Top attractions (Hagia Sophia, Blue Mosque, Topkapi Palace), best neighborhoods, where to eat, getting around, shopping, hamam experience, and insider tips from local experts.',
        status: 'PUBLISHED',
        publishedAt: new Date(),
        authorName: 'Funny Tourism',
        isAIGenerated: false,
        views: 0
      }
    });

    console.log('\n✅ Istanbul guide blog post created successfully!\n');
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

addIstanbulGuideBlog();
