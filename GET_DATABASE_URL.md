# Get Your Render PostgreSQL Database URL

## 📋 Step-by-Step Instructions

### 1. Access Render Dashboard
1. Open your browser and go to: **https://dashboard.render.com**
2. Log in with your Render account credentials

### 2. Find Your Database Service
1. Look for your database service named: **`foodies-db`**
2. Click on the database service to open it

### 3. Get the Connection String
1. In the database dashboard, look for one of these sections:
   - **"Connections"**
   - **"Connection Info"** 
   - **"Database URL"**
   - **"External Database URL"**

2. Copy the **External Database URL** - it will look like:
   ```
   postgresql://foodies_user:SOME_PASSWORD@dpg-xxxxx-a.oregon-postgres.render.com/foodies_production
   ```

### 4. Alternative: Use Internal URL if External doesn't work
If you only see an "Internal Database URL", copy that instead:
```
postgresql://foodies_user:SOME_PASSWORD@dpg-xxxxx-a/foodies_production
```

## 🔒 Security Note
- The URL contains your database password
- Keep it secure and don't share it publicly
- We'll use it temporarily to seed your database

## 📋 What to Do Next
Once you have the URL, run:
```bash
cd /home/andy/projects/codex/backend
DATABASE_URL="your_copied_url_here" node scripts/seed-production.js
```

## ❓ Can't Find the Database URL?
If you're having trouble finding it:
1. Look for tabs like "Connect", "Info", or "Settings" in your database dashboard
2. Sometimes it's under "Environment Variables" 
3. The URL format should start with `postgresql://`

Let me know when you have the URL and I'll help you run the seeding command!