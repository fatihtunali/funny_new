# 🎯 Google Ads Conversion Tracking Setup

## ✅ What's Already Done

1. **Google Ads Tag Installed** ✅
   - Conversion ID: `AW-17628441749`
   - Installed in: `app/layout.tsx`
   - Loads on every page

2. **Conversion Tracking Code Added** ✅
   - Quote Request tracking: `app/inquiry/page.tsx`
   - Utility functions: `lib/gtag.ts`

---

## 🔧 Next Steps: Create Conversion Actions in Google Ads

### Step 1: Access Conversion Actions

1. Login to **Google Ads** → https://ads.google.com
2. Click **Tools & Settings** (wrench icon)
3. Under **Measurement**, click **Conversions**
4. Click **+ New conversion action**

---

### Step 2: Create 4 Conversion Actions

Create these conversion actions one by one:

---

### **Conversion 1: Quote Request** (Primary)

**Setup:**
- Goal: **Submit lead form**
- Source: **Website**
- Category: **Submit lead form**
- Name: `Quote Request - Inquiry Form`
- Value: **Use the same value for each conversion** → Enter `50` (estimated lead value in EUR)
- Count: **One** (only count once per user)
- Conversion window: **30 days**
- View-through window: **1 day**
- Attribution model: **Data-driven** (or Last click if unavailable)

**After creating:**
- Copy the **Conversion Label** (looks like `AbC-D3fG5HIjKLmNOp`)
- Update in `lib/gtag.ts` → Replace `REPLACE_WITH_QUOTE_LABEL`

---

### **Conversion 2: Package Booking**

**Setup:**
- Goal: **Purchase**
- Source: **Website**
- Category: **Purchase**
- Name: `Package Booking - Completed`
- Value: **Use transaction-specific values**
- Count: **Every** (count each purchase)
- Conversion window: **90 days** (packages have longer consideration)
- View-through window: **1 day**
- Attribution model: **Data-driven**

**After creating:**
- Copy the **Conversion Label**
- Update in `lib/gtag.ts` → Replace `REPLACE_WITH_BOOKING_LABEL`

---

### **Conversion 3: Daily Tour Booking**

**Setup:**
- Goal: **Purchase**
- Source: **Website**
- Category: **Purchase**
- Name: `Daily Tour Booking - Completed`
- Value: **Use transaction-specific values**
- Count: **Every**
- Conversion window: **30 days**
- View-through window: **1 day**
- Attribution model: **Data-driven**

**After creating:**
- Copy the **Conversion Label**
- Update in `lib/gtag.ts` → Replace `REPLACE_WITH_DAILY_TOUR_LABEL`

---

### **Conversion 4: Transfer Booking**

**Setup:**
- Goal: **Purchase**
- Source: **Website**
- Category: **Purchase**
- Name: `Transfer Booking - Completed`
- Value: **Use transaction-specific values**
- Count: **Every**
- Conversion window: **14 days** (transfers are immediate need)
- View-through window: **1 day**
- Attribution model: **Data-driven**

**After creating:**
- Copy the **Conversion Label**
- Update in `lib/gtag.ts` → Replace `REPLACE_WITH_TRANSFER_LABEL`

---

## 📝 Update Conversion Labels

After creating all 4 conversions, update the file `lib/gtag.ts`:

```typescript
// BEFORE (current):
send_to: `${GA_ADS_ID}/REPLACE_WITH_QUOTE_LABEL`

// AFTER (with your actual label):
send_to: `${GA_ADS_ID}/AbC-D3fG5HIjKLmNOp`
```

**Example of completed file:**
```typescript
export const trackQuoteRequest = (value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: 'AW-17628441749/xYz123ABCdefGHI',  // ← Your actual label
      value: value || 1,
      currency: 'EUR',
    });
  }
};
```

---

## 🧪 Step 3: Test Your Conversions

### Testing Quote Request:

