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
 *
 * Token refresh: when the access token expires (~1 hour), the client
 * automatically refreshes it via /api/v1/auth/refresh using the stored
 * refresh token. The new token pair is persisted via the onTokenRefreshed
 * callback so the user never needs to re-authenticate.
 *
 * Auth failure: when a 401 occurs AND the refresh token is also invalid/expired,
 * onAuthFailed is fired so the extension can sign out and prompt re-auth instead
 * of silently dropping all metric syncs while still showing "connected".
 */
export class ApiClient {
  private _token: string | null = null;
  private _refreshToken: string | null = null;
  private _onTokenRefreshed?: (jwt: string, refreshToken: string) => void;
  private _onAuthFailed?: () => void;

  setToken(token: string | null): void {
    this._token = token;
  }

  setRefreshToken(token: string | null): void {
    this._refreshToken = token;
  }

  setOnTokenRefreshed(callback: (jwt: string, refreshToken: string) => void): void {
    this._onTokenRefreshed = callback;
  }

  /** Called when a 401 is received AND the refresh token is also invalid/expired. */
  setOnAuthFailed(callback: () => void): void {
    this._onAuthFailed = callback;
  }

  get isAuthenticated(): boolean {
    return this._token !== null;
  }

  /**
   * Exchanges a one-time auth code (from the IDE URI callback) for a JWT.
   * This call does NOT require a bearer token — the code is the credential.
   * Returns null on any failure so the caller can show a clear error.
   */
  async exchangeCode(code: string): Promise<{ jwt: string; email: string; refreshToken: string | null } | null> {
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
      return (await res.json()) as { jwt: string; email: string; refreshToken: string | null };
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
    return this._getJson<DashboardSummary>(`/api/v1/metrics/summary?days=${days}`);
  }

  /** Attempt a silent token refresh. Returns true if successful. */
  private async _tryRefresh(): Promise<boolean> {
    if (this._refreshToken === null) return false;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const res = await fetch(`${API_BASE}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: this._refreshToken }),
        signal: controller.signal,
      });

      if (!res.ok) return false;

      const data = (await res.json()) as { jwt: string; refreshToken: string };
      this._token = data.jwt;
      this._refreshToken = data.refreshToken;
      this._onTokenRefreshed?.(data.jwt, data.refreshToken);
      logger.info('[ApiClient] token refreshed successfully');
      return true;
    } catch {
      return false;
    } finally {
      clearTimeout(timer);
    }
  }

  private async _getJson<T>(path: string, isRetry = false): Promise<T | null> {
    if (this._token === null) return null;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const res = await fetch(`${API_BASE}${path}`, {
        headers: { Authorization: `Bearer ${this._token}` },
        signal: controller.signal,
      });

      if (res.status === 401 && !isRetry) {
        clearTimeout(timer);
        const refreshed = await this._tryRefresh();
        if (refreshed) return this._getJson<T>(path, true);
        // Refresh also failed — token is permanently dead
        logger.warn(`[ApiClient] GET ${path}: 401 and refresh failed, firing onAuthFailed`);
        this._onAuthFailed?.();
        return null;
      }

      if (!res.ok) {
        logger.warn(`[ApiClient] GET ${path} → ${res.status}`);
        return null;
      }

      return (await res.json()) as T;
    } catch (err) {
      logger.warn(`[ApiClient] GET ${path} failed (network or timeout)`, { err });
      return null;
    } finally {
      clearTimeout(timer);
    }
  }

  private async _post(path: string, body: unknown, isRetry = false): Promise<void> {
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

      if (res.status === 401 && !isRetry) {
        clearTimeout(timer);
        const refreshed = await this._tryRefresh();
        if (refreshed) {
          await this._post(path, body, true);
          return;
        }
        // Refresh also failed — token is permanently dead
        logger.warn(`[ApiClient] POST ${path}: 401 and refresh failed, firing onAuthFailed`);
        this._onAuthFailed?.();
        return;
      }

      if (!res.ok) {
        logger.warn(`[ApiClient] ${path} → ${res.status}`);
      }
    } catch (err) {
      // Never surface API errors to the user. Extension works offline.
      logger.warn(`[ApiClient] ${path} failed (network or timeout)`, { err });
    } finally {
      clearTimeout(timer);
    }
  }
}
