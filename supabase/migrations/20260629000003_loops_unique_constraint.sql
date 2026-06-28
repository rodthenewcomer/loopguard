-- Add a unique constraint on (session_id, error_hash) in the loops table.
--
-- WHY: The API's POST /metrics/loop currently uses INSERT, which creates duplicate
-- rows if the same loop event is submitted more than once (e.g., on retry after a
-- transient network failure, or if the extension fires the event twice due to a
-- race condition). This constraint enables safe upsert:
--   ON CONFLICT (session_id, error_hash) DO UPDATE SET occurrences = EXCLUDED.occurrences
-- Without it, duplicate rows accumulate silently and inflate all aggregate metrics
-- (topErrorHashes, recentLoops, per-session loop counts in the summary endpoint).
--
-- IMPACT ON EXISTING DATA: If duplicates already exist, this migration will fail.
-- Run the dedup query below first in any environment with existing data:
--
--   DELETE FROM public.loops a
--   USING public.loops b
--   WHERE a.created_at > b.created_at
--     AND a.session_id  = b.session_id
--     AND a.error_hash  = b.error_hash;

ALTER TABLE public.loops
  ADD CONSTRAINT loops_session_error_unique
  UNIQUE (session_id, error_hash);
