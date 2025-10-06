#!/bin/bash

# Database Restore Script for Funny Tourism
# Usage: ./restore-database.sh <backup-file.sql.gz>

# Check if backup file is provided
if [ -z "$1" ]; then
    echo "❌ Error: No backup file specified"
    echo ""
    echo "Usage: $0 <backup-file.sql.gz>"
    echo ""
    echo "Available backups:"
    echo ""
    echo "📁 Hourly backups (last 24 hours):"
    ls -lh /home/funny/backups/database/hourly/backup_*.sql.gz 2>/dev/null | tail -10
    echo ""
    echo "📅 Daily backups (last 30 days):"
    ls -lh /home/funny/backups/database/daily/daily_*.sql.gz 2>/dev/null | tail -10
    exit 1
fi

BACKUP_FILE="$1"

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Error: Backup file not found: $BACKUP_FILE"
    exit 1
fi

# Load database credentials from .env
cd /home/funny/funny_new
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

# Extract database connection details
DB_USER=$(echo $DATABASE_URL | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')
DB_PASS=$(echo $DATABASE_URL | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p')
DB_HOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
DB_PORT=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
DB_NAME=$(echo $DATABASE_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')

echo "⚠️  WARNING: This will replace the current database with the backup!"
echo ""
echo "Database: $DB_NAME"
echo "Backup file: $BACKUP_FILE"
echo "Backup date: $(stat -c %y "$BACKUP_FILE" 2>/dev/null || stat -f %Sm "$BACKUP_FILE")"
echo ""
read -p "Are you sure you want to continue? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "❌ Restore cancelled"
    exit 0
fi

echo ""
echo "🔄 Starting database restore..."

# Create a safety backup before restore
SAFETY_BACKUP="/home/funny/backups/database/pre_restore_$(date +"%Y%m%d_%H%M%S").sql.gz"
echo "📦 Creating safety backup: $SAFETY_BACKUP"

mysqldump \
    --user="$DB_USER" \
    --password="$DB_PASS" \
    --host="$DB_HOST" \
    --port="$DB_PORT" \
    --single-transaction \
    --quick \
    "$DB_NAME" | gzip > "$SAFETY_BACKUP"

if [ $? -ne 0 ]; then
    echo "❌ Failed to create safety backup. Aborting restore."
    exit 1
fi

echo "✅ Safety backup created"
echo ""

# Restore the database
echo "🔄 Restoring database from backup..."

gunzip < "$BACKUP_FILE" | mysql \
    --user="$DB_USER" \
    --password="$DB_PASS" \
    --host="$DB_HOST" \
    --port="$DB_PORT" \
    "$DB_NAME"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Database restored successfully!"
    echo ""
    echo "📌 Remember to restart your application:"
    echo "   cd ~/funny_new && pm2 restart funny-tourism"
    echo ""
    echo "🔒 Safety backup saved at: $SAFETY_BACKUP"
    exit 0
else
    echo ""
    echo "❌ Restore failed!"
    echo ""
    echo "🔄 You can restore the safety backup with:"
    echo "   $0 $SAFETY_BACKUP"
    exit 1
fi
