import 'dotenv/config';
import app from './app.js';
import { log, logError } from './utils/logger.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  log('server.started', { port: PORT, env: process.env.NODE_ENV || 'development' });
});

process.on('uncaughtException', (error) => {
  logError('server.uncaught_exception', {
    message: error?.message ?? 'Unknown error',
    stack: error?.stack ?? null,
  });
});

process.on('unhandledRejection', (reason) => {
  logError('server.unhandled_rejection', {
    reason: typeof reason === 'string' ? reason : reason?.message || reason,
  });
});

