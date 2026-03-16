2️⃣ SYSTEM ARCHITECTURE (HOW THE SYSTEM WORKS)
High-Level Flow
Founder Input
   ↓
Idea Understanding Agent
   ↓
Market Keyword Expansion
   ↓
Data Collection Agents
   ↓
Competitor Clustering Agent
   ↓
Insight Generation Agent
   ↓
Report Generator

🔁 DETAILED DATA FLOW
STEP 1: Founder Inputs Idea

Example:

“AI-powered accounting software for small logistics companies in India”

Stored as:

{
  "idea": "...",
  "industry": "...",
  "target_customer": "...",
  "geo": "India"
}

STEP 2: Idea Understanding Agent (LLM)

Purpose

Convert vague ideas → structured intelligence

Output

{
  "primary_keywords": ["AI accounting", "logistics accounting"],
  "secondary_keywords": ["fleet accounting", "GST logistics"],
  "business_model": "B2B SaaS",
  "icp": "SME logistics companies"
}

STEP 3: Data Collection Layer (Parallel)

Multiple agents run in parallel:

Web search

SaaS directories

App marketplaces

Job boards

Raw data stored in a staging database.

STEP 4: Competitor Clustering Agent

Takes raw companies → groups them into:

Direct

Indirect

Alternatives

This avoids noise.

STEP 5: Insight Generation Agent

This is pure value:

Market saturation

Patterns

Gaps

Opportunities

STEP 6: Report Generator

Creates:

Structured markdown

PDF

Later → dashboards