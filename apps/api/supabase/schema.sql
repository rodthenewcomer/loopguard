-- LoopGuard Supabase Schema
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor → New query)

-- ── sessions ──────────────────────────────────────────────────────
-- One row per VS Code session. Updated periodically while active.
CREATE TABLE IF NOT EXISTS public.sessions (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id        TEXT        NOT NULL UNIQUE,       -- client-generated UUID
  started_at        TIMESTAMPTZ NOT NULL,
  ended_at          TIMESTAMPTZ,                        -- null while session is active
  loops_detected    INTEGER     NOT NULL DEFAULT 0,
  time_wasted_ms    INTEGER     NOT NULL DEFAULT 0,
  tokens_saved      INTEGER     NOT NULL DEFAULT 0,
  file_types        TEXT[]      NOT NULL DEFAULT '{}',  -- ['ts', 'py'] — no paths
  extension_version TEXT        NOT NULL DEFAULT '0.1.0',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON public.sessions (user_id);
CREATE INDEX IF NOT EXISTS sessions_started_at_idx ON public.sessions (started_at DESC);

-- ── loops ──────────────────────────────────────────────────────────
-- One row per loop event. Never stores error messages or code.
CREATE TABLE IF NOT EXISTS public.loops (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id    TEXT        NOT NULL,                  -- references sessions.session_id
  error_hash    TEXT        NOT NULL,                  -- djb2 hash — no recoverable content
  occurrences   INTEGER     NOT NULL DEFAULT 1,
  time_wasted_ms INTEGER    NOT NULL DEFAULT 0,
  file_type     TEXT        NOT NULL DEFAULT '',       -- 'ts', 'py' etc — no path
  status        TEXT        NOT NULL DEFAULT 'active'
                            CHECK (status IN ('active', 'resolved', 'ignored')),
  detected_at   TIMESTAMPTZ NOT NULL,
  resolved_at   TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS loops_user_id_idx ON public.loops (user_id);
CREATE INDEX IF NOT EXISTS loops_session_id_idx ON public.loops (session_id);
CREATE INDEX IF NOT EXISTS loops_detected_at_idx ON public.loops (detected_at DESC);

-- ── Row-Level Security ─────────────────────────────────────────────
-- Users can only see and write their own data.
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loops    ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "sessions_owner_all" ON public.sessions;
CREATE POLICY "sessions_owner_all" ON public.sessions
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "loops_owner_all" ON public.loops;
CREATE POLICY "loops_owner_all" ON public.loops
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Service-role bypass (API server uses service key — it skips RLS automatically)

-- ── Helpful views ───────────────────────────────────────────────────
-- Weekly summary per user — powers the dashboard GET /summary endpoint
CREATE OR REPLACE VIEW public.user_weekly_summary AS
SELECT
  user_id,
  DATE_TRUNC('day', started_at) AS day,
  SUM(loops_detected)           AS daily_loops,
  SUM(time_wasted_ms)           AS daily_time_wasted_ms,
  SUM(tokens_saved)             AS daily_tokens_saved
FROM public.sessions
WHERE started_at > NOW() - INTERVAL '30 days'
GROUP BY user_id, DATE_TRUNC('day', started_at)
ORDER BY user_id, day DESC;

-- ── Environment notes ───────────────────────────────────────────────
-- Required env vars for the API server:
--   SUPABASE_URL              = https://<project>.supabase.co
--   SUPABASE_SERVICE_ROLE_KEY = eyJ...  (from Supabase Project Settings → API)
--
-- The service role key is used server-side only. Never expose it to clients.
-- Client-side requests use the anon key + user JWT from Supabase Auth.
