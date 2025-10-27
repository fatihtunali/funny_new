#!/bin/bash

# Funny Tourism Quick Deployment Script
# Use this for quick deployments that don't need a full rebuild
# (e.g., API route changes, config updates, minor fixes)

echo "⚡ Quick deployment to funnytourism.com..."
echo ""

ssh funny@funnytourism.com << 'ENDSSH'
    echo "📂 Navigating to project directory..."
    cd funny_new || exit 1

    echo "⬇️  Pulling latest changes..."
    git pull

    echo "🔄 Restarting application..."
    pm2 restart funny-tourism

    echo ""
    echo "✅ Quick deployment completed!"
    pm2 status funny-tourism
ENDSSH

echo ""
echo "🎉 Done! App restarted at https://www.funnytourism.com"
