# FinArth Project Structure
## Balanced Minimum Viable Product with Growth Potential

The FinArth project is structured as minimum viable product for now, and planned to grow potentially in future based on requirements and bandwidth. Please find the project structure as below.

```
./FinArth
├── ai-services
│   └── requirements.txt  # Python dependencies
├── backend     # back-end system functionality
│   ├── db-viewer.js
│   ├── logs
│   ├── package.json
│   ├── sample_examples   # sample applications that illustrate usage of free-tier models and opik evauation integration
│   │   ├── openrouter_api_opik_integration.py
│   │   ├── openrouter_api_opik_integration.ts
│   │   ├── openrouter_api.py
│   │   └── openrouter_api.ts
│   ├── src
│   │   ├── app.ts       # Express server setup
│   │   ├── database.ts
│   │   ├── logs
│   │   ├── routes
│   │   │   ├── agent.ts
│   │   │   ├── db.ts
│   │   │   ├── health.ts
│   │   │   ├── plans.ts
│   │   │   ├── portfolio.ts
│   │   │   └── users.ts
│   │   ├── server.ts
│   │   └── utils
│   │       ├── auth.ts
│   │       ├── Logger.ts
│   │       ├── LoggerConfig.ts
│   │       ├── reactAgent.ts
│   │       └── sessionCache.ts
│   ├── test-api.js
│   ├── test-logging.ts
│   ├── tsconfig.json
│   └── venv
├── CHANGELOG.md    # version log maintenance.
├── docs            # project documentation
│   ├── logging_system.md
│   ├── project_structure.md
│   ├── REACT_SETUP.md
│   └── user_preferences_implementation.md
├── frontend        # front-end system functionality
│   ├── package.json
│   ├── postcss.config.js
│   ├── public
│   │   ├── index.html  # App hosting page
│   │   └── logo.png    # Project logo
│   ├── src
│   │   ├── components
│   │   │   └── PortfolioHeatmap.tsx
│   │   ├── index.css
│   │   ├── index.tsx   # App entry point
│   │   ├── page.tsx    # Main landing page
│   │   └── pages
│   │       ├── Dashboard.tsx
│   │       ├── HomePage.tsx
│   │       ├── Login.tsx
│   │       ├── onboarding.tsx
│   │       └── Portfolio.tsx
│   └── tailwind.config.js
├── package-lock.json
├── package.json          # Workspace configuration
├── README.md             # Project detail document
└── venv                  # virtual environment setup to support back-end
                          # system launch
```

>[TODO] Update with required descriptions