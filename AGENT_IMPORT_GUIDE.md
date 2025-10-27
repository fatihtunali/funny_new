# Agent Import Guide

## 📋 How to Import Multiple Agents from CSV/Excel

This guide shows you how to bulk import travel agents into the database.

---

## 🔧 Setup

All agents will be created with:
- ✅ **Commission Rate: 10%** (fixed)
- ✅ **Status: ACTIVE** (unless specified otherwise)
- ✅ **Password: Hashed securely**

---

## 📝 Step 1: Prepare Your CSV File

### Option A: Use the Template

A template file is provided: `agents-import-template.csv`

### Option B: Create from Excel

1. Open Excel
2. Create a spreadsheet with these columns:

| email | password | companyName | contactName | phone | country | address | companyWebsite | status |
|-------|----------|-------------|-------------|-------|---------|---------|----------------|--------|
| agent@company.com | pass123 | Travel Co | John Doe | +123456 | USA | 123 Main St | https://site.com | ACTIVE |

3. Save as CSV format

### Required Columns:
- **email** - Agent's login email (must be unique)
- **password** - Login password (will be hashed)
- **companyName** - Company name
- **contactName** - Contact person name
- **phone** - Phone number

### Optional Columns:
- **country** - Country name
- **address** - Full address
- **companyWebsite** - Company website URL
- **status** - PENDING, ACTIVE, SUSPENDED, or REJECTED (default: ACTIVE)

---

## 📊 Step 2: Fill in Agent Data

### Example CSV Content:

```csv
email,password,companyName,contactName,phone,country,address,companyWebsite,status
john@travelagency.com,secure123,Global Travel Agency,John Smith,+1-555-0001,USA,123 Broadway New York,https://globaltravel.com,ACTIVE
maria@tours.es,pass456,Spanish Tours,Maria Garcia,+34-123-4567,Spain,Calle Mayor 45 Madrid,https://spanishtours.es,ACTIVE
hans@德tours.de,password789,Deutschland Tours,Hans Mueller,+49-30-12345,Germany,Hauptstrasse 12 Berlin,https://deutschlandtours.de,ACTIVE
```

### Important Notes:
- ✅ First row MUST be the header row
- ✅ Email must be unique (duplicates will be skipped)
- ✅ Status can be: PENDING, ACTIVE, SUSPENDED, REJECTED
- ✅ Empty optional fields are OK (will be set to null)
- ✅ Commission rate is automatically set to 10%

---

## 🚀 Step 3: Import Agents

### On Local Machine:

```bash
npm run import-agents agents-import-template.csv
```

### On Server:

```bash
# Upload your CSV file
scp agents.csv funny@funnytourism.com:~/funny_new/

# SSH to server
ssh funny@funnytourism.com

# Run import
cd ~/funny_new
npm run import-agents agents.csv
```

---

## 📈 Import Results

The script will show:

```
📁 Reading agents from CSV file...

📊 Found 3 agents to import

✅ Created: john@travelagency.com (Global Travel Agency) - 10% commission
✅ Created: maria@tours.es (Spanish Tours) - 10% commission
⏭️  Skipped: hans@tours.de (already exists)

📈 Import Summary:
   ✅ Successfully imported: 2
   ⏭️  Skipped (already exist): 1
   ❌ Errors: 0
   📊 Total processed: 3
```

---

## ✅ Step 4: Verify Import

### Check imported agents:

```bash
# On server
cd ~/funny_new
node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.agent.findMany().then(agents => { console.log(agents); process.exit(0); });"
```

### Or via Admin Panel:

1. Login to admin: https://www.funnytourism.com/admin/login
2. Go to Agents section
3. View all imported agents

---

## 🔒 Security Notes

### Password Security:
- Passwords are hashed with bcrypt (10 rounds)
- Never store plain passwords
- Recommend agents change password after first login

### Commission Rate:
- Fixed at 10% for all imported agents
- To change: Edit in admin panel after import
- Or modify script to use CSV column

---

## 🛠️ Troubleshooting

### "Email already exists" - Agent Skipped
- The email is already in the database
- Check if agent was previously imported
- Use different email or delete existing agent first

### "Invalid status"
- Status must be: PENDING, ACTIVE, SUSPENDED, or REJECTED
- Check CSV file for typos
- Default is ACTIVE if not specified

### "CSV file not found"
- Check file path is correct
- Use full path: `/home/funny/funny_new/agents.csv`
- Or relative path from project root

### "Module not found" Error
- Run `npm install` first
- Make sure you're in the project directory
- Try: `npx tsx scripts/import-agents.ts agents.csv`

---

## 📋 Sample Data Templates

### Template 1: Basic (Minimum Required)
```csv
email,password,companyName,contactName,phone
agent1@example.com,pass123,Travel Co,John Doe,+1234567890
agent2@example.com,pass456,Tour Op,Jane Smith,+9876543210
```

### Template 2: Complete (All Fields)
```csv
email,password,companyName,contactName,phone,country,address,companyWebsite,status
agent1@example.com,pass123,Global Travel,John Doe,+1-555-0001,USA,123 Main St,https://globaltravel.com,ACTIVE
agent2@example.com,pass456,Euro Tours,Jane Smith,+44-20-1234,UK,456 High St London,https://eurotours.co.uk,ACTIVE
agent3@example.com,pass789,Asia Travel,Li Wang,+86-10-5678,China,789 Beijing Rd,https://asiatravel.cn,PENDING
```

### Template 3: Excel Format (for copying to Excel)

| email | password | companyName | contactName | phone | country | address | companyWebsite | status |
|-------|----------|-------------|-------------|-------|---------|---------|----------------|--------|
| agent@company.com | password123 | Travel Agency | Contact Person | +1234567890 | Country | Full Address | https://website.com | ACTIVE |

---

## 🔄 Update Existing Agents

To update existing agents:
1. Delete the agent from database
2. Re-import with new data
3. Or use admin panel to edit manually

**Note:** Script skips existing emails to prevent duplicates

---

## 📊 Bulk Operations

### Import 100s of agents:
1. Create CSV with all agent data
2. Run import script
3. Script processes them one by one
4. Shows progress for each agent

### Export agents to CSV (for backup):
```bash
cd ~/funny_new
node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.agent.findMany().then(agents => { console.log('email,companyName,contactName,phone,commissionRate,status'); agents.forEach(a => console.log(\`\${a.email},\${a.companyName},\${a.contactName},\${a.phone},\${a.commissionRate},\${a.status}\`)); process.exit(0); });" > agents-export.csv
```

---

## 📞 Support

If you need help:
1. Check error messages carefully
2. Verify CSV format matches template
3. Test with 1-2 agents first
4. Then import full list

**Common Issues:**
- Wrong file path → Use full path or check directory
- Duplicate emails → Script will skip automatically
- Missing required fields → Add email, password, companyName, contactName, phone
- Permission errors → Make sure you have database access

---

## ✨ Summary

1. ✅ Create CSV file with agent data (use template)
2. ✅ Run: `npm run import-agents your-file.csv`
3. ✅ Check results - shows success/skip/error count
4. ✅ All agents get 10% commission automatically
5. ✅ Verify in admin panel or database

**That's it!** 🎉
