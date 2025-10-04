#!/bin/bash

# Setup script for daily blog post generation cron job

echo "=== Blog Cron Job Setup ==="
echo ""

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then
    echo "Please run this script with sudo or as root"
    exit 1
fi

# Set up the script path
SCRIPT_PATH="/root/funny_new/scripts/generate-daily-blog.sh"

# Make the script executable
chmod +x "$SCRIPT_PATH"
echo "✓ Made script executable"

# Ask for admin credentials
read -p "Enter admin email (default: admin@funnytourism.com): " ADMIN_EMAIL
ADMIN_EMAIL=${ADMIN_EMAIL:-admin@funnytourism.com}

read -sp "Enter admin password: " ADMIN_PASSWORD
echo ""

# Update credentials in the script
sed -i "s/ADMIN_EMAIL=\".*\"/ADMIN_EMAIL=\"$ADMIN_EMAIL\"/" "$SCRIPT_PATH"
sed -i "s/ADMIN_PASSWORD=\".*\"/ADMIN_PASSWORD=\"$ADMIN_PASSWORD\"/" "$SCRIPT_PATH"
echo "✓ Updated admin credentials in script"

# Ask for schedule
echo ""
echo "When should the blog post be generated daily?"
echo "Examples:"
echo "  1) 8:00 AM  (Morning)"
echo "  2) 12:00 PM (Noon)"
echo "  3) 6:00 PM  (Evening)"
echo "  4) Custom time"
echo ""
read -p "Choose option (1-4): " SCHEDULE_OPTION

case $SCHEDULE_OPTION in
    1)
        CRON_HOUR="8"
        CRON_MINUTE="0"
        TIME_DESC="8:00 AM"
        ;;
    2)
        CRON_HOUR="12"
        CRON_MINUTE="0"
        TIME_DESC="12:00 PM"
        ;;
    3)
        CRON_HOUR="18"
        CRON_MINUTE="0"
        TIME_DESC="6:00 PM"
        ;;
    4)
        read -p "Enter hour (0-23): " CRON_HOUR
        read -p "Enter minute (0-59): " CRON_MINUTE
        TIME_DESC="${CRON_HOUR}:${CRON_MINUTE}"
        ;;
    *)
        echo "Invalid option. Using default: 8:00 AM"
        CRON_HOUR="8"
        CRON_MINUTE="0"
        TIME_DESC="8:00 AM"
        ;;
esac

# Create cron job entry
CRON_ENTRY="$CRON_MINUTE $CRON_HOUR * * * /bin/bash $SCRIPT_PATH >> /root/funny_new/logs/blog-cron.log 2>&1"

# Check if cron job already exists
if crontab -l 2>/dev/null | grep -q "generate-daily-blog.sh"; then
    echo "⚠ Cron job already exists. Removing old entry..."
    crontab -l | grep -v "generate-daily-blog.sh" | crontab -
fi

# Add new cron job
(crontab -l 2>/dev/null; echo "$CRON_ENTRY") | crontab -
echo "✓ Cron job added successfully"

echo ""
echo "=== Setup Complete ==="
echo ""
echo "Blog posts will be generated daily at: $TIME_DESC"
echo "Logs will be written to: /root/funny_new/logs/blog-generation.log"
echo "Cron logs: /root/funny_new/logs/blog-cron.log"
echo ""
echo "To view current cron jobs: crontab -l"
echo "To test the script manually: bash $SCRIPT_PATH"
echo "To view logs: tail -f /root/funny_new/logs/blog-generation.log"
echo ""
echo "Categories will rotate daily:"
echo "  Day 1: Travel Tips"
echo "  Day 2: Destinations"
echo "  Day 3: Culture"
echo "  Day 4: Food"
echo "  Day 5: History"
echo "  Day 6: Activities"
echo "  (repeats...)"
echo ""
