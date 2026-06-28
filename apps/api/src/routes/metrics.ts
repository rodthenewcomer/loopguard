import { Router } from 'express';
import { z } from 'zod';
import { createHmac, timingSafeEqual } from 'crypto';
import { supabase } from '../lib/supabase';
import { logger } from '../lib/logger';
import { requireAuth, type AuthRequest } from '../middleware/auth';
import type { Request, Response } from 'express';

const router = Router();

/* ── Validation schemas ─────────────────────────────────────────────
 * Privacy rule: no source code, no file paths, no error messages.
 * Only hashes, counts, and anonymized file extensions.
 */

const SessionSchema = z.object({
  sessionId: z.string().min(1).max(64),
  startedAt: z.number().int().positive(),
  endedAt: z.number().int().positive().optional(),
  loopsDetected: z.number().int().min(0).max(10_000),
  timeWastedMs: z.number().int().min(0),
  tokensSaved: z.number().int().min(0),
  // File extensions only — e.g. ['ts', 'py']. No paths.
  fileTypes: z.array(z.string().regex(/^[a-z0-9]{1,10}$/)).max(20),
  extensionVersion: z.string().max(20).optional(),
});

const LoopSchema = z.object({
  sessionId: z.string().min(1).max(64),
  // djb2 hash of "uri:line:message" — no recoverable content
  errorHash: z.string().min(1).max(64),
  occurrences: z.number().int().min(1).max(1000),
  timeWastedMs: z.number().int().min(0),
  // File extension only — e.g. 'ts'. No path.
  fileType: z.string().regex(/^[a-z0-9]{1,10}$/),
  detectedAt: z.number().int().positive(),
  resolvedAt: z.number().int().positive().nullable().optional(),
  status: z.enum(['active', 'resolved', 'ignored']),
});

const FunnelEventSchema = z.object({
  eventName: z.enum([
    'extension_activated',
    'first_loop_detected',
    'context_copied',
    'signed_in',
    'dashboard_viewed',
  ]),
  deviceId: z.string().uuid().optional(),
  properties: z.record(z.unknown()).optional(),
});

const DeviceSyncSchema = z.object({
  device_id: z.string().uuid(),
  total_tokens_original: z.number().int().min(0),
  total_tokens_compressed: z.number().int().min(0),
  total_tokens_saved: z.number().int().min(0),
  total_commands: z.number().int().min(0),
  total_sessions: z.number().int().min(0),
  daily_breakdown: z
    .array(
      z.object({
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        tokens_saved: z.number().int().min(0),
        commands: z.number().int().min(0),
      }),
    )
    .max(30),
});

/* ── HMAC device auth ───────────────────────────────────────────────
 * Device endpoints use HMAC-SHA256 signing instead of JWT.
 * If DEVICE_HMAC_SECRET is not set, allows through with a warning
 * for backward compatibility with existing CLI users.
 */
function verifyDeviceHmac(deviceId: string, req: Request): boolean {
  const secret = process.env['DEVICE_HMAC_SECRET'];
  if (!secret) {
    logger.warn('DEVICE_HMAC_SECRET not set — device endpoint is unauthenticated');
    return true;
  }
  const sig = req.headers['x-device-signature'];
  const ts = req.headers['x-timestamp'];
  if (typeof sig !== 'string' || typeof ts !== 'string') return false;
  const tsMs = Number(ts) * 1000;
  if (isNaN(tsMs) || Math.abs(Date.now() - tsMs) > 5 * 60 * 1000) return false;
  const expected = createHmac('sha256', secret)
    .update(`${deviceId}:${ts}`)
    .digest('hex');
  const providedBuf = Buffer.from(sig, 'hex');
  const expectedBuf = Buffer.from(expected, 'hex');
  if (providedBuf.length !== expectedBuf.length) return false;
  return timingSafeEqual(providedBuf, expectedBuf);
}

/* ── POST /session ──────────────────────────────────────────────────
 * Called by extension:
 *   - On session start (minimal payload)
 *   - Periodically every 5 minutes (updated totals)
 *   - On deactivate (final payload with endedAt)
 */
router.post('/session', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const parsed = SessionSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid payload', details: parsed.error.flatten() });
    return;
  }

  const d = parsed.data;
  const { data: row, error } = await supabase
    .from('sessions')
    .upsert(
      {
        session_id: d.sessionId,
        user_id: req.userId,
        started_at: new Date(d.startedAt).toISOString(),
        ended_at: d.endedAt !== undefined ? new Date(d.endedAt).toISOString() : null,
        loops_detected: d.loopsDetected,
        time_wasted_ms: d.timeWastedMs,
        tokens_saved: d.tokensSaved,
        file_types: d.fileTypes,
        extension_version: d.extensionVersion ?? 'unknown',
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'session_id' },
    )
    .select('id')
    .single();

  if (error !== null) {
    logger.error({ err: error.message }, '[metrics/session] Supabase error');
    res.status(500).json({ error: 'Failed to save session' });
    return;
  }

  res.json({ ok: true, id: row?.id ?? null });
});

