# Google Ads Conversion Tracking - Final Setup Steps

## ✅ What's Already Done

Your website now has:
- ✅ Google Ads tag (AW-17628441749) installed and verified
- ✅ Conversion tracking code integrated in all booking flows
- ✅ Quote request tracking on inquiry form
- ✅ Package booking tracking
- ✅ Daily tour booking tracking
- ✅ Transfer booking tracking

---

## 📋 What You Need to Do Now

### Step 1: Create Conversion Actions in Google Ads

Follow the guide in `GOOGLE_ADS_CONVERSION_ACTIONS_GUIDE.md` to create these 4 conversion actions:

1. **Quote Request** (Lead - €50 value)
2. **Package Booking** (Purchase - dynamic value)
3. **Daily Tour Booking** (Purchase - dynamic value)
4. **Transfer Booking** (Purchase - dynamic value)

### Step 2: Get Your Conversion Labels

After creating each conversion action in Google Ads:

1. Go to **Tools & Settings** → **Conversions**
2. Click on the conversion action name
3. Click **Tag setup**
4. Select **Use Google Tag Assistant or edit tag directly**
5. You'll see code like this:

```javascript
gtag('event', 'conversion', {
    'send_to': 'AW-17628441749/AbC1DeFgHiJ2KlMnO'  // ← This is your conversion label
});
```

6. Copy the part after the `/` (e.g., `AbC1DeFgHiJ2KlMnO`)

You'll have 4 labels:
- **QUOTE_REQUEST_LABEL**: _____________
- **PACKAGE_BOOKING_LABEL**: _____________
- **DAILY_TOUR_LABEL**: _____________
- **TRANSFER_LABEL**: _____________

### Step 3: Update Your Website Code

Once you have all 4 conversion labels, update the file `lib/gtag.ts`:

**Current code (lines 24-68):**
```typescript
export const trackQuoteRequest = (value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: `${GA_ADS_ID}/REPLACE_WITH_QUOTE_LABEL`, // ← Replace this
      value: value || 1,
      currency: 'EUR',
    });
  }
};
```

**Replace the placeholders:**
1. Line 27: Replace `REPLACE_WITH_QUOTE_LABEL` with your actual quote label
2. Line 38: Replace `REPLACE_WITH_BOOKING_LABEL` with your package booking label
3. Line 50: Replace `REPLACE_WITH_DAILY_TOUR_LABEL` with your daily tour label
4. Line 62: Replace `REPLACE_WITH_TRANSFER_LABEL` with your transfer label

**Example after replacement:**
```typescript
export const trackQuoteRequest = (value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: `${GA_ADS_ID}/AbC1DeFgHiJ2KlMnO`, // ← Your actual label
      value: value || 1,
      currency: 'EUR',
    });
  }
};
```

### Step 4: Deploy Updated Code

After updating `lib/gtag.ts`:

```bash
# On your server
git pull
npm run build
pm2 restart funny_new
```

If using Cloudflare:
- Clear cache in Cloudflare dashboard
- Wait 2-3 minutes for changes to propagate

---

## 🧪 Testing Your Conversions

### Method 1: Google Tag Assistant (Recommended)

1. Install [Google Tag Assistant Chrome Extension](https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/kejbdjndbnbjgmefkgdddjlbokphdefk)
2. Visit your website: https://www.funnytourism.com
3. Click Tag Assistant icon → Enable
4. Perform a test booking (quote request, package booking, etc.)
5. Check Tag Assistant - you should see "conversion" events firing

### Method 2: Google Ads Conversion Dashboard

1. Go to **Tools & Settings** → **Conversions**
2. Check conversion status:
   - **No recent conversions**: Normal for new setup (wait 24-48 hours)
   - **Unverified**: Tag firing but not yet verified (normal, give it time)
   - **Recording conversions**: ✅ Working!

### Method 3: Real Test Booking

1. Complete a real booking on your website
2. Check if you receive the booking email
3. Wait 24 hours
4. Check Google Ads dashboard for conversion data

---

## 📊 What You'll See in Google Ads

Once conversions start recording, you'll see:

### In the Campaigns Dashboard:
- **Conversions** column showing total conversions
- **Conv. value** showing revenue generated
- **Cost / conv.** showing cost per acquisition

### In the Conversions Report:
- Individual conversion action performance
- Conversion rate by campaign/ad group
- Conversion value by source

### In Attribution Reports:
- Which keywords led to bookings
- Conversion path analysis
- Time to conversion data

---

## 🎯 Optimizing with Conversion Data

Once you have conversion data (usually after 30+ conversions):

### 1. Enable Smart Bidding
- Switch to **Maximize Conversions** or **Target ROAS**
- Let Google optimize bids automatically
- Requires at least 30 conversions in 30 days

### 2. Create Conversion-Based Audiences
- Remarketing to quote requesters who didn't book
- Exclude recent converters from ads
- Similar audiences based on converters

### 3. Optimize Ad Copy
- See which ads drive bookings (not just clicks)
- Focus budget on high-converting ads
- A/B test landing pages

### 4. Keyword Optimization
- Pause keywords with high cost, low conversions
- Increase bids on keywords driving bookings
- Add negative keywords for non-converters

---

## 🚨 Troubleshooting

### Conversions Not Showing Up?

**Wait 24-48 hours** - Google Ads has a delay in reporting conversions.

**Check these:**
1. ✅ Tag is installed (verify at https://tagassistant.google.com)
2. ✅ Conversion labels are correct (no typos)
3. ✅ Website is live and bookings are working
4. ✅ Code has been deployed (`git log -1` shows latest commit)

### Conversions Showing But Values Wrong?

- Check if currency is set to EUR in conversion settings
- Verify `totalPrice` is being passed correctly in tracking calls
- Check browser console for JavaScript errors

### Duplicate Conversions?

- Ensure count setting is correct:
  - Quote Request: **One** (count once per click)
  - Bookings: **Every** (count every conversion)

---

## 📞 Need Help?

1. **Google Ads Support**: Available 24/7 in your Google Ads account
2. **Tag Issues**: Use Google Tag Assistant Chrome extension
3. **Code Issues**: Check browser console (F12) for JavaScript errors

---

## ✅ Conversion Tracking Checklist

- [ ] Created 4 conversion actions in Google Ads
- [ ] Copied all 4 conversion labels
- [ ] Updated `lib/gtag.ts` with actual labels (replaced all 4 placeholders)
- [ ] Deployed code to server (`git pull`, `npm run build`, `pm2 restart`)
- [ ] Cleared Cloudflare cache (if applicable)
- [ ] Tested with Google Tag Assistant
- [ ] Waited 24-48 hours for first conversion data
- [ ] Verified conversions appearing in Google Ads dashboard
- [ ] Set up conversion-based smart bidding (after 30+ conversions)

---

## 🎉 What's Next After Conversion Tracking Works?

1. **Set Up Sitelinks**: Use guide in `GOOGLE_ADS_SITELINKS.md`
2. **Launch First Campaign**: Start with Search campaign targeting Turkey tours
3. **Monitor Performance**: Check daily for first 2 weeks
4. **Optimize**: Adjust bids based on conversion data
5. **Scale**: Increase budget for profitable campaigns

---

**Current Status**: ✅ Google Ads tag verified, conversion tracking code installed
**Next Action**: Create 4 conversion actions in Google Ads and get labels
**File to Update**: `lib/gtag.ts` (4 placeholder labels)
**Estimated Time**: 15-20 minutes to create actions + 5 minutes to update code
