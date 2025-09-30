# Foodies - Multi-Environment Deployment Guide

Complete guide for deploying Foodies across multiple environments: Vercel, Render, and Docker.

## 🎯 Deployment Options Overview

This project supports **4 deployment scenarios**:

| Environment | Backend | Frontend | Best For |
|-------------|---------|----------|----------|
| **Vercel** | Render | Vercel | Demo/Production |
| **Render** | Render | Render | Production |
| **Docker** | Docker | Docker | Local Development |
| **Hybrid** | Render | Vercel + Render | Maximum Availability |

---

## 🚀 Quick Start - Local Docker Development

### Prerequisites
- Docker Desktop installed
- Docker Compose installed

### 1. Clone and Configure

```bash
git clone <your-repo-url>
cd foodies

# Copy environment file
cp .env.example .env

# Edit .env with your settings (Cloudinary, etc.)
nano .env
```

### 2. Start All Services

```bash
# Start all services (backend, frontend, postgres)
docker-compose up -d

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

### 3. Initialize Database

```bash
# Run migrations
docker-compose exec backend npm run migrate

# Seed database (optional)
docker-compose exec backend npm run seed
```

### 4. Access Services

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api/v1
- **API Docs**: http://localhost:5000/api/docs
- **PostgreSQL**: localhost:5432

### Stop Services

```bash
docker-compose down          # Stop services
docker-compose down -v       # Stop and remove volumes (clean slate)
```

---

## ☁️ Production Deployment - Vercel (Frontend) + Render (Backend)

### Part 1: Deploy Backend to Render

#### 1. Create PostgreSQL Database

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "PostgreSQL"
3. Configure:
   ```
   Name: foodies-db
   Database: foodies_db
   User: foodies_user
   Plan: Free (or paid)
   ```
4. Save the **Internal Database URL**

#### 2. Deploy Backend

1. Click "New +" → "Web Service"
2. Connect GitHub repository
3. Configure:
   ```yaml
   Name: foodies-backend
   Branch: main
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   Plan: Free (or paid)
   ```

4. Environment Variables:
   ```bash
   NODE_ENV=production
   PORT=5000
   DATABASE_URL=<internal-database-url-from-step-1>
   JWT_SECRET=<generate-strong-32char-secret>
   REFRESH_TOKEN_SECRET=<generate-strong-32char-secret>
   JWT_EXPIRE=7d
   REFRESH_TOKEN_EXPIRE=30d
   CLOUDINARY_CLOUD_NAME=<your-cloudinary-name>
   CLOUDINARY_API_KEY=<your-cloudinary-key>
   CLOUDINARY_API_SECRET=<your-cloudinary-secret>
   CORS_ORIGIN=https://your-app.vercel.app
   SWAGGER_ENABLED=false
   ```

5. Deploy and note your backend URL (e.g., `https://foodies-backend.onrender.com`)

#### 3. Run Migrations

```bash
# Via Render Shell
npm run migrate

# Or locally with external DB URL
DATABASE_URL=<external-db-url> npm run migrate
```

### Part 2: Deploy Frontend to Vercel

#### 1. Connect GitHub to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Vercel auto-detects settings

#### 2. Configure Project

Vercel should auto-detect, but verify:

```yaml
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

#### 3. Environment Variables

Add in Vercel dashboard:

```bash
VITE_API_URL=https://foodies-backend.onrender.com/api/v1
```

#### 4. Deploy

- Click "Deploy"
- Vercel will build and deploy
- You'll get a production URL: `https://your-app.vercel.app`

#### 5. Update Backend CORS

Go back to Render backend environment variables and update:

```bash
CORS_ORIGIN=https://your-app.vercel.app,https://your-app-git-main.vercel.app
```

### Part 3: Enable Automatic Deployments

#### GitHub Actions Setup

1. Get deploy hooks from Render:
   - Backend → Settings → Deploy Hook
   - Copy the URL

2. Add GitHub Secrets:
   ```
   RENDER_DEPLOY_HOOK_BACKEND=https://api.render.com/deploy/...
   BACKEND_URL=https://foodies-backend.onrender.com
   VERCEL_PRODUCTION_URL=https://your-app.vercel.app
   ```

3. Push to `main` branch:
   ```bash
   git push origin main
   ```

4. GitHub Actions will:
   - ✅ Run all tests
   - ✅ Deploy backend to Render
   - ✅ Vercel auto-deploys frontend (via GitHub integration)

---

## 🔄 Alternative: Full Render Deployment

If you prefer to deploy both backend and frontend on Render:

### Frontend on Render

1. Click "New +" → "Static Site"
2. Configure:
   ```yaml
   Name: foodies-frontend
   Branch: main
   Root Directory: frontend
   Build Command: npm install && npm run build
   Publish Directory: dist
   ```

3. Environment Variables:
   ```bash
   VITE_API_URL=https://foodies-backend.onrender.com/api/v1
   ```

4. Get deploy hook and add to GitHub secrets:
   ```
   RENDER_DEPLOY_HOOK_FRONTEND=https://api.render.com/deploy/...
   FRONTEND_URL=https://foodies-frontend.onrender.com
   ```

---

## 🐳 Docker Production Deployment

For self-hosting with Docker:

### 1. Build Production Images

```bash
# Build backend
cd backend
docker build -t foodies-backend:latest .

# Build frontend
cd ../frontend
docker build -t foodies-frontend:latest .
```

