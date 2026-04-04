import type { Metadata } from 'next';
import Link from 'next/link';
import LoopGuardLogo from '../../components/LoopGuardLogo';

export const metadata: Metadata = {
  title: 'Roadmap — LoopGuard',
  description:
    'LoopGuard version history and what is coming next — v1 extension core, v2 CLI sync pipeline, v3 intelligence layer.',
  openGraph: {
    title: 'Roadmap — LoopGuard',
    description: 'What shipped, what is current, and what is coming next.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
};

const VERSIONS = [
  {
    version: 'v1',
    label: 'Extension Core',
    status: 'shipped' as const,
    summary:
      'The VS Code extension that started it all. Loop detection, status bar metrics, and focused context snapshots — all running locally in the editor, no account required.',
    sections: [
      {
        heading: 'Loop detection — VS Code, Cursor, Windsurf',
        items: [
          'Diagnostic loop detection via vscode.languages.onDidChangeDiagnostics — fires when the same error hash reappears 2–5× per session',
          'Edit-pattern detection via onDidChangeTextDocument — catches repeated edits in the same region even when error text shifts',
          'Configurable sensitivity: low (5×), medium (3×), high (2×)',
          'Status bar: time wasted in loop + repeat count, always visible',
          'Alert actions: Try New Approach, View Details, Ignore',
        ],
      },
      {
        heading: 'Focused context engine',
        items: [
          'Copy Optimized Context — built-in mode lifts the failing window, imports, and nearby definitions',
          'Native helper path (loopguard-ctx) for deeper focused reads on larger files',
          'Before/after token estimate shown with every copy',
          'Automatic fallback to built-in mode when helper is unavailable',
        ],
      },
      {
        heading: 'IDE + platform support',
        items: [
          'VS Code — full support, published to VS Code Marketplace',
          'Cursor — same extension, cursor:// URI auth auto-detected',
          'Windsurf — same extension, windsurf:// URI auto-detected',
          'Multi-IDE auth via vscode.env.uriScheme detection',
          'Windows · macOS · Linux — x64 and ARM64, binary inside platform VSIX',
        ],
      },
      {
        heading: 'Dashboard & sync',
        items: [
          'In-editor dashboard: session time, time lost, tokens saved, cost avoided',
          'Optional web dashboard sync — anonymized metrics only, source code never leaves device',
          'Sync every 5 minutes and on session end',
          'Core protection works fully offline — sign-in never required',
        ],
      },
    ],
  },
  {
    version: 'v2',
    label: 'CLI + Sync Pipeline',
    status: 'current' as const,
    summary:
      'The loopguard-ctx binary brings the context engine to every terminal-based AI workflow. MCP tools, Homebrew, anonymous device sync, and a shareable Wrapped stats card.',
    sections: [
      {
        heading: 'loopguard-ctx binary — all platforms',
        items: [
          '20+ MCP tools: ctx_read, ctx_shell, ctx_search, ctx_tree, ctx_session, ctx_wrapped, ctx_compress, ctx_metrics and more',
          'Homebrew tap: brew tap rodthenewcomer/loopguard && brew install loopguard-ctx',
          'curl installer for environments without Homebrew',
          'GitHub release binaries: macOS (x64/ARM64), Linux (x64/ARM64 gnu), Windows (x64)',
          'Rust-built single binary, no runtime dependencies',
        ],
      },
      {
        heading: 'All IDEs + CLI tools wired',
        items: [
          'Claude Code — PreToolUse rewrite, PostToolUse periodic, Stop sync, UserPromptSubmit session protocol',
          'Cursor — terminal_command rewrite hook + postToolUse periodic notify+sync every 15 min',
          'Windsurf — MCP config + .windsurfrules project file; loopguard-ctx setup --agent=windsurf',
          'Codex CLI — MCP config + ~/.codex/ instruction file; loopguard-ctx setup --agent=codex',
          'GitHub Copilot (VS Code MCP) — via VS Code MCP server config',
          'Shell hooks (bash, zsh, fish) — compressed CLI output before it reaches any agent',
        ],
      },
      {
        heading: 'Anonymous sync & Wrapped',
        items: [
          'Device UUID at ~/.loopguard-ctx/device.json — no account needed',
          'Stop hook syncs stats in background at session end',
          'Cursor periodic hook syncs every 15 min (no session-end event in Cursor)',
          '/wrapped shareable stats card with dynamic OG meta — tokens saved, $ avoided, 14-day spark chart',
          'Session task surfacing — last task description shown at every session start',
        ],
      },
      {
        heading: 'Session continuity protocol',
        items: [
          'ctx_session load/save/status — restore previous task context across chat sessions',
          'ctx_session finding / decision — record key findings and architectural decisions inline',
          'ctx_overview(task) — task-relevant project map before reading any file',
          'ctx_wrapped("session") — savings report card at session end',
          'UserPromptSubmit hook injects mandatory session protocol on first prompt of every session',
        ],
      },
    ],
  },
  {
    version: 'v3',
    label: 'Intelligence Layer',
    status: 'live' as const,
    summary:
      'The intelligence layer — shipped. v3 brings root cause hints, predictive context pre-selection, local fix memory, and cost forecasting to every IDE and CLI tool LoopGuard supports.',
    sections: [
      {
        heading: 'Loop root cause hints',
        items: [
          'When a loop fires, analyze diagnostic text + edit history to surface a specific diagnosis — not just "you\'re looping"',
          'Lightweight local inference — no mandatory cloud round-trip',
          'Works in VS Code/Cursor/Windsurf (extension alerts) and Claude Code/Codex/Cursor terminal (CLI hooks)',
          'Example output: "This matches a type narrowing issue — try narrowing at the call site instead of the definition"',
          'Grounded in the actual error pattern of the current session, not generic advice',
        ],
      },
      {
        heading: 'Predictive context pre-selection',
        items: [
          'Ranks every file in the workspace by keyword overlap, path relevance, and session history — before any read',
          'VS Code/Cursor/Windsurf: Copy Optimized Context appends predicted related files to clipboard output',
          'CLI: loopguard-ctx predict "<task>" --path=<dir> or ctx_predict via MCP',
          'Runs locally, zero network calls — pure keyword and path scoring',
          'Session history boost: files you touched this session rank higher automatically',
        ],
      },
      {
        heading: 'Session pattern memory',
        items: [
          'Locally stored index of what fixed similar bugs in past sessions',
          '"Last 3 times this error appeared, the fix was in auth/middleware.ts:42" — surfaced automatically',
          'Never synced to the server, never leaves the device',
          'Queryable via ctx_memory MCP tool and visible in the extension dashboard',
          'Compounds value the longer you work in the same codebase',
        ],
      },
      {
        heading: 'Pre-send cost forecast',
        items: [
          'Before a session starts, estimate token cost based on task description + workspace size',
          '"This refactor looks like 40k tokens at ~$0.12 — here\'s the focused slice that gets it to 8k"',
          'Shown in extension status bar and as ctx_forecast MCP tool for CLI workflows',
          'Supports Sonnet, Haiku, GPT-4o, and Gemini pricing models',
          'Injected into Claude Code UserPromptSubmit hook so the estimate appears before work begins',
        ],
      },
    ],
  },
];

const STATUS_CONFIG = {
  shipped:    { label: 'Shipped',     color: '#22C55E' },
  current:    { label: 'Current',     color: '#22D3EE' },
  live:       { label: 'Live',        color: '#A78BFA' },
  inprogress: { label: 'In progress', color: '#F59E0B' },
  next:       { label: 'Up next',     color: '#818CF8' },
};

export default function RoadmapPage() {
  return (
    <div className="min-h-screen bg-[#0B1220]">
      <header className="sticky top-0 z-40 border-b border-[#1F2937] bg-[#0B1220]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <LoopGuardLogo showWordmark size={28} />
          </Link>
          <div className="flex items-center gap-4 text-sm text-[#6B7280]">
            <Link href="/docs" className="transition-colors hover:text-[#9CA3AF]">Docs</Link>
            <Link href="/setup" className="rounded-lg bg-[#2563EB] px-3 py-1.5 font-medium text-white transition-colors hover:bg-[#1d4ed8]">
              Install
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-16">
          <div className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#4B5563]">LoopGuard</div>
          <h1 className="mb-4 text-5xl font-bold tracking-[-0.05em] text-white">Roadmap</h1>
          <p className="max-w-xl text-lg leading-8 text-[#6B7280]">
            Three versions. What shipped, what is live now, and what is coming — with the full
            feature list for every IDE and CLI tool.
          </p>
          <p className="mt-4 text-sm text-[#4B5563]">
            Feature request?{' '}
            <a
              href="https://github.com/rodthenewcomer/loopguard/issues"
              className="text-[#6B7280] underline underline-offset-2 transition-colors hover:text-[#9CA3AF]"
            >
              Open an issue on GitHub
            </a>
          </p>
        </div>

        <div className="space-y-20">
          {VERSIONS.map((v) => {
            const cfg = STATUS_CONFIG[v.status];
            return (
              <div key={v.version}>
                <div className="mb-8 flex flex-wrap items-center gap-3 border-b border-white/8 pb-6">
                  <span
                    className="rounded-full px-3 py-1 text-sm font-black uppercase tracking-[0.2em]"
                    style={{ color: cfg.color, background: `${cfg.color}18`, border: `1px solid ${cfg.color}33` }}
                  >
                    {v.version}
                  </span>
                  <h2 className="text-2xl font-bold tracking-[-0.04em] text-white">{v.label}</h2>
                  <span
                    className="ml-auto rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-[0.18em]"
                    style={{ color: cfg.color, background: `${cfg.color}12`, border: `1px solid ${cfg.color}28` }}
                  >
                    {cfg.label}
                  </span>
                </div>

                <p className="mb-8 max-w-2xl text-sm leading-7 text-[#8CA1B8]">{v.summary}</p>

                <div className="grid gap-5 sm:grid-cols-2">
                  {v.sections.map((section) => (
                    <div
                      key={section.heading}
                      className="rounded-[20px] border border-white/8 bg-[#080f1c] p-5"
                    >
                      <div
                        className="mb-4 text-[11px] font-bold uppercase tracking-[0.22em]"
                        style={{ color: cfg.color }}
                      >
                        {section.heading}
                      </div>
                      <ul className="space-y-2.5">
                        {section.items.map((item) => (
                          <li key={item} className="flex items-start gap-2.5 text-sm leading-6 text-[#8CA1B8]">
                            <span
                              className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                              style={{ background: cfg.color }}
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-20 rounded-[24px] border border-white/8 bg-[#080f1c] px-7 py-8 text-center">
          <div className="mb-2 text-sm font-semibold uppercase tracking-[0.28em] text-[#4B5563]">
            Install now
          </div>
          <p className="mb-6 text-sm text-[#8CA1B8]">
            v1 and v2 are live. Start with the extension or the CLI helper — both take under 60 seconds.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/setup"
              className="rounded-full bg-[#2563EB] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1d4ed8]"
            >
              Setup guide
            </Link>
            <Link
              href="/docs"
              className="rounded-full border border-white/10 px-6 py-2.5 text-sm font-semibold text-[#D6E3F1] transition hover:border-white/20 hover:text-white"
            >
              Documentation
            </Link>
          </div>
        </div>
      </div>

      <footer className="mt-8 border-t border-[#1F2937]">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-8">
          <p className="text-xs text-[#4B5563]">© 2026 LoopGuard · MIT License</p>
          <div className="flex items-center gap-4 text-xs text-[#4B5563]">
            <Link href="/" className="transition-colors hover:text-[#6B7280]">Home</Link>
            <Link href="/docs" className="transition-colors hover:text-[#6B7280]">Docs</Link>
            <a href="https://github.com/rodthenewcomer/loopguard/issues" className="transition-colors hover:text-[#6B7280]">Issues</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
