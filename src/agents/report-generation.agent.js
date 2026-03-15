export async function reportGenerationAgent(payload) {
  const {
    idea,
    keywords,
    competitors,
    marketInsights,
    differentiationInsights,
  } = payload;

  // Very simple markdown-style report scaffold.
  const report = [
    '# Market & Competitor Intelligence Report',
    '',
    '## Idea',
    '```json',
    JSON.stringify(idea, null, 2),
    '```',
    '',
    '## Keywords',
    '```json',
    JSON.stringify(keywords, null, 2),
    '```',
    '',
    '## Competitors',
    '```json',
    JSON.stringify(competitors, null, 2),
    '```',
    '',
    '## Market Insights',
    '```json',
    JSON.stringify(marketInsights, null, 2),
    '```',
    '',
    '## Differentiation Insights',
    '```json',
    JSON.stringify(differentiationInsights, null, 2),
    '```',
    '',
  ].join('\n');

  return {
    format: 'markdown',
    content: report,
  };
}
