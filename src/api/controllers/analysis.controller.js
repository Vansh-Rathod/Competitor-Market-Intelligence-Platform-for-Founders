import { runFullAnalysis } from '../../services/analysis.service.js';

export async function runAnalysis(req, res) {
  try {
    const input = req.body;
    const result = await runFullAnalysis(input);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
}
