import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function addEphesusAncientTurkeyBlog() {
  try {
    console.log('\n=== Adding Ephesus & Ancient Turkey Blog Post ===\n');

    const contentPath = path.join(process.cwd(), 'blog_ephesus_ancient_turkey.html');
    const content = fs.readFileSync(contentPath, 'utf-8');

    const existingPost = await prisma.blogPost.findUnique({
      where: { slug: 'ephesus-ancient-turkey-guide-2025' }
    });

    if (existingPost) {
      console.error('Blog post with slug "ephesus-ancient-turkey-guide-2025" already exists!');
      process.exit(1);
    }

    const blogPost = await prisma.blogPost.create({
      data: {
        title: 'Ephesus & Ancient Turkey: Complete Guide to Historical Sites',
        slug: 'ephesus-ancient-turkey-guide-2025',
        excerpt: 'Complete guide to Turkey\'s ancient sites in 2025: Ephesus, Pamukkale, Troy, Pergamon, and more. Includes historical background, what to see, planning tips, shore excursions for cruise passengers, and expert touring advice.',
        content: content,
        coverImage: '/images/Ephesus.jpg',
        category: 'Destinations',
        tags: JSON.stringify([
          'Ephesus Turkey',
          'Ancient Turkey sites',
          'Turkey historical sites',
          'Ephesus guide',
          'Turkey archaeology',
          'Pamukkale',
          'Troy Turkey',
          'Pergamon',
          'Turkey ruins',
          'Shore excursions Turkey'
        ]),
        metaTitle: 'Ephesus & Ancient Turkey Guide 2025 - Historical Sites & Ruins',
        metaDescription: 'Complete guide to Turkey\'s ancient sites: Ephesus ruins, Library of Celsus, Pamukkale, Troy, Pergamon, Byzantine heritage. Includes visiting tips, shore excursions, best tours, and what to see at each site.',
        status: 'PUBLISHED',
        publishedAt: new Date(),
        authorName: 'Funny Tourism',
        isAIGenerated: false,
        views: 0
      }
    });

    console.log('\n✅ Ephesus & Ancient Turkey blog post created successfully!\n');
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

addEphesusAncientTurkeyBlog();
