#!/bin/bash

# Production Deployment Script for Thoradin Backend
# This script ensures database migrations are applied before starting the server

echo "🚀 Starting Thoradin Backend deployment..."

# Set environment
export NODE_ENV=production

# Run comprehensive production database fix
echo "🔧 Running production database fix..."
npm run fix:production

# Start the server
echo "🌐 Starting server..."
npm start 