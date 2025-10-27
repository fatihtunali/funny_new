#!/bin/bash

# Restart Development Server Script
# This script kills port 3000, rebuilds the project, and starts the dev server

echo "🔴 Killing processes on port 3000..."
npx kill-port 3000 2>/dev/null || true

echo "🧹 Cleaning .next cache..."
rm -rf .next

echo "🔨 Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "🚀 Starting development server..."
    npm run dev
else
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi
