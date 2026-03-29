import * as vscode from 'vscode';
import type { LoopEvent, SessionMetrics } from '@loopguard/types';
import { formatDuration } from '@loopguard/utils';

export class DashboardPanel {
  private static _instance: DashboardPanel | undefined;
  private static _engineTier: 'rust' | 'ts' = 'ts';
  private readonly _panel: vscode.WebviewPanel;
  private _disposed = false;

  private constructor(extensionUri: vscode.Uri) {
    this._panel = vscode.window.createWebviewPanel(
      'loopguard.dashboard',
      'LoopGuard Dashboard',
      vscode.ViewColumn.Beside,
      {
        enableScripts: true,
        enableCommandUris: true,
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

  static setEngineTier(tier: 'rust' | 'ts'): void {
    DashboardPanel._engineTier = tier;
  }

  static dispose(): void {
    DashboardPanel._instance?._panel.dispose();
  }

  private _render(metrics: SessionMetrics, activeLoops: LoopEvent[]): void {
    this._panel.webview.html = buildHtml(
      this._panel.webview,
      metrics,
      activeLoops,
      DashboardPanel._engineTier,
    );
  }
}

function buildHtml(
  webview: vscode.Webview,
  metrics: SessionMetrics,
  activeLoops: LoopEvent[],
  engineTier: 'rust' | 'ts',
): string {
  const sessionDuration = formatDuration(Date.now() - metrics.startTime);
  const timeWasted = formatDuration(metrics.totalTimeWasted);
  const tokensSaved = formatCompactNumber(metrics.tokensSaved);
  const costSaved = ((metrics.tokensSaved / 1000) * 0.03).toFixed(2);
  const activeCount = activeLoops.filter((loop) => loop.status === 'active').length;
  const headline = getHeadline(activeLoops, metrics);
  const csp = [
    `default-src 'none'`,
    `style-src 'unsafe-inline'`,
    `img-src ${webview.cspSource} https: data:`,
    `script-src 'none'`,
  ].join('; ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta http-equiv="Content-Security-Policy" content="${csp}" />
<title>LoopGuard Dashboard</title>
<style>
  *, *::before, *::after { box-sizing: border-box; }

  :root {
    --bg: var(--vscode-editor-background, #0B1220);
    --panel: color-mix(in srgb, var(--vscode-sideBar-background, #101826) 82%, #08111c 18%);
    --panel-strong: color-mix(in srgb, var(--vscode-sideBar-background, #101826) 64%, #0f1b2d 36%);
    --panel-soft: color-mix(in srgb, var(--vscode-editor-background, #0B1220) 72%, #142239 28%);
    --border: color-mix(in srgb, var(--vscode-panel-border, #1F2937) 78%, #263449 22%);
    --border-strong: color-mix(in srgb, var(--vscode-focusBorder, #2563EB) 26%, #2e3f56 74%);
    --text: var(--vscode-editor-foreground, #E5E7EB);
    --muted: color-mix(in srgb, var(--vscode-descriptionForeground, #9CA3AF) 90%, #9CA3AF 10%);
    --dim: color-mix(in srgb, var(--vscode-descriptionForeground, #6B7280) 86%, #6B7280 14%);
    --primary: #2563EB;
    --accent: #22D3EE;
    --warning: #F59E0B;
    --danger: #EF4444;
    --success: #10B981;
    --shadow: 0 30px 80px rgba(0, 0, 0, 0.28);
  }

  html, body {
    margin: 0;
    min-height: 100%;
    background:
      radial-gradient(circle at top right, rgba(34, 211, 238, 0.14), transparent 38%),
      radial-gradient(circle at top left, rgba(37, 99, 235, 0.16), transparent 34%),
      var(--bg);
    color: var(--text);
    font-family: var(--vscode-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif);
    font-size: var(--vscode-font-size, 13px);
    line-height: 1.5;
  }

  body {
    padding: 18px;
  }

  .shell {
    max-width: 980px;
    margin: 0 auto;
    display: grid;
    gap: 16px;
  }

  .hero,
  .section,
  .sidebar-card {
    border: 1px solid var(--border);
    background: linear-gradient(145deg, rgba(12, 22, 37, 0.96), rgba(9, 17, 30, 0.84));
    border-radius: 26px;
    box-shadow: var(--shadow);
  }

  .hero {
    position: relative;
    overflow: hidden;
    padding: 22px;
  }

  .hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at top right, rgba(34, 211, 238, 0.15), transparent 42%),
      linear-gradient(90deg, rgba(37, 99, 235, 0.16), transparent 36%);
    pointer-events: none;
  }

  .hero-grid {
    position: relative;
    display: grid;
    gap: 18px;
  }

  .hero-top {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .shield {
    width: 42px;
    height: 42px;
    border-radius: 16px;
    display: grid;
    place-items: center;
    background: rgba(34, 211, 238, 0.08);
    border: 1px solid rgba(34, 211, 238, 0.16);
  }

  .brand-meta {
    display: grid;
    gap: 2px;
  }

  .eyebrow {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    color: var(--dim);
  }

  .brand-title {
    font-size: 16px;
    font-weight: 700;
    color: var(--text);
  }

  .session-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border-radius: 999px;
    padding: 6px 10px;
    border: 1px solid rgba(16, 185, 129, 0.2);
    background: rgba(16, 185, 129, 0.08);
    color: #9ff1d2;
    font-size: 11px;
    font-weight: 600;
  }

  .pulse {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: var(--success);
    animation: pulse 1.8s ease-in-out infinite;
  }

  .hero-content {
    display: grid;
    gap: 18px;
  }

  .headline {
    max-width: 640px;
  }

  .headline h1 {
    margin: 0;
    font-size: clamp(28px, 4vw, 38px);
    line-height: 1.02;
    letter-spacing: -0.05em;
    font-weight: 700;
    color: #f8fbff;
  }

  .headline p {
    margin: 12px 0 0;
    max-width: 680px;
    color: var(--muted);
    font-size: 13px;
    line-height: 1.7;
  }

  .hero-metrics {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 12px;
  }

  .metric-card {
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.07);
    background: rgba(255, 255, 255, 0.04);
    padding: 14px;
  }

  .metric-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--dim);
  }

  .metric-value {
    margin-top: 10px;
    font-size: 28px;
    line-height: 1;
    letter-spacing: -0.05em;
    font-weight: 700;
  }

  .metric-detail {
    margin-top: 8px;
    font-size: 12px;
    color: var(--muted);
  }

  .workspace {
    display: grid;
    gap: 16px;
    grid-template-columns: minmax(0, 1.45fr) minmax(290px, 0.95fr);
    align-items: start;
  }

  .section {
    padding: 18px;
  }

  .section-head,
  .sidebar-head {
    display: flex;
    flex-wrap: wrap;
    align-items: end;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 14px;
  }

  .section-title {
    margin: 0;
    font-size: 18px;
    letter-spacing: -0.03em;
    font-weight: 700;
    color: #f7faff;
  }

  .section-copy {
    margin: 6px 0 0;
    font-size: 12px;
    color: var(--muted);
  }

  .loop-list {
    border-radius: 22px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.07);
    background: rgba(255, 255, 255, 0.03);
  }

  .loop-row {
    display: grid;
    gap: 10px;
    padding: 14px 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    background: rgba(255, 255, 255, 0.02);
  }

  .loop-row:last-child {
    border-bottom: none;
  }

  .loop-row.urgent {
    background: rgba(239, 68, 68, 0.06);
  }

  .loop-main {
    display: flex;
    justify-content: space-between;
    gap: 12px;
  }

  .loop-hash {
    font-family: var(--vscode-editor-font-family, 'SFMono-Regular', Consolas, monospace);
    font-size: 11px;
    letter-spacing: 0.14em;
    color: #d8e5f4;
  }

  .loop-message {
    margin-top: 8px;
    color: var(--text);
    font-size: 13px;
  }

  .loop-meta {
    margin-top: 8px;
    display: flex;
    flex-wrap: wrap;
    gap: 8px 12px;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: var(--dim);
  }

  .status-pill {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    align-self: start;
    border-radius: 999px;
    padding: 6px 10px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .status-active {
    background: rgba(239, 68, 68, 0.1);
    color: #ffb4b4;
    border: 1px solid rgba(239, 68, 68, 0.22);
  }

  .status-resolved {
    background: rgba(16, 185, 129, 0.1);
    color: #95f1cd;
    border: 1px solid rgba(16, 185, 129, 0.22);
  }

  .empty {
    padding: 32px 22px;
    color: var(--muted);
    font-size: 13px;
    line-height: 1.7;
    text-align: center;
  }

  .sidebar {
    display: grid;
    gap: 16px;
  }

  .sidebar-card {
    padding: 16px;
  }

  .engine-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-top: 14px;
  }

  .mini-stat {
    border-radius: 18px;
    border: 1px solid rgba(255, 255, 255, 0.07);
    background: rgba(255, 255, 255, 0.03);
    padding: 12px;
  }

  .mini-label {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: var(--dim);
  }

  .mini-value {
    margin-top: 8px;
    font-size: 22px;
    line-height: 1;
    font-weight: 700;
    letter-spacing: -0.04em;
  }

  .support-list {
    display: grid;
    gap: 10px;
  }

  .support-item {
    display: flex;
    gap: 10px;
    border-radius: 18px;
    border: 1px solid rgba(255, 255, 255, 0.07);
    background: rgba(255, 255, 255, 0.03);
    padding: 12px;
  }

  .step {
    width: 28px;
    height: 28px;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: rgba(34, 211, 238, 0.1);
    border: 1px solid rgba(34, 211, 238, 0.2);
    color: #8febff;
    font-size: 12px;
    font-weight: 700;
    flex-shrink: 0;
  }

  .support-copy {
    color: var(--muted);
    font-size: 12px;
    line-height: 1.65;
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 14px;
  }

  .button,
  .button-secondary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    padding: 10px 14px;
    font-size: 12px;
    font-weight: 700;
    text-decoration: none;
    transition: transform 120ms ease, background 120ms ease, border-color 120ms ease;
  }

  .button:hover,
  .button-secondary:hover {
    transform: translateY(-1px);
  }

  .button {
    color: #06111e;
    background: linear-gradient(135deg, #67E8F9, #2563EB);
  }

  .button-secondary {
    color: var(--text);
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.09);
  }

  .footer {
    padding: 2px 6px 0;
    font-size: 11px;
    color: var(--dim);
  }

  .c-warning { color: #f7c86b; }
  .c-danger { color: #ff9a9a; }
  .c-accent { color: #8fefff; }
  .c-success { color: #95f1cd; }

  @media (max-width: 820px) {
    .workspace {
      grid-template-columns: 1fr;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    * {
      animation: none !important;
      transition: none !important;
    }
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.55; transform: scale(0.92); }
    50% { opacity: 1; transform: scale(1); }
  }
</style>
</head>
<body>
  <div class="shell">
    <section class="hero">
      <div class="hero-grid">
        <div class="hero-top">
          <div class="brand">
            <div class="shield">
              <svg width="24" height="24" viewBox="0 0 34 34" fill="none" aria-hidden="true">
                <path d="M17 2L3 8v10c0 8.3 5.8 15.8 14 17.7C25.2 33.8 31 26.3 31 18V8L17 2z" fill="url(#panelShield)" />
                <defs>
                  <linearGradient id="panelShield" x1="3" y1="2" x2="31" y2="35" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="#3B82F6" />
                    <stop offset="100%" stop-color="#22D3EE" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div class="brand-meta">
              <div class="eyebrow">LoopGuard</div>
              <div class="brand-title">Session dashboard</div>
            </div>
          </div>
          <div class="session-pill">
            <span class="pulse"></span>
            Session active · ${escHtml(sessionDuration)}
          </div>
        </div>

        <div class="hero-content">
          <div class="headline">
            <h1>${escHtml(headline.title)}</h1>
            <p>${escHtml(headline.copy)}</p>
          </div>

          <div class="hero-metrics">
            <div class="metric-card">
              <div class="metric-label">Loops detected</div>
              <div class="metric-value c-warning">${metrics.totalLoopsDetected}</div>
              <div class="metric-detail">This session</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">Time wasted</div>
              <div class="metric-value c-danger">${escHtml(timeWasted)}</div>
              <div class="metric-detail">Lost to repeated errors</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">Tokens saved</div>
              <div class="metric-value c-accent">${escHtml(tokensSaved)}</div>
              <div class="metric-detail">Context removed before prompting</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">Estimated cost saved</div>
              <div class="metric-value c-success">$${escHtml(costSaved)}</div>
              <div class="metric-detail">This session at current dashboard pricing</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="workspace">
      <section class="section">
        <div class="section-head">
          <div>
            <div class="eyebrow">Active loops</div>
            <h2 class="section-title">${activeCount > 0 ? `${activeCount} loop${activeCount === 1 ? '' : 's'} still need intervention` : 'No active loops right now'}</h2>
            <p class="section-copy">This list stays focused on the current session so you can act without extra dashboard clutter.</p>
          </div>
        </div>
        <div class="loop-list">${renderLoopRows(activeLoops)}</div>
      </section>

      <aside class="sidebar">
        <section class="sidebar-card">
          <div class="sidebar-head">
            <div>
              <div class="eyebrow">Context engine</div>
              <h2 class="section-title">${engineTier === 'rust' ? 'Rust engine is active' : 'TypeScript fallback is running'}</h2>
              <p class="section-copy">${engineTier === 'rust' ? 'Higher compression, cleaner prompts, and better CLI + MCP coverage.' : 'You still get local filtering, but the native path unlocks deeper compression.'}</p>
            </div>
          </div>
          <div class="engine-grid">
            <div class="mini-stat">
              <div class="mini-label">Mode</div>
              <div class="mini-value ${engineTier === 'rust' ? 'c-accent' : 'c-warning'}">${engineTier === 'rust' ? '89–99%' : '~80%'}</div>
            </div>
            <div class="mini-stat">
              <div class="mini-label">Status</div>
              <div class="mini-value ${engineTier === 'rust' ? 'c-success' : 'c-warning'}">${engineTier === 'rust' ? 'Optimal' : 'Fallback'}</div>
            </div>
          </div>
          <div class="actions">
            ${engineTier === 'rust'
              ? '<span class="button-secondary">Rust engine enabled</span>'
              : '<a class="button" href="command:loopguard.setupMCP">Enable Rust engine</a>'}
            <a class="button-secondary" href="command:loopguard.copyContext">Copy context</a>
          </div>
        </section>

        <section class="sidebar-card">
          <div class="sidebar-head">
            <div>
              <div class="eyebrow">Break the loop</div>
              <h2 class="section-title">What to do before the next retry</h2>
              <p class="section-copy">Small moves that reduce repeat debugging instead of extending it.</p>
            </div>
          </div>
          <div class="support-list">
            <div class="support-item">
              <div class="step">1</div>
              <div class="support-copy">Ask the model to explain the failing assumption before it proposes a patch.</div>
            </div>
            <div class="support-item">
              <div class="step">2</div>
              <div class="support-copy">Reproduce the bug in the smallest file you can get away with.</div>
            </div>
            <div class="support-item">
              <div class="step">3</div>
              <div class="support-copy">Send optimized context, not the whole file, so the next prompt starts cleaner.</div>
            </div>
          </div>
          <div class="actions">
            <a class="button" href="command:loopguard.copyContext">Copy optimized context</a>
          </div>
        </section>

        <section class="sidebar-card">
          <div class="sidebar-head">
            <div>
              <div class="eyebrow">Upgrade path</div>
              <h2 class="section-title">Bring MCP and shell hooks into the same safety rail.</h2>
              <p class="section-copy">Pro expands the dashboard beyond the IDE session with MCP setup, shell hooks, and longer history.</p>
            </div>
          </div>
          <div class="actions">
            <a class="button" href="https://loopguard.vercel.app/upgrade">Upgrade to Pro</a>
            <a class="button-secondary" href="https://loopguard.vercel.app/setup">Open setup guide</a>
          </div>
        </section>
      </aside>
    </div>

    <div class="footer">Your code never leaves your machine. Loop detection and context filtering stay local.</div>
  </div>
</body>
</html>`;
}

function renderLoopRows(activeLoops: LoopEvent[]): string {
  if (activeLoops.length === 0) {
    return '<div class="empty">No active loops this session. The fastest win right now is to keep your next prompt narrow and factual.</div>';
  }

  return activeLoops
    .map((loop) => {
      const fileName = loop.fileUri.split('/').pop() ?? '';
      const age = formatDuration(Date.now() - loop.firstSeen);
      const urgent = loop.occurrences >= 4;
      const message = loop.errorMessage.length > 112
        ? `${loop.errorMessage.slice(0, 112)}…`
        : loop.errorMessage;

      return `
        <div class="loop-row ${urgent ? 'urgent' : ''}">
          <div class="loop-main">
            <div>
              <div class="loop-hash">${escHtml(loop.errorHash)}</div>
              <div class="loop-message">${escHtml(message)}</div>
              <div class="loop-meta">
                <span>${escHtml(fileName)}</span>
                <span>${loop.occurrences} repeats</span>
                <span>${escHtml(age)}</span>
              </div>
            </div>
            <div class="status-pill ${loop.status === 'active' ? 'status-active' : 'status-resolved'}">${escHtml(loop.status)}</div>
          </div>
        </div>`;
    })
    .join('');
}

function getHeadline(
  activeLoops: LoopEvent[],
  metrics: SessionMetrics,
): { title: string; copy: string } {
  if (activeLoops.length === 0 && metrics.totalTimeWasted === 0) {
    return {
      title: 'Quiet session. Keep the context tight.',
      copy: 'There is no loop pressure right now. Use LoopGuard before the next prompt to keep that calm signal intact.',
    };
  }

  if (activeLoops.some((loop) => loop.occurrences >= 4) || metrics.totalTimeWasted >= 30 * 60 * 1000) {
    return {
      title: 'This session is starting to spiral.',
      copy: 'Repeated diagnostics are now expensive enough to intervene. Shift the prompt, isolate the failing case, and reduce the context window before trying again.',
    };
  }

  return {
    title: 'A few repeats showed up, but the session is still recoverable.',
    copy: 'You have enough signal to act early. The goal is to break repetition before the debugging loop hardens.',
  };
}

function formatCompactNumber(value: number): string {
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return String(value);
}

function escHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
