import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env['SUPABASE_URL'] ?? '';
const SUPABASE_SERVICE_KEY = process.env['SUPABASE_SERVICE_ROLE_KEY'] ?? '';

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.warn(
    '[LoopGuard API] Supabase credentials not configured. ' +
      'Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment.',
  );
}

/**
 * Service-role client — bypasses RLS for server-side admin operations.
 * NEVER expose this to the client or extension directly.
 */
export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

/**
 * Verify a Supabase JWT and return the authenticated user.
 * Returns null if the token is invalid or expired.
 */
export async function verifyJwt(
  token: string,
): Promise<{ userId: string; email: string } | null> {
  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error !== null || data.user === null) return null;
    return { userId: data.user.id, email: data.user.email ?? '' };
  } catch {
    return null;
  }
}
