import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Documentation — LoopGuard',
  description: 'Complete documentation for LoopGuard — installation, features, configuration, and troubleshooting.',
};

const SECTIONS = [
  {
    title: 'Getting Started',
    icon: '⚡',
    items: [
      { label: 'Installation', desc: 'Install from VS Code Marketplace — binary bundled, no Rust needed', href: '/docs#installation' },
      { label: 'First launch', desc: 'What to expect when LoopGuard activates', href: '/docs#first-launch' },
      { label: 'Quick reference', desc: 'All commands and settings in one place', href: '/docs#commands' },
    ],
  },
  {
    title: 'Loop Detection',
    icon: '🔁',
    items: [
      { label: 'How loops are detected', desc: 'Diagnostic-based + edit-pattern detection', href: '/docs#loop-detection' },
      { label: 'Alert actions', desc: 'Try New Approach, View Details, Ignore', href: '/docs#alerts' },
      { label: 'Sensitivity settings', desc: 'Low (5×) / Medium (3×) / High (2×)', href: '/docs#sensitivity' },
    ],
  },
  {
    title: 'Context Engine',
    icon: '🧠',
    items: [
      { label: 'Copy Optimized Context', desc: 'Compress and copy context to clipboard', href: '/docs#context-engine' },
      { label: 'Rust vs TypeScript engine', desc: 'Two-tier system — 89–99% vs ~80% reduction', href: '/docs#engines' },
      { label: 'Supported languages', desc: '14 languages with AST analysis', href: '/docs#languages' },
    ],
  },
  {
    title: 'Dashboard',
    icon: '📊',
    items: [
      { label: 'Session dashboard (in VS Code)', desc: 'Live webview panel — loops, time wasted, tokens saved', href: '/docs#dashboard' },
      { label: 'Web dashboard', desc: 'Aggregated metrics across all sessions', href: '/dashboard' },
      { label: 'Account & sync', desc: 'Sign in to sync metrics to the web dashboard', href: '/docs#sync' },
    ],
  },
  {
    title: 'MCP & Integrations',
    icon: '🔌',
    items: [
      { label: 'MCP Server setup', desc: 'Configure Cursor, Claude Code, Windsurf, Copilot', href: '/docs#mcp' },
      { label: 'Shell hooks', desc: 'Compress npm/git/docker CLI output automatically', href: '/docs#shell-hooks' },
      { label: 'Binary installation', desc: 'Bundled in VSIX — download from GitHub if needed', href: '/docs#binary' },
    ],
  },
  {
    title: 'Configuration',
    icon: '⚙️',
    items: [
      { label: 'All settings', desc: 'sensitivity, enableContextEngine, loopThreshold…', href: '/docs#configuration' },
      { label: 'settings.json reference', desc: 'Copy-paste config snippets', href: '/docs#settings-json' },
    ],
  },
  {
    title: 'Troubleshooting',
    icon: '🔧',
    items: [
      { label: 'Loops not detected', desc: 'Check sensitivity, diagnostics, output panel', href: '/docs#no-detection' },
      { label: 'Binary not found', desc: 'Reinstall platform-specific VSIX or download from GitHub', href: '/docs#binary-missing' },
      { label: 'MCP setup failed', desc: 'Step-by-step debug guide', href: '/docs#mcp-debug' },
      { label: 'Sign in issues', desc: 'Browser deep-link and URI callback troubleshooting', href: '/docs#auth-debug' },
    ],
  },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#0B1220]">
      {/* Header */}
      <header className="border-b border-[#1F2937] sticky top-0 z-40 bg-[#0B1220]/90 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <svg width="26" height="26" viewBox="0 0 34 34" fill="none" aria-hidden="true">
              <path d="M17 2L3 8v10c0 8.3 5.8 15.8 14 17.7C25.2 33.8 31 26.3 31 18V8L17 2z" fill="url(#dg)" />
              <defs>
                <linearGradient id="dg" x1="3" y1="2" x2="31" y2="35" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#22D3EE" />
                </linearGradient>
              </defs>
            </svg>
            <span className="font-bold text-white">LoopGuard</span>
            <span className="text-[#1F2937] mx-1">/</span>
            <span className="text-sm text-[#6B7280]">Docs</span>
          </Link>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/loopguard/loopguard"
              className="text-sm text-[#6B7280] hover:text-[#9CA3AF] transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://marketplace.visualstudio.com/items?itemName=loopguard-dev.loopguard"
              className="px-3 py-1.5 bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-sm font-medium rounded-lg transition-colors"
            >
              Install Extension
            </a>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-6 py-16">
        {/* Title */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-white mb-3">Documentation</h1>
          <p className="text-[#6B7280] text-lg">
            Everything you need to install, configure, and get the most out of LoopGuard.
          </p>
        </div>

        {/* Quick install */}
        <div
          className="rounded-2xl border border-[#22D3EE]/25 p-6 mb-6"
          style={{ background: 'linear-gradient(145deg, #0f1c32, #111827)' }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white mb-1">Install LoopGuard</h2>
              <p className="text-[#6B7280] text-sm">One command. Binary bundled. Activates automatically.</p>
            </div>
            <div className="flex items-center gap-2">
              <code className="px-3 py-2 bg-[#0d1117] border border-[#374151] rounded-lg text-[#22D3EE] text-sm font-mono whitespace-nowrap">
                ext install loopguard-dev.loopguard
              </code>
            </div>
          </div>
        </div>

        {/* No Rust needed callout */}
        <div className="rounded-xl border border-[#10B981]/20 bg-[#10B981]/5 px-5 py-3.5 mb-10 flex items-start gap-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5" aria-hidden="true">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          <p className="text-sm text-[#6B7280]">
            <span className="text-[#10B981] font-semibold">No Rust required.</span>{' '}
            The <code className="text-[#9CA3AF] text-xs">loopguard-ctx</code> binary is bundled inside the VSIX —
            VS Code installs the correct platform binary automatically (macOS · Windows · Linux).
          </p>
        </div>

        {/* Sections grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SECTIONS.map((section) => (
            <div
              key={section.title}
              className="rounded-2xl border border-[#1F2937] overflow-hidden"
              style={{ background: 'linear-gradient(145deg, #111827, #0f172a)' }}
            >
              <div className="px-5 py-4 border-b border-[#1F2937] flex items-center gap-2">
                <span className="text-xl" aria-hidden="true">{section.icon}</span>
                <h3 className="font-semibold text-[#F9FAFB]">{section.title}</h3>
              </div>
              <div className="divide-y divide-[#1F2937]">
                {section.items.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="flex items-center justify-between px-5 py-3.5 hover:bg-[#1F2937]/40 transition-colors group"
                  >
                    <div>
                      <div className="text-sm font-medium text-[#F9FAFB] group-hover:text-white transition-colors">
                        {item.label}
                      </div>
                      <div className="text-xs text-[#4B5563] mt-0.5">{item.desc}</div>
                    </div>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-[#374151] group-hover:text-[#6B7280] transition-colors flex-shrink-0"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Platform VSIXs */}
        <div
          className="mt-8 rounded-2xl border border-[#1F2937] p-6"
          style={{ background: 'linear-gradient(145deg, #111827, #0f172a)' }}
        >
          <h3 className="font-semibold text-[#F9FAFB] mb-4">Platform-specific downloads</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { label: 'macOS Apple Silicon (M1/M2/M3)', file: 'loopguard-darwin-arm64.vsix' },
              { label: 'macOS Intel', file: 'loopguard-darwin-x64.vsix' },
              { label: 'Windows x64', file: 'loopguard-win32-x64.vsix' },
              { label: 'Linux x64', file: 'loopguard-linux-x64.vsix' },
              { label: 'Linux ARM64', file: 'loopguard-linux-arm64.vsix' },
            ].map((p) => (
              <div key={p.file} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#0d1117] border border-[#1F2937]">
                <code className="text-[#22D3EE] text-xs font-mono flex-1 truncate">{p.file}</code>
                <span className="text-xs text-[#4B5563] whitespace-nowrap">{p.label}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-[#4B5563] mt-3">
            Available in{' '}
            <a
              href="https://github.com/loopguard/loopguard/releases/latest"
              className="text-[#6B7280] hover:text-[#9CA3AF] transition-colors underline underline-offset-2"
            >
              GitHub Releases
            </a>
            . The Marketplace installs the correct one automatically.
          </p>
        </div>

        {/* Full guide link */}
        <div className="mt-10 text-center">
          <a
            href="https://github.com/loopguard/loopguard/blob/main/docs/user-guide.md"
            className="inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#9CA3AF] transition-colors"
          >
            View complete user guide on GitHub
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
            </svg>
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1F2937] mt-16">
        <div className="max-w-5xl mx-auto px-6 py-8 flex items-center justify-between">
          <p className="text-xs text-[#4B5563]">© 2026 LoopGuard. MIT License.</p>
          <div className="flex items-center gap-4 text-xs text-[#4B5563]">
            <Link href="/" className="hover:text-[#6B7280] transition-colors">Home</Link>
            <Link href="/dashboard" className="hover:text-[#6B7280] transition-colors">Dashboard</Link>
            <a href="https://github.com/loopguard/loopguard/issues" className="hover:text-[#6B7280] transition-colors">Report a bug</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
