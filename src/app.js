import express from 'express';
import analysisRoutes from './api/routes/analysis.routes.js';
import { log } from './utils/logger.js';

const app = express();

app.use(express.json());
app.use((req, _res, next) => {
  req.requestId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  log('http.request', {
    requestId: req.requestId,
    method: req.method,
    path: req.originalUrl,
    hasBody: Boolean(req.body && Object.keys(req.body).length > 0),
  });
  next();
});

app.use('/analysis', analysisRoutes);

export default app;

