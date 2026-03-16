market-intel-backend/
│
├── src/
│   ├── server.js              # App entry point
│   ├── app.js                 # Express app setup
│
│   ├── config/
│   │   ├── env.js             # Environment variables
│   │   ├── db.js              # Postgres connection
│   │   └── openai.js          # OpenAI Agent SDK setup
│
│   ├── routes/
│   │   └── analysis.routes.js # API routes
│
│   ├── controllers/
│   │   └── analysis.controller.js
│
│   ├── services/
│   │   ├── analysis.service.js    # Orchestrates workflow
│   │   └── idea.service.js        # Idea understanding logic
│
│   ├── agents/
│   │   └── ideaUnderstanding.agent.js
│
│   ├── models/
│   │   └── analysis.model.js      # DB queries
│
│   ├── utils/
│   │   ├── logger.js
│   │   ├── validator.js
│   │   └── response.js
│
│   └── jobs/
│       └── analysis.job.js        # Background processing (later)
│
├── .env
├── package.json
└── README.md
