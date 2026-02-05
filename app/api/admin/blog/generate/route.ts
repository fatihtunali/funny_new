import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';

function getOpenAI() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// POST - Generate blog post using AI
export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const openai = getOpenAI();

    const body = await req.json();
    const { topic, category, autoPublish } = body;

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Determine category-specific prompt
    const categoryPrompts: Record<string, string> = {
      'Travel Tips': 'practical travel advice and tips for visiting Turkey',
      'Destinations': 'detailed destination guide about a specific place in Turkey',
      'Culture': 'insights into Turkish culture, traditions, and customs',
      'Food': 'Turkish cuisine, local dishes, and food experiences',
      'History': 'historical facts and stories about Turkey',
      'Activities': 'things to do and activities in Turkey',
    };

    const categoryContext = categoryPrompts[category] || 'travel information about Turkey';

    // Generate blog post using GPT-4
    const prompt = topic
      ? `Write a comprehensive, engaging blog post about "${topic}" for a Turkey travel website. The post should be ${categoryContext}.

IMPORTANT: You MUST return a valid JSON object with ALL of these fields filled:

{
  "title": "string - An SEO-friendly, engaging title (max 60 characters)",
  "excerpt": "string - A compelling 2-3 sentence summary (max 160 characters)",
  "content": "string - Full blog post content in HTML format with <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em> tags. Minimum 800 words.",
  "metaTitle": "string - SEO meta title (max 60 characters)",
  "metaDescription": "string - SEO meta description (max 160 characters)",
  "tags": ["string array - 5 relevant tags"],
  "coverImageSuggestion": "string - Description of cover image"
}

Content Guidelines:
- Write in friendly, informative tone
- Include practical tips and insider knowledge
- Use proper Turkish place names
- Add specific details, prices (Euros/Turkish Lira)
- Include engaging subheadings with HTML <h2> and <h3> tags
- Make it actionable and helpful
- Focus on 2024-2025 information
- Include calls-to-action

EXAMPLE content structure:
<p>Introduction paragraph...</p>
<h2>Main Section</h2>
<p>Content...</p>
<ul><li>Point 1</li><li>Point 2</li></ul>
<h3>Subsection</h3>
<p>More content...</p>`
      : `Create a complete travel blog post about Turkey for the category: ${category}.

IMPORTANT: You MUST return a valid JSON object with ALL fields filled. Choose an interesting topic for travelers planning a Turkey trip.

Required JSON format:
{
  "title": "SEO-friendly title (max 60 chars)",
  "excerpt": "Compelling summary (max 160 chars)",
  "content": "Full HTML blog post (minimum 800 words with <h2>, <p>, <ul>, <li> tags)",
  "metaTitle": "Meta title (max 60 chars)",
  "metaDescription": "Meta description (max 160 chars)",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "coverImageSuggestion": "Cover image description"
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a professional travel writer specializing in Turkey tourism. You write engaging, informative, and SEO-optimized blog posts that help travelers plan amazing trips to Turkey.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      response_format: { type: 'json_object' },
    });

    const aiResponse = completion.choices[0].message.content || '{}';
    console.log('AI Raw Response:', aiResponse.substring(0, 200) + '...');

    const result = JSON.parse(aiResponse);
    console.log('AI Parsed Result Keys:', Object.keys(result));
    console.log('Title:', result.title);
    console.log('Excerpt:', result.excerpt);
    console.log('Content length:', result.content?.length || 0);

    // Validate required fields
    if (!result.title || !result.excerpt || !result.content) {
      console.error('AI response missing required fields:', {
        hasTitle: !!result.title,
        hasExcerpt: !!result.excerpt,
        hasContent: !!result.content,
        keys: Object.keys(result)
      });
      return NextResponse.json(
        {
          error: 'AI generated incomplete content. Missing: ' +
            [!result.title && 'title', !result.excerpt && 'excerpt', !result.content && 'content']
            .filter(Boolean).join(', ') + '. Please try again.'
        },
        { status: 500 }
      );
    }

    // All available images (excluding logos and non-photo files)
    const allImages = [
      '/images/AntalyaOldCity.jpg',
      '/images/AntalyaHarbour.jpg',
      '/images/AntalyaOldCity1.jpg',
      '/images/BlueMosqueIstanbul.jpg',
      '/images/BosphorusBridgeNightIstanbul.jpg',
      '/images/BlueMosqueIstanbul6minarets.jpg',
      '/images/BosphorusCruiseIstanbul.jpg',
      '/images/BosphorusStraitIstanbul.jpg',
      '/images/BosphorusCruiseIstanbul2.jpg',
      '/images/Ephesus_Library.jpg',
      '/images/Ephesus_Library2.jpg',
      '/images/FairyChimneysCapppadocia.jpeg',
      '/images/Fethiye.jpg',
      '/images/Ferhiye-Marina.jpg',
      '/images/FethiyeBay.jpg',
      '/images/FethiyeMarina.jpg',
      '/images/HierapolisAntikKentiPamukkale.jpg',
      '/images/HierapolisAntikKentiPamukkale1.jpg',
      '/images/IstanbulatNight.jpeg',
      '/images/MaidenTowerIstanbul.jpg',
      '/images/MeryemAnaEvi.jpeg',
      '/images/OrtakoyMosqueIstanbul.jpg',
      '/images/MeryemAnaEvi2.jpeg',
      '/images/PamukkaleTravertenler.jpg',
      '/images/PamukkaleTravertenler1.jpg',
      '/images/PataraBeach.jpg',
      '/images/SideAntikKenti.jpg',
      '/images/SuleymaniyeMosqueIstanbul.jpg',
      '/images/antalyakekova.jpg',
      '/images/ayasofya.jpg',
      '/images/bluemosque.jpg',
      '/images/bursa1.jpg',
      '/images/cappadociaballoonride.jpg',
      '/images/camlica.jpg',
      '/images/cappadociaballoonride3.jpg',
      '/images/cappadociaballoonride2.jpg',
      '/images/cappadocianight.jpg',
      '/images/cappadocias.jpg',
      '/images/didyma.jpg',
      '/images/duden.jpg',
      '/images/fethiye-paragliding.jpg',
      '/images/fethiye-paragliding2.jpg',
      '/images/hotelwithpackage.jpg',
      '/images/izmir.jpg',
      '/images/pergamon.jpg',
      '/images/jeepsafari.jpg',
      '/images/side-aspendos.jpg',
      '/images/sirince.jpg',
      '/images/topkapipalacegeneraldrone.jpg',
      '/images/topkapipalacepanorama.jpg',
      '/images/topkapipalaceinside.jpg',
      '/images/transfer.jpg',
      '/images/mosque-4812260_1920.jpg',
      '/images/galata-tower-istanbul.jpg',
      '/images/MaidenTowerIstanbul-2.jpg',
      '/images/ortahisar-5678553_1280.jpg',
      '/images/istanbul-boat-tour.jpg',
      '/images/hot-air-balloons-1773468_1280.jpg',
      '/images/antalya-7729741_1280-kaleici.jpg',
      '/images/pamukalle-dark.jpg',
      '/images/eskisehir.jpg',
      '/images/antalya-sea-view-with-mountain.jpg',
      '/images/antalya-port.jpg',
      '/images/OrtakoyMosqueIstanbul-1.jpg',
      '/images/anitkabir.jpg',
      '/images/suleymaniye-istanbul.jpg',
    ];

    // Randomly select an image from all available images
    const coverImage = allImages[Math.floor(Math.random() * allImages.length)];

    // Generate slug
    const slug = result.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Create blog post with fallbacks for missing fields
    const post = await prisma.blogPost.create({
      data: {
        title: result.title || 'Untitled Post',
        slug,
        excerpt: result.excerpt || result.metaDescription || 'No excerpt available',
        content: result.content || '<p>Content not available</p>',
        coverImage,
        category,
        tags: JSON.stringify(result.tags || []),
        metaTitle: result.metaTitle || result.title || 'Untitled',
        metaDescription: result.metaDescription || result.excerpt || '',
        isAIGenerated: true,
        aiPrompt: prompt,
        status: autoPublish ? 'PUBLISHED' : 'DRAFT',
        publishedAt: autoPublish ? new Date() : null,
      },
    });

    return NextResponse.json({
      post,
      coverImageSuggestion: result.coverImageSuggestion,
    });
  } catch (error) {
    console.error('Error generating blog post:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate blog post' },
      { status: error instanceof Error && error.message?.includes('Unauthorized') ? 401 : 500 }
    );
  }
}
