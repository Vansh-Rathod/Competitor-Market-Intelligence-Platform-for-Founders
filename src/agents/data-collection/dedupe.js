function normalizeName(name) {
  return String(name || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function dedupeCandidates(candidates) {
  const unique = [];
  const seenDomain = new Set();
  const seenName = new Set();

  for (const candidate of candidates) {
    const domain = candidate?.domain || null;
    const normalizedName = normalizeName(candidate?.company_name);

    if (domain && seenDomain.has(domain)) continue;
    if (!domain && normalizedName && seenName.has(normalizedName)) continue;

    if (domain) seenDomain.add(domain);
    if (normalizedName) seenName.add(normalizedName);

    unique.push(candidate);
  }

  return unique;
}
