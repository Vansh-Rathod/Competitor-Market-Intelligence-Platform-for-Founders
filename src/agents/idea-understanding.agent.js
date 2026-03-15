import { openaiClient } from '../config/openai.js';
import {
  IDEA_UNDERSTANDING_SYSTEM_PROMPT,
  buildIdeaUnderstandingUserMessage,
} from '../prompts/idea-understanding.prompt.js';

const DEFAULT_MODEL = 'gpt-4o-mini';

/**
 * Parses JSON from LLM response, optionally stripping markdown code blocks.
 */
function parseStructuredResponse(text) {
  if (!text || typeof text !== 'string') return null;
  const trimmed = text.trim();
  const withoutBackticks = trimmed.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  try {
    return JSON.parse(withoutBackticks);
  } catch {
    return null;
  }
}

/**
 * Merges parsed LLM output with raw input, preferring LLM values but falling back to input.
 */
function mergeWithRawInput(parsed, rawIdeaInput) {
  return {
    raw: rawIdeaInput,
    primary_keywords: parsed?.primary_keywords ?? [],
    secondary_keywords: parsed?.secondary_keywords ?? [],
    business_model: parsed?.business_model ?? null,
    icp: parsed?.icp ?? null,
    industry: parsed?.industry ?? rawIdeaInput.industry ?? null,
    target_customer: parsed?.target_customer ?? rawIdeaInput.target_customer ?? null,
    geo: parsed?.geo ?? rawIdeaInput.geo ?? null,
  };
}

export async function ideaUnderstandingAgent(rawIdeaInput) {
  const model = process.env.OPENAI_MODEL || DEFAULT_MODEL;
  const userMessage = buildIdeaUnderstandingUserMessage(rawIdeaInput);

  const response = await openaiClient.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: IDEA_UNDERSTANDING_SYSTEM_PROMPT },
      { role: 'user', content: userMessage },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.3,
  });

  const content = response.choices?.[0]?.message?.content;
  const parsed = parseStructuredResponse(content);

  return mergeWithRawInput(parsed, rawIdeaInput);
}