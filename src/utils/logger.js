import fs from 'node:fs';
import path from 'node:path';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
const LOG_DIR = process.env.LOG_DIR || 'logs';
const LOG_MAX_SIZE = process.env.LOG_MAX_SIZE || '20m';
const LOG_MAX_FILES = process.env.LOG_MAX_FILES || '14d';
const LOG_ZIPPED_ARCHIVE = process.env.LOG_ZIPPED_ARCHIVE !== 'false';
const SERVICE_NAME = process.env.LOG_SERVICE_NAME || 'market-intel-backend';

const MAX_DEPTH = 2;
const MAX_KEYS = 10;
const MAX_STRING_PREVIEW = 160;
const SENSITIVE_KEYS = [
  'apikey',
  'api_key',
  'authorization',
  'password',
  'secret',
  'cookie',
  'set-cookie',
  'access_token',
  'refresh_token',
];

if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

function isPlainObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

function isSensitiveKey(key) {
  const normalized = String(key || '').toLowerCase();
  if (normalized === 'token' || normalized.endsWith('_token')) return true;
  return SENSITIVE_KEYS.some((sensitiveKey) => normalized.includes(sensitiveKey));
}

function summarizeString(value) {
  return value.length > MAX_STRING_PREVIEW
    ? `${value.slice(0, MAX_STRING_PREVIEW)}...[truncated]`
    : value;
}

function summarizeValue(value, depth = 0) {
  if (value == null || typeof value === 'number' || typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    return summarizeString(value);
  }

  if (Array.isArray(value)) {
    return { type: 'array', length: value.length };
  }

  if (!isPlainObject(value)) {
    return { type: typeof value };
  }

  const keys = Object.keys(value);
  if (depth >= MAX_DEPTH) {
    return { type: 'object', keyCount: keys.length, keys: keys.slice(0, MAX_KEYS) };
  }

  const result = {};
  for (const [key, nestedValue] of Object.entries(value)) {
    if (isSensitiveKey(key)) {
      result[key] = '[REDACTED]';
      continue;
    }
    if (nestedValue && typeof nestedValue === 'object') {
      result[key] = summarizeValue(nestedValue, depth + 1);
    } else {
      result[key] = summarizeValue(nestedValue, depth + 1);
    }
  }

  return result;
}

const logger = winston.createLogger({
  level: LOG_LEVEL,
  defaultMeta: {
    service: SERVICE_NAME,
    env: process.env.NODE_ENV || 'development',
    pid: process.pid,
  },
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new DailyRotateFile({
      filename: path.join(LOG_DIR, 'application-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: LOG_LEVEL,
      maxSize: LOG_MAX_SIZE,
      maxFiles: LOG_MAX_FILES,
      zippedArchive: LOG_ZIPPED_ARCHIVE,
    }),
    new DailyRotateFile({
      filename: path.join(LOG_DIR, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: LOG_MAX_SIZE,
      maxFiles: LOG_MAX_FILES,
      zippedArchive: LOG_ZIPPED_ARCHIVE,
    }),
  ],
});

function emit(level, event, data = {}) {
  logger.log({
    level,
    event,
    ...summarizeValue(data),
  });
}

export function log(event, data = {}) {
  emit('info', event, data);
}

export function logWarn(event, data = {}) {
  emit('warn', event, data);
}

export function logDebug(event, data = {}) {
  emit('debug', event, data);
}

export function logError(event, data = {}) {
  emit('error', event, data);
}

