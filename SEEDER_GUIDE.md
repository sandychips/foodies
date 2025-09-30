# 🌱 Foodies Database Seeding Guide

This guide explains how to populate your Foodies database with sample data from the `foodiesjson` directory.

## 📋 Prerequisites

1. **Database Setup**: Ensure PostgreSQL is running and your database is created
2. **Environment Variables**: Configure your `.env` file with database credentials
3. **Dependencies**: Install all npm packages with `npm install`
4. **Migrations**: Run database migrations first (if needed)

## 🗂️ Available Seeders

The following seeders are available in the correct execution order:

1. **001-seed-categories.js** - Recipe categories (Dessert, Chicken, Beef, etc.)
2. **002-seed-areas.js** - Geographic areas (Italian, French, American, etc.)
3. **003-seed-ingredients.js** - Recipe ingredients (~400+ items)
4. **004-seed-users.js** - Sample users with default password
5. **005-seed-testimonials.js** - User testimonials
6. **006-seed-recipes.js** - Complete recipes with ingredients

## 🚀 How to Run Seeders

### Option 1: Run All Seeders at Once
```bash
npm run db:seed
```

### Option 2: Run Individual Seeders
```bash
# Run specific seeder
npx sequelize-cli db:seed --seed 001-seed-categories.js

# Run multiple seeders in order
npx sequelize-cli db:seed --seed 001-seed-categories.js
npx sequelize-cli db:seed --seed 002-seed-areas.js
npx sequelize-cli db:seed --seed 003-seed-ingredients.js
```

### Option 3: Reset and Reseed Database
```bash
# Reset database and run all seeds
npm run db:reset
```

## 📊 Data Overview

After seeding, your database will contain:

- **Categories**: ~15 recipe categories
- **Areas**: ~27 geographic regions
- **Ingredients**: ~400+ cooking ingredients
- **Users**: Sample users (password: `password123`)
- **Testimonials**: User reviews and testimonials
- **Recipes**: Complete recipes with ingredients and instructions

## 🔧 Troubleshooting

### Common Issues:

1. **Missing Dependencies**
   ```bash
   npm install bcryptjs uuid
   ```

2. **Database Connection Error**
   - Check your `.env` database credentials
   - Ensure PostgreSQL is running
   - Verify database exists

3. **Sequelize CLI Not Found**
   ```bash
   npm install -g sequelize-cli
   # OR
   npx sequelize-cli --help
   ```

4. **Foreign Key Constraints**
   - Run seeders in the correct order (categories → areas → ingredients → users → testimonials → recipes)
   - Don't skip dependency seeders

### Undo Seeders

To remove seeded data:

```bash
# Undo all seeders
npm run db:seed:undo

# Undo specific seeder
npx sequelize-cli db:seed:undo --seed 006-seed-recipes.js
```

## 📝 Notes

- **Default Password**: All seeded users have password `password123`
- **Large Dataset**: Ingredients and recipes are seeded in batches for performance
- **Data Mapping**: MongoDB IDs are converted to PostgreSQL UUIDs
- **Relationships**: Recipe ingredients are properly linked through junction tables

## 🔍 Verification

After seeding, verify data was loaded:

```sql
-- Check record counts
SELECT 'categories' as table_name, COUNT(*) as count FROM categories
UNION ALL
SELECT 'areas', COUNT(*) FROM areas
UNION ALL
SELECT 'ingredients', COUNT(*) FROM ingredients
UNION ALL
SELECT 'users', COUNT(*) FROM users
UNION ALL
SELECT 'testimonials', COUNT(*) FROM testimonials
UNION ALL
SELECT 'recipes', COUNT(*) FROM recipes;
```

## 🚀 Next Steps

After seeding:

1. Start your server: `npm run dev`
2. Visit API documentation: `http://localhost:5000/api/docs`
3. Test authentication with seeded users
4. Explore recipes and categories through the API

---

**🎉 Your Foodies database is now populated with sample data!**