### 2. Create Production docker-compose

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    restart: always
    environment:
      POSTGRES_USER: foodies_user
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: foodies_db
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    image: foodies-backend:latest
    restart: always
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://foodies_user:${POSTGRES_PASSWORD}@postgres:5432/foodies_db
      JWT_SECRET: ${JWT_SECRET}
      # ... other env vars
    ports:
      - "5000:5000"
    depends_on:
      - postgres

  frontend:
    image: foodies-frontend:latest
    restart: always
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

### 3. Deploy

```bash
docker-compose -f docker-compose.prod.yml up -d
```

---

## 📊 Deployment Matrix

### Feature Comparison

| Feature | Docker Local | Vercel + Render | Full Render |
|---------|-------------|-----------------|-------------|
| **Cost** | Free | $7-14/month | $7-14/month |
| **Setup Time** | 5 minutes | 15 minutes | 20 minutes |
| **Auto-Deploy** | No | Yes | Yes |
| **CDN** | No | Yes (Vercel) | No |
| **SSL** | Manual | Automatic | Automatic |
| **Custom Domain** | No | Yes | Yes |
| **Best For** | Development | Production Demo | Production |

### Performance Comparison

| Metric | Vercel Frontend | Render Frontend | Docker Local |
|--------|----------------|-----------------|--------------|
| **Build Time** | ~2 min | ~3 min | N/A |
| **Cold Start** | Instant | 30s (free tier) | N/A |
| **Global CDN** | ✅ Yes | ❌ No | ❌ No |
| **Edge Caching** | ✅ Yes | ❌ No | ❌ No |
| **TTFB** | <100ms | 200-500ms | N/A |

---

## 🔐 Security Checklist

- [ ] Strong JWT secrets (32+ characters, random)
- [ ] Database password is secure
- [ ] CORS configured correctly
- [ ] Environment variables not committed
- [ ] SSL/HTTPS enabled (automatic on Vercel/Render)
- [ ] Rate limiting enabled (already in code)
- [ ] Cloudinary keys are valid
- [ ] Swagger disabled in production

---

## 🐛 Troubleshooting

### Docker Issues

**Problem**: Containers won't start
```bash
# Solution: Check logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres

# Rebuild images
docker-compose build --no-cache
docker-compose up -d
```

**Problem**: Database connection fails
```bash
# Solution: Ensure postgres is healthy
docker-compose ps

# Check postgres logs
docker-compose logs postgres

# Restart postgres
docker-compose restart postgres
```

### Vercel Issues

**Problem**: Build fails
```bash
# Solutions:
1. Check build logs in Vercel dashboard
2. Verify VITE_API_URL is set
3. Test build locally: npm run build
4. Check Node version (should be 18.x)
```

**Problem**: API calls fail (CORS)
```bash
# Solution: Update backend CORS_ORIGIN
# Include all Vercel URLs:
# - Production: your-app.vercel.app
# - Preview: your-app-git-main.vercel.app
# - Dev: your-app-*.vercel.app
```

### Render Issues

**Problem**: Service won't start
```bash
# Solutions:
1. Check Render logs
2. Verify environment variables
3. Check DATABASE_URL format
4. Ensure migrations ran successfully
```

**Problem**: Slow response (free tier)
```bash
# This is normal for free tier (spins down after 15min)
# Solutions:
1. Upgrade to paid plan ($7/month)
2. Use external monitoring to keep alive
3. Implement loading states in frontend
```

---

## 📈 Scaling Recommendations

### Starting Out (Free Tier)
- Vercel: Free (hobby plan)
- Render Backend: Free
- Render PostgreSQL: Free
- **Total**: $0/month
- **Limitations**: Cold starts, limited resources

### Production Ready ($14-20/month)
- Vercel: Free (hobby) or Pro ($20/month)
- Render Backend: Starter ($7/month)
- Render PostgreSQL: Starter ($7/month)
- **Total**: $14-34/month
- **Benefits**: No cold starts, better performance

### High Traffic ($50-100/month)
- Vercel: Pro ($20/month)
- Render Backend: Standard ($25/month)
- Render PostgreSQL: Standard ($20/month)
- Redis Cache: $10/month (optional)
- **Total**: $75-85/month
- **Benefits**: High availability, auto-scaling

---

## 🎉 Success Checklist

### Local Development
- [ ] Docker containers running
- [ ] Frontend accessible at localhost:3000
- [ ] Backend API responding at localhost:5000
- [ ] Database migrations completed
- [ ] Test data seeded

### Vercel + Render Production
- [ ] Backend deployed on Render
- [ ] PostgreSQL database created
- [ ] Database migrations completed
- [ ] Frontend deployed on Vercel
- [ ] Environment variables configured
- [ ] CORS configured correctly
- [ ] GitHub Actions working
- [ ] Automatic deployments enabled

### Testing Deployment
- [ ] Frontend loads without errors
- [ ] Can register new user
- [ ] Can login
- [ ] Can view recipes
- [ ] Can create recipe (with image)
- [ ] API health check passes

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [Docker Documentation](https://docs.docker.com/)
- [GitHub Actions Docs](https://docs.github.com/en/actions)

---

## 🆘 Need Help?

1. Check the troubleshooting section above
2. Review service logs (Vercel/Render dashboard or Docker logs)
3. Verify environment variables are correct
4. Test API endpoints with Postman/curl
5. Check CORS configuration

---

**Happy Deploying! 🚀**