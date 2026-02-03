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
    - Technology
        - HTML: We used HTML to render our web-page by embedding executable code.
        - CSS: We used Cascading Style Sheet to style our webpage.
        - TypeScript: We are using TypeScript to make our webpage actionable.
    - Features: There are numerous features in our project, but we would like highlight the primary ones as below.
        - Home page: This is our landing page. The user will see our project's home page after running our site. We are hosting it through pages typescript. In this page you may find our feature offerings and work procedure.
        - Login: The user can register their account using 'Sign up for free' button in our login page and can able to login to our system with their credentials there after. If they aren't have one or don't want to register, then they can use our 'Quick Demo Login' option to login as a guest user.
        - Onboarding: We gather user financial preferences through this feature. The user who logged in for the first time will go through the sequence of their financial preference steps along with the agreement we made for the user.
        - Dashboard: This feature is the core of our system where user can view their financial details or get answers for their financial queries.
            - Financial overview
            - Portfolio
            - Goals
            - Financial AI agent
2. Backend system
    - Technology:
        - TypeScipt
        - JavaScript
        - Python
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

### Development Scope
We are building our project locally and validating them through local host. Below are the corresponding commands.
- In the root directory of our project, we give this command to install required packages `npm install`
- We run this command to run the front-end system on a configured local host by changing to the frontend directory.
    - Change the directory: `cd frontend`
    - Host the front-end system: `npm start run`
- We run this command to run the back-end system on a configured local host by changing to the backend directory.
    - Change the directory: `cd backend` if our current directory is root directory of our project, otherwise `cd ../frontend`
    - Host the back-end system: `npm run dev`
### Production Scope
Currently, we hosted our project on the production system through versal.
<!-- [TODO] Need to add more details. -->

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