import * as vscode from 'vscode';
import type { LoopEvent, SessionMetrics } from '@loopguard/types';
import { formatDuration } from '@loopguard/utils';
import type { DashboardSummary } from '../services/apiClient';

/**
 * SidebarPanel — persistent WebviewView in the Activity Bar.
 *
 * Shows a compact real-time view of session metrics, active loops, and
 * quick-action buttons. Always visible without opening an editor tab.
 *
 * Architecture:
 *   - Implements WebviewViewProvider (VS Code calls resolveWebviewView once)
 *   - update() re-renders the HTML whenever loop state or metrics change
 *   - Messages from the webview are dispatched as VS Code commands
 */
export class SidebarPanel implements vscode.WebviewViewProvider {
  public static readonly VIEW_ID = 'loopguard.sidebar';

  private _view?: vscode.WebviewView;
  private _metrics: SessionMetrics | null = null;
  private _activeLoops: LoopEvent[] = [];
  private _summary: DashboardSummary | null = null;
  private _engineTier: 'rust' | 'ts' = 'ts';
  private _isAuthenticated = false;
  private _userEmail: string | null = null;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken,
  ): void {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._buildHtml();

    webviewView.webview.onDidReceiveMessage((msg: { type: string; id?: string }) => {
      if (msg.type === 'command' && typeof msg.id === 'string') {
        vscode.commands.executeCommand(msg.id).then(undefined, () => undefined);
      }
    });
  }

  setEngineTier(tier: 'rust' | 'ts'): void {
    this._engineTier = tier;
  }

  setAuthState(authenticated: boolean, email: string | null): void {
    this._isAuthenticated = authenticated;
    this._userEmail = email;
  }

  update(
    metrics: SessionMetrics,
    activeLoops: LoopEvent[],
    summary: DashboardSummary | null,
  ): void {
    this._metrics = metrics;
    this._activeLoops = activeLoops;
    this._summary = summary;

    if (this._view !== undefined) {
      this._view.webview.html = this._buildHtml();
    }
  }

  private _buildHtml(): string {
    const m = this._metrics;
    const loops = this._activeLoops;
    const sum = this._summary;

    const sessionTime = m !== null ? formatDuration(Date.now() - m.startTime) : '—';
    const totalLoops = m !== null ? m.totalLoopsDetected : 0;
    const timeWasted = m !== null ? this._fmtMs(m.totalTimeWasted) : '—';
    // All-time savings from web summary; fall back to current session while loading
    const allTimeTokens = sum !== null
      ? this._fmt(sum.allTime.tokensSaved)
      : m !== null ? this._fmt(m.tokensSaved) : '—';
    const allTimeCost = sum !== null ? `$${sum.allTime.costSaved.toFixed(2)}` : null;

    const activeCount = loops.length;
    const hasActive = activeCount > 0;

    const loopRows = loops.slice(0, 5).map((l) => {
      const wasted = this._fmtMs(l.lastSeen - l.firstSeen);
      const hash = l.errorHash.slice(0, 8);
      return `
        <div class="loop-row">
          <div class="loop-left">
            <span class="hash">${this._esc(hash)}</span>
            <span class="reps">${l.occurrences}×</span>
          </div>
          <div class="loop-right">
            <span class="wasted">${this._esc(wasted)}</span>
            <span class="pill active">active</span>
          </div>
        </div>`;
    }).join('');

    const authSection = this._isAuthenticated
      ? `<div class="auth-row signed-in">
           <span class="dot-green"></span>
           <span class="auth-email">${this._esc(this._userEmail ?? 'signed in')}</span>
           <button class="btn-ghost" onclick="cmd('loopguard.signOut')">Sign out</button>
         </div>`
      : `<button class="btn-primary" onclick="cmd('loopguard.signIn')">
           Sign in to sync dashboard
         </button>`;

    const engineBadge = this._engineTier === 'rust'
      ? `<span class="badge badge-rust">Rust engine</span>`
      : `<span class="badge badge-ts">TS engine</span>`;

    return /* html */`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline';">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #050B14;
    color: #94A3B8;
    font-family: var(--vscode-font-family, -apple-system, sans-serif);
    font-size: 11px;
    line-height: 1.5;
    padding: 0;
    overflow-x: hidden;
  }

  /* ── Header ── */
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 12px 8px;
    border-bottom: 1px solid #1A2740;
  }
  .header-left { display: flex; align-items: center; gap: 6px; }
  .status-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: ${hasActive ? '#F87171' : '#34D399'};
    ${hasActive ? 'animation: pulse 1.5s ease-in-out infinite;' : ''}
  }
  .status-label {
    font-size: 10px; font-weight: 600; letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${hasActive ? '#F87171' : '#34D399'};
  }

  /* ── KPI grid ── */
  .kpis {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1px;
    background: #1A2740;
    border-bottom: 1px solid #1A2740;
  }
  .kpi {
    background: #050B14;
    padding: 10px 12px;
  }
  .kpi-label {
    font-size: 9px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.15em;
    color: #334155;
    margin-bottom: 3px;
  }
  .kpi-value {
    font-family: var(--vscode-editor-font-family, 'Menlo', monospace);
    font-size: 15px; font-weight: 700;
    color: ${hasActive ? '#FBBF24' : '#E2E8F0'};
    tabular-nums: auto;
  }
  .kpi-value.cyan { color: #22D3EE; }
  .kpi-value.green { color: #34D399; }

  /* ── Section ── */
  .section { padding: 10px 12px; }
  .section-title {
    font-size: 9px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.15em;
    color: #334155;
    margin-bottom: 8px;
  }

  /* ── Loop rows ── */
  .loop-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 0;
    border-bottom: 1px solid #0D1826;
  }
  .loop-row:last-child { border-bottom: none; }
  .loop-left { display: flex; align-items: center; gap: 6px; }
  .loop-right { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
  .hash {
    font-family: var(--vscode-editor-font-family, 'Menlo', monospace);
    font-size: 10px; color: #94A3B8;
  }
  .reps { font-size: 10px; color: #475569; }
  .wasted { font-size: 10px; color: #FBBF24; }
  .pill {
    font-size: 9px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.06em;
    border-radius: 9999px; padding: 1px 6px;
  }
  .pill.active { background: rgba(239,68,68,0.12); color: #F87171; border: 1px solid rgba(239,68,68,0.2); }

  .no-loops {
    color: #334155; font-size: 11px;
    display: flex; align-items: center; gap: 6px; padding: 4px 0;
  }
  .check-icon { color: #34D399; }

  /* ── Savings ── */
  .savings-row {
    display: flex; justify-content: space-between; align-items: baseline;
    padding: 4px 0;
  }
  .savings-label { color: #475569; font-size: 10px; }
  .savings-value { font-family: var(--vscode-editor-font-family, 'Menlo', monospace); color: #22D3EE; font-size: 11px; font-weight: 700; }
  .savings-value.green { color: #34D399; }

  /* ── Buttons ── */
  .btn-row { display: flex; flex-direction: column; gap: 6px; }
  .btn-action {
    width: 100%;
    padding: 7px 10px;
    background: #0D1826;
    border: 1px solid #1A2740;
    border-radius: 8px;
    color: #94A3B8;
    font-size: 11px;
    cursor: pointer;
    text-align: left;
    display: flex; align-items: center; gap: 8px;
    transition: border-color 0.15s, color 0.15s;
  }
  .btn-action:hover { border-color: #22D3EE; color: #E2E8F0; }
  .btn-action .icon { font-size: 13px; }

  .btn-primary {
    width: 100%;
    padding: 8px 10px;
    background: rgba(34,211,238,0.08);
    border: 1px solid rgba(34,211,238,0.25);
    border-radius: 8px;
    color: #22D3EE;
    font-size: 11px; font-weight: 600;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s;
  }
  .btn-primary:hover { background: rgba(34,211,238,0.14); border-color: rgba(34,211,238,0.4); }

  .btn-ghost {
    background: none; border: none;
    color: #475569; font-size: 10px;
    cursor: pointer; padding: 0; margin-left: auto;
    transition: color 0.15s;
  }
  .btn-ghost:hover { color: #94A3B8; }

  /* ── Auth row ── */
  .auth-row {
    display: flex; align-items: center; gap: 6px;
  }
  .auth-row.signed-in { padding: 2px 0; }
  .dot-green {
    width: 5px; height: 5px; border-radius: 50%;
    background: #34D399; flex-shrink: 0;
  }
  .auth-email { color: #475569; font-size: 10px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  /* ── Badges ── */
  .badge {
    font-size: 9px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.08em; border-radius: 4px; padding: 2px 5px;
  }
  .badge-rust { background: rgba(251,146,60,0.12); color: #FB923C; border: 1px solid rgba(251,146,60,0.2); }
  .badge-ts { background: rgba(96,165,250,0.1); color: #60A5FA; border: 1px solid rgba(96,165,250,0.15); }

  /* ── Divider ── */
  .divider { height: 1px; background: #0D1826; margin: 0 12px; }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }
</style>
</head>
<body>

<!-- Header -->
<div class="header">
  <div class="header-left">
    <span class="status-dot"></span>
    <span class="status-label">${hasActive ? `${activeCount} loop${activeCount > 1 ? 's' : ''}` : 'Clean'}</span>
  </div>
  ${engineBadge}
</div>

<!-- KPI grid -->
<div class="kpis">
  <div class="kpi">
    <div class="kpi-label">Session</div>
    <div class="kpi-value">${this._esc(sessionTime)}</div>
  </div>
  <div class="kpi">
    <div class="kpi-label">Loops</div>
    <div class="kpi-value">${totalLoops}</div>
  </div>
  <div class="kpi">
    <div class="kpi-label">Time lost</div>
    <div class="kpi-value">${this._esc(timeWasted)}</div>
  </div>
  <div class="kpi">
    <div class="kpi-label">Tok saved</div>
    <div class="kpi-value cyan">${this._esc(allTimeTokens)}</div>
  </div>
</div>

<!-- Active loops -->
<div class="section">
  <div class="section-title">Active Loops</div>
  ${hasActive
    ? loopRows
    : `<div class="no-loops"><span class="check-icon">✓</span> No active loops</div>`}
</div>

<div class="divider"></div>

<!-- All-time savings (always shown when authenticated, syncing state if no data yet) -->
${this._isAuthenticated ? `
<div class="section">
  <div class="section-title">All-time savings</div>
  ${sum !== null ? `
  <div class="savings-row">
    <span class="savings-label">Tokens saved</span>
    <span class="savings-value">${this._esc(allTimeTokens)}</span>
  </div>
  ${allTimeCost !== null ? `
  <div class="savings-row">
    <span class="savings-label">Cost avoided</span>
    <span class="savings-value green">${this._esc(allTimeCost)}</span>
  </div>` : ''}` : `
  <div class="savings-row">
    <span class="savings-label" style="color:#475569;font-style:italic">Syncing from dashboard…</span>
  </div>`}
</div>
<div class="divider"></div>` : ''}

<!-- Actions -->
<div class="section">
  <div class="btn-row">
    <button class="btn-action" onclick="cmd('loopguard.copyContext')">
      <span class="icon">⊕</span> Copy Optimized Context
    </button>
    <button class="btn-action" onclick="cmd('loopguard.showDashboard')">
      <span class="icon">◫</span> Open Session Dashboard
    </button>
    <button class="btn-action" onclick="cmd('loopguard.resetSession')">
      <span class="icon">↺</span> Reset Session
    </button>
  </div>
</div>

<div class="divider"></div>

<!-- Auth -->
<div class="section">
  ${authSection}
</div>

<script>
  const vscode = acquireVsCodeApi();
  function cmd(id) { vscode.postMessage({ type: 'command', id }); }
</script>
</body>
</html>`;
  }

  private _fmtMs(ms: number): string {
    const min = Math.round(ms / 60_000);
    if (min >= 60) return `${Math.floor(min / 60)}h ${min % 60}m`;
    return `${min}min`;
  }

  private _fmt(n: number): string {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
    return String(n);
  }

  private _esc(s: string): string {
    return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}
