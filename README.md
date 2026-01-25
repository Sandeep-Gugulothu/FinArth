# FinArth - AI Financial Confidence Builder

> Transform financial anxiety into actionable confidence through personalized investment guidance

## 🎯 **What FinArth Does**

Input your financial goal → Get personalized, AI-validated investment recommendations

**Example Flow:**
- **Input:** "I have ₹8 lakhs, want ₹50 lakhs for house in 7 years"
- **AI Analysis:** Calculates 20% required returns, assigns "Frontier" personality
- **Output:** Specific investment plan with asset allocations and clear explanations

## 🚀 **Quick Start**

```bash
# 1. Clone repository
git clone <repo>
cd FinArth

# 2. Install dependencies
npm install

# 3. Start all services
npm run dev

# Services will run on:
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
# AI Services: http://localhost:8001
```

### **Manual Setup (Alternative)**
```bash
# Backend (Terminal 1)
cd backend
npm install
npm run dev

# Frontend (Terminal 2)
cd frontend
npm install
npm start

# AI Services (Terminal 3)
cd ai-services
pip install -r requirements.txt
python main.py
```

## 📁 **Project Structure**

```
FinArth/
├── frontend/          # React + TypeScript UI
├── backend/           # Node.js + TypeScript API
├── ai-services/       # Python AI/ML services
├── data/             # JSON data files
└── tests/            # Test files
```

## 🎭 **Three Investment Personalities**

- **🛡️ Guardian:** Conservative, 7-10% returns (bonds, FDs, blue-chip stocks)
- **⚖️ Strategist:** Balanced, 10-15% returns (mixed portfolio)
- **🚀 Frontier:** Aggressive, 15%+ returns (growth stocks, international funds)

## 🔧 **Tech Stack**

- **Frontend:** React + TypeScript + Tailwind CSS
- **Backend:** Node.js + Express + TypeScript
- **AI Services:** Python + FastAPI + OpenAI + Opik
- **Data:** JSON files (PostgreSQL ready for production)

## 📊 **API Endpoints**

```javascript
// Generate Financial Plan
POST /api/plans/generate
{
  "current": 800000,
  "target": 5000000,
  "years": 7,
  "riskTolerance": "medium"
}

// AI Validation
POST /ai/validate-plan
{
  "personality": "frontier",
  "requiredReturn": 0.20,
  "recommendations": [...]
}
```

## 🧪 **Testing**

```bash
npm run test           # Run all tests
npm run test:frontend  # Frontend tests only
npm run test:backend   # Backend tests only
```

## 🚀 **Deployment**

```bash
# Build for production
npm run build

# Deploy frontend to Vercel/Netlify
# Deploy backend to Railway/Render
```

## 🎯 **Development Roadmap**

### **Phase 1 (Current): MVP**
- ✅ Core financial calculations
- ✅ Three personality types
- ✅ Basic React frontend
- ✅ Express API backend

### **Phase 2: AI Integration**
- 🔄 OpenAI integration for explanations
- 🔄 Opik validation for compliance
- 🔄 Enhanced recommendations

### **Phase 3: Production Ready**
- ⏳ User authentication
- ⏳ Database integration
- ⏳ Advanced monitoring
- ⏳ Cloud deployment

## 🔐 **Environment Variables**

Copy `.env.example` to `.env` and configure:

```bash
# Backend
PORT=8000
NODE_ENV=development

# AI Services
OPENAI_API_KEY=your-openai-key
OPIK_API_KEY=your-opik-key

# Frontend
REACT_APP_API_URL=http://localhost:8000
```

## 🤝 **Contributing**

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 **License**

MIT License - see [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for financial empowerment**