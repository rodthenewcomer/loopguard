import Link from 'next/link';
import Navbar from '../components/Navbar';
import HeroMockup from '../components/HeroMockup';
import TokenCounter from '../components/TokenCounter';
import ScrollReveal from '../components/ScrollReveal';

/* ── SVG icon helper ────────────────────────────────────────────── */
function Icon({ path, size = 20 }: { path: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  );
}

const IC = {
  loop:     'M17 1l4 4-4 4M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 01-4 4H3',
  context:  'M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2v-4M9 21H5a2 2 0 01-2-2v-4m0 0h18',
  mcp:      'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  check:    'M20 6L9 17l-5-5',
  zap:      'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  shield:   'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  clock:    'M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10zm0-10V7',
  code:     'M16 18l6-6-6-6M8 6l-6 6 6 6',
  terminal: 'M4 17l6-6-6-6M12 19h8',
  arrow:    'M5 12h14M12 5l7 7-7 7',
  alert:    'M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01',
  cpu:      'M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2v-4M9 21H5a2 2 0 01-2-2v-4m0 0h18',
  git:      'M18 3a3 3 0 100 6 3 3 0 000-6zM6 21a3 3 0 100-6 3 3 0 000 6zM6 15V9a3 3 0 013-3h6',
  slash:    'M22 2L2 22',
  eye:      'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 100 6 3 3 0 000-6z',
  monitor:  'M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z',
  globe:    'M12 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10zm-1-11v6l5-3-5-3z',
  windows:  'M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z',
  apple:    'M12 2a10 10 0 100 20A10 10 0 0012 2zm0 4a2 2 0 110 4 2 2 0 010-4z',
  linux:    'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z',
  github:   'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22',
  twitter:  'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z',
  mail:     'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 0l8 9 8-9',
};

/* ── Pain cards — SVG icons, no emojis ──────────────────────────── */
const PAIN_CARDS = [
  {
    iconPath: IC.loop,
    iconColor: '#EF4444',
    title: 'Same error. Different variable name.',
    body: 'AI gives you the fix you tried 20 minutes ago — just renamed. You don\'t notice until you\'re three attempts in and an hour behind.',
  },
  {
    iconPath: IC.slash,
    iconColor: '#F59E0B',
    title: 'You pasted 800 lines for a 3-line bug.',
    body: 'The AI gets your entire file on every message. It wastes tokens on unrelated code — and gives you worse answers because of the noise.',
  },
  {
    iconPath: IC.clock,
    iconColor: '#A78BFA',
    title: 'Two hours gone. No warning.',
    body: 'You don\'t realize you\'ve been on the same bug for two hours until you check the clock. No circuit breaker. No alert. Just lost time.',
  },
];

/* ── What LoopGuard does — plain English ────────────────────────── */
const WHAT_WE_DO = [
  {
    n: '01',
    color: '#F59E0B',
    title: 'Cuts the circuit before the bill arrives',
    body: 'Every turn a stuck AI takes costs real money. LoopGuard watches both your diagnostics and your edit history. The moment it detects a loop — whether you\'re typing or an agent is running — it fires an alert with the exact time and token estimate burned.',
    tag: 'Loop Circuit Breaker',
  },
  {
    n: '02',
    color: '#22D3EE',
    title: 'Your AI reads the file. It gets 7% of it.',
    body: 'LoopGuard sits between your editor and your AI. Every context request — manual copy or MCP-backed agent read — is filtered through the relevance engine. Focused signatures, exact error context, smaller project maps. The rest is dropped.',
    tag: 'Relevance Engine',
  },
];

/* ── Platform grid ──────────────────────────────────────────────── */
const PLATFORMS = [
  { name: 'Windows 10 / 11', icon: IC.windows, color: '#0078D4' },
  { name: 'macOS 12+',       icon: IC.apple,   color: '#A0A0A0' },
  { name: 'Linux',           icon: IC.linux,   color: '#FCC624' },
];

const IDES = [
  'VS Code', 'Cursor', 'Windsurf', 'Codex CLI', 'Claude Code (terminal)', 'GitHub Copilot',
];

/* ── Loop detection features ────────────────────────────────────── */
const LOOP_FEATURES = [
  'Watches VS Code diagnostics in real time — all 14 languages',
  'Detects edit-pattern loops even when the error message changes',
  'Fires an alert the moment a loop is confirmed — with exact time wasted and local token estimates',
  'Works with autonomous agents — catches Claude Code and Cursor agents spinning silently',
  'Session dashboard: every loop, every cost, every pattern across your history',
];

/* ── Context engine features ────────────────────────────────────── */
const CTX_FEATURES = [
  'Rust engine: 89–99% token reduction — not compression, selection',
  'AST parse: function signatures sent, full bodies dropped',
  'Shannon entropy scoring: complex logic surfaced, boilerplate removed',
  'Session memory: if your agent read auth.ts 3 times, the 4th costs 13 tokens',
  'Myers delta: only what changed since the last request — not the whole file again',
  '14 languages: TypeScript, Python, Rust, Go, Java, C++, and more',
];

