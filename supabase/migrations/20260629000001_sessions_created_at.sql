-- Add created_at to the sessions table.
--
-- WHY: apps/api/supabase/schema.sql specifies a created_at column on sessions,
-- but the initial migration (20260101000000_core_tables.sql) only included
-- updated_at. This column is needed for:
--   - Data retention queries (DELETE WHERE created_at < NOW() - INTERVAL '90 days')
--   - Distinguishing insertion time from last-update time (sessions upsert periodically,
--     so updated_at changes on every sync; created_at records when the session started).
--
-- Existing rows get NOW() as the default, which is slightly inaccurate for historical
-- sessions but acceptable — we never had the column before, so no correct value exists.

ALTER TABLE public.sessions
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
