import type { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../lib/supabase';

export interface AuthRequest extends Request {
  userId?: string;
  userEmail?: string;
}

/**
 * Middleware: verifies the Supabase JWT from the Authorization header.
 * Attaches userId and userEmail to the request object.
 * Returns 401 if missing or invalid.
 */
export async function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const header = req.headers['authorization'];
  if (typeof header !== 'string' || !header.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or malformed Authorization header' });
    return;
  }

  const token = header.slice(7);
  const user = await verifyJwt(token);

  if (user === null) {
    res.status(401).json({ error: 'Invalid or expired token' });
    return;
  }

  req.userId = user.userId;
  req.userEmail = user.email;
  next();
}
