# 🚀 Step-by-Step Deployment Guide

Complete walkthrough from local development to cloud deployment.

## 📋 Prerequisites

Before starting, gather these credentials:
- **Cloudinary Account**: Cloud name, API key, API secret
- **GitHub Personal Access Token**: Already created ✅
- **Render Account**: Free account at render.com

---

## 🏠 STEP 1: Local Docker Development Setup

### 1.1 Edit Environment File

**File to edit**: `backend/.env`

```bash
# Copy the example file
cp backend/.env.example backend/.env
```

**Edit `backend/.env` with your credentials:**

```env
# Database
NODE_ENV=development
DATABASE_URL=postgresql://foodies_user:foodies_password@postgres:5432/foodies_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-32-characters-min
REFRESH_TOKEN_SECRET=your-refresh-secret-different-from-jwt-32-chars
JWT_EXPIRE=7d
REFRESH_TOKEN_EXPIRE=30d

# Cloudinary (Image uploads) - REPLACE WITH YOUR CREDENTIALS
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# CORS
CORS_ORIGIN=http://localhost:3000

# Server
PORT=5000

# Development
SWAGGER_ENABLED=true
```

### 1.2 Edit Frontend Environment

**File to edit**: `frontend/.env.local` (create this file)

```bash
# Create frontend environment file
touch frontend/.env.local
```

**Add to `frontend/.env.local`:**

```env
VITE_API_URL=http://localhost:5000/api/v1
```

### 1.3 Start Local Development

```bash
# Start all services (PostgreSQL, Backend, Frontend)
docker-compose up -d

# Run database migrations
docker-compose exec backend npm run migrate

# Seed database with sample data (optional)
docker-compose exec backend npm run seed

# Check services are running
docker-compose ps
```

### 1.4 Test Local Setup

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api/v1
- **API Documentation**: http://localhost:5000/api/docs

---

## ☁️ STEP 2: Deploy Backend to Render

### 2.1 Deploy via Render Blueprint (Recommended)

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click "New" → "Blueprint"**
3. **Connect GitHub Repository**: `https://github.com/sandychips/foodies`
4. **Review Blueprint** (shows 6 services to be created)
5. **Click "Apply Blueprint"**

### 2.2 Configure Environment Variables

After Blueprint deployment, edit environment variables for each service:

**For `foodies-staging-backend`:**
1. Go to service → Environment
2. Update these variables:

```env
CLOUDINARY_CLOUD_NAME=your-actual-cloudinary-name
CLOUDINARY_API_KEY=your-actual-api-key
CLOUDINARY_API_SECRET=your-actual-secret
```

**For `foodies-prod-backend`:**
1. Go to service → Environment
2. Update the same Cloudinary variables

### 2.3 Run Database Migrations

**Option A - Via Render Shell:**
1. Go to backend service → Shell
2. Run: `npm run migrate`

**Option B - Via GitHub Secrets (Automated):**
1. Get External Database URLs from Render databases
2. Add to GitHub Secrets (Repository Settings → Secrets):

```
STAGING_DATABASE_URL=postgresql://user:pass@host:5432/foodies_staging
PRODUCTION_DATABASE_URL=postgresql://user:pass@host:5432/foodies_production
```

---

## 🌐 STEP 3: Deploy Frontend to Vercel

### 3.1 Connect Vercel to GitHub

1. **Go to Vercel**: https://vercel.com/dashboard
2. **Click "Add New..." → "Project"**
3. **Import from GitHub**: Select `sandychips/foodies`
4. **Configure Project Settings:**

```yaml
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### 3.2 Set Environment Variables

In Vercel project settings → Environment Variables:

**For Production:**
```env
VITE_API_URL=https://foodies-prod-backend.onrender.com/api/v1
```

**For Preview (optional):**
```env
VITE_API_URL=https://foodies-staging-backend.onrender.com/api/v1
```

### 3.3 Deploy

- **Click "Deploy"**
- Vercel will build and deploy your frontend
- Get your production URL: `https://your-app.vercel.app`

---

## 🔗 STEP 4: Update CORS Configuration

### 4.1 Update Backend CORS

**File to edit**: None (do this in Render Dashboard)

1. **Go to Render** → Production Backend Service → Environment
2. **Update `CORS_ORIGIN`:**

```env
CORS_ORIGIN=https://your-app.vercel.app,https://your-app-git-main.vercel.app
```

3. **For Staging Backend:**

```env
CORS_ORIGIN=https://foodies-staging-frontend.onrender.com,https://your-app.vercel.app
```

---

## 🔐 STEP 5: GitHub Secrets Configuration

### 5.1 Required Secrets

Go to **GitHub Repository → Settings → Secrets and Variables → Actions**

Add these secrets:

```bash
# Database URLs (for migrations)
STAGING_DATABASE_URL=postgresql://user:pass@host/foodies_staging
PRODUCTION_DATABASE_URL=postgresql://user:pass@host/foodies_production

# Health check URLs (optional)
STAGING_BACKEND_URL=https://foodies-staging-backend.onrender.com
STAGING_FRONTEND_URL=https://foodies-staging-frontend.onrender.com
PROD_BACKEND_URL=https://foodies-prod-backend.onrender.com
PROD_FRONTEND_URL=https://foodies-prod-frontend.onrender.com

# Vercel URL (optional)
VERCEL_PRODUCTION_URL=https://your-app.vercel.app
```

---

## 🧪 STEP 6: Test Multi-Environment Deployment

### 6.1 Test Staging Deployment

```bash
# Switch to develop branch
git checkout develop

# Make a small change
echo "# Staging test" >> README.md

# Commit and push
git add .
git commit -m "test: staging deployment"
git push origin develop
```

**This triggers:**
- ✅ Staging database migrations
- ✅ Backend deployment to staging
- ✅ Frontend deployment to staging
- ✅ Health checks

### 6.2 Test Production Deployment

```bash
# Switch to main branch
git checkout main

# Merge develop changes
git merge develop

# Push to production
git push origin main
```

**This triggers:**
- ✅ Production database migrations
- ✅ Backend deployment to production
- ✅ Vercel frontend auto-deployment
- ✅ Health checks

---

## 📋 File Summary

Here are all the files you need to edit with credentials:

### Local Development:
- `backend/.env` - Database, JWT, Cloudinary credentials
- `frontend/.env.local` - Local API URL

### Cloud Configuration:
- **Render Dashboard** - Environment variables for both backends
- **Vercel Dashboard** - Frontend environment variables
- **GitHub Secrets** - Database URLs and health check URLs

### No Files to Edit:
- `render.yaml` - Already configured ✅
- GitHub Actions workflows - Already configured ✅
- Docker configuration - Already configured ✅

---

## 🎯 Quick Reference URLs

After deployment, your services will be available at:

### Staging Environment:
- Backend: `https://foodies-staging-backend.onrender.com/api/v1`
- Frontend: `https://foodies-staging-frontend.onrender.com`
- API Docs: `https://foodies-staging-backend.onrender.com/api/docs`

### Production Environment:
- Backend: `https://foodies-prod-backend.onrender.com/api/v1`
- Frontend: `https://your-app.vercel.app`
- API Docs: Disabled for security

---

## 🎉 Success Checklist

- [ ] Local Docker environment running
- [ ] Cloudinary credentials added to all environments
- [ ] Render Blueprint deployed (6 services)
- [ ] Vercel frontend deployed
- [ ] CORS configured for all domains
- [ ] GitHub secrets configured
- [ ] Staging deployment tested
- [ ] Production deployment tested
- [ ] All health checks passing

**You're now running enterprise-grade multi-environment deployment! 🚀**