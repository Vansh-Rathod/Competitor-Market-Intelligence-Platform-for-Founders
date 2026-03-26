/**
 * Data Collection Agent.
 *
 * Expected keywordBundle shape:
 * - primary: string[]
 * - secondary: string[]
 * - queries: string[] (preferred input for source searches)
 * - all: string[] (fallback union of terms)
 *
 * Collection strategy (later):
 * 1) run discovery primarily from keywordBundle.queries
 * 2) fallback to keywordBundle.all if queries are sparse
 * 3) use primary/secondary for additional enrichment passes
 */
export async function dataCollectionAgent(keywordBundle) {
  // TODO: Call real data sources (web search, SaaS directories, etc.).
  // For now, return an empty list to keep the pipeline working.
  return [];
}
