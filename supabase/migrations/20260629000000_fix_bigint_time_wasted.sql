-- Fix time_wasted_ms column type drift between schema.sql and the deployed schema.
--
-- WHY: apps/api/supabase/schema.sql (the reference/documentation file) incorrectly
-- declares time_wasted_ms as INTEGER. The actual deployed migration
-- (20260101000000_core_tables.sql) already uses BIGINT, so this ALTER is a safe
-- no-op on a correctly deployed database. It exists to:
--   1. Correct any environment where the table was created from schema.sql directly
--      (e.g., a staging database seeded from the reference file rather than migrations).
--   2. Document that BIGINT is the canonical type for this column going forward.
--
-- INTEGER max ≈ 2.1 billion ms ≈ 24 days — insufficient for long-running users.
-- BIGINT max ≈ 9.2 quintillion ms — effectively unbounded.

ALTER TABLE public.sessions ALTER COLUMN time_wasted_ms TYPE BIGINT;
ALTER TABLE public.loops    ALTER COLUMN time_wasted_ms TYPE BIGINT;
