# API Testing Guide - PostgreSQL Backend

Your backend is deployed on Render with PostgreSQL. Here's how to seed the database and test all endpoints.

## 🗄️ Database Setup

### Step 1: Get your PostgreSQL URL from Render
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Select your PostgreSQL database service (`foodies-db`)
3. Copy the **External Database URL** (starts with `postgresql://`)

### Step 2: Run Database Migration & Seeding

```bash
cd /home/andy/projects/codex/backend

# Option A: Using the production seeding script
DATABASE_URL="your_copied_postgres_url" node scripts/seed-production.js

# Option B: Manual commands
DATABASE_URL="your_copied_postgres_url" npm run migrate
DATABASE_URL="your_copied_postgres_url" npm run seed
```

## 🧪 API Endpoint Testing

### Base URL
```
https://foodies-backend-6qrb.onrender.com
```

### 1. Health Check (No Auth Required)
```bash
curl https://foodies-backend-6qrb.onrender.com/health
# Expected: {"status":"ok"}
```

### 2. Categories (No Auth Required)
```bash
curl https://foodies-backend-6qrb.onrender.com/api/v1/categories
# Expected: Array of recipe categories
```

### 3. Areas/Cuisines (No Auth Required)  
```bash
curl https://foodies-backend-6qrb.onrender.com/api/v1/areas
# Expected: Array of cuisine areas (Italian, Mexican, etc.)
```

### 4. Recipes (No Auth Required)
```bash
curl https://foodies-backend-6qrb.onrender.com/api/v1/recipes
# Expected: Array of sample recipes
```

### 5. User Registration (Creates Auth Token)
```bash
curl -X POST https://foodies-backend-6qrb.onrender.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com", 
    "password": "password123"
  }'
# Expected: User data with JWT token
```

### 6. User Login
```bash
curl -X POST https://foodies-backend-6qrb.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
# Expected: JWT token for authenticated requests
```

### 7. Protected Routes (Require Authorization)
```bash
# Get user profile (replace YOUR_JWT_TOKEN)
curl -X GET https://foodies-backend-6qrb.onrender.com/api/v1/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📋 Sample Database Content

After seeding, your database will contain:

- **Categories**: Dessert, Main Course, Appetizer, etc.
- **Areas**: Italian, Mexican, Chinese, Indian, etc. 
- **Ingredients**: Common cooking ingredients
- **Users**: Sample user accounts
- **Recipes**: Sample recipes with ingredients and instructions
- **Testimonials**: User testimonials

## 🔧 Troubleshooting

### Internal Server Error
- Database needs migration: Run the seeding script
- Check Render logs for specific error details

### Authorization Missing
- Endpoint requires login: Use `/auth/register` or `/auth/login` first
- Include `Authorization: Bearer <token>` header

### CORS Issues  
- Frontend domain added to CORS_ORIGIN in render.yaml
- Update if using different Vercel URL

## 🚀 Frontend Integration

Update your frontend environment variables:
```bash
# Vercel Environment Variables
VITE_API_URL=https://foodies-backend-6qrb.onrender.com/api/v1
```

## 📖 API Documentation

Once deployed, access interactive API docs:
```
https://foodies-backend-6qrb.onrender.com/api/docs
```