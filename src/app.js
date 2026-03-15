import express from 'express';
import analysisRoutes from './api/routes/analysis.routes.js';

const app = express();

app.use(express.json());

app.use('/analysis', analysisRoutes);

export default app;

