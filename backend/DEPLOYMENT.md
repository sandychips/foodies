# Deployment Guide

The backend is designed to be deployed on Render, but any platform that supports Node.js and PostgreSQL will work.

## Render Checklist

1. **Database** – provision a PostgreSQL instance and note its `DATABASE_URL`.
2. **Environment variables** – configure all variables listed in `.env.example` with production-safe values.
3. **Build command**
   ```bash
   npm install && npm run migrate && npm run seed
   ```
4. **Start command**
   ```bash
   npm start
   ```
5. **Scaling** – enable automatic restarts, rate limiting, compression, and logging (already configured in code).

## Docker Image

To build locally:
```bash
docker build -t foodies-backend .
```

To run with Compose:
```bash
docker-compose up -d
```

Ensure the container has access to the required environment variables and persistent volumes for logs/uploads if you enable local storage.
