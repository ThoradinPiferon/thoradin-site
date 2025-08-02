#!/bin/bash

# Production Deployment Script for Thoradin Backend
# This script ensures database migrations are applied before starting the server

echo "🚀 Starting Thoradin Backend deployment..."

# Set environment
export NODE_ENV=production

# Generate Prisma client
echo "📦 Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "🗄️ Running database migrations..."
npx prisma migrate deploy

# Check migration status
echo "🔍 Checking migration status..."
npx prisma migrate status

# Start the server
echo "🌐 Starting server..."
npm start 