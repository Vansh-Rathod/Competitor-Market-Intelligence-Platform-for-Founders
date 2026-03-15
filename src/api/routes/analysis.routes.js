import express from 'express';
import { runAnalysis } from '../controllers/analysis.controller.js';

const router = express.Router();

router.post('/', runAnalysis);

export default router;

