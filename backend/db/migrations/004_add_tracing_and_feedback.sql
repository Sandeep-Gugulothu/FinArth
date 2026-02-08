-- Migration: 004_add_tracing_and_feedback
-- Description: Add trace_id and feedback columns to chat_messages

ALTER TABLE chat_messages ADD COLUMN feedback TEXT;
ALTER TABLE chat_messages ADD COLUMN trace_id TEXT;
