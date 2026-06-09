# Database helpers

Keep database client setup here. These files are server-only and should never be imported into browser/client components.

For MySQL, the recommended first implementation is Prisma:

- `prisma/schema.prisma` for tables and relationships
- `src/lib/db/client.ts` for the Prisma client singleton
- `src/repositories/*` for database queries

Current files:

```txt
src/config/env.ts        validates server environment variables
src/lib/db/client.ts     creates and reuses the pooled Prisma/MySQL client
src/lib/db/health.ts     runs a simple SELECT 1 database check
```

API health check:

```txt
GET /api/health/db
```

It returns `200` when the database responds and `503` when the connection fails.

---

## Environment variables

Add these to `.env` locally and to your hosting provider in production:

```bash
DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/DATABASE_NAME"
DB_POOL_CONNECTION_LIMIT="10"
DB_POOL_ACQUIRE_TIMEOUT_MS="10000"
DB_CONNECT_TIMEOUT_MS="10000"
DB_IDLE_TIMEOUT_MS="60000"
DB_SSL="false"
```

For production managed MySQL, usually set:

```bash
DB_SSL="true"
```

Do not expose database values with `NEXT_PUBLIC_`. Anything prefixed with `NEXT_PUBLIC_` can be read by the browser.

---

## How to use the DB utility

Repositories should call `getDb()`:

```ts
import { getDb } from "@/lib/db/client";

export async function findBabyNames() {
  return getDb().babyName.findMany({
    take: 20,
  });
}
```

Keep database queries in `src/repositories/*`. Components and pages should call services, not the database directly.

Recommended flow:

```txt
UI component
  -> service
    -> repository
      -> getDb()
```

---

## Connection pooling

The project uses Prisma with the MariaDB driver adapter. The adapter works with MariaDB and MySQL-compatible databases.

`src/lib/db/client.ts` creates one reusable Prisma client per server runtime. In development, it stores the client on `globalThis` so Next.js hot reload does not open many duplicate connections.

Pool settings:

- `DB_POOL_CONNECTION_LIMIT` - maximum open connections per server instance
- `DB_POOL_ACQUIRE_TIMEOUT_MS` - how long to wait for a free connection
- `DB_CONNECT_TIMEOUT_MS` - how long to wait while opening a connection
- `DB_IDLE_TIMEOUT_MS` - how long idle connections stay open

Start with a small pool, especially on Vercel/serverless. If many serverless functions each open 10 connections, the database can run out of connections quickly.

For high traffic later, consider:

- managed MySQL with enough max connections
- read replicas for search-heavy reads
- a provider-level connection pool or proxy
- caching popular name searches
