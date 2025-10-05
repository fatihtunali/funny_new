import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import OpenAI from 'openai';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();

    const formData = await req.formData();
    const file = formData.get('pdf') as File;

    if (!file) {
      return NextResponse.json({ error: 'No PDF file provided' }, { status: 400 });
    }

    // Convert File to OpenAI File format
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save PDF to public/daily-tours/ directory
    const toursDir = path.join(process.cwd(), 'public', 'daily-tours');

    // Create directory if it doesn't exist
    try {
      await mkdir(toursDir, { recursive: true });
    } catch {
      // Directory might already exist
    }

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const pdfFileName = `${timestamp}-${sanitizedFileName}`;
    const pdfPath = path.join(toursDir, pdfFileName);

    // Save the file
    await writeFile(pdfPath, buffer);
    const pdfUrl = `/daily-tours/${pdfFileName}`;

    // Create a File object for OpenAI
    const openaiFile = new globalThis.File([buffer], file.name, { type: 'application/pdf' });

    // Upload the file to OpenAI
    const uploadedFile = await openai.files.create({
      file: openaiFile,
      purpose: 'assistants',
    });

    // Create an assistant to read the PDF
    const assistant = await openai.beta.assistants.create({
      model: 'gpt-4o',
      instructions: `You are a daily tour data extraction assistant. Extract structured information from daily tour PDFs.

IMPORTANT: The PDF may contain MULTIPLE tours or just ONE tour:
- If the PDF has multiple tours listed (e.g., T-1, T-2, T1, T2), extract ALL tours as an array
- If the PDF describes only ONE tour, extract it as a single object
- Look for tour codes like "T1", "T-1", "IST-01", etc.

Return format:
- Single tour: return ONE object with the structure below
- Multiple tours: return an ARRAY of objects, each with the structure below

The JSON structure for EACH tour should be:
{
  "tourCode": "string (e.g., 'T1', 'T-1', 'IST-01')",
  "title": "string (tour name, e.g., 'Imperial Tour', 'Bosphorus Cruise')",
  "description": "string (full tour description with all details)",
  "duration": "string (e.g., 'Half Day', 'Full Day', '4 Hours', '8 Hours')",
  "city": "string (main city, e.g., 'Istanbul', 'Cappadocia', 'Izmir', 'Kusadasi')",
  "sicPrice": number (Per Person SIC price - look for 'SIC' or 'PP' column),
  "privateMin2": number (Per person private price for 2 pax),
  "privateMin4": number (Per person private price for 4 pax),
  "privateMin6": number (Per person private price for 6 pax),
  "privateMin8": number (Per person private price for 8 pax),
  "privateMin10": number (Per person private price for 10 pax),
  "included": "string (what's included - if mentioned)",
  "notIncluded": "string (what's not included - if mentioned)",
  "notes": "string (any special notes, closures, alternative tour info)",
  "port": "string or null (cruise port if applicable, e.g., 'Istanbul', 'Kusadasi', 'Izmir')",
  "pickupLocations": "string (pickup points if mentioned, e.g., 'Hotel Pickup Available', 'Port Pickup')",
  "image": "string (select from available images based on city - see list below)"
}

PRICING TABLE EXTRACTION:
Look for pricing tables with these columns:
- Tour Code / Tour Name
- SIC (Seat-in-Coach) or PP (Per Person) - this is the sicPrice
- Private pricing for different group sizes: Min 2 Pax, Min 4 Pax, Min 6 Pax, Min 8 Pax, Min 10 Pax

Example table format:
Tour Code | Tour Name      | SIC  | PRIVATE: Min 2 | Min 4 | Min 6 | Min 8 | Min 10
T1        | Imperial Tour  | €75  | €200           | €130  | €110  | €100  | €90

Should extract as:
- sicPrice: 75
- privateMin2: 200
- privateMin4: 130
- privateMin6: 110
- privateMin8: 100
- privateMin10: 90

IMPORTANT NOTES:
- All prices should be extracted as NUMBERS (remove currency symbols like €, $, USD, EUR)
- SIC tours are guaranteed to operate with minimum 1 passenger
- Private tours show the PRICE PER PERSON for that group size
- If the tour mentions a cruise port, include it in the "port" field
- All tours should include pickup location information if mentioned

AVAILABLE IMAGES (select based on city/destination):
- Istanbul: "/images/destinations/istanbul.jpg"
- Cappadocia: "/images/destinations/cappadocia.jpg"
- Ephesus/Kusadasi: "/images/destinations/ephesus.jpg"
- Pamukkale: "/images/destinations/pamukkale.jpg"
- Antalya: "/images/destinations/antalya.jpg"
- Bodrum: "/images/destinations/bodrum.jpg"
- Fethiye: "/images/destinations/fethiye.jpg"
- Izmir: "/images/destinations/istanbul.jpg" (default)
- Marmaris: "/images/destinations/marmaris.jpg"

Return ONLY valid JSON, no markdown formatting or code blocks.`,
      tools: [{ type: 'file_search' }],
    });

    // Create a thread and attach the file
    const thread = await openai.beta.threads.create({
      messages: [
        {
          role: 'user',
          content: 'Extract the daily tour information from this PDF.',
          attachments: [
            {
              file_id: uploadedFile.id,
              tools: [{ type: 'file_search' }],
            },
          ],
        },
      ],
    });

    // Run the assistant
    await openai.beta.threads.runs.createAndPoll(thread.id, {
      assistant_id: assistant.id,
    });

    // Get the response
    const messages = await openai.beta.threads.messages.list(thread.id);
    const assistantMessage = messages.data[0];

    if (assistantMessage.content[0].type === 'text') {
      let responseText = assistantMessage.content[0].text.value;

      // Clean up the response - remove markdown code blocks if present
      responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

      // Extract JSON from text that might have explanations before/after
      // Look for content between first { and last } (including nested objects)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        responseText = jsonMatch[0];
      }

      // Parse JSON
      let tourData;
      try {
        tourData = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.error('Response Text:', responseText);
        throw new Error(`Failed to parse JSON: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
      }

      // Sanitize and add metadata to each tour
      const sanitizeTourCode = (code: string) => {
        // Remove all characters except letters, numbers, and hyphens
        return code.replace(/[^a-zA-Z0-9-]/g, '').toUpperCase();
      };

      if (Array.isArray(tourData)) {
        tourData.forEach(tour => {
          tour.pdfUrl = pdfUrl;
          // Sanitize tour code to prevent URL issues
          tour.tourCode = sanitizeTourCode(tour.tourCode);
          // Use default image if not provided
          if (!tour.image) {
            tour.image = '/images/destinations/istanbul.jpg';
          }
        });
      } else {
        tourData.pdfUrl = pdfUrl;
        // Sanitize tour code to prevent URL issues
        tourData.tourCode = sanitizeTourCode(tourData.tourCode);
        // Use default image if not provided
        if (!tourData.image) {
          tourData.image = '/images/destinations/istanbul.jpg';
        }
      }

      // Clean up OpenAI resources
      await openai.files.delete(uploadedFile.id);
      await openai.beta.assistants.delete(assistant.id);

      return NextResponse.json({
        success: true,
        tours: Array.isArray(tourData) ? tourData : [tourData],
        pdfUrl,
      });
    }

    throw new Error('No text response from assistant');
  } catch (error) {
    console.error('Extract daily tour error:', error);
    return NextResponse.json(
      {
        error: 'Failed to extract daily tour data',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
