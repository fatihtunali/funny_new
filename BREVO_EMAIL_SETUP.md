# Brevo Email Configuration Guide

## ✅ Brevo Configuration

### API Configuration (Recommended)
```env
BREVO_API_KEY=your-brevo-api-key-here
EMAIL_FROM=info@dreamdestinationturkey.com
EMAIL_FROM_NAME=Funny Tourism
```

### SMTP Configuration (Alternative)
```env
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your-smtp-user@smtp-brevo.com
SMTP_PASS=your-smtp-password
```

**Note:** Actual credentials should be added to `.env` file only (never commit to git).

## 🚀 Setup Steps

### Option 1: Using Brevo API (Current Implementation)

1. **Add to your `.env` file:**
   ```bash
   BREVO_API_KEY=your-brevo-api-key-from-dashboard
   EMAIL_FROM=info@dreamdestinationturkey.com
   EMAIL_FROM_NAME=Funny Tourism
   ```

   Get your API key from: https://app.brevo.com/settings/keys/api

2. **Verify sender email in Brevo:**
   - Go to [Brevo Dashboard](https://app.brevo.com)
   - Navigate to **Senders & IP** → **Senders**
   - Add and verify `info@dreamdestinationturkey.com`
   - Follow email verification process

3. **Test the integration:**
   - Create a test booking
   - Check Brevo dashboard for sent emails
   - Check spam folder if not received

### Option 2: Using SMTP (Alternative)

If you prefer SMTP over API, you can modify `lib/email.ts`:

```typescript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: '7bc62a001@smtp-brevo.com',
    pass: 'HnktPhgSFKmv59ar'
  }
});

export async function sendEmail({ to, subject, html }: EmailData) {
  await transporter.sendMail({
    from: '"Funny Tourism" <info@dreamdestinationturkey.com>',
    to,
    subject,
    html
  });
}
```

## 📧 Email Templates

The system includes beautiful HTML email templates for:

### 1. Booking Confirmation
- Sent immediately after booking
- Includes: booking details, reference number, price, travelers
- Next steps and contact information

### 2. Booking Reminder (Future Enhancement)
- Can be scheduled 7 days before travel
- Pre-travel checklist
- Important reminders

## 🧪 Testing

### Development Mode
Without API key, emails are logged to console:
```bash
npm run dev
# Make a booking
# Check terminal for email preview
```

### Production Mode
With API key, emails are sent via Brevo:
```bash
# Check Brevo dashboard: https://app.brevo.com/statistics
# View: Email → Statistics → Sent emails
```

## 📊 Brevo Dashboard

Access your email statistics:
- **Sent Emails**: https://app.brevo.com/statistics/email
- **Delivery Rate**: Track open/click rates
- **Bounce Management**: Handle failed deliveries
- **Contact Lists**: Manage subscribers

## 🔒 Security Notes

1. **Never commit** `.env` file to git
2. **Rotate API keys** periodically
3. **Use different keys** for development/production
4. **Monitor usage** to stay within free tier limits

## 📈 Brevo Free Tier Limits

- **300 emails/day** on free plan
- Upgrade to paid plan for unlimited emails
- Current plan: Check [Brevo Pricing](https://www.brevo.com/pricing/)

## 🛠️ Troubleshooting

### Email not sending:
1. Check API key is correct in `.env`
2. Verify sender email in Brevo dashboard
3. Check server logs for errors
4. Verify recipient email is valid

### Emails going to spam:
1. Set up **SPF** and **DKIM** records
2. Verify domain in Brevo
3. Warm up sending domain gradually
4. Avoid spam trigger words in subject/content

### Rate limiting:
1. Check daily sending limit in Brevo
2. Implement retry logic for failed sends
3. Queue emails for batch sending

## 📝 Next Steps

1. ✅ Verify sender email in Brevo
2. ✅ Add API key to production `.env`
3. ✅ Test with a real booking
4. ⏳ Set up automated reminder emails (cron job)
5. ⏳ Add email analytics tracking
6. ⏳ Create additional email templates (cancellation, updates)

## 💡 Additional Features

### Email Campaigns (Future)
Use Brevo to send marketing campaigns:
```javascript
// Create campaign via API
fetch('https://api.brevo.com/v3/emailCampaigns', {
  method: 'POST',
  headers: {
    'api-key': 'YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: "Summer Sale Campaign",
    subject: "Special Turkey Tour Offers",
    sender: { name: "Funny Tourism", email: "info@dreamdestinationturkey.com" },
    htmlContent: "<html>...</html>",
    recipients: { listIds: [2] }
  })
});
```

### Contact Lists
Sync bookings to Brevo contact lists for marketing.

## 🔗 Useful Links

- [Brevo API Docs](https://developers.brevo.com/)
- [Brevo Dashboard](https://app.brevo.com)
- [Email Templates](https://app.brevo.com/template/list)
- [SMTP Settings](https://app.brevo.com/settings/keys/smtp)
