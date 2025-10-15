import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function updateTurkeyBlogStyling() {
  try {
    console.log('\n=== Updating Turkey Travel Guide Blog Post Styling ===\n');

    // Read the styled HTML content
    const contentPath = path.join(process.cwd(), 'temp_blog_content_styled.html');
    const content = fs.readFileSync(contentPath, 'utf-8');

    // Find and update the blog post
    const updated = await prisma.blogPost.update({
      where: {
        slug: 'ultimate-turkey-travel-guide-2025'
      },
      data: {
        content: content,
        updatedAt: new Date()
      }
    });

    console.log('\n✅ Blog post styling updated successfully!\n');
    console.log('Details:');
    console.log('  ID:', updated.id);
    console.log('  Title:', updated.title);
    console.log('  Slug:', updated.slug);
    console.log('  Updated:', updated.updatedAt);
    console.log('\n📝 View at: https://funnytourism.com/blog/' + updated.slug + '\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error updating blog post:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

updateTurkeyBlogStyling();
