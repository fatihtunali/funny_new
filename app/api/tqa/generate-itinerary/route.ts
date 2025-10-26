import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/tqa/generate-itinerary
 * Proxies to TravelQuoteAI's itinerary generation API with real pricing data
 * Automatically sets organization_id to 5 (Funny Tourism)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('📝 Generating itinerary via TQA for:', body.customer_email);

    // Use environment variable for TQA URL
    const tqaUrl = process.env.TQA_API_URL || 'https://travelquoteai.com';

    const requestData = {
      organization_id: 5, // Funny Tourism in TQA database
      ...body,
    };

    console.log('🔗 TQA URL:', `${tqaUrl}/api/itinerary/preview`);
    console.log('📤 Request data:', JSON.stringify(requestData, null, 2));

    // Call TQA's itinerary preview endpoint with organization ID
    const response = await fetch(`${tqaUrl}/api/itinerary/preview`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    console.log('📥 TQA Response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('TQA API error response:', errorText);

      let error;
      try {
        error = JSON.parse(errorText);
      } catch {
        error = { error: errorText || 'Failed to generate itinerary' };
      }

      // Handle specific error types
      if (error.error && error.error.includes('Too many requests')) {
        throw new Error('Our AI is currently busy. Please try again in a few minutes.');
      }
      if (error.details && Array.isArray(error.details)) {
        throw new Error(`${error.error}: ${error.details.join(', ')}`);
      }

      throw new Error(error.error || 'Failed to generate itinerary');
    }

    const data = await response.json();

    console.log('✅ Itinerary generated via TQA:', data.uuid);

    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Error generating itinerary:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate itinerary' },
      { status: 500 }
    );
  }
}
