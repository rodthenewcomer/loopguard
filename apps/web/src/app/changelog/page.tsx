import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Changelog — LoopGuard',
  description: 'Every release, every fix, every improvement to LoopGuard.',
};

const RELEASES = [
  {
    version: 'v0.1.0',
    date: 'March 2026',
    tag: 'Initial Release',
    tagColor: '#22C55E',
    summary: 'First public release of LoopGuard. Loop detection and the TypeScript context engine ship in the free tier. Rust engine, MCP server, and shell hooks ship in Pro.',
    sections: [
      {
        label: 'Loop Detection',
        color: '#F59E0B',
        items: [
          'Diagnostic-based loop detection via VS Code diagnostics API — works on all languages VS Code supports',
          'Edit-pattern loop detection — catches loops even when the error message changes between attempts',
          'Configurable sensitivity: Low (5 occurrences), Medium (3 occurrences), High (2 occurrences)',
          'Real-time status bar showing active loop count and total time wasted this session',
          'Alert notification with three actions: Try New Approach, View Details, Ignore',
          'Session dashboard webview panel — full loop timeline, time wasted per loop, token savings',
          'Session reset command — clears all loop state and restarts the timer',
          'Toggle detection on/off without reloading the extension',
        ],
      },
      {
        label: 'Context Engine',
        color: '#22D3EE',
        items: [
          'TypeScript context engine (~80% reduction) — ships in the free tier, no binary required',
          'Rust context engine (89–99% reduction) — ships in Pro as a platform-specific binary',
          'AST signature extraction — function stubs and type declarations without full bodies',
          'Shannon entropy scoring — keeps high-information lines, drops boilerplate',
          'Myers delta — only sends lines that changed since the last AI request (~13 tokens)',
          'Copy Optimized Context command (Ctrl+Shift+P) — copies compressed context to clipboard',
          'Token estimate shown in info message after every copy: "3,200 tokens · 91% reduction"',
          '14 languages: TypeScript, JavaScript, Python, Rust, Go, Java, C, C++, C#, Ruby, Swift, Kotlin, PHP, Lua',
        ],
      },
      {
        label: 'MCP Server (Pro)',
        color: '#A78BFA',
        items: [
          '21 context tools wired into Claude Code, Cursor, Windsurf, and GitHub Copilot',
          'ctx_compress — compress any file before sending to AI',
          'ctx_delta — send only changed lines since last request',
          'ctx_read — smart file read with automatic compression',
          'ctx_search — semantic search across the codebase',
          'ctx_tree — compressed directory structure',
          'Setup command: LoopGuard: Configure MCP Server — writes ~/.claude.json automatically',
          'Works from terminal with no VS Code required (Claude Code users)',
        ],
      },
      {
        label: 'Shell Hooks (Pro)',
        color: '#F59E0B',
        items: [
          'Automatic compression of CLI output before it reaches AI context',
          'Supports bash, zsh, fish on Windows (WSL), macOS, and Linux',
          '60–90% reduction on npm install, git log, docker build, cargo build output',
          'Install via: LoopGuard: Install Shell Hooks — writes to shell profile automatically',
        ],
      },
      {
        label: 'Auth & Sync',
        color: '#2563EB',
        items: [
          'Sign In command — opens browser to loopguard.vercel.app/auth/extension',
          'Google OAuth and email + password sign-in supported',
          'JWT stored in VS Code SecretStorage (macOS Keychain / Windows Credential Manager / Linux libsecret)',
          'Session metrics sync to API every 5 minutes and on session end',
          'Loop events sync individually — each detection fires a single lightweight API call',
          'Works on VS Code, Cursor, and Windsurf — IDE auto-detected from vscode.env.uriScheme',
        ],
      },
      {
        label: 'Platform Support',
        color: '#22C55E',
        items: [
          'Windows 10 / 11 — x64 and ARM64',
          'macOS 12+ — x64 (Intel) and ARM64 (Apple Silicon)',
          'Linux — x64 and ARM64 (glibc 2.17+)',
          'Rust binary distributed as platform-specific VSIX — no Cargo, no build step required',
          'Loop detection uses VS Code diagnostics API — identical behavior on all platforms',
        ],
      },
    ],
  },
];

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-[#0B1220]">
      {/* Header */}
      <div className="border-b border-[#1F2937]">
        <div className="max-w-3xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/icon-192x192.png" alt="LoopGuard" width="28" height="28" className="rounded-lg" />
            <span className="font-bold text-white">LoopGuard</span>
          </Link>
          <Link href="/docs" className="text-sm text-[#6B7280] hover:text-[#9CA3AF] transition-colors">
            Docs →
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-white mb-2">Changelog</h1>
        <p className="text-[#6B7280] mb-16">Every release, every fix, every improvement.</p>

        <div className="space-y-16">
          {RELEASES.map((release) => (
            <div key={release.version}>
              {/* Release header */}
              <div className="flex items-center gap-4 mb-8">
                <span className="text-2xl font-black text-white font-mono">{release.version}</span>
                <span
                  className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                  style={{ background: release.tagColor + '20', color: release.tagColor, border: `1px solid ${release.tagColor}40` }}
                >
                  {release.tag}
                </span>
                <span className="text-sm text-[#4B5563] ml-auto">{release.date}</span>
              </div>

              <p className="text-[#9CA3AF] text-sm leading-relaxed mb-8 pl-4 border-l-2 border-[#1F2937]">
                {release.summary}
              </p>

              <div className="space-y-8">
                {release.sections.map((section) => (
                  <div key={section.label}>
                    <div
                      className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider"
                      style={{ color: section.color }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: section.color }} />
                      {section.label}
                    </div>
                    <ul className="space-y-2">
                      {section.items.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-sm text-[#6B7280]">
                          <span className="text-[#374151] mt-1.5 flex-shrink-0">—</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Coming next */}
        <div className="mt-16 pt-8 border-t border-[#1F2937]">
          <p className="text-sm text-[#4B5563]">
            See what&rsquo;s coming next on the{' '}
            <Link href="/roadmap" className="text-[#6B7280] hover:text-[#9CA3AF] underline underline-offset-2 transition-colors">
              Roadmap
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
