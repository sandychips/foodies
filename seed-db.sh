#!/bin/bash

# Database Seeding Script for Render PostgreSQL
# Usage: ./seed-db.sh "your_postgres_url_here"

if [ -z "$1" ]; then
    echo "❌ Error: PostgreSQL URL required"
    echo ""
    echo "📋 Usage:"
    echo "   ./seed-db.sh \"postgresql://foodies_user:password@host/foodies_production\""
    echo ""
    echo "🔗 Get your URL from Render Dashboard:"
    echo "   1. Go to https://dashboard.render.com"
    echo "   2. Click on 'foodies-db' database service"
    echo "   3. Copy the 'External Database URL'"
    echo ""
    echo "📖 More details in: GET_DATABASE_URL.md"
    exit 1
fi

DATABASE_URL="$1"

echo "🚀 Starting production database seeding..."
echo "📊 Database: foodies_production"
echo "🔗 Host: $(echo "$DATABASE_URL" | sed 's/.*@\([^/]*\).*/\1/')"
echo ""

cd backend

echo "🔄 Setting up environment..."
export DATABASE_URL="$DATABASE_URL"
export NODE_ENV=production

echo "🧪 Testing database connection..."
if node -e "
const { sequelize } = require('./models');
sequelize.authenticate()
  .then(() => { console.log('✅ Database connection successful'); process.exit(0); })
  .catch(err => { console.error('❌ Connection failed:', err.message); process.exit(1); });
"; then
    echo ""
    echo "🏗️  Running database migrations and seeding..."
    node scripts/seed-production.js
    
    SEED_EXIT_CODE=$?
    
    if [ $SEED_EXIT_CODE -eq 0 ]; then
        echo ""
        echo "🎉 Database seeding completed successfully!"
        echo ""
        echo "🧪 Testing API endpoints..."
        cd ..
        ./test-api.sh
    else
        echo "❌ Seeding failed with exit code: $SEED_EXIT_CODE"
        exit 1
    fi
else
    echo "❌ Cannot connect to database. Please check your URL."
    exit 1
fi