# Agent Discovery - Quick Start Guide

## 🎯 What This Does

Automatically discovers travel agencies that sell Turkey tours by:
- ✅ Searching Google for agencies in cities with direct Istanbul flights
- ✅ Extracting company information (name, website, contact)
- ✅ Storing leads in database for outreach campaigns
- ✅ Targeting English-speaking countries with high tourism potential

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Get Google API Credentials

1. Go to: https://console.cloud.google.com/apis/credentials
2. Create a new API key
3. Enable "Custom Search API"
4. Go to: https://programmablesearchengine.google.com/
5. Create a new search engine (search the entire web)
6. Get your Search Engine ID

### Step 2: Add to Environment Variables

Edit `.env` file and add:
```
GOOGLE_SEARCH_API_KEY=your-api-key-here
GOOGLE_SEARCH_ENGINE_ID=your-search-engine-id-here
```

### Step 3: Run Discovery

```bash
# On server
cd ~/funny_new
npm run discover-agents
```

---

## 📋 Commands

```bash
# Discover new leads
npm run discover-agents

# View recent leads
npm run discover-agents view

# Export leads to CSV
npm run discover-agents export > leads.csv

# Add manual lead (for testing)
npm run discover-agents manual
```

---

## 🎯 What Gets Discovered

### Target Cities (Direct Flights to Istanbul):
**USA**: New York, Los Angeles, Chicago, Washington DC, Miami, Boston, San Francisco
**UK**: London, Manchester, Birmingham
**Canada**: Toronto, Montreal, Vancouver
**Australia**: Sydney, Melbourne

### Search Queries Used:
- "turkey tour packages [city]"
- "turkey tours travel agency [city]"
- "istanbul tours [city]"
- "cappadocia tours [city]"
- And more...

### Information Collected:
- Company name
- Website URL
- City & country
- Search query that found them
- Discovery date

---

## 📊 Expected Results

**Per Day** (with API limits):
- ~100-200 leads discovered
- ~50-100 unique agencies saved
- ~30-50 with valid websites

**Per Month**:
- 3,000+ leads
- 1,500+ unique agencies
- 500+ ready for outreach

---

## 💰 Business Value

### Lead to Partner Conversion:
1. **3,000 leads** discovered/month
2. **500 contacted** via email
3. **50 responses** (10% response rate)
4. **10 new partners** (20% conversion)

### Revenue Impact:
- 10 new partners @ €1,000 commission/month each
- **€10,000/month additional revenue**
- **€120,000/year from agent partnerships**

---

## 📧 Next Steps After Discovery

### 1. Review Leads
```bash
npm run discover-agents view
```

### 2. Export for Email Campaign
```bash
npm run discover-agents export > leads.csv
```

### 3. Send Outreach Emails
Use the email template from `AGENT_DISCOVERY_STRATEGY.md`:

**Subject**: Turkey Tour Partnership - 10% Commission

**Body**:
> Hi [Company Name],
>
> I noticed you offer tours to your clients. We're Funny Tourism, a licensed
> tour operator in Turkey, and we'd love to partner with you.
>
> Benefits:
> ✅ 10% commission on all bookings
> ✅ Ready-made Turkey packages
> ✅ 24/7 English support
> ✅ Direct flights from [their city] to Istanbul
>
> Interested in learning more?

### 4. Track Responses
Mark leads as contacted in database or admin panel (future feature)

---

## 🔧 Troubleshooting

### "No results found"
- Check if Google API keys are set in `.env`
- Verify API quota hasn't been exceeded (100 free searches/day)
- Check internet connection

### "Duplicate leads"
- This is normal! Script skips duplicates automatically
- Shows as "⏭️ Skipped (duplicate)"

### "API quota exceeded"
- Free tier: 100 searches/day
- Upgrade to paid plan for more: https://developers.google.com/custom-search/v1/overview
- Or spread discovery across multiple days

---

## 🤖 Automation (Optional)

### Run Daily at 9 AM:
```bash
# Add to crontab
crontab -e

# Add this line:
0 9 * * * cd ~/funny_new && npm run discover-agents >> ~/logs/agent-discovery.log 2>&1
```

This will automatically discover new leads every morning!

---

## 📈 View Your Leads

### In Database:
```bash
cd ~/funny_new
npx prisma studio
```

Then go to: http://localhost:5555 and select `AgentLead` table

### Via SQL:
```sql
SELECT * FROM AgentLead
WHERE contacted = false
ORDER BY discovered DESC
LIMIT 50;
```

---

## 🎯 Success Metrics

Track these weekly:
- [ ] Leads discovered: ___
- [ ] Emails sent: ___
- [ ] Responses received: ___
- [ ] Partnerships formed: ___
- [ ] Commission revenue: €___

---

## 📚 Full Documentation

- **Strategy**: `AGENT_DISCOVERY_STRATEGY.md` - Complete marketing plan
- **Import**: `AGENT_IMPORT_GUIDE.md` - Bulk import existing agents
- **This Guide**: Quick start for automated discovery

---

## ✅ You're Ready!

1. ✅ Database table created (`AgentLead`)
2. ✅ Discovery script ready (`npm run discover-agents`)
3. ✅ Targeting cities with direct flights
4. ✅ Export to CSV for campaigns

**Start discovering leads now:**
```bash
npm run discover-agents
```

Good luck building your agent network! 🚀
