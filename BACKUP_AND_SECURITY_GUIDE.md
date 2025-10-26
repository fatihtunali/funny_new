# Database Backup & Security Guide

## 🔐 Database Protection Strategy

Your production database is now protected with:

1. ✅ **Hourly Automated Backups** (24 hours retention)
2. ✅ **Daily Backups** (30 days retention)
3. ✅ **Emergency Restore Scripts**
4. ✅ **Safety Backup before any restore**

---

## 📦 Backup System

### Automatic Backups

**Hourly Backups** (Every hour, 00 minutes)
- Location: `/home/funny/backups/database/hourly/`
- Retention: Last 24 hours (24 files)
- Format: `backup_YYYYMMDD_HHMMSS.sql.gz`

**Daily Backups** (Every day at midnight)
- Location: `/home/funny/backups/database/daily/`
- Retention: Last 30 days
- Format: `daily_YYYYMMDD.sql.gz`

### Setup Automated Backups

Run this **ONE TIME** on the server:

```bash
# SSH to server
ssh funny@funnytourism.com

# Make backup script executable
chmod +x ~/funny_new/scripts/backup-database.sh
chmod +x ~/funny_new/scripts/restore-database.sh

# Add to crontab (runs every hour at :00)
(crontab -l 2>/dev/null; echo "0 * * * * /home/funny/funny_new/scripts/backup-database.sh") | crontab -

# Verify crontab
crontab -l

# Run first backup manually to test
~/funny_new/scripts/backup-database.sh

# Check backup was created
ls -lh ~/backups/database/hourly/
```

---

## 🔄 Restore Database

### View Available Backups

```bash
ssh funny@funnytourism.com
~/funny_new/scripts/restore-database.sh
```

This will show all available backups.

### Restore from Backup

```bash
# Restore from specific backup
~/funny_new/scripts/restore-database.sh /home/funny/backups/database/hourly/backup_20250106_140000.sql.gz

# Or from daily backup
~/funny_new/scripts/restore-database.sh /home/funny/backups/database/daily/daily_20250106.sql.gz
```

**Important:**
- A safety backup is automatically created before restore
- You'll be asked to confirm before proceeding
- The script shows backup date and time
- Restart the app after restore: `pm2 restart funny-tourism`

---

## 🛡️ Database Security Best Practices

### 1. Regular Backup Monitoring

Check backup logs weekly:
```bash
tail -50 ~/backups/database/backup.log
```

### 2. Test Restore Monthly

Once a month, test the restore process on a development environment:
```bash
# Download a backup
scp funny@funnytourism.com:~/backups/database/daily/daily_YYYYMMDD.sql.gz ./

# Test restore on dev database
gunzip < daily_YYYYMMDD.sql.gz | mysql -u user -p dev_database
```

### 3. Critical Tables Protection

**Do NOT delete from these tables in production:**
- `Agent` - Travel agent accounts (commission data)
- `User` - Customer accounts
- `Booking` - All bookings (revenue records)
- `DailyTourBooking` - Daily tour bookings
- `TransferBooking` - Transfer bookings
- `Package` - Tour packages
- `DailyTour` - Daily tours
- `Transfer` - Transfer services

### 4. Admin Access Control

**Only authorized users should:**
- Access the admin panel (`/admin`)
- Have SSH access to the server
- Have database credentials

**Current authorized users:**
- Admin: (your admin email)
- Agent: fatihtunali@funnytourism.com

### 5. Backup Off-Site Storage (Recommended)

For extra safety, download backups to your local machine weekly:

```bash
# Download last 7 daily backups
scp "funny@funnytourism.com:~/backups/database/daily/daily_*.sql.gz" ./backups/
```

Store these on:
- External hard drive
- Cloud storage (Google Drive, Dropbox)
- Another server

---

## 🚨 Emergency Recovery

### Scenario 1: Accidental Data Deletion

If data is accidentally deleted (e.g., agent account):

