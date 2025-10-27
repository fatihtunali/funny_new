import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function translateToSpanish() {
  console.log('🌍 Starting translation process...');

  // Read the English translations
  const enPath = path.join(process.cwd(), 'messages', 'en.json');
  const enContent = fs.readFileSync(enPath, 'utf-8');
  const enTranslations = JSON.parse(enContent);

  console.log('📖 Loaded English translations');

  // Use OpenAI to translate
  console.log('🤖 Translating with OpenAI GPT-4...');

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: 'You are a professional translator specializing in travel and tourism content. Translate the following JSON from English to Spanish. Maintain the exact same JSON structure and keys. Only translate the values. Keep HTML tags (like <br />) unchanged. Use natural, tourist-friendly Spanish that would appeal to travelers from Spain and Latin America.'
      },
      {
        role: 'user',
        content: `Translate this JSON to Spanish:\n\n${enContent}`
      }
    ],
    temperature: 0.3,
  });

  const translatedContent = response.choices[0].message.content;

  if (!translatedContent) {
    throw new Error('No translation received from OpenAI');
  }

  // Extract JSON from response (in case GPT wrapped it in markdown code blocks)
  let spanishJson = translatedContent;
  if (translatedContent.includes('```json')) {
    spanishJson = translatedContent.split('```json')[1].split('```')[0].trim();
  } else if (translatedContent.includes('```')) {
    spanishJson = translatedContent.split('```')[1].split('```')[0].trim();
  }

  // Validate it's proper JSON
  const esTranslations = JSON.parse(spanishJson);

  // Write to es.json
  const esPath = path.join(process.cwd(), 'messages', 'es.json');
  fs.writeFileSync(esPath, JSON.stringify(esTranslations, null, 2), 'utf-8');

  console.log('✅ Spanish translations saved to messages/es.json');
  console.log(`📊 Translated ${Object.keys(enTranslations).length} sections`);
}

translateToSpanish()
  .then(() => {
    console.log('✅ Translation complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Translation failed:', error);
    process.exit(1);
  });
