# Email Outreach System - Setup Guide

## Overview

Automated email campaign system for sending partnership invitations to discovered travel agencies. Features professional HTML templates, daily limits, BCC tracking, and progress monitoring.

## Features

- ✅ **Professional HTML Email Template** - Styled with Funny Tourism branding and logo
- ✅ **Daily Limit Protection** - Maximum 100 emails per day to avoid spam filters
- ✅ **BCC Tracking** - All emails BCC'd to info@funnytourism.com
- ✅ **Progress Tracking** - Marks leads as contacted in database
- ✅ **Excel Export** - Export leads to CSV format
- ✅ **Status Dashboard** - Real-time campaign statistics
- ✅ **Smart Delay** - 2-second pause between emails

## Email Template

The email includes:

**Subject**: Turkey Tour Partnership Opportunity - 10% Commission

**Content**:
- Funny Tourism logo header
- Personalized greeting with company name and location
- Partnership benefits (10% commission, direct flights, 24/7 support, etc.)
- Popular package highlights with pricing
- Call-to-action button linking to agent registration
- Professional signature with contact details
- Unsubscribe footer text

## SMTP Configuration

### Step 1: Choose Email Provider

#### Option A: Gmail (Recommended for Testing)

1. Go to Google Account Settings → Security
2. Enable 2-Step Verification
3. Generate App Password:
   - Search for "App passwords"
   - Select "Mail" and your device
   - Copy the 16-character password

#### Option B: SendGrid (Recommended for Production)

1. Sign up at https://sendgrid.com (free tier: 100 emails/day)
2. Create API key with "Mail Send" permissions
3. Verify sender email address

#### Option C: AWS SES (For Scale)

1. Sign up for AWS SES
2. Verify domain or email
3. Request production access (starts in sandbox mode)

### Step 2: Add Credentials to .env

Add these variables to your `.env` file:

**For Gmail:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=info@funnytourism.com
SMTP_PASSWORD=your-16-char-app-password
SMTP_FROM=info@funnytourism.com
```

**For SendGrid:**
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=SG.your-sendgrid-api-key
SMTP_FROM=info@funnytourism.com
```

**For AWS SES:**
```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=your-aws-smtp-username
SMTP_PASSWORD=your-aws-smtp-password
SMTP_FROM=info@funnytourism.com
```

## Usage

### Check Campaign Status

```bash
npm run send-outreach status
```

Output:
```
📊 Email Campaign Status:

   Total leads with email: 562
   Contacted: 0
   Remaining: 562
   Sent today: 0/100
```

### Send Emails (Manual)

```bash
npm run send-outreach
```

Output:
```
📧 Starting Agent Outreach Campaign...

✅ Email server connection verified

📊 Daily Email Status:
   Sent today: 0
   Daily limit: 100
   Remaining: 100

📬 Sending to 100 agencies...

✅ ABC Travel Agency (New York, USA)
✅ XYZ Tours (London, UK)
...

📊 Outreach Summary:
   ✅ Successfully sent: 98
   ❌ Failed: 2
   📧 Total sent today: 98/100
```

### Export Leads to Excel

```bash
npm run send-outreach export > leads.csv
```

Then open `leads.csv` in Excel or Google Sheets.

## Automated Daily Sending

### Set Up Cron Job (Production Server)

SSH into server and add cron job:

```bash
crontab -e
```

Add this line to send emails daily at 10:00 AM:

```
0 10 * * * cd /home/funny/funny_new && npm run send-outreach >> /home/funny/logs/email-outreach.log 2>&1
```

**Alternative schedules:**

```bash
# Every day at 9:00 AM
0 9 * * * cd /home/funny/funny_new && npm run send-outreach

# Monday to Friday at 10:00 AM
0 10 * * 1-5 cd /home/funny/funny_new && npm run send-outreach

# Twice daily (10 AM and 3 PM)
0 10,15 * * * cd /home/funny/funny_new && npm run send-outreach
```

### View Logs

```bash
tail -f ~/logs/email-outreach.log
```

## Daily Limit Logic

The system automatically prevents sending more than 100 emails per day:

1. **Counts emails sent today** - Checks `contacted: true` records updated today
2. **Calculates remaining** - `100 - sent_today`
3. **Fetches only remaining leads** - Gets next batch of uncontacted leads
4. **Stops at limit** - If limit reached, waits until tomorrow

Example:
- Day 1: Sends 100 emails → Daily limit reached
- Day 2: Sends next 100 emails → Daily limit reached
- Day 3: Sends next 100 emails → etc.

With 562 leads, it will take **6 days** to contact everyone (100+100+100+100+100+62).

## Email Content Personalization

Each email is personalized with:

