-- Core analytics tables for LoopGuard.
-- Privacy invariant: no source code, no file paths, no error messages.
-- Only hashes, counts, timestamps, and file extensions.

/* ── sessions ────────────────────────────────────────────────────────
 * One row per editor session. Upserted periodically (every 5 min)
 * and on extension deactivation (with endedAt).
 */
CREATE TABLE IF NOT EXISTS sessions (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id        TEXT        UNIQUE NOT NULL,
  user_id           UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  started_at        TIMESTAMPTZ NOT NULL,
  ended_at          TIMESTAMPTZ,
  loops_detected    INTEGER     NOT NULL DEFAULT 0,
  time_wasted_ms    BIGINT      NOT NULL DEFAULT 0,
  tokens_saved      INTEGER     NOT NULL DEFAULT 0,
  -- e.g. ['ts', 'py'] — extension only, never full paths
  file_types        TEXT[]      NOT NULL DEFAULT '{}',
  extension_version TEXT        NOT NULL DEFAULT '0.1.0',
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users read own sessions"
  ON sessions FOR SELECT
  USING (auth.uid() = user_id);

-- Service role handles INSERT/UPDATE via API (bypasses RLS)

CREATE INDEX idx_sessions_user_started ON sessions(user_id, started_at DESC);


/* ── loops ───────────────────────────────────────────────────────────
 * One row per detected loop event.
 * error_hash = djb2("uri:line:message") — content is not recoverable.
 */
CREATE TABLE IF NOT EXISTS loops (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id    TEXT        NOT NULL,
  -- Hash of error fingerprint only — no recoverable message content
  error_hash    TEXT        NOT NULL,
  occurrences   INTEGER     NOT NULL DEFAULT 1,
  time_wasted_ms BIGINT     NOT NULL DEFAULT 0,
  -- File extension only (e.g. 'ts', 'py'). Never a full path.
  file_type     TEXT        NOT NULL,
  status        TEXT        NOT NULL DEFAULT 'active'
                              CHECK (status IN ('active', 'resolved', 'ignored')),
  detected_at   TIMESTAMPTZ NOT NULL,
  resolved_at   TIMESTAMPTZ
);

ALTER TABLE loops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users read own loops"
  ON loops FOR SELECT
  USING (auth.uid() = user_id);

-- Service role handles INSERT via API (bypasses RLS)

CREATE INDEX idx_loops_user_detected ON loops(user_id, detected_at DESC);
CREATE INDEX idx_loops_session ON loops(session_id);
