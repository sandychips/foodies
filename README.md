# 🍽️ Foodies - Social Cooking Platform

A modern full-stack recipe sharing platform with user authentication, recipe management, and social features.

[![CI Tests](https://github.com/your-username/foodies/workflows/CI%20-%20Test%20%26%20Build/badge.svg)](https://github.com/your-username/foodies/actions)
[![Deploy](https://github.com/your-username/foodies/workflows/CD%20-%20Deploy%20to%20Production/badge.svg)](https://github.com/your-username/foodies/actions)

## 🌟 Features

- ✅ **User Authentication** - Register, login with JWT tokens
- ✅ **Recipe Management** - Create, view, edit, delete recipes
- ✅ **Image Uploads** - Cloudinary integration for recipe images
- ✅ **Social Features** - Follow users, favorite recipes
- ✅ **Advanced Search** - Filter by category, area, ingredients
- ✅ **Responsive Design** - Mobile-friendly UI
- ✅ **API Documentation** - Swagger/OpenAPI docs

## 🏗️ Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL + Sequelize ORM
- **Authentication**: JWT with refresh tokens
- **File Upload**: Multer + Cloudinary
- **Testing**: Jest (62 tests)
- **API Docs**: Swagger

### Frontend
- **Framework**: React 18 + Vite
- **State**: Redux Toolkit + Redux Persist
- **Routing**: React Router v6
- **Forms**: React Hook Form + Yup validation
- **HTTP**: Axios
- **Testing**: Vitest (19 tests)
- **UI**: Custom CSS + Lucide icons

### DevOps
- **CI/CD**: GitHub Actions
- **Containerization**: Docker + Docker Compose
- **Deployments**: Vercel (frontend), Render (backend/frontend), Docker

## 🚀 Quick Start

### Option 1: Docker (Recommended for Local Development)

```bash
# Clone repository
git clone <your-repo-url>
cd foodies

# Copy environment file
cp .env.example .env

# Start all services
docker-compose up -d

# Run migrations
docker-compose exec backend npm run migrate

# Optional: Seed database
docker-compose exec backend npm run seed
```

**Access**:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000/api/v1
- API Docs: http://localhost:5000/api/docs

👉 **[Full Docker Guide](./DOCKER_QUICK_START.md)**

### Option 2: Manual Setup

#### Backend

```bash
cd backend

# Install dependencies
npm install

# Setup database (PostgreSQL required)
cp .env.example .env
# Edit .env with your database credentials

# Run migrations
npm run migrate

# Start development server
npm run dev
```

#### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Setup environment
echo "VITE_API_URL=http://localhost:5000/api/v1" > .env

# Start development server
npm run dev
```

## 📦 Deployment

This project supports **4 deployment scenarios**:

| Platform | Best For | Guide |
|----------|----------|-------|
| **Vercel + Render** | Production Demo | [Deployment Guide](./DEPLOYMENT_GUIDE.md#-production-deployment---vercel-frontend--render-backend) |
| **Render (Full)** | Production | [Deployment Guide](./DEPLOYMENT_GUIDE.md#-alternative-full-render-deployment) |
| **Docker** | Self-hosting | [Docker Quick Start](./DOCKER_QUICK_START.md) |
| **Local** | Development | See Quick Start above |

### Deploy to Vercel (Frontend)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/foodies&project-name=foodies&root-directory=frontend&env=VITE_API_URL)

### Deploy to Render (Backend)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

👉 **[Complete Deployment Guide](./DEPLOYMENT_GUIDE.md)**

## 🧪 Testing

### Run Tests

```bash
# Backend tests (62 tests)
cd backend
npm test
npm run test:watch    # Watch mode
npm run test:unit     # Unit tests only

# Frontend tests (19 tests)
cd frontend
npx vitest run        # Run once
npx vitest            # Watch mode
npx vitest --ui       # Interactive UI
```

### Coverage

```bash
# Backend coverage
cd backend
npm test              # Includes coverage report

# Frontend coverage
cd frontend
npx vitest run --coverage
```

## 📚 Documentation

- **[Deployment Guide](./DEPLOYMENT_GUIDE.md)** - Complete deployment instructions
- **[Docker Quick Start](./DOCKER_QUICK_START.md)** - Get running in 5 minutes
- **[CI/CD Setup](./.github/CICD_SETUP.md)** - GitHub Actions workflows
- **[Improvements Summary](./IMPROVEMENTS_SUMMARY.md)** - What's been improved
- **[API Documentation](http://localhost:5000/api/docs)** - Swagger docs (when running)

## 🔧 Development

### Project Structure

```
foodies/
├── backend/              # Express.js API
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Auth, error handling, etc.
│   ├── models/         # Sequelize models
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── utils/          # Helpers, error classes
│   └── tests/          # Jest tests (62 tests)
│
├── frontend/            # React + Vite
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── pages/      # Page components
│   │   ├── redux/      # Redux slices & ops
│   │   ├── services/   # API client
│   │   └── utils/      # Helpers
│   └── tests/          # Vitest tests (19 tests)
│
├── .github/
│   └── workflows/      # CI/CD pipelines
│
└── docker-compose.yml  # Docker configuration
```

### Environment Variables

#### Backend (.env)
```bash
NODE_ENV=development
DATABASE_URL=postgresql://user:pass@localhost:5432/foodies_db
JWT_SECRET=your-secret-key
REFRESH_TOKEN_SECRET=your-refresh-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CORS_ORIGIN=http://localhost:3000
```

#### Frontend (.env)
```bash
VITE_API_URL=http://localhost:5000/api/v1
```

### Available Scripts

#### Backend
```bash
npm start          # Start production server
npm run dev        # Start with nodemon (hot reload)
npm test           # Run tests with coverage
npm run lint       # Run ESLint
npm run migrate    # Run database migrations
npm run seed       # Seed database with test data
```

#### Frontend
```bash
npm run dev        # Start Vite dev server
npm run build      # Build for production
npm run preview    # Preview production build
npm test           # Run Vitest tests
npm run lint       # Run ESLint
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Message Convention

Use conventional commits:
```
feat: add recipe filtering by ingredients
fix: resolve CORS issue on production
docs: update deployment guide
test: add tests for user authentication
refactor: improve error handling
```

## 🐛 Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Change port in .env
BACKEND_PORT=5001
FRONTEND_PORT=3001
```

**Database Connection Failed**
```bash
# Check PostgreSQL is running
pg_isready

# Verify DATABASE_URL in .env
```

**CORS Errors**
```bash
# Update backend CORS_ORIGIN to include frontend URL
CORS_ORIGIN=http://localhost:3000,https://your-frontend.vercel.app
```

👉 **[Full Troubleshooting Guide](./DEPLOYMENT_GUIDE.md#-troubleshooting)**

## 📊 Project Stats

- **Backend Tests**: 62 tests passing
- **Frontend Tests**: 19 tests passing
- **Total Lines of Code**: ~15,000+
- **API Endpoints**: 30+
- **React Components**: 50+
- **Docker Services**: 3 (PostgreSQL, Backend, Frontend)

## 🔐 Security

- ✅ JWT authentication with refresh tokens
- ✅ Password hashing with bcrypt
- ✅ Input validation with express-validator
- ✅ SQL injection protection (Sequelize ORM)
- ✅ Rate limiting (100 requests per 15 min)
- ✅ CORS configuration
- ✅ Helmet.js security headers
- ✅ Environment variable protection

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [TheMealDB](https://www.themealdb.com/) - Recipe inspiration
- [Cloudinary](https://cloudinary.com/) - Image hosting
- [Render](https://render.com/) - Backend hosting
- [Vercel](https://vercel.com/) - Frontend hosting

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/foodies/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/foodies/discussions)
- **Documentation**: See `/docs` folder

---

**Made with ❤️ using React, Node.js, and PostgreSQL**

⭐ Star this repo if you find it helpful!# Updated Tue Sep 30 02:55:12 PM EEST 2025 - Environment variable configured for production deployment
