#!/bin/bash

echo "🧪 Testing Foodies API Endpoints"
echo "================================"

BASE_URL="https://foodies-backend-6qrb.onrender.com"

echo ""
echo "1. 🏥 Health Check"
echo "-------------------"
curl -s "$BASE_URL/health" | jq . 2>/dev/null || curl -s "$BASE_URL/health"

echo ""
echo ""
echo "2. 🏷️  Categories"
echo "-------------------"
curl -s "$BASE_URL/api/v1/categories" | jq '.[0:3]' 2>/dev/null || curl -s "$BASE_URL/api/v1/categories" | head -200

echo ""
echo ""
echo "3. 🌍 Areas/Cuisines"
echo "---------------------"
curl -s "$BASE_URL/api/v1/areas" | jq '.[0:3]' 2>/dev/null || curl -s "$BASE_URL/api/v1/areas" | head -200

echo ""
echo ""
echo "4. 🥕 Ingredients"
echo "------------------"
curl -s "$BASE_URL/api/v1/ingredients" | jq '.[0:3]' 2>/dev/null || curl -s "$BASE_URL/api/v1/ingredients" | head -200

echo ""
echo ""
echo "5. 🍳 Recipes"
echo "--------------"
curl -s "$BASE_URL/api/v1/recipes" | jq '.[0:2]' 2>/dev/null || curl -s "$BASE_URL/api/v1/recipes" | head -200

echo ""
echo ""
echo "6. 💬 Testimonials"
echo "-------------------"
curl -s "$BASE_URL/api/v1/testimonials" | jq '.[0:2]' 2>/dev/null || curl -s "$BASE_URL/api/v1/testimonials" | head -200

echo ""
echo ""
echo "7. 📖 API Documentation"
echo "------------------------"
echo "Access Swagger docs at: $BASE_URL/api/docs"

echo ""
echo ""
echo "8. 🧪 User Registration Test"
echo "-----------------------------"
echo "Testing new user registration..."
curl -s -X POST "$BASE_URL/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "API Test User",
    "email": "apitest@example.com",
    "password": "password123"
  }' | jq . 2>/dev/null || curl -s -X POST "$BASE_URL/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "API Test User",
    "email": "apitest@example.com",
    "password": "password123"
  }'

echo ""
echo ""
echo "✅ API Testing Complete!"
echo "========================"
echo ""
echo "🎯 Expected Results After Database Seeding:"
echo "- Health: {\"status\":\"ok\"}"
echo "- Categories: Array of recipe categories"
echo "- Areas: Array of cuisine areas"  
echo "- Ingredients: Array of cooking ingredients"
echo "- Recipes: Array of sample recipes"
echo "- Testimonials: Array of user testimonials"
echo "- Registration: User object with JWT token"
echo ""
echo "❌ If you see 'Internal Server Error' -> Database needs seeding"
echo "❌ If you see 'Authorization header missing' -> Endpoint requires login"
echo ""