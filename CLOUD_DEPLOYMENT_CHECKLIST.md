# 🚀 Cloud Deployment Checklist

Follow this checklist step-by-step to deploy your Foodies application to the cloud.

## ✅ Pre-Deployment Status
- [x] Local development environment working
- [x] Backend API responding on localhost:5002
- [x] Database migrations completed locally
- [x] Cloudinary credentials configured
- [x] Code pushed to GitHub

---

## 🏗️ STEP 1: Deploy to Render via Blueprint

### 1.1 Deploy Blueprint
- [ ] Go to https://dashboard.render.com
- [ ] Click "New" → "Blueprint"  
- [ ] Connect GitHub repository: `sandychips/foodies`
- [ ] Review 6 services to be created:
  - [ ] foodies-staging-db (PostgreSQL)
  - [ ] foodies-prod-db (PostgreSQL)
  - [ ] foodies-staging-backend (Node.js)
  - [ ] foodies-prod-backend (Node.js)
  - [ ] foodies-staging-frontend (Static Site)
  - [ ] foodies-prod-frontend (Static Site)
- [ ] Click "Apply Blueprint"
- [ ] Wait for deployment to complete (5-10 minutes)

### 1.2 Configure Environment Variables
Add Cloudinary credentials to both backend services:

**For foodies-staging-backend:**
- [ ] Go to service → Environment tab
- [ ] Add: `CLOUDINARY_CLOUD_NAME=dd9fyaeon`
- [ ] Add: `CLOUDINARY_API_KEY=219778695899535`
- [ ] Add: `CLOUDINARY_API_SECRET=5FRoXA6Lk9Vu4d3NxnYbMhxtSno`
- [ ] Save changes

**For foodies-prod-backend:**
- [ ] Go to service → Environment tab  
- [ ] Add: `CLOUDINARY_CLOUD_NAME=dd9fyaeon`
- [ ] Add: `CLOUDINARY_API_KEY=219778695899535`
- [ ] Add: `CLOUDINARY_API_SECRET=5FRoXA6Lk9Vu4d3NxnYbMhxtSno`
- [ ] Save changes

### 1.3 Run Database Migrations
**Via Render Shell (Recommended):**
- [ ] Go to foodies-prod-backend → Shell tab
- [ ] Run: `npm run migrate`
- [ ] Go to foodies-staging-backend → Shell tab
- [ ] Run: `npm run migrate`

---

## 🌐 STEP 2: Deploy Frontend to Vercel

### 2.1 Import Project
- [ ] Go to https://vercel.com/dashboard
- [ ] Click "Add New..." → "Project"
- [ ] Import from GitHub: `sandychips/foodies`
- [ ] Click "Import"

### 2.2 Configure Project Settings
- [ ] Framework Preset: **Vite**
- [ ] Root Directory: **frontend**
- [ ] Build Command: **npm run build**
- [ ] Output Directory: **dist**
- [ ] Install Command: **npm install**

### 2.3 Set Environment Variables
- [ ] Click "Environment Variables"
- [ ] Add for Production:
  - Key: `VITE_API_URL`
  - Value: `https://foodies-prod-backend.onrender.com/api/v1`
- [ ] Add for Preview (optional):
  - Key: `VITE_API_URL`
  - Value: `https://foodies-staging-backend.onrender.com/api/v1`

### 2.4 Deploy
- [ ] Click "Deploy"
- [ ] Wait for build and deployment (3-5 minutes)
- [ ] Note your production URL (e.g., `https://foodies-xxx.vercel.app`)

---

## 🔗 STEP 3: Configure CORS

### 3.1 Update Backend CORS Settings
After Vercel deployment, update CORS to allow your frontend:

**For foodies-prod-backend:**
- [ ] Go to service → Environment tab
- [ ] Update `CORS_ORIGIN` to include your Vercel URL:
  ```
  CORS_ORIGIN=https://foodies-prod-frontend.onrender.com,https://your-app.vercel.app
  ```

**For foodies-staging-backend:**
- [ ] Update `CORS_ORIGIN` if needed:
  ```
  CORS_ORIGIN=https://foodies-staging-frontend.onrender.com,https://your-app.vercel.app
  ```

