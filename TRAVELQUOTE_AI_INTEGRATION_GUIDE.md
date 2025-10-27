# TravelQuoteAI Integration Guide for Funny Tourism

## 📋 Executive Summary

After analyzing the TravelQuoteAI system running on your server (port 3003), here's how you can integrate it with your Funny Tourism website (port 3000).

**What TravelQuoteAI Does:**
- AI-powered trip planning tool that generates personalized Turkey itineraries
- Uses Claude Sonnet 4.5 to create detailed day-by-day itineraries
- Already configured for Funny Tourism (Organization ID: 5)
- Stores customer data and generates quotes automatically

---

## 🏗️ System Architecture

### Current Setup on Server (134.209.137.11)

```
┌─────────────────────────────────────┐
│  https://funnytourism.com (Port 3000) │
│  Your main tourism website          │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  https://travelquoteai.com (Port 3003)│
│  TravelQuoteAI Platform             │
│  - Organization ID 5: Funny Tourism │
│  - Shared MySQL Database (tqa_db)  │
└─────────────────────────────────────┘
```

### Database Configuration

**TravelQuoteAI Database:** `tqa_db`
- **User:** tqa
- **Password:** Dlr235672.-Yt
- **Port:** 3306

**Your Organization (ID: 5) Details:**
```json
{
  "id": 5,
  "name": "Funny Tourism",
  "slug": "funny-tourism",
  "subdomain": "funny-tourism",
  "email": "info@funnytourism.com",
  "website": "https://www.funnytourism.com",
  "primary_color": "#115cd4",
  "secondary_color": "#bfcb15",
  "phone": "+90 532 585 87 86",
  "status": "active"
}
```

---

## 🔌 Integration Options

### Option 1: Direct Link/Embed (Easiest - No Code)

**Pros:**
- ✅ Zero coding required
- ✅ Fully functional immediately
- ✅ All features work out of the box
- ✅ Maintained by TravelQuoteAI team

**Cons:**
- ❌ Different domain/subdomain
- ❌ Branding may not match perfectly

**Implementation:**
Add a button/link to your website:

```jsx
// In your Next.js component (e.g., Hero.tsx or Navigation.tsx)
<Link
  href="https://travelquoteai.com/plan-trip?orgId=5"
  className="px-6 py-3 bg-blue-600 text-white rounded-lg"
>
  Plan Your Trip with AI
</Link>
```

**URL Format:**
```
https://travelquoteai.com/plan-trip?orgId=5
```

---

### Option 2: Iframe Embed (Medium - Minimal Code)

**Pros:**
- ✅ Appears on your domain
- ✅ Minimal setup
- ✅ All TQA features work

**Cons:**
- ❌ Iframe limitations (scrolling, height)
- ❌ SEO not optimal

**Implementation:**

```tsx
// Create: app/plan-trip/page.tsx
'use client';

export default function PlanTripPage() {
  return (
    <div className="min-h-screen">
      <iframe
        src="https://travelquoteai.com/plan-trip?orgId=5"
        className="w-full h-screen border-0"
        title="Plan Your Trip"
        allow="geolocation"
      />
    </div>
  );
}
```

Then add to your navigation:
```tsx
<Link href="/plan-trip">Plan Your Trip</Link>
```

---

### Option 3: API Integration (Advanced - Full Control)

**Pros:**
- ✅ Full control over UI/UX
- ✅ Perfect branding match
- ✅ Better SEO
- ✅ Can customize every aspect

**Cons:**
- ❌ More development work
- ❌ Need to maintain frontend code
- ❌ Must handle updates yourself

**How It Works:**

```
User fills form on your site
        ↓
POST to TQA API /api/itinerary/preview
        ↓
AI generates itinerary
        ↓
Saves to customer_itineraries table
        ↓
Returns UUID
        ↓
Redirect to /itinerary/[uuid]
```

---

## 🚀 Recommended Approach: API Integration

### Step 1: Create a "Plan Trip" Page on Funny Tourism

**File:** `app/plan-trip/page.tsx`

This would be a simplified version of TQA's plan-trip page with your branding.

**Key Features to Include:**
1. Multi-city destination selector with autocomplete
2. Number of nights per city
3. Start date, adults, children
4. Hotel category (3/4/5 star)
5. Tour type (Private/Group)
6. Contact information collection

