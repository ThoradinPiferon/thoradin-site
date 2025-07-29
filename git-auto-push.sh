#!/bin/bash

# Auto Git Push Script for Interactive Storytelling Grid
# This script commits and pushes all changes to GitHub

echo "🔄 Auto Git Push - Interactive Storytelling Grid"
echo "=================================="

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo "❌ Error: Not in thoradin-site directory"
    exit 1
fi

# Check Git status
echo "📊 Checking Git status..."
git status --porcelain

# Check if there are any changes to commit
if [ -z "$(git status --porcelain)" ]; then
    echo "✅ No changes to commit"
    exit 0
fi

# Add all changes
echo "📦 Adding all changes..."
git add .

# Create commit with timestamp
TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")
COMMIT_MESSAGE="Auto-commit: $TIMESTAMP - Local development changes"
echo "💾 Committing changes: $COMMIT_MESSAGE"
git commit -m "$COMMIT_MESSAGE"

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo "✅ Successfully pushed to GitHub!"
           echo "🌐 Repository: https://github.com/your-username/interactive-storytelling-grid"
else
    echo "❌ Failed to push to GitHub"
    exit 1
fi 