<div align="center">

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                                   FINARTH                                    ║
║                          AI-POWERED FINANCE ADVISOR                          ║
╚══════════════════════════════════════════════════════════════════════════════╝
```
# F I N A R T H
## 『 FINANCIAL CONFIDENCE ENGINE FOR THE MODERN INVESTOR 』

**[WEB DASHBOARD](https://fin-arth-frontend.vercel.app)** • **[DEMO VIDEO](#)** • **[TECHNICAL DOCUMENTATION](./docs/)**

</div>

## Introduction

FinArth is an AI-powered financial planning platform that converts life goals into safe, automated, and understandable financial action. It helps users move from financial uncertainty to confident investment decisions through personalized guidance and transparent recommendations.

## Features

- **AI-Powered Financial Planning**: Intelligent analysis and personalized investment recommendations
- **Goal-Based Planning**: Convert specific life goals into actionable financial plans
- **Personalized Math**: Exact calculations based on individual financial situations
- **Clear Action Steps**: Specific investment allocations with transparent explanations
- **Modern UI**: Responsive React frontend with animated components and dark theme

## Architecture

![High_Level_Design_1](./images/system_design/FinArth_design_1.jpg)

![Architecture_HLD](./images/system_design/FinArth_3_tier_architecture.png)

Initially, FinArth followed traditional three-tier architecture and based on the project progress it is growing towards modular monolith architecture and it can migrate to a microservices architecture in future based on project's budget, bandwidth, scope, and maintenance.

### Components

The three main components of the three-tier architecture:

1. Frontend system
    - Technology
        - HTML: We used HTML to render our web-page by embedding executable code.
        - CSS: We used Cascading Style Sheet to style our webpage.
        - TypeScript: We are using TypeScript to make our webpage actionable.
    - Features:
        - Home page: This is our landing page. In this page you may find our feature offerings and work procedure.
        - Login:
            - The user can register their account using 'Sign up for free' button in our login page.
            - The user can able to login to our system with their credentials there after.
            - If the user wants to login as a guest, then we have 'Quick Demo Login' option.
        - Onboarding: We gather user's financial preferences through this feature.
            - The user who logged in to our system for the first time, can go through a sequence of steps. These steps are intended to collect their financial preferences.
                - Agreement
                - Name
                - Country Name
                - Age
                - Risk Preference
                - Investment Preference
                - Return estimate expectation
                - Financial Objectives
        - Dashboard: This feature is the core of our system where user can view their financial details or get answers for their financial queries.
            - Financial overview
            - Portfolio
            - Goals
            - Financial AI agent
2. Backend system
    - Technology
        - Python: We used Python programming to code our business logic.
    - Features:
        - Authentication: This module facilitates user authentication functionality.
        - Session: User session management.
        - Dashboard: We are supporting the functionalities below.
            - Financial overview
            - Portfolio
            - Goals
            - Financial AI agent
        - Logger: This module can be used to log system and user level information.
3. Storage system
    - Technology
        - Sqlite: We used sqlite to store user and their financial preference data.
    - Features:
        - User Credentials: We store user credentials in our storage system for authentication & display purposes.
        - Financial Preferences: We store user's financial preferences for a better financial advice.

## Web Interface

![WebDesign1](./images/system_design/FinArth_design-Page-1.png)

![WebDesign2](./images/system_design/FinArth_design_2-Page.png)

## Project Structure

We can find the project structure [here](./docs/project_structure.md).

## Build

### Production Scope
Currently, we hosted our frontend system of our project on the production system through versal. We can access it through this (link)[https://fin-arth-frontend.vercel.app].

## Dependencies

- Opik: Logging, debugging, and analysis of AI agent user conversation
- GitHub: Code host
- Vercel: Deployment host


## Important Disclaimers

We are not financial advisors. This platform is for educational purposes only. Please do your own research (DYOR) and consult with qualified financial professionals before making investment decisions.

---