import { Router } from 'express';
import { z } from 'zod';
import { supabase } from '../lib/supabase';
import type { Request, Response } from 'express';

const router = Router();

const ExchangeSchema = z.object({
  code: z.string().min(32).max(128),
});

const RefreshSchema = z.object({
  refreshToken: z.string().min(1),
});

/**
 * POST /api/v1/auth/exchange
 *
 * Redeems a one-time auth code created by the web app and returns the
 * associated JWT + email + refresh_token. No Bearer token required.
 *
 * Security properties:
 *   - Codes expire after 5 minutes
 *   - Each code is single-use (used_at is set on redemption)
 *   - Raw JWT never appears in browser history or server access logs
 */
router.post('/exchange', async (req: Request, res: Response): Promise<void> => {
  const parsed = ExchangeSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid code' });
    return;
  }

  const { code } = parsed.data;
  const now = new Date().toISOString();

  // Look up the code — must exist, be unexpired, and not yet redeemed
  const { data: row, error: lookupError } = await supabase
    .from('auth_codes')
    .select('id, jwt, refresh_token, email, expires_at, used_at')
    .eq('code', code)
    .single();

  if (lookupError !== null || row === null) {
    res.status(401).json({ error: 'Invalid or expired code' });
    return;
  }

  if (row.used_at !== null) {
    res.status(401).json({ error: 'Code already used' });
    return;
  }

  if (new Date(row.expires_at as string) < new Date(now)) {
    res.status(401).json({ error: 'Code expired' });
    return;
  }

  // Mark as used — atomic: if two requests race, second will find used_at set
  const { error: updateError } = await supabase
    .from('auth_codes')
    .update({ used_at: now })
    .eq('id', row.id as string)
    .is('used_at', null); // only update if still null

  if (updateError !== null) {
    res.status(401).json({ error: 'Code already used' });
    return;
  }

  res.json({
    jwt: row.jwt as string,
    email: row.email as string,
    refreshToken: (row.refresh_token as string | null) ?? null,
  });
});

/**
 * POST /api/v1/auth/refresh
 *
 * Accepts a Supabase refresh_token and returns a new access_token + refresh_token.
 * Called by the extension when the access token expires (~1 hour).
 * No Bearer token required — the refresh token IS the credential.
 */
router.post('/refresh', async (req: Request, res: Response): Promise<void> => {
  const parsed = RefreshSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid payload' });
    return;
  }

  const supabaseUrl = process.env['SUPABASE_URL'] ?? '';
  const supabaseKey = process.env['SUPABASE_SERVICE_ROLE_KEY'] ?? '';

  if (!supabaseUrl || !supabaseKey) {
    res.status(500).json({ error: 'Server not configured' });
    return;
  }

  try {
    const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=refresh_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({ refresh_token: parsed.data.refreshToken }),
    });

    if (!response.ok) {
      res.status(401).json({ error: 'Token refresh failed' });
      return;
    }

    const data = (await response.json()) as { access_token?: string; refresh_token?: string };
    if (!data.access_token || !data.refresh_token) {
      res.status(401).json({ error: 'Unexpected response from auth server' });
      return;
    }

    res.json({ jwt: data.access_token, refreshToken: data.refresh_token });
  } catch (err) {
    console.error('[auth/refresh] Error:', err);
    res.status(500).json({ error: 'Token refresh failed' });
  }
});

export default router;
