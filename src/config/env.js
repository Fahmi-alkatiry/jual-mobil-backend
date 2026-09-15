import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const envSchema = z.object({
  PORT: z.string().default('5000'),
  HOST: z.string().default('0.0.0.0'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL wajib diisi'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET wajib diisi'),
  ALLOW_REGISTER: z.enum(['true', 'false']).default('false'),
  CORS_ORIGINS: z.string().optional().default('https://fe.jualmobilku.my.id,https://jualmobilku.my.id,http://localhost:5173'),
  WA_API_URL: z.string().optional(),
  WA_DEVICE_ID: z.string().optional(),
  ADMIN_WA: z.string().optional(),
  WA_BASIC_USER: z.string().optional(),
  WA_BASIC_PASS: z.string().optional(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Environment validation failed:');
  console.error(_env.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = _env.data;
