-- One-time auth codes for IDE extension callback.
-- The extension receives a short-lived code, not a raw JWT.
-- Codes expire in 5 minutes and can only be redeemed once.

CREATE TABLE IF NOT EXISTS auth_codes (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  code       TEXT        UNIQUE NOT NULL,
  user_id    UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  jwt        TEXT        NOT NULL,
  email      TEXT        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  used_at    TIMESTAMPTZ
);

-- Service role only — no public access
ALTER TABLE auth_codes ENABLE ROW LEVEL SECURITY;

-- GC index: lets a cron or DELETE WHERE expires_at < NOW() run efficiently
CREATE INDEX idx_auth_codes_expires_at ON auth_codes(expires_at);
