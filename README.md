<div align="center">

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                                   FINARTH                                    ║
║                          AI-POWERED FINANCE ADVISOR                          ║
╚══════════════════════════════════════════════════════════════════════════════╝
```
# F I N A R T H
## 『 GET FINANCIAL ADVICE AS PER YOUR PREFERENCE(S) 』

</div>

## Introduction

FinArth is an AI-powered financial planning platform that converts life goals into safe, automated, and understandable financial action. It helps users move from financial uncertainty to confident investment decisions through personalized guidance and transparent recommendations.

## Features

- **AI-Powered Financial Planning**: Intelligent analysis and personalized investment recommendations
- **Goal-Based Planning**: Convert specific life goals into actionable financial plans
- **Personalized Math**: Exact calculations based on individual financial situations
- **Clear Action Steps**: Specific investment allocations with transparent explanations
- **Modern UI**: Responsive React frontend with animated components and dark theme
<!-- [TODO] can specify safety and compliance data as additional feature based on project validation -->

## Architecture

![High_Level_Design_1](./images/system_design/FinArth_design_1.jpg)

Initially, FinArth followed traditional three-tier architecture and based on the project progress it is growing towards modular monolith architecture and it can migrate to a microservices architecture in future based on project's budget, bandwidth, scope, and maintenance.

### Components

The three main components of the three-tier architecture:

1. Frontend system
    - Technology
        - HTML: We used HTML to render our web-page by embedding executable code.
        - CSS: We used Cascading Style Sheet to style our webpage.
        - TypeScript: We are using TypeScript to make our webpage actionable.
    - Features:
        - Home page: This is our landing page. The user will see our project's home page after running our site. We are hosting it through pages typescript. In this page you may find our feature offerings and work procedure.
        - Login: The user can register their account using 'Sign up for free' button in our login page and can able to login to our system with their credentials there after. If they aren't have one or don't want to register, then they can use our 'Quick Demo Login' option to login as a guest user.
        - Onboarding: We gather user financial preferences through this feature. The user who logged in for the first time will go through the sequence of their financial preference steps along with the agreement we made for the user.
        - Dashboard: This feature is the core of our system where user can view their financial details or get answers for their financial queries.
            - Financial overview
            - Portfolio
            - Goals
            - Financial AI agent
2. Backend system
    - Technology
        - Python: We used Python for our backend functionality.
3. Storage system
    - Technology
        - Sqlite: We used sqlite to store user and their financial preference data.

<!-- [TODO] The project can have Frontend section with sub-sections such as
     Features, Styling, and Responsive-->
<!-- [TODO] The project can have Backend section with sub-sections such as
      Features, Routes, and Environment-->
<!-- [TODO] The project can have AI Services section with sub-sections such as
      Features, Dependencies, and Monitoring-->

## Project Structure

We can find the project structure [here](./docs/project_structure.md).

## Build

### Production Scope
Currently, we hosted our frontend system of our project on the production system through versal. We can access it through this (link)[https://fin-arth-frontend.vercel.app].

## Testing
<!-- [TODO] Define test commands -->

## Configuration

### Environment Variables
<!-- [TODO] Create / define environment configuration -->

## UI Components
<!-- [TODO] UI Component description -->

## Dependencies
<!-- [TODO] Frontend dependency description -->
<!-- [TODO] Backend dependency description -->
<!-- [TODO] AI service dependency description -->

## Important Disclaimers
<!-- [TODO] Important notes to people who visit this repository -->

---