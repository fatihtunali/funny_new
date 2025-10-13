# Ruzgar Gucu AI Integration Guide

This document explains how to connect your Ruzgar Gucu AI system (ruzgargucu.com) to Funny Tourism (funnytourism.com) for seamless itinerary import.

## Overview

The integration allows you to:
1. Create detailed itineraries in Ruzgar Gucu AI
2. Export them as JSON
3. Import them into Funny Tourism with one click
4. Automatically publish on funnytourism.com

## Integration Architecture

```
Ruzgar Gucu AI → Export JSON → Funny Tourism Import API → MySQL Database → Live Website
```

## Step 1: Set Up Export API on Ruzgar Gucu (Required)

You need to create an export endpoint on your Ruzgar Gucu system to expose itinerary data.

### Option A: Create Export API Endpoint (Recommended)

Create this file on ruzgargucu.com:

**File:** `app/api/export/itinerary/[id]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get itinerary from your database
    const itinerary = await getItineraryById(params.id); // Your function

    // Format for Funny Tourism
    const exportData = {
      packageId: itinerary.packageId || "AUTO",
      packageType: itinerary.packageType || "WITH_HOTEL",
      title: itinerary.title,
      slug: itinerary.slug || slugify(itinerary.title),
      duration: itinerary.duration,
      description: itinerary.description,
      destinations: itinerary.destinations,
      image: itinerary.image || "/images/hotelwithpackage.jpg",
      pdfUrl: itinerary.pdfUrl || null,
      highlights: itinerary.highlights || [],
      included: itinerary.included || [],
      notIncluded: itinerary.notIncluded || [],
      itinerary: itinerary.itinerary || [],
      pricing: itinerary.pricing || {},
      hotels: itinerary.hotels || null,
      port: itinerary.port || null,
      pickupType: itinerary.pickupType || null,
    };

    return NextResponse.json(exportData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to export itinerary' },
      { status: 500 }
    );
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
```

### Option B: Manual JSON Export (Simpler)

Add an "Export JSON" button in your Ruzgar Gucu UI:

```typescript
function ExportButton({ itinerary }: { itinerary: Itinerary }) {
  const handleExport = () => {
    const exportData = {
      packageId: itinerary.packageId || "AUTO",
      packageType: itinerary.packageType || "WITH_HOTEL",
      title: itinerary.title,
      slug: itinerary.slug || slugify(itinerary.title),
      duration: itinerary.duration,
      description: itinerary.description,
      destinations: itinerary.destinations,
      image: itinerary.image || "/images/hotelwithpackage.jpg",
      highlights: itinerary.highlights || [],
      included: itinerary.included || [],
      notIncluded: itinerary.notIncluded || [],
      itinerary: itinerary.itinerary || [],
      pricing: itinerary.pricing || {},
      hotels: itinerary.hotels || null,
    };

    // Copy to clipboard
    navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
    alert('JSON copied to clipboard! Paste it in Funny Tourism import page.');
  };

  return (
    <button onClick={handleExport} className="btn-primary">
      Export to Funny Tourism
    </button>
  );
}
```

## Step 2: Use the Import Feature on Funny Tourism

### Method 1: Import from URL (If you created Export API)

