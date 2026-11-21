import { z } from 'zod';

const booleanFromString = z
  .enum(['true', 'false'])
  .transform((value) => value === 'true');

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_HOST: z.string().min(1),
  DATABASE_PORT: z.coerce.number().int().positive().default(5432),
  DATABASE_USER: z.string().min(1),
  DATABASE_PASSWORD: z.string().min(1),
  DATABASE_NAME: z.string().min(1),
  DATABASE_SSL: booleanFromString.default(false),
  DATABASE_LOGGING: booleanFromString.default(false),
  JWT_ACCESS_SECRET: z.string().min(16),
  JWT_ACCESS_TTL: z.string().min(1).default('900s'),
  REFRESH_TTL_DAYS: z.coerce.number().int().positive().default(7),
  STORAGE_DIR: z.string().min(1).default('storage/uploads'),
  CORS_ORIGIN: z.string().min(1).default('http://localhost:3000'),
  BODY_LIMIT: z.string().min(1).default('256kb'),
  PAYMENT_PROVIDER: z.string().min(1).default('mock'),
  WAYFORPAY_MERCHANT_ACCOUNT: z.string().optional(),
  WAYFORPAY_SECRET_KEY: z.string().optional(),
  WAYFORPAY_DOMAIN: z.string().optional(),
  PUBLIC_API_URL: z.string().min(1).default('http://localhost:3000'),
  WEB_PUBLIC_URL: z.string().min(1).default('http://localhost:3000'),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>): Env {
  return envSchema.parse(config);
}
