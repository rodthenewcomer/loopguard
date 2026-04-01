import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Documentation — LoopGuard',
  description: 'Complete documentation for LoopGuard — installation, loop detection, focused context copy, MCP setup, shell helpers, and troubleshooting.',
};

/* ── Sidebar nav ─────────────────────────────────────────────────── */
const NAV = [
  {
    group: 'Getting Started',
    items: [
      { label: 'Installation',              id: 'installation' },
      { label: 'Claude Code terminal',      id: 'install-terminal' },
      { label: 'First launch',              id: 'first-launch' },
      { label: 'Quick reference',           id: 'commands' },
    ],
  },
  {
    group: 'Loop Detection',
    items: [
      { label: 'How it works',      id: 'loop-detection' },
      { label: 'Alert actions',     id: 'alerts' },
      { label: 'Sensitivity',       id: 'sensitivity' },
    ],
  },
  {
    group: 'Context Engine',
    items: [
      { label: 'Copy Optimized Context', id: 'context-engine' },
      { label: 'Rust vs TypeScript',     id: 'engines' },
      { label: 'Supported languages',    id: 'languages' },
    ],
  },
  {
    group: 'Dashboard & Sync',
    items: [
      { label: 'VS Code dashboard', id: 'dashboard' },
      { label: 'Account & sync',    id: 'sync' },
    ],
  },
  {
    group: 'Integrations',
    items: [
      { label: 'MCP server', id: 'mcp' },
      { label: 'Shell helper',  id: 'shell-hooks' },
      { label: 'Binary install',id: 'binary' },
    ],
  },
  {
    group: 'Configuration',
    items: [
      { label: 'All settings',      id: 'configuration' },
      { label: 'settings.json',     id: 'settings-json' },
    ],
  },
  {
    group: 'Troubleshooting',
    items: [
      { label: 'Loops not detected', id: 'no-detection' },
      { label: 'Binary not found',   id: 'binary-missing' },
      { label: 'MCP setup failed',   id: 'mcp-debug' },
      { label: 'Sign-in issues',     id: 'auth-debug' },
    ],
  },
];

