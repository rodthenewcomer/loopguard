import Link from 'next/link';
import type { Metadata } from 'next';
import LoopGuardLogo from '../../components/LoopGuardLogo';

export const metadata: Metadata = {
  title: 'Documentation — LoopGuard',
  description:
    'Complete documentation for LoopGuard — installation, loop detection, focused context copy, MCP setup, shell helpers, and troubleshooting.',
};

const NAV = [
  {
    group: 'Getting Started',
    items: [
      { label: 'Installation', id: 'installation' },
      { label: 'First launch', id: 'first-launch' },
      { label: 'Quick reference', id: 'commands' },
      { label: 'Zero-gap setup', id: 'zero-gap' },
    ],
  },
  {
    group: 'Project',
    items: [
      { label: 'Roadmap', id: 'roadmap-link' },
    ],
  },
  {
    group: 'Loop Detection',
    items: [
      { label: 'How it works', id: 'loop-detection' },
      { label: 'Alert actions', id: 'alerts' },
      { label: 'Sensitivity', id: 'sensitivity' },
    ],
  },
  {
    group: 'Focused Context',
    items: [
      { label: 'Copy Optimized Context', id: 'context-engine' },
      { label: 'Built-in vs helper', id: 'engines' },
      { label: 'Supported languages', id: 'languages' },
    ],
  },
  {
    group: 'Dashboard & Sync',
    items: [
      { label: 'VS Code dashboard', id: 'dashboard' },
      { label: 'Account & sync', id: 'sync' },
    ],
  },
  {
    group: 'Integrations',
    items: [
      { label: 'MCP server', id: 'mcp' },
      { label: 'Shell helper', id: 'shell-hooks' },
      { label: 'Binary install', id: 'binary' },
    ],
  },
  {
    group: 'v3 Intelligence',
    items: [
      { label: 'ctx_loop_hint', id: 'ctx-loop-hint' },
      { label: 'ctx_forecast', id: 'ctx-forecast' },
      { label: 'ctx_memory', id: 'ctx-memory' },
      { label: 'ctx_predict', id: 'ctx-predict' },
    ],
  },
  {
    group: 'Configuration',
    items: [
      { label: 'All settings', id: 'configuration' },
      { label: 'settings.json', id: 'settings-json' },
    ],
  },
  {
    group: 'Troubleshooting',
    items: [
      { label: 'Loops not detected', id: 'no-detection' },
      { label: 'Binary not found', id: 'binary-missing' },
      { label: 'MCP setup failed', id: 'mcp-debug' },
      { label: 'Sign-in issues', id: 'auth-debug' },
    ],
  },
];

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="mt-16 mb-4 flex scroll-mt-24 items-center gap-2 text-2xl font-bold text-white"
    >
      <a href={`#${id}`} className="text-lg text-[#374151] transition-colors hover:text-[#6B7280]">
        #
      </a>
      {children}
    </h2>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="mt-8 mb-3 text-lg font-semibold text-[#F9FAFB]">{children}</h3>;
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="mb-4 text-sm leading-relaxed text-[#9CA3AF]">{children}</p>;
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded border border-[#1F2937] bg-[#0d1117] px-1.5 py-0.5 font-mono text-xs text-[#22D3EE]">
      {children}
    </code>
  );
}

