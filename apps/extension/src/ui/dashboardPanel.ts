import * as vscode from 'vscode';
import { readFileSync } from 'fs';
import { homedir } from 'os';
import type { LoopEvent, SessionMetrics } from '@loopguard/types';
import { formatDuration } from '@loopguard/utils';
import type { DashboardSummary } from '../services/apiClient';

const SUPPORT_URL = 'https://buymeacoffee.com/rodthenewcomer';

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
    accountSummary: DashboardSummary | null = null,
  ): void {
    if (DashboardPanel._instance !== undefined && !DashboardPanel._instance._disposed) {
      DashboardPanel._instance._panel.reveal(vscode.ViewColumn.Beside, true);
      DashboardPanel._instance._render(metrics, activeLoops, accountSummary);
      return;
    }

    const panel = new DashboardPanel(extensionUri);
    DashboardPanel._instance = panel;
    panel._render(metrics, activeLoops, accountSummary);
  }

  static update(
    metrics: SessionMetrics,
    activeLoops: LoopEvent[],
    accountSummary: DashboardSummary | null = null,
  ): void {
    if (DashboardPanel._instance !== undefined && !DashboardPanel._instance._disposed) {
      DashboardPanel._instance._render(metrics, activeLoops, accountSummary);
    }
  }

  static setEngineTier(tier: 'rust' | 'ts'): void {
    DashboardPanel._engineTier = tier;
  }

  static dispose(): void {
    DashboardPanel._instance?._panel.dispose();
  }

  private _render(
    metrics: SessionMetrics,
    activeLoops: LoopEvent[],
    accountSummary: DashboardSummary | null,
  ): void {
    this._panel.webview.html = buildHtml(
      this._panel.webview,
      metrics,
      activeLoops,
      accountSummary,
      DashboardPanel._engineTier,
      loadMemoryEntries(),
    );
  }
}

interface MemoryEntry {
  id: string;
  error_fingerprint: string;
  error_text: string;
  fix_file: string;
  fix_description: string;
  seen_count: number;
}

function loadMemoryEntries(): MemoryEntry[] {
  try {
    const path = `${homedir()}/.loopguard-ctx/memory.json`;
    const raw = readFileSync(path, 'utf-8');
    const parsed = JSON.parse(raw) as { entries?: unknown[] };
    if (!Array.isArray(parsed.entries)) return [];
    return (parsed.entries as MemoryEntry[]).slice(-5).reverse();
  } catch {
    return [];
  }
}

