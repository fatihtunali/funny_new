# Daily Blog Post Generation - Cron Job Setup

This guide explains how to set up automated daily blog post generation using AI.

## Quick Setup (Recommended)

On your production server, run:

```bash
cd /root/funny_new
git pull
chmod +x scripts/setup-blog-cron.sh
sudo bash scripts/setup-blog-cron.sh
```

The script will ask you:
1. Admin email (for authentication)
2. Admin password (stored securely in the script)
3. What time to generate posts daily

That's it! Blog posts will be generated automatically every day.

---

## Manual Setup

If you prefer to set up manually:

### 1. Make the script executable
```bash
chmod +x /root/funny_new/scripts/generate-daily-blog.sh
```

### 2. Update admin credentials
Edit the script:
```bash
nano /root/funny_new/scripts/generate-daily-blog.sh
```

Update these lines:
```bash
ADMIN_EMAIL="your-admin@email.com"
ADMIN_PASSWORD="your-actual-password"
```

### 3. Add to crontab
```bash
crontab -e
```

Add this line (generates post at 8:00 AM daily):
```
0 8 * * * /bin/bash /root/funny_new/scripts/generate-daily-blog.sh >> /root/funny_new/logs/blog-cron.log 2>&1
```

**Time Format:**
- `0 8 * * *` = 8:00 AM
- `0 12 * * *` = 12:00 PM (Noon)
- `0 18 * * *` = 6:00 PM
- `30 14 * * *` = 2:30 PM

---

## How It Works

1. **Category Rotation**: Categories rotate daily based on day of year:
   - Day 1: Travel Tips
   - Day 2: Destinations
   - Day 3: Culture
   - Day 4: Food
   - Day 5: History
   - Day 6: Activities
   - (Repeats...)

2. **AI Generation**: Uses OpenAI GPT-4o to create:
   - SEO-optimized title and meta description
   - Engaging 800+ word content
   - Relevant tags
   - Professional HTML formatting

3. **Auto-Publish**: Posts are automatically published (status: PUBLISHED)

---

## Testing

### Test the script manually:
```bash
bash /root/funny_new/scripts/generate-daily-blog.sh
```

### View logs:
```bash
# Real-time log viewing
tail -f /root/funny_new/logs/blog-generation.log

# View all logs
cat /root/funny_new/logs/blog-generation.log

# View cron logs
cat /root/funny_new/logs/blog-cron.log
```

---

## Managing the Cron Job

### View current cron jobs:
```bash
crontab -l
```

### Remove the cron job:
```bash
crontab -e
# Delete the line containing "generate-daily-blog.sh"
```

### Temporarily disable:
```bash
crontab -e
# Add # at the beginning of the line:
# 0 8 * * * /bin/bash /root/funny_new/scripts/generate-daily-blog.sh
```

---

## Troubleshooting

### No blog posts being generated?

1. **Check if cron is running:**
   ```bash
   systemctl status cron
   # or
   systemctl status crond
   ```

2. **Check logs:**
   ```bash
   tail -50 /root/funny_new/logs/blog-generation.log
   ```

3. **Test script manually:**
   ```bash
   bash /root/funny_new/scripts/generate-daily-blog.sh
   ```

4. **Verify admin credentials:**
   - Make sure the email and password in the script are correct
   - Try logging in at `/admin/login` with those credentials

5. **Check OpenAI API key:**
   ```bash
   grep OPENAI_API_KEY /root/funny_new/.env
   ```

### Posts are being generated but not visible?

Check the blog admin panel:
- Go to `https://dreamdestinationturkey.com/admin/blog`
- Look for posts with status "DRAFT" - they need to be published
- Or check if `autoPublish: true` is set in the script

---

## Customization

### Change generation time:
```bash
crontab -e
# Change the hour/minute values
```

### Change category selection:
Edit `/root/funny_new/scripts/generate-daily-blog.sh` and modify the `CATEGORIES` array.

### Generate multiple posts per day:
Add multiple cron entries with different times:
```
0 8 * * * /bin/bash /root/funny_new/scripts/generate-daily-blog.sh
0 18 * * * /bin/bash /root/funny_new/scripts/generate-daily-blog.sh
```

### Disable auto-publish:
Edit the script and change:
```bash
-d "{\"category\":\"$CATEGORY\",\"autoPublish\":false}"
```

---

## Security Notes

- The admin password is stored in the script file
- Make sure the script is only readable by root:
  ```bash
  chmod 700 /root/funny_new/scripts/generate-daily-blog.sh
  ```
- Logs may contain sensitive information - restrict access:
  ```bash
  chmod 600 /root/funny_new/logs/blog-generation.log
  ```

---

## Support

If you encounter issues:
1. Check the logs first
2. Test the script manually
3. Verify all prerequisites (admin account, OpenAI API key, application running)
4. Check that the application is running (PM2, port 3000)
