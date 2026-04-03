-- Device stats table for anonymous loopguard-ctx CLI users.
-- No auth required — identified by a device UUID stored locally.
-- Privacy invariant: no source code, no file paths, no error messages.

CREATE TABLE IF NOT EXISTS device_stats (
  device_id           TEXT        PRIMARY KEY,  -- UUID from ~/.loopguard-ctx/device.json
  first_seen          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_synced         TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Aggregate token stats from loopguard-ctx
  total_tokens_original   BIGINT  NOT NULL DEFAULT 0,
  total_tokens_compressed BIGINT  NOT NULL DEFAULT 0,
  total_tokens_saved      BIGINT  NOT NULL DEFAULT 0,
  total_commands          INTEGER NOT NULL DEFAULT 0,
  total_sessions          INTEGER NOT NULL DEFAULT 0,

  -- Daily breakdown (last 30 days) for charts
  -- [{ date: "2026-04-03", tokens_saved: 12400, commands: 48 }]
  daily_breakdown     JSONB   NOT NULL DEFAULT '[]',

  -- Optional: user links their account to this device after sign-in
  user_id             UUID    REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX idx_device_stats_user ON device_stats(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_device_stats_synced ON device_stats(last_synced DESC);

-- RLS: devices are public-write (no auth), own-read only via API
ALTER TABLE device_stats ENABLE ROW LEVEL SECURITY;

-- Service role handles all writes via API (bypasses RLS)
-- No direct client reads — all reads go through the API

-- Deny all direct client access — all reads/writes go through the API (service role)
CREATE POLICY "deny_all_direct_access" ON device_stats
  AS RESTRICTIVE
  FOR ALL
  USING (false);
