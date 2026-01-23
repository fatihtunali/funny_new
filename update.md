# FunnyTourism Affiliate Integration - TODO

## Completed (Dec 24, 2024)

### Travelpayouts Account Setup
- Registered FunnyTourism on Travelpayouts (Project ID: 483583)
- Added verification script to `app/layout.tsx`
- Deployed verification to server

### Affiliate Programs Connected
1. **Aviasales** - Connected (instant approval)
   - Commission: 1.1-1.3%
   - Widget ready to use

2. **Trip.com** - Request submitted (waiting ~48h for approval)
   - Commission: 1-5.5%

3. **DiscoverCars** - Request submitted (waiting ~48h for approval)
   - Commission: 23-54%
   - 365-day cookie duration

### Flights Page Created
- Created `app/[locale]/flights/page.tsx` with Aviasales widget
- Widget parameters: trs=483583, shmarker=692458, currency=usd

---

## TODO Tomorrow

### 1. Add Flights Link to Navigation
Add to `components/Navigation.tsx`:

**Desktop nav (after destinations link, around line 71):**
```tsx
<Link href="/flights" className="text-sm text-gray-700 hover:text-primary-600 transition-colors whitespace-nowrap">
  {t('flights')}
</Link>
```

**Mobile nav (after destinations link, around line 148):**
```tsx
<Link href="/flights" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded" onClick={closeMenu}>
  {t('flights')}
</Link>
```

### 2. Add Translation for "flights"
Add to translation files in `messages/`:
- `en.json`: `"flights": "Flights"`
- `tr.json`: `"flights": "Uçuşlar"`
- Other language files as needed

### 3. Deploy to Server
```bash
cd /c/Users/fatih/Desktop/funny
bash deploy.sh
```

### 4. Test Flight Search Widget
- Visit https://www.funnytourism.com/en/flights
- Verify widget loads correctly
- Test search functionality

### 5. Check Affiliate Approvals
- Log into Travelpayouts
- Check if Trip.com and DiscoverCars approved
- If approved, add car rental widget to site

---

## Server Details (for reference)
- Server: 142.93.136.228
- User: root
- Path: /home/funnytourism/funnytourism/app
- PM2 process: funnytourism