/* ── POST /loop ─────────────────────────────────────────────────────
 * Called whenever a loop is detected or its status changes.
 * Upserts on (session_id, error_hash) to prevent duplicates on retry.
 */
router.post('/loop', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const parsed = LoopSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid payload', details: parsed.error.flatten() });
    return;
  }

  const d = parsed.data;
  const { data: row, error } = await supabase
    .from('loops')
    .upsert(
      {
        user_id: req.userId,
        session_id: d.sessionId,
        error_hash: d.errorHash,
        occurrences: d.occurrences,
        time_wasted_ms: d.timeWastedMs,
        file_type: d.fileType,
        status: d.status,
        detected_at: new Date(d.detectedAt).toISOString(),
        resolved_at:
          d.resolvedAt !== undefined && d.resolvedAt !== null
            ? new Date(d.resolvedAt).toISOString()
            : null,
      },
      { onConflict: 'session_id,error_hash' },
    )
    .select('id')
    .single();

  if (error !== null) {
    logger.error({ err: error.message }, '[metrics/loop] Supabase error');
    res.status(500).json({ error: 'Failed to save loop' });
    return;
  }

  res.json({ ok: true, id: row?.id ?? null });
});

/* ── GET /summary ───────────────────────────────────────────────────
 * Returns aggregated metrics for the dashboard.
 * Used by the web dashboard and extension webview.
 */
router.get('/summary', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const days = Math.min(Number(req.query['days'] ?? 7), 30);
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  const todayStart = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();

  const [sessionsResult, loopsResult, todayResult, allTimeResult, topHashesResult] =
    await Promise.all([
      supabase
        .from('sessions')
        .select('loops_detected, time_wasted_ms, tokens_saved, started_at')
        .eq('user_id', req.userId)
        .gte('started_at', since)
        .order('started_at', { ascending: true }),

      supabase
        .from('loops')
        .select('id, error_hash, occurrences, time_wasted_ms, file_type, status, detected_at')
        .eq('user_id', req.userId)
        .gte('detected_at', since)
        .order('detected_at', { ascending: false })
        .limit(50),

      supabase
        .from('sessions')
        .select('loops_detected, time_wasted_ms, tokens_saved')
        .eq('user_id', req.userId)
        .gte('started_at', todayStart),

      supabase
        .from('sessions')
        .select('loops_detected, time_wasted_ms, tokens_saved')
        .eq('user_id', req.userId),

      // Separate lightweight query for top error hashes
      supabase
        .from('loops')
        .select('error_hash')
        .eq('user_id', req.userId)
        .gte('detected_at', since),
    ]);

  // Aggregate week totals
  const sessions = sessionsResult.data ?? [];
  const thisWeek = sessions.reduce(
    (acc, s) => ({
      loops: acc.loops + (s.loops_detected as number),
      timeWastedMs: acc.timeWastedMs + (s.time_wasted_ms as number),
      tokensSaved: acc.tokensSaved + (s.tokens_saved as number),
    }),
    { loops: 0, timeWastedMs: 0, tokensSaved: 0 },
  );

  // Today totals
  const todaySessions = todayResult.data ?? [];
  const today = todaySessions.reduce(
    (acc, s) => ({
      loops: acc.loops + (s.loops_detected as number),
      timeWastedMs: acc.timeWastedMs + (s.time_wasted_ms as number),
      tokensSaved: acc.tokensSaved + (s.tokens_saved as number),
    }),
    { loops: 0, timeWastedMs: 0, tokensSaved: 0 },
  );

  // All-time totals
  const allTimeSessions = allTimeResult.data ?? [];
  const allTime = allTimeSessions.reduce(
    (acc, s) => ({
      loops: acc.loops + (s.loops_detected as number),
      timeWastedMs: acc.timeWastedMs + (s.time_wasted_ms as number),
      tokensSaved: acc.tokensSaved + (s.tokens_saved as number),
    }),
    { loops: 0, timeWastedMs: 0, tokensSaved: 0 },
  );

  // Daily breakdown for chart
  const byDay: Record<string, { loops: number; tokensSaved: number }> = {};
  for (const s of sessions) {
    const day = (s.started_at as string).slice(0, 10);
    const existing = byDay[day] ?? { loops: 0, tokensSaved: 0 };
    byDay[day] = {
      loops: existing.loops + (s.loops_detected as number),
      tokensSaved: existing.tokensSaved + (s.tokens_saved as number),
    };
  }

  // Top error hashes — dedicated lightweight query
  const topHashes = topHashesResult.data ?? [];
  const hashCount: Record<string, number> = {};
  for (const l of topHashes) {
    hashCount[l.error_hash as string] = (hashCount[l.error_hash as string] ?? 0) + 1;
  }
  const topErrorHashes = Object.entries(hashCount)
    .map(([hash, count]) => ({ hash, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const costPerToken = 0.000003; // $3.00 / 1M tokens (Sonnet input pricing — varies by model)

  const loops = loopsResult.data ?? [];
  res.json({
    thisWeek: {
      ...thisWeek,
      costSaved: Number((thisWeek.tokensSaved * costPerToken).toFixed(2)),
    },
    today: {
      ...today,
      costSaved: Number((today.tokensSaved * costPerToken).toFixed(2)),
    },
    allTime: {
      ...allTime,
      costSaved: Number((allTime.tokensSaved * costPerToken).toFixed(2)),
    },
    weeklyBreakdown: Object.entries(byDay).map(([date, v]) => ({ date, ...v })),
    recentLoops: loops.slice(0, 20).map((l) => ({
      id: l.id as string,
      errorHash: l.error_hash as string,
      occurrences: l.occurrences as number,
      timeWastedMs: l.time_wasted_ms as number,
      fileType: l.file_type as string,
      status: l.status as string,
      detectedAt: new Date(l.detected_at as string).getTime(),
    })),
    topErrorHashes,
  });
});

/* ── POST /event ────────────────────────────────────────────────────
 * Funnel event tracking — no auth required (works pre-sign-in).
 * Tracks: extension_activated, first_loop_detected, context_copied,
 *         signed_in, dashboard_viewed
 */
router.post('/event', async (req: AuthRequest, res: Response): Promise<void> => {
  const parsed = FunnelEventSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid payload', details: parsed.error.flatten() });
    return;
  }

  const { error } = await supabase.from('funnel_events').insert({
    event_name: parsed.data.eventName,
    user_id: req.userId ?? null,
    device_id: parsed.data.deviceId ?? null,
    properties: parsed.data.properties ?? {},
  });

  if (error !== null) {
    logger.error({ err: error.message }, 'funnel event insert failed');
    res.status(500).json({ error: 'Failed to track event' });
    return;
  }

  res.json({ ok: true });
});

/* ── POST /device-sync ──────────────────────────────────────────────
 * Called by loopguard-ctx CLI at session end (Stop hook).
 * Authenticated via HMAC-SHA256 signature on device_id + timestamp.
 * Privacy: only aggregate token/command counts and daily totals.
 */
router.post('/device-sync', async (req: Request, res: Response): Promise<void> => {
  const deviceIdRaw = (req.body as { device_id?: string }).device_id ?? '';
  if (!verifyDeviceHmac(deviceIdRaw, req)) {
    res.status(401).json({ error: 'Invalid or missing device signature' });
    return;
  }

  const parsed = DeviceSyncSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid payload', details: parsed.error.flatten() });
    return;
  }

  const d = parsed.data;
  const { error } = await supabase.from('device_stats').upsert(
    {
      device_id: d.device_id,
      last_synced: new Date().toISOString(),
      total_tokens_original: d.total_tokens_original,
      total_tokens_compressed: d.total_tokens_compressed,
      total_tokens_saved: d.total_tokens_saved,
      total_commands: d.total_commands,
      total_sessions: d.total_sessions,
      daily_breakdown: d.daily_breakdown,
    },
    { onConflict: 'device_id' },
  );

  if (error !== null) {
    logger.error({ err: error.message }, '[metrics/device-sync] Supabase error');
    res.status(500).json({ error: 'Failed to sync device stats' });
    return;
  }

  res.json({ ok: true });
});

