# Foodies Backend - Product Requirements Document (PRD)

## 🎯 Загальна інформація проекту

**Назва проекту:** Foodies - платформа для обміну рецептами  
**Тип проекту:** Social cooking platform  
**Архітектура:** REST API Backend + React Frontend  
**База даних:** PostgreSQL + Sequelize ORM  
**Документація API:** Swagger/OpenAPI  

## 📋 Функціональні вимоги Backend

### 1. Автентифікація та авторизація (`/auth`)

#### Публічні endpoint'и:
- **POST /auth/register** - реєстрація користувача
- **POST /auth/login** - авторизація користувача

#### Приватні endpoint'и:
- **POST /auth/logout** - вихід з системи (потребує JWT токен)

#### Middleware авторизації:
- Перевірка JWT токенів для приватних маршрутів
- Валідація прав доступу користувача

### 2. Управління користувачами (`/users`)

#### Інформація про користувача:
- **GET /users/current** - отримання інформації про поточного користувача:
  - аватар, ім'я, email
  - кількість створених рецептів
  - кількість улюблених рецептів  
  - кількість підписників
  - кількість підписок

- **GET /users/:id** - детальна інформація про іншого користувача:
  - аватар, ім'я, email
  - кількість створених рецептів
  - кількість підписників

#### Управління профілем:
- **PATCH /users/avatar** - оновлення аватарки користувача

#### Система підписок:
- **GET /users/followers** - список підписників користувача
- **GET /users/following** - список підписок користувача
- **POST /users/:id/follow** - підписатися на користувача
- **DELETE /users/:id/unfollow** - відписатися від користувача

### 3. Довідкова інформація

#### Категорії (`/categories`)
- **GET /categories** - список всіх категорій рецептів

#### Регіони (`/areas`)  
- **GET /areas** - список регіонів походження страв

#### Інгредієнти (`/ingredients`)
- **GET /ingredients** - список всіх інгредієнтів

#### Відгуки (`/testimonials`)
- **GET /testimonials** - список відгуків про платформу

### 4. Управління рецептами (`/recipes`)

#### Публічні endpoint'и:
- **GET /recipes** - пошук рецептів з фільтрами:
  - за категорією
  - за інгредієнтом
  - за регіоном
  - з пагінацією
- **GET /recipes/:id** - детальна інформація про рецепт
- **GET /recipes/popular** - популярні рецепти (за кількістю додавань в улюблені)

#### Приватні endpoint'и:
- **POST /recipes** - створення власного рецепту
- **DELETE /recipes/:id** - видалення власного рецепту
- **GET /recipes/own** - отримання власних рецептів
- **POST /recipes/:id/favorite** - додати рецепт в улюблені
- **DELETE /recipes/:id/favorite** - видалити рецепт з улюблених
- **GET /recipes/favorites** - отримання улюблених рецептів

## 🗄️ Структура бази даних

### Таблиці:

1. **users** - користувачі
2. **recipes** - рецепти
3. **categories** - категорії
4. **areas** - регіони
5. **ingredients** - інгредієнти
6. **testimonials** - відгуки
7. **user_followers** - зв'язки підписок між користувачами
8. **recipe_ingredients** - зв'язки рецептів та інгредієнтів
9. **user_favorite_recipes** - улюблені рецепти користувачів

## 🏗️ Технічні вимоги

### Stack технологій:
- **Node.js** (runtime)
- **Express.js** (web framework)
- **PostgreSQL** (база даних)
- **Sequelize** (ORM)
- **JWT** (автентифікація)
- **Multer** (upload файлів)
- **Swagger** (документація API)
- **Docker** (контейнеризація)
- **CORS** (cross-origin requests)

### Архітектурні принципи:
- **MVC pattern** - розділення логіки
- **Middleware pattern** - обробка запитів
- **Repository pattern** - робота з даними
- **Error handling** - централізована обробка помилок

### Безпека:
- Валідація всіх input даних
- Хешування паролів (bcrypt)
- Rate limiting
- CORS налаштування
- SQL injection захист (Sequelize ORM)

## 🚀 Розгортання

### Локальна розробка:
- **Docker Compose** для PostgreSQL
- **Environment variables** для конфігурації
- **Nodemon** для hot reload

### Production (Render):
- **PostgreSQL** на Render
- **Environment variables** для production
- **Health checks** для моніторингу

## 📊 Моніторинг та логування

- Структуроване логування
- Error tracking
- Performance metrics
- Database query optimization

## 🔄 API Documentation

- **Swagger UI** для інтерактивної документації
- **OpenAPI 3.0** специфікація
- Приклади request/response для всіх endpoint'ів

## 📝 Додаткові вимоги

- **Seeding** - заповнення БД початковими даними з JSON файлів
- **Migrations** - версіонування схеми БД
- **Валідація** - використання Joi або подібних бібліотек
- **Тестування** - unit та integration тести
- **CI/CD** - автоматичне розгортання