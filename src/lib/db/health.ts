import "server-only";

import { getDb } from "@/lib/db/client";

export async function checkDatabaseConnection() {
  const startedAt = Date.now();

  await getDb().$queryRaw`SELECT 1`;

  return {
    ok: true,
    latencyMs: Date.now() - startedAt,
  };
}