/* ── GET /device-stats ──────────────────────────────────────────────
 * Returns stats for a specific device ID.
 * Authenticated via HMAC-SHA256 signature on device_id + timestamp.
 */
router.get('/device-stats', async (req: Request, res: Response): Promise<void> => {
  const deviceIdRaw = typeof req.query['device_id'] === 'string' ? req.query['device_id'] : '';
  if (!verifyDeviceHmac(deviceIdRaw, req)) {
    res.status(401).json({ error: 'Invalid or missing device signature' });
    return;
  }

  if (!/^[0-9a-f-]{36}$/.test(deviceIdRaw)) {
    res.status(400).json({ error: 'Invalid device_id', code: 'INVALID_DEVICE_ID' });
    return;
  }

  const { data, error } = await supabase
    .from('device_stats')
    .select('*')
    .eq('device_id', deviceIdRaw)
    .single();

  if (error !== null || data === null) {
    res.status(404).json({ error: 'Device not found', code: 'DEVICE_NOT_FOUND' });
    return;
  }

  const costPerToken = 0.000003;
  res.json({
    deviceId: data['device_id'],
    firstSeen: data['first_seen'],
    lastSynced: data['last_synced'],
    totalTokensSaved: data['total_tokens_saved'],
    totalCommands: data['total_commands'],
    totalSessions: data['total_sessions'],
    costSaved: Number(((data['total_tokens_saved'] as number) * costPerToken).toFixed(2)),
    dailyBreakdown: data['daily_breakdown'],
  });
});

export default router;
