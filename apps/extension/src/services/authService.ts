import * as vscode from 'vscode';
import { logger } from '../utils/logger';
import type { ApiClient } from './apiClient';

const JWT_SECRET_KEY = 'loopguard.auth.jwt';
const EMAIL_SECRET_KEY = 'loopguard.auth.email';
const REFRESH_TOKEN_KEY = 'loopguard.auth.refreshToken';

const AUTH_BASE_URL = 'https://loopguard.dev/auth/extension';

/**
 * AuthService — manages Supabase JWT lifecycle for the extension.
 *
 * Sign-in flow:
 *   1. User runs "LoopGuard: Sign In"
 *   2. Browser opens → user authenticates on loopguard.dev
 *   3. Web app creates a one-time code in Supabase (5-min TTL) and redirects to:
 *      {scheme}://LoopGuard.loopguard/auth?code=RANDOM_CODE&email=user@example.com
 *      where {scheme} = vscode | cursor | windsurf (read from vscode.env.uriScheme)
 *   4. Extension URI handler calls handleCallback(code, email)
 *   5. Extension exchanges the code for a JWT + refresh_token via POST /api/v1/auth/exchange
 *   6. Both tokens stored in SecretStorage (OS keychain on macOS/Windows/Linux)
 *   7. Access token used for all API calls; refresh token used to silently refresh
 *      when the access token expires (~1 hour) — user never needs to re-authenticate
 *
 * Auth failure:
 *   If a 401 is received AND the refresh token is also invalid/expired, the ApiClient
 *   fires onAuthFailed. AuthService clears stored tokens and notifies the user to
 *   sign in again, rather than silently dropping all metric syncs while still showing
 *   "connected" in the UI.
 *
 * The JWT never appears in browser history, server logs, or referrer headers.
 */
export class AuthService {
  private readonly _secrets: vscode.SecretStorage;
  private readonly _apiClient: ApiClient;
  private readonly _onAuthStateChanged?: (signedIn: boolean) => void;
  private _email: string | null = null;

  constructor(
    secrets: vscode.SecretStorage,
    apiClient: ApiClient,
    onAuthStateChanged?: (signedIn: boolean) => void,
  ) {
    this._secrets = secrets;
    this._apiClient = apiClient;
    this._onAuthStateChanged = onAuthStateChanged;

    // Persist new tokens whenever the client silently refreshes them
    apiClient.setOnTokenRefreshed((jwt, refreshToken) => {
      void secrets.store(JWT_SECRET_KEY, jwt);
      void secrets.store(REFRESH_TOKEN_KEY, refreshToken);
    });

    // Handle permanent auth failure (401 + refresh also failed).
    // Clear stored tokens and notify user so they can re-authenticate.
    apiClient.setOnAuthFailed(() => {
      void this._handleAuthExpired();
    });
  }

  /**
   * Called on extension activation — restores JWT and refresh token from SecretStorage.
   */
  async initialize(): Promise<void> {
    const jwt = await this._secrets.get(JWT_SECRET_KEY);
    const email = await this._secrets.get(EMAIL_SECRET_KEY);
    const refreshToken = await this._secrets.get(REFRESH_TOKEN_KEY);

    if (jwt !== undefined) {
      this._apiClient.setToken(jwt);
      this._apiClient.setRefreshToken(refreshToken ?? null);
      this._email = email ?? null;
      logger.info('Auth: token restored', { email: this._email ?? 'unknown' });
      this._onAuthStateChanged?.(true);
    }
  }

  get isSignedIn(): boolean {
    return this._apiClient.isAuthenticated;
  }

  get userEmail(): string | null {
    return this._email;
  }

  /**
   * Open the sign-in page in the user's browser.
   * Passes the IDE's URI scheme so the web page builds the right callback URL
   * (vscode://, cursor://, windsurf://, etc.)
   */
  async signIn(): Promise<void> {
    // vscode.env.uriScheme returns "vscode" | "cursor" | "windsurf" | etc.
    const scheme = vscode.env.uriScheme;
    const url = `${AUTH_BASE_URL}?ide=${encodeURIComponent(scheme)}`;
    await vscode.env.openExternal(vscode.Uri.parse(url));
    vscode.window.showInformationMessage(
      'LoopGuard: Browser opened — sign in to connect your dashboard.',
    );
  }

  /**
   * Called by the URI handler when VS Code receives:
   * vscode://LoopGuard.loopguard/auth?code=ONE_TIME_CODE&email=user@example.com
   *
   * Exchanges the code for a JWT + refresh_token server-side so raw tokens
   * never travel through the URL (and never land in browser history or logs).
   */
  async handleCallback(code: string, _email: string): Promise<void> {
    const result = await this._apiClient.exchangeCode(code);

    if (result === null) {
      logger.warn('Auth: code exchange failed');
      vscode.window.showErrorMessage(
        'LoopGuard: Sign-in failed — the auth code expired or was already used. Please try signing in again.',
      );
      return;
    }

    await this._secrets.store(JWT_SECRET_KEY, result.jwt);
    await this._secrets.store(EMAIL_SECRET_KEY, result.email);
    if (result.refreshToken !== null) {
      await this._secrets.store(REFRESH_TOKEN_KEY, result.refreshToken);
    }

    this._apiClient.setToken(result.jwt);
    this._apiClient.setRefreshToken(result.refreshToken);
    this._email = result.email;

    logger.info('Auth: signed in', { email: result.email });
    this._onAuthStateChanged?.(true);
    vscode.window.showInformationMessage(
      `LoopGuard: Signed in as ${result.email}. Session metrics will now sync to your dashboard.`,
    );
  }

  async signOut(): Promise<void> {
    await this._clearTokens();
    logger.info('Auth: signed out');
    this._onAuthStateChanged?.(false);
    vscode.window.showInformationMessage(
      'LoopGuard: Signed out. Session data will no longer sync.',
    );
  }

  /** Called when the API returns 401 and the refresh token is also dead. */
  private async _handleAuthExpired(): Promise<void> {
    logger.warn('Auth: session expired — clearing tokens and prompting re-auth');
    await this._clearTokens();
    this._onAuthStateChanged?.(false);
    const action = await vscode.window.showWarningMessage(
      'LoopGuard: Your session has expired. Sign in again to resume syncing.',
      'Sign In',
    );
    if (action === 'Sign In') {
      await this.signIn();
    }
  }

  private async _clearTokens(): Promise<void> {
    await this._secrets.delete(JWT_SECRET_KEY);
    await this._secrets.delete(EMAIL_SECRET_KEY);
    await this._secrets.delete(REFRESH_TOKEN_KEY);
    this._apiClient.setToken(null);
    this._apiClient.setRefreshToken(null);
    this._email = null;
  }
}