### Step 2: City Autocomplete API

You'll need to fetch cities from TQA's database:

```tsx
// Create: app/api/tqa/cities/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';

  try {
    // Call TQA API
    const response = await fetch(
      `http://localhost:3003/api/cities?search=${encodeURIComponent(search)}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch cities');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching cities:', error);
    return NextResponse.json({ cities: [] }, { status: 500 });
  }
}
```

### Step 3: Generate Itinerary API

```tsx
// Create: app/api/tqa/generate-itinerary/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Call TQA's itinerary preview endpoint
    const response = await fetch('http://localhost:3003/api/itinerary/preview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        organization_id: 5, // Funny Tourism
        ...body,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate itinerary');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error generating itinerary:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate itinerary' },
      { status: 500 }
    );
  }
}
```

### Step 4: Frontend Form Component

```tsx
// Create: components/TripPlannerForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface CityNight {
  city: string;
  nights: number;
}

export default function TripPlannerForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    city_nights: [{ city: '', nights: 2 }] as CityNight[],
    start_date: '',
    adults: 2,
    children: 0,
    hotel_category: '4',
    tour_type: 'PRIVATE',
    special_requests: '',
    name: '',
    email: '',
    phone: ''
  });

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/tqa/generate-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city_nights: formData.city_nights.filter(cn => cn.city.trim() !== ''),
          start_date: formData.start_date,
          adults: formData.adults,
          children: formData.children,
          hotel_category: formData.hotel_category,
          tour_type: formData.tour_type,
          special_requests: formData.special_requests,
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate itinerary');
      }

      const data = await response.json();

      // Redirect to TQA's itinerary page (or build your own)
      if (data.uuid) {
        window.location.href = `https://travelquoteai.com/itinerary/${data.uuid}`;
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ... rest of form implementation
  return (
    <div>
      {/* Your form UI here */}
    </div>
  );
}
```

---

## 📊 Data Flow

### When a Customer Plans a Trip:

```
1. Customer fills form on funnytourism.com/plan-trip
   ↓
2. POST /api/tqa/generate-itinerary
   ↓
3. Your API calls TQA: http://localhost:3003/api/itinerary/preview
   ↓
4. TQA:
   - Validates input
   - Calls Claude AI to generate itinerary
   - Saves to customer_itineraries table
   - Returns UUID + itinerary data
   ↓
5. Redirect customer to: travelquoteai.com/itinerary/[uuid]
   OR
   Build your own itinerary display page
```

### Database Tables Used (in TQA's database)

**customer_itineraries:**
- Stores all generated itineraries
- Links to organization_id = 5 (Funny Tourism)
- Contains: customer info, preferences, AI-generated itinerary, pricing

**organizations:**
- Your company profile (ID: 5)

**hotels, tours, vehicles, entrance_fees:**
- Pricing database used by AI to build itineraries

---

## 🎨 UI/UX Recommendations

### Option A: Hybrid Approach (Recommended)

**Your website handles:**
- Landing page with trip planner form
- Destination search autocomplete
- Basic form inputs

**TravelQuoteAI handles:**
- AI generation (heavy lifting)
- Itinerary display page
- Booking request processing

**Benefits:**
- Lighter development on your side
- Leverage TQA's built-in itinerary viewer
- Focus on branding the entry point

### Option B: Full Custom UI

**Build everything yourself:**
- Plan trip form page
- Itinerary display page
- Booking request flow

**Benefits:**
- 100% brand consistency
- Full control
- No external links

**Cost:**
- More development time
- Must maintain parity with TQA features

---

## 🔐 Security Considerations

### Rate Limiting

TQA already implements rate limiting (5 requests/hour per IP for AI generation). Your API proxy should respect this.

### Input Validation

TQA validates all inputs server-side. You should also validate client-side for better UX:

```tsx
const validateFormData = (data: FormData) => {
  const errors: string[] = [];

  if (!data.name || data.name.length < 2) {
    errors.push('Name is required');
  }

  if (!data.email || !data.email.includes('@')) {
    errors.push('Valid email is required');
  }

  if (data.city_nights.length === 0) {
    errors.push('At least one destination is required');
  }

  // ... more validation

  return errors;
};
```

---

## 🧪 Testing Recommendations

### Local Testing Steps:

1. **Test City Autocomplete:**
```bash
curl http://localhost:3003/api/cities?search=ist
```

Expected response:
```json
{
  "cities": ["Istanbul", "Kusadasi", ...]
}
```

2. **Test Itinerary Generation:**
```bash
curl -X POST http://localhost:3003/api/itinerary/preview \
  -H "Content-Type: application/json" \
  -d '{
    "organization_id": 5,
    "city_nights": [{"city": "Istanbul", "nights": 3}],
    "start_date": "2025-06-01",
    "adults": 2,
    "children": 0,
    "hotel_category": "4",
    "tour_type": "PRIVATE",
    "customer_name": "Test User",
    "customer_email": "test@example.com",
    "customer_phone": "+905551234567"
  }'
