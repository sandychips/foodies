# Setup Guide

Follow these steps to configure the Foodies backend locally:

1. **Environment variables** – duplicate `.env.example` as `.env` and provide secure secrets plus database credentials.
2. **Install dependencies** – run `npm install`.
3. **Database** – spin up PostgreSQL with `docker-compose up postgres -d` or connect to an existing instance.
4. **Migrations** – execute `npm run migrate` to create tables.
5. **Seed data** – populate reference data via `npm run seed`. Seed files read JSON assets from `../foodiesjson`.
6. **Development server** – start with `npm run dev`; the API listens on `http://localhost:5000/api/v1` by default.
7. **Swagger UI** – available at `/api/docs` when `SWAGGER_ENABLED` is true.

For troubleshooting and production deployment, consult `DEPLOYMENT.md` and the PRD in the repository root.
