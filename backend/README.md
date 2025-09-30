# Foodies Backend API

This directory contains the Express + Sequelize implementation for the Foodies social cooking platform. Refer to the project PRD in `../foodies_prd_backend.md` and the integration guide in `../api_integration_guide.md` for complete specifications.

## Getting Started

1. Copy `.env.example` to `.env` and adjust credentials.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Ensure PostgreSQL is running (Docker compose file is provided).
4. Run database migrations and seeders:
   ```bash
   npm run migrate
   npm run seed
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

Key folders follow the architecture described in `../backend_project_structure.md`:

- `config/` – database configuration and Sequelize initialization
- `models/` – Sequelize models and associations
- `controllers/` – request handlers mapped to routes
- `routes/` – Express routers grouped by domain
- `middleware/` – auth, validation, uploads, error handling, rate limiting
- `seeders/` & `migrations/` – database schema and data management
- `utils/` – reusable helpers (logger, response helpers, etc.)

## Tooling

- Node.js 18+
- Express.js
- Sequelize + PostgreSQL
- JWT authentication with refresh tokens
- Swagger UI for API documentation

See `../backend_deployment_guide.md` for deployment instructions.
