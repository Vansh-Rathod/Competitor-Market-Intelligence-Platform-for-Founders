export function validateAnalysisInput(input) {
  if (!input || typeof input !== 'object') {
    throw new Error('Input must be an object.');
  }

  if (!input.idea && !input.description) {
    throw new Error('Missing required field: idea or description.');
  }
}

