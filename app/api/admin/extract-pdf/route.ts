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

    // Save PDF to public/packages/ directory
    const packagesDir = path.join(process.cwd(), 'public', 'packages');

    // Create directory if it doesn't exist
    try {
      await mkdir(packagesDir, { recursive: true });
    } catch (err) {
      // Directory might already exist
    }

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const pdfFileName = `${timestamp}-${sanitizedFileName}`;
    const pdfPath = path.join(packagesDir, pdfFileName);

    // Save the file
    await writeFile(pdfPath, buffer);
    const pdfUrl = `/packages/${pdfFileName}`;

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
      instructions: `You are a tour package data extraction assistant. Extract structured information from tour package PDFs and return it as valid JSON.

IMPORTANT: First detect if this is a package WITH HOTELS or LAND ONLY (land services).
- If the PDF title or content contains "Land Services" or mentions no hotels, set packageType to "LAND_ONLY"
- Otherwise, set packageType to "WITH_HOTEL"

The JSON structure should be:
{
  "packageId": "string (e.g., '01', '02')",
  "packageType": "string (either 'WITH_HOTEL' or 'LAND_ONLY')",
  "title": "string (package name)",
  "slug": "string (url-friendly version of title, lowercase, hyphenated)",
  "duration": "string (e.g., '3 Nights / 4 Days')",
  "description": "string (brief description)",
  "destinations": "string (comma-separated destinations)",
  "image": "string (choose from available images below based on destinations)",
  "pdfUrl": "string (empty for now)",
  "highlights": ["array of highlight strings"],
  "included": ["array of included items"],
  "notIncluded": ["array of not included items"],
  "itinerary": [{"day": number, "title": "string", "description": "string", "meals": "string (e.g., 'B/L', 'B', '-')"}],
  "pricing": CONDITIONAL - see below,
  "hotels": CONDITIONAL - see below
}

PRICING FORMAT (FINAL SELLING PRICES - Same for all customers and agents):
- For WITH_HOTEL packages, extract pricing by PAX TIERS (group sizes):
  {
    "paxTiers": {
      "2": {
        "threestar": {"double": number, "triple": number, "singleSupplement": number or null},
        "fourstar": {"double": number, "triple": number, "singleSupplement": number or null},
        "fivestar": {"double": number, "triple": number, "singleSupplement": number or null}
      },
      "4": {
        "threestar": {"double": number, "triple": number, "singleSupplement": number or null},
        "fourstar": {"double": number, "triple": number, "singleSupplement": number or null},
        "fivestar": {"double": number, "triple": number, "singleSupplement": number or null}
      },
      "6": {
        "threestar": {"double": number, "triple": number, "singleSupplement": number or null},
        "fourstar": {"double": number, "triple": number, "singleSupplement": number or null},
        "fivestar": {"double": number, "triple": number, "singleSupplement": number or null}
      }
      // ... continue for 8, 10, etc. if shown in PDF
    }
  }

  PRICING EXTRACTION RULES:
  - Look for "Min. Paying Pax X Adults" or "X pax" rows in pricing tables
  - Extract "PP in DBL" (per person in double room) for each pax tier
  - Extract "PP in TRPL" (per person in triple room) if available
  - For single supplement: If "Single Supplement" row exists, use that value, otherwise set to null
  - Extract ALL pax tiers shown in PDF (common: 2, 4, 6, 8, 10 adults)
  - Extract pricing for all three hotel categories (3-star, 4-star, 5-star)
  - These are FINAL SELLING PRICES shown to everyone (customers and agents)
  - Ensure all prices are numbers without currency symbols

- For LAND_ONLY packages (group size-based pricing):
  {
    "twoAdults": number (per person price for 2 adults),
    "fourAdults": number (per person price for 4 adults),
    "sixAdults": number (per person price for 6+ adults),
    "children": {
      "age3to5": number (per child price for 3-5 years old),
      "age6to10": number (per child price for 6-10 years old)
    }
  }

  LAND_ONLY PRICING EXTRACTION:
  - Look for "Min. Paying Pax X Adults" rows
  - Extract "Per Person" price for 2, 4, and 6+ adults
  - Extract child prices for age ranges (3-5 years, 6-10 years)
  - Example from PDF:
    * "Min. Paying Pax 2 Adults - Per Person € 415" → twoAdults: 415
    * "Min. Paying Pax 4 Adults - Per Person € 369" → fourAdults: 369
    * "Min. Paying Pax 6 Adults - Per Person € 355" → sixAdults: 355
    * "03 - 05 YRS Child € 160" → children.age3to5: 160
    * "05,99 -10,99 YRS Child € 295" → children.age6to10: 295

HOTELS FORMAT:
- For WITH_HOTEL packages:
  {
    "threestar": ["array of hotel names"],
    "fourstar": ["array of hotel names"],
    "fivestar": ["array of hotel names"]
  }
- For LAND_ONLY packages: null or omit this field

AVAILABLE IMAGES - Choose the most relevant one for the "image" field:
- Istanbul: /images/BlueMosqueIstanbul.jpg, /images/ayasofya.jpg, /images/BosphorusCruiseIstanbul.jpg, /images/topkapipalacegeneraldrone.jpg
- Cappadocia: /images/cappadociaballoonride.jpg, /images/FairyChimneysCapppadocia.jpeg, /images/cappadociatour.webp
- Antalya: /images/AntalyaHarbour.jpg, /images/AntalyaOldCity.jpg, /images/duden.jpg
- Pamukkale: /images/PamukkaleTravertenler.jpg, /images/HierapolisAntikKentiPamukkale.jpg
- Fethiye: /images/FethiyeMarina.jpg, /images/FethiyeBay.jpg, /images/fethiye-paragliding.jpg
- Ephesus/Kusadasi: /images/Ephesus_Library.jpg, /images/MeryemAnaEvi.jpeg
- Side: /images/SideAntikKenti.jpg, /images/side-aspendos.jpg
- Bursa: /images/bursa.webp, /images/bursa1.jpg
- Package with hotels: /images/hotelwithpackage.jpg

MEALS FORMAT:
- Extract meals from the itinerary (usually shown in parentheses after the day description)
- Common formats: (B) = Breakfast, (L) = Lunch, (D) = Dinner, (B/L) = Breakfast and Lunch, (-) = No meals
- Examples:
  * "Day 1 - Fly / Istanbul (-)" → meals: "-"
  * "Day 2 - Istanbul – Full Day Tour (B/L)" → meals: "B/L"
  * "Day 3 - Istanbul (B/L/D)" → meals: "B/L/D"
  * "Day 4 - Istanbul / Fly (B)" → meals: "B"

IMPORTANT:
- Extract FINAL SELLING PRICES (not nett rates) - same prices shown to all customers and agents
- For WITH_HOTEL packages: Extract ALL pax tiers (2, 4, 6, 8, 10+) with pricing for each
- For each pax tier, extract pricing for all hotel categories (3-star, 4-star, 5-star)
- Extract double room prices (PP in DBL), triple if available (PP in TRPL)
- Extract single supplement if shown, otherwise set to null
- Extract ALL hotel names for each category
- Extract the complete day-by-day itinerary WITH MEALS
- For each itinerary day, extract the meals from the parentheses (e.g., "(B/L)" means breakfast and lunch)
- If no meals are mentioned, use "-" as the meals value
- Choose an image path from the AVAILABLE IMAGES list that best matches the package destinations
- If any information is missing, use reasonable defaults or empty arrays/objects
- Ensure all prices are numbers (no currency symbols)
- Return ONLY valid JSON, no explanations`,
      tools: [{ type: 'file_search' }],
      tool_resources: {
        file_search: {
          vector_stores: [{
            file_ids: [uploadedFile.id]
          }]
        }
      }
    });

    // Create a thread with the PDF
    const thread = await openai.beta.threads.create({
      messages: [
        {
          role: 'user',
          content: 'Extract all package information from the PDF. Read every page carefully and extract all details in the specified JSON format.',
        }
      ]
    });

    // Run the assistant
    const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
      assistant_id: assistant.id,
    });

    // Get the messages
    const messages = await openai.beta.threads.messages.list(thread.id);
    const lastMessage = messages.data[0];
    const content = lastMessage.content[0];

    let extractedText = '';
    if (content.type === 'text') {
      extractedText = content.text.value;
    }

    // Clean up
    await openai.beta.assistants.delete(assistant.id);
    await openai.files.delete(uploadedFile.id);

    // Parse the JSON from the response
    const jsonMatch = extractedText.match(/\{[\s\S]*\}/);
    const extractedData = jsonMatch ? JSON.parse(jsonMatch[0]) : {};

    // Add the PDF URL to the extracted data
    extractedData.pdfUrl = pdfUrl;

    return NextResponse.json({
      success: true,
      data: extractedData
    });

  } catch (error: any) {
    console.error('PDF extraction error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to extract PDF data' },
      { status: 500 }
    );
  }
}
