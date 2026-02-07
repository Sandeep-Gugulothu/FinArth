# Changelog
## [0.1.0] - 2026-01-19
### Added
- Initial project structure with frontend, backend, and AI services directories
- FinArth landing page with modern React + TypeScript frontend
- Educational disclaimer and DYOR notice

### Features
- Animated UI components with hover effects
- Mobile-responsive design
- Modern dark theme with gradient accents
- Call-to-action buttons for user engagement

## [0.1.1] - 2026-01-19
- Readme document file Initial version update.
    - Various section(s) specification.
    - Indentation update.

## [0.1.2] - 2026-01-19
### Added
- SQLite database integration with user authentication
- Login/register pages with form validation
- JWT token-based authentication system
- Database.sqlite added to .gitignore
- Designed onboarding page with T&C acceptance and initial user data collection added.
- A little change in the folder structure to make dashboard efficient.

### Other significant updates
- Landing page added more interactive features and animations

### Debug
- View demo button on login page (remove in production)

## [0.1.3] - 2026-01-22
### Back-end Changes
- Open router API python example with the 'xiaomi/mimo-v2-flash:free' model
- API Key spec

## [0.1.4] - 2026-01-24
### Back-end Changes
- Open router API type script example with the 'xiaomi' model

## [0.2.0] - 2026-01-24
### Front-end Changes
- page update to redirect user prompt to LLM
### Back-end Changes
- opik integration update example update.
- User's prompt feed to a LLM update in the back-end system
    - ReAct agent pattern implementation with mock tools
### Documentation Changes
- docs folder update to maintain technical documentation.
### Limitations
- User preference feed to the LLM along with user's prompt.
- Data store flow involvement during LLM calls.
- opik integration update

## [0.2.1] - 2026-01-24
### Major Features Added
- Portfolio Management System: Complete CRUD functionality for investment holdings Still in development
- Interactive Portfolio Dashboard: Treemap heatmap visualization  
- Multi-page Architecture: Organized component structure with proper routing.

### Backend Enhancements
- Portfolio API Routes: New endpoints for portfolio data management
- Enhanced app.ts: Integration of both portfolio and agent routes

### Frontend Restructure
- Pages Organization: Moved components to dedicated pages directory
  - Login.tsx → pages/Login.tsx
  - onboarding.tsx → pages/onboarding.tsx
  - New: Dashboard.tsx, HomePage.tsx, Portfolio.tsx
- Component Architecture: Separated PortfolioHeatmap into reusable component

## [0.2.2] - 2026-01-25
### Back-end Changes
- react agent update with opik tracking
### Documentation Changes
- REACT_SETUP.md file updated with pre-requisites instructions.
### Notes
- Make sure re-init through npm is executed before launching the front and
  back-end systems as package json is not getting committed to the repository.
  eg: `npm install`
### Limitations
- User preference feed to the LLM along with user's prompt.
- Data store flow involvement during LLM calls.
- Validate the latest merged changes

## [0.3.0] - 2026-01-29
### Back-end Changes
- Financial preference consideration update
  - Relevant database and active session cache updates
- Logger update
  - four-mode consideration with color identifier
  - basic pattern inclusion
### Front-end Changes
- User-Id consideration and redirection update
- datastore update
### Documentation Changes
- logging_system.md file update to illustrate log design for the current system
- user_preferences_implementation.md file update to specify the user financial
  preference consideration implementation.
### Notes
- Most of the limitations got covered from the previous version.
- Make sure re-init through npm is executed before launching the front and
  back-end systems as package json is not getting committed to the repository.
  eg: `npm install`
### Limitations
- Expected return estimates, Age, and Financial objectives are not being
  considered along with users' prompt
- Recreation of the database tables and update with existing db details if we
  have any latest changes with respect to create query, specifically new table
  introduction scenarios.
- LLM agent classification for considering financial preferences separately
  along with user's prompt.

## [0.3.1] - 2026-01-31
### Back-end Changes
- Sample application folder name change
### Documentation Changes
- README file update
  - Architecture and project structure detail update
- Project structure mark down file draft
### Notes
- Make sure re-init through npm is executed before launching the front and back-end systems as package json is not getting committed to the repository. Example: `npm install`
### Limitations
- Expected return estimates, Age, and Financial objectives are not being considered along with users' prompt.
- Recreation of the database tables and update with existing db details if we have any latest changes with respect to create query, specifically new table introduction scenarios.
- LLM agent classification for considering financial preferences separately along with user's prompt.

## [0.3.2] - 2026-02-01
### Documentation Changes
- README file update
  - Architecture detail update
  - Build detail update.
- Project structure comment update
### Notes
- Make sure re-init through npm is executed before launching the front and back-end systems as package json is not getting committed to the repository. Example: `npm install`
### Limitations
- Expected return estimates, Age, and Financial objectives are not being considered along with users' prompt.
- Recreation of the database tables and update with existing db details if we have any latest changes with respect to create query, specifically new table introduction scenarios.
- LLM agent classification for considering financial preferences separately along with user's prompt.

