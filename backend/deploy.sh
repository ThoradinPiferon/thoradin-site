#!/bin/bash

# Production Deployment Script for Thoradin Backend
# This script ensures database migrations are applied before starting the server

echo "🚀 Starting Thoradin Backend deployment..."

# Set environment
export NODE_ENV=production

# Run force migration to ensure all tables and constraints are correct
echo "🚨 Running force migration for production database..."
npm run force:migrate

# Start the server
echo "🌐 Starting server..."
npm start 