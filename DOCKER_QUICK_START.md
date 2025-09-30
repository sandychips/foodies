# 🐳 Docker Quick Start Guide

Get Foodies running locally with Docker in 5 minutes!

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed
- Git installed

## 🚀 Quick Start (3 Commands)

```bash
# 1. Copy environment configuration
cp .env.example .env

# 2. Start all services
docker-compose up -d

# 3. Run database migrations
docker-compose exec backend npm run migrate
```

**That's it!** 🎉

Access your services:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000/api/v1
- **API Docs**: http://localhost:5000/api/docs

## 📝 Detailed Setup

### Step 1: Configure Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit the file with your Cloudinary credentials (optional for basic testing)
nano .env  # or use your favorite editor
```

**Minimum required** (app will work without Cloudinary, but image uploads won't work):
```bash
POSTGRES_PASSWORD=foodies_password
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
REFRESH_TOKEN_SECRET=your-super-secret-refresh-key-min-32-chars
```

### Step 2: Start Services

```bash
# Start all containers in background
docker-compose up -d

# View logs (optional)
docker-compose logs -f

# Check status
docker-compose ps
```

You should see 3 services running:
- ✅ foodies-postgres
- ✅ foodies-backend
- ✅ foodies-frontend

### Step 3: Initialize Database

```bash
# Run migrations
docker-compose exec backend npm run migrate

# Seed with sample data (optional)
docker-compose exec backend npm run seed
```

### Step 4: Test the Application

Open http://localhost:3000 in your browser.

Try:
- ✅ View recipes
- ✅ Register a new account
- ✅ Login
- ✅ Browse categories
- ✅ View recipe details

## 🛠️ Common Commands

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Restart Services

```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart backend
docker-compose restart frontend
```

### Stop Services

```bash
# Stop but keep data
docker-compose stop

# Stop and remove containers (keeps volumes/data)
docker-compose down

# Stop and remove everything including data
docker-compose down -v
```

### Database Operations

```bash
# Run migrations
docker-compose exec backend npm run migrate

# Undo last migration
docker-compose exec backend npm run migrate:undo

# Seed database
docker-compose exec backend npm run seed

# Clear seed data
docker-compose exec backend npm run seed:undo

# Access PostgreSQL shell
docker-compose exec postgres psql -U foodies_user -d foodies_db
```

### Backend Commands

```bash
# Run tests
docker-compose exec backend npm test

# Run linter
docker-compose exec backend npm run lint

# Access backend shell
docker-compose exec backend sh
```

### Frontend Commands

```bash
# Run tests
docker-compose exec frontend npm test

# Access frontend shell
docker-compose exec frontend sh
```

### Rebuild Containers

```bash
# Rebuild without cache
docker-compose build --no-cache

# Rebuild and restart
docker-compose up -d --build
```

## 🐛 Troubleshooting

### Port Already in Use

**Error**: `Bind for 0.0.0.0:3000 failed: port is already allocated`

**Solutions**:
```bash
# Option 1: Stop the conflicting service
# Find what's using the port
lsof -i :3000  # or :5000, or :5432

# Stop that service

# Option 2: Change port in .env
echo "FRONTEND_PORT=3001" >> .env
docker-compose up -d
```

### Database Connection Failed

**Error**: `ECONNREFUSED` or `database "foodies_db" does not exist`

**Solutions**:
```bash
# Check postgres is healthy
docker-compose ps

# Restart postgres
docker-compose restart postgres

# Wait for postgres to be ready
docker-compose up -d postgres
sleep 10
docker-compose up -d backend

# If still failing, recreate database
docker-compose down -v
docker-compose up -d
docker-compose exec backend npm run migrate
```

### Backend Won't Start

**Error**: Backend exits immediately or restarts constantly

**Solutions**:
```bash
# Check logs
docker-compose logs backend

# Common issues:
# 1. Missing environment variables - check .env
# 2. Database not ready - wait 10 seconds and retry
# 3. Port conflict - change BACKEND_PORT in .env

# Try rebuilding
docker-compose build backend --no-cache
docker-compose up -d backend
```

### Frontend Build Fails

**Error**: `ERR_PNPM_NO_IMPORTER_MANIFEST_FOUND` or build errors

**Solutions**:
```bash
# Rebuild frontend
docker-compose build frontend --no-cache
docker-compose up -d frontend

# Check node_modules
docker-compose exec frontend ls -la node_modules

# If empty, manually install
docker-compose exec frontend npm install
```

### Can't Access Services

**Problem**: Services running but can't access in browser

**Solutions**:
```bash
# 1. Check containers are actually running
docker-compose ps

# 2. Check logs for errors
docker-compose logs

# 3. Verify ports
netstat -an | grep 3000  # frontend
netstat -an | grep 5000  # backend

# 4. Try different browser or incognito mode

# 5. Check firewall settings
```

## 🔥 Clean Slate Reset

If everything is broken and you want to start fresh:

```bash
# Nuclear option - remove everything
docker-compose down -v
docker system prune -a --volumes
rm -rf backend/node_modules frontend/node_modules

# Start from scratch
docker-compose up -d --build
docker-compose exec backend npm run migrate
docker-compose exec backend npm run seed
```

## 💡 Pro Tips

### Development Workflow

```bash
# Hot reload is enabled by default
# Just edit files and changes will reflect automatically

# Backend hot reload (nodemon)
# Edit any .js file in backend/ and server restarts

# Frontend hot reload (Vite)
# Edit any .jsx file in frontend/ and browser updates
```

### Performance Optimization

```bash
# Speed up builds with BuildKit
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

# Use Docker cache
docker-compose build  # Uses cache
```

### Useful Aliases

Add to your `~/.bashrc` or `~/.zshrc`:

```bash
alias dcup='docker-compose up -d'
alias dcdown='docker-compose down'
alias dclogs='docker-compose logs -f'
alias dcps='docker-compose ps'
alias dcrestart='docker-compose restart'
alias dcrebuild='docker-compose up -d --build'
```

## 🎯 Next Steps

Once you have the app running:

1. **Explore the API**: http://localhost:5000/api/docs
2. **Register an account** on the frontend
3. **Try creating a recipe** (requires Cloudinary setup)
4. **Check out the code** in `backend/` and `frontend/`
5. **Run tests**: `docker-compose exec backend npm test`

## 📚 More Information

- Full deployment guide: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- CI/CD setup: [.github/CICD_SETUP.md](./.github/CICD_SETUP.md)
- Project improvements: [IMPROVEMENTS_SUMMARY.md](./IMPROVEMENTS_SUMMARY.md)

---

**Questions?** Check the troubleshooting section above or the main deployment guide.

**Happy Coding! 🚀**