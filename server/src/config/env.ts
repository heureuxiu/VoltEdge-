import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  MONGODB_URI: z.string().min(1).default('mongodb://127.0.0.1:27017/voltedge'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters'),
  JWT_EXPIRES_IN: z.string().default('8h'),
  CORS_ORIGINS: z.string().default('http://localhost:3000,http://localhost:3001'),
  /** Optional DNS resolvers (comma separated) for networks that block Atlas SRV lookups, e.g. 8.8.8.8,1.1.1.1 */
  DNS_SERVERS: z.string().default(''),
  ADMIN_EMAIL: z.string().email().default('admin@voltedge.co.za'),
  ADMIN_PASSWORD: z.string().min(8).default('voltedge123'),
  ADMIN_NAME: z.string().default('VoltEdge Admin'),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues.map((i) => `  - ${i.path.join('.')}: ${i.message}`).join('\n');
  throw new Error(`Invalid environment configuration:\n${issues}`);
}

export const env = parsed.data;
export const isProduction = env.NODE_ENV === 'production';
/** Allowed browser origins. Tolerates spaces and trailing slashes in the env value. */
export const corsOrigins = env.CORS_ORIGINS.split(',')
  .map((o) => o.trim().replace(/\/+$/, ''))
  .filter(Boolean);
