import { logger } from '../utils/logger';

/**
 * API base URL.
 * Production: https://loopguardapi-production.up.railway.app
 * Local dev: set LOOPGUARD_API_URL=http://localhost:3001
 */
const API_BASE =
  (typeof process !== 'undefined' && process.env['LOOPGUARD_API_URL']) ??
  'https://loopguardapi-production.up.railway.app';

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

export interface SummaryPeriod {
  loops: number;
  timeWastedMs: number;
  tokensSaved: number;
  costSaved: number;
}

export interface SummaryLoopEntry {
  id: string;
  errorHash: string;
  occurrences: number;
  timeWastedMs: number;
  fileType: string;
  status: string;
  detectedAt: number;
}

export interface DashboardSummary {
  thisWeek: SummaryPeriod;
  today: SummaryPeriod;
  allTime: SummaryPeriod;
  weeklyBreakdown: Array<{ date: string; loops: number; tokensSaved: number }>;
  recentLoops: SummaryLoopEntry[];
  topErrorHashes: Array<{ hash: string; count: number }>;
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

  async getSummary(days: number = 7): Promise<DashboardSummary | null> {
    if (this._token === null) return null;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const res = await fetch(`${API_BASE}/api/v1/metrics/summary?days=${days}`, {
        headers: {
          Authorization: `Bearer ${this._token}`,
        },
        signal: controller.signal,
      });

      if (!res.ok) {
        logger.warn(`[ApiClient] /api/v1/metrics/summary → ${res.status}`);
        return null;
      }

      return (await res.json()) as DashboardSummary;
    } catch (err) {
      logger.warn('[ApiClient] /api/v1/metrics/summary failed (network or timeout)', { err });
      return null;
    } finally {
      clearTimeout(timer);
    }
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
