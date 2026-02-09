**Overview**

This document outlines a complete automated testing strategy for the Vehicle Rental Service monorepo.

Contents:
- Test strategy and coverage matrix
- Folder structure for tests
- How to run tests locally and in CI
- Example commands and notes

1) Stack detected
- Frontend: Next.js (React) at apps/web
- Backend: NestJS at apps/api
- Database: PostgreSQL (Prisma ORM) defined at apps/api/prisma/schema.prisma
- Auth: JWT via @nestjs/jwt and passport-jwt (token-based)

2) Testing approach
- Unit tests: Jest (apps/api)
- Integration tests: Jest + supertest bootstrapping Nest app, using test DB (Postgres via Docker or CI service)
- E2E tests: Playwright (apps/web) targeting frontend flows; backend endpoints are mocked or connected to test backend
- Security and edge cases: explicit tests for expired JWT, XSS payloads, SQL-injection attempts, duplicate registration, payment failure mocks

3) Folder structure (recommended)
- apps/api/test/unit
- apps/api/test/integration
- apps/api/test/factories
- apps/api/test/fixtures
- apps/web/tests/e2e

4) Running locally (examples)
API unit/integration (from repo root):
```bash
cd apps/api
pnpm install
pnpm prisma generate
DATABASE_URL="postgresql://..." pnpm test
```

Playwright (web):
```bash
cd apps/web
pnpm install
npx playwright install
npx playwright test
```

5) CI
- See .github/workflows/ci-tests.yml for reference.

6) Next steps
- Add test implementations for all controllers/services using the patterns in apps/api/test
- Expand Playwright flows to interact with seeded test data
- Add factory/seed scripts and a docker-compose.test.yml to manage test DB locally
