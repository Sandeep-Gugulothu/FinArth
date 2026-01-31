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

Initially, FinArth followed traditional three-tier architecture and based on the project progress it is growing towards modular monolith architecture and it can migrate to a microservices architecture in future based on project's budget, bandwidth, scope, and maintenance.

The three main components of the three-tier architecture:

1. Frontend system
    - Technology: HTML, CSS, TypeScript
2. Backend system
    - Technology: TypeScipt, JavaScript, Python
3. Storage system
    - Technology: Sqlite

<!-- [TODO] The project can have Frontend section with sub-sections such as
     Features, Styling, and Responsive-->
<!-- [TODO] The project can have Backend section with sub-sections such as
      Features, Routes, and Environment-->
<!-- [TODO] The project can have AI Services section with sub-sections such as
      Features, Dependencies, and Monitoring-->

## Project Structure

We can find the project structure [here](./docs/project_structure.md).

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