/* ── Integrations ───────────────────────────────────────────────── */
const INTEGRATIONS = [
  {
    icon: IC.code,
    title: 'IDE Extension',
    sub: 'VS Code · Cursor · Windsurf — Windows · macOS · Linux',
    desc: 'Loop circuit breaker + relevance engine built in. Free forever. One click install, zero config. Hit a loop: instant alert with time and tokens burned. Copy context: AI gets the 7% that matters.',
    badge: 'Free',
    badgeColor: '#22C55E',
  },
  {
    icon: IC.mcp,
    title: 'AI Gateway',
    sub: 'Claude Code · Cursor · Windsurf · Codex CLI · VS Code / Copilot',
    desc: 'Wire LoopGuard once. Compatible agents can call LoopGuard\'s MCP tools for focused reads, compact search results, and cleaner shell output instead of grabbing full files every time.',
    badge: 'Free',
    badgeColor: '#22C55E',
  },
  {
    icon: IC.terminal,
    title: 'Terminal Filter',
    sub: 'Surfaces signal. Drops noise. Every CLI command.',
    desc: '`npm install` pumps 3,400 tokens of progress bars and resolved packages into your AI. LoopGuard intercepts it and sends 12 lines: the warning that broke your build, the peer conflict, the final status. Nothing else.',
    badge: 'Free',
    badgeColor: '#22C55E',
  },
];

/* ── Stats ──────────────────────────────────────────────────────── */
const STATS = [
  { value: '93%',   label: 'Measured reduction example from the Rust helper', color: '#22D3EE' },
  { value: '~$77',  label: 'Avg saved/month on AI API costs (10 sessions/day)', color: '#22C55E' },
  { value: '47min', label: 'Avg time saved per day from loop detection', color: '#F59E0B' },
  { value: '100%',  label: 'Free — all features, no credit card required', color: '#A78BFA' },
];

/* ── All features (free) ────────────────────────────────────────── */
const ALL_FEATURES = [
  'Loop detection — unlimited sessions',
  'Edit-pattern loop detection',
  'Alert notifications with time wasted',
  'Rust engine (89–99% token reduction)',
  'MCP server — 21 tools for AI agents',
  'Shell hooks — CLI output compression',
  'Context Engine — TypeScript (~80% reduction)',
  'Status bar + session dashboard',
  'Session history and reporting',
  'Works on Windows, macOS, Linux',
];

/* ── Footer links ───────────────────────────────────────────────── */
const FOOTER_COLS = [
  {
    heading: 'Product',
    links: [
      { label: 'Features',   href: '#features' },
      { label: 'Changelog',  href: '/changelog' },
      { label: 'Roadmap',    href: '/roadmap' },
    ],
  },
  {
    heading: 'Documentation',
    links: [
      { label: 'Getting Started',   href: '/docs' },
      { label: 'Setup Guide',       href: '/setup' },
      { label: 'MCP Server',        href: '/docs#mcp' },
      { label: 'Context Engine',    href: '/docs#context-engine' },
      { label: 'Architecture',      href: '/docs#architecture' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'GitHub',          href: 'https://github.com/rodthenewcomer/loopguard' },
      { label: 'Privacy Policy',  href: '/privacy' },
      { label: 'Terms of Service',href: '/terms' },
      { label: 'Support',         href: 'mailto:support@loopguard.dev' },
    ],
  },
];

