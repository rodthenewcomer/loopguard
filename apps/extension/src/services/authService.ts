import * as vscode from 'vscode';
import { logger } from '../utils/logger';
import type { ApiClient } from './apiClient';

const JWT_SECRET_KEY = 'loopguard.auth.jwt';
const EMAIL_SECRET_KEY = 'loopguard.auth.email';

const AUTH_BASE_URL = 'https://loopguard.vercel.app/auth/extension';

/**
 * AuthService — manages Supabase JWT lifecycle for the extension.
 *
 * Sign-in flow:
 *   1. User runs "LoopGuard: Sign In"
 *   2. Browser opens → user authenticates on loopguard.vercel.app
 *   3. Web app creates a one-time code in Supabase (5-min TTL) and redirects to:
 *      {scheme}://loopguard-dev.loopguard/auth?code=RANDOM_CODE&email=user@example.com
 *      where {scheme} = vscode | cursor | windsurf (read from vscode.env.uriScheme)
 *   4. Extension URI handler calls handleCallback(code, email)
 *   5. Extension exchanges the code for a JWT via POST /api/v1/auth/exchange
 *   6. JWT stored in SecretStorage (OS keychain on macOS/Windows/Linux)
 *   7. Subsequent API calls include Bearer token
 *
 * The JWT never appears in browser history, server logs, or referrer headers.
 */
export class AuthService {
  private readonly _secrets: vscode.SecretStorage;
  private readonly _apiClient: ApiClient;
  private _email: string | null = null;

  constructor(secrets: vscode.SecretStorage, apiClient: ApiClient) {
    this._secrets = secrets;
    this._apiClient = apiClient;
  }

  /**
   * Called on extension activation — restores JWT from SecretStorage if present.
   */
  async initialize(): Promise<void> {
    const jwt = await this._secrets.get(JWT_SECRET_KEY);
    const email = await this._secrets.get(EMAIL_SECRET_KEY);
    if (jwt !== undefined) {
      this._apiClient.setToken(jwt);
      this._email = email ?? null;
      logger.info('Auth: token restored', { email: this._email ?? 'unknown' });
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
   * vscode://loopguard-dev.loopguard/auth?code=ONE_TIME_CODE&email=user@example.com
   *
   * Exchanges the code for a JWT server-side so the raw token never travels
   * through the URL (and thus never lands in browser history or server logs).
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
    this._apiClient.setToken(result.jwt);
    this._email = result.email;

    logger.info('Auth: signed in', { email: result.email });
    vscode.window.showInformationMessage(
      `LoopGuard: Signed in as ${result.email}. Session metrics will now sync to your dashboard.`,
    );
  }

  async signOut(): Promise<void> {
    await this._secrets.delete(JWT_SECRET_KEY);
    await this._secrets.delete(EMAIL_SECRET_KEY);
    this._apiClient.setToken(null);
    this._email = null;

    logger.info('Auth: signed out');
    vscode.window.showInformationMessage(
      'LoopGuard: Signed out. Session data will no longer sync.',
    );
  }
}
