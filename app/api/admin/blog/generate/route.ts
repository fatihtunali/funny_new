import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST - Generate blog post using AI
export async function POST(req: NextRequest) {
  try {
    await requireAdmin();

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

Format the response as JSON with these fields:
{
  "title": "An SEO-friendly, engaging title (max 60 characters)",
  "excerpt": "A compelling 2-3 sentence summary (max 160 characters)",
  "content": "Full blog post content in HTML format with proper headings (<h2>, <h3>), paragraphs (<p>), lists (<ul>, <li>), and emphasis (<strong>, <em>). Make it at least 800 words, informative, engaging, and SEO-optimized.",
  "metaTitle": "SEO meta title (max 60 characters)",
  "metaDescription": "SEO meta description (max 160 characters)",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "coverImageSuggestion": "Description of what the cover image should show"
}

Guidelines:
- Write in a friendly, informative tone
- Include practical tips and insider knowledge
- Use proper Turkish place names and terms
- Add specific details, prices (in Euros/Turkish Lira), and practical information
- Include engaging subheadings
- Make it actionable and helpful for travelers
- Focus on recent information (2024-2025)
- Include calls-to-action to book tours or contact Funny Tourism`
      : `Generate a travel blog post idea about Turkey for the category: ${category}.

Create a complete blog post with the JSON format specified above. Choose a topic that would be valuable for travelers planning a trip to Turkey.`;

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

    const result = JSON.parse(completion.choices[0].message.content || '{}');

    // Select appropriate cover image based on category
    const categoryImages: Record<string, string> = {
      'Travel Tips': '/images/istanbul-tips.jpg',
      'Destinations': '/images/cappadocia.jpg',
      'Culture': '/images/turkish-culture.jpg',
      'Food': '/images/turkish-food.jpg',
      'History': '/images/ephesus.jpg',
      'Activities': '/images/balloon-ride.jpg',
    };

    const coverImage = categoryImages[category] || '/images/turkey-default.jpg';

    // Generate slug
    const slug = result.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Create blog post
    const post = await prisma.blogPost.create({
      data: {
        title: result.title,
        slug,
        excerpt: result.excerpt,
        content: result.content,
        coverImage,
        category,
        tags: JSON.stringify(result.tags || []),
        metaTitle: result.metaTitle || result.title,
        metaDescription: result.metaDescription || result.excerpt,
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
  } catch (error: any) {
    console.error('Error generating blog post:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate blog post' },
      { status: error.message?.includes('Unauthorized') ? 401 : 500 }
    );
  }
}
