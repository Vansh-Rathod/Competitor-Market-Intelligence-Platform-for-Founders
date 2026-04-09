function toTitleCase(input) {
  return input
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function normalizeDomain(rawUrl) {
  try {
    const parsed = new URL(rawUrl);
    return parsed.hostname.replace(/^www\./i, '').toLowerCase();
  } catch {
    return null;
  }
}

function deriveCompanyNameFromDomain(domain) {
  if (!domain) return null;
  const base = domain.split('.')[0]?.replace(/[-_]/g, ' ') ?? '';
  if (!base) return null;
  return toTitleCase(base);
}

function cleanTitle(title) {
  if (!title) return '';
  return String(title).replace(/\s+/g, ' ').trim();
}

export function looksLikeCompanyResult(result) {
  const blocklist = [
    'wikipedia.org',
    'linkedin.com',
    'facebook.com',
    'instagram.com',
    'youtube.com',
    'twitter.com',
    'x.com',
  ];
  const domain = normalizeDomain(result?.url);
  if (!domain) return false;
  if (blocklist.some((site) => domain.endsWith(site))) return false;
  return true;
}

export function normalizeSearchResultToCandidate(result, query) {
  const domain = normalizeDomain(result?.url);
  const title = cleanTitle(result?.title);
  const companyNameFromTitle = title.split('|')[0]?.split('-')[0]?.trim() || null;
  const company_name = companyNameFromTitle || deriveCompanyNameFromDomain(domain);
  const confidence = domain ? 0.7 : 0.4;

  return {
    company_name: company_name || 'Unknown',
    domain,
    website_url: result?.url || null,
    summary: result?.snippet || null,
    pricing_signal: null,
    source: result?.provider || 'search',
    source_url: result?.url || null,
    matched_query: query,
    confidence,
  };
}
