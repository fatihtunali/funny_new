# Google Ads Conversion Actions Setup Guide

## Overview
This guide will help you create 4 conversion actions in Google Ads to track the most valuable user actions on funnytourism.com.

---

## Step-by-Step Instructions

### 1. Access Google Ads Conversion Settings

1. Log in to your Google Ads account
2. Click **Tools & Settings** (wrench icon in top right)
3. Under "Measurement", click **Conversions**
4. Click the **+ New conversion action** button

---

## Conversion Action 1: Quote Request (Lead)

**Purpose**: Track when potential customers submit inquiry forms

### Settings:
- **Goal and action optimization**: Select "Submit lead form"
- **Conversion name**: `Quote Request`
- **Value**:
  - Select "Use the same value for each conversion"
  - Enter value: `50` (estimated lead value in EUR)
- **Count**: "One" (count only one conversion per interaction)
- **Conversion window**: 30 days
- **View-through conversion window**: 1 day
- **Attribution model**: "Data-driven" or "Last click"
- **Category**: "Submit lead form"

### After Creation:
- Copy the **Conversion Label** (looks like: `AW-17628441749/AbC1DeFgHiJ2KlMnO`)
- Save it as: **QUOTE_REQUEST_LABEL**

---

## Conversion Action 2: Package Booking (Purchase)

**Purpose**: Track when customers book multi-day tour packages

### Settings:
- **Goal and action optimization**: Select "Purchase"
- **Conversion name**: `Package Booking`
- **Value**:
  - Select "Use different values for each conversion"
  - Default value: `500` (average package price in EUR)
- **Count**: "Every" (count every conversion)
- **Conversion window**: 30 days
- **View-through conversion window**: 1 day
- **Attribution model**: "Data-driven" or "Last click"
- **Category**: "Purchase"

### After Creation:
- Copy the **Conversion Label**
- Save it as: **PACKAGE_BOOKING_LABEL**

---

## Conversion Action 3: Daily Tour Booking (Purchase)

**Purpose**: Track when customers book single-day tours

### Settings:
- **Goal and action optimization**: Select "Purchase"
- **Conversion name**: `Daily Tour Booking`
- **Value**:
  - Select "Use different values for each conversion"
  - Default value: `100` (average daily tour price in EUR)
- **Count**: "Every" (count every conversion)
- **Conversion window**: 30 days
- **View-through conversion window**: 1 day
- **Attribution model**: "Data-driven" or "Last click"
- **Category**: "Purchase"

### After Creation:
- Copy the **Conversion Label**
- Save it as: **DAILY_TOUR_LABEL**

---

## Conversion Action 4: Transfer Booking (Purchase)

**Purpose**: Track when customers book airport transfers

### Settings:
- **Goal and action optimization**: Select "Purchase"
- **Conversion name**: `Transfer Booking`
- **Value**:
  - Select "Use different values for each conversion"
  - Default value: `50` (average transfer price in EUR)
- **Count**: "Every" (count every conversion)
- **Conversion window**: 30 days
- **View-through conversion window**: 1 day
- **Attribution model**: "Data-driven" or "Last click"
- **Category**: "Purchase"

### After Creation:
- Copy the **Conversion Label**
- Save it as: **TRANSFER_LABEL**

---

## Important Notes

### How to Find Conversion Labels

After creating each conversion action:

1. Go to **Tools & Settings** → **Conversions**
2. Click on the conversion action name
3. Click **Tag setup** → **Use Google tag manager, Google Tag Assistant, or edit tag directly**
4. You'll see the conversion label in the format: `AW-17628441749/CONVERSION_LABEL_HERE`
5. Copy just the part after the `/` (e.g., `AbC1DeFgHiJ2KlMnO`)

### What to Do After Getting Labels

Once you have all 4 conversion labels, provide them to update the tracking code in `lib/gtag.ts`:

```
QUOTE_REQUEST_LABEL = [your label]
PACKAGE_BOOKING_LABEL = [your label]
DAILY_TOUR_LABEL = [your label]
TRANSFER_LABEL = [your label]
```

---

## Verification

After setup, you can test conversions:

1. Go to **Conversions** in Google Ads
2. You should see all 4 conversion actions listed
3. Within 24-48 hours, you should start seeing conversion data
4. Use Google Tag Assistant Chrome extension to verify tags are firing correctly

---

## Expected Results

Once implemented, you'll be able to:
- Track ROI for each ad campaign
- See which keywords lead to bookings vs just quotes
- Optimize bids based on conversion value
- Create remarketing audiences based on user actions
- Set up automated bidding strategies (Target ROAS, Maximize Conversions)

---

## Next Steps After Label Collection

1. Provide the 4 conversion labels
2. We'll update `lib/gtag.ts` with actual labels
3. We'll add tracking to booking success pages
4. We'll test conversions using Google Tag Assistant
5. We'll verify conversions appear in Google Ads dashboard

---

## Support

If you need help:
- Google Ads Help: https://support.google.com/google-ads/answer/6331314
- Contact Google Ads support directly from your account
