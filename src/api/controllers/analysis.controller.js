import { runFullAnalysis } from '../../services/analysis.service.js';
import { log, logError } from '../../utils/logger.js';
import { validateAnalysisInput } from '../../utils/validator.js';

export async function runAnalysis(req, res) {
  const requestId = req.requestId || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  try {
    const input = req.body;
    validateAnalysisInput(input);
    log('analysis_request.received', {
      requestId,
      method: req.method,
      path: req.originalUrl,
      inputKeys: Object.keys(input ?? {}),
    });

    const result = await runFullAnalysis(input);

    log('analysis_request.success', {
      requestId,
      statusCode: 200,
      resultKeys: Object.keys(result ?? {}),
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    const statusCode = /missing required field|input must be an object/i.test(error?.message ?? '')
      ? 400
      : 500;
    logError('analysis_request.failed', {
      requestId,
      statusCode,
      message: error?.message ?? 'Unknown error',
      stack: error?.stack ?? null,
    });
    res.status(statusCode).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
}
