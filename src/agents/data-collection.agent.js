import { createSearchProvider } from '../integrations/search/search-provider.factory.js';
import { getDataCollectionConfig } from '../config/data-collection.js';
import { log, logWarn } from '../utils/logger.js';
import { dedupeCandidates } from './data-collection/dedupe.js';
import {
  looksLikeCompanyResult,
  normalizeSearchResultToCandidate,
} from './data-collection/normalizers.js';

function uniqStrings(input) {
  if (!Array.isArray(input)) return [];
  const seen = new Set();
  const out = [];
  for (const item of input) {
    if (typeof item !== 'string') continue;
    const value = item.trim().replace(/\s+/g, ' ');
    if (!value) continue;
    const key = value.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(value);
  }
  return out;
}

function buildFallbackQueries(allTerms) {
  const terms = uniqStrings(allTerms).slice(0, 6);
  const queries = [];
  for (const term of terms) {
    queries.push(`${term} competitors`);
    queries.push(`${term} alternatives`);
  }
  return uniqStrings(queries);
}

function selectQueries(keywordBundle, maxQueries) {
  const primaryQueries = uniqStrings(keywordBundle?.queries ?? []);
  const fallbackQueries = buildFallbackQueries(keywordBundle?.all ?? []);
  return uniqStrings([...primaryQueries, ...fallbackQueries]).slice(0, maxQueries);
}

/**
 * @param {{
 *  keywordBundle: { primary?: string[], secondary?: string[], queries?: string[], all?: string[] },
 *  ideaContext?: { industry?: string|null, icp?: string|null, target_customer?: string|null, geo?: string|null },
 *  options?: { maxQueries?: number, maxResultsPerQuery?: number, timeoutMs?: number }
 * }} input
 */
export async function dataCollectionAgent(input) {
  const config = getDataCollectionConfig();
  const maxQueries = input?.options?.maxQueries ?? config.maxQueries;
  const maxResultsPerQuery = input?.options?.maxResultsPerQuery ?? config.maxResultsPerQuery;
  const timeoutMs = input?.options?.timeoutMs ?? config.timeoutMs;

  const queries = selectQueries(input?.keywordBundle ?? {}, maxQueries);
  const provider = createSearchProvider();
  const warnings = [];
  const providerDiagnostics = [];
  const candidates = [];
  let rawHits = 0;

  log('data_collection.started', {
    queryCount: queries.length,
    maxResultsPerQuery,
    timeoutMs,
    industry: input?.ideaContext?.industry ?? null,
    geo: input?.ideaContext?.geo ?? null,
  });

  for (const query of queries) {
    try {
      const response = await provider.search(query, {
        count: maxResultsPerQuery,
        timeoutMs,
      });
      providerDiagnostics.push(response.diagnostics);
      rawHits += response.items.length;

      for (const item of response.items) {
        if (!looksLikeCompanyResult(item)) continue;
        candidates.push(normalizeSearchResultToCandidate(item, query));
      }
    } catch (error) {
      const warning = {
        query,
        provider: config.provider,
        message: error?.message || 'Search provider error',
      };
      warnings.push(warning);
      logWarn('data_collection.query_failed', warning);
    }
  }

  const uniqueCandidates = dedupeCandidates(candidates);
  const result = {
    candidates: uniqueCandidates,
    stats: {
      queries_used: queries.length,
      raw_hits: rawHits,
      unique_candidates: uniqueCandidates.length,
    },
    warnings,
    providerDiagnostics,
  };

  log('data_collection.completed', {
    queriesUsed: result.stats.queries_used,
    rawHits: result.stats.raw_hits,
    uniqueCandidates: result.stats.unique_candidates,
    warningCount: warnings.length,
  });

  return result;
}