## [0.3.3] - 2026-02-03
### Backend Changes
- Removed typescript backend logic and replaced it with Python
- pytest draft
  - configuration setup
  - authentication test definition
  - github workflow draft to trigger auto-test on github operations
- requirement package update
- package json config update with python script execution

## [0.3.4] - 2026-02-04
### Backend Changes
- Requirement package version removal as a probable fix for dependency conflict.

## [0.3.5] - 2026-02-04
### Backend Changes
- Sample application to validate single llm response.
- React Agent class update
  - class consideration
  - naming convention updates
  - code segregation update
- Authentication issue fix
- test update
  - llm test case addition
### Configuration Changes
- package-lock.json
- package.json
- pytest.ini
- requirements.txt
  - version removal in ai-services
  - pytest llm support package

## [0.3.6] - 2026-02-05
### Frontend Changes
- Chat UI update
  - Chat history panel addition
  - Chat history panel design update
  - Chat history panel functionality update
### Backend Changes
- Chat history panel update
  - Chat history panel design update
  - Chat history panel functionality update

## [0.4.0] - 2026-02-05
### AI Agent & Backend Evolution
- **Hybrid AI Architecture**: Implemented a specialized "Intent Router" with domain-specific handlers (Portfolio, Market, Risk, Planning) for faster and more accurate responses.
- **Deterministic Math Engines**: Added `PortfolioAnalyzer` to perform hard calculations (total value, risk score, allocation %) *before* LLM processing, eliminating hallucinations in numerical data.
- **Personalization & Localization**: 
  - Integrated onboarding data (name, country, risk profile) into all AI responses.
  - Added specific intelligence for Indian users, including NSE/BSE focus and 30% crypto tax awareness.
- **Observability (Opik Integration)**: 
  - Implementation of `OpikConfig.flush()` for reliable tracing.
  - Added structured reasoning steps (`<thought>` tags) for transparency.
  - Integrated `@llm_unit` automated evaluation tests.
- **Back-end Reorganization**: 
  - Cleaned up root directory by removing legacy scripts (`start.sh`, `start_python.py`).
  - Decoupled AI logic into `src/ai_agent/`, separating it from core system utilities.
  - Organized project scripts into `backend/scripts/`.
- **UI/UX Polishing**:
  - Implemented static sidebars and panels to prevent full-page scrolling.
  - Added custom scrollbars to content areas for a cleaner, premium feel.

## [0.5.0] - 2026-02-06
### Frontend Changes
- **Dashboard Page**:
  - Added the visuals of the data fetched from the coinGecko and Weexs API.
  - Changed the Hardcoded values to the dynamic values.
  - Recent Activity panel update and Market Intelligence panel update.
- **Portfolio Page**:
  - Added the visuals of the data fetched from the coinGecko and Weexs API.
  - Changed the Hardcoded values to the dynamic values.
  - Recent Activity panel update and Market Intelligence panel update.
  - Calculating the profits in the real time
  - Fully implemented for the crypto currencies.  
- **Goals Page**
  - Implemeted the Goal Creation and Tracking.
### Backend Changes
- **Portfolio Analysis**: Enhanced `PortfolioAnalyzer` to calculate "Total Value" (Current Value + ROI) for the dashboard summary.
- **Market Data**: Added real-time market data fetching for the "Market Pulse" panel.
 - We are using the **CoinGecko API(Analyst Plan)** for the market data in the HomePage.
 - We are using the **Weexs(CEX) API** for calulating the ROI and Total Value.

## [0.5.1] - 2026-02-06
### Goal Architect & Strategic Planning
  - Implemented an advanced "Multi-Factor Feasibility" engine that weights SIP stress, timeline horizons, initial wealth headstarts, and risk volatility for realistic success probabilities.
  - Added a consolidated "Global Commitment" summary displaying total monthly SIP requirements across all active targets.
- **High-Fidelity Data Infrastructure**:
  - Performed a zero-data-loss migration of the `financial_goals` schema to include critical advisory context: `risk_profile`, `adjust_inflation`, and `return_rate`.
  - Updated backend API routes to capture this mathematical context, enabling future "Wealth Intel" personalized insights.

## [0.5.2] - 2026-02-06
### Backend Changes
- Dead code removal
- Error opik import handling
- Opik evaluation draft
- log filename and number update
- cache file removal
- env variable consideration for model name
### Documentation Changes
- README file update
  - Project heading
  - Component Description
  - Removal of open source information
  - Build scope update
  - project structure
  - basic hld inclusion

## [0.5.3] - 2026-02-07
### Backend Changes
- opik auth update
- opik thread sample update
- DB schematic sql file update
- tool script thread update
- thread_id formation update
### Documentation Changes
- README file update
- design and web interface updates.
- db arch doc update