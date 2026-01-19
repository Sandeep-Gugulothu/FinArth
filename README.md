# FinArth - AI-Powered Finance Advisor

FinArth is an AI-powered financial planning platform that converts life goals into safe, automated, and understandable financial action. It helps users move from financial uncertainty to confident investment decisions through personalized guidance and transparent recommendations.

## Features

- **AI-Powered Financial Planning**: Intelligent analysis and personalized investment recommendations
- **Goal-Based Planning**: Convert specific life goals into actionable financial plans
- **Personalized Math**: Exact calculations based on individual financial situations
- **Clear Action Steps**: Specific investment allocations with transparent explanations
- **Modern UI**: Responsive React frontend with animated components and dark theme
<!-- [TODO] can specify safety and compliance data as additional feature based on project validation -->

## Architecture

FinArth can follow modular monolith architecture and can migrate to a microservices architecture slowly based on project's budget, bandwidth, and scope.

The three main components:

```
FinArth/
├── frontend/          # React + TypeScript UI
├── backend/           # Node.js + Express API
├── ai-services/       # Python FastAPI AI services
└── package.json       # Workspace configuration
```

<!-- [TODO] The project can have Frontend section with sub-sections such as
      Technology, Features, Styling, and Responsive-->
<!-- [TODO] The project can have Backend section with sub-sections such as
      Technology, Features, Routes, and Environment-->
<!-- [TODO] The project can have AI Services section with sub-sections such as
      Technology, Features, Dependencies, and Monitoring-->

## Prerequisites

### macOS Setup
- **Node.js**: >= 18.0.0 (install via [Homebrew](https://brew.sh): `brew install node`)
- **npm**: >= 9.0.0 (comes with Node.js)
- **Python**: >= 3.8 (install via Homebrew: `brew install python`)
- **Xcode Command Line Tools**: `xcode-select --install`

## Installation

### macOS Instructions

1. **Install Homebrew** (if not already installed)
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. **Install Node.js and Python**
   ```bash
   brew install node python
   ```

3. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FinArth
   ```

## Development
<!-- [TODO] Define run configuration commands -->

### Individual service commands
<!-- [TODO] Define Individual service commands -->

## Build
<!-- [TODO] Define Build commands -->

## Testing
<!-- [TODO] Define test commands -->

## Project Structure

```
FinArth/
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── index.tsx        # React app entry point
│   │   └── page.tsx         # Main landing page component
│   └── package.json
├── backend/
│   ├── src/
│   │   └── app.ts           # Express server setup
│   └── package.json
├── ai-services/
│   ├── requirements.txt     # Python dependencies
│   └── main.py             # FastAPI application
├── .gitignore
├── CHANGELOG.md
└── package.json            # Workspace configuration
```

## Configuration

### Environment Variables
<!-- [TODO] Create / define environment configuration -->

### macOS-specific Notes
- Use `python3` and `pip3` commands instead of `python` and `pip`
- If you encounter permission issues, use `sudo` or virtual environments
- For M1/M2 Macs, ensure all dependencies are compatible with ARM architecture

## API Endpoints
<!-- [TODO] API endpoint description if required, we can maintain dedicated
      folder called docs-->

## UI Components
<!-- [TODO] UI Component description -->

## Dependencies
<!-- [TODO] Frontend dependency description -->
<!-- [TODO] Backend dependency description -->
<!-- [TODO] AI service dependency description -->

## Important Disclaimers
<!-- [TODO] Important notes to people who visit this repository -->

## Development Notes
<!-- [TODO] General development notes -->

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests to ensure everything works
5. Submit a pull request

## License
<!-- [TODO] Specify licensing information-->

---