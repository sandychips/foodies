#!/usr/bin/env node

/**
 * Production Database Seeding Script
 * 
 * This script connects to your production PostgreSQL database on Render
 * and runs migrations + seeds to populate the database with sample data.
 * 
 * Usage:
 *   DATABASE_URL=your_render_postgres_url node scripts/seed-production.js
 */

require('dotenv').config();
const { execSync } = require('child_process');
const { sequelize } = require('../models');

const runCommand = (command, description) => {
  console.log(`\n🔄 ${description}...`);
  try {
    execSync(command, { 
      stdio: 'inherit',
      cwd: __dirname + '/..'
    });
    console.log(`✅ ${description} completed successfully`);
    return true;
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    return false;
  }
};

const seedProduction = async () => {
  try {
    console.log('🚀 Starting production database setup...\n');
    
    // Test database connection
    console.log('🔌 Testing database connection...');
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully\n');

    // Run migrations
    const migrationSuccess = runCommand('npx sequelize db:migrate', 'Running database migrations');
    if (!migrationSuccess) {
      console.error('❌ Migration failed, stopping...');
      process.exit(1);
    }

    // Run seeds  
    const seedSuccess = runCommand('npx sequelize db:seed:all', 'Seeding database with sample data');
    if (!seedSuccess) {
      console.error('❌ Seeding failed, but migrations completed');
      process.exit(1);
    }

    console.log('\n🎉 Production database setup completed successfully!');
    console.log('\n📊 Your database now contains:');
    console.log('├─ Users with sample accounts');
    console.log('├─ Categories for recipes');
    console.log('├─ Ingredients database');
    console.log('├─ Recipe areas (cuisines)');
    console.log('├─ Sample recipes');
    console.log('└─ Testimonials');
    
    console.log('\n🧪 Test your API endpoints:');
    console.log('├─ GET /health');
    console.log('├─ GET /api/v1/categories');
    console.log('├─ POST /api/v1/auth/register');
    console.log('└─ GET /api/v1/recipes');

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  } finally {
    await sequelize.close();
    console.log('\n🔒 Database connection closed');
  }
};

// Verify required environment variables
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is required');
  console.log('\n💡 Usage:');
  console.log('   DATABASE_URL=your_postgres_url node scripts/seed-production.js');
  console.log('\n🔗 Get your DATABASE_URL from Render Dashboard:');
  console.log('   1. Go to https://dashboard.render.com');
  console.log('   2. Select your PostgreSQL database');
  console.log('   3. Copy the "External Database URL"');
  process.exit(1);
}

seedProduction();