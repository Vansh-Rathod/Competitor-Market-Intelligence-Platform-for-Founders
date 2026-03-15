import pkg from 'pg';
import { getEnv } from './env.js';

const { Pool } = pkg;

export const pool = new Pool({
  host: getEnv('DB_HOST', 'localhost'),
  port: Number(getEnv('DB_PORT', '5432')),
  database: getEnv('DB_NAME', 'market_intel'),
  user: getEnv('DB_USER', 'postgres'),
  password: getEnv('DB_PASSWORD', ''),
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