1. Open your site: https://funnytourism.com/inquiry
2. Open browser **DevTools** (F12) → **Console** tab
3. Fill out the quote form and submit
4. Look for conversion event in console
5. Check Google Ads → **Conversions** (may take 24-48 hours to show)

### Verify Tag is Working:

1. Install **Google Tag Assistant** Chrome extension
2. Visit your site
3. Click extension → Should show:
   - ✅ Google Analytics: G-5FM0WYP1P4
   - ✅ Google Ads: AW-17628441749

---

## 📊 Where to Add Booking Conversions

Once you have conversion labels, add tracking to booking success pages:

### Package Bookings:
File: `app/booking/success/page.tsx` (or wherever booking completes)
```typescript
import { trackPackageBooking } from '@/lib/gtag';

// After successful booking:
trackPackageBooking(totalPrice, bookingReference);
```

### Daily Tour Bookings:
File: Daily tour booking success page
```typescript
import { trackDailyTourBooking } from '@/lib/gtag';

// After successful booking:
trackDailyTourBooking(totalPrice, bookingReference);
```

### Transfer Bookings:
File: Transfer booking success page
```typescript
import { trackTransferBooking } from '@/lib/gtag';

// After successful booking:
trackTransferBooking(totalPrice, bookingReference);
```

---

## 🎯 Conversion Goals & Expected Values

| Conversion | Avg Value (EUR) | Monthly Target | Priority |
|------------|-----------------|----------------|----------|
| Quote Request | €50 (lead value) | 50-100 | High |
| Package Booking | €800-1500 | 10-30 | Highest |
| Daily Tour | €50-150 | 30-60 | Medium |
| Transfer | €30-80 | 20-40 | Low |

---

## 🚀 Campaign Optimization

### Primary Conversion Goal:
- **Quote Requests** - Optimize for volume of qualified leads

### Secondary Goals:
- **Package Bookings** - High value, optimize for ROAS
- **Daily Tours** - Quick purchases, optimize for conversions
- **Transfers** - Upsell opportunity

### Recommended Bidding Strategies:

**Search Campaign (Packages):**
- Bidding: **Maximize Conversions** (with target CPA €30-50)
- Primary goal: Quote Requests
- Secondary: Package Bookings

**Performance Max Campaign:**
- Bidding: **Maximize Conversion Value** (with target ROAS 300%)
- Use all conversion goals
- Let AI optimize across channels

---

## 📈 Success Metrics

**Week 1-2:**
- ✅ Tag firing correctly
- ✅ Conversions showing in Google Ads
- ✅ CTR: 3-8%

**Week 3-4:**
- ✅ Conversion rate: 2-5%
- ✅ Cost per quote: €20-40
- ✅ Cost per booking: €100-200

**Month 2+:**
- ✅ ROAS: 300-500%
- ✅ Monthly revenue from ads: €5,000-15,000
- ✅ CAC (Customer Acquisition Cost): <20% of booking value

---

## ✅ Final Checklist

- [x] Google Ads tag installed (AW-17628441749)
- [x] Quote request tracking added
- [ ] Create 4 conversion actions in Google Ads
- [ ] Copy conversion labels to `lib/gtag.ts`
- [ ] Test quote request conversion
- [ ] Add booking conversion tracking (when ready)
- [ ] Add sitelinks (see GOOGLE_ADS_SITELINKS.md)
- [ ] Launch first campaign
- [ ] Monitor for 7 days
- [ ] Optimize based on data

---

## 📞 Support

**Google Ads Resources:**
- Help: https://support.google.com/google-ads
- Tag Assistant: https://tagassistant.google.com
- Analytics Debugger: Chrome extension "Google Analytics Debugger"

**Next Steps:**
1. Create conversion actions (instructions above)
2. Update conversion labels in code
3. Test conversions
4. Launch first campaign!

**Ready to track conversions and optimize Google Ads! 📊**
