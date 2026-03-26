import { ideaUnderstandingAgent } from '../agents/idea-understanding.agent.js';
import { keywordExpansionAgent } from '../agents/keyword-expansion.agent.js';
import { dataCollectionAgent } from '../agents/data-collection.agent.js';
import { competitorClassificationAgent } from '../agents/competitor-classification.agent.js';
import { marketAnalysisAgent } from '../agents/market-analysis.agent.js';
import { differentiationAgent } from '../agents/differentiation.agent.js';
import { reportGenerationAgent } from '../agents/report-generation.agent.js';

export async function runFullAnalysis(rawIdeaInput) {
  const structuredIdea = await ideaUnderstandingAgent(rawIdeaInput);
  const keywords = await keywordExpansionAgent(structuredIdea);
  // const rawCompetitors = await dataCollectionAgent(keywords);
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
  
  return {
    idea: structuredIdea,
    keywords,
  };
}

