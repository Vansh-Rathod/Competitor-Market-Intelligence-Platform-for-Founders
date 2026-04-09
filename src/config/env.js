import 'dotenv/config';

export function getEnv(name, defaultValue) {
  const value = process.env[name];
  if (value === undefined || value === '') {
    if (defaultValue !== undefined) return defaultValue;
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getNumberEnv(name, defaultValue) {
  const value = getEnv(name, String(defaultValue));
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`Environment variable ${name} must be a valid number`);
  }
  return parsed;
}

