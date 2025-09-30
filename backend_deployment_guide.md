# Foodies Backend - Deployment Guide

## 🚀 Розгортання на Render.com

### 1. Підготовка репозиторію

Переконайтеся, що у вашому Git репозиторії є всі необхідні файли:

```
✅ package.json
✅ server.js
✅ Всі models/, controllers/, routes/, middleware/
✅ config/config.js
✅ migrations/ та seeders/
✅ .env.example (без реальних даних)
```

### 2. Створення PostgreSQL Database на Render

1. **Зайдіть на [Render.com](https://render.com/)**
2. **Натисніть "New +" → "PostgreSQL"**
3. **Налаштуйте:**
   - Name: `foodies-database`
   - Database: `foodies_db`
   - User: `foodies_user`
   - Region: `Frankfurt` (або ближчий до користувачів)
   - PostgreSQL Version: `15`
   - Plan: `Free` (для початку)

4. **Після створення скопіюйте:**
   - External Database URL (починається з `postgres://`)
   - Internal Database URL (для з'єднання з іншими сервісами Render)

### 3. Створення Web Service на Render

1. **Натисніть "New +" → "Web Service"**
2. **Підключіть GitHub репозиторій**
3. **Налаштуйте сервіс:**

```yaml
Name: foodies-backend-api
Environment: Node
Region: Frankfurt
Branch: main

Build Command: npm install
Start Command: npm start

Auto-Deploy: Yes
```

### 4. Environment Variables

Додайте наступні змінні середовища:

```bash
NODE_ENV=production
PORT=10000
DATABASE_URL=postgres://foodies_user:password@host:port/foodies_db
JWT_SECRET=your-super-secure-jwt-secret-64-characters-long-string
JWT_EXPIRE=7d
CORS_ORIGIN=https://your-frontend-app.vercel.app
```

**Cloudinary (для завантаження файлів):**
```bash
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**Rate Limiting:**
```bash
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

### 5. Додаткові налаштування в package.json

Переконайтеся, що у `package.json` є правильні scripts:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "migrate": "npx sequelize-cli db:migrate",
    "seed": "npx sequelize-cli db:seed:all",
    "build": "npm install"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}
```

### 6. Налаштування Build та Deploy

**Build Command:**
```bash
npm install && npm run migrate && npm run seed
```

**Start Command:**
```bash
npm start
```

### 7. Перевірка після розгортання

1. **Перевірте логи на Render Dashboard**
2. **Протестуйте endpoints:**

```bash
# Health check
curl https://your-app.onrender.com/health

# API info
curl https://your-app.onrender.com/api/v1/

# Swagger docs
https://your-app.onrender.com/api/docs
```

### 8. Налаштування Custom Domain (опціонально)

1. **На Render Dashboard → Settings → Custom Domains**
2. **Додайте ваш домен**
3. **Налаштуйте DNS записи:**

```
CNAME api your-app.onrender.com
```

## 🔧 Локальний розвиток з Production БД

### Підключення до Render PostgreSQL локально:

```bash
# У .env.local
DATABASE_URL=postgres://foodies_user:password@host:port/foodies_db
NODE_ENV=development
```

### Команди для роботи з Production БД:

```bash
# Підключення до БД
psql postgres://foodies_user:password@host:port/foodies_db

# Backup production БД
pg_dump postgres://foodies_user:password@host:port/foodies_db > production_backup.sql

# Restore у локальну БД
psql -h localhost -U postgres -d foodies_db < production_backup.sql
```

## 📊 Моніторинг та логування

### 1. Render Dashboard

- **Metrics:** CPU, Memory, Network usage
- **Logs:** Real-time логи додатку
- **Events:** Deploy history, restart events

### 2. Додавання логування у код:

```javascript
// У server.js додайте structured logging
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console()
  ]
});

app.use((req, res, next) => {
  logger.info('Request', {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  next();
});
```

## 🔄 CI/CD з GitHub Actions (опціонально)

Створіть `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Render

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run tests
      run: npm test
      
    - name: Deploy to Render
      run: |
        curl -X POST "${{ secrets.RENDER_DEPLOY_HOOK }}"
```

## 🧪 Тестування Production

### Automated API Testing:

```bash
# Встановіть newman для тестування
npm install -g newman

# Експортуйте Postman колекцію та протестуйте
newman run foodies-api-tests.json --environment production.json
```

### Load Testing з Artillery:

```yaml
# artillery-config.yml
config:
  target: https://your-app.onrender.com
  phases:
    - duration: 60
      arrivalRate: 10

scenarios:
  - name: "API Load Test"
    requests:
      - get:
          url: "/health"
      - get:
          url: "/api/v1/"
      - post:
          url: "/api/v1/auth/register"
          json:
            name: "Load Test User"
            email: "loadtest@example.com"
            password: "password123"
```

```bash
npx artillery run artillery-config.yml
```

## 🔐 Безпека в Production

### 1. Environment Variables

```bash
# Згенеруйте безпечний JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Додайте до Render env vars
JWT_SECRET=your-generated-secret
```

### 2. CORS налаштування

```javascript
// У server.js
const corsOptions = {
  origin: [
    'https://your-frontend.vercel.app',
    'https://your-custom-domain.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
```

### 3. Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
```

## 📈 Масштабування

### Vertical Scaling на Render:

1. **Upgrade Plan:** Free → Starter → Professional
2. **Resources:** 
   - Free: 512MB RAM, 0.1 CPU
   - Starter: 1GB RAM, 0.5 CPU  
   - Professional: 2GB RAM, 1 CPU

### Horizontal Scaling:

```bash
# Додайте multiple instances у конфігурацію
instances: 2
```

### Database Scaling:

1. **Connection Pooling:**

```javascript
// У config/config.js
pool: {
  max: 20,
  min: 0,
  acquire: 60000,
  idle: 10000
}
```

2. **Database Optimization:**

```sql
-- Додайте індекси для часто використовуваних запитів
CREATE INDEX idx_recipes_category ON recipes(category_id);
CREATE INDEX idx_recipes_owner ON recipes(owner_id);
CREATE INDEX idx_recipes_created ON recipes(created_at);
```

## ❌ Troubleshooting

### Типові проблеми та рішення:

1. **Build Failed:**
```bash
# Перевірте Node.js версію в package.json
"engines": {
  "node": ">=18.0.0"
}
```

2. **Database Connection Error:**
```bash
# Перевірте DATABASE_URL формат
postgres://username:password@hostname:port/database
```

3. **Memory Limit Exceeded:**
```bash
# Додайте до server.js
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully');
  server.close(() => {
    process.exit(0);
  });
});
```

4. **Slow Response Times:**
```bash
# Додайте compression middleware
const compression = require('compression');
app.use(compression());
```

## 📞 Підтримка

**Render Support:**
- [Render Docs](https://render.com/docs)
- [Community Forum](https://community.render.com)
- Support через Dashboard

**PostgreSQL:**
- [Render PostgreSQL Docs](https://render.com/docs/databases)
- Connection limits на Free tier: 20 connections

---

**✅ Checklist перед Production:**

- [ ] Всі environment variables налаштовані
- [ ] Database міграції пройшли успішно  
- [ ] Seed дані завантажені
- [ ] API endpoints працюють
- [ ] Swagger документація доступна
- [ ] CORS налаштовано правильно
- [ ] Rate limiting активовано
- [ ] Логування працює
- [ ] Health check endpoint відповідає