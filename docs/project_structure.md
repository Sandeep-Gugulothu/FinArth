# FinArth Project Structure
## Balanced Minimum Viable Product with Growth Potential

The FinArth project is structured as minimum viable product for now, and planned to grow potentially in future based on requirements and bandwidth. Please find the project structure as below.

```
FinArth
├── backend             # back-end system functionality
│   ├── __init__.py
│   ├── database_backup.sqlite
│   ├── database.sqlite
│   ├── implementation_plan.md
│   ├── logs
│   ├── market_cache.json
│   ├── package.json
│   ├── requirements.txt
│   ├── scripts
│   │   ├── db-viewer.js
│   │   ├── evaluation
│   │   │   ├── __init__.py
│   │   │   ├── compare_models.py
│   │   │   └── evaluate_router.py
│   │   ├── examples        # sample applications that illustrate usage of free-tier models and opik integration
│   │   │   ├── openapi_single_llm_test.py
│   │   │   ├── openrouter_api_opik_integration.py
│   │   │   └── openrouter_api.py
│   │   └── start_python.py
│   ├── src
│   │   ├── __init__.py
│   │   ├── ai_agent
│   │   │   ├── __init__.py
│   │   │   ├── chat_manager.py
│   │   │   ├── core.py
│   │   │   ├── engine
│   │   │   │   ├── __init__.py
│   │   │   │   ├── portfolio_analyzer.py
│   │   │   │   └── user_service.py
│   │   │   ├── handlers
│   │   │   │   ├── __init__.py
│   │   │   │   ├── base.py
│   │   │   │   ├── generic.py
│   │   │   │   ├── market_analyst.py
│   │   │   │   ├── planning.py
│   │   │   │   ├── portfolio.py
│   │   │   │   └── risk.py
│   │   │   ├── react_agent.py
│   │   │   ├── router.py
│   │   │   ├── session_cache.py
│   │   │   ├── tools.py
│   │   │   └── types.py
│   │   ├── app.py
│   │   ├── database.py
│   │   ├── logs                    # System level or user level log storage
│   │   │   ├── system_2026-02-02.log   # system format
│   │   │   ├── user_1_2026-02-06.log   # user format
│   │   ├── routes
│   │   │   ├── __init__.py
│   │   │   ├── agent.py
│   │   │   ├── db.py
│   │   │   ├── health.py
│   │   │   ├── market.py
│   │   │   ├── plans.py
│   │   │   ├── portfolio.py
│   │   │   └── users.py
│   │   ├── server.py
│   │   └── utils
│   │       ├── __init__.py
│   │       ├── auth.py
│   │       ├── logger.py
│   │       └── opik_client.py
│   ├── start.sh
│   ├── test_market.py
│   ├── tests
│   │   ├── __init__.py
│   │   ├── conftest.py
│   │   ├── test_authentication.py
│   │   └── test_llm.py
│   ├── tsconfig.json
│   └── vercel.json
├── CHANGELOG.md        # version log maintenance.
├── deploy-backend.sh
├── docs                # project documentation
│   ├── logging_system.md
│   ├── project_structure.md
│   ├── REACT_SETUP.md
│   └── user_preferences_implementation.md
├── frontend            # front-end system functionality
│   ├── package.json
│   ├── postcss.config.js
│   ├── public
│   │   ├── index.html  # App hosting page
│   │   └── logo.png    # Project logo
│   ├── src
│   │   ├── components
│   │   │   ├── Icons.tsx
│   │   │   ├── PortfolioHeatmap.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── index.css
│   │   ├── index.tsx   # App entry point
│   │   ├── page.tsx    # Main landing page
│   │   ├── pages
│   │   │   ├── AiAgent.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── HomePage.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── onboarding.tsx
│   │   │   └── Portfolio.tsx
│   │   └── utils
│   │       └── api.ts
│   ├── tailwind.config.js
│   └── vercel.json
├── market_cache.json
├── package-lock.json
├── package.json        # Workspace configuration
├── pytest.ini
└── README.md           # Project detail document
└── venv                # virtual environment setup to support back-end
                        # system launch
```

>[TODO] Update with required descriptions