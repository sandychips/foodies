# Render Deployment Configuration

Complete guide for deploying Foodies to Render.com with CI/CD integration.

## 🎯 Prerequisites

- Render.com account (free tier available)
- GitHub repository
- PostgreSQL database (Render provides free tier)

## 🗄️ Database Setup

### Create PostgreSQL Database

1. **Go to Render Dashboard**
   - Click "New +" → "PostgreSQL"

2. **Configure Database:**
   ```
   Name: foodies-db
   Database: foodies_db
   User: foodies_user
   Region: Choose closest to your users
   Plan: Free (or paid for production)
   ```

3. **Save Connection Details:**
   - Internal Database URL (for backend)
   - External Database URL (for migrations)

## 🔧 Backend Deployment

### 1. Create Backend Service

1. **New Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select branch: `main`

2. **Configure Service:**
   ```yaml
   Name: foodies-backend
   Region: Same as database
   Branch: main
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   Plan: Free (or paid for production)
   ```

3. **Environment Variables:**
   ```bash
   NODE_ENV=production
   PORT=5000

   # Database (use Internal Database URL from your Render PostgreSQL)
   DATABASE_URL=<your-internal-postgres-url>

   # JWT Secrets (generate strong random strings)
   JWT_SECRET=<your-strong-secret-key-32-chars-min>
   REFRESH_TOKEN_SECRET=<your-strong-refresh-secret-32-chars-min>
   JWT_EXPIRE=7d
   REFRESH_TOKEN_EXPIRE=30d

   # Cloudinary (for image uploads)
   CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
   CLOUDINARY_API_KEY=<your-cloudinary-api-key>
   CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>

   # CORS (your frontend URL)
   CORS_ORIGIN=https://your-frontend.onrender.com

   # Swagger (optional, set to false in production)
   SWAGGER_ENABLED=false
   ```

4. **Advanced Settings:**
   - Health Check Path: `/health`
   - Auto-Deploy: Yes

### 2. Run Database Migrations

After first deployment:

```bash
# Using Render Shell (Dashboard > Shell)
npm run migrate

# Or using external database URL locally
DATABASE_URL=<external-db-url> npm run migrate
```

### 3. Seed Database (Optional)

```bash
npm run seed
```

## 🌐 Frontend Deployment

### 1. Create Frontend Service

1. **New Static Site:**
   - Click "New +" → "Static Site"
   - Connect your GitHub repository
   - Select branch: `main`

2. **Configure Service:**
   ```yaml
   Name: foodies-frontend
   Branch: main
   Root Directory: frontend
   Build Command: npm install && npm run build
   Publish Directory: dist
   ```

3. **Environment Variables:**
   ```bash
   # Backend API URL (your backend service URL)
   VITE_API_URL=https://foodies-backend.onrender.com/api/v1

   # Other configs if needed
   NODE_ENV=production
   ```

4. **Custom Domain (Optional):**
   - Settings > Custom Domain
   - Add your domain
   - Configure DNS records

## 🔗 Get Deploy Hooks

### Backend Deploy Hook

1. Go to Backend Service → Settings
2. Scroll to "Deploy Hook"
3. Copy the URL (looks like: `https://api.render.com/deploy/srv-xxxxx?key=xxxxx`)
4. Add to GitHub Secrets as `RENDER_DEPLOY_HOOK_BACKEND`

### Frontend Deploy Hook

1. Go to Frontend Service → Settings
2. Scroll to "Deploy Hook"
3. Copy the URL
4. Add to GitHub Secrets as `RENDER_DEPLOY_HOOK_FRONTEND`

## 🔐 Security Configuration

### 1. Environment Variables Security

- ✅ Never commit `.env` files
- ✅ Use strong random strings for JWT secrets (32+ characters)
- ✅ Rotate secrets periodically
- ✅ Use different secrets for staging/production

### 2. CORS Configuration

Update backend `CORS_ORIGIN` when frontend URL changes:
```bash
CORS_ORIGIN=https://foodies-frontend.onrender.com,https://yourdomain.com
```

### 3. Rate Limiting

Already configured in backend (`middleware/rateLimiter.js`):
- 100 requests per 15 minutes per IP
- Adjust in code if needed

## 🚀 Deployment Process

### Automatic Deployment (via CI/CD)

