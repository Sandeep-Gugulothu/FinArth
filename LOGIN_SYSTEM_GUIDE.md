# FinArth Login System & Database Access Guide

## 🔐 Login System Status

### ✅ What's Working
- **User Registration**: Users can sign up with email/password
- **User Login**: Authentication with hashed passwords
- **Onboarding Flow**: Complete user profile setup
- **Database Storage**: SQLite database with proper schema
- **API Endpoints**: All CRUD operations for users

### 🔧 Recent Fixes Applied
1. **TypeScript Error**: Fixed `unknown` error type in catch block
2. **API Routes**: Fixed `/all` route to `/` for RESTful design
3. **Database Viewer**: Added web-based and CLI database viewers

## 📊 Database Access Methods

### Method 1: Web-Based Viewer (Recommended)
```
http://localhost:5000/api/db
```
- Real-time data viewing
- Responsive web interface
- Auto-refresh functionality
- Shows users, investments, and objectives

### Method 2: CLI Viewer
```bash
cd backend
npm run db:view
```

### Method 3: Direct SQLite Access
```bash
cd backend
sqlite3 database.sqlite
.tables
SELECT * FROM users;
SELECT * FROM user_investments;
SELECT * FROM user_objectives;
.quit
```

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT,
  country TEXT,
  age INTEGER,
  risk_preference TEXT,
  return_estimate TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  verification_token TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### User Investments Table
```sql
CREATE TABLE user_investments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  investment_type TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id)
);
```

### User Objectives Table
```sql
CREATE TABLE user_objectives (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  objective TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id)
);
```

## 🚀 API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/verify/:token` - Verify email

### User Management
- `POST /api/users/onboarding` - Complete onboarding
- `GET /api/users/:userId` - Get user profile
- `GET /api/users/` - Get all users

### Database Viewer
- `GET /api/db` - Web-based database viewer
- `GET /api/db/users` - Get all users (JSON)
- `GET /api/db/investments` - Get all investments (JSON)
- `GET /api/db/objectives` - Get all objectives (JSON)

## 🧪 Testing the System

### Quick Test Script
```bash
cd backend
npm run test:api
```

### Manual Testing Flow
1. **Start Backend**: `npm run dev` (runs on port 5000)
2. **Start Frontend**: `npm start` (runs on port 3000)
3. **Test Registration**: Go to signup page
4. **Test Login**: Use registered credentials
5. **Test Onboarding**: Complete the multi-step form
6. **View Database**: Visit `http://localhost:5000/api/db`

## 📈 Current Database Status

Based on the latest check:
- **1 User Registered**: sandeepgugulothu.iitg@gmail.com
- **Onboarding Status**: Not completed (name, country, age not set)
- **Investments**: None recorded
- **Objectives**: None recorded

## 🔍 Troubleshooting

### Common Issues & Solutions

1. **"Network error" during login/signup**
   - Check if backend is running on port 5000
   - Verify CORS is enabled
   - Check browser console for detailed errors

2. **Onboarding data not saving**
   - Ensure userId is properly stored in localStorage
   - Check API endpoint URL (should be localhost:5000)
   - Verify database write permissions

3. **Database not accessible**
   - Check if database.sqlite file exists in backend folder
   - Ensure SQLite3 is installed
   - Verify database initialization in database.ts

### Debug Commands
```bash
# Check backend logs
cd backend && npm run dev

# View database content
cd backend && npm run db:view

# Test API endpoints
cd backend && npm run test:api

# Check database file
cd backend && ls -la database.sqlite
```

## 🎯 Next Steps

1. **Complete Onboarding**: Test the full onboarding flow
2. **Add Validation**: Enhance form validation
3. **Error Handling**: Improve error messages
4. **Security**: Add rate limiting and input sanitization
5. **Production**: Set up environment variables and production database

## 📝 Notes

- Database file location: `backend/database.sqlite`
- Backend runs on: `http://localhost:5000`
- Frontend runs on: `http://localhost:3000`
- Database viewer: `http://localhost:5000/api/db`

The login system is fully functional and ready for testing!