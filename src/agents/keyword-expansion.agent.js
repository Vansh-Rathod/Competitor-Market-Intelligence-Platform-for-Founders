import { openaiClient } from '../config/openai.js';
import {
  KEYWORD_EXPANSION_SYSTEM_PROMPT,
  buildKeywordExpansionUserMessage,
} from '../prompts/keyword-expansion.prompt.js';
import { parseStructuredResponse, toUniqueStringArray } from '../utils/llm-json.js';

const DEFAULT_MODEL = 'gpt-4o-mini';

function buildFallbackQueries(structuredIdea, primary, secondary) {
  const baseTerms = toUniqueStringArray([...primary, ...secondary]).slice(0, 6);
  const context = toUniqueStringArray([
    structuredIdea?.industry,
    structuredIdea?.icp,
    structuredIdea?.target_customer,
    structuredIdea?.geo,
  ]);

  const queries = [];

  for (const term of baseTerms) {
    queries.push(`${term} competitors`);
    queries.push(`${term} alternatives`);
    queries.push(`best ${term} software`);
    if (context[0]) queries.push(`${term} for ${context[0]}`);
    if (structuredIdea?.geo) queries.push(`${term} in ${structuredIdea.geo}`);
  }

  return toUniqueStringArray(queries).slice(0, 25);
}

function normalizeKeywordBundle(parsed, structuredIdea) {
  const fallbackPrimary = toUniqueStringArray(structuredIdea?.primary_keywords ?? []);
  const fallbackSecondary = toUniqueStringArray(structuredIdea?.secondary_keywords ?? []);

  const primary = toUniqueStringArray(parsed?.primary_keywords ?? fallbackPrimary);
  const secondary = toUniqueStringArray(parsed?.secondary_keywords ?? fallbackSecondary);
  const queries = toUniqueStringArray(parsed?.search_queries ?? []);

  const safeQueries = queries.length > 0
    ? queries
    : buildFallbackQueries(structuredIdea, primary, secondary);

  const all = toUniqueStringArray([...primary, ...secondary, ...safeQueries]);

  return {
    primary,
    secondary,
    queries: safeQueries,
    all,
  };
}

export async function keywordExpansionAgent(structuredIdea) {
  const model = process.env.OPENAI_MODEL || DEFAULT_MODEL;
  const userMessage = buildKeywordExpansionUserMessage(structuredIdea);

  try {
    const response = await openaiClient.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: KEYWORD_EXPANSION_SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.4,
    });

    const content = response.choices?.[0]?.message?.content;
    const parsed = parseStructuredResponse(content);
    return normalizeKeywordBundle(parsed, structuredIdea);
  } catch {
    // Keep pipeline resilient even if model call fails.
    return normalizeKeywordBundle(null, structuredIdea);
  }
}
