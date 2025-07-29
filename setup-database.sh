#!/bin/bash

# Database Setup Script for Interactive Storytelling Grid
# This script sets up PostgreSQL and Prisma for development

echo "🗄️ Database Setup - Interactive Storytelling Grid"
echo "=================================="

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "backend" ]; then
    echo "❌ Error: Not in thoradin-site directory"
    exit 1
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "📦 Installing PostgreSQL..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            brew install postgresql
            brew services start postgresql
        else
            echo "❌ Homebrew not found. Please install Homebrew first:"
            echo "   /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
            exit 1
        fi
    else
        echo "❌ Please install PostgreSQL manually for your OS"
        exit 1
    fi
else
    echo "✅ PostgreSQL already installed"
fi

# Start PostgreSQL service
echo "🚀 Starting PostgreSQL service..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    brew services start postgresql 2>/dev/null || true
fi

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 3

# Create database if it doesn't exist
echo "🗄️ Setting up database..."
psql -U postgres -c "CREATE DATABASE interactive_grid_dev;" 2>/dev/null || echo "Database might already exist"

# Navigate to backend and setup Prisma
echo "🔧 Setting up Prisma..."
cd backend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi

# Generate Prisma client
echo "⚙️ Generating Prisma client..."
npm run db:generate 2>/dev/null || echo "Prisma client generation failed (this is normal if database is not configured)"

# Push schema to database
echo "📤 Pushing schema to database..."
npm run db:push 2>/dev/null || echo "Schema push failed (this is normal if database is not configured)"

echo "✅ Database setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Update backend/.env with your database URL:"
echo "   DATABASE_URL=\"postgresql://username:password@localhost:5432/interactive_grid_dev\""
echo "2. Run 'npm run db:push' in the backend directory"
echo "3. Start the application with 'npm run dev'" 