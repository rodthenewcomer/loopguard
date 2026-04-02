import * as vscode from 'vscode';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { extname } from 'path';
import { getConfig, onConfigChange } from './utils/config';
import { logger } from './utils/logger';
import { LoopEngine } from './core/loopEngine';
import { ContextEngine } from './core/contextEngine';
import { SessionTracker } from './core/sessionTracker';
import { EditTracker } from './core/editTracker';
import { DiagnosticListener } from './listeners/diagnosticListener';
import { FileListener } from './listeners/fileListener';
import { StatusBar } from './ui/statusBar';
import { AlertPanel } from './ui/alertPanel';
import { DashboardPanel } from './ui/dashboardPanel';
import { ApiClient } from './services/apiClient';
import { AuthService } from './services/authService';
import { estimateTokens } from '@loopguard/utils';
import type { LoopEvent } from '@loopguard/types';

const execFileAsync = promisify(execFile);

// How often to sync session metrics to the API while active (ms)
const SYNC_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

// Module-level ref so deactivate() can fire the final sync
let _syncFinalSession: ((endedAt: number) => void) | undefined;

const FIRST_INSTALL_KEY = 'loopguard.firstInstall';
const BINARY_DOWNLOAD_URL = 'https://github.com/rodthenewcomer/loopguard/releases/latest';

/* ── activate ──────────────────────────────────────────────────────*/
export function activate(context: vscode.ExtensionContext): void {
  try {
    _activate(context);
  } catch (err) {
    // Never crash VS Code on our behalf — log and degrade gracefully
    logger.error('LoopGuard activation failed', { err });
    vscode.window.showWarningMessage(
      'LoopGuard failed to start. Loop detection is disabled. Check Output → LoopGuard for details.',
    );
  }
}

