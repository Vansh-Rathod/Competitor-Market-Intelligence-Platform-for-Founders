export async function keywordExpansionAgent(structuredIdea) {
  // TODO: Implement real keyword expansion logic using LLM or heuristics.
  return {
    primary: structuredIdea.primary_keywords || [],
    secondary: structuredIdea.secondary_keywords || [],
    all: [
      ...(structuredIdea.primary_keywords || []),
      ...(structuredIdea.secondary_keywords || []),
    ],
  };
}
