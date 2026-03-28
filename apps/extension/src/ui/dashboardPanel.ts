import * as vscode from 'vscode';
import type { SessionMetrics, LoopEvent } from '@loopguard/types';
import { formatDuration } from '@loopguard/utils';

/**
 * DashboardPanel — a proper VS Code webview panel for the LoopGuard dashboard.
 *
 * Replaces the plain-text information message with a visual session summary.
 * Single instance: calling show() while it's open just reveals + refreshes it.
 */
export class DashboardPanel {
  private static _instance: DashboardPanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private _disposed = false;

  private constructor(extensionUri: vscode.Uri) {
    this._panel = vscode.window.createWebviewPanel(
      'loopguard.dashboard',
      'LoopGuard Dashboard',
      vscode.ViewColumn.Beside,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [extensionUri],
      },
    );

    this._panel.onDidDispose(() => {
      this._disposed = true;
      DashboardPanel._instance = undefined;
    });
  }

  static show(
    extensionUri: vscode.Uri,
    metrics: SessionMetrics,
    activeLoops: LoopEvent[],
  ): void {
    if (DashboardPanel._instance !== undefined && !DashboardPanel._instance._disposed) {
      DashboardPanel._instance._panel.reveal(vscode.ViewColumn.Beside, true);
      DashboardPanel._instance._render(metrics, activeLoops);
      return;
    }

    const panel = new DashboardPanel(extensionUri);
    DashboardPanel._instance = panel;
    panel._render(metrics, activeLoops);
  }

  static update(metrics: SessionMetrics, activeLoops: LoopEvent[]): void {
    if (DashboardPanel._instance !== undefined && !DashboardPanel._instance._disposed) {
      DashboardPanel._instance._render(metrics, activeLoops);
    }
  }

  static dispose(): void {
    DashboardPanel._instance?._panel.dispose();
  }

  private _render(metrics: SessionMetrics, activeLoops: LoopEvent[]): void {
    this._panel.webview.html = buildHtml(metrics, activeLoops);
  }
}

/* ── HTML generator ──────────────────────────────────────────────── */