/* ══════════════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════════════ */
export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Animated grid */}
        <div className="absolute inset-0 bg-grid opacity-30 animate-[grid-drift_20s_linear_infinite]" aria-hidden="true" />

        {/* Radial glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[700px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(37,99,235,0.22) 0%, rgba(34,211,238,0.08) 45%, transparent 70%)' }}
          aria-hidden="true"
        />

        {/* Floating accent orbs */}
        <div
          className="absolute top-1/4 right-10 w-72 h-72 rounded-full pointer-events-none animate-[float_7s_ease-in-out_infinite]"
          style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.06) 0%, transparent 70%)' }}
          aria-hidden="true"
        />
        <div
          className="absolute bottom-1/4 left-10 w-48 h-48 rounded-full pointer-events-none animate-[float_9s_ease-in-out_infinite_2s]"
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%)' }}
          aria-hidden="true"
        />

        <div className="relative max-w-6xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
          {/* Left — copy */}
          <div className="max-w-xl">
            {/* Live badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#1F2937] shimmer-badge mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
              <span className="text-xs text-[#9CA3AF] font-medium">AI loop circuit breaker · measured 93% Rust-helper example · works with Cursor, Claude Code, and Codex MCP</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl font-bold leading-[1.1] tracking-tight mb-6">
              <span className="text-white">You&rsquo;re looping.</span>
              <br />
              <span className="gradient-text">Your AI</span>
              <br />
              <span className="text-white">doesn&rsquo;t know it.</span>
            </h1>

            {/* Explicit product description */}
            <p className="text-[#9CA3AF] text-lg leading-relaxed mb-3">
              The guardrail layer for AI coding agents.
            </p>
            <div className="space-y-2 mb-8">
              <div className="flex items-start gap-3 text-[#9CA3AF] text-base">
                <span className="text-[#F59E0B] mt-1 flex-shrink-0"><Icon path={IC.alert} size={16} /></span>
                <span><span className="text-white font-medium">Cuts the loop before it costs you</span> — detects the moment you or your agent cycles through the same error, with exact time and tokens burned.</span>
              </div>
              <div className="flex items-start gap-3 text-[#9CA3AF] text-base">
                <span className="text-[#22D3EE] mt-1 flex-shrink-0"><Icon path={IC.zap} size={16} /></span>
                <span><span className="text-white font-medium">Focused reads for AI tools</span> — use clipboard mode in the extension, or wire LoopGuard into MCP-compatible agents like Claude Code, Cursor, Windsurf, Codex, and VS Code / Copilot.</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 mb-10">
              <a
                href="/setup"
                className="flex items-center gap-2 px-6 py-3 bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-900/40 hover:shadow-blue-900/60 glow-primary"
              >
                <Icon path={IC.zap} />
                Install Free
              </a>
              <Link
                href="/signup"
                className="flex items-center gap-2 px-6 py-3 border border-[#1F2937] hover:border-[#374151] text-[#9CA3AF] hover:text-white font-medium rounded-xl transition-all duration-200"
              >
                Create free account
                <Icon path={IC.arrow} />
              </Link>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-[#6B7280]">
              <span className="flex items-center gap-1.5">
                <Icon path={IC.shield} size={16} />
                Code never leaves your machine
              </span>
              <span className="flex items-center gap-1.5">
                <Icon path={IC.monitor} size={16} />
                Windows · macOS · Linux
              </span>
              <span className="flex items-center gap-1.5">
                <Icon path={IC.check} size={16} />
                Free — no credit card
              </span>
            </div>
          </div>

          {/* Right — animated mockup */}
          <div className="flex justify-center lg:justify-end">
            <HeroMockup />
          </div>
        </div>
      </section>

      {/* ── WORKS WITH BAR ──────────────────────────────────────── */}
      <div className="border-y border-[#1F2937] bg-[#0d1219]/60">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-wrap items-center justify-center gap-4 text-sm">
          <span className="text-xs uppercase tracking-widest text-[#4B5563]">Works with</span>
          {IDES.map((name) => (
            <span
              key={name}
              className="px-3 py-1 border border-[#1F2937] rounded-full text-[#6B7280] text-xs font-medium hover:border-[#374151] hover:text-[#9CA3AF] transition-colors cursor-default"
            >
              {name}
            </span>
          ))}
        </div>
      </div>

      {/* ── HOW TO GET STARTED ───────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <ScrollReveal className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">Up and running in 60 seconds.</h2>
          <p className="text-[#6B7280]">Pick your path. IDE extension or Claude Code terminal — both take under a minute.</p>
        </ScrollReveal>

        {/* Path A — IDE extension */}
        <ScrollReveal className="mb-3">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#2563EB]/10 border border-[#2563EB]/20">
              <Icon path={IC.code} size={13} />
              <span className="text-xs font-semibold text-[#2563EB]">VS Code · Cursor · Windsurf</span>
            </div>
            <div className="flex-1 h-px bg-[#1F2937]" />
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative mb-12">
          <div className="hidden md:block absolute top-[2.75rem] left-[calc(16.66%+1.5rem)] right-[calc(16.66%+1.5rem)] h-px bg-gradient-to-r from-[#1F2937] via-[#2563EB]/40 to-[#1F2937]" aria-hidden="true" />
          {[
            {
              step: '1',
              color: '#2563EB',
              title: 'Install the extension',
              body: 'Search LoopGuard in the Extensions panel, or run: ext install LoopGuard.loopguard',
              cta: { label: 'Full setup guide →', href: '/setup#vscode' },
            },
            {
              step: '2',
              color: '#22D3EE',
              title: 'Open any project',
              body: 'LoopGuard activates automatically. The status bar shows it is running — no config needed.',
              cta: null,
            },
            {
              step: '3',
              color: '#22C55E',
              title: 'Sign in to sync',
              body: 'Run LoopGuard: Sign In from the Command Palette to see your loops and token savings in the dashboard.',
              cta: { label: 'Create free account →', href: '/signup' },
            },
          ].map((item, i) => (
            <ScrollReveal key={item.step} delay={i * 100}>
              <div className="relative p-6 rounded-2xl border border-[#1F2937] bg-[#111827]/60 hover:border-[#374151] transition-all duration-300">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black mb-4 flex-shrink-0"
                  style={{ background: item.color + '20', color: item.color, border: `1px solid ${item.color}40` }}
                >
                  {item.step}
                </div>
                <h3 className="text-white font-semibold text-base mb-2">{item.title}</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed mb-4">{item.body}</p>
                {item.cta && (
                  <a href={item.cta.href} className="text-sm font-medium transition-colors duration-200" style={{ color: item.color }}>
                    {item.cta.label}
                  </a>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Path B — Claude Code terminal */}
        <ScrollReveal className="mb-3">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#22D3EE]/10 border border-[#22D3EE]/20">
              <Icon path={IC.terminal} size={13} />
              <span className="text-xs font-semibold text-[#22D3EE]">Claude Code terminal — no VS Code needed</span>
            </div>
            <div className="flex-1 h-px bg-[#1F2937]" />
          </div>
          {/* What you get + signup clarity */}
          <div className="flex flex-wrap gap-4 mb-4 pl-1">
            <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>
              Context compression via MCP + PreToolUse hook
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>
              Shell output compression — 90+ CLI patterns
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>
              No account required — runs 100% locally
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#4B5563]">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
              Loop detection requires the VS Code extension — not available in terminal-only mode
            </div>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
          <div className="hidden md:block absolute top-[2.75rem] left-[calc(16.66%+1.5rem)] right-[calc(16.66%+1.5rem)] h-px bg-gradient-to-r from-[#1F2937] via-[#22D3EE]/30 to-[#1F2937]" aria-hidden="true" />
          {[
            {
              step: '1',
              color: '#22D3EE',
              title: 'Download the binary',
              body: 'Grab loopguard-ctx for your platform from GitHub Releases, then:',
              code: 'chmod +x loopguard-ctx && mv loopguard-ctx /usr/local/bin/',
              cta: { label: 'GitHub Releases →', href: 'https://github.com/rodthenewcomer/loopguard/releases/latest' },
            },
            {
              step: '2',
              color: '#22D3EE',
              title: 'Wire Claude Code',
              body: 'Registers LoopGuard as an MCP server and installs a PreToolUse hook. No account needed.',
              code: 'loopguard-ctx setup --agent=claude',
            },
            {
              step: '3',
              color: '#22C55E',
              title: 'Restart Claude Code',
              body: 'Close and reopen your terminal. Every file read Claude Code makes is now routed through the context engine automatically.',
              cta: { label: 'Full Claude Code guide →', href: '/setup#claude-code' },
            },
          ].map((item, i) => (
            <ScrollReveal key={item.step} delay={i * 100}>
              <div className="relative p-6 rounded-2xl border border-[#1F2937] bg-[#111827]/60 hover:border-[#374151] transition-all duration-300">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black mb-4 flex-shrink-0"
                  style={{ background: item.color + '20', color: item.color, border: `1px solid ${item.color}40` }}
                >
                  {item.step}
                </div>
                <h3 className="text-white font-semibold text-base mb-2">{item.title}</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed mb-3">{item.body}</p>
                {'code' in item && item.code && (
                  <div className="mb-3 px-3 py-2 bg-[#0d1117] border border-[#1F2937] rounded-lg">
                    <code className="text-[#22D3EE] text-xs font-mono">{item.code}</code>
                  </div>
                )}
                {'cta' in item && item.cta && (
                  <a href={item.cta.href} className="text-sm font-medium transition-colors duration-200" style={{ color: item.color }}>
                    {item.cta.label}
                  </a>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── WHAT LOOPGUARD DOES ──────────────────────────────────── */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-28">
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Two things no other tool does.</h2>
          <p className="text-[#6B7280] text-lg max-w-2xl mx-auto">
            Every other context tool is passive — it compresses when you ask.
            LoopGuard is active. It watches, intercepts, and intervenes before the damage is done.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {WHAT_WE_DO.map((item, i) => (
            <ScrollReveal key={item.n} delay={i * 120}>
              <div
                className="h-full p-8 rounded-2xl border bg-[#111827]/40 hover:bg-[#111827]/70 transition-all duration-300 group"
                style={{ borderColor: item.color + '33' }}
              >
                <div
                  className="text-5xl font-black mb-5 leading-none transition-colors duration-300"
                  style={{ color: item.color + '22' }}
                >
                  {item.n}
                </div>
                <div
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4"
                  style={{ background: item.color + '15', color: item.color, border: `1px solid ${item.color}33` }}
                >
                  {item.tag}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">{item.body}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── PAIN ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(239,68,68,0.04) 0%, transparent 60%)' }}
          aria-hidden="true"
        />
        <div className="max-w-6xl mx-auto px-6 py-20">
          <ScrollReveal className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Sound familiar?</h2>
            <p className="text-[#6B7280] text-lg max-w-xl mx-auto">
              Every developer using AI hits these walls. LoopGuard was built to break them.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PAIN_CARDS.map((card, i) => (
              <ScrollReveal key={card.title} delay={i * 100}>
                <div className="h-full p-6 rounded-2xl border border-[#1F2937] bg-[#111827]/60 hover:border-[#374151] transition-all duration-300 group hover:-translate-y-1">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: card.iconColor + '15', color: card.iconColor }}
                  >
                    <Icon path={card.iconPath} size={22} />
                  </div>
                  <h3 className="text-[#F9FAFB] font-semibold text-lg mb-3 leading-tight">{card.title}</h3>
                  <p className="text-[#6B7280] text-sm leading-relaxed">{card.body}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURE 1: LOOP DETECTION ────────────────────────────── */}
      <section id="features" className="relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 0% 50%, rgba(245,158,11,0.06) 0%, transparent 60%)' }}
          aria-hidden="true"
        />
        <div className="max-w-6xl mx-auto px-6 py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: visual */}
            <ScrollReveal direction="left">
              <div className="rounded-2xl border border-[#1F2937] overflow-hidden" style={{ background: '#0d1117' }}>
                <div className="px-4 py-3 bg-[#161b22] border-b border-[#21262d] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#EF4444]/60" />
                    <div className="w-3 h-3 rounded-full bg-[#F59E0B]/60" />
                    <div className="w-3 h-3 rounded-full bg-[#22C55E]/60" />
                  </div>
                  <span className="text-xs text-[#6B7280] font-mono">LoopGuard — Session Timeline</span>
                  <span className="text-xs text-[#F59E0B] font-semibold">● 4 loops</span>
                </div>
                <div className="p-4 space-y-3">
                  {[
                    { time: '14:03', msg: 'Cannot read property "map" of undefined', n: 1, min: 8,  col: '#6B7280' },
                    { time: '14:11', msg: 'Cannot read property "map" of undefined', n: 2, min: 16, col: '#F59E0B' },
                    { time: '14:19', msg: 'Cannot read property "map" of undefined', n: 3, min: 24, col: '#F59E0B' },
                    { time: '14:27', msg: 'Cannot read property "map" of undefined', n: 4, min: 32, col: '#EF4444' },
                  ].map((row) => (
                    <div
                      key={row.n}
                      className="flex items-center gap-3 p-2.5 rounded-lg transition-colors duration-200"
                      style={{ background: row.n === 4 ? 'rgba(239,68,68,0.08)' : 'transparent' }}
                    >
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                        style={{ background: row.col + '22', color: row.col }}
                      >
                        {row.n}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-mono text-[11px] text-[#9CA3AF] truncate">{row.msg}</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-[11px] font-bold" style={{ color: row.col }}>{row.min}min</div>
                        <div className="text-[10px] text-[#4B5563]">{row.time}</div>
                      </div>
                    </div>
                  ))}

                  {/* Alert */}
                  <div className="mt-2 p-3 rounded-xl border border-[#EF4444]/30 bg-[#EF4444]/5 animate-[alert-in_0.4s_cubic-bezier(0.16,1,0.3,1)_forwards]">
                    <div className="flex items-center gap-2 mb-2">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" />
                      </svg>
                      <span className="text-[11px] font-bold text-[#EF4444] uppercase tracking-wide">
                        Loop Detected — 32 minutes wasted
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 py-1.5 bg-[#2563EB] text-white text-[11px] font-semibold rounded-lg">Try New Approach</button>
                      <button className="flex-1 py-1.5 border border-[#374151] text-[#9CA3AF] text-[11px] font-medium rounded-lg">View Details</button>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Right: copy */}
            <ScrollReveal direction="right">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-full text-[#F59E0B] text-xs font-bold uppercase tracking-wider mb-5">
                  <Icon path={IC.loop} size={14} />
                  Loop Detection
                </div>
                <h2 className="text-4xl font-bold text-white leading-tight mb-5">
                  Catch the loop at turn 2.<br/>Not turn 10.
                </h2>
                <p className="text-[#6B7280] text-base leading-relaxed mb-8">
                  Two independent detection methods run in parallel — diagnostic-based and edit-pattern. Either one can trigger. Catches loops even when the error message changes. Works with autonomous agents running in the background, not just manual sessions.
                </p>
                <ul className="space-y-3">
                  {LOOP_FEATURES.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[#9CA3AF] text-sm">
                      <span className="text-[#22C55E] mt-0.5 flex-shrink-0"><Icon path={IC.check} size={16} /></span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── FEATURE 2: CONTEXT ENGINE ────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 100% 50%, rgba(34,211,238,0.07) 0%, transparent 60%)' }}
          aria-hidden="true"
        />
        <div className="max-w-6xl mx-auto px-6 py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: copy */}
            <ScrollReveal direction="left">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#22D3EE]/10 border border-[#22D3EE]/30 rounded-full text-[#22D3EE] text-xs font-bold uppercase tracking-wider mb-5">
                  <Icon path={IC.context} size={14} />
                  Context Engine
                </div>
                <h2 className="text-4xl font-bold text-white leading-tight mb-5">
                  Your AI reads the file.<br/>It gets 7% of it.
                </h2>
                <p className="text-[#6B7280] text-base leading-relaxed mb-8">
                  The Rust helper can parse structure, score lines for information density, and produce smaller focused reads for clipboard or MCP workflows. What remains: the signatures and nearby context your AI needs, without making every request drag along the whole file.
                </p>
                <ul className="space-y-3 mb-8">
                  {CTX_FEATURES.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[#9CA3AF] text-sm">
                      <span className="text-[#22D3EE] mt-0.5 flex-shrink-0"><Icon path={IC.check} size={16} /></span>
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap items-center gap-3 text-xs text-[#6B7280]">
                  <span className="px-2 py-1 bg-[#1F2937] rounded-md font-mono">Ctrl+Shift+P</span>
                  <span>→</span>
                  <span className="font-mono text-[#9CA3AF]">LoopGuard: Copy Optimized Context</span>
                </div>
              </div>
            </ScrollReveal>

            {/* Right: animated token counter */}
            <ScrollReveal direction="right">
              <TokenCounter />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── PLATFORM SUPPORT ─────────────────────────────────────── */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-[#0d1219]/50" aria-hidden="true" />
        <div className="relative max-w-6xl mx-auto px-6">
          <ScrollReveal className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Works everywhere you code.</h2>
            <p className="text-[#6B7280] max-w-xl mx-auto">
              One extension. One binary. Every major platform and IDE — same experience across all of them.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {PLATFORMS.map((p, i) => (
              <ScrollReveal key={p.name} delay={i * 80}>
                <div className="p-5 rounded-2xl border border-[#1F2937] bg-[#111827]/60 flex items-center gap-4 hover:border-[#374151] transition-colors duration-200 group">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                    style={{ background: p.color + '15', color: p.color }}
                  >
                    <Icon path={p.icon} size={24} />
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">{p.name}</div>
                    <div className="text-[#4B5563] text-xs mt-0.5">Full support · x64 + ARM</div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <div className="rounded-2xl border border-[#1F2937] bg-[#111827]/40 p-6">
              <div className="text-xs text-[#4B5563] uppercase tracking-widest text-center mb-4">Tested with</div>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {IDES.map((ide) => (
                  <span
                    key={ide}
                    className="px-4 py-2 border border-[#1F2937] rounded-full text-[#6B7280] text-sm font-medium hover:border-[#374151] hover:text-[#9CA3AF] transition-colors"
                  >
                    {ide}
                  </span>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── INTEGRATIONS ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-28">
        <div className="absolute inset-0 bg-[#0d1219]/40" aria-hidden="true" />
        <div className="relative max-w-6xl mx-auto px-6">
          <ScrollReveal className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">One layer. Three surfaces.</h2>
            <p className="text-[#6B7280] text-lg max-w-xl mx-auto">
              In your IDE, inside your AI agent, or at the terminal — LoopGuard intercepts context at every point where noise enters your AI workflow.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {INTEGRATIONS.map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 100}>
                <div className="h-full p-6 rounded-2xl border border-[#1F2937] bg-[#111827]/60 hover:border-[#374151] transition-all duration-300 group hover:-translate-y-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#1F2937] flex items-center justify-center text-[#2563EB] group-hover:bg-[#2563EB]/10 transition-colors">
                      <Icon path={item.icon} />
                    </div>
                    <span
                      className="text-[11px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full"
                      style={{
                        background: item.badgeColor + '22',
                        color: item.badgeColor,
                        border: `1px solid ${item.badgeColor}44`,
                      }}
                    >
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="text-[#F9FAFB] font-semibold text-lg mb-1">{item.title}</h3>
                  <div className="text-xs text-[#6B7280] mb-3">{item.sub}</div>
                  <p className="text-[#6B7280] text-sm leading-relaxed">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#1F2937] rounded-2xl overflow-hidden">
          {STATS.map((s, i) => (
            <ScrollReveal key={s.label} delay={i * 80}>
              <div className="bg-[#0B1220] p-8 text-center h-full hover:bg-[#111827]/80 transition-colors duration-200">
                <div className="text-4xl font-black tabular-nums mb-2" style={{ color: s.color }}>
                  {s.value}
                </div>
                <div className="text-xs text-[#6B7280] leading-snug">{s.label}</div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── THE LOOP TAX ─────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <ScrollReveal className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">The loop tax is real.</h2>
          <p className="text-[#6B7280] text-lg max-w-2xl mx-auto">
            Every stuck AI turn costs money. Loops aren&rsquo;t just frustrating — they have a line item.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left: cost math */}
          <ScrollReveal direction="left">
            <div
              className="rounded-2xl border border-[#1F2937] p-7"
              style={{ background: 'linear-gradient(145deg, #111827, #0f172a)' }}
            >
              <div className="text-xs text-[#4B5563] uppercase tracking-widest mb-5">A typical stuck session</div>
              <div className="space-y-4">
                {[
                  { label: 'Same error. 8 AI turns. Each turn: ~2,000 tokens context.', tokens: '16,000 tokens', cost: '$0.48', color: '#EF4444' },
                  { label: 'LoopGuard catches at turn 2. 2 turns × 140 tokens context.', tokens: '280 tokens', cost: '$0.01', color: '#22C55E' },
                ].map((row) => (
                  <div key={row.label} className="p-4 rounded-xl border border-[#1F2937] bg-[#0d1117]">
                    <p className="text-[#6B7280] text-xs leading-relaxed mb-2">{row.label}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-[#4B5563]">{row.tokens}</span>
                      <span className="font-black text-lg tabular-nums" style={{ color: row.color }}>{row.cost}</span>
                    </div>
                  </div>
                ))}
                <div className="pt-3 border-t border-[#1F2937] flex items-center justify-between">
                  <span className="text-sm text-[#9CA3AF] font-medium">Saved on one loop</span>
                  <span className="text-[#22C55E] font-black text-2xl">$0.47</span>
                </div>
                <p className="text-xs text-[#4B5563] leading-relaxed">
                  5 loops/day × 22 working days = 110 loops/month.<br/>
                  110 × $0.47 = <strong className="text-[#22C55E]">$51.70 saved per month</strong> — just on loop turns.<br/>
                  Add context reduction on every other request: <strong className="text-[#22C55E]">~$77/month total.</strong>
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Right: agent era angle */}
          <ScrollReveal direction="right">
            <div className="space-y-4">
              <div
                className="p-6 rounded-2xl border border-[#F59E0B]/25 bg-[#F59E0B]/5"
              >
                <div className="text-xs font-bold text-[#F59E0B] uppercase tracking-wide mb-2">The agent problem</div>
                <p className="text-[#9CA3AF] text-sm leading-relaxed">
                  When you loop, you notice. When <strong className="text-white">Claude Code, Cursor, or Codex workflows</strong> keep revisiting the same problem, token spend can climb quietly in the background. LoopGuard is designed to surface that waste and give you a smaller, more relevant next step.
                </p>
              </div>

              <div
                className="p-6 rounded-2xl border border-[#22D3EE]/25 bg-[#22D3EE]/5"
              >
                <div className="text-xs font-bold text-[#22D3EE] uppercase tracking-wide mb-2">Session memory</div>
                <p className="text-[#9CA3AF] text-sm leading-relaxed">
                  Your agent read <code className="text-[#22D3EE] text-xs bg-[#0d1117] px-1 rounded">auth.ts</code> three times this session? The fourth read costs <strong className="text-white">13 tokens</strong> — not 2,400. LoopGuard caches every file read and serves delta-only updates. Files your AI already knows don&rsquo;t get resent.
                </p>
              </div>

              <div
                className="p-6 rounded-2xl border border-[#22C55E]/25 bg-[#22C55E]/5"
              >
                <div className="text-xs font-bold text-[#22C55E] uppercase tracking-wide mb-2">Relevance, not compression</div>
                <p className="text-[#9CA3AF] text-sm leading-relaxed">
                  Every other tool tries to make context smaller. LoopGuard decides <strong className="text-white">what context should exist at all</strong>. The 200-line helper your AI keeps re-reading but never uses? It never gets sent again.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── ALL FEATURES FREE ─────────────────────────────────────── */}
      <section id="pricing" className="max-w-5xl mx-auto px-6 py-28">
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Everything free. No catch.</h2>
          <p className="text-[#6B7280] text-lg">All features — loop detection, Rust engine, MCP, shell hooks — free forever. Just sign up.</p>
        </ScrollReveal>

        <ScrollReveal>
          <div className="max-w-3xl mx-auto p-8 rounded-2xl border border-[#22C55E]/25 bg-[#22C55E]/5">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-xs text-[#22C55E] uppercase tracking-widest font-bold mb-1">Free forever</div>
                <div className="text-5xl font-black text-white">$0</div>
                <div className="text-sm text-[#6B7280] mt-1">No credit card · No trial period · No limits</div>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#22C55E]/10 border border-[#22C55E]/25 rounded-full">
                <div className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
                <span className="text-sm text-[#22C55E] font-semibold">All features included</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {ALL_FEATURES.map((f) => (
                <div key={f} className="flex items-start gap-2.5 text-sm text-[#9CA3AF]">
                  <span className="text-[#22C55E] mt-0.5 flex-shrink-0"><Icon path={IC.check} size={16} /></span>
                  {f}
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/signup"
                className="flex-1 block text-center py-3.5 bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-bold rounded-xl transition-all duration-200 text-sm glow-primary shadow-lg shadow-blue-900/40"
              >
                Create free account →
              </Link>
              <a
                href="/setup"
                className="flex-1 block text-center py-3.5 border border-[#374151] hover:border-[#4B5563] text-[#9CA3AF] hover:text-white font-semibold rounded-xl transition-all duration-200 text-sm"
              >
                Install extension
              </a>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-28">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(37,99,235,0.2) 0%, rgba(34,211,238,0.08) 40%, transparent 70%)' }}
          aria-hidden="true"
        />
        <div className="relative max-w-2xl mx-auto px-6 text-center">
          <ScrollReveal>
            <h2 className="text-5xl font-black text-white leading-tight mb-5">
              Stop losing hours.
              <br />
              <span className="gradient-text">Start right now.</span>
            </h2>
            <p className="text-[#6B7280] text-lg leading-relaxed mb-10">
              60 seconds to install on Windows, macOS or Linux. The next time you hit a loop,
              LoopGuard catches it — and tells you exactly how much time you just saved.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/setup"
                className="flex items-center gap-2 px-8 py-4 bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-bold rounded-xl text-lg transition-all duration-200 shadow-2xl shadow-blue-900/50 glow-primary"
              >
                <Icon path={IC.zap} />
                Install Extension
              </a>
              <Link
                href="/signup"
                className="flex items-center gap-2 px-8 py-4 border border-[#374151] hover:border-[#4B5563] text-[#D1D5DB] hover:text-white font-semibold rounded-xl text-lg transition-all duration-200"
              >
                Create free account
                <Icon path={IC.arrow} />
              </Link>
            </div>
            <p className="text-xs text-[#4B5563] mt-6">
              Free forever · No credit card · Windows · macOS · Linux · Your code never leaves your machine
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────── */}
      <footer className="border-t border-[#1F2937]">
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <img src="/icon-192x192.png" alt="LoopGuard" width={30} height={30} className="rounded-lg" />
                <span className="font-bold text-white text-lg">LoopGuard</span>
              </div>
              <p className="text-[#4B5563] text-sm leading-relaxed max-w-xs mb-6">
                Stop AI loops. Use smaller, more relevant context. Built for developers on Windows, macOS and Linux who use AI every day.
              </p>
              {/* Social icons */}
              <div className="flex items-center gap-3">
                <a
                  href="https://github.com/rodthenewcomer/loopguard"
                  className="w-8 h-8 rounded-lg border border-[#1F2937] flex items-center justify-center text-[#4B5563] hover:text-[#9CA3AF] hover:border-[#374151] transition-colors"
                  aria-label="GitHub"
                >
                  <Icon path={IC.github} size={16} />
                </a>
                <a
                  href="https://twitter.com"
                  className="w-8 h-8 rounded-lg border border-[#1F2937] flex items-center justify-center text-[#4B5563] hover:text-[#9CA3AF] hover:border-[#374151] transition-colors"
                  aria-label="Twitter / X"
                >
                  <Icon path={IC.twitter} size={16} />
                </a>
                <a
                  href="mailto:support@loopguard.dev"
                  className="w-8 h-8 rounded-lg border border-[#1F2937] flex items-center justify-center text-[#4B5563] hover:text-[#9CA3AF] hover:border-[#374151] transition-colors"
                  aria-label="Email"
                >
                  <Icon path={IC.mail} size={16} />
                </a>
              </div>
            </div>

            {/* Link columns */}
            {FOOTER_COLS.map((col) => (
              <div key={col.heading}>
                <div className="text-xs text-[#4B5563] uppercase tracking-widest mb-4 font-semibold">
                  {col.heading}
                </div>
                <div className="space-y-2.5">
                  {col.links.map((l) => (
                    <a
                      key={l.label}
                      href={l.href}
                      className="block text-sm text-[#6B7280] hover:text-[#9CA3AF] transition-colors"
                    >
                      {l.label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-[#1F2937] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-4 text-xs text-[#4B5563]">
              <span>© 2026 LoopGuard · MIT License</span>
              <span className="hidden sm:block w-px h-3 bg-[#1F2937]" />
              <span>Windows · macOS · Linux</span>
            </div>
            <p className="text-xs text-[#4B5563]">
              Your code never leaves your machine ·{' '}
              <Link href="/docs" className="text-[#6B7280] hover:text-[#9CA3AF] transition-colors underline underline-offset-2">
                Privacy Architecture
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
