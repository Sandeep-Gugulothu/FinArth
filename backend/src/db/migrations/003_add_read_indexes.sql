-- Migration: 003_add_read_indexes
-- Description: Add indexes for read performance optimization

-- User lookup indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_session_token ON users(session_token);

-- User relationships indexes
CREATE INDEX IF NOT EXISTS idx_user_investments_user_id ON user_investments(user_id);
CREATE INDEX IF NOT EXISTS idx_user_objectives_user_id ON user_objectives(user_id);

-- Portfolio indexes
CREATE INDEX IF NOT EXISTS idx_portfolio_user_id ON portfolio_holdings(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_category ON portfolio_holdings(category);

-- Chat indexes
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);

-- Goals indexes
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON financial_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_status ON financial_goals(status);
