-- Funnel analytics table for tracking the 5 key activation milestones.
--
-- WHY: Without funnel event tracking, it is impossible to measure:
--   - What % of installs trigger first loop detection (activation rate)
--   - What % of active users copy context (engagement rate)
--   - What % sign in (conversion to authenticated user)
--   - What % open the dashboard (feature discovery)
-- These 5 events are the minimum needed to calculate install-to-activation
-- and activation-to-retention funnels.
--
-- PRIVACY: No source code, file paths, or error messages are stored here.
-- Properties are limited to metadata (extension_version, engine_tier, etc.).
--
-- ACCESS: Service role writes only. No RLS SELECT policy — this is aggregate
-- analytics data read exclusively by server-side reporting queries, never
-- surfaced directly to end users.

CREATE TABLE IF NOT EXISTS public.funnel_events (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Nullable: anonymous events fire before the user signs in.
  user_id     UUID        REFERENCES auth.users(id) ON DELETE CASCADE,
  -- Device identifier for correlating pre-sign-in and post-sign-in events.
  device_id   TEXT,
  event_name  TEXT        NOT NULL
              CHECK (event_name IN (
                'extension_activated',
                'first_loop_detected',
                'context_copied',
                'signed_in',
                'dashboard_viewed'
              )),
  -- Optional metadata: { extension_version, engine_tier, sensitivity, ... }
  -- Never contains source code, file paths, or error messages.
  properties  JSONB       NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for funnel step queries: COUNT(*) WHERE event_name = 'extension_activated'
CREATE INDEX IF NOT EXISTS funnel_events_event_name_idx
  ON public.funnel_events (event_name);

-- Index for time-windowed queries: WHERE created_at > NOW() - INTERVAL '30 days'
CREATE INDEX IF NOT EXISTS funnel_events_created_at_idx
  ON public.funnel_events (created_at DESC);

-- Index for per-user funnel queries (partial — skips anonymous rows)
CREATE INDEX IF NOT EXISTS funnel_events_user_id_idx
  ON public.funnel_events (user_id)
  WHERE user_id IS NOT NULL;
