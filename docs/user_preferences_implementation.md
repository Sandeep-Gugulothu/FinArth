# User Preferences Management Implementation

## Requirements Implemented

### 1. Guest User Name Consideration
- **Onboarding Flow**: Name captured in step 3 of onboarding process
- **Session Storage**: Name stored in session cache for active financial sessions
- **Database Persistence**: Name saved to `users.name` field

### 2. User Preferences Storage
**SQLite Database Tables:**
- `users`: Core user data (name, country, age, risk_preference, return_estimate)
- `user_investments`: Investment types/securities preferences
- `user_objectives`: Financial objectives/goals

**Session Cache:**
- In-memory cache for active sessions
- Faster access than database queries
- Auto-populated on login and onboarding completion

### 3. Preference Retrieval Logic
**Priority Order:**
1. **First Login**: Check session cache first
2. **Returning Users**: Load from database, then cache
3. **API Endpoint**: `/api/users/:userId/preferences`

### 4. Database Backup System
**Features:**
- **Primary DB**: `database.sqlite`
- **Backup DB**: `database_backup.sqlite`
- **Auto-sync**: Every 5 minutes
- **Manual sync**: On onboarding completion

## Key Components

### Backend Files Created/Modified:
```
backend/src/
├── utils/
│   ├── sessionCache.ts     # Session management
│   └── auth.ts            # Password hashing utilities
├── routes/
│   ├── users.ts           # Enhanced with cache logic
│   └── agent.ts           # Updated for user context
├── database.ts            # Backup functionality added
└── utils/reactAgent.ts    # User preferences integration
```

### Database Schema Updates:
```sql
-- Added fields to users table
ALTER TABLE users ADD COLUMN is_first_login BOOLEAN DEFAULT TRUE;
ALTER TABLE users ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP;
```

### API Endpoints:
- `GET /api/users/:userId/preferences` - Get user preferences (cache-first)
- `POST /api/users/onboarding` - Save preferences to cache + DB
- `POST /api/agent/generate-insight` - ReAct agent with user context

## Usage Flow

### 1. Guest Registration & Onboarding:
```typescript
// Onboarding captures:
const userData = {
  name: userName, // From onboarding input
  country: "India", 
  age: 30,
  riskPreference: "moderate",
  familiarInvestments: ["Mutual Funds", "Stocks"],
  selectedOptions: ["strategy", "returns"]
};
```

### 2. Session Cache Management:
```typescript
// First login - uses cache
sessionCache.set(userId, userData);

// Subsequent logins - loads from DB to cache
const preferences = sessionCache.get(userId);
```

### 3. LLM Integration:
```typescript
// ReAct agent receives user context
const userContext = `
User Context:
- Name: ${prefs.name}
- Country: ${prefs.country}
- Risk Preference: ${prefs.riskPreference}
- Familiar Investments: ${prefs.familiarInvestments.join(', ')}
`;
```

## Backup & Sync

### Automatic Backup:
- **Frequency**: Every 5 minutes
- **Trigger**: Auto-sync on server start
- **Manual**: On onboarding completion

### File Structure:
```
backend/
├── database.sqlite         # Primary database
├── database_backup.sqlite  # Backup database
```

## Benefits

1. **Performance**: Cache-first approach reduces DB queries
2. **Reliability**: Automatic backup prevents data loss
3. **Personalization**: LLM receives user context for better responses
4. **Scalability**: Session cache handles multiple concurrent users
5. **Data Integrity**: Sync operations ensure consistency

## Setup Instructions

1. **Install Dependencies**: Already included in existing setup
2. **Database Migration**: Auto-creates new fields on startup
3. **Environment**: No additional env vars needed
4. **Testing**: Use existing onboarding flow

The implementation is minimal, efficient, and addresses all requirements while maintaining data integrity and performance.