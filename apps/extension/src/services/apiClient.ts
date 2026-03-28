import { logger } from '../utils/logger';

/**
 * API base URL.
 * In production this resolves to https://api.loopguard.dev
 * In local dev: set LOOPGUARD_API_URL=http://localhost:3001
 */
const API_BASE =
  (typeof process !== 'undefined' && process.env['LOOPGUARD_API_URL']) ??
  'https://api.loopguard.dev';

const TIMEOUT_MS = 8000;

export interface SessionPayload {
  sessionId: string;
  startedAt: number;
  endedAt?: number;
  loopsDetected: number;
  timeWastedMs: number;
  tokensSaved: number;
  fileTypes: string[];   // ['ts', 'py'] — extension only, no paths
  extensionVersion: string;
}

export interface LoopPayload {
  sessionId: string;
  errorHash: string;     // anonymized fingerprint — no message content
  occurrences: number;
  timeWastedMs: number;
  fileType: string;      // extension only — 'ts', 'py' etc.
  detectedAt: number;
  resolvedAt?: number | null;
  status: 'active' | 'resolved' | 'ignored';
}

/**
 * Thin HTTP client for the LoopGuard API.
 *
 * All calls are best-effort — the extension always works offline.
 * If auth token is missing, all calls are silently skipped.
 * Network errors are logged but never thrown to the caller.
 */
export class ApiClient {
  private _token: string | null = null;

  setToken(token: string | null): void {
    this._token = token;
  }

  get isAuthenticated(): boolean {
    return this._token !== null;
  }

  /**
   * Exchanges a one-time auth code (from the IDE URI callback) for a JWT.
   * This call does NOT require a bearer token — the code is the credential.
   * Returns null on any failure so the caller can show a clear error.
   */
  async exchangeCode(code: string): Promise<{ jwt: string; email: string } | null> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(`${API_BASE}/api/v1/auth/exchange`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
        signal: controller.signal,
      });
      if (!res.ok) return null;
      return (await res.json()) as { jwt: string; email: string };
    } catch (err) {
      logger.warn('[ApiClient] exchangeCode failed', { err });
      return null;
    } finally {
      clearTimeout(timer);
    }
  }

  async sendSession(payload: SessionPayload): Promise<void> {
    if (this._token === null) return;
    await this._post('/api/v1/metrics/session', payload);
  }

  async sendLoop(payload: LoopPayload): Promise<void> {
    if (this._token === null) return;
    await this._post('/api/v1/metrics/loop', payload);
  }

  private async _post(path: string, body: unknown): Promise<void> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const res = await fetch(`${API_BASE}${path}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this._token}`,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      if (!res.ok) {
        logger.warn(`[ApiClient] ${path} → ${res.status}`);
        // 401 means token expired — could trigger refresh here
      }
    } catch (err) {
      // Never surface API errors to the user. Extension works offline.
      logger.warn(`[ApiClient] ${path} failed (network or timeout)`, { err });
    } finally {
      clearTimeout(timer);
    }
  }
}
