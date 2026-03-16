PROJECT NAME
Founder Market & Competitor Intelligence System

OBJECTIVE
Build a backend-only system that helps founders and CEOs understand
their competitive landscape, market saturation, and differentiation
opportunities before and during company building.

The system accepts a business idea as input and produces a structured
market intelligence report containing competitors, market analysis,
and strategic insights.

---

TARGET USERS
- Early-stage founders
- Startup CEOs
- SaaS builders
- B2B product teams

---

SCOPE (MVP)
- No frontend UI
- Input via CLI or REST API
- Output via terminal and downloadable report (PDF / Markdown)
- Focus on SaaS / B2B markets initially

---

CORE FEATURES (MVP)

1. Founder Idea Input
   - Product idea description
   - Industry
   - Target customer
   - Geography

2. Idea Understanding & Structuring
   - Extract business model
   - Identify ICP
   - Generate market keywords

3. Competitor Discovery
   - Identify direct competitors
   - Identify indirect competitors
   - Identify alternative solutions

4. Competitor Snapshot
   - Company name
   - What they do
   - Target audience
   - Key features
   - Pricing signals (if available)
   - Market positioning

5. Market Saturation & Risk Scoring
   - Number of competitors
   - Competitive intensity
   - Entry difficulty
   - Overall saturation score

6. Differentiation & Opportunity Insights
   - Overused value propositions
   - Feature overlap analysis
   - Underserved niches
   - ICP gaps

7. Report Generation
   - Structured markdown
   - Optional PDF export

---

OUT OF SCOPE (MVP)
- Real-time dashboards
- User accounts & auth
- Continuous tracking
- Alerts & notifications

---

SYSTEM ARCHITECTURE (HIGH LEVEL)

Input Layer
  - CLI / REST API

Orchestration Layer
  - Agent workflow manager
  - Task sequencing & parallel execution

Agent Layer
  - Idea understanding
  - Keyword expansion
  - Data collection
  - Competitor classification
  - Market analysis
  - Differentiation analysis
  - Report generation

Data Layer
  - Postgres (structured data)
  - Vector DB (competitor similarity & clustering)

Output Layer
  - Terminal output
  - Markdown / PDF report

---

DETAILED DATA FLOW

1. User submits idea input
2. Input is validated and normalized
3. Idea Understanding Agent converts idea into structured intelligence
4. Structured idea is saved in Postgres
5. Keyword Expansion Agent generates search terms
6. Data Collection Agents fetch competitor data in parallel
7. Raw competitor data is stored
8. Competitor Classification Agent:
   - Removes noise
   - Deduplicates
   - Classifies competitors
9. Market Analysis Agent:
   - Calculates saturation
   - Identifies competitive signals
10. Differentiation Agent:
    - Compares competitors
    - Finds whitespace opportunities
11. Report Generation Agent creates final output

---

DATA SOURCES (MVP)

Competitor Discovery:
- Company websites
- SaaS directories
- Search engine results
- Product landing pages

Competitor Insights:
- Pricing pages
- Feature documentation
- Blog posts & FAQs
- Public reviews

Market Signals:
- Number of active competitors
- Funding mentions
- Hiring signals (job pages)
- Product update frequency

NOTE:
Only publicly available data will be used.

---

AGENT LIST & RESPONSIBILITIES

1. Idea Understanding Agent
   - Converts raw idea into structured data
   - Identifies ICP, market, business model

2. Keyword Expansion Agent
   - Generates search queries
   - Expands synonyms and related terms

3. Data Collection Agents
   - Scrape and fetch competitor data
   - Lightweight summarization

4. Competitor Classification Agent
   - Deduplicates companies
   - Classifies into direct / indirect / alternatives

5. Market Analysis Agent
   - Calculates saturation and competition intensity
   - Identifies growth and risk signals

6. Differentiation & Opportunity Agent
   - Feature overlap analysis
   - ICP overlap analysis
   - Identifies underserved niches

7. Report Generation Agent
   - Converts analysis into human-readable output
   - Produces markdown / PDF

---

TECH STACK

Backend:
- Node.js

Agent Orchestration:
- OpenAI Agent SDK (:contentReference[oaicite:0]{index=0})

Databases:
- Postgres (structured data)
- Vector DB (competitor similarity & clustering)

Infrastructure:
- Background job queue (for long-running tasks)
- File storage for reports

No frontend in MVP.

---

NON-FUNCTIONAL REQUIREMENTS

- Modular agent design
- Stateless API
- Reproducible analysis via analysis_id
- Cost-aware LLM usage
- Clear logging & traceability

---

SUCCESS CRITERIA (MVP)

- Founder gets clear competitor list
- Market saturation is understandable
- Differentiation insights are actionable
- Report is shareable with co-founders
