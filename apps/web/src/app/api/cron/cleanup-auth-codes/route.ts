import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Cron endpoint: DELETE expired and used auth_codes older than 1 hour.
 * Triggered by Vercel cron every hour (see vercel.json).
 *
 * Protected by CRON_SECRET — Vercel sends Authorization: Bearer <CRON_SECRET>.
 * Without the secret this returns 401.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  // Auth: only allow Vercel cron scheduler
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

  // Delete auth codes that are either:
  //   a) already used (used_at IS NOT NULL)
  //   b) expired over 1 hour ago (extra buffer beyond the 5-min TTL)
  const { error, count } = await supabase
    .from('auth_codes')
    .delete({ count: 'exact' })
    .or(`used_at.not.is.null,expires_at.lt.${new Date(Date.now() - 60 * 60 * 1000).toISOString()}`);

  if (error) {
    console.error('[cron/cleanup-auth-codes] Supabase error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  console.log(`[cron/cleanup-auth-codes] Deleted ${count ?? 0} stale auth codes`);
  return NextResponse.json({ ok: true, deleted: count ?? 0, ts: Date.now() });
}
