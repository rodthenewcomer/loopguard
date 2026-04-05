import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { randomBytes } from 'crypto';

const SUPABASE_URL = process.env['SUPABASE_URL'] ?? process.env['NEXT_PUBLIC_SUPABASE_URL'] ?? '';
const SUPABASE_SERVICE_ROLE_KEY = process.env['SUPABASE_SERVICE_ROLE_KEY'] ?? '';

// Code TTL: 5 minutes. Short enough to be safe, long enough for the
// user to switch from browser to IDE and back.
const CODE_TTL_MS = 5 * 60 * 1000;

/**
 * POST /api/auth/code
 *
 * Called by ExtensionAuthClient after the user signs in.
 * Verifies the user's JWT, generates a one-time code, persists it,
 * and returns the code. The code is what the IDE receives — never the JWT.
 *
 * Both access_token and refresh_token are stored so the extension can
 * silently refresh when the access token expires (~1 hour).
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
  }

  let jwt: string;
  let refreshToken: string;
  try {
    const body = (await req.json()) as { jwt?: unknown; refreshToken?: unknown };
    if (typeof body.jwt !== 'string' || body.jwt.length === 0) {
      return NextResponse.json({ error: 'Missing jwt' }, { status: 400 });
    }
    jwt = body.jwt;
    refreshToken = typeof body.refreshToken === 'string' ? body.refreshToken : '';
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // Verify the JWT using the service-role client
  const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  const { data: { user }, error: authError } = await admin.auth.getUser(jwt);
  if (authError !== null || user === null) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const code = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + CODE_TTL_MS).toISOString();

  const { error: insertError } = await admin
    .from('auth_codes')
    .insert({
      code,
      user_id: user.id,
      jwt,
      refresh_token: refreshToken,
      email: user.email ?? '',
      expires_at: expiresAt,
    });

  if (insertError !== null) {
    console.error('[auth/code] Insert failed:', insertError.message);
    return NextResponse.json({ error: 'Failed to create code' }, { status: 500 });
  }

  return NextResponse.json({ code });
}