function _activate(context: vscode.ExtensionContext): void {
  logger.info('LoopGuard activating...');

  const config = getConfig();

  // Core engines
  const loopEngine = new LoopEngine(config);
  const contextEngine = new ContextEngine(config, context.extensionUri);
  const sessionTracker = new SessionTracker();
  const editTracker = new EditTracker();

  // UI
  const alertPanel = new AlertPanel();
  const statusBar = new StatusBar();

  // API sync (no-ops when not authenticated)
  const apiClient = new ApiClient();
  const authService = new AuthService(context.secrets, apiClient);

  sessionTracker.startSession();

  // Cache Rust engine availability and tell the dashboard panel which tier is active
  contextEngine.isBinaryAvailable().then((available) => {
    DashboardPanel.setEngineTier(available ? 'rust' : 'ts');
  }).catch(() => undefined);

  // Restore auth token from SecretStorage — async, best-effort
  authService.initialize().catch((err) => logger.error('Auth init failed', { err }));

  /* ── Helpers ──────────────────────────────────────────────────── */

  /** Extract just the file extension from a URI string, safely. Works on Windows/Mac/Linux. */
  function getFileType(uri: string): string {
    try {
      // vscode.Uri.parse gives a proper fsPath that handles Windows drive letters (C:\...)
      const fsPath = vscode.Uri.parse(uri).fsPath;
      return extname(fsPath).replace('.', '').toLowerCase() || 'unknown';
    } catch {
      return 'unknown';
    }
  }

  /** Sync current session metrics to the API. Best-effort, never throws. */
  function syncSession(endedAt?: number): void {
    const metrics = sessionTracker.getMetrics();
    const loops = getActiveLoops();
    const fileTypes = [...new Set(loops.map((l) => getFileType(l.fileUri)))];

    void apiClient.sendSession({
      sessionId: metrics.sessionId,
      startedAt: metrics.startTime,
      endedAt,
      loopsDetected: metrics.totalLoopsDetected,
      timeWastedMs: metrics.totalTimeWasted,
      tokensSaved: metrics.tokensSaved,
      fileTypes,
      extensionVersion: context.extension.packageJSON.version as string,
    }); // errors already handled inside ApiClient
  }

  function getAllLoops(): LoopEvent[] {
    return [...loopEngine.getAllLoops(), ...editTracker.getAllLoops()];
  }

  function getActiveLoops(): LoopEvent[] {
    return [...loopEngine.getActiveLoops(), ...editTracker.getActiveLoops()];
  }

  function refreshLoopState(): void {
    const allLoops = getAllLoops();
    const activeLoops = getActiveLoops();
    sessionTracker.syncLoops(allLoops);
    const metrics = sessionTracker.getMetrics();
    statusBar.update(metrics, activeLoops.length);
    DashboardPanel.update(metrics, activeLoops);
  }

  /* ── Loop handler ─────────────────────────────────────────────── */
  const onLoopDetected = async (events: LoopEvent[]): Promise<void> => {
    for (const event of events) {
      // Sync loop event to API (best-effort, privacy-safe)
      void apiClient.sendLoop({
        sessionId: sessionTracker.getMetrics().sessionId,
        errorHash: event.errorHash,
        occurrences: event.occurrences,
        timeWastedMs: event.lastSeen - event.firstSeen,
        fileType: getFileType(event.fileUri),
        detectedAt: event.firstSeen,
        status: event.status,
      });
    }

    refreshLoopState();
    const metrics = sessionTracker.getMetrics();
    const activeLoops = getActiveLoops();

    const liveConfig = getConfig(); // read live — never stale captured config
    if (!liveConfig.enableNotifications || events.length === 0) return;

    const first = events[0];
    if (first === undefined) return;

    const action = await alertPanel.showLoopAlert(first, metrics);

    if (action === 'view-details') {
      DashboardPanel.show(context.extensionUri, sessionTracker.getMetrics(), activeLoops);
    } else if (action === 'ignore') {
      loopEngine.resolveLoop(first.errorHash);
      editTracker.resolveLoop(first.errorHash);
      editTracker.clearUri(first.fileUri);
      refreshLoopState();
    }

    statusBar.update(sessionTracker.getMetrics(), getActiveLoops().length);
  };

  /* ── Listeners ────────────────────────────────────────────────── */
  const diagnosticListener = new DiagnosticListener(loopEngine, (events) => {
    onLoopDetected(events).catch((err) =>
      logger.error('Diagnostic loop handler error', { err }),
    );
  }, refreshLoopState);

  const fileListener = new FileListener(contextEngine, editTracker, (event) => {
    onLoopDetected([event]).catch((err) =>
      logger.error('Edit loop handler error', { err }),
    );
  }, refreshLoopState);

  /* ── URI handler — receives auth callback from web app ────────── */
  // Handles: vscode://LoopGuard.loopguard/auth?code=CODE&email=user@example.com
  const uriHandler = vscode.window.registerUriHandler({
    handleUri(uri: vscode.Uri) {
      if (uri.path !== '/auth') return;
      const params = new URLSearchParams(uri.query);
      const code = params.get('code');
      const email = params.get('email') ?? 'unknown';

      if (code === null || code.length === 0) {
        vscode.window.showErrorMessage('LoopGuard: Auth callback missing code. Please try signing in again.');
        return;
      }

      authService.handleCallback(code, email).catch((err) =>
        logger.error('Auth callback failed', { err }),
      );
    },
  });

  /* ── Commands ─────────────────────────────────────────────────── */

  const showDashboard = vscode.commands.registerCommand('loopguard.showDashboard', () => {
    DashboardPanel.show(
      context.extensionUri,
      sessionTracker.getMetrics(),
      getActiveLoops(),
    );
  });

  const resetSession = vscode.commands.registerCommand('loopguard.resetSession', () => {
    loopEngine.reset();
    contextEngine.clearCache();
    sessionTracker.reset();
    editTracker.reset();
    sessionTracker.startSession();
    statusBar.update(sessionTracker.getMetrics(), 0);
    DashboardPanel.update(sessionTracker.getMetrics(), []);
    vscode.window.showInformationMessage('LoopGuard: Session reset.');
  });

  let detectionEnabled = true;
  const toggleDetection = vscode.commands.registerCommand('loopguard.toggleDetection', () => {
    detectionEnabled = !detectionEnabled;
    loopEngine.setEnabled(detectionEnabled);
    statusBar.setDetectionEnabled(detectionEnabled);
    vscode.window.showInformationMessage(
      `LoopGuard: Detection ${detectionEnabled ? 'enabled' : 'paused'}.`,
    );
  });

  // Copy Optimized Context — native helper when available, built-in mode otherwise
  const copyContext = vscode.commands.registerCommand('loopguard.copyContext', async () => {
    const editor = vscode.window.activeTextEditor;
    if (editor === undefined) {
      vscode.window.showWarningMessage('LoopGuard: No active editor.');
      return;
    }

    try {
      const snapshot = await contextEngine.getSnapshotAsync(editor.document);
      const contextText = [
        snapshot.imports ? `// Imports\n${snapshot.imports}` : '',
        snapshot.relevantLines,
      ]
        .filter(Boolean)
        .join('\n\n');

      await vscode.env.clipboard.writeText(contextText);

      const fullTokens = estimateTokens(editor.document.getText());
      const saved = Math.max(0, fullTokens - snapshot.tokenEstimate);
      const pct = fullTokens > 0 ? Math.round((saved / fullTokens) * 100) : 0;
      const engine = (await contextEngine.isBinaryAvailable()) ? 'native helper' : 'built-in mode';

      sessionTracker.addTokensSaved(saved);
      refreshLoopState();

      vscode.window.showInformationMessage(
        `LoopGuard: Focused context copied via ${engine} (${snapshot.tokenEstimate} tokens · ${pct}% smaller).`,
      );
    } catch (err) {
      logger.error('copyContext failed', { err });
      vscode.window.showErrorMessage('LoopGuard: Failed to copy context.');
    }
  });

  // Sign In — opens browser → web app → URI callback
  const signIn = vscode.commands.registerCommand('loopguard.signIn', async () => {
    if (authService.isSignedIn) {
      vscode.window.showInformationMessage(
        `LoopGuard: Already signed in as ${authService.userEmail ?? 'unknown'}.`,
      );
      return;
    }
    await authService.signIn();
  });

  // Sign Out
  const signOut = vscode.commands.registerCommand('loopguard.signOut', async () => {
    if (!authService.isSignedIn) {
      vscode.window.showInformationMessage('LoopGuard: Not signed in.');
      return;
    }
    await authService.signOut();
  });

  // MCP Server Setup — requires loopguard-ctx binary
  const setupMCP = vscode.commands.registerCommand('loopguard.setupMCP', async () => {
    // Agent keys must match what setup.rs:build_targets() expects for --agent=<key>
    const agents = [
      { label: '$(github) Claude Code', description: '~/.claude.json', value: 'claude' },
      { label: '$(edit) Cursor', description: '~/.cursor/mcp.json', value: 'cursor' },
      { label: '$(cloud) Windsurf', description: '~/.codeium/windsurf/mcp_config.json', value: 'windsurf' },
      { label: '$(terminal) Codex CLI', description: '~/.codex/config.toml', value: 'codex' },
      { label: '$(zap) Zed', description: '~/.config/zed/settings.json', value: 'zed' },
      { label: '$(code) VS Code / Copilot', description: 'User mcp.json', value: 'vscode' },
      { label: '$(list-unordered) All detected editors', description: 'Auto-configure everything', value: '' },
    ];
    const pick = await vscode.window.showQuickPick(agents, {
      placeHolder: 'Configure MCP for which AI tool?',
      matchOnDescription: true,
    });
    if (pick === undefined) return;

    if (!(await contextEngine.isBinaryAvailable())) {
      const action = await vscode.window.showErrorMessage(
        'LoopGuard: The loopguard-ctx binary is not yet installed. It ships automatically when you install from the VS Code Marketplace. If you installed manually, download the platform-specific VSIX from GitHub Releases.',
        'GitHub Releases',
        'Cancel',
      );
      if (action === 'GitHub Releases') {
        await vscode.env.openExternal(vscode.Uri.parse(BINARY_DOWNLOAD_URL));
      }
      return;
    }

    try {
      const binary = await contextEngine.getResolvedBinaryPath();
      if (binary === null) {
        vscode.window.showErrorMessage('LoopGuard: loopguard-ctx binary not found.');
        return;
      }
      const args = pick.value ? ['setup', `--agent=${pick.value}`] : ['setup'];
      const label = pick.value ? pick.label.replace(/^\$\([^)]+\)\s*/, '') : 'all detected editors';
      await vscode.window.withProgress(
        { location: vscode.ProgressLocation.Notification, title: `Configuring MCP for ${label}…` },
        async () => {
          await execFileAsync(binary, args, { timeout: 15000 });
        },
      );
      vscode.window.showInformationMessage(
        `LoopGuard MCP configured for ${label}. Restart your AI tool to activate the context engine.`,
      );
      logger.info('MCP setup complete', { agent: pick.value });
    } catch (err) {
      logger.error('MCP setup failed', { err });
      vscode.window.showErrorMessage('LoopGuard: MCP setup failed. Check Output → LoopGuard.');
    }
  });

  // Shell Hooks Setup — requires loopguard-ctx binary
  const setupShellHooks = vscode.commands.registerCommand('loopguard.setupShellHooks', async () => {
    if (!(await contextEngine.isBinaryAvailable())) {
      const action = await vscode.window.showErrorMessage(
        'LoopGuard: The loopguard-ctx binary is not yet installed. It ships automatically when you install from the VS Code Marketplace. If you installed manually, download the platform-specific VSIX from GitHub Releases.',
        'GitHub Releases',
        'Cancel',
      );
      if (action === 'GitHub Releases') {
        await vscode.env.openExternal(vscode.Uri.parse(BINARY_DOWNLOAD_URL));
      }
      return;
    }

    try {
      const binary = await contextEngine.getResolvedBinaryPath();
      if (binary === null) {
        vscode.window.showErrorMessage('LoopGuard: loopguard-ctx binary not found.');
        return;
      }
      await vscode.window.withProgress(
        { location: vscode.ProgressLocation.Notification, title: 'Installing shell hooks…' },
        async () => {
          await execFileAsync(binary, ['init'], { timeout: 10000 });
        },
      );
      vscode.window.showInformationMessage(
        'LoopGuard: Shell hooks installed. Restart your terminal.',
      );
      logger.info('Shell hooks installed');
    } catch (err) {
      logger.error('Shell hooks setup failed', { err });
      vscode.window.showErrorMessage('LoopGuard: Shell hooks setup failed. Check Output → LoopGuard.');
    }
  });

  // Config watcher
  const configWatcher = onConfigChange((newConfig) => {
    loopEngine.updateConfig(newConfig);
    contextEngine.updateConfig(newConfig);
    logger.info('Config updated', { sensitivity: newConfig.sensitivity });
  });

  // Expose syncSession to deactivate() for final end-of-session payload
  _syncFinalSession = (endedAt: number) => syncSession(endedAt);

  // Periodic session sync — sends latest metrics every 5 minutes
  const syncTimer = setInterval(() => syncSession(), SYNC_INTERVAL_MS);

  // Dashboard UI refresh — ticks the session timer and metrics every 30s
  // Only re-renders if the panel is open (DashboardPanel.update is a no-op otherwise)
  const UI_REFRESH_MS = 30_000;
  const uiRefreshTimer = setInterval(() => refreshLoopState(), UI_REFRESH_MS);

  // Immediate session sync after auth initializes (gives web dashboard data right away)
  setTimeout(() => syncSession(), 3_000);

  /* ── Subscriptions ────────────────────────────────────────────── */
  context.subscriptions.push(
    statusBar,
    uriHandler,
    diagnosticListener.activate(),
    fileListener.activate(),
    showDashboard,
    resetSession,
    toggleDetection,
    copyContext,
    signIn,
    signOut,
    setupMCP,
    setupShellHooks,
    configWatcher,
    { dispose: () => { clearInterval(syncTimer); } },
    { dispose: () => { clearInterval(uiRefreshTimer); } },
    { dispose: () => DashboardPanel.dispose() },
    { dispose: () => logger.dispose() },
  );

  /* ── First install welcome ────────────────────────────────────── */
  if (context.globalState.get<boolean>(FIRST_INSTALL_KEY) !== false) {
    alertPanel.showWelcome();
    void context.globalState.update(FIRST_INSTALL_KEY, false);
  }

  /* ── Set loopguard.active context key ────────────────────────── */
  vscode.commands.executeCommand('setContext', 'loopguard.active', true).then(
    undefined,
    (err) => logger.error('setContext failed', { err }),
  );

  logger.info('LoopGuard activated', {
    sensitivity: config.sensitivity,
    authenticated: authService.isSignedIn,
  });
}

/* ── deactivate ────────────────────────────────────────────────────*/
export function deactivate(): void {
  // Send final session payload with endedAt so history is accurate
  _syncFinalSession?.(Date.now());

  vscode.commands.executeCommand('setContext', 'loopguard.active', false).then(
    undefined,
    () => undefined,
  );
  // Subscriptions (timer, dashboard, logger) disposed automatically
}