function buildHtml(
  webview: vscode.Webview,
  metrics: SessionMetrics,
  activeLoops: LoopEvent[],
  accountSummary: DashboardSummary | null,
  engineTier: 'rust' | 'ts',
  memoryEntries: MemoryEntry[] = [],
): string {
  const sessionDuration = formatDuration(Date.now() - metrics.startTime);
  const timeWasted = formatDuration(metrics.totalTimeWasted);
  const tokensSaved = formatCompactNumber(metrics.tokensSaved);
  const costSaved = ((metrics.tokensSaved / 1_000_000) * 3.00).toFixed(2);
  const activeCount = activeLoops.filter((loop) => loop.status === 'active').length;
  const headline = getHeadline(activeLoops, metrics);
  const accountSnapshot = accountSummary !== null
    ? `
        <section class="rail-block">
          <div class="eyebrow">Account totals</div>
          <h2 class="rail-title">Your signed-in history is synced.</h2>
          <p class="rail-copy">These totals come from your LoopGuard account, so you can see everything saved beyond the current editor session.</p>
          <div class="detail-grid">
            <div class="detail-cell">
              <div class="detail-label">All-time tokens</div>
              <div class="detail-value c-cyan">${escHtml(formatCompactNumber(accountSummary.allTime.tokensSaved))}</div>
            </div>
            <div class="detail-cell">
              <div class="detail-label">All-time cost</div>
              <div class="detail-value c-green">$${escHtml(accountSummary.allTime.costSaved.toFixed(2))}</div>
            </div>
            <div class="detail-cell">
              <div class="detail-label">Stuck time tracked</div>
              <div class="detail-value c-amber">${escHtml(formatDuration(accountSummary.allTime.timeWastedMs))}</div>
            </div>
            <div class="detail-cell">
              <div class="detail-label">Loops interrupted</div>
              <div class="detail-value c-red">${accountSummary.allTime.loops}</div>
            </div>
          </div>
          <div class="actions">
            <a class="button-secondary" href="https://loopguard.vercel.app/dashboard">Open account dashboard</a>
            <a class="button-ghost" href="${SUPPORT_URL}">Buy me a coffee</a>
          </div>
        </section>`
    : `
        <section class="rail-block">
          <div class="eyebrow">History and support</div>
          <h2 class="rail-title">Sync if you want history. Support if it helped.</h2>
          <p class="rail-copy">Core protection runs locally without an account. Sign in when you want the web dashboard, or back the project if it already saved you a late-night loop.</p>
          <div class="actions">
            <a class="button" href="command:loopguard.signIn">Sign in for sync</a>
            <a class="button-secondary" href="https://loopguard.vercel.app/dashboard">Open web dashboard</a>
            <a class="button-ghost" href="${SUPPORT_URL}">Buy me a coffee</a>
          </div>
        </section>`;
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
    --bg: var(--vscode-editor-background, #071019);
    --surface: color-mix(in srgb, var(--vscode-editor-background, #071019) 82%, #0d1b2b 18%);
    --surface-2: color-mix(in srgb, var(--vscode-sideBar-background, #0d1724) 74%, #112235 26%);
    --line: color-mix(in srgb, var(--vscode-panel-border, #223244) 82%, #2d4258 18%);
    --line-strong: color-mix(in srgb, var(--vscode-focusBorder, #2563EB) 18%, #274159 82%);
    --text: var(--vscode-editor-foreground, #E8EEF5);
    --muted: color-mix(in srgb, var(--vscode-descriptionForeground, #94A3B8) 85%, #94A3B8 15%);
    --dim: color-mix(in srgb, var(--vscode-descriptionForeground, #60758C) 88%, #60758C 12%);
    --blue: #59A5FF;
    --cyan: #7EE8FF;
    --green: #59D68A;
    --amber: #F6B84A;
    --red: #FF7C7C;
  }

  html, body {
    margin: 0;
    min-height: 100%;
    background:
      radial-gradient(circle at top right, rgba(37, 99, 235, 0.18), transparent 32%),
      radial-gradient(circle at top left, rgba(239, 68, 68, 0.1), transparent 28%),
      var(--bg);
    color: var(--text);
    font-family: var(--vscode-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif);
    font-size: var(--vscode-font-size, 13px);
    line-height: 1.55;
  }

  body {
    padding: 18px;
  }

  .shell {
    max-width: 1040px;
    margin: 0 auto;
    display: grid;
    gap: 18px;
  }

  .masthead,
  .main-panel,
  .rail-block {
    border: 1px solid var(--line);
    background: linear-gradient(160deg, rgba(7, 16, 25, 0.94), rgba(10, 19, 32, 0.92));
    box-shadow: 0 28px 80px rgba(0, 0, 0, 0.28);
  }

  .masthead {
    overflow: hidden;
    border-radius: 32px;
  }

  .masthead-top {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 18px 22px 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .brand-mark {
    width: 44px;
    height: 44px;
    border-radius: 18px;
    display: grid;
    place-items: center;
    background: linear-gradient(145deg, rgba(37, 99, 235, 0.22), rgba(126, 232, 255, 0.14));
    border: 1px solid rgba(126, 232, 255, 0.16);
  }

  .eyebrow {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    color: var(--dim);
  }

  .brand-title {
    margin-top: 2px;
    font-size: 17px;
    font-weight: 700;
    color: var(--text);
  }

  .session-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border-radius: 999px;
    padding: 7px 11px;
    border: 1px solid rgba(89, 214, 138, 0.24);
    background: rgba(89, 214, 138, 0.1);
    color: #b8f7cf;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.04em;
  }

  .pulse {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: var(--green);
    animation: pulse 1.8s ease-in-out infinite;
  }

  .masthead-body {
    padding: 22px;
    display: grid;
    gap: 18px;
  }

  .headline {
    max-width: 760px;
  }

  .headline h1 {
    margin: 0;
    font-size: clamp(28px, 4vw, 42px);
    line-height: 0.98;
    letter-spacing: -0.06em;
    font-weight: 760;
    color: #fbfdff;
  }

  .headline p {
    margin: 14px 0 0;
    max-width: 700px;
    color: var(--muted);
    font-size: 13px;
    line-height: 1.75;
  }

  .summary-strip {
    display: grid;
    gap: 1px;
    overflow: hidden;
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.08);
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .summary-cell {
    background: rgba(5, 14, 24, 0.76);
    padding: 16px;
    min-height: 106px;
  }

  .summary-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--dim);
  }

  .summary-value {
    margin-top: 12px;
    font-size: 30px;
    line-height: 1;
    letter-spacing: -0.06em;
    font-weight: 760;
  }

  .summary-detail {
    margin-top: 8px;
    color: var(--muted);
    font-size: 12px;
    line-height: 1.55;
  }

  .workspace {
    display: grid;
    gap: 18px;
    grid-template-columns: minmax(0, 1.14fr) minmax(300px, 0.86fr);
    align-items: start;
  }

  .main-panel,
  .rail-block {
    border-radius: 28px;
  }

  .main-panel {
    overflow: hidden;
  }

  .panel-head {
    display: flex;
    flex-wrap: wrap;
    align-items: end;
    justify-content: space-between;
    gap: 10px;
    padding: 20px 22px 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }

  .panel-title {
    margin: 0;
    font-size: 22px;
    line-height: 1.1;
    letter-spacing: -0.04em;
    font-weight: 730;
    color: #f8fbff;
  }

  .panel-copy {
    margin: 6px 0 0;
    color: var(--muted);
    font-size: 12px;
  }

  .state-chip {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 7px 10px;
    border-radius: 999px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .state-calm {
    border: 1px solid rgba(89, 214, 138, 0.24);
    background: rgba(89, 214, 138, 0.1);
    color: #b8f7cf;
  }

  .state-hot {
    border: 1px solid rgba(255, 124, 124, 0.24);
    background: rgba(255, 124, 124, 0.1);
    color: #ffbcbc;
  }

  .ledger {
    display: grid;
  }

  .loop-row {
    display: grid;
    gap: 14px;
    padding: 18px 22px;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    background: rgba(255, 255, 255, 0.02);
    grid-template-columns: auto 1fr auto;
    align-items: start;
  }

  .loop-row:first-child {
    border-top: none;
  }

  .loop-row.urgent {
    background:
      linear-gradient(90deg, rgba(255, 124, 124, 0.08), transparent 20%),
      rgba(255, 255, 255, 0.02);
  }

  .loop-pin {
    width: 12px;
    height: 12px;
    border-radius: 999px;
    margin-top: 6px;
    background: var(--amber);
    box-shadow: 0 0 0 6px rgba(246, 184, 74, 0.12);
  }

  .loop-row.urgent .loop-pin {
    background: var(--red);
    box-shadow: 0 0 0 6px rgba(255, 124, 124, 0.12);
  }

  .loop-hash {
    font-family: var(--vscode-editor-font-family, 'SFMono-Regular', Consolas, monospace);
    font-size: 11px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #d4e8fb;
  }

  .loop-message {
    margin-top: 8px;
    color: var(--text);
    font-size: 14px;
    line-height: 1.55;
  }

  .loop-meta {
    margin-top: 10px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px 14px;
    color: var(--dim);
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.16em;
  }

  .status-pill {
    align-self: start;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 7px 10px;
    border-radius: 999px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .status-active {
    border: 1px solid rgba(255, 124, 124, 0.26);
    background: rgba(255, 124, 124, 0.1);
    color: #ffbcbc;
  }

  .status-resolved {
    border: 1px solid rgba(89, 214, 138, 0.26);
    background: rgba(89, 214, 138, 0.1);
    color: #b8f7cf;
  }

  .empty {
    padding: 34px 22px;
    color: var(--muted);
    font-size: 13px;
    line-height: 1.7;
  }

  .rail {
    display: grid;
    gap: 18px;
  }

  .rail-block {
    padding: 18px;
  }

  .rail-title {
    margin: 6px 0 0;
    font-size: 18px;
    line-height: 1.15;
    letter-spacing: -0.04em;
    font-weight: 720;
    color: #f8fbff;
  }

  .rail-copy {
    margin: 10px 0 0;
    color: var(--muted);
    font-size: 12px;
    line-height: 1.7;
  }

  .detail-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1px;
    overflow: hidden;
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.08);
    margin-top: 16px;
  }

  .detail-cell {
    background: rgba(5, 14, 24, 0.72);
    padding: 14px;
  }

  .detail-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--dim);
  }

  .detail-value {
    margin-top: 8px;
    font-size: 24px;
    line-height: 1;
    letter-spacing: -0.05em;
    font-weight: 740;
  }

  .advice-list {
    margin-top: 16px;
    display: grid;
    gap: 12px;
  }

  .advice-item {
    display: grid;
    grid-template-columns: 28px 1fr;
    gap: 12px;
    padding-top: 12px;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
  }

  .advice-item:first-child {
    border-top: none;
    padding-top: 0;
  }

  .advice-index {
    width: 28px;
    height: 28px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    border: 1px solid rgba(126, 232, 255, 0.22);
    background: rgba(126, 232, 255, 0.08);
    color: #a5f0ff;
    font-size: 12px;
    font-weight: 700;
  }

  .advice-text {
    color: var(--muted);
    font-size: 12px;
    line-height: 1.7;
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 16px;
  }

  .button,
  .button-secondary,
  .button-ghost {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    padding: 10px 14px;
    font-size: 12px;
    font-weight: 700;
    text-decoration: none;
    transition: transform 120ms ease, border-color 120ms ease, background 120ms ease;
  }

  .button:hover,
  .button-secondary:hover,
  .button-ghost:hover {
    transform: translateY(-1px);
  }

  .button {
    color: #04101c;
    background: linear-gradient(135deg, #7EE8FF, #4E8FFF);
  }

  .button-secondary {
    color: #f7fbff;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .button-ghost {
    color: #ffd792;
    background: rgba(246, 184, 74, 0.12);
    border: 1px solid rgba(246, 184, 74, 0.22);
  }

  .footer {
    padding: 2px 6px 0;
    color: var(--dim);
    font-size: 11px;
  }

  .c-amber { color: var(--amber); }
  .c-red { color: var(--red); }
  .c-cyan { color: var(--cyan); }
  .c-green { color: var(--green); }

  @media (max-width: 860px) {
    .workspace {
      grid-template-columns: 1fr;
    }

    .summary-strip {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 620px) {
    .summary-strip {
      grid-template-columns: 1fr;
    }

    .loop-row {
      grid-template-columns: auto 1fr;
    }

    .status-pill {
      grid-column: 2;
      justify-self: start;
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
    <section class="masthead">
      <div class="masthead-top">
        <div class="brand">
          <div class="brand-mark">
            <svg width="28" height="18" viewBox="0 0 132 76" fill="none" aria-hidden="true">
              <path d="M10 38C18 23 28 14 40 14C54 14 62 24 72 38C82 52 90 62 104 62C116 62 124 54 124 38" stroke="rgba(255,255,255,0.24)" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M10 38C18 53 28 62 40 62C54 62 62 52 72 38C82 24 90 14 104 14C116 14 124 22 124 38" stroke="rgba(255,255,255,0.24)" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M10 38C18 23 28 14 40 14C54 14 62 24 72 38C82 52 90 62 104 62C116 62 124 54 124 38" stroke="#FFFFFF" stroke-width="11" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M10 38C18 53 28 62 40 62C54 62 62 52 72 38C82 24 90 14 104 14C116 14 124 22 124 38" stroke="#FFFFFF" stroke-width="11" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
          <div>
            <div class="eyebrow">LoopGuard</div>
            <div class="brand-title">Live session dashboard</div>
          </div>
        </div>
        <div class="session-pill">
          <span class="pulse"></span>
          Session active · ${escHtml(sessionDuration)}
        </div>
      </div>

      <div class="masthead-body">
        <div class="headline">
          <h1>${escHtml(headline.title)}</h1>
          <p>${escHtml(headline.copy)}</p>
        </div>

        <div class="summary-strip">
          <div class="summary-cell">
            <div class="summary-label">Loops detected</div>
            <div class="summary-value c-amber">${metrics.totalLoopsDetected}</div>
            <div class="summary-detail">This session</div>
          </div>
          <div class="summary-cell">
            <div class="summary-label">Time lost</div>
            <div class="summary-value c-red">${escHtml(timeWasted)}</div>
            <div class="summary-detail">Burned on repeats instead of progress</div>
          </div>
          <div class="summary-cell">
            <div class="summary-label">Tokens saved</div>
            <div class="summary-value c-cyan">${escHtml(tokensSaved)}</div>
            <div class="summary-detail">Trimmed before they became prompt noise</div>
          </div>
          <div class="summary-cell">
            <div class="summary-label">Cost avoided</div>
            <div class="summary-value c-green">$${escHtml(costSaved)}</div>
            <div class="summary-detail">Estimated AI API spend saved this session</div>
          </div>
        </div>
      </div>
    </section>

    <div class="workspace">
      <section class="main-panel">
        <div class="panel-head">
          <div>
            <div class="eyebrow">Loop ledger</div>
            <h2 class="panel-title">${activeCount > 0 ? `${activeCount} active loop${activeCount === 1 ? '' : 's'} need attention` : 'No active loops right now'}</h2>
            <p class="panel-copy">This view stays focused on the current session so you can react fast instead of digging through analytics.</p>
          </div>
          <div class="state-chip ${activeCount > 0 ? 'state-hot' : 'state-calm'}">${activeCount > 0 ? 'Intervene now' : 'Stable session'}</div>
        </div>
        <div class="ledger">${renderLoopRows(activeLoops)}</div>
      </section>

      <aside class="rail">
        <section class="rail-block">
          <div class="eyebrow">Context path</div>
          <h2 class="rail-title">${engineTier === 'rust' ? 'Native helper is ready' : 'Editor-only fallback is active'}</h2>
          <p class="rail-copy">${engineTier === 'rust' ? 'You are on the stronger local path for focused reads, shell compression, and MCP-backed agent workflows.' : 'LoopGuard is still filtering locally, but the native helper unlocks stronger context reduction and better terminal coverage.'}</p>
          <div class="detail-grid">
            <div class="detail-cell">
              <div class="detail-label">Mode</div>
              <div class="detail-value ${engineTier === 'rust' ? 'c-cyan' : 'c-amber'}">${engineTier === 'rust' ? 'Native' : 'Fallback'}</div>
            </div>
            <div class="detail-cell">
              <div class="detail-label">Expected result</div>
              <div class="detail-value ${engineTier === 'rust' ? 'c-green' : 'c-amber'}">${engineTier === 'rust' ? 'Deeper focused reads' : 'Built-in focused reads'}</div>
            </div>
          </div>
          <div class="actions">
            ${engineTier === 'rust'
              ? '<span class="button-secondary">Native helper enabled</span>'
              : '<a class="button" href="command:loopguard.setupMCP">Set up helper + MCP</a>'}
            <a class="button-secondary" href="command:loopguard.copyContext">Copy focused context</a>
          </div>
        </section>

        <section class="rail-block">
          <div class="eyebrow">Next move</div>
          <h2 class="rail-title">Break the pattern before the next retry</h2>
          <p class="rail-copy">When a session starts repeating, smaller and more factual prompts beat another broad patch attempt.</p>
          <div class="advice-list">
            <div class="advice-item">
              <div class="advice-index">1</div>
              <div class="advice-text">Ask the model to explain the failing assumption before it writes another fix.</div>
            </div>
            <div class="advice-item">
              <div class="advice-index">2</div>
              <div class="advice-text">Strip the bug down to the smallest reproduction you can create.</div>
            </div>
            <div class="advice-item">
              <div class="advice-index">3</div>
              <div class="advice-text">Send optimized context so the next prompt starts from signal, not file bulk.</div>
            </div>
          </div>
          <div class="actions">
            <a class="button" href="command:loopguard.copyContext">Copy optimized context</a>
            <a class="button-secondary" href="command:loopguard.resetSession">Reset session</a>
          </div>
        </section>

        ${memoryEntries.length > 0 ? `
        <section class="rail-block">
          <h2 class="rail-title">Past fixes (ctx_memory)</h2>
          ${memoryEntries.map((e: MemoryEntry) => `
          <div class="detail-row">
            <div class="detail-label" style="max-width:60%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${escHtml(e.error_text)}">${escHtml(e.error_fingerprint)}</div>
            <div class="detail-value c-green" style="font-size:10px;max-width:38%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${escHtml(e.fix_description)}">${escHtml(e.fix_file)}</div>
          </div>`).join('')}
          <p style="margin-top:8px;font-size:10px;color:var(--text-muted)">Record fixes with ctx_memory(action="record", ...)</p>
        </section>` : ''}

        ${accountSnapshot}
      </aside>
    </div>

    <div class="footer">Loop detection and context filtering stay local. Sync is optional and only for your own session history.</div>
  </div>
</body>
</html>`;
}

function renderLoopRows(activeLoops: LoopEvent[]): string {
  if (activeLoops.length === 0) {
    return '<div class="empty">No active loops in this session. The fastest win right now is to keep the next prompt narrow, concrete, and tied to one failing case.</div>';
  }

  return activeLoops
    .map((loop) => {
      const fileName = loop.fileUri.split('/').pop() ?? '';
      const age = formatDuration(Date.now() - loop.firstSeen);
      const urgent = loop.occurrences >= 4;
      const message = loop.errorMessage.length > 120
        ? `${loop.errorMessage.slice(0, 120)}…`
        : loop.errorMessage;

      return `
        <div class="loop-row ${urgent ? 'urgent' : ''}">
          <div class="loop-pin"></div>
          <div>
            <div class="loop-hash">${escHtml(loop.errorHash)}</div>
            <div class="loop-message">${escHtml(message)}</div>
            <div class="loop-meta">
              <span>${escHtml(fileName)}</span>
              <span>${loop.occurrences} repeats</span>
              <span>tracked for ${escHtml(age)}</span>
            </div>
          </div>
          <div class="status-pill ${loop.status === 'active' ? 'status-active' : 'status-resolved'}">${escHtml(loop.status)}</div>
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
      title: 'Quiet session. Keep the prompt surface small.',
      copy: 'Nothing is spiraling right now. This is the moment to stay disciplined and keep the next context window tight.',
    };
  }

  if (activeLoops.some((loop) => loop.occurrences >= 4) || metrics.totalTimeWasted >= 30 * 60 * 1000) {
    return {
      title: 'The session is repeating faster than it is learning.',
      copy: 'Pause the broad retries. Narrow the bug, cut the context, and force the next move to be specific enough to break the pattern.',
    };
  }

  return {
    title: 'A repeat pattern is showing up, but you can still cut it off early.',
    copy: 'Use the next prompt to isolate the failing assumption, not to re-run the whole fix with different wording.',
  };
}

function formatCompactNumber(value: number): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k`;
  }

  return String(value);
}

function escHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
