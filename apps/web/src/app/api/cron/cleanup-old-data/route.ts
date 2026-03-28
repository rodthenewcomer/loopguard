import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Cron endpoint: DELETE sessions and loops older than 90 days.
 * Keeps the database lean and respects user privacy over time.
 * Triggered by Vercel cron every Sunday at 03:00 UTC (see vercel.json).
 *
 * Protected by CRON_SECRET — Vercel sends Authorization: Bearer <CRON_SECRET>.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const RETENTION_DAYS = 90;

export async function GET(req: NextRequest) {
  const secret = process.env['CRON_SECRET'];
  const auth = req.headers.get('authorization');
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabaseUrl = process.env['SUPABASE_URL'];
  const serviceKey = process.env['SUPABASE_SERVICE_ROLE_KEY'];

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });

  const cutoff = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000).toISOString();

  // Delete loops resolved/ignored more than 90 days ago
  const { error: loopsErr, count: loopsDeleted } = await supabase
    .from('loops')
    .delete({ count: 'exact' })
    .lt('detected_at', cutoff)
    .in('status', ['resolved', 'ignored']);

  if (loopsErr) {
    console.error('[cron/cleanup-old-data] loops error:', loopsErr.message);
    return NextResponse.json({ error: loopsErr.message }, { status: 500 });
  }

  // Delete sessions ended more than 90 days ago
  const { error: sessErr, count: sessDeleted } = await supabase
    .from('sessions')
    .delete({ count: 'exact' })
    .lt('ended_at', cutoff)
    .not('ended_at', 'is', null);

  if (sessErr) {
    console.error('[cron/cleanup-old-data] sessions error:', sessErr.message);
    return NextResponse.json({ error: sessErr.message }, { status: 500 });
  }

  const result = {
    ok: true,
    loopsDeleted: loopsDeleted ?? 0,
    sessionsDeleted: sessDeleted ?? 0,
    cutoff,
    ts: Date.now(),
  };
  console.log('[cron/cleanup-old-data]', result);
  return NextResponse.json(result);
}
