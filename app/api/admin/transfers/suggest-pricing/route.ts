import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import prisma from '@/lib/prisma';
import OpenAI from 'openai';

function getOpenAI() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const openai = getOpenAI();

    const { fromLocationId, toLocationId } = await req.json();

    if (!fromLocationId || !toLocationId) {
      return NextResponse.json(
        { success: false, error: 'Both locations are required' },
        { status: 400 }
      );
    }

    // Get location details
    const fromLocation = await prisma.transferLocation.findUnique({
      where: { id: fromLocationId }
    });

    const toLocation = await prisma.transferLocation.findUnique({
      where: { id: toLocationId }
    });

    if (!fromLocation || !toLocation) {
      return NextResponse.json(
        { success: false, error: 'Invalid locations' },
        { status: 404 }
      );
    }

    // Get similar existing routes for context
    const similarRoutes = await prisma.transfer.findMany({
      where: {
        OR: [
          { fromLocation: { region: fromLocation.region } },
          { toLocation: { region: toLocation.region } }
        ],
        isActive: true
      },
      include: {
        fromLocation: true,
        toLocation: true
      },
      take: 5
    });

    // Create context for AI
    const similarRoutesContext = similarRoutes.map(r => ({
      route: `${r.fromLocation.name} → ${r.toLocation.name}`,
      region: r.fromLocation.region,
      prices: {
        sic: r.sicPricePerPerson,
        pax1to2: r.price1to2Pax,
        pax3to5: r.price3to5Pax,
        pax6to10: r.price6to10Pax
      }
    }));

    // Ask OpenAI for pricing suggestion
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a transfer pricing expert for Turkey. Your job is to suggest realistic transfer prices in EUR based on:
- Location types (AIRPORT, CITY_CENTER, HOTEL_ZONE, TOURIST_AREA)
- Distance and typical travel patterns in Turkey
- Existing pricing data from similar routes
- Market standards for private transfers in Turkey

Consider:
- Airport transfers are typically more expensive
- Longer distances cost more
- Tourist areas may have premium pricing
- Vehicle types: Sedan (1-2 pax), Minivan/Transporter (3-5 pax), Minibus/Sprinter (6-10 pax)

Return ONLY a JSON object with this exact structure:
{
  "sicPricePerPerson": number or null,
  "price1to2Pax": number,
  "price3to5Pax": number,
  "price6to10Pax": number,
  "distance": "estimated distance like '45 km'",
  "duration": "estimated duration like '45-60 min'",
  "reasoning": "brief explanation of pricing"
}`
        },
        {
          role: 'user',
          content: `Suggest pricing for this transfer route:

FROM: ${fromLocation.name} (${fromLocation.type}) - ${fromLocation.region}
TO: ${toLocation.name} (${toLocation.type}) - ${toLocation.region}

Similar routes in our system:
${JSON.stringify(similarRoutesContext, null, 2)}

Please suggest realistic prices in EUR for this route.`
        }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    });

    const suggestion = JSON.parse(completion.choices[0].message.content || '{}');

    return NextResponse.json({
      success: true,
      suggestion: {
        sicPricePerPerson: suggestion.sicPricePerPerson,
        price1to2Pax: suggestion.price1to2Pax,
        price3to5Pax: suggestion.price3to5Pax,
        price6to10Pax: suggestion.price6to10Pax,
        distance: suggestion.distance,
        duration: suggestion.duration,
        vehicleType1to2: 'Sedan',
        vehicleType3to5: 'Minivan (Transporter)',
        vehicleType6to10: 'Minibus (Sprinter)',
        reasoning: suggestion.reasoning
      }
    });

  } catch (error) {
    console.error('Error suggesting pricing:', error);
    const message = error instanceof Error ? error.message : 'Failed to suggest pricing';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
