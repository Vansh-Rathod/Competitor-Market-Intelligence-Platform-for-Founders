export function parseStructuredResponse(text) {
  if (!text || typeof text !== 'string') return null;
  const trimmed = text.trim();
  const withoutBackticks = trimmed
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  try {
    return JSON.parse(withoutBackticks);
  } catch {
    return null;
  }
}

export function toUniqueStringArray(input) {
  if (!Array.isArray(input)) return [];

  const seen = new Set();
  const output = [];

  for (const item of input) {
    if (typeof item !== 'string') continue;
    const normalized = item.trim().replace(/\s+/g, ' ');
    if (!normalized) continue;

    const lower = normalized.toLowerCase();
    if (seen.has(lower)) continue;
    seen.add(lower);
    output.push(normalized);
  }

  return output;
}