- **Company Name**: "Dear ABC Travel Agency Team,"
- **City**: "Direct Flights from New York to Istanbul"
- **Country**: "I noticed that you offer travel services in New York, USA"

## Tracking & Analytics

### Database Tracking

Each sent email updates the AgentLead record:

```typescript
{
  contacted: true,  // Marks as contacted
  notes: "[Outreach email sent: 2025-01-15T10:30:00Z]"  // Appends timestamp
}
```

### BCC Archive

All emails are BCC'd to `info@funnytourism.com`, creating an automatic archive for:

- **Response tracking** - See who replies
- **Compliance** - Proof of sent emails
- **Quality control** - Review actual sent content
- **Follow-up** - Identify interested agencies

## Email Deliverability Tips

### Improve Delivery Rates

1. **Warm Up Your Domain**
   - Start with 10-20 emails/day for first week
   - Gradually increase to 100/day over 2-3 weeks

2. **SPF, DKIM, DMARC Records**
   - Add proper DNS records for funnytourism.com
   - Verify with mail-tester.com

3. **Clean Email List**
   - Remove invalid emails before sending
   - Use email verification service (e.g., ZeroBounce)

4. **Monitor Bounce Rate**
   - Keep bounce rate below 5%
   - Remove bounced emails from list

5. **Track Opens/Clicks** (Optional)
   - Add tracking pixels
   - Use link shorteners with analytics

### Avoid Spam Filters

✅ **Good Practices:**
- Personalized content (company name, location)
- Professional from address (info@funnytourism.com)
- Clear unsubscribe option
- Legitimate business purpose
- 2-second delay between sends

❌ **Avoid:**
- ALL CAPS subject lines
- Too many exclamation marks!!!
- Misleading subject lines
- Purchased email lists
- Sending too fast (rate limiting)

## Troubleshooting

### Error: "Email server connection failed"

**Solution**: Check SMTP credentials in `.env`

```bash
# Test SMTP connection
npm run test-email
```

### Error: "Daily limit reached"

**Solution**: Wait until tomorrow, or increase limit in `scripts/send-agent-outreach.ts`:

```typescript
const DAILY_LIMIT = 200; // Increase to 200
```

### Error: "Authentication failed"

**Gmail**: Make sure you're using App Password, not regular password
**SendGrid**: Verify username is exactly `apikey`
**AWS SES**: Check SMTP credentials (different from AWS access keys)

### Emails Going to Spam

1. **Set up SPF record**:
   ```
   v=spf1 include:_spf.google.com ~all
   ```

2. **Set up DKIM** (via Gmail/SendGrid settings)

3. **Test with mail-tester.com**:
   - Send test email to the address they provide
   - Check spam score (aim for 10/10)

### No Emails Being Sent

Check campaign status:

```bash
npm run send-outreach status
```

Verify leads exist:
```bash
npx prisma studio
# Navigate to AgentLead model
# Check: email field is not null, contacted = false
```

## Response Handling

### Monitor Replies

Check `info@funnytourism.com` inbox daily for:

- ✅ **Interested Agencies** - Forward to sales team
- ❌ **Unsubscribe Requests** - Mark as contacted, add note
- ❓ **Questions** - Respond with package details
- 🚫 **Bounce Backs** - Update email or remove lead

### Convert to Agent

When agency wants to partner:

1. Send them partnership agreement
2. Create agent account:
   ```bash
   npm run create-agent
   ```
3. Update AgentLead record:
   ```typescript
   convertedToAgent: true
   ```

## Performance Metrics

### Track These KPIs

- **Total Sent**: Cumulative emails sent
- **Delivery Rate**: (Sent - Bounced) / Sent × 100%
- **Open Rate**: Opens / Delivered × 100% (if tracking)
- **Reply Rate**: Replies / Delivered × 100%
- **Conversion Rate**: Agents Created / Sent × 100%

### Expected Results (Industry Average)

- Delivery Rate: 95-98%
- Open Rate: 15-25%
- Reply Rate: 2-5%
- Conversion Rate: 0.5-2%

**For 562 leads:**
- Expected Opens: 84-140 agencies
- Expected Replies: 11-28 agencies
- Expected Conversions: 3-11 new agents

## Next Steps

1. ✅ Install dependencies: `npm install nodemailer`
2. ✅ Add SMTP credentials to `.env`
3. ⏳ Test with 5-10 emails first
4. ⏳ Deploy to production server
5. ⏳ Set up daily cron job
6. ⏳ Monitor inbox for replies
7. ⏳ Track conversion metrics

## Support

For issues or questions:

- **Email**: fatihtunali@funnytourism.com
- **Documentation**: This file
- **Logs**: `~/logs/email-outreach.log` (server)
- **Database**: `npx prisma studio` (view AgentLead table)
