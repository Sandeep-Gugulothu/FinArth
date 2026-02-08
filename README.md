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

![High_Level_Design_1](./artifacts/system_design/FinArth_design_1.jpg)

Initially, FinArth followed traditional three-tier architecture and based on the project progress it is growing towards modular monolith architecture and it can migrate to a microservices architecture in future based on project's budget, bandwidth, scope, and maintenance.

![Architecture_HLD](./artifacts/system_design/FinArth_3_tier_architecture.png)

### Components

The three main components of the three-tier architecture:

1. Frontend system
2. Backend system
3. Storage system

#### Technology Matrix

<table>
    <tr>
        <th>System</th>
        <th>Technology</th>
        <th>Purpose</th>
    </tr>
    <tr>
        <td rowspan="3"><strong>Frontend System</strong></td>
        <td>HTML</td>
        <td>We used HTML to render our web-page by embedding executable code.</td>
    </tr>
    <tr>
        <td>CSS</td>
        <td>We used Cascading Style Sheet to style our webpage.</td>
    </tr>
    <tr>
        <td>TypeScript</td>
        <td>We are using TypeScript to make our webpage actionable.</td>
    </tr>
    <tr>
        <td><strong>Backend System</strong></td>
        <td>Python</td>
        <td>We used Python programming to code our business logic.</td>
    </tr>
    <tr>
        <td><strong>Storage System</strong></td>
        <td>Sqlite</td>
        <td>We used sqlite to store user and their financial preference data.</td>
    </tr>
</table>


#### Feature Matrix

<table>
    <tr>
        <th colspan="2">Feature</th>
        <th>Description</th>
    </tr>
    <tr>
        <td colspan="2">Home page</td>
        <td>We used HTML to render our web-page by embedding executable code.</td>
    </tr>
    <tr>
        <td rowspan="2"><strong>Login</strong></td>
        <td>Sign-up</td>
        <td>User registration / Sign-up where user is allowed to register to our system.</td>
    </tr>
    <tr>
        <td>Log-in</td>
        <td>User login interface where user is allowed to login to our system.</td>
    </tr>
    <tr>
        <td rowspan="8"><strong>Onboarding</strong></td>
        <td>Agreement</td>
        <td>The agreement focuses on the risks, limitations, and other terms & conditions.</td>
    </tr>
    <tr>
        <td>Name</td>
        <td>User Name</td>
    </tr>
    <tr>
        <td>Country Name</td>
        <td>User's Country Name</td>
    </tr>
    <tr>
        <td>Age</td>
        <td>User's Age</td>
    </tr>
    <tr>
        <td>Risk Preference</td>
        <td>We seek user to select their risk preference from one of the categories- conservative or moderate or aggressive</td>
    </tr>
    <tr>
        <td>Investment Recommendation Preference</td>
        <td>We allow user to make their choice of investment preference through categories - fixed deposits, mutual funds, stocks, bonds, real estates, gold, crypto, and ppf/epf.</td>
    </tr>
    <tr>
        <td>Return estimate expectation</td>
        <td>We allow user to make their choice of return estimate preference through 3 different categories.</td>
    </tr>
    <tr>
        <td>Financial Objectives</td>
        <td>We allow user to make their choice of financial preference through 8 or more different categories.</td>
    </tr>
    <tr>
        <td rowspan="4"><strong>Dashboard</strong></td>
        <td>Financial overview.</td>
        <td>User can monitor their financial progress and portfolio performance.</td>
    </tr>
    <tr>
        <td>Portfolio.</td>
        <td>User can track their investments with real-time insights.</td>
    </tr>
    <tr>
        <td>Goals.</td>
        <td>User can view their financial goals.</td>
    </tr>
    <tr>
        <td>AI Agent.</td>
        <td>User can get their financial advice as per their preference and chat history.</td>
    </tr>
</table>

## Web Interface

### Home page
![WebDesign_home_page](./artifacts/web_interface/homepage.mp4)

### Onboard page
![WebDesign_onboard_page](./artifacts/web_interface/preferences.mp4)

### Dashboard page
![WebDesign_dashboard_page](./artifacts/web_interface/dashboard.mp4)

## Project Structure

```
FinArth
├── backend/             # back-end & storage system functionality
│   ├── scripts/         # stand-alone scripts to experiment the opik functionality
│   ├── src/             # FinArth business logic lies here along with storage system.
│   ├── tests/           # test-cases using pytest framework.
│   └── vercel.json      # backend Python deployment
├── CHANGELOG.md         # version log maintenance
├── deploy-backend.sh    # vercel supporting file
├── docs                 # project technical documentation
├── frontend             # front-end system functionality
│   ├── package.json     # monorepo structure with frontend/backend workspaces
│   ├── postcss.config.js   # CSS processing with Tailwind CSS and Autoprefixer plugins
│   ├── public/          # public hosting attributes.
│   ├── src/             # Frontend source code folder
│   ├── tailwind.config.js  # defining design systems like fonts, colors, animations
│   └── vercel.json      # frontend python deployment
├── market_cache.json    # run time cache file to store CoinGecko API responses.
├── package-lock.json    # an auto generated file to ensure consistent dependency versions across installations
├── package.json         # Workspace configuration.
├── pytest.ini           # definition of Python test discovery paths.
└── README.md            # Project detail document.
└── venv                 # virtual environment setup to support back-end
                         # system launch
```

We can find the detailed project structure [here](./docs/project_structure.md).

## Build

### Production Scope
Currently, we hosted our frontend system of our project on the production system through versal. We can access it through this [link](https://fin-arth-frontend.vercel.app).

## Dependencies

- Opik: Logging, debugging, and analysis of AI agent user conversation
- GitHub: Code host
- Vercel: Deployment host

## Important Disclaimers

We are not financial advisors. This platform is for educational purposes only. Please do your own research (DYOR) and consult with qualified financial professionals before making investment decisions.

---