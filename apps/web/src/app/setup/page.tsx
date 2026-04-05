import Link from 'next/link';
import type { Metadata } from 'next';
import LoopGuardLogo from '../../components/LoopGuardLogo';

export const metadata: Metadata = {
  title: 'Setup — LoopGuard',
  description:
    'Install LoopGuard for VS Code, Cursor, Windsurf, Codex CLI, Claude Code, and supported shells.',
};

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-[#2563EB]/30 bg-[#2563EB]/15 text-xs font-bold text-[#2563EB]">
        {n}
      </div>
      <div className="flex-1 pb-6">
        <h4 className="mb-2 text-sm font-semibold text-[#F9FAFB]">{title}</h4>
        {children}
      </div>
    </div>
  );
}

function Code({ children }: { children: string }) {
  return (
    <div className="mt-2 rounded-xl border border-[#1F2937] bg-[#0d1117] px-4 py-3">
      <code className="font-mono text-sm text-[#22D3EE]">{children}</code>
    </div>
  );
}

function SectionCard({
  icon,
  title,
  badge,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  badge?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="overflow-hidden rounded-2xl border border-[#1F2937]"
      style={{ background: 'linear-gradient(145deg, #111827, #0f172a)' }}
    >
      <div className="flex items-center gap-3 border-b border-[#1F2937] px-6 py-5">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-[#2563EB]/20 bg-[#2563EB]/10">
          {icon}
        </div>
        <div className="flex items-center gap-3">
          <h3 className="font-bold text-white">{title}</h3>
          {badge && (
            <span className="rounded-full border border-[#22D3EE]/20 bg-[#22D3EE]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#22D3EE]">
              {badge}
            </span>
          )}
        </div>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

function Lead({ children }: { children: React.ReactNode }) {
  return <p className="mb-4 text-sm leading-6 text-[#6B7280]">{children}</p>;
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-2 rounded-xl border border-[#1F2937] bg-[#0d1117] p-3 text-xs leading-5 text-[#6B7280]">
      {children}
    </div>
  );
}

export default function SetupPage() {
  return (
    <div className="min-h-screen bg-[#0B1220]">
      <header className="sticky top-0 z-40 border-b border-[#1F2937] bg-[#0B1220]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <LoopGuardLogo showWordmark size={28} />
            <span className="hidden text-sm text-[#6B7280] sm:inline">Setup</span>
          </Link>
          <Link
            href="/docs"
            className="text-sm text-[#6B7280] transition-colors hover:text-[#9CA3AF]"
          >
            Full docs →
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-12 text-center">
          <h1 className="mb-3 text-4xl font-bold text-white">Set up LoopGuard</h1>
          <p className="mx-auto max-w-2xl text-lg text-[#6B7280]">
            Start with the extension if you want loop alerts inside your editor. Add the local helper
            when you want focused MCP reads, agent integrations, and smaller shell output.
          </p>
        </div>

        <div className="mb-12 grid gap-3 rounded-3xl border border-[#1F2937] bg-[linear-gradient(160deg,#111827,#0d1727)] p-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-[#1F2937] bg-[#0d1117]/70 p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#4B5563]">
              Editor path
            </div>
            <div className="mt-2 text-lg font-semibold text-white">
              Loop alerts, focused copy, in-editor dashboard
            </div>
            <p className="mt-2 text-sm leading-6 text-[#6B7280]">
              Install the VS Code extension in VS Code, Cursor, or Windsurf and start coding right
              away.
            </p>
          </div>
          <div className="rounded-2xl border border-[#1F2937] bg-[#0d1117]/70 p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#4B5563]">
              Helper path
            </div>
            <div className="mt-2 text-lg font-semibold text-white">
              MCP tools, agent setup, cleaner terminal output
            </div>
            <p className="mt-2 text-sm leading-6 text-[#6B7280]">
              Install <code className="text-xs text-[#9CA3AF]">loopguard-ctx</code> when you want
              LoopGuard outside the editor too.
            </p>
          </div>
        </div>

        <div className="mb-12 flex flex-wrap justify-center gap-2">
          {[
            { label: 'VS Code', anchor: '#vscode' },
            { label: 'Cursor', anchor: '#cursor' },
            { label: 'Windsurf', anchor: '#windsurf' },
            { label: 'Codex CLI', anchor: '#codex' },
            { label: 'Claude Code', anchor: '#claude-code' },
            { label: 'Antigravity', anchor: '#antigravity' },
            { label: 'Shell helper', anchor: '#shell-hooks' },
          ].map((tool) => (
            <a
              key={tool.label}
              href={tool.anchor}
              className="rounded-full border border-[#1F2937] bg-[#111827] px-4 py-2 text-sm text-[#9CA3AF] transition-colors hover:border-[#374151] hover:text-white"
            >
              {tool.label}
            </a>
          ))}
        </div>

        <div className="space-y-8">
          <div id="vscode">
            <SectionCard
              title="VS Code"
              badge="extension"
              icon={
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M8 6L2 12l6 6M16 6l6 6-6 6M14 4l-4 16" />
                </svg>
              }
            >
              <Step n={1} title="Install from Marketplace">
                <Lead>
                  Search for <strong className="text-[#9CA3AF]">LoopGuard</strong> in the Extensions
                  panel, or install from the terminal:
                </Lead>
                <Code>code --install-extension LoopGuard.loopguard</Code>
                <p className="mt-2 text-xs text-[#4B5563]">
                  The bundled helper is included in the extension package. No separate Rust install
                  is required for the editor workflow.
                </p>
              </Step>

              <Step n={2} title="Open any workspace">
                <Lead>
                  LoopGuard activates automatically. The status bar item appears, loop detection
                  starts, and <code className="text-xs text-[#9CA3AF]">Copy Optimized Context</code>{' '}
                  is ready to use.
                </Lead>
              </Step>

              <Step n={3} title="Optional: sign in for history">
                <Lead>Use this only if you want web dashboard history and synced session metrics.</Lead>
                <Code>LoopGuard: Sign In</Code>
                <p className="mt-2 text-xs text-[#4B5563]">
                  Core loop detection and focused context still work fully without an account.
                </p>
              </Step>
            </SectionCard>
          </div>

          <div id="cursor">
            <SectionCard
              title="Cursor"
              badge="extension + optional MCP"
              icon={
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M4 4l6 18 3-7 7-3L4 4z" />
                </svg>
              }
            >
              <Step n={1} title="Install the LoopGuard extension in Cursor">
                <Lead>
                  Cursor can use the same extension as VS Code. Open the Extensions panel and install
                  LoopGuard there first.
                </Lead>
              </Step>

              <Step n={2} title="Use the editor features right away">
                <Lead>
                  Loop alerts, focused context copy, and the in-editor dashboard all work the same
                  way as in VS Code.
                </Lead>
              </Step>

              <Step n={3} title="Optional: add agent tools for Cursor chat">
                <Lead>
                  If you want focused MCP reads inside Cursor’s agent flow, choose one of these:
                </Lead>
                <Code>LoopGuard: Configure MCP Server</Code>
                <p className="mt-2 text-xs text-[#4B5563]">A picker appears — select <strong className="text-[#9CA3AF]">Cursor</strong> from the list.</p>
                <p className="mt-3 text-sm text-[#6B7280]">
                  or from your project root:
                </p>
                <Code>loopguard-ctx setup --agent=cursor</Code>
                <Note>
                  The CLI path writes <code className="text-[#9CA3AF]">~/.cursor/mcp.json</code> and,
                  when run from a project root, adds{' '}
                  <code className="text-[#9CA3AF]">.cursor/rules/loopguard-ctx.mdc</code> so the
                  agent starts from the focused LoopGuard tools.
                </Note>
              </Step>
            </SectionCard>
          </div>

          <div id="windsurf">
            <SectionCard
              title="Windsurf"
              badge="extension + optional MCP"
              icon={
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3M9 21h10a2 2 0 002-2v-7a2 2 0 00-2-2H9a2 2 0 00-2 2v7a2 2 0 002 2z" />
                </svg>
              }
            >
              <Step n={1} title="Install the LoopGuard extension in Windsurf">
                <Lead>
                  Use Windsurf’s extension support exactly like VS Code. Install LoopGuard from the
                  Extensions panel.
                </Lead>
              </Step>

              <Step n={2} title="Work normally inside the editor">
                <Lead>
                  Loop detection, focused context copy, and sign-in behave the same way as they do in
                  VS Code.
                </Lead>
              </Step>

              <Step n={3} title="Optional: add agent tools for Windsurf">
                <Lead>
                  Use the built-in command or the standalone helper from your project root:
                </Lead>
                <Code>LoopGuard: Configure MCP Server</Code>
                <p className="mt-2 text-xs text-[#4B5563]">A picker appears — select <strong className="text-[#9CA3AF]">Windsurf</strong> from the list.</p>
                <p className="mt-3 text-sm text-[#6B7280]">or:</p>
                <Code>loopguard-ctx setup --agent=windsurf</Code>
                <Note>
                  The helper writes <code className="text-[#9CA3AF]">~/.codeium/windsurf/mcp_config.json</code>{' '}
                  and, from a project root, installs <code className="text-[#9CA3AF]">.windsurfrules</code>{' '}
                  so Windsurf can favor LoopGuard’s focused tools.
                </Note>
              </Step>
            </SectionCard>
          </div>

          <div id="codex">
            <SectionCard
              title="Codex CLI"
              badge="MCP"
              icon={
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#22D3EE"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
                  <path d="M12 12l8-4.5M12 12v9M12 12L4 7.5" />
                </svg>
              }
            >
              <Lead>
                Codex can use LoopGuard as an MCP server for focused reads, compact search, and
                smaller shell output.
              </Lead>

              <Step n={1} title="Fastest path: configure it from the extension">
                <Code>LoopGuard: Configure MCP Server</Code>
                <p className="mt-2 text-xs text-[#4B5563]">A picker appears — select <strong className="text-[#9CA3AF]">Codex CLI</strong> from the list.</p>
                <p className="mt-2 text-xs text-[#4B5563]">
                  This writes the MCP server entry to{' '}
                  <code className="text-[#9CA3AF]">~/.codex/config.toml</code> using the bundled
                  helper path.
                </p>
              </Step>

              <Step n={2} title="Standalone helper path">
                <Lead>
                  If you are not using the extension, install the helper and run:
                </Lead>
                <Code>loopguard-ctx setup --agent=codex</Code>
                <Note>
                  This adds the MCP entry in <code className="text-[#9CA3AF]">~/.codex/config.toml</code>{' '}
                  and writes a small LoopGuard instruction file in{' '}
                  <code className="text-[#9CA3AF]">~/.codex/</code>.
                </Note>
              </Step>

              <Step n={3} title="Restart Codex">
                <Lead>
                  Restart Codex so it reloads MCP servers. If you are coming back to a long-running
                  project later, <code className="text-xs text-[#9CA3AF]">ctx_session load</code>{' '}
                  can restore the last saved helper session.
                </Lead>
              </Step>
            </SectionCard>
          </div>

          <div id="claude-code">
            <SectionCard
              title="Claude Code (terminal)"
              badge="helper + MCP"
              icon={
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#22D3EE"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M8 9l3 3-3 3M13 15h3M3 4h18a1 1 0 011 1v14a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1z" />
                </svg>
              }
            >
              <Lead>
                No editor required. This path is for terminal-first agent workflows where you want
                LoopGuard’s focused reads and smaller shell output.
              </Lead>

              <Step n={1} title="Install loopguard-ctx">
                <Lead>Choose the method that suits you.</Lead>
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#6B7280]">Homebrew (macOS / Linux)</p>
                <Code>{'brew tap rodthenewcomer/loopguard https://github.com/rodthenewcomer/loopguard\nbrew install loopguard-ctx'}</Code>
                <p className="mt-4 mb-2 text-xs font-semibold uppercase tracking-widest text-[#6B7280]">Or curl installer</p>
                <Code>curl -fsSL https://loopguard.vercel.app/install.sh | sh -s -- --download</Code>
                <p className="mt-3 text-sm text-[#6B7280]">Verify:</p>
                <Code>loopguard-ctx --version</Code>
              </Step>

              <Step n={2} title="Wire Claude Code">
                <Lead>This sets up the Claude MCP entry plus the local helper guidance files.</Lead>
                <Code>loopguard-ctx setup --agent=claude</Code>
                <Note>
                  Today this writes <code className="text-[#9CA3AF]">~/.claude.json</code> for MCP,
                  <code className="text-[#9CA3AF]"> ~/.claude/settings.json</code> for local hooks,
                  and <code className="text-[#9CA3AF]"> ~/.claude/CLAUDE.md</code> for tool guidance.
                </Note>
              </Step>

              <Step n={3} title="Restart Claude Code and verify">
                <Lead>
                  Restart your terminal session, then run the doctor if you want a full check:
                </Lead>
                <Code>loopguard-ctx doctor</Code>
              </Step>

              <Step n={4} title="Restore previous session context">
                <Lead>
                  Run this inside Claude Code before starting work to restore context from the previous session:
                </Lead>
                <Code>ctx_session load</Code>
              </Step>

              <Step n={5} title="Share knowledge across agents">
                <Lead>
                  Store facts and hand off work to any other agent — Cursor, Codex CLI, Antigravity — without re-explaining context.
                </Lead>
                <Code>{`ctx_knowledge(action="set", key="arch.auth", value="Supabase JWT + RLS", category="architecture")
ctx_agent(action="write", agent="claude-code", label="handoff", content="stopped at line 84 in authService.ts")`}</Code>
                <p className="mt-2 text-xs text-[#4B5563]">
                  Any MCP-connected agent in the same project can read these immediately.
                </p>
              </Step>
            </SectionCard>
          </div>

          <div id="antigravity">
            <SectionCard
              title="Antigravity"
              badge="MCP"
              icon={
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#22D3EE"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 2l3 7h7l-5 5 2 7-7-4-7 4 2-7-5-5h7z" />
                </svg>
              }
            >
              <Lead>
                Antigravity uses LoopGuard as an MCP server for focused context reads and passive shell compression!
              </Lead>

              <Step n={1} title="Run the setup command">
                <Code>loopguard-ctx setup --agent=antigravity</Code>
                <Note>
                  This adds the MCP entry in <code className="text-[#9CA3AF]">~/.gemini/settings/mcp.json</code> and injects the ANTIGRAVITY.md intelligence hooks.
                </Note>
              </Step>
              
              <Step n={2} title="Resume agent session">
                <Lead>Antigravity will now natively leverage loop detection and forecasting tools automatically.</Lead>
              </Step>
            </SectionCard>
          </div>

          <div id="shell-hooks">
            <SectionCard
              title="Shell helper"
              badge="bash · zsh · fish"
              icon={
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M4 17l6-6-6-6M12 19h8" />
                </svg>
              }
            >
              <Lead>
                The shell helper is the lightest-weight install: same machine, same commands, less
                noisy output before it reaches an AI tool.
              </Lead>

              <Step n={1} title="Install the helper">
                <Lead>If you do not already have loopguard-ctx, install it:</Lead>
                <Code>curl -fsSL https://loopguard.vercel.app/install.sh | sh -s -- --download</Code>
                <p className="mt-2 text-xs text-[#4B5563]">Then verify: <code className="text-[#9CA3AF]">loopguard-ctx --version</code></p>
              </Step>

              <Step n={2} title="Install shell hooks">
                <Code>loopguard-ctx init</Code>
                <p className="mt-2 text-xs text-[#4B5563]">
                  This updates your shell config and adds the LoopGuard shell wrapper.
                </p>
              </Step>

              <Step n={3} title="Restart your terminal">
                <Lead>Open a new shell and try a noisy command.</Lead>
                <div className="rounded-xl border border-[#1F2937] bg-[#0d1117] p-3">
                  <p className="font-mono text-xs text-[#6B7280]">$ npm install</p>
                  <p className="mt-1 font-mono text-xs text-[#6B7280]">…</p>
                  <p className="mt-1 font-mono text-xs text-[#22D3EE]">
                    [LoopGuard: compressed 3,420 → 280 tokens · 91% reduction]
                  </p>
                </div>
              </Step>
            </SectionCard>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="mb-4 text-sm text-[#6B7280]">
            Need the deeper reference, command details, or troubleshooting steps?
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/docs"
              className="rounded-xl bg-[#2563EB] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#1d4ed8]"
            >
              Full documentation
            </Link>
            <a
              href="https://github.com/rodthenewcomer/loopguard/issues"
              className="rounded-xl border border-[#374151] px-5 py-2.5 text-sm font-medium text-[#9CA3AF] transition-colors hover:border-[#4B5563] hover:text-white"
            >
              GitHub issues
            </a>
          </div>
        </div>
      </main>

      <footer className="mt-16 border-t border-[#1F2937]">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-8">
          <p className="text-xs text-[#4B5563]">© 2026 LoopGuard. MIT License.</p>
          <div className="flex items-center gap-4 text-xs text-[#4B5563]">
            <Link href="/" className="transition-colors hover:text-[#6B7280]">
              Home
            </Link>
            <Link href="/docs" className="transition-colors hover:text-[#6B7280]">
              Docs
            </Link>
            <Link href="/dashboard" className="transition-colors hover:text-[#6B7280]">
              Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
