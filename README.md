# Competitor Market Intelligence Platform for Founders

Backend service that runs a multi-agent analysis pipeline for startup idea understanding and competitor intelligence.

## Run

- Install dependencies: `npm install`
- Copy env template: `copy .env.example .env` (Windows)
- Fill required keys in `.env`
- Start server: `npm run start`

## Data Collection Agent (MVP)

The data collection stage runs synchronously inside `POST /analysis` and uses a provider abstraction to fetch competitor candidates from external APIs.

Current provider:
- `brave` via Brave Search API

Required env vars:
- `DATA_COLLECTION_PROVIDER=brave`
- `BRAVE_API_KEY`
- `BRAVE_API_BASE_URL` (optional override)
- `DATA_COLLECTION_MAX_QUERIES`
- `DATA_COLLECTION_MAX_RESULTS_PER_QUERY`
- `DATA_COLLECTION_TIMEOUT_MS`
- `DATA_COLLECTION_RETRY_ATTEMPTS`
- `DATA_COLLECTION_RETRY_BASE_DELAY_MS`

The provider layer is intentionally abstracted so you can add more providers later without changing orchestration in `data-collection.agent.js`.

## Postman Quick Test

- Method: `POST`
- URL: `http://localhost:3000/analysis`
- Header: `Content-Type: application/json`
- Body:

```json
{
  "idea": "AI-powered accounting software for small logistics companies",
  "industry": "Logistics SaaS",
  "target_customer": "Small and mid-size logistics companies",
  "geo": "India"
}
```

Expected MVP response sections now include:
- `idea`
- `keywords`
- `competitorsRaw`
- `dataCollection` (stats, warnings, provider diagnostics)

Manual verification checklist:
- [ ] valid request returns `dataCollection.candidates` and `dataCollection.stats`
- [ ] invalid request body returns HTTP 400
- [ ] with invalid/missing `BRAVE_API_KEY`, pipeline still returns with warnings instead of crashing
- [ ] logs contain `data_collection.started` and `data_collection.completed` events

## Logging (Winston)

The project uses Winston with daily rotating file transports for production-grade structured logging.

### Log Files

- `logs/application-YYYY-MM-DD.log` for general logs (`info` and above)
- `logs/error-YYYY-MM-DD.log` for error logs

### Default Behavior

- JSON log format with `timestamp`, `level`, `event`, `service`, `env`, and `pid`
- Daily rotation enabled
- Max file size: `20m`
- Retention: `14d`
- Archive rotation files: enabled
- Sensitive fields are redacted and complex payloads are logged as metadata summaries

### Environment Variables

- `LOG_LEVEL` (default: `info`)
- `LOG_DIR` (default: `logs`)
- `LOG_MAX_SIZE` (default: `20m`)
- `LOG_MAX_FILES` (default: `14d`)
- `LOG_ZIPPED_ARCHIVE` (default: `true`)
- `LOG_SERVICE_NAME` (default: `market-intel-backend`)

### Run

Start the server and inspect the generated files in the `logs/` directory.
