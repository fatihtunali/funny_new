import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getPost() {
  const post = await prisma.blogPost.findUnique({
    where: { slug: 'indian-restaurants-in-turkey' },
    select: { content: true }
  });

  console.log(post?.content);
  await prisma.$disconnect();
}

getPost();
