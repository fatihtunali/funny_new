import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function addTurkishFoodGuideBlog() {
  try {
    console.log('\n=== Adding Turkish Food Guide Blog Post ===\n');

    const contentPath = path.join(process.cwd(), 'blog_turkish_food_guide.html');
    const content = fs.readFileSync(contentPath, 'utf-8');

    const existingPost = await prisma.blogPost.findUnique({
      where: { slug: 'turkish-food-guide-2025' }
    });

    if (existingPost) {
      console.error('Blog post with slug "turkish-food-guide-2025" already exists!');
      process.exit(1);
    }

    const blogPost = await prisma.blogPost.create({
      data: {
        title: 'Turkish Food Guide 2025: What to Eat & Where to Find It',
        slug: 'turkish-food-guide-2025',
        excerpt: 'Complete Turkish cuisine guide 2025: Must-try dishes, street food, breakfast culture, regional specialties, best restaurants, Turkish drinks, food etiquette, and everything you need to eat your way through Turkey like a local.',
        content: content,
        coverImage: '/images/IstanbulatNight.jpeg',
        category: 'Food & Dining',
        tags: JSON.stringify([
          'Turkish food',
          'Turkish cuisine',
          'Turkey food guide',
          'Turkish breakfast',
          'Turkish street food',
          'Turkish desserts',
          'Istanbul restaurants',
          'Turkish dishes',
          'What to eat in Turkey',
          'Turkish cooking'
        ]),
        metaTitle: 'Turkish Food Guide 2025 - Complete Cuisine & Dining Guide',
        metaDescription: 'Ultimate Turkish food guide: Must-try dishes (beyond kebabs!), Turkish breakfast culture, street food, regional specialties, best restaurants, Turkish drinks (tea, coffee, rakı), desserts, food etiquette, and culinary experiences.',
        status: 'PUBLISHED',
        publishedAt: new Date(),
        authorName: 'Funny Tourism',
        isAIGenerated: false,
        views: 0
      }
    });

    console.log('\n✅ Turkish food guide blog post created successfully!\n');
    console.log('Details:');
    console.log('  ID:', blogPost.id);
    console.log('  Title:', blogPost.title);
    console.log('  Slug:', blogPost.slug);
    console.log('\n📝 View at: https://funnytourism.com/blog/' + blogPost.slug + '\n');
    console.log('🎉 ALL 5 BLOG POSTS COMPLETED! 🎉\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error creating blog post:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

addTurkishFoodGuideBlog();
