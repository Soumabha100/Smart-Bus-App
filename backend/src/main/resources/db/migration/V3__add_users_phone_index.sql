-- V3__add_users_phone_index.sql
-- Index users table phone column for fast OTP and phone login lookups

CREATE INDEX IF NOT EXISTS idx_users_phone ON users (phone);
