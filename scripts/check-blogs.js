const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkBlogs() {
  try {
    // Check all blog posts
    const allPosts = await prisma.blogPost.findMany({
      select: {
        title: true,
        slug: true,
        category: true,
        excerpt: true,
        content: true,
        status: true
      }
    });

    console.log('Total blog posts:', allPosts.length);

    const published = allPosts.filter(p => p.status === 'PUBLISHED');
    const draft = allPosts.filter(p => p.status === 'DRAFT');

    console.log('Published:', published.length);
    console.log('Draft:', draft.length);
    console.log('\n' + '='.repeat(80) + '\n');

    allPosts.forEach((post, idx) => {
      console.log(`${idx + 1}. ${post.title} [${post.status}]`);
      console.log(`   Slug: ${post.slug}`);
      console.log(`   Category: ${post.category}`);
      console.log(`   Excerpt: ${post.excerpt.substring(0, 100)}...`);
      console.log(`   Content Length: ${post.content.length} characters`);
      console.log('');
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkBlogs();
