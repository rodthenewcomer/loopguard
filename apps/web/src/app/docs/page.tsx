import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Documentation — LoopGuard',
  description: 'Complete documentation for LoopGuard — installation, loop detection, context engine, MCP server, shell hooks, and troubleshooting.',
};

/* ── Sidebar nav ─────────────────────────────────────────────────── */
const NAV = [
  {
    group: 'Getting Started',
    items: [
      { label: 'Installation',    id: 'installation' },
      { label: 'First launch',    id: 'first-launch' },
      { label: 'Quick reference', id: 'commands' },
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
      { label: 'AI Gateway (MCP)', id: 'mcp' },
      { label: 'Terminal Filter',  id: 'shell-hooks' },
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
            <svg width="24" height="24" viewBox="0 0 34 34" fill="none" aria-hidden="true">
              <path d="M17 2L3 8v10c0 8.3 5.8 15.8 14 17.7C25.2 33.8 31 26.3 31 18V8L17 2z" fill="url(#dg)" />
              <defs>
                <linearGradient id="dg" x1="3" y1="2" x2="31" y2="35" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#22D3EE" />
                </linearGradient>
              </defs>
            </svg>
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
            LoopGuard is distributed as a VS Code extension on the Marketplace. The platform-specific
            Rust binary (<Code>loopguard-ctx</Code>) is bundled inside the VSIX — no separate
            download, no Rust toolchain required.
          </P>

          <H3>From the VS Code Marketplace</H3>
          <P>Open VS Code, press <Code>Ctrl+P</Code> (or <Code>Cmd+P</Code> on macOS), and run:</P>
          <Pre>ext install loopguard-dev.loopguard</Pre>
          <P>Or search <strong className="text-white">LoopGuard</strong> in the Extensions panel and click Install.</P>

          <H3>Works with Cursor and Windsurf</H3>
          <P>
            LoopGuard is compatible with any VS Code-based IDE. In Cursor or Windsurf, open the
            Extensions panel (same shortcut), search LoopGuard, and install. The URI callback for
            sign-in auto-detects your IDE — no extra configuration needed.
          </P>

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
            'The LoopGuard status bar item appears at the bottom of VS Code — it shows "LoopGuard ●" when active.',
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
              ['LoopGuard: Show Session Dashboard', 'Open the in-IDE webview with loops, tokens, time'],
              ['LoopGuard: Sign In', 'Authenticate with your LoopGuard account (optional)'],
              ['LoopGuard: Sign Out', 'Remove stored credentials from secure keychain'],
              ['LoopGuard: Configure MCP Server', 'Write the MCP server config to your AI tool'],
              ['LoopGuard: Reset Session', 'Clear current session loop counter and timer'],
              ['LoopGuard: Show Output', 'Open the LoopGuard output channel for diagnostics'],
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
            SHA-256 hash of the error message text. If the same hash appears N times in a session
            (where N is your sensitivity threshold), a loop is detected.
          </P>
          <P>
            This catches the most common case: you ask AI to fix an error, it gives you the same
            fix with different variable names, and the same error reappears.
          </P>

          <H3>Method 2 — Edit-pattern loop detection</H3>
          <P>
            LoopGuard also watches <Code>vscode.workspace.onDidChangeTextDocument</Code>. It
            tracks edit ranges across saves. If the same region of a file is edited repeatedly with
            no net forward progress (edits are reverted or the diff collapses back to the original),
            a loop is detected even if the error message changes.
          </P>
          <P>
            This catches more subtle loops — for example, when you rename a variable three times
            trying different things and always end up back at the same code.
          </P>

          <H3>What gets tracked</H3>
          <P>
            LoopGuard tracks only a SHA-256 hash of the error message. The original message text
            is never stored or transmitted. The file type (e.g. <Code>ts</Code>, <Code>py</Code>)
            is stored — never the file name or file path. See the{' '}
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
              ['Try New Approach', 'Opens a panel suggesting three fundamentally different approaches to the problem (Pro — coming in v0.3.0)'],
              ['View Details', 'Opens the session dashboard webview showing the full loop timeline'],
              ['Dismiss', 'Closes the notification. The loop counter continues — you will be alerted again if the loop continues.'],
            ]}
          />
          <Note>
            Dismissing an alert does not reset the loop counter. If you want to reset the session,
            run <Code>LoopGuard: Reset Session</Code> from the Command Palette.
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
            'All import / require statements from the current file',
            'AST function and class signatures (stubs, not full bodies)',
            'The 20 lines immediately surrounding the current error position',
            'High-entropy lines across the file (scored by Shannon entropy — complex logic, not boilerplate)',
            'Myers delta from the last context copy — lines that changed since the previous request',
          ]} />

          <H3>Keyboard shortcut</H3>
          <P>Bind it to a key for one-keystroke context compression:</P>
          <Pre>{`// keybindings.json
{
  "key": "ctrl+shift+c",
  "command": "loopguard.copyOptimizedContext",
  "when": "editorFocus"
}`}</Pre>

          {/* ─────────────────────────────────────────────────────── */}
          <H2 id="engines">Rust engine vs TypeScript engine</H2>
          <P>
            LoopGuard ships two context engine implementations. The TypeScript engine runs on every
            install. The Rust engine (Pro) runs as a bundled subprocess for maximum reduction.
          </P>
          <Table
            headers={['', 'TypeScript engine (Free)', 'Rust engine (Pro)']}
            rows={[
              ['Token reduction', '~80%', '89–99%'],
              ['Languages', '14 (regex-based)', '14 (full AST parse)'],
              ['AST analysis', 'Partial', 'Full (tree-sitter)'],
              ['Shannon entropy scoring', 'No', 'Yes'],
              ['Myers delta', 'No', 'Yes — re-reads cost ~13 tokens'],
              ['Memory cache', 'No', 'Yes — unchanged files skipped'],
              ['Binary required', 'No', 'Yes (bundled in VSIX)'],
            ]}
          />
          <P>
            The Rust engine runs as a subprocess (<Code>loopguard-ctx</Code>) communicating over
            stdin/stdout. It has no network access. If the binary fails to load, LoopGuard falls
            back to the TypeScript engine automatically.
          </P>

          {/* ─────────────────────────────────────────────────────── */}
          <H2 id="languages">Supported languages</H2>
          <P>Both engines support the following languages for context extraction:</P>
          <Table
            headers={['Language', 'Extension', 'AST support (Rust engine)']}
            rows={[
              ['TypeScript / TSX', '.ts, .tsx', 'Full'],
              ['JavaScript / JSX', '.js, .jsx', 'Full'],
              ['Python', '.py', 'Full'],
              ['Rust', '.rs', 'Full'],
              ['Go', '.go', 'Full'],
              ['Java', '.java', 'Full'],
              ['C / C++', '.c, .cpp, .h', 'Full'],
              ['C#', '.cs', 'Full'],
              ['Ruby', '.rb', 'Partial'],
              ['PHP', '.php', 'Partial'],
              ['Swift', '.swift', 'Partial'],
              ['Kotlin', '.kt', 'Partial'],
              ['Shell / Bash', '.sh', 'Regex only'],
              ['YAML / JSON', '.yaml, .json', 'Structure only'],
            ]}
          />

          {/* ═══════════════════════════════════════════════════════
              DASHBOARD & SYNC
          ═══════════════════════════════════════════════════════ */}
          <H2 id="dashboard">VS Code session dashboard</H2>
          <P>
            Run <Code>LoopGuard: Show Session Dashboard</Code> to open the in-IDE webview. It shows
            your current session in real time:
          </P>
          <CheckList items={[
            'Total session time and active coding time',
            'Every loop detected — with the error hash, timestamp, and minutes wasted',
            'Total tokens saved and estimated cost reduction',
            'A timeline bar showing where in the session loops occurred',
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
            To connect your account: run <Code>LoopGuard: Sign In</Code> → a browser tab opens →
            sign in with email/password or Google → you are redirected back to VS Code automatically.
          </P>
          <Note>
            Session sync is optional. LoopGuard runs fully offline. If the API is unreachable,
            metrics are queued locally and synced when connectivity resumes.
          </Note>

          {/* ═══════════════════════════════════════════════════════
              INTEGRATIONS
          ═══════════════════════════════════════════════════════ */}
          <H2 id="mcp">AI Gateway (MCP Server)</H2>
          <P>
            LoopGuard&rsquo;s AI Gateway is an MCP server that intercepts every file read your AI agent makes
            and routes it through the relevance engine automatically. Instead of your agent reading a
            1,800-line component and burning 2,400 tokens, it receives 140 lines — the signatures,
            the high-entropy logic, the error context. The agent never knows the difference.
          </P>
          <P>
            Works with Claude Code, Cursor, Windsurf, and GitHub Copilot. No copy-paste. No manual commands.
            Wire it once and every subsequent agent read is filtered automatically for the life of the session.
          </P>

          <H3>Setup (one command)</H3>
          <P>
            Run <Code>LoopGuard: Configure MCP Server</Code> from the Command Palette. LoopGuard
            writes the correct config for your IDE automatically.
          </P>
          <P>If you prefer to configure manually, add this to your MCP config:</P>
          <Pre>{`// For Claude Code (~/.claude.json or .claude/settings.json):
{
  "mcpServers": {
    "loopguard": {
      "command": "node",
      "args": ["~/.vscode/extensions/loopguard-dev.loopguard-*/mcp/server.js"],
      "env": {}
    }
  }
}`}</Pre>

          <H3>Available MCP tools (21 total)</H3>
          <Table
            headers={['Tool', 'What it does']}
            rows={[
              ['get_context', 'Returns compressed context for the current file'],
              ['get_loop_status', 'Returns whether a loop is currently active and time wasted'],
              ['get_session_summary', 'Returns current session metrics as JSON'],
              ['get_imports', 'Returns all imports from a file'],
              ['get_signatures', 'Returns all function/class signatures from a file'],
              ['get_error_context', 'Returns the 20 lines surrounding the current error'],
              ['get_high_entropy_lines', 'Returns lines scored above entropy threshold'],
              ['get_delta', 'Returns only changed lines since last context request'],
              ['get_file_hash', 'Returns SHA-256 hash of a file for cache validation'],
              ['compress_output', 'Compress CLI output (npm/git/docker) for AI context'],
              ['...11 more', 'Run LoopGuard: Configure MCP Server to see full list'],
            ]}
          />

          {/* ─────────────────────────────────────────────────────── */}
          <H2 id="shell-hooks">Terminal Filter (Shell Hooks, Pro)</H2>
          <P>
            The Terminal Filter intercepts CLI output and surfaces only the signal before it reaches
            your AI. Not compression — extraction.
          </P>
          <P>
            <Code>npm install</Code> generates 3,400 tokens of progress bars, resolved package lines,
            and peer dependency trees. Your AI does not need any of that. The Terminal Filter sends
            the 12 lines that matter: the warning that caused the failure, the peer conflict, the
            final exit status. <Code>docker build</Code> sends only the failing layer and its error.{' '}
            <Code>git log</Code> sends only the commits relevant to the current branch and issue context.
          </P>

          <H3>Installation</H3>
          <Pre>{`# Install for your shell (run in terminal):
loopguard hooks install

# Or install for a specific shell:
loopguard hooks install --shell zsh
loopguard hooks install --shell bash
loopguard hooks install --shell fish`}</Pre>
          <P>
            This adds a hook to your shell rc file (<Code>~/.zshrc</Code>, <Code>~/.bashrc</Code>,
            or <Code>~/.config/fish/config.fish</Code>). Restart your terminal or run{' '}
            <Code>source ~/.zshrc</Code> to activate.
          </P>

          <H3>How it works</H3>
          <P>
            The hook wraps command output through the <Code>loopguard-ctx</Code> binary before it
            is written to your terminal buffer. The binary strips repeated lines, collapses
            progress bars, and extracts only the final error message from long build logs. The
            original output is not modified in your terminal — only the version copied to AI context
            is compressed.
          </P>
          <Warning>
            Shell hooks require Pro. They have no effect in Free tier but do not error — they
            silently pass output through unchanged.
          </Warning>

          {/* ─────────────────────────────────────────────────────── */}
          <H2 id="binary">Binary installation details</H2>
          <P>
            The <Code>loopguard-ctx</Code> Rust binary is bundled inside the platform-specific VSIX.
            VS Code selects the correct VSIX based on your platform at install time.
          </P>
          <P>
            The binary lives at{' '}
            <Code>~/.vscode/extensions/loopguard-dev.loopguard-*/bin/loopguard-ctx</Code> and is
            called as a subprocess by the extension. It communicates over stdin/stdout and has no
            network access.
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
              ['loopguard.enableLoopDetection', 'boolean', 'true', 'Enable/disable loop detection entirely'],
              ['loopguard.enableShellHooks', 'boolean', 'true', 'Enable/disable shell hook output compression (Pro)'],
              ['loopguard.loopThreshold', 'number', '3', 'Override for the exact repetition count (overrides sensitivity)'],
              ['loopguard.contextMaxTokens', 'number', '2000', 'Maximum tokens for Copy Optimized Context output'],
              ['loopguard.showStatusBar', 'boolean', 'true', 'Show/hide the LoopGuard status bar item'],
              ['loopguard.autoSync', 'boolean', 'true', 'Auto-sync session metrics every 5 minutes (requires sign-in)'],
              ['loopguard.debugMode', 'boolean', 'false', 'Write verbose logs to the LoopGuard output channel'],
            ]}
          />

          {/* ─────────────────────────────────────────────────────── */}
          <H2 id="settings-json">settings.json reference</H2>
          <P>Copy-paste this into your <Code>.vscode/settings.json</Code> or user settings:</P>
          <Pre>{`{
  // Loop detection
  "loopguard.sensitivity": "medium",       // "low" | "medium" | "high"
  "loopguard.enableLoopDetection": true,
  "loopguard.loopThreshold": 3,            // exact count (overrides sensitivity)

  // Context engine
  "loopguard.enableContextEngine": true,
  "loopguard.contextMaxTokens": 2000,

  // Shell hooks (Pro)
  "loopguard.enableShellHooks": true,

  // UI
  "loopguard.showStatusBar": true,

  // Sync
  "loopguard.autoSync": true,

  // Debug
  "loopguard.debugMode": false
}`}</Pre>

          {/* ═══════════════════════════════════════════════════════
              TROUBLESHOOTING
          ═══════════════════════════════════════════════════════ */}
          <H2 id="no-detection">Loops not being detected</H2>
          <CheckList items={[
            'Check that loopguard.enableLoopDetection is not set to false in your settings.',
            'Check the sensitivity — "low" requires the same error 5 times. Try "high" (2×) to test.',
            'Make sure the error is actually appearing in the VS Code Problems panel (View → Problems). LoopGuard only sees errors that VS Code diagnostics report — it does not read terminal output.',
            'Open the LoopGuard output channel (View → Output → LoopGuard). It logs every diagnostic event it receives.',
            'Some linters report errors with slightly different messages each time (e.g. including line numbers). LoopGuard hashes the full message — if the message text changes, it is a different hash. Use "high" sensitivity to catch these.',
          ]} />

          {/* ─────────────────────────────────────────────────────── */}
          <H2 id="binary-missing">Binary not found</H2>
          <P>
            If you see <Code>loopguard-ctx: binary not found</Code> in the output channel:
          </P>
          <CheckList items={[
            'Uninstall and reinstall the extension — make sure you install the platform-specific VSIX, not the generic one.',
            'Check that the binary exists: open a terminal and run: ls ~/.vscode/extensions/loopguard-dev.loopguard-*/bin/',
            'On macOS, the binary may be quarantined by Gatekeeper. Run: xattr -d com.apple.quarantine ~/.vscode/extensions/loopguard-dev.loopguard-*/bin/loopguard-ctx',
            'On Linux, the binary may not be executable. Run: chmod +x ~/.vscode/extensions/loopguard-dev.loopguard-*/bin/loopguard-ctx',
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
            'Check that the MCP server file exists: ls ~/.vscode/extensions/loopguard-dev.loopguard-*/mcp/server.js',
            'Restart your AI tool (Cursor, Claude Code, etc.) after running Configure MCP Server — the config is only read on startup.',
            'Check your AI tool\'s MCP log for errors. In Claude Code run: cat ~/.claude/logs/mcp-*.log | tail -50',
            'Make sure Node.js is installed and accessible from your terminal — the MCP server runs as a Node.js process.',
          ]} />

          {/* ─────────────────────────────────────────────────────── */}
          <H2 id="auth-debug">Sign-in issues</H2>
          <P>
            LoopGuard sign-in uses a browser deep-link callback. The extension opens a browser tab
            and waits for a redirect back to VS Code via the URI scheme (e.g.{' '}
            <Code>vscode://loopguard-dev.loopguard/auth</Code>).
          </P>
          <CheckList items={[
            'Make sure your browser is set as the default browser — VS Code uses xdg-open (Linux), open (macOS), or start (Windows) to open the URL.',
            'On Linux with xdg-open, make sure a default browser is set: xdg-settings get default-web-browser',
            'If the browser opens but the redirect does not come back, check that your OS allows the vscode:// URI scheme. On Linux this may need to be registered: xdg-mime default code.desktop x-scheme-handler/vscode',
            'In Cursor, the URI scheme is cursor:// — LoopGuard detects this automatically via vscode.env.uriScheme.',
            'If you are on a remote / SSH session, deep-link callbacks will not work. Use the web dashboard at loopguard.vercel.app/login to sign in, then run LoopGuard: Sign In from the Command Palette again.',
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
