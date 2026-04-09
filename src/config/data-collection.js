import { getEnv, getNumberEnv } from './env.js';

const SUPPORTED_PROVIDERS = new Set(['brave']);

export function getDataCollectionConfig() {
  const provider = getEnv('DATA_COLLECTION_PROVIDER', 'brave').toLowerCase();
  if (!SUPPORTED_PROVIDERS.has(provider)) {
    throw new Error(`Unsupported DATA_COLLECTION_PROVIDER "${provider}"`);
  }

  const maxQueries = getNumberEnv('DATA_COLLECTION_MAX_QUERIES', 8);
  const maxResultsPerQuery = getNumberEnv('DATA_COLLECTION_MAX_RESULTS_PER_QUERY', 5);
  const timeoutMs = getNumberEnv('DATA_COLLECTION_TIMEOUT_MS', 6000);
  const retryAttempts = getNumberEnv('DATA_COLLECTION_RETRY_ATTEMPTS', 2);
  const retryBaseDelayMs = getNumberEnv('DATA_COLLECTION_RETRY_BASE_DELAY_MS', 300);

  if (maxQueries <= 0) throw new Error('DATA_COLLECTION_MAX_QUERIES must be > 0');
  if (maxResultsPerQuery <= 0) throw new Error('DATA_COLLECTION_MAX_RESULTS_PER_QUERY must be > 0');
  if (timeoutMs <= 0) throw new Error('DATA_COLLECTION_TIMEOUT_MS must be > 0');
  if (retryAttempts < 0) throw new Error('DATA_COLLECTION_RETRY_ATTEMPTS must be >= 0');
  if (retryBaseDelayMs <= 0) throw new Error('DATA_COLLECTION_RETRY_BASE_DELAY_MS must be > 0');

  return {
    provider,
    maxQueries,
    maxResultsPerQuery,
    timeoutMs,
    retryAttempts,
    retryBaseDelayMs,
  };
}
