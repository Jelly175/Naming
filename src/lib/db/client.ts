import "server-only";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

import { getServerEnv, type ServerEnv } from "@/config/env";
import {
  PrismaClient,
  type PrismaClient as PrismaClientInstance,
} from "@/generated/prisma/client";

type GlobalWithPrisma = typeof globalThis & {
  __naamlyPrisma?: PrismaClientInstance;
};

type MariaDbPoolConfig = Exclude<
  ConstructorParameters<typeof PrismaMariaDb>[0],
  string
>;

const globalForPrisma = globalThis as GlobalWithPrisma;

let prismaClient: PrismaClientInstance | undefined = globalForPrisma.__naamlyPrisma;

function createPoolConfig(env: ServerEnv): MariaDbPoolConfig {
  const url = new URL(env.DATABASE_URL);
  const database = url.pathname.replace(/^\//, "");

  return {
    host: url.hostname,
    port: url.port ? Number(url.port) : 3306,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: decodeURIComponent(database),
    connectionLimit: env.DB_POOL_CONNECTION_LIMIT,
    acquireTimeout: env.DB_POOL_ACQUIRE_TIMEOUT_MS,
    connectTimeout: env.DB_CONNECT_TIMEOUT_MS,
    idleTimeout: env.DB_IDLE_TIMEOUT_MS,
    ssl: env.DB_SSL ? true : undefined,
  };
}

function createPrismaClient() {
  const env = getServerEnv();
  const adapter = new PrismaMariaDb(createPoolConfig(env));

  return new PrismaClient({
    adapter,
    log: env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

export function getDb() {
  if (!prismaClient) {
    prismaClient = createPrismaClient();

    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.__naamlyPrisma = prismaClient;
    }
  }

  return prismaClient;
}

export async function disconnectDb() {
  if (!prismaClient) {
    return;
  }

  await prismaClient.$disconnect();
  prismaClient = undefined;
  globalForPrisma.__naamlyPrisma = undefined;
}

export function getDatabaseConnectionInfo() {
  const env = getServerEnv();
  const url = new URL(env.DATABASE_URL);

  return {
    host: url.hostname,
    port: url.port ? Number(url.port) : 3306,
    database: decodeURIComponent(url.pathname.replace(/^\//, "")),
    connectionLimit: env.DB_POOL_CONNECTION_LIMIT,
    sslEnabled: env.DB_SSL,
  };
}
