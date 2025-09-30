# Foodies Backend API

🍳 **Foodies** - це платформа для обміну рецептами з соціальними функціями.

## 📋 Зміст

- [Технології](#технології)
- [Встановлення](#встановлення)
- [Розгортання](#розгортання)
- [API Документація](#api-документація)
- [База даних](#база-даних)
- [Тестування](#тестування)

## 🚀 Технології

### Backend Stack:
- **Node.js** 18+ - JavaScript runtime
- **Express.js** - Web framework
- **PostgreSQL** - База даних
- **Sequelize** - ORM для PostgreSQL
- **JWT** - Автентифікація
- **Multer** + **Cloudinary** - Завантаження файлів
- **Joi** - Валідація даних
- **Swagger** - API документація

### DevOps:
- **Docker** + **Docker Compose** - Локальна розробка
- **Render** - Production hosting
- **GitHub Actions** - CI/CD (опціонально)

## 🔧 Встановлення

### Передумови

Переконайтеся, що у вас встановлено:
- [Node.js](https://nodejs.org/) (версія 18+)
- [Docker](https://www.docker.com/) та [Docker Compose](https://docs.docker.com/compose/)
- [Git](https://git-scm.com/)

### 1. Клонування репозиторію

```bash
git clone https://github.com/your-username/foodies-backend.git
cd foodies-backend
```

### 2. Встановлення залежностей

```bash
npm install
```

### 3. Налаштування environment змінних

```bash
cp .env.example .env
```

Відредагуйте `.env` файл зі своїми налаштуваннями:

```env
# Local Development
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=foodies_db
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=your-super-secret-jwt-key

# Cloudinary (для завантаження файлів)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 4. Запуск з Docker

```bash
# Запуск PostgreSQL та pgAdmin
docker-compose up postgres pgadmin -d

# Або запуск всього stack (включаючи API)
docker-compose up -d
```

### 5. Міграції та Seeding

```bash
# Створення таблиць
npm run migrate

# Заповнення початковими даними
npm run seed
```

### 6. Запуск в режимі розробки

```bash
npm run dev
```

## 🌍 Розгортання

### Production на Render

1. **Створіть новий Web Service на [Render](https://render.com/)**
2. **Підключіть GitHub репозиторій**
3. **Налаштуйте Environment Variables:**
   ```
   NODE_ENV=production
   DATABASE_URL=your-postgresql-connection-string
   JWT_SECRET=your-production-jwt-secret
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```
4. **Build Command:** `npm install`
5. **Start Command:** `npm start`

### Автоматичне розгортання

Push до `main` branch автоматично деплоїть на Render.

## 📚 API Документація

### Swagger UI

Після запуску сервера, документація доступна за адресою:

**Локально:** http://localhost:5000/api/docs  
**Production:** https://your-app.onrender.com/api/docs

### Основні endpoints:

#### Автентифікація
- `POST /api/v1/auth/register` - Реєстрація
- `POST /api/v1/auth/login` - Вхід
- `POST /api/v1/auth/logout` - Вихід (приватний)
- `GET /api/v1/auth/me` - Поточний користувач (приватний)

#### Користувачі
- `GET /api/v1/users/current` - Інформація про поточного користувача
- `GET /api/v1/users/:id` - Інформація про користувача
- `PATCH /api/v1/users/avatar` - Оновлення аватарки
- `GET /api/v1/users/followers` - Підписники
- `GET /api/v1/users/following` - Підписки
- `POST /api/v1/users/:id/follow` - Підписатися
- `DELETE /api/v1/users/:id/unfollow` - Відписатися

#### Рецепти
- `GET /api/v1/recipes` - Список рецептів з фільтрами
- `POST /api/v1/recipes` - Створити рецепт (приватний)
- `GET /api/v1/recipes/:id` - Деталі рецепту
- `DELETE /api/v1/recipes/:id` - Видалити рецепт (приватний)
- `GET /api/v1/recipes/popular` - Популярні рецепти
- `GET /api/v1/recipes/own` - Власні рецепти (приватний)
- `POST /api/v1/recipes/:id/favorite` - Додати в улюблені (приватний)
- `DELETE /api/v1/recipes/:id/favorite` - Видалити з улюблених (приватний)
- `GET /api/v1/recipes/favorites` - Улюблені рецепти (приватний)

#### Довідкова інформація
- `GET /api/v1/categories` - Категорії рецептів
- `GET /api/v1/areas` - Регіони походження
- `GET /api/v1/ingredients` - Інгредієнти
- `GET /api/v1/testimonials` - Відгуки

## 🗄️ База даних

### Схема БД

```
users (користувачі)
├── id (UUID, PK)
├── name (VARCHAR)
├── email (VARCHAR, UNIQUE)
├── password (VARCHAR, HASHED)
├── avatar (TEXT, URL)
└── timestamps

recipes (рецепти)
├── id (UUID, PK)
├── title (VARCHAR)
├── instructions (TEXT)
├── description (TEXT)
├── thumb (TEXT, URL)
├── time (INTEGER)
├── categoryId (UUID, FK)
├── areaId (UUID, FK)
├── ownerId (UUID, FK)
└── timestamps

categories (категорії)
├── id (UUID, PK)
├── name (VARCHAR, UNIQUE)
└── timestamps

areas (регіони)
├── id (UUID, PK)
├── name (VARCHAR, UNIQUE)
└── timestamps

ingredients (інгредієнти)
├── id (UUID, PK)
├── name (VARCHAR, UNIQUE)
├── image (TEXT, URL)
└── timestamps

user_followers (підписки)
├── followerId (UUID, FK)
├── followingId (UUID, FK)
└── timestamps

recipe_ingredients (інгредієнти рецептів)
├── recipeId (UUID, FK)
├── ingredientId (UUID, FK)
├── measure (VARCHAR)
└── timestamps

user_favorite_recipes (улюблені рецепти)
├── userId (UUID, FK)
├── recipeId (UUID, FK)
└── timestamps
```

### Команди БД

```bash
# Створити БД
npm run db:create

# Запустити міграції
npm run migrate

# Відкатити останню міграцію
npm run migrate:undo

# Заповнити БД початковими даними
npm run seed

# Очистити seed дані
npm run seed:undo
```

### pgAdmin

Для управління БД локально використовуйте pgAdmin:

**URL:** http://localhost:8080  
**Email:** admin@foodies.com  
**Password:** admin

## 🧪 Тестування

```bash
# Запустити тести
npm test

# Запустити тести в watch режимі
npm run test:watch

# Покриття коду
npm run test:coverage
```

## 🔍 Лінтинг та форматування

```bash
# Перевірити код
npm run lint

# Автоматично виправити помилки
npm run lint:fix
```

## 📝 Структура проекту

```
foodies-backend/
├── config/              # Конфігурація БД
├── controllers/         # Контролери
├── middleware/          # Middleware функції
├── models/             # Sequelize моделі
├── routes/             # Маршрути API
├── migrations/         # Міграції БД
├── seeders/           # Seed файли
├── utils/             # Утилітарні функції
├── tests/             # Тести
├── uploads/           # Тимчасові файли
├── docker-compose.yml # Docker конфігурація
├── Dockerfile         # Docker image
├── .env.example       # Приклад environment змінних
└── server.js          # Точка входу
```

## 🔐 Безпека

- Паролі хешуються з bcrypt
- JWT токени для автентифікації
- Rate limiting для API
- CORS налаштування
- Валідація всіх input даних
- SQL injection захист через Sequelize ORM

## 🤝 Contributing

1. Fork проект
2. Створіть feature branch (`git checkout -b feature/amazing-feature`)
3. Commit зміни (`git commit -m 'Add amazing feature'`)
4. Push до branch (`git push origin feature/amazing-feature`)
5. Створіть Pull Request

## 📄 License

Цей проект ліцензовано під MIT License.

## 📞 Підтримка

Якщо у вас є питання або проблеми:

1. Перевірте [Issues](https://github.com/your-username/foodies-backend/issues)
2. Створіть новий Issue з детальним описом
3. Напишіть на email: dev@foodies.com

---

**Зроблено з ❤️ командою розробників Foodies**