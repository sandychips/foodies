# CI/CD Setup Guide

This document explains the GitHub Actions CI/CD pipeline configuration for the Foodies project.

## 📋 Overview

The project uses three main workflows:

1. **CI (Continuous Integration)** - Automated testing on every push/PR
2. **CD Production** - Automated deployment to production (main branch)
3. **PR Checks** - Additional checks for pull requests

## 🔄 Workflows

### 1. CI - Test & Build (`ci.yml`)

**Triggers:** Push to `main`/`develop`, Pull Requests

**Jobs:**
- **backend-test**: Runs backend unit tests with PostgreSQL
- **frontend-test**: Runs frontend tests with Vitest
- **backend-build**: Verifies backend can start
- **frontend-build**: Builds production frontend bundle
- **all-tests-passed**: Final status check

**Features:**
- ✅ Parallel test execution
- ✅ Code coverage reporting (Codecov)
- ✅ Linting checks
- ✅ PostgreSQL test database
- ✅ Build artifacts upload

### 2. CD Production (`cd-production.yml`)

**Triggers:** Push to `main`, Manual dispatch

**Jobs:**
- **verify-tests**: Runs full CI pipeline
- **deploy-backend**: Deploys backend to Render
- **deploy-frontend**: Deploys frontend to Render
- **deployment-summary**: Creates deployment report

**Features:**
- ✅ Health checks after deployment
- ✅ Deployment hooks for Render
- ✅ Deployment summary in GitHub

### 3. PR Checks (`pr-checks.yml`)

**Triggers:** Pull request events

**Jobs:**
- **run-tests**: Executes all CI tests
- **pr-comment**: Posts test results to PR
- **code-quality**: Checks for large files, secrets, commit messages
- **security-check**: npm audit for vulnerabilities
- **pr-size-check**: Labels PR by size

**Features:**
- ✅ Automated PR comments
- ✅ Secret detection
- ✅ Security audits
- ✅ PR size labeling

## 🔐 Required Secrets

Add these secrets in GitHub repository settings (`Settings > Secrets and variables > Actions`):

### Production Deployment (Optional)
- `RENDER_DEPLOY_HOOK_BACKEND` - Backend deploy hook URL from Render
- `RENDER_DEPLOY_HOOK_FRONTEND` - Frontend deploy hook URL from Render
- `BACKEND_URL` - Production backend URL (for health checks)
- `FRONTEND_URL` - Production frontend URL (for verification)

### Code Coverage (Optional)
- `CODECOV_TOKEN` - Token from codecov.io for coverage reports

## 📦 Dependabot

Automated dependency updates configured for:
- **Backend npm packages** - Weekly updates on Mondays
- **Frontend npm packages** - Weekly updates on Mondays
- **GitHub Actions** - Monthly updates

Major version updates are ignored by default for stability.

## 🚀 Getting Started

### 1. Initial Setup

No additional setup required! The workflows will run automatically when you:
- Push code to `main` or `develop`
- Open a pull request

### 2. Enable Render Deployment

To enable automatic deployment to Render:

1. **Get Deploy Hooks:**
   - Go to your Render service dashboard
   - Navigate to Settings > Deploy Hook
   - Copy the deploy hook URL

2. **Add Secrets in GitHub:**
   ```
   RENDER_DEPLOY_HOOK_BACKEND=https://api.render.com/deploy/srv-xxxxx?key=xxxxx
   RENDER_DEPLOY_HOOK_FRONTEND=https://api.render.com/deploy/srv-xxxxx?key=xxxxx
   BACKEND_URL=https://your-backend.onrender.com
   FRONTEND_URL=https://your-frontend.onrender.com
   ```

3. **Test Deployment:**
   - Push to `main` branch
   - Check Actions tab for deployment status
   - Verify services are running

### 3. Enable Code Coverage

1. Sign up at [codecov.io](https://codecov.io)
2. Add your repository
3. Copy the upload token
4. Add `CODECOV_TOKEN` secret in GitHub

## 📊 Monitoring

### View CI/CD Status

- **Actions Tab**: See all workflow runs
- **Pull Requests**: View status checks on PRs
- **Commit Status**: See check marks on commits

### Debugging Failed Builds

1. Click on the failed workflow in Actions tab
2. Expand the failed job/step
3. Review logs for error messages
4. Common issues:
   - Test failures: Check test output
   - Build errors: Check dependency installation
   - Deployment failures: Verify Render secrets

## 🔧 Customization

### Modify Test Commands

Edit the workflow files to change test commands:

```yaml
- name: Run backend tests
  run: npm test  # Change this command
```

### Add Environment Variables

Add secrets/variables in GitHub settings, then reference them:

```yaml
env:
  MY_VARIABLE: ${{ secrets.MY_SECRET }}
```

### Change Deployment Strategy

Modify `cd-production.yml` to use different deployment methods:
- Heroku
- AWS
- Vercel
- Custom scripts

## 📈 Best Practices

1. **Always run tests locally** before pushing
2. **Keep PRs small** (< 600 lines) for easier review
3. **Fix security vulnerabilities** reported by npm audit
4. **Review Dependabot PRs** weekly
5. **Monitor deployment health** after releases
6. **Use conventional commits** for better changelog

## 🐛 Troubleshooting

### Tests Pass Locally But Fail in CI

- Check Node.js version matches (18.x)
- Verify all dependencies are in package.json
- Check for missing environment variables
- Review PostgreSQL setup for backend tests

### Deployment Not Triggering

- Verify secrets are set correctly
- Check deploy hook URLs are valid
- Ensure pushing to `main` branch
- Review workflow permissions

### Slow CI/CD Pipeline

- Use `npm ci` instead of `npm install`
- Enable dependency caching (already configured)
- Run jobs in parallel when possible
- Consider splitting large test suites

## 📞 Support

For issues with:
- **GitHub Actions**: Check [GitHub Actions docs](https://docs.github.com/en/actions)
- **Render**: Check [Render docs](https://render.com/docs)
- **This Setup**: Review workflow files or create an issue

## 📝 Changelog

- **2025-01-XX**: Initial CI/CD setup
  - Added CI workflow with parallel testing
  - Added CD workflow for Render deployment
  - Added PR checks and security audits
  - Configured Dependabot for dependency updates