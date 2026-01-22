## API (NestJS + Prisma + PostgreSQL)

### Prereqs
- PostgreSQL running locally (or a remote instance)

### Environment
Prisma uses `DATABASE_URL` to connect. Create a local environment file (not committed) and set:

- **DATABASE_URL**: `postgresql://USER:PASSWORD@HOST:PORT/DBNAME?schema=public`

Example:

`postgresql://postgres:postgres@localhost:5432/vehiclerental?schema=public`

### Prisma
From repo root:

- **Generate client**: `pnpm --dir apps/api prisma:generate`
- **Create/apply migrations (dev)**: `pnpm --dir apps/api prisma:migrate:dev`
- **Studio**: `pnpm --dir apps/api prisma:studio`

### Run API
From repo root:

- **Dev**: `pnpm --dir apps/api dev`

The API listens on **http://localhost:4000** by default.