1. Push to `main` branch
2. GitHub Actions runs tests
3. If tests pass, triggers Render deployment
4. Render builds and deploys
5. Health checks verify deployment

### Manual Deployment

1. **Via Render Dashboard:**
   - Go to service → Manual Deploy
   - Select branch → Deploy

2. **Via Deploy Hook:**
   ```bash
   curl -X POST https://api.render.com/deploy/srv-xxxxx?key=xxxxx
   ```

## 📊 Monitoring

### Health Checks

- **Backend**: `https://your-backend.onrender.com/health`
- Returns: `{"status": "ok"}`

### Logs

- Render Dashboard → Service → Logs
- Real-time log streaming
- Download historical logs

### Metrics

- Render Dashboard → Service → Metrics
- CPU, Memory, Request rate
- Upgrade to paid plan for more metrics

## 🐛 Troubleshooting

### Build Fails

**Issue**: `npm install` fails
```bash
# Solution: Clear build cache
# Dashboard → Service → Settings → Clear build cache → Manual Deploy
```

**Issue**: Missing dependencies
```bash
# Solution: Check package.json includes all deps
# Run locally: npm ci && npm run build
```

### Database Connection Fails

**Issue**: Cannot connect to database
```bash
# Solutions:
1. Check DATABASE_URL is set correctly
2. Use Internal Database URL (not External)
3. Verify database is running (Dashboard → Database)
4. Check network region matches
```

### Backend Health Check Fails

**Issue**: Service keeps restarting
```bash
# Solutions:
1. Check logs for errors (Dashboard → Logs)
2. Verify start command: npm start
3. Check PORT variable (Render provides this)
4. Verify database migrations ran successfully
```

### Frontend Not Loading

**Issue**: Blank page or API errors
```bash
# Solutions:
1. Check VITE_API_URL points to backend
2. Verify backend CORS_ORIGIN includes frontend URL
3. Check browser console for errors
4. Verify build command completed successfully
```

### Slow Cold Starts (Free Tier)

**Issue**: First request takes 30+ seconds
```bash
# This is normal for free tier (service spins down after inactivity)
# Solutions:
1. Upgrade to paid plan ($7/month) for always-on service
2. Use external monitoring (cron-job.org) to keep awake
3. Implement loading states in frontend
```

## 💰 Cost Optimization

### Free Tier Limits

- **PostgreSQL**: 1 GB storage, 97 connection hours/month
- **Web Services**: 750 hours/month (all services combined)
- **Static Sites**: 100 GB bandwidth/month
- **Note**: Services spin down after 15min inactivity

### Recommended Paid Plans

**Production Ready (~$21/month):**
- PostgreSQL Starter: $7/month (256MB RAM, 1GB storage)
- Backend Starter: $7/month (512MB RAM)
- Frontend: Free (static sites)
- Total: $14/month + domain costs

**High Traffic (~$50/month):**
- PostgreSQL Standard: $20/month
- Backend Standard: $25/month
- Frontend with CDN: $5/month
- Total: $50/month

## 🔄 Database Backup & Recovery

### Automatic Backups (Paid Plans)

- Daily automated backups
- Point-in-time recovery
- Download backup snapshots

### Manual Backup (Free Tier)

```bash
# Export database
pg_dump <external-database-url> > backup.sql

# Restore database
psql <external-database-url> < backup.sql
```

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Node.js Deployment Guide](https://render.com/docs/deploy-node-express-app)
- [Static Site Guide](https://render.com/docs/deploy-create-react-app)
- [PostgreSQL Guide](https://render.com/docs/databases)

## ✅ Deployment Checklist

- [ ] PostgreSQL database created
- [ ] Database migrations run successfully
- [ ] Backend service deployed and healthy
- [ ] Frontend service deployed and accessible
- [ ] Environment variables configured
- [ ] CORS properly configured
- [ ] Deploy hooks added to GitHub secrets
- [ ] Health checks passing
- [ ] Custom domain configured (optional)
- [ ] SSL/HTTPS enabled (automatic on Render)
- [ ] Monitoring and alerts set up
- [ ] Backup strategy in place

## 🎉 Success!

Your Foodies application is now deployed and accessible at:
- **Frontend**: `https://your-frontend.onrender.com`
- **Backend API**: `https://your-backend.onrender.com/api/v1`
- **API Docs**: `https://your-backend.onrender.com/api/docs` (if enabled)