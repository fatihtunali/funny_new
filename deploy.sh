#!/bin/bash

# Funny Tourism Deployment Script
# This script deploys the latest code to the production server

echo "🚀 Starting deployment to funnytourism.com..."
echo ""

# SSH connection details
SERVER_USER="funnytourism"
SERVER_HOST="134.209.137.11"
PROJECT_DIR="app"
APP_NAME="funnytourism"

echo "📡 Connecting to server: $SERVER_USER@$SERVER_HOST"
echo ""

# Execute deployment commands on the server
ssh $SERVER_USER@$SERVER_HOST << 'ENDSSH'
    echo "📂 Navigating to project directory..."
    cd app || exit 1

    echo "⬇️  Pulling latest changes from GitHub..."
    git pull

    echo "📦 Installing dependencies (if any new ones)..."
    npm install

    echo "🔨 Building Next.js application..."
    npm run build

    echo "🔄 Restarting application with PM2..."
    pm2 restart funny-tourism

    echo ""
    echo "✅ Deployment completed successfully!"
    echo ""
    echo "📊 Application status:"
    pm2 status funny-tourism

    echo ""
    echo "🌐 Application is now live at https://www.funnytourism.com"
ENDSSH

echo ""
echo "🎉 Deployment finished!"