```

3. **Test on Local Dev:**

Create a test page at `app/test-tqa/page.tsx`:

```tsx
'use client';

export default function TestTQA() {
  const testGenerate = async () => {
    const response = await fetch('/api/tqa/generate-itinerary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        city_nights: [{ city: 'Istanbul', nights: 3 }],
        start_date: '2025-06-01',
        adults: 2,
        children: 0,
        hotel_category: '4',
        tour_type: 'PRIVATE',
        special_requests: 'Test request',
        customer_name: 'Test User',
        customer_email: 'test@funnytourism.com',
        customer_phone: '+905551234567'
      })
    });

    const data = await response.json();
    console.log('Result:', data);
    alert(data.uuid ? 'Success! UUID: ' + data.uuid : 'Error: ' + data.error);
  };

  return (
    <div className="p-8">
      <button
        onClick={testGenerate}
        className="px-6 py-3 bg-blue-600 text-white rounded"
      >
        Test TQA Integration
      </button>
    </div>
  );
}
```

Visit `http://localhost:3000/test-tqa` and click the button.

---

## 📈 Next Steps

### Phase 1: Quick Win (1-2 days)
1. Add a "Plan Your Trip" link to navigation
2. Link directly to: `https://travelquoteai.com/plan-trip?orgId=5`
3. Test customer flow end-to-end

### Phase 2: Branded Entry (3-5 days)
1. Create `/plan-trip` page on funnytourism.com
2. Build simple form with your branding
3. POST to TQA API
4. Redirect to TQA for itinerary view

### Phase 3: Full Integration (1-2 weeks)
1. Build custom itinerary display page
2. Implement booking request flow
3. Add tracking/analytics
4. Test thoroughly

---

## 🆘 Support & Resources

### TravelQuoteAI API Endpoints

**Base URL:** `http://localhost:3003` (server-side)
**Public URL:** `https://travelquoteai.com` (production)

**Key Endpoints:**
- `GET /api/cities?search={query}` - City autocomplete
- `POST /api/itinerary/preview` - Generate itinerary
- `GET /itinerary/[uuid]` - View generated itinerary

### Database Access

If you need to query TQA data directly:

```bash
mysql -u tqa -p'Dlr235672.-Yt' tqa_db
```

**Useful Queries:**

```sql
-- View your organization's itineraries
SELECT id, uuid, customer_name, customer_email, destination,
       start_date, status, created_at
FROM customer_itineraries
WHERE organization_id = 5
ORDER BY created_at DESC
LIMIT 10;

-- View available cities
SELECT DISTINCT city FROM hotels WHERE status = 'active' ORDER BY city;

-- View your organization details
SELECT * FROM organizations WHERE id = 5;
```

---

## 🎯 Recommendation Summary

**For Quick Implementation (This Week):**
→ **Use Option 1: Direct Link**
- Add button to homepage/navigation
- Link to: `https://travelquoteai.com/plan-trip?orgId=5`
- Zero coding, works immediately

**For Branded Experience (Next Sprint):**
→ **Use Option 3: API Integration (Hybrid)**
- Build form page on funnytourism.com
- POST to TQA API
- Redirect to TQA for itinerary display
- Best balance of effort vs. control

**For Complete Control (Future):**
→ **Build Full Custom UI**
- Copy TQA's plan-trip page code to your repo
- Customize everything
- Host entirely on funnytourism.com

---

## 📞 Questions?

If you need clarification on any integration approach, I can:
1. Write the actual code for any option
2. Test the integration locally first
3. Deploy to production after testing

Which approach would you like to proceed with?