1. **Don't panic!** You have hourly backups
2. Find the most recent backup before deletion:
   ```bash
   ls -lt ~/backups/database/hourly/
   ```
3. Restore from that backup:
   ```bash
   ~/funny_new/scripts/restore-database.sh <backup-file>
   ```
4. Restart app: `pm2 restart funny-tourism`

### Scenario 2: Database Corruption

If database becomes corrupted:

1. Stop the application:
   ```bash
   pm2 stop funny-tourism
   ```
2. Restore from latest backup:
   ```bash
   ~/funny_new/scripts/restore-database.sh <latest-backup>
   ```
3. Restart application:
   ```bash
   pm2 start funny-tourism
   ```

### Scenario 3: Complete Server Failure

If server crashes completely:

1. **You need off-site backups** for this scenario
2. Set up new server
3. Install MySQL and Node.js
4. Upload backup file to new server
5. Restore database
6. Deploy application

---

## 📊 Backup Storage Requirements

**Estimated backup sizes:**
- Empty database: ~50 KB
- After 1000 bookings: ~5 MB
- After 10,000 bookings: ~50 MB

**Monthly storage needed:**
- Hourly (24 files): ~50 MB (for 1000 bookings)
- Daily (30 files): ~150 MB (for 1000 bookings)
- **Total: ~200 MB/month**

This is very small - a 1GB disk space is plenty for years of backups.

---

## 🔔 Monitoring & Alerts

### Check Backup Status

```bash
# View last 10 backup logs
tail -20 ~/backups/database/backup.log

# Check if backups are running
ls -ltr ~/backups/database/hourly/ | tail -5

# Check disk space
df -h ~/backups/
```

### Setup Email Alerts (Optional)

Uncomment the email notification lines in `backup-database.sh`:

```bash
if [ $? -ne 0 ]; then
    echo "Database backup failed at $(date)" | mail -s "Backup Alert: Database Backup Failed" admin@funnytourism.com
fi
```

Requires `mailutils` or `sendmail` configured on server.

---

## 📝 Backup Checklist

### Daily (Automated)
- ✅ Hourly backups run automatically
- ✅ Backups are compressed (gzip)
- ✅ Old backups cleaned up automatically

### Weekly (Manual)
- [ ] Check backup logs for errors
- [ ] Verify backup files exist
- [ ] Download backups to local storage

### Monthly (Manual)
- [ ] Test restore process
- [ ] Review disk space usage
- [ ] Archive important daily backups off-site

---

## 🔑 Database Credentials Safety

**Never:**
- Commit `.env` file to Git
- Share database credentials via email/chat
- Store credentials in plain text files
- Use the same password for multiple services

**Always:**
- Keep `.env` file in `.gitignore`
- Use strong passwords (16+ characters)
- Rotate database passwords quarterly
- Use SSH keys instead of passwords for server access

---

## 📞 Support Contacts

If you need help with backups or recovery:

1. **Check backup logs first**: `tail -50 ~/backups/database/backup.log`
2. **Review this guide**: Most common issues are covered here
3. **Test restore on development** before production
4. **Contact system administrator** if data recovery is needed

---

## 🎯 Quick Reference Commands

```bash
# View available backups
~/funny_new/scripts/restore-database.sh

# Manual backup now
~/funny_new/scripts/backup-database.sh

# Restore from backup (with safety backup)
~/funny_new/scripts/restore-database.sh <backup-file>

# Check backup logs
tail -50 ~/backups/database/backup.log

# List hourly backups
ls -lh ~/backups/database/hourly/

# List daily backups
ls -lh ~/backups/database/daily/

# Check disk space
df -h ~/backups/

# Verify cron job is active
crontab -l
```

---

## ✅ Setup Complete!

Once you run the setup commands above, your database will be:
- ✅ Backed up every hour automatically
- ✅ Daily backups saved for 30 days
- ✅ Protected from accidental deletion
- ✅ Recoverable within minutes

**Remember:** The best backup is the one you test regularly!
