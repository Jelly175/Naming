# Database helpers

Keep database client setup here.

For MySQL, the recommended first implementation is Prisma:

- `prisma/schema.prisma` for tables and relationships
- `src/lib/db/prisma.ts` for the Prisma client singleton
- `src/repositories/*` for database queries
