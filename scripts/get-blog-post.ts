import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getBlogPost() {
  try {
    const post = await prisma.blogPost.findFirst({
      where: {
        OR: [
          { title: { contains: 'Indian' } },
          { title: { contains: 'Restaurant' } }
        ]
      }
    });

    if (post) {
      console.log('\nTitle:', post.title);
      console.log('Slug:', post.slug);
      console.log('\nContent preview (first 2000 chars):\n');
      console.log(post.content.substring(0, 2000));
      console.log('\n...\n');
    } else {
      console.log('No blog post found with "indian" or "restaurant" in title');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

getBlogPost();