1. Go to [https://www.funnytourism.com/admin/import](https://www.funnytourism.com/admin/import)
2. Click "Import from URL" tab
3. Enter the export URL: `https://ruzgargucu.com/api/export/itinerary/123`
4. Click "Import from URL"
5. Done! The itinerary is now live on funnytourism.com

### Method 2: Import from JSON (Simpler)

1. In Ruzgar Gucu AI, create your itinerary
2. Click "Export to Funny Tourism" button (copies JSON to clipboard)
3. Go to [https://www.funnytourism.com/admin/import](https://www.funnytourism.com/admin/import)
4. Click "Import from JSON" tab
5. Paste the JSON data
6. Click "Import from JSON"
7. Done!

## Data Format

The JSON format expected by Funny Tourism:

```json
{
  "packageId": "01",
  "packageType": "WITH_HOTEL",
  "title": "Istanbul & Cappadocia Adventure",
  "slug": "istanbul-cappadocia-adventure",
  "duration": "5 Nights / 6 Days",
  "description": "Experience the magic of Istanbul and Cappadocia...",
  "destinations": "Istanbul, Cappadocia",
  "image": "/images/cappadociaballoonride.jpg",
  "highlights": [
    "Hot air balloon ride over Cappadocia",
    "Blue Mosque and Hagia Sophia visits",
    "Underground city exploration"
  ],
  "included": [
    "5 nights accommodation",
    "Airport transfers",
    "Professional English-speaking guide"
  ],
  "notIncluded": [
    "International flights",
    "Personal expenses",
    "Tips and gratuities"
  ],
  "itinerary": [
    {
      "day": 1,
      "title": "Arrival in Istanbul",
      "description": "Upon arrival at Istanbul Airport, you'll be met by our representative and transferred to your hotel. After check-in, spend the rest of the day at leisure exploring the vibrant streets of Istanbul. Overnight in Istanbul.",
      "meals": "-"
    },
    {
      "day": 2,
      "title": "Istanbul Old City Tour",
      "description": "After breakfast, embark on a full-day tour of Istanbul's historic peninsula. Visit the magnificent Blue Mosque with its stunning blue Iznik tiles and six minarets. Continue to Hagia Sophia, a UNESCO World Heritage site and architectural masterpiece that served as a church, mosque, and now museum. Explore the ancient Hippodrome, once the sporting and social center of Constantinople. After lunch, visit the opulent Topkapi Palace, home to Ottoman sultans for nearly 400 years. End your day at the Grand Bazaar, one of the world's oldest covered markets with over 4,000 shops. Return to hotel. Overnight in Istanbul.",
      "meals": "B/L"
    }
  ],
  "pricing": {
    "paxTiers": {
      "2": {
        "threestar": { "double": 650, "triple": 650, "singleSupplement": 200 },
        "fourstar": { "double": 750, "triple": 750, "singleSupplement": 250 },
        "fivestar": { "double": 950, "triple": 950, "singleSupplement": 350 }
      },
      "4": {
        "threestar": { "double": 550, "triple": 550, "singleSupplement": 200 },
        "fourstar": { "double": 650, "triple": 650, "singleSupplement": 250 },
        "fivestar": { "double": 850, "triple": 850, "singleSupplement": 350 }
      }
    }
  },
  "hotels": {
    "threestar": ["Hotel Agan", "Hotel Sultania", "Cappadocia Stone Palace"],
    "fourstar": ["Sura Hagia Sophia", "Ramada Plaza", "Cappadocia Cave Suites"],
    "fivestar": ["CVK Park Bosphorus", "Hilton Istanbul", "Museum Hotel Cappadocia"]
  }
}
```

## Package Types

Funny Tourism supports 3 package types:

### 1. WITH_HOTEL (Multi-day with hotels)
```json
{
  "packageType": "WITH_HOTEL",
  "pricing": {
    "paxTiers": {
      "2": { "threestar": {...}, "fourstar": {...}, "fivestar": {...} }
    }
  },
  "hotels": { "threestar": [...], "fourstar": [...], "fivestar": [...] }
}
```

### 2. LAND_ONLY (Multi-day without hotels)
```json
{
  "packageType": "LAND_ONLY",
  "pricing": {
    "twoAdults": 415,
    "fourAdults": 369,
    "sixAdults": 355
  },
  "hotels": null
}
```

### 3. SHORE_EXCURSION (Single-day tours)
```json
{
  "packageType": "SHORE_EXCURSION",
  "port": "Istanbul",
  "pickupType": "both",
  "pricing": {
    "perPerson": {
      "1pax": 180,
      "2pax": 95,
      "3pax": 70,
      "4pax": 55
    },
    "children": {
      "age0to2": 0,
      "age3to6": 30,
      "age7to12": 40
    }
  }
}
```

## Benefits

1. **No Duplication**: Creates itineraries once in Ruzgar Gucu AI
2. **Quality Control**: Ruzgar Gucu AI ensures proper formatting and details
3. **Fast Publishing**: Import takes seconds
4. **Centralized Management**: Edit in one place, sync to website
5. **Consistent Format**: All itineraries follow the same structure

## Troubleshooting

### "Package with this slug already exists"
- The slug must be unique
- Change the slug in your JSON before importing
- Or delete the existing package on Funny Tourism

### "Invalid JSON format"
- Check for missing commas, brackets, or quotes
- Use a JSON validator: https://jsonlint.com
- Make sure itinerary descriptions are properly escaped

### Import succeeds but looks wrong
- Check the data format matches the examples above
- Verify pricing structure matches your package type
- Ensure itinerary array has proper day numbers (1, 2, 3, etc.)

## Support

For questions or issues:
- Check this documentation first
- Review the JSON format examples
- Test with a simple package before complex ones
- Contact: fatih@funnytourism.com

---

**Note**: This integration is designed to work alongside PDF extraction. You can use either:
- Ruzgar Gucu AI import (for existing itineraries)
- PDF extraction (for new packages from PDFs)
- Manual entry (for custom packages)
