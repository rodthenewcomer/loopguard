import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Setup — LoopGuard',
  description: 'Install and configure LoopGuard for VS Code, Cursor, Windsurf, Codex CLI, Claude Code terminal, and shell helpers.',
};

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#2563EB]/15 border border-[#2563EB]/30 flex items-center justify-center text-xs font-bold text-[#2563EB]">
        {n}
      </div>
      <div className="flex-1 pb-6">
        <h4 className="text-sm font-semibold text-[#F9FAFB] mb-2">{title}</h4>
        {children}
      </div>
    </div>
  );
}

function Code({ children }: { children: string }) {
  return (
    <div className="mt-2 px-4 py-3 bg-[#0d1117] border border-[#1F2937] rounded-xl">
      <code className="text-[#22D3EE] text-sm font-mono">{children}</code>
    </div>
  );
}

function SectionCard({
  icon, title, badge, children,
}: {
  icon: React.ReactNode; title: string; badge?: string; children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl border border-[#1F2937] overflow-hidden"
      style={{ background: 'linear-gradient(145deg, #111827, #0f172a)' }}
    >
      <div className="px-6 py-5 border-b border-[#1F2937] flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <div className="flex items-center gap-3">
          <h3 className="font-bold text-white">{title}</h3>
          {badge && (
            <span className="px-2 py-0.5 bg-[#22D3EE]/10 border border-[#22D3EE]/20 rounded-full text-[10px] font-bold text-[#22D3EE] uppercase tracking-wide">
              {badge}
            </span>
          )}
        </div>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

export default function SetupPage() {
  return (
    <div className="min-h-screen bg-[#0B1220]">
      {/* Header */}
      <header className="border-b border-[#1F2937] sticky top-0 z-40 bg-[#0B1220]/90 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/icon-192x192.png" alt="LoopGuard" width="28" height="28" className="rounded-lg" />
            <span className="font-bold text-white">LoopGuard</span>
            <span className="text-[#1F2937] mx-1">/</span>
            <span className="text-sm text-[#6B7280]">Setup</span>
          </Link>
          <Link
            href="/docs"
            className="text-sm text-[#6B7280] hover:text-[#9CA3AF] transition-colors"
          >
            Full docs →
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16">
        {/* Title */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-white mb-3">
            Set up LoopGuard
          </h1>
          <p className="text-[#6B7280] text-lg max-w-xl mx-auto">
            Works with VS Code, Cursor, Windsurf, Codex CLI, Claude Code in terminal, and supported shells like bash, zsh, and fish.
            Pick your tool below.
          </p>
        </div>

        {/* Tool selector pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
            {[
              { label: 'VS Code', anchor: '#vscode' },
              { label: 'Cursor', anchor: '#cursor' },
              { label: 'Windsurf', anchor: '#windsurf' },
              { label: 'Codex CLI', anchor: '#codex' },
              { label: 'Claude Code (terminal)', anchor: '#claude-code' },
              { label: 'Shell hooks', anchor: '#shell-hooks' },
            ].map((t) => (
            <a
              key={t.label}
              href={t.anchor}
              className="px-4 py-2 bg-[#111827] border border-[#1F2937] hover:border-[#374151] rounded-full text-sm text-[#9CA3AF] hover:text-white transition-colors"
            >
              {t.label}
            </a>
          ))}
        </div>

        <div className="space-y-8">

          {/* VS Code */}
          <div id="vscode">
            <SectionCard
              title="VS Code"
              badge="extension"
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M8 6L2 12l6 6M16 6l6 6-6 6M14 4l-4 16" />
                </svg>
              }
            >
              <Step n={1} title="Install from Marketplace">
                <p className="text-sm text-[#6B7280] mb-2">Search for <strong className="text-[#9CA3AF]">LoopGuard</strong> in the Extensions panel, or run:</p>
                <Code>ext install LoopGuard.loopguard</Code>
                <p className="text-xs text-[#4B5563] mt-2">The Rust binary is bundled. No Cargo or extra install needed.</p>
              </Step>
              <Step n={2} title="Activate automatically">
                <p className="text-sm text-[#6B7280]">
                  Open any workspace. LoopGuard activates and the status bar shows <code className="text-[#9CA3AF] text-xs">✓ LoopGuard</code>. Loop detection is live.
                </p>
              </Step>
              <Step n={3} title="Optional: sign in to sync metrics">
                <p className="text-sm text-[#6B7280] mb-2">Open the Command Palette and run:</p>
                <Code>LoopGuard: Sign In</Code>
                <p className="text-xs text-[#4B5563] mt-2">Your browser opens. Sign in and VS Code connects automatically.</p>
              </Step>
            </SectionCard>
          </div>

          {/* Cursor */}
          <div id="cursor">
            <SectionCard
              title="Cursor"
              badge="extension"
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 4l6 18 3-7 7-3L4 4z" />
                </svg>
              }
            >
              <Step n={1} title="Install the VS Code extension in Cursor">
                <p className="text-sm text-[#6B7280] mb-2">
                  Cursor is compatible with VS Code extensions. Open Cursor&rsquo;s Extensions panel
                  and search <strong className="text-[#9CA3AF]">LoopGuard</strong>, or install the VSIX manually:
                </p>
                <Code>cursor --install-extension loopguard-darwin-arm64.vsix</Code>
                <p className="text-xs text-[#4B5563] mt-2">
                  Download the correct platform VSIX from{' '}
                  <a href="https://github.com/rodthenewcomer/loopguard/releases/latest" className="text-[#6B7280] hover:text-[#9CA3AF] underline underline-offset-2 transition-colors">
                    GitHub Releases
                  </a>.
                </p>
              </Step>
              <Step n={2} title="Sign in (works with cursor:// scheme)">
                <p className="text-sm text-[#6B7280] mb-2">
                  Run <code className="text-[#9CA3AF] text-xs">LoopGuard: Sign In</code> from the Command Palette.
                  The auth callback automatically uses <code className="text-[#9CA3AF] text-xs">cursor://</code> — not <code className="text-[#9CA3AF] text-xs">vscode://</code>.
                </p>
              </Step>
              <Step n={3} title="Wire MCP for inline compression (recommended)">
                <p className="text-sm text-[#6B7280] mb-2">
                  Run from the Command Palette:
                </p>
                <Code>LoopGuard: Configure MCP Server → Cursor</Code>
                <p className="text-xs text-[#4B5563] mt-2">Restart Cursor so LoopGuard&apos;s MCP tools are available to the agent.</p>
              </Step>
            </SectionCard>
          </div>

          {/* Windsurf */}
          <div id="windsurf">
            <SectionCard
              title="Windsurf"
              badge="extension"
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3M9 21h10a2 2 0 002-2v-7a2 2 0 00-2-2H9a2 2 0 00-2 2v7a2 2 0 002 2z" />
                </svg>
              }
            >
              <Step n={1} title="Install the VS Code extension in Windsurf">
                <p className="text-sm text-[#6B7280] mb-2">
                  Windsurf supports VS Code extensions. Install via the Extensions panel
                  or manually with the VSIX for your platform.
                </p>
                <Code>windsurf --install-extension loopguard-darwin-arm64.vsix</Code>
              </Step>
              <Step n={2} title="Sign in (uses windsurf:// scheme)">
                <p className="text-sm text-[#6B7280]">
                  Run <code className="text-[#9CA3AF] text-xs">LoopGuard: Sign In</code>.
                  The auth callback uses <code className="text-[#9CA3AF] text-xs">windsurf://LoopGuard.loopguard/auth</code> automatically.
                </p>
              </Step>
              <Step n={3} title="Configure MCP for Windsurf">
                <Code>LoopGuard: Configure MCP Server → Windsurf</Code>
                <p className="text-xs text-[#4B5563] mt-2">Restart Windsurf so LoopGuard&apos;s MCP tools are available.</p>
              </Step>
            </SectionCard>
          </div>

          {/* Codex */}
          <div id="codex">
            <SectionCard
              title="Codex CLI"
              badge="MCP"
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22D3EE" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
                  <path d="M12 12l8-4.5M12 12v9M12 12L4 7.5" />
                </svg>
              }
            >
              <p className="text-sm text-[#6B7280] mb-5">
                Codex supports MCP servers. LoopGuard can plug into Codex so focused reads and shell compression are available through the local <code className="text-[#9CA3AF] text-xs">loopguard-ctx</code> binary.
              </p>

              <Step n={1} title="If you already installed the LoopGuard extension">
                <p className="text-sm text-[#6B7280] mb-2">
                  Run this from VS Code, Cursor, or Windsurf:
                </p>
                <Code>LoopGuard: Configure MCP Server → Codex CLI</Code>
                <p className="text-xs text-[#4B5563] mt-2">LoopGuard writes <code className="text-[#9CA3AF] text-xs">~/.codex/config.toml</code> for you using the bundled binary path.</p>
              </Step>

              <Step n={2} title="Manual Codex config">
                <p className="text-sm text-[#6B7280] mb-2">
                  If you are using the standalone binary instead of the extension, add this to <code className="text-[#9CA3AF] text-xs">~/.codex/config.toml</code>:
                </p>
                <Code>{`[mcp_servers.loopguard-ctx]
command = "loopguard-ctx"
args = []`}</Code>
              </Step>

              <Step n={3} title="Restart Codex">
                <p className="text-sm text-[#6B7280]">
                  Restart Codex after editing the config so it reloads the MCP server list.
                </p>
              </Step>
            </SectionCard>
          </div>

          {/* Claude Code terminal */}
          <div id="claude-code">
            <SectionCard
              title="Claude Code (terminal)"
              badge="no VS Code needed"
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22D3EE" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M8 9l3 3-3 3M13 15h3M3 4h18a1 1 0 011 1v14a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1z" />
                </svg>
              }
            >
              <p className="text-sm text-[#6B7280] mb-5">
                No VS Code required. Claude Code can connect to LoopGuard over MCP for focused reads, compact search results, and cleaner shell output.
              </p>

              <Step n={1} title="Download the loopguard-ctx binary">
                <p className="text-sm text-[#6B7280] mb-2">Get the binary for your platform from GitHub Releases:</p>
                <div className="mt-2 p-4 bg-[#0d1117] border border-[#1F2937] rounded-xl space-y-2">
                  {[
                    { label: 'macOS Apple Silicon', file: 'loopguard-ctx-darwin-arm64' },
                    { label: 'macOS Intel', file: 'loopguard-ctx-darwin-x64' },
                    { label: 'Linux x64', file: 'loopguard-ctx-linux-x64' },
                    { label: 'Linux ARM64', file: 'loopguard-ctx-linux-arm64' },
                    { label: 'Windows x64', file: 'loopguard-ctx-win32-x64.exe' },
                  ].map((p) => (
                    <div key={p.file} className="flex items-center gap-3">
                      <code className="text-[#22D3EE] text-xs font-mono flex-1">{p.file}</code>
                      <span className="text-xs text-[#4B5563]">{p.label}</span>
                    </div>
                  ))}
                </div>
                <a
                  href="https://github.com/rodthenewcomer/loopguard/releases/latest"
                  className="inline-flex items-center gap-1.5 mt-3 text-xs text-[#2563EB] hover:text-[#3B82F6] transition-colors"
                >
                  Open GitHub Releases
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                  </svg>
                </a>
              </Step>

              <Step n={2} title="Install to your PATH">
                <Code>chmod +x loopguard-ctx && mv loopguard-ctx /usr/local/bin/</Code>
                <p className="text-sm text-[#6B7280] mt-2">Verify it works:</p>
                <Code>loopguard-ctx --version</Code>
              </Step>

              <Step n={3} title="Configure MCP for Claude Code">
                <p className="text-sm text-[#6B7280] mb-2">This writes the MCP server config to <code className="text-[#9CA3AF] text-xs">~/.claude/settings.json</code>:</p>
                <Code>loopguard-ctx setup --agent=claude</Code>
              </Step>

              <Step n={4} title="Restart Claude Code">
                <p className="text-sm text-[#6B7280]">
                  Close and reopen your terminal session. Claude Code will now see LoopGuard&rsquo;s MCP tools and can use them for focused context reads.
                </p>
                <div className="mt-3 p-3 rounded-xl bg-[#22D3EE]/5 border border-[#22D3EE]/15">
                  <p className="text-xs text-[#22D3EE] font-semibold mb-1">What you get</p>
                  <ul className="text-xs text-[#6B7280] space-y-1">
                    <li>· Focused file reads through <code className="text-[#9CA3AF]">ctx_read</code></li>
                    <li>· Compact code search and directory tools</li>
                    <li>· Shell output compression through <code className="text-[#9CA3AF]">ctx_shell</code></li>
                    <li>· A larger MCP toolset exposed by the local binary</li>
                  </ul>
                </div>
              </Step>
            </SectionCard>
          </div>

          {/* Shell hooks */}
          <div id="shell-hooks">
            <SectionCard
              title="Shell Hooks"
              badge="any terminal"
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 17l6-6-6-6M12 19h8" />
                </svg>
              }
            >
              <p className="text-sm text-[#6B7280] mb-5">
                Install the shell helper so supported command output can be routed through LoopGuard locally before you paste it into an AI tool.
              </p>

              <Step n={1} title="Install the binary (if not already done)">
                <p className="text-sm text-[#6B7280]">Same binary as the Claude Code setup above.</p>
                <Code>loopguard-ctx --version</Code>
              </Step>

              <Step n={2} title="Install shell hooks">
                <Code>loopguard-ctx init</Code>
                <p className="text-xs text-[#4B5563] mt-2">Adds hooks to <code className="text-[#9CA3AF]">~/.zshrc</code> / <code className="text-[#9CA3AF]">~/.bashrc</code>.</p>
              </Step>

              <Step n={3} title="Restart your terminal">
                <p className="text-sm text-[#6B7280] mb-2">
                  Open a new terminal session. Supported commands can now use LoopGuard&rsquo;s shell path:
                </p>
                <div className="p-3 rounded-xl bg-[#0d1117] border border-[#1F2937]">
                  <p className="text-xs font-mono text-[#6B7280]">$ npm install</p>
                  <p className="text-xs font-mono text-[#6B7280] mt-1">{'...'}</p>
                  <p className="text-xs font-mono text-[#22D3EE] mt-1">[LoopGuard: compressed 3,420 → 280 tokens · 91% reduction]</p>
                </div>
              </Step>

              <div className="mt-2">
                <p className="text-xs text-[#4B5563]">
                  Supported: bash · zsh · fish (manual config available via <code className="text-[#6B7280]">loopguard-ctx init --help</code>)
                </p>
              </div>
            </SectionCard>
          </div>

        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-sm text-[#6B7280] mb-4">
            Questions or issues? Check the docs or open an issue on GitHub.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/docs"
              className="px-5 py-2.5 bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-bold rounded-xl transition-colors text-sm"
            >
              Full Documentation
            </Link>
            <a
              href="https://github.com/rodthenewcomer/loopguard/issues"
              className="px-5 py-2.5 border border-[#374151] hover:border-[#4B5563] text-[#9CA3AF] hover:text-white font-medium rounded-xl transition-colors text-sm"
            >
              GitHub Issues
            </a>
          </div>
        </div>
      </main>

      <footer className="border-t border-[#1F2937] mt-16">
        <div className="max-w-4xl mx-auto px-6 py-8 flex items-center justify-between">
          <p className="text-xs text-[#4B5563]">© 2026 LoopGuard. MIT License.</p>
          <div className="flex items-center gap-4 text-xs text-[#4B5563]">
            <Link href="/" className="hover:text-[#6B7280] transition-colors">Home</Link>
            <Link href="/docs" className="hover:text-[#6B7280] transition-colors">Docs</Link>
            <Link href="/dashboard" className="hover:text-[#6B7280] transition-colors">Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