---

## 🧪 STEP 4: Test Your Deployments

### 4.1 Test Staging Environment
- [ ] Test backend health: `curl https://foodies-staging-backend.onrender.com/health`
- [ ] Expected response: `{"status": "ok"}`
- [ ] Visit staging frontend: `https://foodies-staging-frontend.onrender.com`
- [ ] Visit API docs: `https://foodies-staging-backend.onrender.com/api/docs`

### 4.2 Test Production Environment  
- [ ] Test backend health: `curl https://foodies-prod-backend.onrender.com/health`
- [ ] Expected response: `{"status": "ok"}`
- [ ] Visit production frontend (Vercel): `https://your-app.vercel.app`
- [ ] Visit production frontend (Render): `https://foodies-prod-frontend.onrender.com`

### 4.3 Test Application Features
- [ ] Frontend loads without errors
- [ ] Can register a new user
- [ ] Can login successfully
- [ ] Can view recipes (if seeded)
- [ ] Image uploads work (Cloudinary integration)

---

## 🔐 STEP 5: GitHub Secrets (Optional - for automated migrations)

If you want automated database migrations via GitHub Actions:

- [ ] Go to https://github.com/sandychips/foodies/settings/secrets/actions
- [ ] Add production database URL:
  - Name: `PRODUCTION_DATABASE_URL`
  - Value: External database URL from foodies-prod-db
- [ ] Add staging database URL:
  - Name: `STAGING_DATABASE_URL`  
  - Value: External database URL from foodies-staging-db

---

## 🎯 STEP 6: Test Multi-Environment Workflow

### 6.1 Test Staging Deployment
- [ ] Switch to develop branch: `git checkout develop`
- [ ] Make a test change: `echo "# Staging test" >> README.md`
- [ ] Commit and push: 
  ```bash
  git add .
  git commit -m "test: staging deployment"
  git push origin develop
  ```
- [ ] Check GitHub Actions for staging deployment
- [ ] Verify staging services updated

### 6.2 Test Production Deployment
- [ ] Switch to main branch: `git checkout main`
- [ ] Merge develop: `git merge develop`
- [ ] Push to production: `git push origin main`
- [ ] Check GitHub Actions for production deployment
- [ ] Verify production services updated
- [ ] Verify Vercel auto-deployed frontend

---

## 🎉 Success Criteria

✅ **All systems deployed and working:**
- [ ] Staging backend responding
- [ ] Production backend responding  
- [ ] Staging frontend accessible
- [ ] Production frontend accessible (both Vercel and Render)
- [ ] Database migrations completed
- [ ] Image uploads working (Cloudinary)
- [ ] CORS configured correctly
- [ ] Multi-environment workflow tested

## 🌍 Your Live URLs

After successful deployment, your services will be available at:

### Staging Environment
- **Backend API**: https://foodies-staging-backend.onrender.com/api/v1
- **Frontend**: https://foodies-staging-frontend.onrender.com
- **API Docs**: https://foodies-staging-backend.onrender.com/api/docs

### Production Environment
- **Backend API**: https://foodies-prod-backend.onrender.com/api/v1
- **Frontend (Vercel)**: https://your-app.vercel.app
- **Frontend (Render)**: https://foodies-prod-frontend.onrender.com

---

## 🆘 Troubleshooting

**If services don't respond:**
1. Check Render Dashboard → Service → Logs
2. Verify environment variables are set
3. Ensure database migrations ran successfully
4. Check CORS configuration includes your frontend URLs

**If frontend can't connect to backend:**
1. Verify `VITE_API_URL` environment variable
2. Check backend CORS settings
3. Test backend endpoints directly with curl

**Need help?** Refer to your comprehensive guides:
- `STEP_BY_STEP_SETUP.md` - Complete setup instructions
- `DEPLOYMENT_GUIDE.md` - Original deployment guide
- `MULTI_DEPLOYMENT_GUIDE.md` - Multi-environment details

---

**🚀 Happy Multi-Environment Deploying!**