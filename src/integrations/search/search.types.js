/**
 * Canonical search result shape produced by provider clients.
 *
 * @typedef {Object} SearchResultItem
 * @property {string} title
 * @property {string} url
 * @property {string|null} snippet
 * @property {string} provider
 */

/**
 * Canonical search response shape produced by provider clients.
 *
 * @typedef {Object} SearchResponse
 * @property {SearchResultItem[]} items
 * @property {{ query: string, fetched: number, provider: string }} diagnostics
 */

/**
 * @typedef {Object} SearchProvider
 * @property {(query: string, options?: { count?: number, timeoutMs?: number }) => Promise<SearchResponse>} search
 */

export const SUPPORTED_SEARCH_PROVIDERS = Object.freeze(['brave']);
