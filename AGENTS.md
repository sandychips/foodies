# Repository Guidelines

## Project Structure & Module Organization
- `backend/` covers the Express API: request flow in `controllers/`, `services/`, `routes/`; Sequelize models in `models/` with migrations and seeders under `migrations/` and `seeders/`; middleware and helpers in `middleware/` and `utils/`; stage API tests in `tests/`.
- `frontend/` hosts the Vite + React client. Shared widgets live in `components/`, routed screens in `pages/`, global state in `redux/`, remote calls in `services/`, and styling assets in `styles/` and `assets/`. Static files sit in `public/`, build artifacts in `dist/`.
- Product references and sample data are stored in `design/` and `foodiesjson/`; skim them before adjusting user-facing flows.

## Build, Test, and Development Commands
- Backend (`cd backend`): `npm install`; `npm run dev` for nodemon; `npm start` for a production-style launch. Use `npm run migrate`/`npm run migrate:undo` for schema changes, `npm run seed`/`npm run seed:undo` for fixtures, and `npm run lint` for ESLint. `docker-compose up` runs the API with Postgres.
- Frontend (`cd frontend`): `npm install`; `npm run dev` serves Vite at `http://localhost:5173`; `npm run build` compiles to `dist`; `npm run preview` checks the bundle; `npm run lint` enforces the React lint config.

## Coding Style & Naming Conventions
- Stick to two-space indentation, trailing semicolons, and camelCase identifiers. Backend files continue using CommonJS (`require`/`module.exports`); keep models and controllers in PascalCase filenames (e.g., `RecipeController.js`).
- React components ship as PascalCase functions, hooks stay in `hooks/` prefixed with `use`, Redux slices end in `Slice.js`, and env constants remain SCREAMING_SNAKE_CASE. Run the relevant linter before pushing.

## Testing Guidelines
- Automated suites are not yet configured. Add backend integration coverage under `backend/tests/` with Jest + Supertest (and wire an npm script). Frontend checks belong in `frontend/src/__tests__/` with Vitest or Testing Library. Until then, record manual verification steps alongside lint results.

## Commit & Pull Request Guidelines
- Write imperative, scope-prefixed commit titles such as `frontend: tighten auth guard`. Keep commits focused and avoid mixing unrelated frontend/backend edits.
- PRs must describe intent, list schema or env updates, and include screenshots or GIFs for UI changes. Confirm linters (and any new tests) pass and note seed or migration commands reviewers must run.

## Environment & Configuration Notes
- Copy `backend/.env.example` when provisioning secrets and never commit `.env`. Document new variables in the example file and call out Docker or Vite port changes so teammates can sync quickly.
