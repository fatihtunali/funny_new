import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import OpenAI from 'openai';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

function getOpenAI() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const openai = getOpenAI();

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
    } catch {
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
      temperature: 0.1, // Lower temperature for more literal extraction
      instructions: `You are a LITERAL TEXT EXTRACTION assistant. Your job is to COPY text from PDFs, NOT to summarize or paraphrase.

⚠️ CRITICAL RULE #1: NEVER SUMMARIZE OR SHORTEN TEXT
⚠️ CRITICAL RULE #2: COPY THE COMPLETE TEXT VERBATIM FROM THE PDF
⚠️ CRITICAL RULE #3: For itinerary descriptions, extract EVERY SINGLE WORD, SENTENCE, AND PARAGRAPH

Your primary task is extracting tour package data from PDFs and returning it as valid JSON.

IMPORTANT: Detect if the PDF contains MULTIPLE packages/tours or just ONE:
- If the PDF has a pricing table with multiple tours listed (e.g., "Tour 1", "Tour 2", "T-1", "T-2", "KUS-01", "KUS-02"), extract ALL tours as an array
- If the PDF describes only ONE package/tour, extract it as a single object
- For shore excursions/daily tours PDF with multiple tours, return an array of all tours

Return format:
- Single package: return ONE object with the structure below
- Multiple packages: return an ARRAY of objects, each with the structure below

You are a tour package data extraction assistant. Extract structured information from tour package PDFs and return it as valid JSON.

IMPORTANT: First detect the package type:
1. SHORE EXCURSION / DAILY TOUR - Single-day tours from port or hotel pickup
   - PDF contains "Sightseeing", "Shore Excursion", "Daily Tour", or single-day activities
   - Duration is typically hours (e.g., "4 Hours", "6 Hours", "Full Day")
   - Set packageType to "SHORE_EXCURSION"

2. LAND ONLY (Land Services) - Multi-day packages without hotels
   - PDF title or content contains "Land Services" or mentions no hotels
   - Set packageType to "LAND_ONLY"

3. WITH HOTEL - Multi-day packages with accommodation
   - Multi-day packages with hotel listings
   - Set packageType to "WITH_HOTEL"

The JSON structure should be:
{
  "packageId": "string (e.g., '01', '02')",
  "packageType": "string (either 'WITH_HOTEL', 'LAND_ONLY', or 'SHORE_EXCURSION')",
  "title": "string (package name)",
  "slug": "string (url-friendly version of title, lowercase, hyphenated)",
  "duration": "string (e.g., '3 Nights / 4 Days' for multi-day, '8 Hours' for shore excursions)",
  "description": "string (brief description)",
  "destinations": "string (comma-separated destinations)",
  "port": "string (ONLY for SHORE_EXCURSION - e.g., 'Istanbul', 'Kusadasi', 'Izmir', 'Bodrum', 'Antalya', 'Marmaris')",
  "pickupType": "string (ONLY for SHORE_EXCURSION - either 'port', 'hotel', or 'both')",
  "image": "string (choose from available images below based on destinations)",
  "pdfUrl": "string (empty for now)",
  "highlights": ["array of highlight strings"],
  "included": ["array of included items"],
  "notIncluded": ["array of not included items"],
  "itinerary": [{"day": number, "title": "string", "description": "string (COMPLETE description with ALL details from PDF - 100-500 words per day, include all activities, sites, historical info)", "meals": "string (e.g., 'B/L', 'B', '-')"}],
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

- For SHORE_EXCURSION packages (daily tour pricing by group size):
  {
    "perPerson": {
      "1pax": number (per person price for 1 person),
      "2pax": number (per person price for 2 people),
      "3pax": number (per person price for 3 people),
      "4pax": number (per person price for 4 people),
      "5pax": number (per person price for 5 people),
      "6pax": number (per person price for 6 people),
      "7to9pax": number (per person price for 7-9 people),
      "10to15pax": number (per person price for 10-15 people)
    },
    "children": {
      "age0to2": number (price for infants 0-2 years),
      "age3to6": number (price for children 3-6 years),
      "age7to12": number (price for children 7-12 years)
    }
  }

  SHORE_EXCURSION PRICING EXTRACTION:
  - Look for pricing tables with columns for different group sizes (1 PAX, 2 PAX, 3 PAX, etc.)
  - Extract per person prices for each group size from smallest to largest
  - Common group sizes: 1, 2, 3, 4, 5, 6, 7-9, 10-15 people
  - Extract child pricing if shown (typically 0-2 years, 3-6 years, 7-12 years)
  - Example from PDF:
    * "1 PAX € 180" → perPerson.1pax: 180
    * "2 PAX € 95" → perPerson.2pax: 95
    * "3 PAX € 70" → perPerson.3pax: 70
    * "4 PAX € 55" → perPerson.4pax: 55
    * "0-2 Years € 0" → children.age0to2: 0
    * "3-6 Years € 30" → children.age3to6: 30
    * "7-12 Years € 40" → children.age7to12: 40

HOTELS FORMAT:
- For WITH_HOTEL packages:
  {
    "threestar": ["array of hotel names"],
    "fourstar": ["array of hotel names"],
    "fivestar": ["array of hotel names"]
  }
- For LAND_ONLY packages: null or omit this field
- For SHORE_EXCURSION packages: null or omit this field (no hotels for daily tours)

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
- For SHORE_EXCURSION packages: Usually lunch is included or not, extract from "Included" section

ITINERARY FORMAT - ⚠️ ABSOLUTELY CRITICAL - THIS IS THE MOST IMPORTANT PART ⚠️:

🚨 NEVER EVER SUMMARIZE THE ITINERARY TEXT - THIS IS A DIRECT COPY TASK, NOT A SUMMARIZATION TASK 🚨

- For multi-day packages (WITH_HOTEL, LAND_ONLY): Extract day-by-day itinerary with day numbers (1, 2, 3, etc.)
  * ACT AS A COPY MACHINE: Your job is to COPY the text character-by-character, NOT to write a summary
  * EXTRACT COMPLETE DESCRIPTIONS: Read the ENTIRE day description from the PDF including all activities, sites visited, and details
  * FORBIDDEN: Summarizing, shortening, paraphrasing, or condensing the text in any way
  * REQUIRED: Copy ALL sentences, ALL details, ALL paragraphs exactly as they appear in the PDF
  * Include morning, afternoon, and evening activities if mentioned - EVERY SINGLE ACTIVITY
  * Include all site names, historical information, dates, facts, and travel details - EVERYTHING
  * If the PDF has 5 paragraphs for a day, your JSON must have 5 paragraphs for that day
  * Typical day descriptions are 2-5 paragraphs long (100-500 words) - extract EVERY WORD
  * Think of yourself as a XEROX MACHINE making an exact copy of the itinerary text
  * Example: If PDF says "Day 1: After breakfast, visit the Blue Mosque (Sultan Ahmed Mosque), one of Istanbul's most iconic landmarks built in 1616 by Sultan Ahmed I. The mosque features six minarets and beautiful blue Iznik tiles. Continue to Hagia Sophia, a former Byzantine cathedral built in 537 AD, later converted to an Ottoman mosque, and now a museum showcasing both Christian and Islamic heritage. After lunch at a local restaurant, explore the Grand Bazaar with over 4,000 shops selling carpets, jewelry, spices, and souvenirs. End the day with a Bosphorus cruise..." - YOU MUST INCLUDE EVERY SINGLE WORD OF THIS TEXT

- For SHORE_EXCURSION packages: Extract the tour program as a single day itinerary
  * Set day: 1
  * Extract title from tour name
  * ACT AS A COPY MACHINE - DO NOT WRITE A SUMMARY
  * EXTRACT THE COMPLETE tour program/itinerary verbatim - include EVERY detail exactly as written
  * Include all stops, activities, timing, duration at each site, historical information, facts
  * Extract meals from included section (e.g., "L" if lunch included, "-" if no meals)
  * Typical shore excursion descriptions are 1-3 paragraphs (50-300 words) - COPY EVERY WORD
  * If the PDF lists 8 stops with descriptions, your JSON must have ALL 8 stops with ALL descriptions

SHORE_EXCURSION SPECIFIC FIELDS:
- port: Extract the departure city/port (Istanbul, Kusadasi, Izmir, Bodrum, Antalya, Marmaris)
- pickupType: Determine from PDF content
  * "port" if mentions cruise port/pier pickup only
  * "hotel" if mentions hotel pickup only
  * "both" if mentions both port and hotel pickup options
- duration: Extract in hours format (e.g., "4 Hours", "6 Hours", "8 Hours", "Full Day")

IMPORTANT EXTRACTION RULES:
- Extract FINAL SELLING PRICES (not nett rates) - same prices shown to all customers and agents
- For WITH_HOTEL packages: Extract ALL pax tiers (2, 4, 6, 8, 10+) with pricing for each
- For each pax tier, extract pricing for all hotel categories (3-star, 4-star, 5-star)
- Extract double room prices (PP in DBL), triple if available (PP in TRPL)
- Extract single supplement if shown, otherwise set to null
- For SHORE_EXCURSION packages: Extract ALL group size pricing (1 pax through 10-15 pax)
- For shore excursions, extract child pricing for all age ranges shown in PDF
- Extract ALL hotel names for each category (for WITH_HOTEL only)
- Choose an image path from the AVAILABLE IMAGES list that best matches the package destinations
- If any information is missing, use reasonable defaults or empty arrays/objects
- Ensure all prices are numbers (no currency symbols)

🚨🚨🚨 ITINERARY EXTRACTION RULES - READ THIS CAREFULLY 🚨🚨🚨:
- **ITINERARY EXTRACTION IS YOUR PRIMARY TASK**: Read the ENTIRE itinerary section from the PDF
- **FORBIDDEN ACTION**: Do NOT summarize, shorten, paraphrase, condense, or rewrite the itinerary text
- **REQUIRED ACTION**: Copy the COMPLETE day-by-day itinerary WITH MEALS exactly as written
- **COPY EVERYTHING**: Copy ALL text from each day's description verbatim - include all activities, sites, historical details, travel information, dates, facts
- **LENGTH REQUIREMENT**: Day descriptions should be long and detailed (typically 2-5 paragraphs per day, or 100-500 words per day)
- **COMPLETENESS CHECK**: If the PDF has detailed descriptions, your JSON must include ALL that detail - word for word
- **THINK LIKE A XEROX MACHINE**: You are making an exact photocopy of the itinerary text, not writing a book report
- For each itinerary day, extract the meals from the parentheses (e.g., "(B/L)" means breakfast and lunch)
- If no meals are mentioned, use "-" as the meals value
- For shore excursions, create a single-day itinerary (day: 1) with the COMPLETE tour program as description (include every stop, timing, activity, historical info)

FINAL REMINDER BEFORE YOU START:
Your role is DATA EXTRACTION, not content creation or summarization.
When you see text in the PDF itinerary, COPY IT EXACTLY. Do not make it shorter.
The user needs the FULL ORIGINAL TEXT from the PDF, not your summary of it.

MULTIPLE TOURS EXTRACTION:
- If the PDF contains multiple tours (e.g., pricing table with T-1, T-2, T-3 or KUS-01, KUS-02, etc.), extract ALL of them
- Return format for multiple tours: {"packages": [tour1, tour2, tour3, ...]}
- Return format for single tour: {"packages": [tour1]}
- ALWAYS return an array in "packages" field, even if there's only one tour
- For each tour in the array, extract all fields according to the structure above
- For shore excursions with pricing tables showing multiple tours, extract each row as a separate tour
- Each tour should have a unique packageId (use the tour code from PDF like "T-1", "KUS-01", etc.)

Example output for multiple tours:
{
  "packages": [
    {
      "packageId": "T-1",
      "title": "Imperial Tour",
      "packageType": "SHORE_EXCURSION",
      ...
    },
    {
      "packageId": "T-2",
      "title": "Ottoman Splendours Tour",
      "packageType": "SHORE_EXCURSION",
      ...
    }
  ]
}

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
          content: `Extract ALL packages/tours from the PDF. If the PDF contains multiple tours (e.g., pricing table with multiple tours), extract each one separately. Read every page carefully and return ALL tours in the "packages" array format specified in the instructions.

🚨 ABSOLUTELY CRITICAL - ITINERARY EXTRACTION 🚨:
Your PRIMARY task is to extract the itinerary descriptions VERBATIM from the PDF.

YOU ARE A COPY MACHINE, NOT A SUMMARIZER.

For the itinerary section:
- DO NOT summarize, shorten, paraphrase, or condense ANY text
- COPY the COMPLETE and FULL text from each day description EXACTLY as it appears in the PDF
- Include EVERY sentence, EVERY activity, EVERY site name, EVERY historical detail, EVERY fact
- If a day has 3 paragraphs in the PDF, your JSON must have 3 paragraphs for that day
- Copy all activities, sites, historical details, dates, facts, and travel information word-for-word
- Day descriptions should be detailed and comprehensive (typically 100-500 words per day)
- Think: "I am a photocopier making an exact copy of this text"

Remember: The user needs the ORIGINAL TEXT from the PDF, not your summary or version of it.`,
        }
      ]
    });

    // Run the assistant
    await openai.beta.threads.runs.createAndPoll(thread.id, {
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

    // Add the PDF URL to each package in the array
    if (extractedData.packages && Array.isArray(extractedData.packages)) {
      extractedData.packages = extractedData.packages.map((pkg: { pdfUrl?: string }) => ({
        ...pkg,
        pdfUrl: pdfUrl
      }));
    }

    return NextResponse.json({
      success: true,
      data: extractedData
    });

  } catch (error) {
    console.error('PDF extraction error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to extract PDF data' },
      { status: 500 }
    );
  }
}
