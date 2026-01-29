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