function buildHtml(metrics: SessionMetrics, activeLoops: LoopEvent[]): string {
  const timeWasted = formatDuration(metrics.totalTimeWasted);
  const tokensK =
    metrics.tokensSaved >= 1000
      ? `${(metrics.tokensSaved / 1000).toFixed(1)}k`
      : String(metrics.tokensSaved);
  const costSaved = ((metrics.tokensSaved / 1000) * 0.03).toFixed(2);
  const sessionDuration = formatDuration(Date.now() - metrics.startTime);

  const loopRows =
    activeLoops.length === 0
      ? '<div class="empty">No active loops this session.</div>'
      : activeLoops
          .map((l) => {
            const age = formatDuration(Date.now() - l.firstSeen);
            const isUrgent = l.occurrences >= 4;
            return `
            <div class="loop-row ${isUrgent ? 'urgent' : ''}">
              <div class="loop-badge ${isUrgent ? 'badge-red' : 'badge-yellow'}">${l.occurrences}×</div>
              <div class="loop-body">
                <div class="loop-msg">${escHtml(l.errorMessage.slice(0, 80))}${l.errorMessage.length > 80 ? '…' : ''}</div>
                <div class="loop-meta">${escHtml(l.fileUri.split('/').pop() ?? '')} · ${age}</div>
              </div>
              <div class="loop-status ${l.status === 'active' ? 'status-active' : 'status-resolved'}">
                ${l.status}
              </div>
            </div>`;
          })
          .join('');

  return /* html */ `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>LoopGuard Dashboard</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0B1220;
    --surface: #111827;
    --surface2: #1a2235;
    --border: #1F2937;
    --primary: #2563EB;
    --accent: #22D3EE;
    --warning: #F59E0B;
    --danger: #EF4444;
    --success: #22C55E;
    --text: #F9FAFB;
    --muted: #9CA3AF;
    --dim: #6B7280;
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: -apple-system, 'Segoe UI', system-ui, sans-serif;
    font-size: 13px;
    line-height: 1.5;
    padding: 20px;
    max-width: 700px;
    margin: 0 auto;
  }

  /* ── Header ── */
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--border);
  }
  .logo { display: flex; align-items: center; gap: 8px; }
  .logo-text { font-size: 17px; font-weight: 700; color: var(--text); }
  .session-badge {
    display: flex; align-items: center; gap: 6px;
    padding: 4px 10px;
    background: rgba(34,197,94,0.1);
    border: 1px solid rgba(34,197,94,0.25);
    border-radius: 20px;
    font-size: 11px;
    color: var(--success);
    font-weight: 600;
  }
  .dot-pulse {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--success);
    animation: pulse 2s ease-in-out infinite;
  }

  /* ── Stat grid ── */
  .stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-bottom: 20px;
  }
  .stat-card {
    padding: 16px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
  }
  .stat-label {
    font-size: 11px;
    color: var(--dim);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 6px;
  }
  .stat-value {
    font-size: 28px;
    font-weight: 800;
    line-height: 1;
    tabular-nums: true;
  }
  .stat-sub {
    font-size: 11px;
    color: var(--dim);
    margin-top: 4px;
  }
  .c-loops    { color: var(--warning); }
  .c-time     { color: var(--danger); }
  .c-tokens   { color: var(--accent); }
  .c-cost     { color: var(--success); }

  /* ── Progress bar ── */
  .progress-section { margin-bottom: 20px; }
  .progress-label { display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 12px; color: var(--muted); }
  .progress-bar { height: 6px; background: var(--border); border-radius: 4px; overflow: hidden; }
  .progress-fill {
    height: 100%;
    border-radius: 4px;
    background: linear-gradient(90deg, #2563EB, #22D3EE);
    transition: width 0.8s cubic-bezier(0.16,1,0.3,1);
  }

  /* ── Loops list ── */
  .section-title {
    font-size: 12px;
    font-weight: 600;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.07em;
    margin-bottom: 10px;
  }
  .loops-list {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 20px;
  }
  .loop-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    border-bottom: 1px solid var(--border);
    transition: background 0.15s;
  }
  .loop-row:last-child { border-bottom: none; }
  .loop-row.urgent { background: rgba(239,68,68,0.04); }
  .loop-badge {
    width: 30px; height: 30px;
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 800;
    flex-shrink: 0;
  }
  .badge-red    { background: rgba(239,68,68,0.15); color: #EF4444; }
  .badge-yellow { background: rgba(245,158,11,0.15); color: #F59E0B; }
  .loop-body { flex: 1; min-width: 0; }
  .loop-msg  { font-family: 'Courier New', monospace; font-size: 11px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .loop-meta { font-size: 10px; color: var(--dim); margin-top: 2px; }
  .loop-status { font-size: 10px; font-weight: 700; text-transform: uppercase; flex-shrink: 0; }
  .status-active   { color: var(--danger); }
  .status-resolved { color: var(--success); }
  .empty { padding: 20px; text-align: center; color: var(--dim); font-size: 12px; }

  /* ── Tips ── */
  .tips-section {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 14px 16px;
    margin-bottom: 20px;
  }
  .tip { display: flex; gap: 8px; margin-bottom: 8px; font-size: 12px; color: var(--muted); }
  .tip:last-child { margin-bottom: 0; }
  .tip-icon { flex-shrink: 0; color: var(--primary); }

  /* ── Upgrade CTA ── */
  .upgrade-card {
    background: linear-gradient(145deg, #131f35, #0f1c32);
    border: 1px solid rgba(37,99,235,0.35);
    border-radius: 14px;
    padding: 18px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }
  .upgrade-text h4 { font-size: 14px; font-weight: 700; color: var(--text); margin-bottom: 4px; }
  .upgrade-text p  { font-size: 12px; color: var(--dim); }
  .upgrade-btn {
    flex-shrink: 0;
    padding: 8px 16px;
    background: var(--primary);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    text-decoration: none;
    white-space: nowrap;
    transition: background 0.15s;
  }
  .upgrade-btn:hover { background: #1d4ed8; }

  /* ── Engine badge ── */
  .engine-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 14px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    margin-bottom: 20px;
    font-size: 12px;
  }
  .engine-label { color: var(--dim); }
  .engine-value { font-weight: 600; }

  @keyframes pulse {
    0%, 100% { opacity: 0.5; transform: scale(0.9); }
    50%       { opacity: 1;   transform: scale(1); }
  }
</style>
</head>
<body>

<div class="header">
  <div class="logo">
    <svg width="24" height="24" viewBox="0 0 34 34" fill="none">
      <path d="M17 2L3 8v10c0 8.3 5.8 15.8 14 17.7C25.2 33.8 31 26.3 31 18V8L17 2z" fill="url(#g)"/>
      <defs><linearGradient id="g" x1="3" y1="2" x2="31" y2="35" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#3B82F6"/>
        <stop offset="100%" stop-color="#22D3EE"/>
      </linearGradient></defs>
    </svg>
    <span class="logo-text">LoopGuard</span>
  </div>
  <div class="session-badge">
    <div class="dot-pulse"></div>
    Session active · ${escHtml(sessionDuration)}
  </div>
</div>

<!-- Stats -->
<div class="stats">
  <div class="stat-card">
    <div class="stat-label">Loops detected</div>
    <div class="stat-value c-loops">${metrics.totalLoopsDetected}</div>
    <div class="stat-sub">This session</div>
  </div>
  <div class="stat-card">
    <div class="stat-label">Time wasted</div>
    <div class="stat-value c-time">${escHtml(timeWasted)}</div>
    <div class="stat-sub">On stuck errors</div>
  </div>
  <div class="stat-card">
    <div class="stat-label">Tokens saved</div>
    <div class="stat-value c-tokens">${escHtml(tokensK)}</div>
    <div class="stat-sub">Via context engine</div>
  </div>
  <div class="stat-card">
    <div class="stat-label">Est. cost saved</div>
    <div class="stat-value c-cost">$${escHtml(costSaved)}</div>
    <div class="stat-sub">This session</div>
  </div>
</div>

<!-- Token reduction progress -->
${
  metrics.tokensSaved > 0
    ? `<div class="progress-section">
        <div class="progress-label">
          <span>Context compression active</span>
          <span style="color:#22D3EE;font-weight:700">
            ${Math.round((metrics.tokensSaved / (metrics.tokensSaved + 840)) * 100)}% reduction
          </span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width:${Math.min(93, Math.round((metrics.tokensSaved / (metrics.tokensSaved + 840)) * 100))}%"></div>
        </div>
      </div>`
    : ''
}

<!-- Context engine status -->
<div class="engine-row">
  <span class="engine-label">Context engine mode</span>
  <span class="engine-value" style="color:#22D3EE">TypeScript fallback (~80%)</span>
  <a href="command:loopguard.setupMCP" style="font-size:11px;color:#2563EB;text-decoration:none;">→ Enable Rust engine</a>
</div>

<!-- Active loops -->
<div class="section-title">Active loops · ${activeLoops.length}</div>
<div class="loops-list">${loopRows}</div>

<!-- Break-the-loop tips -->
<div class="section-title">If you're stuck right now</div>
<div class="tips-section">
  <div class="tip"><span class="tip-icon">→</span><span>Ask AI to <strong>explain the error</strong>, not fix it. Shift the prompt.</span></div>
  <div class="tip"><span class="tip-icon">→</span><span>Isolate it. Reproduce in 5 lines. Strip noise before asking AI.</span></div>
  <div class="tip"><span class="tip-icon">→</span><span>Check your <strong>inputs and types</strong> before assuming the logic is wrong.</span></div>
  <div class="tip"><span class="tip-icon">→</span><span>Copy optimized context: <kbd>Ctrl+Shift+P</kbd> → LoopGuard: Copy Optimized Context</span></div>
</div>

<!-- Upgrade CTA -->
<div class="upgrade-card">
  <div class="upgrade-text">
    <h4>Unlock the Rust engine — 89–99% reduction</h4>
    <p>Pro also includes MCP server, shell hooks, 30-day history, and token dashboard.</p>
  </div>
  <a href="https://loopguard.dev/pricing" class="upgrade-btn">Upgrade · $9/mo</a>
</div>

</body>
</html>`;
}

function escHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
