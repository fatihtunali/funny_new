# 🔍 Server Diagnostic Commands

Run these commands on your server to diagnose the issue:

## 1. Check if latest code is pulled
```bash
cd /home/funny/funny_new
git log --oneline -1
```
**Should show:** `41e45b4 Fix Google Ads tag detection - add separate script tag`

---

## 2. Check if layout.tsx has the Google Ads tag
```bash
cat app/layout.tsx | grep -A 10 "Google Ads Conversion"
```
**Should show:**
```
{/* Google Ads Conversion Tracking */}
<Script
  src="https://www.googletagmanager.com/gtag/js?id=AW-17628441749"
  strategy="afterInteractive"
/>
<Script id="google-ads" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'AW-17628441749');
  `}
</Script>
```

---

## 3. Check if .next build folder exists
```bash
ls -la .next/server/app/layout.html 2>/dev/null || echo "Build file not found"
```

---

## 4. Check when last build happened
```bash
stat -c '%y' .next/BUILD_ID
```
**Should be recent (today's date)**

---

## 5. Force rebuild from scratch
```bash
# Remove old build
rm -rf .next

# Clean install
npm ci

# Build fresh
npm run build

# Check if build succeeded
echo "Exit code: $?"
```

---

## 6. Check pm2 process
```bash
pm2 list
pm2 describe funny_new
```

---

## 7. Restart with full reload
```bash
pm2 delete funny_new
pm2 start npm --name "funny_new" -- start
pm2 save
```

---

## 8. Check if site is actually restarted
```bash
# Check process start time
ps aux | grep "node.*next" | head -1
```

---

## 9. Test the built HTML directly
```bash
# Check if the tag is in the built files
grep -r "AW-17628441749" .next/server/ | head -3
```

---

## 10. Check for any error logs
```bash
pm2 logs funny_new --lines 50 --nostream
```

---

## ⚠️ Most Likely Issues:

1. **Build didn't run** - .next folder is old
2. **pm2 didn't restart** - Still serving old process
3. **Wrong directory** - Running from different folder
4. **Environment issue** - Missing NODE_ENV=production

---

## 🔧 Nuclear Option (Complete Reset):

```bash
# Stop everything
pm2 delete funny_new

# Clean everything
rm -rf .next node_modules

# Fresh install
npm install

# Build
npm run build

# Start fresh
pm2 start npm --name "funny_new" -- start

# Save config
pm2 save

# Check it's running
pm2 status
```

---

**Run these commands and send me the output!**
