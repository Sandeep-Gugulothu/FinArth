#!/bin/bash

echo "🚀 Deploying FinArth Backend to Vercel..."

# Navigate to backend directory
cd backend

# Deploy to Vercel
vercel --prod

echo "✅ Backend deployment complete!"
echo ""
echo "📝 Next steps:"
echo "1. Copy the deployment URL from above"
echo "2. Update frontend/.env.production with: REACT_APP_API_URL=<your-backend-url>"
echo "3. Update backend/src/app.py CORS origins with your frontend URL"
echo "4. Redeploy frontend: cd ../frontend && npm run build && vercel --prod"