function Pre({ children }: { children: React.ReactNode }) {
  return (
    <pre className="mb-6 overflow-x-auto rounded-xl border border-[#1F2937] bg-[#0d1117] p-5 font-mono text-xs leading-relaxed text-[#9CA3AF]">
      {children}
    </pre>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-start gap-3 rounded-xl border border-[#22D3EE]/20 bg-[#22D3EE]/5 px-5 py-3.5">
      <span className="mt-0.5 flex-shrink-0 text-xs font-bold uppercase tracking-wide text-[#22D3EE]">
        Note
      </span>
      <p className="text-sm leading-relaxed text-[#9CA3AF]">{children}</p>
    </div>
  );
}

function Warning({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-start gap-3 rounded-xl border border-[#F59E0B]/25 bg-[#F59E0B]/5 px-5 py-3.5">
      <span className="mt-0.5 flex-shrink-0 text-xs font-bold uppercase tracking-wide text-[#F59E0B]">
        Warning
      </span>
      <p className="text-sm leading-relaxed text-[#9CA3AF]">{children}</p>
    </div>
  );
}

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="mb-6 space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-sm text-[#9CA3AF]">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#22C55E"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mt-0.5 flex-shrink-0"
            aria-hidden="true"
          >
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
    <div className="mb-6 overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-[#1F2937]">
            {headers.map((header) => (
              <th
                key={header}
                className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-[#6B7280]"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={`${row.join('-')}-${rowIndex}`}
              className="border-b border-[#1F2937]/50 transition-colors hover:bg-[#111827]/40"
            >
              {row.map((cell, cellIndex) => (
                <td key={`${cell}-${cellIndex}`} className="px-4 py-2.5 font-mono text-xs text-[#9CA3AF]">
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

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#0B1220]">
      <header className="sticky top-0 z-40 border-b border-[#1F2937] bg-[#0B1220]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <LoopGuardLogo showWordmark size={28} />
            <span className="hidden text-sm text-[#6B7280] sm:inline">Docs</span>
          </Link>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/rodthenewcomer/loopguard"
              className="hidden text-sm text-[#6B7280] transition-colors hover:text-[#9CA3AF] sm:block"
            >
              GitHub
            </a>
            <a
              href="/setup"
              className="rounded-lg bg-[#2563EB] px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[#1d4ed8]"
            >
              Setup
            </a>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-12 px-6 py-12">
        <nav className="sticky top-24 hidden max-h-[calc(100vh-6rem)] w-56 flex-shrink-0 self-start overflow-y-auto pr-2 lg:block">
          {NAV.map((group) => (
            <div key={group.group} className="mb-6">
              <div className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-[#4B5563]">
                {group.group}
              </div>
              {group.items.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="block rounded-lg px-3 py-1.5 text-sm text-[#6B7280] transition-colors duration-150 hover:bg-[#111827]/60 hover:text-[#9CA3AF]"
                >
                  {item.label}
                </a>
              ))}
            </div>
          ))}
        </nav>

        <main className="min-w-0 flex-1">
          <div className="mb-10">
            <h1 className="mb-3 text-4xl font-bold text-white">Documentation</h1>
            <p className="text-lg text-[#6B7280]">
              Install it, understand what it does locally, and wire the helper into the tools you
              already use.
            </p>
          </div>

          <H2 id="installation">Installation</H2>
          <P>LoopGuard has two install paths. Pick the one that matches how you work today.</P>
          <Table
            headers={['Path', 'What you get', 'Account needed?']}
            rows={[
              ['VS Code extension', 'Loop alerts + focused context + dashboard', 'No (optional for sync)'],
              ['Local helper', 'MCP tools + shell cleanup + agent setup', 'No — runs locally'],
            ]}
          />
          <Note>
            Loop detection requires the VS Code extension because it listens to editor diagnostics
            and edit patterns. The standalone helper is for focused reads, MCP integrations, and
            shell cleanup.
          </Note>

          <H3>VS Code, Cursor, or Windsurf</H3>
          <P>Install the extension from the Extensions panel, or run from a terminal:</P>
          <Pre>code --install-extension LoopGuard.loopguard</Pre>
          <P>For Cursor use <Code>cursor --install-extension</Code>, for Windsurf use <Code>windsurf --install-extension</Code>.</P>
          <P>
            Cursor and Windsurf can use the same extension. That gives you loop alerts, focused
            context copy, and the in-editor dashboard immediately.
          </P>

          <H3>Terminal-first helper path</H3>
          <P>
            If you use Codex CLI, Claude Code, or want LoopGuard’s shell path without the editor,
            install <Code>loopguard-ctx</Code> directly:
          </P>
          <P>Homebrew (macOS / Linux):</P>
          <Pre>{`brew tap rodthenewcomer/loopguard https://github.com/rodthenewcomer/loopguard
brew install loopguard-ctx`}</Pre>
          <P>npm (any platform with Node 18+):</P>
          <Pre>{`npm install -g loopguard-ctx`}</Pre>
          <P>Or curl installer:</P>
          <Pre>{`curl -fsSL https://loopguard.vercel.app/install.sh | sh -s -- --download

loopguard-ctx --version`}</Pre>
          <P>
            GitHub release binaries (macOS x64/ARM64, Linux x64/ARM64, Windows x64) are available
            on the{' '}
            <a href="https://github.com/rodthenewcomer/loopguard/releases" className="text-[#22D3EE] underline underline-offset-2">
              releases page
            </a>{' '}
            for manual installs.
          </P>
          <Warning>
            Terminal-only mode does not include loop alerts. If you want loop detection, install the
            extension too.
          </Warning>

          <H2 id="zero-gap">Zero-gap setup</H2>
          <P>
            Once <Code>loopguard-ctx</Code> is installed, one command wires every layer for your AI
            agent — MCP config, hook scripts, global CLAUDE.md rules, and shell aliases.
          </P>
          <Pre>{`# Claude Code (installs MCP + PreToolUse hooks + CLAUDE.md + shell aliases)
loopguard-ctx setup --agent=claude

# Cursor
loopguard-ctx setup --agent=cursor

# Codex CLI
loopguard-ctx setup --agent=codex

# All detected editors at once
loopguard-ctx setup`}</Pre>
          <P>
            After setup, run the doctor to verify every layer is green:
          </P>
          <Pre>{`loopguard-ctx doctor`}</Pre>
          <P>
            The doctor checks 15 layers: binary in PATH, MCP config, hook scripts, CLAUDE.md rules,
            shell aliases, and Claude Code-specific enforcement hooks. Each failed check shows the
            exact fix command.
          </P>
          <CheckList
            items={[
              'Idempotent — running setup twice produces the same result, no duplicates',
              'Backs up existing config files before any modification',
              'Use --dry-run to preview all changes without writing anything',
              'Windows: installs PowerShell .ps1 hook equivalents automatically',
            ]}
          />
          <Note>
            The setup command is the recommended path for all agent integrations. Manual MCP config
            still works — see the MCP section below for the JSON format.
          </Note>

          <H2 id="first-launch">First launch</H2>
          <P>
            LoopGuard activates automatically on startup. You do not need to enable it manually.
          </P>
          <CheckList
            items={[
              'The LoopGuard status bar item appears after the workspace loads.',
              'The Output channel is available at View → Output → LoopGuard.',
              'Loop detection starts without sign-in.',
              'The web dashboard is optional and only needed for synced history.',
            ]}
          />

          <H2 id="commands">Quick reference</H2>
          <Table
            headers={['Command', 'What it does']}
            rows={[
              ['LoopGuard: Copy Optimized Context', 'Copy a smaller, focused prompt for the current problem'],
              ['LoopGuard: Show Dashboard', 'Open the in-editor session dashboard'],
              ['LoopGuard: Sign In', 'Connect optional account sync'],
              ['LoopGuard: Sign Out', 'Remove stored credentials'],
              ['LoopGuard: Configure MCP Server', 'Write helper config for the selected tool'],
              ['LoopGuard: Install Shell Hooks', 'Install helper shell integration'],
              ['LoopGuard: Toggle Detection', 'Pause or resume loop detection'],
              ['LoopGuard: Reset Session', 'Clear the current local session counters'],
            ]}
          />

          <H2 id="loop-detection">How loop detection works</H2>
          <P>
            LoopGuard uses two local signals. Either one can trigger a warning, and neither requires
            a remote round-trip.
          </P>

          <H3>Diagnostic loop detection</H3>
          <P>
            LoopGuard watches <Code>vscode.languages.onDidChangeDiagnostics</Code>. When the same
            error fingerprint keeps reappearing, it treats that as a repeat-fix loop.
          </P>

          <H3>Edit-pattern loop detection</H3>
          <P>
            LoopGuard also watches <Code>vscode.workspace.onDidChangeTextDocument</Code>. Repeated
            edits in the same area can signal that you are circling the same problem even if the
            visible error text changes slightly.
          </P>

          <H3>What is tracked</H3>
          <P>
            The extension keeps loop detection local. If you sign in, only anonymized metrics are
            synced: counts, timestamps, token-saved estimates, file type, and a short fingerprint of
            the error text. Never the code itself.
          </P>

          <H2 id="alerts">Alert actions</H2>
          <P>When LoopGuard detects a loop, the notification gives you three immediate options.</P>
          <Table
            headers={['Action', 'What it does']}
            rows={[
              ['Try New Approach', 'Suggests a narrower next move instead of another broad retry'],
              ['View Details', 'Opens the in-editor dashboard with the current loop state'],
              ['Ignore', 'Suppresses the current loop so the same warning does not pop right back up'],
            ]}
          />

          <H2 id="sensitivity">Sensitivity settings</H2>
          <P>
            Sensitivity controls how quickly a repeat turns into an alert. Lower sensitivity means
            fewer interruptions; higher sensitivity means earlier intervention.
          </P>
          <Table
            headers={['Setting', 'Threshold', 'Use case']}
            rows={[
              ['low', '5×', 'You iterate fast and want fewer interruptions'],
              ['medium (default)', '3×', 'Balanced for most AI-heavy coding sessions'],
              ['high', '2×', 'You want LoopGuard to intervene earlier'],
            ]}
          />
          <Pre>{`// settings.json
{
  "loopguard.sensitivity": "medium"
}`}</Pre>

          <H2 id="context-engine">Copy Optimized Context</H2>
          <P>
            Instead of pasting a whole file into chat, use <Code>LoopGuard: Copy Optimized Context</Code>.
            LoopGuard lifts the failing window, the nearby definitions, and the parts most likely to
            matter on the next turn.
          </P>
          <CheckList
            items={[
              'Imports and nearby dependency lines when they matter',
              'A focused window around the first active error',
              'A local before/after token estimate for the copied result',
              'A stronger read path when the native helper is available',
            ]}
          />
          <P>Keyboard shortcut example:</P>
          <Pre>{`// keybindings.json
{
  "key": "ctrl+shift+c",
  "command": "loopguard.copyContext",
  "when": "editorFocus"
}`}</Pre>

          <H2 id="engines">Built-in mode vs native helper</H2>
          <P>
            The extension always has a built-in local path. The native helper adds deeper focused
            reads, MCP tools, and shell cleanup when it is available.
          </P>
          <Table
            headers={['', 'Built-in mode', 'Native helper']}
            rows={[
              ['Typical behavior', 'Focused lines around the current problem', 'Deeper focused reads and agent integrations'],
              ['Availability', 'Always available in the extension', 'Used when the helper loads correctly'],
              ['Prompt reduction', 'Smaller prompts for common fixes', 'Often smaller again on larger files and agent flows'],
              ['Network access', 'None', 'None'],
              ['Fallback', 'N/A', 'Falls back to built-in mode automatically'],
            ]}
          />
          <P>
            The helper runs locally as <Code>loopguard-ctx</Code> over stdin/stdout. It is not a
            cloud service.
          </P>

          <H2 id="languages">Supported languages</H2>
          <P>
            Loop detection is language-agnostic because it listens to IDE diagnostics. Focused
            context works best on common code and config files.
          </P>
          <Table
            headers={['Language family', 'Typical file types', 'Support level']}
            rows={[
              ['TypeScript / JavaScript', '.ts, .tsx, .js, .jsx', 'Strong'],
              ['Python / Rust / Go / Java', '.py, .rs, .go, .java', 'Strong'],
              ['C-family / C#', '.c, .cpp, .h, .cs', 'Good'],
              ['Config and data files', '.json, .yaml, .toml', 'Good'],
              ['Other readable text', 'Any text document', 'Best effort'],
            ]}
          />

          <H2 id="dashboard">VS Code dashboard</H2>
          <P>
            Run <Code>LoopGuard: Show Dashboard</Code> to open the live in-editor view.
          </P>
          <CheckList
            items={[
              'Current session time, time lost, tokens saved, and estimated cost avoided',
              'The active loop list for the current session',
              'Whether the native helper is active or the editor fallback is in use',
              'Quick next-step suggestions when the session is visibly repeating',
            ]}
          />


          <H2 id="cli-stats">CLI stats and Wrapped</H2>
          <P>
            If you use loopguard-ctx from the terminal (Claude Code, Cursor, Codex), stats sync
            automatically at the end of every session — no sign-in required.
          </P>
          <CheckList
            items={[
              'A device UUID is generated at ~/.loopguard-ctx/device.json on first run.',
              'The Stop hook calls loopguard-ctx sync in the background.',
              'Stats are stored anonymously — only token counts and session totals, never source code.',
            ]}
          />
          <P>
            View and share your stats card at{' '}
            <a href="/wrapped" className="text-sky-400 underline underline-offset-4 hover:text-sky-300">
              loopguard.vercel.app/wrapped
            </a>
            . Paste your device ID to generate a shareable link.
          </P>
          <Pre>{`# Get your device ID
cat ~/.loopguard-ctx/device.json

# Or check savings directly in the terminal
loopguard-ctx wrapped`}</Pre>

          <H2 id="sync">Account and session sync</H2>
          <P>
            If you sign in, LoopGuard syncs your session metrics to the web dashboard every few
            minutes and again at session end.
          </P>
          <P>
            The web dashboard refreshes periodically, so it feels close to live, but it still
            depends on the extension’s sync cadence.
          </P>
          <Note>
            Sync is optional. Core loop detection and focused context still work locally without an
            account.
          </Note>

          <H2 id="mcp">MCP server</H2>
          <P>
            <Code>loopguard-ctx</Code> can run as a local MCP server so agents can ask LoopGuard for
            focused reads, compact search, directory maps, and smaller shell output.
          </P>
          <P>
            Use the extension command if you already installed LoopGuard in the editor:
          </P>
          <Pre>LoopGuard: Configure MCP Server</Pre>
          <P>Manual config examples:</P>
          <Pre>{`// JSON-style config
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

          <H3>Cursor</H3>
          <P>
            Run <Code>loopguard-ctx setup --agent=cursor</Code> from a project root if you want both
            the MCP config and a small project rule file.
          </P>
          <Pre>{`loopguard-ctx setup --agent=cursor`}</Pre>
          <P>
            This configures <Code>~/.cursor/mcp.json</Code> and can add{' '}
            <Code>.cursor/rules/loopguard-ctx.mdc</Code> in the current project.
          </P>

          <H3>Windsurf</H3>
          <P>
            Run <Code>loopguard-ctx setup --agent=windsurf</Code> from a project root to configure
            Windsurf and add the project rules file.
          </P>
          <Pre>{`loopguard-ctx setup --agent=windsurf`}</Pre>
          <P>
            This configures <Code>~/.codeium/windsurf/mcp_config.json</Code> and can add{' '}
            <Code>.windsurfrules</Code> in the current project.
          </P>

          <H3>Codex CLI</H3>
          <P>
            Use the extension command or run the helper directly:
          </P>
          <Pre>{`loopguard-ctx setup --agent=codex`}</Pre>
          <P>
            This writes <Code>~/.codex/config.toml</Code> and a small instruction file under{' '}
            <Code>~/.codex/</Code>.
          </P>

          <H3>Claude Code</H3>
          <P>
            Use the helper install if you want the full terminal workflow:
          </P>
          <Pre>{`loopguard-ctx setup --agent=claude`}</Pre>
          <P>
            Today this sets up <Code>~/.claude.json</Code>, local hook entries in{' '}
            <Code>~/.claude/settings.json</Code>, and a helper guidance file at{' '}
            <Code>~/.claude/CLAUDE.md</Code>.
          </P>
          <Note>
            Run <Code>ctx_session load</Code> at the start of every Claude Code session to restore the previous task context and saved findings.
          </Note>

          <H2 id="shell-hooks">Shell helper</H2>
          <P>
            The shell helper keeps verbose terminal output smaller before you paste it into chat or
            hand it to an agent.
          </P>
          <Pre>{`# From the extension
LoopGuard: Install Shell Hooks

# Or directly
loopguard-ctx init`}</Pre>
          <P>
            Supported shells today: <Code>bash</Code>, <Code>zsh</Code>, and <Code>fish</Code>.
          </P>
          <Warning>
            Shell behavior varies by shell and tool. If you want the most predictable agent
            integration, MCP is the stronger path.
          </Warning>

          <H2 id="binary">Binary installation details</H2>
          <P>
            The extension bundles the platform helper under its <Code>bin/</Code> directory. The
            standalone install path uses the same helper binary.
          </P>
          <P>
            If you need it outside the extension, use the install script or download a release binary
            manually from GitHub.
          </P>

          <H2 id="v3-intelligence">v3 Intelligence tools</H2>
          <P>
            These four tools shipped in v3 and are available to every agent that connects via the
            MCP server — Claude Code, Cursor, Windsurf, and Codex CLI. They run entirely locally
            with no LLM call.
          </P>

          <H3>ctx_loop_hint — Root cause hint engine</H3>
          <P>
            When you are stuck in a loop on the same error, <Code>ctx_loop_hint</Code> analyzes the
            error text and returns a specific diagnosis and fix suggestion — no AI call, no network
            request. It covers TypeScript, Rust, Python, Go, React, and generic syntax errors.
          </P>
          <Pre>{`# MCP (Claude Code / Cursor / Windsurf / Codex CLI)
ctx_loop_hint(error_text: "Cannot read properties of undefined (reading 'map')")

# CLI
loopguard-ctx hint "Cannot read properties of undefined (reading 'map')"

# VS Code / Cursor / Windsurf extension
# Shown automatically in the loop alert notification detail`}</Pre>
          <P>Example output:</P>
          <Pre>{`ctx_loop_hint — 100% confidence · pattern: null_access
─────────────────────────────────────────
Diagnosis:   A value is undefined before it is accessed.
Suggestion:  Add optional chaining (?.) or a null guard before the access.
─────────────────────────────────────────
Run ctx_memory(action="record", ...) after resolving.`}</Pre>
          <CheckList
            items={[
              'Covers 20+ error patterns across six languages',
              'Confidence score — low-confidence matches are filtered out',
              'After resolving, record the fix with ctx_memory so future sessions skip it',
              'Available to all MCP-connected tools, not just the VS Code extension',
            ]}
          />

          <H3>ctx_forecast — Token cost estimator</H3>
          <P>
            Before starting a complex task, <Code>ctx_forecast</Code> estimates how many tokens it
            will likely consume and what that costs across four models.
          </P>
          <Pre>{`# MCP
ctx_forecast(task: "Refactor the auth middleware to use Zod validation")

# CLI
loopguard-ctx forecast "Refactor the auth middleware to use Zod validation"

# Extension: hover the LoopGuard status bar item to see the forecast
# Claude Code hook: forecast runs automatically on each new prompt`}</Pre>
          <P>Output includes a cost table comparing Sonnet, Haiku, GPT-4o, and Gemini Flash — with
          and without focused reads. Use it to decide which model fits the budget before you start.</P>
          <Table
            headers={['Input', 'Description']}
            rows={[
              ['task', 'Task description — used to classify complexity'],
              ['files', 'Optional list of files you plan to read'],
            ]}
          />

          <H3>ctx_memory — Local fix memory store</H3>
          <P>
            <Code>ctx_memory</Code> stores the patterns that worked when you broke a loop, keyed by
            error fingerprint. On future sessions it surfaces matching fixes before you start
            repeating the same cycle.
          </P>
          <Pre>{`# MCP — record a fix after resolving a loop
ctx_memory(
  action="record",
  error_text="Cannot find module '@loopguard/core'",
  fix_file="packages/core/src/index.ts",
  fix_description="Run npm run build in packages/core to rebuild dist/ first"
)

# CLI equivalents
loopguard-ctx memory record "Cannot find module" --fix-file="packages/core/src/index.ts" --fix-desc="rebuild dist/ first"
loopguard-ctx memory query "Cannot find module"
loopguard-ctx memory list
loopguard-ctx memory stats

# Extension: Past fixes rail in the LoopGuard dashboard (last 5 entries)`}</Pre>
          <Table
            headers={['Action', 'Description']}
            rows={[
              ['record', 'Store a new fix pattern'],
              ['query', 'Find fixes matching the current error (fuzzy match)'],
              ['list', 'Show all stored patterns for this project'],
              ['stats', 'How many patterns stored, total hits avoided'],
              ['clear', 'Remove all stored patterns'],
            ]}
          />
          <Note>
            Stored at <Code>~/.loopguard-ctx/memory.json</Code> — local only, never synced.
          </Note>

          <H3>ctx_predict — Predictive file pre-selection</H3>
          <P>
            Before reading any file, <Code>ctx_predict</Code> ranks every file in the workspace by
            predicted relevance to your task description. It uses keyword overlap, path matching, and
            session history to score files so you read the right ones first.
          </P>
          <Pre>{`# MCP
ctx_predict(task: "Fix the Zod validation on the auth route")

# CLI
loopguard-ctx predict "Fix the Zod validation on the auth route" --path=. --limit=10

# Extension: Copy Optimized Context appends predicted related files automatically`}</Pre>
          <P>Returns a ranked list with read suggestions. Use it right after{' '}
          <Code>ctx_session load</Code> and before any <Code>ctx_read</Code> calls.</P>
          <CheckList
            items={[
              'No LLM call — pure keyword and path scoring',
              'Session history boost — files touched this session rank higher',
              'Respects workspace root and skips node_modules, .git, target',
              'Configurable result limit (default: 10)',
            ]}
          />

          <H2 id="configuration">All settings</H2>
          <Table
            headers={['Setting', 'Type', 'Default', 'Description']}
            rows={[
              ['loopguard.sensitivity', 'string', '"medium"', 'Loop detection threshold: low | medium | high'],
              ['loopguard.enableContextEngine', 'boolean', 'true', 'Enable or disable focused context copy'],
              ['loopguard.enableNotifications', 'boolean', 'true', 'Show or hide LoopGuard notifications'],
              ['loopguard.loopThreshold', 'number', '3', 'Exact repetition count override'],
            ]}
          />

          <H2 id="settings-json">settings.json</H2>
          <Pre>{`{
  "loopguard.sensitivity": "medium",
  "loopguard.loopThreshold": 3,
  "loopguard.enableContextEngine": true,
  "loopguard.enableNotifications": true
}`}</Pre>

          <H2 id="no-detection">Loops not detected</H2>
          <CheckList
            items={[
              'Make sure detection is not paused.',
              'Try higher sensitivity if the message shape is changing slightly.',
              'Check that the issue appears in the VS Code Problems panel.',
              'Use View → Output → LoopGuard to inspect activity and error logs.',
            ]}
          />

          <H2 id="binary-missing">Binary not found</H2>
          <P>If the helper cannot be found:</P>
          <CheckList
            items={[
              'Reinstall the extension or rerun the helper installer.',
              'Check that the helper exists in the extension bin directory or on your PATH.',
              'On macOS, clear quarantine if Gatekeeper blocked the binary.',
              'On Linux, make sure the file is executable.',
            ]}
          />

          <H2 id="mcp-debug">MCP setup failed</H2>
          <CheckList
            items={[
              'Make sure loopguard-ctx itself runs before troubleshooting MCP.',
              'Confirm that the target config file was updated.',
              'Restart the target app after editing MCP config.',
              'Use loopguard-ctx doctor for the helper path, especially for Claude Code.',
            ]}
          />

          <H2 id="auth-debug">Sign-in issues</H2>
          <P>
            LoopGuard sign-in uses a browser callback back into the editor. If that handoff fails:
          </P>
          <CheckList
            items={[
              'Make sure your default browser is configured correctly.',
              'On Linux, verify the vscode:// URI handler registration.',
              'Cursor uses cursor:// automatically when installed there.',
              'On remote or SSH sessions, dashboard sign-in is best done from a local desktop session for now.',
            ]}
          />

          <H2 id="roadmap-link">Roadmap</H2>
          <P>
            See what shipped in v1 and v2, and what is coming in v3 — with the full feature list
            for every IDE and CLI tool.
          </P>
          <P>
            <a href="/roadmap" className="text-sky-400 underline underline-offset-4 hover:text-sky-300">
              loopguard.vercel.app/roadmap →
            </a>
          </P>

          <div className="mt-16 border-t border-[#1F2937] pt-10">
            <p className="text-sm text-[#4B5563]">
              Something missing?{' '}
              <a
                href="https://github.com/rodthenewcomer/loopguard/issues"
                className="underline underline-offset-2 transition-colors hover:text-[#9CA3AF]"
              >
                Open an issue on GitHub
              </a>{' '}
              or email{' '}
              <a
                href="mailto:support@loopguard.dev"
                className="underline underline-offset-2 transition-colors hover:text-[#9CA3AF]"
              >
                support@loopguard.dev
              </a>
              .
            </p>
          </div>
        </main>
      </div>

      <footer className="mt-8 border-t border-[#1F2937]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8">
          <p className="text-xs text-[#4B5563]">© 2026 LoopGuard. MIT License.</p>
          <div className="flex items-center gap-4 text-xs text-[#4B5563]">
            <Link href="/" className="transition-colors hover:text-[#6B7280]">
              Home
            </Link>
            <Link href="/setup" className="transition-colors hover:text-[#6B7280]">
              Setup
            </Link>
            <Link href="/roadmap" className="transition-colors hover:text-[#6B7280]">
              Roadmap
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-[#6B7280]">
              Privacy
            </Link>
            <a
              href="https://github.com/rodthenewcomer/loopguard/issues"
              className="transition-colors hover:text-[#6B7280]"
            >
              Report a bug
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
