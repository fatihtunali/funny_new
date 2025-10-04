#!/bin/bash

# Daily Blog Post Generator Script
# This script generates a blog post using AI and is meant to be run via cron

# Configuration
API_URL="http://localhost:3000/api/admin/blog/generate"
LOG_FILE="/root/funny_new/logs/blog-generation.log"
ADMIN_EMAIL="admin@funnytourism.com"
ADMIN_PASSWORD="your-admin-password"  # Update this with actual admin password

# Create logs directory if it doesn't exist
mkdir -p /root/funny_new/logs

# Function to log messages
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Start logging
log "=== Starting daily blog post generation ==="

# Get admin token by logging in
log "Authenticating admin..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}" \
  -c /tmp/admin-cookies.txt)

# Check if login was successful
if echo "$LOGIN_RESPONSE" | grep -q "success"; then
    log "✓ Authentication successful"
else
    log "✗ Authentication failed: $LOGIN_RESPONSE"
    exit 1
fi

# Categories to rotate through
CATEGORIES=("Travel Tips" "Destinations" "Culture" "Food" "History" "Activities")

# Get day of year to rotate categories (0-365)
DAY_OF_YEAR=$(date +%j)

# Calculate category index (modulo 6 for 6 categories)
CATEGORY_INDEX=$((10#$DAY_OF_YEAR % 6))
CATEGORY="${CATEGORIES[$CATEGORY_INDEX]}"

log "Selected category: $CATEGORY (Day $DAY_OF_YEAR, Index $CATEGORY_INDEX)"

# Generate blog post
log "Generating blog post..."
GENERATION_RESPONSE=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -b /tmp/admin-cookies.txt \
  -d "{\"category\":\"$CATEGORY\",\"autoPublish\":true}")

# Check if generation was successful
if echo "$GENERATION_RESPONSE" | grep -q "\"title\""; then
    TITLE=$(echo "$GENERATION_RESPONSE" | grep -o '"title":"[^"]*"' | cut -d'"' -f4)
    log "✓ Blog post generated successfully: $TITLE"
    log "Response: $GENERATION_RESPONSE"
else
    log "✗ Blog post generation failed: $GENERATION_RESPONSE"
    exit 1
fi

# Cleanup
rm -f /tmp/admin-cookies.txt

log "=== Daily blog post generation completed ==="
echo ""
