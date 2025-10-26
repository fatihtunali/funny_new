import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
) {
  try {
    const { uuid } = await params;
    const tqaUrl = process.env.TQA_API_URL || 'https://travelquoteai.com';
    const tqaAuthToken = process.env.TQA_AUTH_TOKEN;

    console.log(`📖 Fetching itinerary ${uuid} from TQA...`);

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (tqaAuthToken) {
      headers['Authorization'] = `Bearer ${tqaAuthToken}`;
    }

    const response = await fetch(`${tqaUrl}/api/itinerary/${uuid}`, {
      headers,
    });

    if (!response.ok) {
      console.error(`❌ TQA returned ${response.status} for itinerary ${uuid}`);
      return NextResponse.json(
        { error: 'Itinerary not found' },
        { status: 404 }
      );
    }

    const data = await response.json();
    console.log(`✅ Successfully fetched itinerary ${uuid}`);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('❌ Error fetching itinerary:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch itinerary' },
      { status: 500 }
    );
  }
}
