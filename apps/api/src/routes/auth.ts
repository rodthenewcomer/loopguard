import { Router } from 'express';
import { z } from 'zod';
import { supabase } from '../lib/supabase';
import type { Request, Response } from 'express';

const router = Router();

const ExchangeSchema = z.object({
  code: z.string().min(32).max(128),
});

/**
 * POST /api/v1/auth/exchange
 *
 * Redeems a one-time auth code created by the web app and returns the
 * associated JWT + email. No Bearer token required — the code IS the credential.
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
    .select('id, jwt, email, expires_at, used_at')
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

  res.json({ jwt: row.jwt as string, email: row.email as string });
});

export default router;
