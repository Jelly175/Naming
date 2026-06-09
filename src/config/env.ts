import "server-only";
import { z } from "zod";

function numberFromEnv(name: string, defaultValue: number, min = 1, max = 100) {
  return z
    .string()
    .optional()
    .transform((value, context) => {
      if (!value) {
        return defaultValue;
      }

      const parsed = Number(value);

      if (!Number.isInteger(parsed) || parsed < min || parsed > max) {
        context.addIssue({
          code: "custom",
          message: `${name} must be an integer between ${min} and ${max}.`,
        });

        return z.NEVER;
      }

      return parsed;
    });
}

const serverEnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL is required.")
    .refine(
      (value) => value.startsWith("mysql://") || value.startsWith("mariadb://"),
      "DATABASE_URL must start with mysql:// or mariadb://.",
    ),
  DB_POOL_CONNECTION_LIMIT: numberFromEnv("DB_POOL_CONNECTION_LIMIT", 10, 1, 50),
  DB_POOL_ACQUIRE_TIMEOUT_MS: numberFromEnv(
    "DB_POOL_ACQUIRE_TIMEOUT_MS",
    10_000,
    1_000,
    60_000,
  ),
  DB_CONNECT_TIMEOUT_MS: numberFromEnv(
    "DB_CONNECT_TIMEOUT_MS",
    10_000,
    1_000,
    60_000,
  ),
  DB_IDLE_TIMEOUT_MS: numberFromEnv("DB_IDLE_TIMEOUT_MS", 60_000, 5_000, 600_000),
  DB_SSL: z
    .enum(["true", "false"])
    .optional()
    .transform((value) => value === "true"),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

let cachedServerEnv: ServerEnv | undefined;

export function getServerEnv() {
  if (cachedServerEnv) {
    return cachedServerEnv;
  }

  const parsed = serverEnvSchema.safeParse(process.env);

  if (!parsed.success) {
    const message = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("\n");

    throw new Error(`Invalid server environment variables:\n${message}`);
  }

  cachedServerEnv = parsed.data;
  return cachedServerEnv;
}
