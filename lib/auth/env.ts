import { z } from "zod";

const productionEnvironmentSchema = z.object({
  APP_ORIGIN: z.string().url().startsWith("https://"),
  DATABASE_URL: z.string().startsWith("postgresql://"),
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.string().url().startsWith("https://"),
  OIDC_PROVIDER_ID: z.string().min(1),
  OIDC_DISCOVERY_URL: z.string().url().startsWith("https://"),
  OIDC_CLIENT_ID: z.string().min(1),
  OIDC_CLIENT_SECRET: z.string().min(1),
  WORKSPACE_ALLOWED_DOMAINS: z.string().min(1),
  SESSION_HANDLE_ENCRYPTION_KEY: z.string().min(32),
});

export function readProductionEnvironment(environment = process.env) {
  return productionEnvironmentSchema.parse(environment);
}
