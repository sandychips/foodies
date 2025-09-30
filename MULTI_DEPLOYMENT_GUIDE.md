# 🚀 Multi-Environment Deployment Guide

Complete guide for deploying Foodies across multiple environments with automated CI/CD.

## 🎯 Architecture Overview

This project supports **4 deployment environments**:

| Environment | Purpose | Branch | Database | Auto-Deploy |
|-------------|---------|--------|----------|-------------|
| **Development** | Local coding | - | Docker PostgreSQL | Manual |
| **Staging** | Testing/QA | `develop` | Render PostgreSQL | ✅ Auto |
| **Production** | Live users | `main` | Render PostgreSQL | ✅ Auto |
| **PR Previews** | Code review | feature branches | Staging DB | ✅ Auto |

---

## 🏗️ Infrastructure Setup

### Render Blueprint Deployment

The project includes a `render.yaml` Blueprint that automatically creates:

- **Databases**: `foodies-staging-db`, `foodies-prod-db`
- **Backend APIs**: `foodies-staging-backend`, `foodies-prod-backend` 
- **Frontend Sites**: `foodies-staging-frontend`, `foodies-prod-frontend`

### Service URLs

```bash
# Staging Environment
Backend API:  https://foodies-staging-backend.onrender.com/api/v1
Frontend:     https://foodies-staging-frontend.onrender.com
API Docs:     https://foodies-staging-backend.onrender.com/api/docs

# Production Environment  
Backend API:  https://foodies-prod-backend.onrender.com/api/v1
Frontend:     https://foodies-prod-frontend.onrender.com
API Docs:     https://foodies-prod-backend.onrender.com/api/docs (disabled)
```

---

## 🔄 Deployment Workflows

### 1. Development → Staging (Automatic)

**Trigger**: Push to `develop` branch

```bash
git checkout develop
git add .
git commit -m "feat: new feature"
git push origin develop
```

**What happens:**
1. ✅ Run all tests (CI workflow)
2. ✅ Run database migrations on staging
3. ✅ Deploy backend to `foodies-staging-backend`
4. ✅ Deploy frontend to `foodies-staging-frontend`
5. ✅ Verify deployment health
6. ✅ Update GitHub with deployment status

### 2. Staging → Production (Automatic)

**Trigger**: Push to `main` branch (usually via PR merge)

```bash
# Create PR from develop to main
git checkout main
git merge develop
git push origin main
```

**What happens:**
1. ✅ Run all tests (CI workflow)
2. ✅ Run database migrations on production  
3. ✅ Deploy backend to `foodies-prod-backend`
4. ✅ Deploy frontend to `foodies-prod-frontend`
5. ✅ Verify deployment health
6. ✅ Update GitHub with deployment status

### 3. Pull Request Previews (Automatic)

**Trigger**: Open PR to `main` or `develop`

**What happens:**
1. ✅ Run all tests
2. ✅ Build frontend with staging API
3. ✅ Run linting validation
4. ✅ Comment on PR with test results
5. ✅ Update comment on each commit

---

## 🔐 Required GitHub Secrets

Add these secrets in **GitHub Repository Settings → Secrets and Variables → Actions**:

### Database URLs (for migrations)
```bash
STAGING_DATABASE_URL=postgresql://user:pass@host:5432/foodies_staging
PRODUCTION_DATABASE_URL=postgresql://user:pass@host:5432/foodies_production
```

### Render Deploy Hooks (optional - Blueprint handles this)
```bash
RENDER_DEPLOY_HOOK_STAGING_BACKEND=https://api.render.com/deploy/srv-xxx
RENDER_DEPLOY_HOOK_STAGING_FRONTEND=https://api.render.com/deploy/srv-xxx
RENDER_DEPLOY_HOOK_PROD_BACKEND=https://api.render.com/deploy/srv-xxx  
RENDER_DEPLOY_HOOK_PROD_FRONTEND=https://api.render.com/deploy/srv-xxx
```

### Health Check URLs (optional)
```bash
STAGING_BACKEND_URL=https://foodies-staging-backend.onrender.com
STAGING_FRONTEND_URL=https://foodies-staging-frontend.onrender.com
PROD_BACKEND_URL=https://foodies-prod-backend.onrender.com
PROD_FRONTEND_URL=https://foodies-prod-frontend.onrender.com
```

---

## 🛠️ Setup Instructions

### 1. Deploy via Render Blueprint

1. **Fork and clone this repository**
2. **Go to Render Dashboard** → New Blueprint
3. **Connect GitHub repository**: `https://github.com/sandychips/foodies`
4. **Review Blueprint**: Render will show all services to be created
5. **Update environment variables**:
   - Cloudinary credentials
   - Custom domains (optional)
6. **Deploy Blueprint**: Creates all staging and production services

### 2. Configure GitHub Secrets

1. **Get database URLs** from Render dashboard
2. **Add secrets** in GitHub repository settings
3. **Test deployment** by pushing to `develop` branch

