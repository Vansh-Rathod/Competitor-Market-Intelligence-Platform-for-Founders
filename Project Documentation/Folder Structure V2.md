market-intel-backend/
├── src/
│   ├── server.js                    # Starts HTTP server
│   ├── app.js                       # Express app, middleware, mounts routes
│   │
│   ├── config/
│   │   ├── env.js                   # Load & validate env vars
│   │   ├── db.js                    # Postgres connection (or stub)
│   │   └── openai.js                # OpenAI / Agent SDK client
│   │
│   ├── api/
│   │   ├── routes/
│   │   │   └── analysis.routes.js   # POST /analysis
│   │   └── controllers/
│   │       └── analysis.controller.js  # Reads request, calls service, sends response
│   │
│   ├── services/
│   │   └── analysis.service.js      # Orchestrates the full pipeline (calls agents)
│   │
│   ├── agents/
│   │   ├── idea-understanding.agent.js
│   │   ├── keyword-expansion.agent.js
│   │   ├── data-collection.agent.js
│   │   ├── competitor-classification.agent.js
│   │   ├── market-analysis.agent.js
│   │   ├── differentiation.agent.js
│   │   └── report-generation.agent.js
│   │
│   ├── data/
│   │   └── analysis.model.js        # Basic DB operations (or stub for now)
│   │
│   └── utils/
│       ├── logger.js                # Logging helpers
│       ├── validator.js             # Input validation
│       └── response.js              # Success/error response helpers
│
├── .env
├── package.json
└── README.md

