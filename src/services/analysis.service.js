import { ideaUnderstandingAgent } from '../agents/idea-understanding.agent.js';
import { keywordExpansionAgent } from '../agents/keyword-expansion.agent.js';
import { dataCollectionAgent } from '../agents/data-collection.agent.js';
import { log, logError } from '../utils/logger.js';

export async function runFullAnalysis(rawIdeaInput) {
  log('analysis_pipeline.started', {
    inputKeys: Object.keys(rawIdeaInput ?? {}),
  });

  try {
    const structuredIdea = await ideaUnderstandingAgent(rawIdeaInput);
    log('analysis_pipeline.idea_understanding.done', {
      primaryCount: structuredIdea?.primary_keywords?.length ?? 0,
      secondaryCount: structuredIdea?.secondary_keywords?.length ?? 0,
      industry: structuredIdea?.industry ?? null,
    });

    const keywords = await keywordExpansionAgent(structuredIdea);
    log('analysis_pipeline.keyword_expansion.done', {
      queryCount: keywords?.queries?.length ?? 0,
      allKeywordCount: keywords?.all?.length ?? 0,
    });

    const dataCollection = await dataCollectionAgent({
      keywordBundle: keywords,
      ideaContext: {
        industry: structuredIdea?.industry ?? null,
        icp: structuredIdea?.icp ?? null,
        target_customer: structuredIdea?.target_customer ?? null,
        geo: structuredIdea?.geo ?? null,
      },
    });
    const rawCompetitors = dataCollection.candidates;
    log('analysis_pipeline.data_collection.done', {
      candidates: rawCompetitors.length,
      warnings: dataCollection.warnings?.length ?? 0,
    });

  // const classifiedCompetitors = await competitorClassificationAgent(rawCompetitors, structuredIdea);
  // const marketInsights = await marketAnalysisAgent(classifiedCompetitors);
  // const differentiationInsights = await differentiationAgent(classifiedCompetitors, structuredIdea);
  
  // const report = await reportGenerationAgent({
  //   idea: structuredIdea,
  //   keywords,
  //   competitors: classifiedCompetitors,
  //   marketInsights,
  //   differentiationInsights,
  // });

  // return {
    // idea: structuredIdea,
    // keywords,
    // competitors: classifiedCompetitors,
    // marketInsights,
    // differentiationInsights,
    // report,
  // };
  
    const result = {
      idea: structuredIdea,
      keywords,
      competitorsRaw: rawCompetitors,
      dataCollection,
    };

    log('analysis_pipeline.completed', {
      resultKeys: Object.keys(result),
    });

    return result;
  } catch (error) {
    logError('analysis_pipeline.failed', {
      message: error?.message ?? 'Unknown error',
      stack: error?.stack ?? null,
    });
    throw error;
  }
}

