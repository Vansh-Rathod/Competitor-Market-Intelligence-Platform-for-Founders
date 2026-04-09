import { openaiClient } from '../config/openai.js';
import {
  IDEA_UNDERSTANDING_SYSTEM_PROMPT,
  buildIdeaUnderstandingUserMessage,
} from '../prompts/idea-understanding.prompt.js';
import { parseStructuredResponse } from '../utils/llm-json.js';
import { log, logError } from '../utils/logger.js';

const DEFAULT_MODEL = 'gpt-4o-mini';

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

  log('idea_understanding.started', {
    model,
    inputKeys: Object.keys(rawIdeaInput ?? {}),
  });

  try {
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
    const merged = mergeWithRawInput(parsed, rawIdeaInput);

    log('idea_understanding.completed', {
      model,
      llmOutput: parsed,
      mergedOutput: merged,
      usage: response?.usage ?? null,
    });

    return merged;
  } catch (error) {
    logError('idea_understanding.failed', {
      model,
      message: error?.message ?? 'Unknown error',
      stack: error?.stack ?? null,
    });
    throw error;
  }
}