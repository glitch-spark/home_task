import "server-only";
import { z } from "zod";

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().startsWith("postgresql://"),
  OPENAI_API_KEY: z.string().min(1).optional(),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

let cached: ServerEnv | null = null;

/** Server-only env. Never import from Client Components. */
export function getServerEnv(): ServerEnv {
  if (cached) return cached;
  const parsed = serverEnvSchema.safeParse(process.env);
  if (!parsed.success) {
    const message = parsed.error.flatten().fieldErrors;
    throw new Error(
      `Invalid server environment: ${JSON.stringify(message, null, 2)}`
    );
  }
  cached = parsed.data;
  return cached;
}