### 3. Create Develop Branch

```bash
# Create develop branch for staging deployments
git checkout -b develop
git push -u origin develop
```

---

## 🔧 Environment Variables

### Staging Environment
```bash
NODE_ENV=staging
SWAGGER_ENABLED=true
CORS_ORIGIN=https://foodies-staging-frontend.onrender.com
DATABASE_URL=<staging-database-url>
VITE_API_URL=https://foodies-staging-backend.onrender.com/api/v1
```

### Production Environment  
```bash
NODE_ENV=production
SWAGGER_ENABLED=false
CORS_ORIGIN=https://foodies-prod-frontend.onrender.com
DATABASE_URL=<production-database-url>
VITE_API_URL=https://foodies-prod-backend.onrender.com/api/v1
```

---

## 🧪 Development Workflow

### Feature Development
```bash
# 1. Create feature branch
git checkout develop
git pull origin develop
git checkout -b feature/new-feature

# 2. Develop and test locally
docker-compose up -d
# Make changes...

# 3. Push to trigger CI tests  
git add .
git commit -m "feat: implement new feature"
git push origin feature/new-feature

# 4. Create PR to develop
# → Triggers PR preview workflow
# → Runs tests and validation
```

### Staging Deployment
```bash
# 5. Merge PR to develop
git checkout develop
git merge feature/new-feature
git push origin develop
# → Triggers staging deployment workflow
# → Deploys to staging environment
```

### Production Deployment
```bash
# 6. Create PR from develop to main
# → Review staging deployment
# → Get approval from team

# 7. Merge PR to main  
git checkout main
git merge develop
git push origin main
# → Triggers production deployment workflow
# → Deploys to production environment
```

---

## 📊 Monitoring & Health Checks

### Automated Health Checks

Each deployment workflow includes automated verification:

- **Backend Health**: `GET /health` endpoint
- **Frontend Accessibility**: HTTP 200 response
- **Database Connectivity**: Migration success
- **API Functionality**: Basic endpoint tests

### Manual Verification

After deployment, verify:

```bash
# Staging
curl https://foodies-staging-backend.onrender.com/health
curl https://foodies-staging-frontend.onrender.com

# Production  
curl https://foodies-prod-backend.onrender.com/health
curl https://foodies-prod-frontend.onrender.com
```

---

## 🐛 Troubleshooting

### Common Issues

**1. Migration Fails**
```bash
# Check database URL format
# Should be: postgresql://user:pass@host:5432/dbname

# Run manually:
DATABASE_URL=<your-url> npm run migrate
```

**2. Environment Variables Missing**
```bash
# Check Render service environment variables
# Update render.yaml if needed
# Redeploy after changes
```

**3. CORS Errors**
```bash
# Update backend CORS_ORIGIN to include frontend URL
# Check both staging and production configurations
```

**4. Deploy Hook Not Working**
```bash
# Render Blueprint deployment doesn't need deploy hooks
# Remove deploy hook secrets if using Blueprint
# Check Render dashboard for deployment logs
```

### Debug Commands

```bash
# Check GitHub Actions logs
# Repository → Actions → Select failed workflow

# Check Render service logs  
# Render Dashboard → Service → Logs

# Test local deployment
docker-compose up -d --build
docker-compose logs -f
```

---

## 💰 Cost Optimization

### Free Tier Setup
- **Total Cost**: $0/month
- **Limitations**: Cold starts, limited resources
- **Services**: 2 databases + 4 web services = 6 services total

### Recommended Paid Setup ($28-42/month)
- **Databases**: Starter plan ($7/month each) = $14/month
- **Backend Services**: Starter plan ($7/month each) = $14/month
- **Frontend Services**: Free (static sites)
- **Total**: $28/month + optional domain costs

---

## 🎉 Success Checklist

### Initial Setup
- [ ] Render Blueprint deployed successfully
- [ ] All 6 services (2 DB + 4 web) running
- [ ] GitHub secrets configured
- [ ] Develop branch created and pushed

### First Deployment
- [ ] Push to develop triggers staging deployment
- [ ] Staging services accessible and healthy
- [ ] Database migrations completed successfully
- [ ] Frontend connects to backend API

### Production Deployment  
- [ ] PR from develop to main created
- [ ] All tests pass in PR preview
- [ ] Production deployment triggered on merge
- [ ] Production services healthy and accessible
- [ ] Database migrations applied successfully

---

## 📚 Additional Resources

- [Render Blueprint Documentation](https://render.com/docs/blueprint-spec)
- [GitHub Actions Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Render Environment Variables](https://render.com/docs/environment-variables)
- [PostgreSQL Best Practices](https://render.com/docs/databases)

---

## 🆘 Getting Help

1. **Check GitHub Actions logs** for deployment failures
2. **Check Render service logs** for runtime issues  
3. **Verify environment variables** in Render dashboard
4. **Test API endpoints** with curl or Postman
5. **Check database connectivity** with migrations

---

**Happy Multi-Environment Deploying! 🚀**