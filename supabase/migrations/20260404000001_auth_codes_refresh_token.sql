-- Add refresh_token to auth_codes so the extension can silently refresh expired JWTs.
-- Nullable for backwards compatibility with existing rows (old codes have no refresh token).
ALTER TABLE auth_codes ADD COLUMN IF NOT EXISTS refresh_token TEXT;
