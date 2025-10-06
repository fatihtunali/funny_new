#!/bin/bash

echo "=========================================="
echo "FUNNY TOURISM SERVER DIAGNOSTIC SCRIPT"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}1. Checking current directory...${NC}"
pwd
echo ""

echo -e "${YELLOW}2. Checking latest git commit...${NC}"
git log --oneline -1
echo ""

echo -e "${YELLOW}3. Checking if layout.tsx has Google Ads tag...${NC}"
if grep -q "AW-17628441749" app/layout.tsx; then
    echo -e "${GREEN}✓ Tag found in app/layout.tsx${NC}"
    echo "Code snippet:"
    grep -A 5 "AW-17628441749" app/layout.tsx
else
    echo -e "${RED}✗ Tag NOT found in app/layout.tsx${NC}"
fi
echo ""

echo -e "${YELLOW}4. Checking .next build folder...${NC}"
if [ -d ".next" ]; then
    echo -e "${GREEN}✓ .next folder exists${NC}"
    ls -la .next/BUILD_ID 2>/dev/null || echo -e "${RED}✗ BUILD_ID not found${NC}"
else
    echo -e "${RED}✗ .next folder does NOT exist${NC}"
fi
echo ""

echo -e "${YELLOW}5. Checking build timestamp...${NC}"
if [ -f ".next/BUILD_ID" ]; then
    stat -c 'Last modified: %y' .next/BUILD_ID 2>/dev/null || stat -f 'Last modified: %Sm' .next/BUILD_ID
else
    echo -e "${RED}✗ BUILD_ID file not found - build may not have run${NC}"
fi
echo ""

echo -e "${YELLOW}6. Checking if Google Ads tag is in built files...${NC}"
if [ -d ".next/server" ]; then
    TAG_IN_BUILD=$(grep -r "AW-17628441749" .next/server/ 2>/dev/null | head -3)
    if [ -n "$TAG_IN_BUILD" ]; then
        echo -e "${GREEN}✓ Tag found in build files:${NC}"
        echo "$TAG_IN_BUILD"
    else
        echo -e "${RED}✗ Tag NOT found in build files - BUILD DID NOT INCLUDE THE TAG${NC}"
    fi
else
    echo -e "${RED}✗ .next/server folder not found${NC}"
fi
echo ""

echo -e "${YELLOW}7. Checking pm2 process...${NC}"
pm2 list | grep funny_new
echo ""

echo -e "${YELLOW}8. Checking pm2 process details...${NC}"
pm2 describe funny_new | grep -E "(status|uptime|created at|restarts)"
echo ""

echo -e "${YELLOW}9. Checking Node.js process...${NC}"
ps aux | grep "node.*next" | grep -v grep | head -2
echo ""

echo -e "${YELLOW}10. Checking recent pm2 logs for errors...${NC}"
pm2 logs funny_new --lines 20 --nostream --err
echo ""

echo "=========================================="
echo "DIAGNOSIS COMPLETE"
echo "=========================================="
echo ""
echo "NEXT STEPS:"
echo "1. If tag is in app/layout.tsx but NOT in .next/server files:"
echo "   → Build did not run properly. Force clean rebuild."
echo ""
echo "2. If tag is in both files but site still doesn't show it:"
echo "   → pm2 process is serving old code. Full restart needed."
echo ""
echo "3. If .next folder is old (check timestamp):"
echo "   → Build didn't run. Check for build errors."
echo ""
