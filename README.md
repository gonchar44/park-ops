# ParkOps

Monorepo for ParkOps — parking operations platform.

## Stack

- **Backend**: NestJS (`apps/api`)
- **Frontend**: Next.js (`apps/web`)
- **Database**: PostgreSQL + PostGIS (local via Docker Compose, [Neon](https://neon.tech) for staging/prod)
- **Data layer**: [Drizzle ORM](https://orm.drizzle.team)
- **Package manager**: pnpm (workspaces)

## Requirements

- Node.js `22.16.0` (see `.nvmrc`)
- pnpm (managed via corepack — see `packageManager` in `package.json`)
- Docker (for local Postgres/PostGIS)

## Getting started

```bash
corepack enable
pnpm install

cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local

pnpm db:start

pnpm db:migrate
pnpm dev
```

- API: http://localhost:3001 (`/health`)
- Web: http://localhost:3000

## Scripts

| Script             | Description                                        |
| ------------------ | -------------------------------------------------- |
| `pnpm dev`         | Run backend + frontend concurrently                |
| `pnpm build`       | Build all apps                                     |
| `pnpm lint`        | Lint all apps                                      |
| `pnpm typecheck`   | Typecheck all apps                                 |
| `pnpm db:start`    | Start the local Postgres/PostGIS container         |
| `pnpm db:stop`     | Stop the local Postgres/PostGIS container          |
| `pnpm db:reset`    | Wipe the local DB volume, recreate, and re-migrate |
| `pnpm db:generate` | Generate a Drizzle migration                       |
| `pnpm db:migrate`  | Apply Drizzle migrations                           |
| `pnpm db:studio`   | Open Drizzle Studio against the local DB           |
