import * as vscode from 'vscode';
import { readFileSync } from 'fs';
import { homedir } from 'os';
import type { LoopEvent, SessionMetrics } from '@loopguard/types';
import { formatDuration } from '@loopguard/utils';
import type { DashboardSummary } from '../services/apiClient';

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
  const timeWasted = formatDuration(metrics.totalTimeWasted);
  const tokensSaved = formatCompactNumber(metrics.tokensSaved);
  const costSaved = ((metrics.tokensSaved / 1_000_000) * 3.00).toFixed(2);
  const activeCount = activeLoops.filter((l) => l.status === 'active').length;
  const sessionDur = formatDuration(Date.now() - metrics.startTime);

  // ── loop rows ────────────────────────────────────────────────────────────
  const loopRows = activeLoops.length === 0
    ? `<div class="empty-state">
        <div class="empty-check">✓</div>
        <div class="empty-title">No loops detected</div>
        <div class="empty-sub">Next alert will appear here automatically.</div>
       </div>`
    : activeLoops.slice(0, 8).map((loop) => {
        const fileName = loop.fileUri.split('/').pop() ?? '';
        const age = formatDuration(Date.now() - loop.firstSeen);
        const msg = loop.errorMessage.length > 100
          ? `${loop.errorMessage.slice(0, 100)}…`
          : loop.errorMessage;
        const isActive = loop.status === 'active';
        return `
        <div class="loop-row">
          <div class="loop-row-left">
            <div class="loop-hash">${escHtml(loop.errorHash)}</div>
            <div class="loop-msg">${escHtml(msg)}</div>
            <div class="loop-meta">
              <span>${escHtml(fileName)}</span>
              <span>${loop.occurrences}× repeats</span>
              <span>${escHtml(age)} tracked</span>
            </div>
          </div>
          <span class="pill ${isActive ? 'pill-active' : 'pill-resolved'}">${escHtml(loop.status)}</span>
        </div>`;
      }).join('');

  // ── memory entries ────────────────────────────────────────────────────────
  const memorySection = memoryEntries.length === 0 ? '' : `
    <section class="card">
      <div class="card-label">Past fixes</div>
      ${memoryEntries.map((e) => `
      <div class="memory-row">
        <div class="memory-left">
          <span class="mono">${escHtml(e.error_fingerprint)}</span>
          <span class="memory-sub">${escHtml(e.fix_description)}</span>
        </div>
        <span class="memory-file">${escHtml(e.fix_file)}</span>
      </div>`).join('')}
    </section>`;

  // ── active alert ──────────────────────────────────────────────────────────
  const activeAlert = activeCount === 0 ? '' : `
    <div class="alert-active">
      <div class="alert-icon">⚠</div>
      <div>
        <div class="alert-title">${activeCount} active loop${activeCount > 1 ? 's' : ''} right now</div>
        <div class="alert-sub">Stop retrying the same fix. Narrow the prompt to one failing case and paste focused context.</div>
      </div>
    </div>`;

  // ── account section ───────────────────────────────────────────────────────
  const accountSection = accountSummary !== null ? `
    <section class="card">
      <div class="card-label">All-time (account)</div>
      <div class="kpi-mini-row">
        <div class="kpi-mini"><div class="kpi-mini-val cyan">${formatCompactNumber(accountSummary.allTime.tokensSaved)}</div><div class="kpi-mini-label">Tokens saved</div></div>
        <div class="kpi-mini"><div class="kpi-mini-val green">$${((accountSummary.allTime.tokensSaved / 1_000_000) * 3).toFixed(2)}</div><div class="kpi-mini-label">Cost saved</div></div>
        <div class="kpi-mini"><div class="kpi-mini-val amber">${accountSummary.allTime.loops}</div><div class="kpi-mini-label">Loops total</div></div>
      </div>
    </section>` : '';

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
<title>LoopGuard</title>
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --bg:       #050B14;
  --card:     #0D1826;
  --border:   #1A2740;
  --text:     #E2EAF4;
  --muted:    #6B849E;
  --dim:      #3D5470;
  --cyan:     #22D3EE;
  --green:    #22C55E;
  --amber:    #F59E0B;
  --red:      #EF4444;
  --red-bg:   rgba(239,68,68,0.06);
  --red-bdr:  rgba(239,68,68,0.2);
}
body {
  background: var(--bg);
  color: var(--text);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  font-size: 13px;
  line-height: 1.5;
  padding: 0;
}
a { color: inherit; text-decoration: none; }
/* ── header ── */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  background: rgba(5,11,20,0.95);
  backdrop-filter: blur(12px);
  z-index: 10;
}
.brand { font-size: 13px; font-weight: 700; color: var(--text); letter-spacing: -0.01em; }
.brand span { color: var(--dim); font-weight: 400; margin-left: 6px; }
.header-right { display: flex; align-items: center; gap: 10px; }
.status-pill {
  display: inline-flex; align-items: center; gap: 6px;
  border: 1px solid var(--border); border-radius: 999px;
  padding: 3px 10px; font-size: 11px; color: var(--muted);
}
.dot { width: 6px; height: 6px; border-radius: 50%; background: var(--dim); flex-shrink: 0; }
.dot.active { background: var(--green); animation: pulse 2s infinite; }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
/* ── layout ── */
.body { padding: 16px 20px; display: flex; flex-direction: column; gap: 14px; }
/* ── cards ── */
.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 14px;
  overflow: hidden;
}
.card-label {
  padding: 12px 16px 0;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--dim);
}
/* ── kpi row ── */
.kpi-row { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
.kpi {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 14px 16px;
}
.kpi-label {
  font-size: 10px; font-weight: 700; letter-spacing: 0.18em;
  text-transform: uppercase; color: var(--dim); margin-bottom: 6px;
}
.kpi-val { font-size: 26px; font-weight: 700; letter-spacing: -0.02em; font-variant-numeric: tabular-nums; }
.kpi-sub { font-size: 11px; color: var(--dim); margin-top: 4px; }
.cyan { color: var(--cyan); }
.green { color: var(--green); }
.amber { color: var(--amber); }
.white { color: var(--text); }
/* ── active alert ── */
.alert-active {
  display: flex; gap: 12px; align-items: flex-start;
  background: var(--red-bg); border: 1px solid var(--red-bdr);
  border-radius: 14px; padding: 14px 16px;
}
.alert-icon { color: var(--red); font-size: 16px; flex-shrink: 0; margin-top: 1px; }
.alert-title { font-size: 13px; font-weight: 600; color: var(--red); margin-bottom: 4px; }
.alert-sub { font-size: 11px; color: var(--muted); line-height: 1.5; }
/* ── loop rows ── */
.loop-row {
  display: flex; align-items: center; justify-content: space-between; gap: 10px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
}
.loop-row:last-child { border-bottom: none; }
.loop-row:hover { background: rgba(255,255,255,0.015); }
.loop-row-left { min-width: 0; flex: 1; }
.loop-hash { font-family: monospace; font-size: 11px; color: #8BA5C2; margin-bottom: 2px; }
.loop-msg { font-size: 12px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 4px; }
.loop-meta { display: flex; gap: 10px; font-size: 10px; color: var(--dim); }
/* ── pills ── */
.pill {
  flex-shrink: 0; border-radius: 999px; padding: 2px 8px;
  font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
}
.pill-active { background: rgba(239,68,68,0.1); color: var(--red); border: 1px solid rgba(239,68,68,0.2); }
.pill-resolved { background: rgba(34,197,94,0.08); color: var(--green); border: 1px solid rgba(34,197,94,0.2); }
/* ── empty state ── */
.empty-state {
  display: flex; flex-direction: column; align-items: center;
  padding: 32px 16px; text-align: center;
}
.empty-check {
  width: 36px; height: 36px; border-radius: 50%;
  background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.2);
  color: var(--green); font-size: 16px;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 10px;
}
.empty-title { font-size: 13px; font-weight: 600; color: var(--muted); margin-bottom: 4px; }
.empty-sub { font-size: 11px; color: var(--dim); }
/* ── engine row ── */
.engine-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 16px; gap: 8px;
}
.engine-label { font-size: 12px; color: var(--muted); }
.engine-badge {
  font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
  padding: 2px 8px; border-radius: 999px;
}
.engine-native { background: rgba(34,211,238,0.08); color: var(--cyan); border: 1px solid rgba(34,211,238,0.2); }
.engine-fallback { background: rgba(245,158,11,0.08); color: var(--amber); border: 1px solid rgba(245,158,11,0.2); }
/* ── kpi-mini ── */
.kpi-mini-row { display: flex; gap: 0; padding: 12px 16px; }
.kpi-mini { flex: 1; }
.kpi-mini + .kpi-mini { border-left: 1px solid var(--border); padding-left: 14px; margin-left: 14px; }
.kpi-mini-val { font-size: 18px; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 2px; }
.kpi-mini-label { font-size: 10px; color: var(--dim); text-transform: uppercase; letter-spacing: 0.12em; font-weight: 600; }
/* ── memory ── */
.memory-row {
  display: flex; align-items: flex-start; justify-content: space-between; gap: 10px;
  padding: 10px 16px; border-bottom: 1px solid var(--border);
}
.memory-row:last-child { border-bottom: none; }
.memory-left { min-width: 0; flex: 1; }
.mono { font-family: monospace; font-size: 11px; color: #8BA5C2; }
.memory-sub { font-size: 11px; color: var(--dim); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 240px; }
.memory-file { font-family: monospace; font-size: 10px; color: var(--green); flex-shrink: 0; max-width: 130px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
/* ── actions ── */
.actions { display: flex; flex-wrap: wrap; gap: 8px; padding: 14px 16px; }
.btn {
  border-radius: 8px; padding: 7px 14px; font-size: 12px; font-weight: 600;
  cursor: pointer; border: none; text-decoration: none; display: inline-block;
}
.btn-primary { background: #1D3D6B; color: #93C5FD; }
.btn-secondary { background: var(--card); border: 1px solid var(--border); color: var(--muted); }
.btn-ghost { background: transparent; color: var(--dim); font-size: 11px; }
.btn:hover { opacity: 0.85; }
/* ── session row ── */
.session-row {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 16px; font-size: 11px; color: var(--dim);
}
.session-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--dim); }
/* ── footer ── */
.footer { padding: 16px 20px; font-size: 11px; color: var(--dim); text-align: center; }
</style>
</head>
<body>
<div class="header">
  <div class="brand">LoopGuard<span>/ dashboard</span></div>
  <div class="header-right">
    <div class="status-pill">
      <span class="dot${activeCount > 0 ? ' active' : ''}"></span>
      ${activeCount > 0 ? `${activeCount} active` : 'Session: ' + escHtml(sessionDur)}
    </div>
  </div>
</div>

<div class="body">

  <!-- KPI row -->
  <div class="kpi-row">
    <div class="kpi">
      <div class="kpi-label">Loops</div>
      <div class="kpi-val ${metrics.totalLoopsDetected > 0 ? 'amber' : 'white'}">${metrics.totalLoopsDetected}</div>
      <div class="kpi-sub">${activeCount} active now</div>
    </div>
    <div class="kpi">
      <div class="kpi-label">Time wasted</div>
      <div class="kpi-val ${metrics.totalTimeWasted > 0 ? 'amber' : 'white'}">${escHtml(timeWasted)}</div>
      <div class="kpi-sub">this session</div>
    </div>
    <div class="kpi">
      <div class="kpi-label">Tokens saved</div>
      <div class="kpi-val cyan">${escHtml(tokensSaved)}</div>
      <div class="kpi-sub">this session</div>
    </div>
    <div class="kpi">
      <div class="kpi-label">Cost saved</div>
      <div class="kpi-val green">$${escHtml(costSaved)}</div>
      <div class="kpi-sub">at Sonnet pricing</div>
    </div>
  </div>

  ${activeAlert}

  <!-- Loop list -->
  <section class="card">
    <div class="card-label" style="padding-bottom:12px">Recent loops</div>
    ${loopRows}
  </section>

  <!-- Engine status -->
  <section class="card">
    <div class="engine-row">
      <span class="engine-label">Context engine</span>
      <span class="engine-badge ${engineTier === 'rust' ? 'engine-native' : 'engine-fallback'}">
        ${engineTier === 'rust' ? 'Native helper' : 'Fallback mode'}
      </span>
    </div>
    <div class="actions">
      <a class="btn btn-primary" href="command:loopguard.copyContext">Copy focused context</a>
      <a class="btn btn-secondary" href="command:loopguard.resetSession">Reset session</a>
      <a class="btn btn-ghost" href="https://loopguard.dev/dashboard">Web dashboard →</a>
    </div>
  </section>

  ${accountSection}
  ${memorySection}

</div>
<div class="footer">Your code never leaves this machine.</div>
</body>
</html>`;
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