/* ── Shared prose components ─────────────────────────────────────── */
function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="text-2xl font-bold text-white mt-16 mb-4 scroll-mt-24 flex items-center gap-2">
      <a href={`#${id}`} className="text-[#374151] hover:text-[#6B7280] transition-colors text-lg">#</a>
      {children}
    </h2>
  );
}
function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="text-lg font-semibold text-[#F9FAFB] mt-8 mb-3">{children}</h3>;
}
function P({ children }: { children: React.ReactNode }) {
  return <p className="text-[#9CA3AF] text-sm leading-relaxed mb-4">{children}</p>;
}
function Code({ children }: { children: React.ReactNode }) {
  return <code className="font-mono text-[#22D3EE] bg-[#0d1117] border border-[#1F2937] px-1.5 py-0.5 rounded text-xs">{children}</code>;
}
function Pre({ children }: { children: React.ReactNode }) {
  return (
    <pre className="rounded-xl border border-[#1F2937] bg-[#0d1117] text-[#9CA3AF] text-xs font-mono p-5 overflow-x-auto mb-6 leading-relaxed">
      {children}
    </pre>
  );
}
function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[#22D3EE]/20 bg-[#22D3EE]/5 px-5 py-3.5 mb-6 flex items-start gap-3">
      <span className="text-[#22D3EE] font-bold text-xs uppercase tracking-wide mt-0.5 flex-shrink-0">Note</span>
      <p className="text-[#9CA3AF] text-sm leading-relaxed">{children}</p>
    </div>
  );
}
function Warning({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[#F59E0B]/25 bg-[#F59E0B]/5 px-5 py-3.5 mb-6 flex items-start gap-3">
      <span className="text-[#F59E0B] font-bold text-xs uppercase tracking-wide mt-0.5 flex-shrink-0">Warning</span>
      <p className="text-[#9CA3AF] text-sm leading-relaxed">{children}</p>
    </div>
  );
}
function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 mb-6">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-sm text-[#9CA3AF]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5" aria-hidden="true">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto mb-6">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-[#1F2937]">
            {headers.map((h) => (
              <th key={h} className="text-left text-xs uppercase tracking-wide text-[#6B7280] py-2.5 px-4 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-[#1F2937]/50 hover:bg-[#111827]/40 transition-colors">
              {row.map((cell, j) => (
                <td key={j} className="py-2.5 px-4 text-[#9CA3AF] font-mono text-xs">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════════════ */
export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#0B1220]">

      {/* ── Sticky header ───────────────────────────────────────── */}
      <header className="border-b border-[#1F2937] sticky top-0 z-40 bg-[#0B1220]/95 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/icon-192x192.png" alt="LoopGuard" width="28" height="28" className="rounded-lg" />
            <span className="font-bold text-white">LoopGuard</span>
            <span className="text-[#374151] mx-1 hidden sm:inline">/</span>
            <span className="text-sm text-[#6B7280] hidden sm:inline">Docs</span>
          </Link>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/rodthenewcomer/loopguard"
              className="text-sm text-[#6B7280] hover:text-[#9CA3AF] transition-colors hidden sm:block"
            >
              GitHub
            </a>
            <a
              href="/setup"
              className="px-3 py-1.5 bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-sm font-medium rounded-lg transition-colors"
            >
              Install Extension
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 flex gap-12 py-12">

        {/* ── Sidebar ─────────────────────────────────────────────── */}
        <nav className="hidden lg:block w-56 flex-shrink-0 sticky top-24 self-start max-h-[calc(100vh-6rem)] overflow-y-auto pr-2">
          {NAV.map((group) => (
            <div key={group.group} className="mb-6">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#4B5563] mb-2 px-3">
                {group.group}
              </div>
              {group.items.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="block px-3 py-1.5 text-sm text-[#6B7280] hover:text-[#9CA3AF] hover:bg-[#111827]/60 rounded-lg transition-colors duration-150"
                >
                  {item.label}
                </a>
              ))}
            </div>
          ))}
        </nav>

        {/* ── Main content ────────────────────────────────────────── */}
        <main className="flex-1 min-w-0">
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-white mb-3">Documentation</h1>
            <p className="text-[#6B7280] text-lg">
              Everything you need to install, configure, and get the most out of LoopGuard.
            </p>
          </div>

          {/* ═══════════════════════════════════════════════════════
              GETTING STARTED
          ═══════════════════════════════════════════════════════ */}
          <H2 id="installation">Installation</H2>
          <P>
            LoopGuard has two install paths. Pick the one that matches how you work.
          </P>
          <Table
            headers={['Path', 'What you get', 'Account needed?']}
            rows={[
              ['VS Code extension', 'Loop detection + context engine + dashboard', 'No (optional for sync)'],
              ['Claude Code terminal (binary only)', 'Context engine via MCP + shell compression', 'No — runs 100% locally'],
            ]}
          />
          <Note>
            Loop detection (diagnostic + edit-pattern alerts) requires the VS Code extension. It uses the VS Code
            diagnostics API and is not available in terminal-only mode. The standalone binary provides context
            compression only.
          </Note>

          <H3>VS Code · Cursor · Windsurf (extension)</H3>
          <P>Open VS Code, press <Code>Ctrl+P</Code> (or <Code>Cmd+P</Code> on macOS), and run:</P>
          <Pre>ext install LoopGuard.loopguard</Pre>
          <P>Or search <strong className="text-white">LoopGuard</strong> in the Extensions panel and click Install. Works identically in Cursor and Windsurf — the URI callback auto-detects your IDE.</P>

          <h3 id="install-terminal" className="text-lg font-semibold text-[#F9FAFB] mt-8 mb-3 scroll-mt-24">Claude Code terminal (no VS Code required)</h3>
          <P>
            If you use Claude Code in the terminal without VS Code, install the standalone binary instead.
            No account, no extension, no sign-in needed — everything runs locally.
          </P>
          <H3>Step 1 — Install loopguard-ctx</H3>
          <Pre>{`# Homebrew (recommended)
brew install rodthenewcomer/tap/loopguard-ctx

# Or one-liner curl (auto-detects platform)
curl -fsSL https://loopguard.vercel.app/install.sh | sh

# Verify
loopguard-ctx --version`}</Pre>
          <H3>Step 2 — Wire Claude Code (installs all 4 enforcement layers)</H3>
          <Pre>{`loopguard-ctx setup --agent=claude`}</Pre>
          <P>
            This single command installs:
          </P>
          <CheckList items={[
            'MCP server registration in ~/.claude.json',
            'Bash rewrite PreToolUse hook (routes all shell commands through loopguard-ctx)',
            'Enforce PreToolUse hook (blocks native Read/Grep, enforces ctx_read)',
            'Global ~/.claude/CLAUDE.md with mandatory tool routing + CCP session restore header',
          ]} />
          <H3>Step 3 — Session continuity (CCP)</H3>
          <P>
            After setup, every new Claude Code session starts with this instruction at the top of CLAUDE.md:
          </P>
          <Pre>{`ctx_session load`}</Pre>
          <P>
            This restores the previous session state — task, files read, key findings — in ~400 tokens
            instead of the 50K+ tokens a cold start costs. Run <Code>ctx_session status</Code> at any
            time to see what was restored.
          </P>
          <H3>Step 4 — Verify</H3>
          <Pre>{`loopguard-ctx doctor`}</Pre>
          <P>
            Checks all 4 layers: MCP registration, Bash rewrite hook, enforce hook, and CLAUDE.md.
            Run <Code>loopguard-ctx gain</Code> at any time to see token savings.
          </P>
          <Warning>
            Loop detection is not available in terminal-only mode. If you want loop detection alerts,
            install the VS Code extension instead (or in addition).
          </Warning>

          <H3>Manual installation (.vsix)</H3>
          <P>
            If you prefer to install manually, download the platform-specific VSIX from{' '}
            <a href="https://github.com/rodthenewcomer/loopguard/releases/latest" className="text-[#2563EB] hover:text-[#3B82F6] underline underline-offset-2 transition-colors">
              GitHub Releases
            </a>{' '}
            and run:
          </P>
          <Pre>code --install-extension loopguard-darwin-arm64.vsix</Pre>
          <Table
            headers={['Platform', 'VSIX filename']}
            rows={[
              ['macOS Apple Silicon (M1/M2/M3)', 'loopguard-darwin-arm64.vsix'],
              ['macOS Intel', 'loopguard-darwin-x64.vsix'],
              ['Windows x64', 'loopguard-win32-x64.vsix'],
              ['Linux x64', 'loopguard-linux-x64.vsix'],
              ['Linux ARM64', 'loopguard-linux-arm64.vsix'],
            ]}
          />
          <Note>
            The Marketplace automatically installs the correct platform binary. Manual download is
            only needed in air-gapped environments or if the automatic binary fails to load.
          </Note>

          {/* ─────────────────────────────────────────────────────── */}
          <H2 id="first-launch">First launch</H2>
          <P>
            LoopGuard activates automatically when VS Code starts (activation event:{' '}
            <Code>onStartupFinished</Code>). You do not need to run any command to enable it.
          </P>

          <H3>What you see on first launch</H3>
          <CheckList items={[
            'The LoopGuard status bar item appears at the bottom of VS Code — in the clean state it shows the standard check-mark variant of LoopGuard.',
            'The output channel "LoopGuard" is created. Open it with View → Output → LoopGuard to see diagnostics.',
            'A welcome notification appears with a link to sign in and connect to the web dashboard (optional).',
            'Loop detection starts immediately — no sign-in required for the core features.',
          ]} />

          <H3>Account (optional)</H3>
          <P>
            LoopGuard works fully without an account. Sign in only if you want your session metrics
            synced to the web dashboard. To sign in, run the command{' '}
            <Code>LoopGuard: Sign In</Code> from the Command Palette (<Code>Ctrl+Shift+P</Code>).
            A browser window opens, you authenticate, and the token is stored in your OS secure
            keychain (macOS Keychain, Windows Credential Manager, Linux libsecret) via VS Code
            SecretStorage.
          </P>

          {/* ─────────────────────────────────────────────────────── */}
          <H2 id="commands">Quick reference</H2>
          <P>All LoopGuard commands are available in the Command Palette (<Code>Ctrl+Shift+P</Code> / <Code>Cmd+Shift+P</Code>).</P>
          <Table
            headers={['Command', 'What it does']}
            rows={[
              ['LoopGuard: Copy Optimized Context', 'Compress current file context and copy to clipboard'],
              ['LoopGuard: Show Dashboard', 'Open the in-IDE dashboard with live session metrics'],
              ['LoopGuard: Sign In', 'Authenticate with your LoopGuard account (optional)'],
              ['LoopGuard: Sign Out', 'Remove stored credentials from secure keychain'],
              ['LoopGuard: Configure MCP Server', 'Write the MCP server config to your AI tool'],
              ['LoopGuard: Install Shell Hooks', 'Install the shell helper using the bundled loopguard-ctx binary'],
              ['LoopGuard: Toggle Detection', 'Pause or resume loop detection for the current session'],
              ['LoopGuard: Reset Session', 'Clear current session loop counter and timer'],
            ]}
          />

          {/* ═══════════════════════════════════════════════════════
              LOOP DETECTION
          ═══════════════════════════════════════════════════════ */}
          <H2 id="loop-detection">How loop detection works</H2>
          <P>
            LoopGuard uses two independent detection methods simultaneously. Either method alone
            can trigger an alert. Both run entirely on your local machine with no cloud round-trip.
          </P>

          <H3>Method 1 — Diagnostic loop detection</H3>
          <P>
            LoopGuard subscribes to <Code>vscode.languages.onDidChangeDiagnostics</Code>. Every
            time VS Code reports a diagnostic (error, warning) for any file, LoopGuard computes a
            short deterministic fingerprint of the diagnostic text. If the same fingerprint appears N times in a session
            (where N is your sensitivity threshold), a loop is detected.
          </P>
          <P>
            This catches the most common case: you ask AI to fix an error, it gives you the same
            fix with different variable names, and the same error reappears.
          </P>

          <H3>Method 2 — Edit-pattern loop detection</H3>
          <P>
            LoopGuard also watches <Code>vscode.workspace.onDidChangeTextDocument</Code>. It
            tracks repeated edits in the same region of a file over a short time window. If you keep
            revisiting the same lines without breaking out, LoopGuard can flag that as an edit loop
            even when the diagnostic text changes.
          </P>
          <P>
            This catches more subtle loops — for example, when you rename a variable three times
            trying different things and always end up back at the same code.
          </P>

          <H3>What gets tracked</H3>
          <P>
            LoopGuard syncs only an anonymized fingerprint of the error message. The original
            message text is never sent to the backend. The file type (for example <Code>ts</Code>{' '}
            or <Code>py</Code>) is stored — never the file name or file path. See the{' '}
            <Link href="/privacy" className="text-[#2563EB] hover:text-[#3B82F6] underline underline-offset-2 transition-colors">
              Privacy Policy
            </Link>{' '}
            for the full data inventory.
          </P>

          {/* ─────────────────────────────────────────────────────── */}
          <H2 id="alerts">Alert actions</H2>
          <P>
            When a loop is detected, a VS Code notification appears with the exact minutes wasted
            and three action buttons:
          </P>
          <Table
            headers={['Action', 'What it does']}
            rows={[
              ['Try New Approach', 'Shows a short loop-breaking suggestion such as isolating the repro or asking the AI to explain instead of patch'],
              ['View Details', 'Opens the dashboard webview with the current session metrics and active loops'],
              ['Ignore', 'Marks the current active loop as ignored so the same loop is not immediately re-alerted'],
            ]}
          />
          <Note>
            Closing the notification without choosing an action does not reset the loop counter. If you
            want to clear everything, run <Code>LoopGuard: Reset Session</Code> from the Command Palette.
          </Note>

          {/* ─────────────────────────────────────────────────────── */}
          <H2 id="sensitivity">Sensitivity settings</H2>
          <P>
            Sensitivity controls how many times the same error hash must appear before a loop is
            declared. Lower sensitivity = more alerts, fewer false negatives.
          </P>
          <Table
            headers={['Setting', 'Threshold', 'Use case']}
            rows={[
              ['low', '5×', 'Experienced developers who iterate quickly — fewer interruptions'],
              ['medium (default)', '3×', 'Balanced — catches real loops without false positives'],
              ['high', '2×', 'New to AI coding or easily distracted — alerts earlier'],
            ]}
          />
          <P>Change sensitivity in your settings:</P>
          <Pre>{`// settings.json
{
  "loopguard.sensitivity": "medium"
}`}</Pre>

          {/* ═══════════════════════════════════════════════════════
              CONTEXT ENGINE
          ═══════════════════════════════════════════════════════ */}
          <H2 id="context-engine">Copy Optimized Context</H2>
          <P>
            Instead of pasting an entire file into your AI chat, use{' '}
            <Code>LoopGuard: Copy Optimized Context</Code>. It extracts only what the AI needs to
            solve your current error and copies it to your clipboard. Paste it directly into Claude,
            ChatGPT, Cursor chat, or any AI tool.
          </P>

          <H3>What gets extracted</H3>
          <CheckList items={[
            'Import and dependency lines near the top of the file when they can be identified',
            'A focused window around the first active error in the current document (about 30 lines on each side in the TypeScript fallback)',
            'A local token estimate so LoopGuard can report approximate savings after the copy',
            'When the bundled loopguard-ctx binary is available, a richer entropy-based read path instead of the plain TypeScript fallback',
          ]} />

          <H3>Keyboard shortcut</H3>
          <P>Bind it to a key for one-keystroke context compression:</P>
          <Pre>{`// keybindings.json
{
  "key": "ctrl+shift+c",
  "command": "loopguard.copyContext",
  "when": "editorFocus"
}`}</Pre>

          {/* ─────────────────────────────────────────────────────── */}
          <H2 id="engines">Rust engine vs TypeScript engine</H2>
          <P>
            LoopGuard ships two context engine implementations. The TypeScript engine runs on every
            install. When the bundled <Code>loopguard-ctx</Code> binary is available, LoopGuard can
            use that richer local read path automatically.
          </P>
          <Table
            headers={['', 'TypeScript fallback', 'Bundled loopguard-ctx binary']}
            rows={[
              ['Typical behavior', 'Imports + focused nearby lines', 'Entropy-based focused read via the local binary'],
              ['Availability', 'Always available', 'Used when the bundled binary loads correctly'],
              ['Token savings', 'Often substantial, but estimate-based', 'Often higher, but still workload-dependent'],
              ['Network access', 'None', 'None'],
              ['Fallback', 'N/A', 'Falls back to TypeScript automatically on failure'],
            ]}
          />
          <P>
            The binary runs as a local subprocess (<Code>loopguard-ctx</Code>) and has no network
            access. The percentage shown in the extension UI is an estimate, not a tokenizer-perfect
            billing guarantee.
          </P>

          {/* ─────────────────────────────────────────────────────── */}
          <H2 id="languages">Supported languages</H2>
          <P>
            Loop detection itself is language-agnostic because it listens to IDE diagnostics. Context
            copy works best on common code and config files, and the binary path has broader language-aware
            support than the TypeScript fallback.
          </P>
          <Table
            headers={['Language family', 'Typical file types', 'Support level']}
            rows={[
              ['TypeScript / JavaScript', '.ts, .tsx, .js, .jsx', 'Strong'],
              ['Python / Rust / Go / Java', '.py, .rs, .go, .java', 'Strong'],
              ['C-family / C#', '.c, .cpp, .h, .cs', 'Good'],
              ['Config and data files', '.json, .yaml, .toml', 'Good'],
              ['Other text files', 'Any readable text document', 'Best effort'],
            ]}
          />

          {/* ═══════════════════════════════════════════════════════
              DASHBOARD & SYNC
          ═══════════════════════════════════════════════════════ */}
          <H2 id="dashboard">VS Code session dashboard</H2>
          <P>
            Run <Code>LoopGuard: Show Dashboard</Code> to open the in-IDE webview. It updates during
            the current session and shows:
          </P>
          <CheckList items={[
            'Current session duration, total time wasted, tokens saved, and estimated cost saved',
            'The active loop count and the current loop list',
            'Whether the bundled binary is active or LoopGuard is using the TypeScript fallback',
            'Short next-step suggestions when you are visibly stuck',
          ]} />
          <P>
            The dashboard is a VS Code webview panel. It updates automatically as the session
            progresses — no refresh needed.
          </P>

          {/* ─────────────────────────────────────────────────────── */}
          <H2 id="sync">Account and session sync</H2>
          <P>
            If you are signed in, LoopGuard syncs session metrics to the web dashboard every 5
            minutes and again on session end. Synced data is your account&rsquo;s only — Supabase
            row-level security ensures no other user can access it.
          </P>
          <P>
            The web dashboard refreshes periodically for signed-in users, so it feels near-real-time,
            but it is still limited by the extension&rsquo;s sync cadence.
          </P>
          <P>
            To connect your account: run <Code>LoopGuard: Sign In</Code> → a browser tab opens →
            sign in with email/password or Google → you are redirected back to VS Code automatically.
          </P>
          <Note>
            Session sync is optional. LoopGuard runs fully offline. If the API is unreachable, the
            extension keeps working locally, but it does not maintain a durable offline sync queue yet.
          </Note>

          {/* ═══════════════════════════════════════════════════════
              INTEGRATIONS
          ═══════════════════════════════════════════════════════ */}
          <H2 id="mcp">MCP server</H2>
          <P>
            <Code>loopguard-ctx</Code> can run as an MCP server over stdio, exposing focused file,
            search, tree, and shell tools to compatible AI agents. That means the agent can ask
            LoopGuard for a smarter read instead of grabbing full files every time.
          </P>
          <P>
            Today, LoopGuard can configure MCP for Claude Code, Cursor, Windsurf, Codex CLI, Zed,
            and VS Code / Copilot. If a tool supports custom MCP stdio servers, LoopGuard can usually
            plug into it.
          </P>

          <H3>Setup (one command)</H3>
          <P>
            Run <Code>LoopGuard: Configure MCP Server</Code> from the Command Palette. LoopGuard
            writes the correct config for your tool automatically, including the absolute path to the
            local <Code>loopguard-ctx</Code> binary.
          </P>
          <P>If you prefer to configure manually, use the config format your agent expects:</P>
          <Pre>{`// JSON-style MCP config (Cursor / Claude Code / Windsurf)
{
  "mcpServers": {
    "loopguard-ctx": {
      "command": "/absolute/path/to/loopguard-ctx"
    }
  }
}

# Codex CLI (~/.codex/config.toml)
[mcp_servers.loopguard-ctx]
command = "/absolute/path/to/loopguard-ctx"
args = []`}</Pre>

          <H3>Available MCP tools</H3>
          <Table
            headers={['Tool', 'What it does']}
            rows={[
              ['ctx_read', 'Focused file reads with multiple read modes'],
              ['ctx_search', 'Token-efficient code search results'],
              ['ctx_tree', 'Compact directory listings and project maps'],
              ['ctx_shell', 'Compressed shell output for supported commands'],
              ['Additional tools', 'The binary exposes more MCP tools; use setup or the binary docs to inspect the full list'],
            ]}
          />

          <H3>Cursor setup</H3>
          <P>
            Run <Code>loopguard-ctx setup --agent=cursor</Code> or use{' '}
            <Code>LoopGuard: Configure MCP Server</Code> from Cursor&rsquo;s Command Palette.
            This writes the MCP config to <Code>~/.cursor/mcp.json</Code> and installs a{' '}
            <Code>loopguard-ctx.mdc</Code> Cursor rule with mandatory tool routing and CCP session header.
          </P>
          <Pre>{`loopguard-ctx setup --agent=cursor`}</Pre>
          <P>
            After setup, add <Code>ctx_session load</Code> at the top of your Cursor AI chat when starting
            a new session. Cursor rules enforce <Code>ctx_read</Code> over built-in Read via the always-on
            <Code>.mdc</Code> rule.
          </P>

          <H3>Windsurf setup</H3>
          <P>
            Run <Code>loopguard-ctx setup --agent=windsurf</Code> or use{' '}
            <Code>LoopGuard: Configure MCP Server</Code>. This writes the MCP config to{' '}
            <Code>~/.codeium/windsurf/mcp_config.json</Code> and installs a <Code>windsurfrules.txt</Code>
            with mandatory tool routing and CCP session header.
          </P>
          <Pre>{`loopguard-ctx setup --agent=windsurf`}</Pre>
          <Note>
            Windsurf does not support PreToolUse hooks. The <Code>windsurfrules.txt</Code> instructs
            the model to use <Code>ctx_read</Code>, but enforcement is model-level only — not enforced
            by a hook like in Claude Code. For strongest enforcement, use Claude Code.
          </Note>

          {/* ─────────────────────────────────────────────────────── */}
          <H2 id="shell-hooks">Shell helper</H2>
          <P>
            The shell helper installs LoopGuard&rsquo;s local command wrapper so supported shell output can
            be reduced before you paste it into an AI tool or route it through a compatible agent flow.
          </P>
          <P>
            For example, <Code>npm install</Code>, <Code>git log</Code>, or <Code>docker build</Code>
            often generate far more output than an AI tool needs. LoopGuard&rsquo;s shell path is designed
            to keep the useful parts and drop repetitive noise.
          </P>

          <H3>Installation</H3>
          <Pre>{`# From the extension
LoopGuard: Install Shell Hooks

# Or with the standalone binary
loopguard-ctx init`}</Pre>
          <P>
            This adds a hook to your shell rc file (<Code>~/.zshrc</Code>, <Code>~/.bashrc</Code>,
            or <Code>~/.config/fish/config.fish</Code>). Restart your terminal or run{' '}
            <Code>source ~/.zshrc</Code> to activate.
          </P>

          <H3>How it works</H3>
          <P>
            The helper uses <Code>loopguard-ctx</Code> locally. The original command still runs on
            your machine; LoopGuard just gives you a cleaner representation for AI-facing workflows.
          </P>
          <Warning>
            Shell behavior varies by shell and AI tool. If you want the most predictable agent
            integration, MCP setup is the stronger path.
          </Warning>

          {/* ─────────────────────────────────────────────────────── */}
          <H2 id="binary">Binary installation details</H2>
          <P>
            The <Code>loopguard-ctx</Code> Rust binary is bundled inside the platform-specific VSIX.
            VS Code selects the correct VSIX based on your platform at install time.
          </P>
          <P>
            The binary lives under the extension&rsquo;s <Code>bin/&lt;platform-arch&gt;/</Code> directory
            and is called as a subprocess by the extension. It communicates over stdin/stdout and has
            no network access.
          </P>
          <P>
            If you need the binary separately (e.g. for shell hooks in a terminal without VS Code),
            download it from{' '}
            <a href="https://github.com/rodthenewcomer/loopguard/releases/latest" className="text-[#2563EB] hover:text-[#3B82F6] underline underline-offset-2 transition-colors">
              GitHub Releases
            </a>.
          </P>

          {/* ═══════════════════════════════════════════════════════
              CONFIGURATION
          ═══════════════════════════════════════════════════════ */}
          <H2 id="configuration">All settings</H2>
          <Table
            headers={['Setting', 'Type', 'Default', 'Description']}
            rows={[
              ['loopguard.sensitivity', 'string', '"medium"', 'Loop detection threshold: "low" (5×) | "medium" (3×) | "high" (2×)'],
              ['loopguard.enableContextEngine', 'boolean', 'true', 'Enable/disable the context engine (Copy Optimized Context)'],
              ['loopguard.enableNotifications', 'boolean', 'true', 'Show or hide LoopGuard alert popups'],
              ['loopguard.loopThreshold', 'number', '3', 'Override for the exact repetition count (overrides sensitivity)'],
            ]}
          />

          {/* ─────────────────────────────────────────────────────── */}
          <H2 id="settings-json">settings.json reference</H2>
          <P>Copy-paste this into your <Code>.vscode/settings.json</Code> or user settings:</P>
          <Pre>{`{
  "loopguard.sensitivity": "medium",       // "low" | "medium" | "high"
  "loopguard.loopThreshold": 3,            // exact count (overrides sensitivity)
  "loopguard.enableContextEngine": true,
  "loopguard.enableNotifications": true
}`}</Pre>

          {/* ═══════════════════════════════════════════════════════
              TROUBLESHOOTING
          ═══════════════════════════════════════════════════════ */}
          <H2 id="no-detection">Loops not being detected</H2>
          <CheckList items={[
            'Check that detection is not paused. Run LoopGuard: Toggle Detection if needed.',
            'Check the sensitivity — "low" requires the same error 5 times. Try "high" (2×) to test.',
            'Make sure the error is actually appearing in the VS Code Problems panel (View → Problems). LoopGuard only sees errors that VS Code diagnostics report — it does not read terminal output.',
            'Open the LoopGuard output channel (View → Output → LoopGuard). It logs LoopGuard activity and errors while you reproduce the issue.',
            'Some linters report slightly different messages each time. If the message changes, LoopGuard treats it as a different fingerprint. Use "high" sensitivity to catch these earlier.',
          ]} />

          {/* ─────────────────────────────────────────────────────── */}
          <H2 id="binary-missing">Binary not found</H2>
          <P>
            If you see <Code>loopguard-ctx: binary not found</Code> in the output channel:
          </P>
          <CheckList items={[
            'Uninstall and reinstall the extension — make sure you install the platform-specific VSIX, not the generic one.',
            'Check that the binary exists: open a terminal and run: ls ~/.vscode/extensions/LoopGuard.loopguard-*/bin/',
            'On macOS, the binary may be quarantined by Gatekeeper. Run: xattr -d com.apple.quarantine ~/.vscode/extensions/LoopGuard.loopguard-*/bin/loopguard-ctx',
            'On Linux, the binary may not be executable. Run: chmod +x ~/.vscode/extensions/LoopGuard.loopguard-*/bin/loopguard-ctx',
            'If none of the above works, download the binary directly from GitHub Releases and place it in the bin/ directory.',
          ]} />

          {/* ─────────────────────────────────────────────────────── */}
          <H2 id="mcp-debug">MCP setup failed</H2>
          <P>
            If <Code>LoopGuard: Configure MCP Server</Code> fails or the tools do not appear in
            your AI tool:
          </P>
          <CheckList items={[
            'Make sure loopguard-ctx binary is working first — run LoopGuard: Copy Optimized Context to verify the context engine loads.',
            'Check that the target config file was actually updated: for example ~/.cursor/mcp.json, ~/.claude.json, ~/.codeium/windsurf/mcp_config.json, ~/.codex/config.toml, or your VS Code user mcp.json.',
            'Restart your AI tool (Cursor, Claude Code, etc.) after running Configure MCP Server — the config is only read on startup.',
            'Check your AI tool\'s MCP log for errors if it has one.',
            'No Node.js install is required for LoopGuard MCP. The server is the local loopguard-ctx binary.',
          ]} />

          {/* ─────────────────────────────────────────────────────── */}
          <H2 id="auth-debug">Sign-in issues</H2>
          <P>
            LoopGuard sign-in uses a browser deep-link callback. The extension opens a browser tab
            and waits for a redirect back to VS Code via the URI scheme (e.g.{' '}
            <Code>vscode://LoopGuard.loopguard/auth</Code>).
          </P>
          <CheckList items={[
            'Make sure your browser is set as the default browser — VS Code uses xdg-open (Linux), open (macOS), or start (Windows) to open the URL.',
            'On Linux with xdg-open, make sure a default browser is set: xdg-settings get default-web-browser',
            'If the browser opens but the redirect does not come back, check that your OS allows the vscode:// URI scheme. On Linux this may need to be registered: xdg-mime default code.desktop x-scheme-handler/vscode',
            'In Cursor, the URI scheme is cursor:// — LoopGuard detects this automatically via vscode.env.uriScheme.',
            'If you are on a remote / SSH session, deep-link callbacks may not work yet. Core loop detection and local context copy still work offline, but dashboard sign-in is best done from a local desktop session for now.',
          ]} />

          <div className="mt-16 pt-10 border-t border-[#1F2937]">
            <p className="text-sm text-[#4B5563]">
              Something missing?{' '}
              <a
                href="https://github.com/rodthenewcomer/loopguard/issues"
                className="text-[#2563EB] hover:text-[#3B82F6] underline underline-offset-2 transition-colors"
              >
                Open an issue on GitHub
              </a>{' '}
              or email{' '}
              <a href="mailto:support@loopguard.dev" className="text-[#2563EB] hover:text-[#3B82F6] underline underline-offset-2 transition-colors">
                support@loopguard.dev
              </a>.
            </p>
          </div>
        </main>
      </div>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="border-t border-[#1F2937] mt-8">
        <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
          <p className="text-xs text-[#4B5563]">© 2026 LoopGuard. MIT License.</p>
          <div className="flex items-center gap-4 text-xs text-[#4B5563]">
            <Link href="/" className="hover:text-[#6B7280] transition-colors">Home</Link>
            <Link href="/setup" className="hover:text-[#6B7280] transition-colors">Install</Link>
            <Link href="/privacy" className="hover:text-[#6B7280] transition-colors">Privacy</Link>
            <a href="https://github.com/rodthenewcomer/loopguard/issues" className="hover:text-[#6B7280] transition-colors">
              Report a bug
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
