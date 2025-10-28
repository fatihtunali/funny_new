import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyTranslations() {
  console.log('🔍 Verifying Spanish translations...\n');

  const blogPosts = await prisma.blogPost.findMany({
    where: {
      status: 'PUBLISHED'
    },
    select: {
      id: true,
      slug: true,
      title: true,
      titleEs: true,
      excerptEs: true,
      contentEs: true
    }
  });

  console.log(`📝 Found ${blogPosts.length} published blog posts\n`);

  let withTranslations = 0;
  let withoutTranslations = 0;

  for (const post of blogPosts) {
    const hasTranslation = post.titleEs && post.excerptEs && post.contentEs;

    if (hasTranslation) {
      console.log(`✅ ${post.title}`);
      console.log(`   Spanish Title: ${post.titleEs}`);
      console.log(`   Content Length: ${post.contentEs?.length || 0} characters\n`);
      withTranslations++;
    } else {
      console.log(`❌ ${post.title}`);
      console.log(`   Missing Spanish translation\n`);
      withoutTranslations++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 Verification Summary:');
  console.log('='.repeat(60));
  console.log(`✅ With Spanish translations: ${withTranslations}`);
  console.log(`❌ Without translations: ${withoutTranslations}`);
  console.log(`📝 Total blog posts: ${blogPosts.length}`);
  console.log('='.repeat(60) + '\n');

  if (withoutTranslations === 0) {
    console.log('🎉 SUCCESS: All blog posts have Spanish translations!\n');
  } else {
    console.log(`⚠️  WARNING: ${withoutTranslations} blog posts are missing Spanish translations\n`);
  }

  await prisma.$disconnect();
}

verifyTranslations();
