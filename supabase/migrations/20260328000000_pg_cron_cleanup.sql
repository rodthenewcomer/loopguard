-- pg_cron scheduled cleanup jobs.
--
-- PREREQUISITE: Enable pg_cron in Supabase Dashboard first:
--   Database → Extensions → search "pg_cron" → Enable
--
-- After enabling, this migration installs 3 cleanup schedules.
-- If the extension is not yet enabled, this migration is a no-op
-- (the DO block checks before attempting to schedule).
--
-- View scheduled jobs: SELECT * FROM cron.job;
-- View run history:    SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 50;

DO $$
BEGIN
  -- Only schedule if pg_cron is available on this instance.
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN

    -- 1. auth_codes: delete used/expired rows every hour.
    --    Codes have a 5-min TTL; cleaning hourly keeps the table near-empty.
    PERFORM cron.schedule(
      'cleanup-auth-codes',
      '0 * * * *',
      $q$
        DELETE FROM auth_codes
        WHERE used_at IS NOT NULL
           OR expires_at < NOW() - INTERVAL '1 hour';
      $q$
    );

    -- 2. loops: delete old resolved/ignored loops every Sunday at 02:00 UTC.
    PERFORM cron.schedule(
      'cleanup-old-loops',
      '0 2 * * 0',
      $q$
        DELETE FROM loops
        WHERE status IN ('resolved', 'ignored')
          AND detected_at < NOW() - INTERVAL '90 days';
      $q$
    );

    -- 3. sessions: delete ended sessions older than 90 days every Sunday 02:30 UTC.
    PERFORM cron.schedule(
      'cleanup-old-sessions',
      '30 2 * * 0',
      $q$
        DELETE FROM sessions
        WHERE ended_at IS NOT NULL
          AND ended_at < NOW() - INTERVAL '90 days';
      $q$
    );

    RAISE NOTICE 'pg_cron: 3 cleanup schedules installed.';
  ELSE
    RAISE NOTICE 'pg_cron not enabled — skipping schedule setup. Enable at: Database → Extensions → pg_cron';
  END IF;
END;
$$;
