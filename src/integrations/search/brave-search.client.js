import { getEnv } from '../../config/env.js';
import { getDataCollectionConfig } from '../../config/data-collection.js';

const DEFAULT_BRAVE_BASE_URL = 'https://api.search.brave.com/res/v1/web/search';
const DEFAULT_TIMEOUT_MS = 6000;
const DEFAULT_RETRY_ATTEMPTS = 2;
const DEFAULT_RETRY_BASE_DELAY_MS = 300;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function shouldRetry(statusCode) {
  return statusCode === 429 || (statusCode >= 500 && statusCode <= 599);
}

async function fetchWithRetry(url, options) {
  const config = getDataCollectionConfig();
  const retryAttempts = config.retryAttempts ?? DEFAULT_RETRY_ATTEMPTS;
  const retryBaseDelayMs = config.retryBaseDelayMs ?? DEFAULT_RETRY_BASE_DELAY_MS;
  let attempt = 0;
  let lastError;

  while (attempt <= retryAttempts) {
    const controller = new AbortController();
    const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        headers: options.headers,
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (response.ok) {
        return response;
      }

      if (!shouldRetry(response.status) || attempt === retryAttempts) {
        const body = await response.text().catch(() => '');
        const error = new Error(`Brave API request failed with status ${response.status}`);
        error.statusCode = response.status;
        error.body = body;
        throw error;
      }
    } catch (error) {
      clearTimeout(timeout);
      lastError = error;
      if (attempt === retryAttempts) {
        throw error;
      }
    }

    attempt += 1;
    await sleep(retryBaseDelayMs * Math.pow(2, attempt - 1));
  }

  throw lastError || new Error('Unknown Brave API error');
}

function mapBraveResult(item) {
  return {
    title: item?.title ?? '',
    url: item?.url ?? '',
    snippet: item?.description ?? null,
    provider: 'brave',
  };
}

export function createBraveSearchClient() {
  const apiKey = getEnv('BRAVE_API_KEY');
  const baseUrl = getEnv('BRAVE_API_BASE_URL', DEFAULT_BRAVE_BASE_URL);

  return {
    async search(query, options = {}) {
      const count = options.count ?? 5;
      const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
      const url = new URL(baseUrl);
      url.searchParams.set('q', query);
      url.searchParams.set('count', String(count));

      const response = await fetchWithRetry(url.toString(), {
        headers: {
          Accept: 'application/json',
          'X-Subscription-Token': apiKey,
        },
        timeoutMs,
      });

      const json = await response.json();
      const items = Array.isArray(json?.web?.results)
        ? json.web.results.map(mapBraveResult).filter((result) => result.url)
        : [];

      return {
        items,
        diagnostics: {
          query,
          fetched: items.length,
          provider: 'brave',
        },
      };
    },
  };
}
