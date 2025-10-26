import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';

export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    await requireAdmin();

    const tqaUrl = process.env.TQA_API_URL || 'https://travelquoteai.com';
    const orgId = process.env.TQA_ORG_ID || '5';
    const tqaAuthToken = process.env.TQA_AUTH_TOKEN;

    // Get filter parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';
    const source = searchParams.get('source') || 'all';

    console.log(`📋 Fetching itineraries for organization ${orgId} from TQA...`);
    console.log(`   Filters: status=${status}, source=${source}`);

    // Build query parameters
    const queryParams = new URLSearchParams();
    if (status !== 'all') queryParams.set('status', status);
    if (source !== 'all') queryParams.set('source', source);
    const queryString = queryParams.toString();

    // Fetch itineraries from TQA customer-requests endpoint
    const endpoint = `${tqaUrl}/api/customer-requests/${orgId}${queryString ? `?${queryString}` : ''}`;
    console.log(`🔗 Fetching from: ${endpoint}`);

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Add authorization if token is available
    if (tqaAuthToken) {
      headers['Authorization'] = `Bearer ${tqaAuthToken}`;
    }

    const response = await fetch(endpoint, { headers });

    if (!response.ok) {
      console.error(`❌ TQA returned ${response.status}`);

      if (response.status === 401) {
        return NextResponse.json({
          error: 'TQA authentication required. Please set TQA_AUTH_TOKEN in .env',
          itineraries: [],
          stats: { total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0, online: 0, manual: 0 }
        }, { status: 401 });
      }

      if (response.status === 404) {
        return NextResponse.json({
          error: 'TQA endpoint not found',
          itineraries: [],
          stats: { total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0, online: 0, manual: 0 }
        });
      }

      throw new Error(`TQA returned ${response.status}`);
    }

    const data = await response.json();
    console.log(`✅ Fetched ${data.itineraries?.length || 0} itineraries`);
    console.log(`📊 Stats:`, data.stats);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('❌ Error fetching itineraries:', error);
    return NextResponse.json(
      {
        error: error.message || 'Failed to fetch itineraries',
        itineraries: [],
        stats: { total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0, online: 0, manual: 0 }
      },
      { status: 500 }
    );
  }
}
