#!/bin/bash

# Database Backup Script for Funny Tourism
# Runs hourly via cron to backup MySQL database

# Configuration
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/home/funny/backups/database"
HOURLY_DIR="$BACKUP_DIR/hourly"
DAILY_DIR="$BACKUP_DIR/daily"
LOG_FILE="$BACKUP_DIR/backup.log"

# Load database credentials from .env
cd /home/funny/funny_new
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

# Extract database connection details from DATABASE_URL
# Format: mysql://user:password@host:port/database
DB_USER=$(echo $DATABASE_URL | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')
DB_PASS=$(echo $DATABASE_URL | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p')
DB_HOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
DB_PORT=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
DB_NAME=$(echo $DATABASE_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')

# Create backup directories
mkdir -p "$HOURLY_DIR"
mkdir -p "$DAILY_DIR"

# Log start
echo "[$(date +"%Y-%m-%d %H:%M:%S")] Starting database backup..." >> "$LOG_FILE"

# Perform hourly backup
BACKUP_FILE="$HOURLY_DIR/backup_$TIMESTAMP.sql.gz"

mysqldump \
    --user="$DB_USER" \
    --password="$DB_PASS" \
    --host="$DB_HOST" \
    --port="$DB_PORT" \
    --single-transaction \
    --quick \
    --lock-tables=false \
    --routines \
    --triggers \
    "$DB_NAME" | gzip > "$BACKUP_FILE"

# Check if backup was successful
if [ $? -eq 0 ]; then
    BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo "[$(date +"%Y-%m-%d %H:%M:%S")] ✅ Backup successful: $BACKUP_FILE ($BACKUP_SIZE)" >> "$LOG_FILE"

    # If it's midnight (00:xx), also save as daily backup
    HOUR=$(date +"%H")
    if [ "$HOUR" == "00" ]; then
        DAILY_FILE="$DAILY_DIR/daily_$(date +"%Y%m%d").sql.gz"
        cp "$BACKUP_FILE" "$DAILY_FILE"
        echo "[$(date +"%Y-%m-%d %H:%M:%S")] 📅 Daily backup saved: $DAILY_FILE" >> "$LOG_FILE"
    fi
else
    echo "[$(date +"%Y-%m-%d %H:%M:%S")] ❌ Backup failed!" >> "$LOG_FILE"
    exit 1
fi

# Cleanup old hourly backups (keep last 24 hours = 24 files)
echo "[$(date +"%Y-%m-%d %H:%M:%S")] Cleaning up old hourly backups..." >> "$LOG_FILE"
find "$HOURLY_DIR" -name "backup_*.sql.gz" -type f -mmin +1440 -delete

# Cleanup old daily backups (keep last 30 days)
echo "[$(date +"%Y-%m-%d %H:%M:%S")] Cleaning up old daily backups..." >> "$LOG_FILE"
find "$DAILY_DIR" -name "daily_*.sql.gz" -type f -mtime +30 -delete

# Log completion
echo "[$(date +"%Y-%m-%d %H:%M:%S")] Backup process completed" >> "$LOG_FILE"
echo "---" >> "$LOG_FILE"

# Optional: Send notification if backup fails (uncomment if you want email alerts)
# if [ $? -ne 0 ]; then
#     echo "Database backup failed at $(date)" | mail -s "Backup Alert: Database Backup Failed" admin@funnytourism.com
# fi

exit 0
