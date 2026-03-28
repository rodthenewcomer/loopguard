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
    title: 'Watches for loops',
    body: 'Every time the same error reappears — in diagnostics or your edit history — LoopGuard increments a counter. At a threshold, it fires an alert with the exact time lost.',
    tag: 'Loop Detection',
  },
  {
    n: '02',
    color: '#22D3EE',
    title: 'Strips the noise before it reaches AI',
    body: 'Instead of pasting full files, LoopGuard extracts AST function signatures, high-entropy lines, and the exact error context. The AI sees 7% of the file — the 7% that matters.',
    tag: 'Context Engine',
  },
];

/* ── Platform grid ──────────────────────────────────────────────── */
const PLATFORMS = [
  { name: 'Windows 10 / 11', icon: IC.windows, color: '#0078D4' },
  { name: 'macOS 12+',       icon: IC.apple,   color: '#A0A0A0' },
  { name: 'Linux',           icon: IC.linux,   color: '#FCC624' },
];

const IDES = [
  'VS Code', 'Cursor', 'Windsurf', 'Claude Code (terminal)', 'GitHub Copilot',
];

/* ── Loop detection features ────────────────────────────────────── */
const LOOP_FEATURES = [
  'Watches VS Code diagnostics in real time — all languages',
  'Detects edit-pattern loops even when error message changes',
  'Fires alert with exact minutes wasted — not an estimate',
  'Works on Windows, macOS and Linux — same binary',
  'Session dashboard: all loops, all time, all token spend',
];

/* ── Context engine features ────────────────────────────────────── */
const CTX_FEATURES = [
  'Rust engine: 89–99% token reduction per clipboard copy',
  'AST signatures — function stubs, not full bodies',
  'Shannon entropy scoring — high-value lines only',
  'Myers delta — re-reads cost ~13 tokens, not thousands',
  'TypeScript fallback — works even without the Rust binary',
  '14 languages: TS, Python, Rust, Go, Java, C++, and more',
];

/* ── Integrations ───────────────────────────────────────────────── */
const INTEGRATIONS = [
  {
    icon: IC.code,
    title: 'VS Code / Cursor / Windsurf',
    sub: 'Extension — Windows · macOS · Linux',
    desc: 'Loop detection + context engine (~80% token reduction) built in. One click from the Marketplace. Copy Optimized Context sends only the lines that matter to your AI.',
    badge: 'Free',
    badgeColor: '#22C55E',
  },
  {
    icon: IC.mcp,
    title: 'MCP Server',
    sub: 'Claude Code · Cursor · Windsurf · Copilot',
    desc: '21 context tools wired into your AI agent. Run once: LoopGuard: Configure MCP Server. Works from the terminal too — no VS Code required.',
    badge: 'Pro',
    badgeColor: '#2563EB',
  },
  {
    icon: IC.terminal,
    title: 'Shell Hooks',
    sub: 'bash · zsh · fish — all platforms',
    desc: 'npm install, git log, docker build — compressed 60–90% before they ever reach your AI context window. One command to install.',
    badge: 'Pro',
    badgeColor: '#2563EB',
  },
];

/* ── Stats ──────────────────────────────────────────────────────── */
const STATS = [
  { value: '93%',   label: 'Token reduction per context copy',          color: '#22D3EE' },
  { value: '~$77',  label: 'Avg saved/month (10 sessions/day)',          color: '#22C55E' },
  { value: '47min', label: 'Avg time saved per day from loop detection', color: '#F59E0B' },
  { value: '8.6×',  label: 'ROI on Pro at $9/mo',                       color: '#A78BFA' },
];

/* ── Pricing ────────────────────────────────────────────────────── */
const FREE_FEATURES = [
  'Loop detection — unlimited sessions',
  'Edit-pattern loop detection',
  'Alert notifications with time wasted',
  'Context Engine — TypeScript (~80% reduction)',
  'Status bar + session dashboard',
  'Works on Windows, macOS, Linux',
];
const PRO_FEATURES = [
  'Everything in Free',
  'Rust engine (89–99% reduction)',
  'MCP server — 21 AI tools',
  'Shell hooks — CLI output compression',
  '30-day session history',
  'Token savings dashboard',
  'Priority support',
];

/* ── Footer links ───────────────────────────────────────────────── */
const FOOTER_COLS = [
  {
    heading: 'Product',
    links: [
      { label: 'Features',   href: '#features' },
      { label: 'Pricing',    href: '#pricing' },
      { label: 'Changelog',  href: '#' },
      { label: 'Roadmap',    href: '#' },
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
      { label: 'Privacy Policy',  href: '#' },
      { label: 'Terms of Service',href: '#' },
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
              <span className="text-xs text-[#9CA3AF] font-medium">93% token reduction · save ~$77/month on AI costs</span>
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
              LoopGuard is a VS Code extension that does two things:
            </p>
            <div className="space-y-2 mb-8">
              <div className="flex items-start gap-3 text-[#9CA3AF] text-base">
                <span className="text-[#F59E0B] mt-1 flex-shrink-0"><Icon path={IC.alert} size={16} /></span>
                <span><span className="text-white font-medium">Detects AI loops</span> — fires an alert the moment you cycle through the same error, with the exact time wasted.</span>
              </div>
              <div className="flex items-start gap-3 text-[#9CA3AF] text-base">
                <span className="text-[#22D3EE] mt-1 flex-shrink-0"><Icon path={IC.zap} size={16} /></span>
                <span><span className="text-white font-medium">Cuts token noise by 93%</span> — extracts only the relevant code before it reaches your AI, on every request.</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 mb-10">
              <a
                id="install"
                href="https://marketplace.visualstudio.com"
                className="flex items-center gap-2 px-6 py-3 bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-900/40 hover:shadow-blue-900/60 glow-primary"
              >
                <Icon path={IC.zap} />
                Install Free
              </a>
              <a
                href="#how-it-works"
                className="flex items-center gap-2 px-6 py-3 border border-[#1F2937] hover:border-[#374151] text-[#9CA3AF] hover:text-white font-medium rounded-xl transition-all duration-200"
              >
                See how it works
                <Icon path={IC.arrow} />
              </a>
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

      {/* ── WHAT LOOPGUARD DOES ──────────────────────────────────── */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-28">
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Two problems. One extension.</h2>
          <p className="text-[#6B7280] text-lg max-w-2xl mx-auto">
            LoopGuard runs silently in the background on Windows, macOS and Linux.
            No config. No API keys. No changes to your workflow.
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
                  Know you&rsquo;re stuck — before 2 hours disappear.
                </h2>
                <p className="text-[#6B7280] text-base leading-relaxed mb-8">
                  LoopGuard watches both your VS Code diagnostics and your edit patterns independently.
                  Two detection methods — catches every loop type, even when the error message changes.
                  Works identically on Windows, macOS, and Linux.
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
                  Send 7% of the file. Get 100% of the answer.
                </h2>
                <p className="text-[#6B7280] text-base leading-relaxed mb-8">
                  Our Rust engine parses your file&rsquo;s AST, scores each line by Shannon entropy, and extracts
                  only what the AI needs to solve your specific error. The AI gets a sharper signal.
                  You get a smaller bill. Works on every platform without recompiling.
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
            <h2 className="text-4xl font-bold text-white mb-4">Three ways to use it.</h2>
            <p className="text-[#6B7280] text-lg max-w-xl mx-auto">
              Start with the extension. Go deeper with MCP and shell hooks. All three work on Windows, macOS and Linux.
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

      {/* ── PRICING ───────────────────────────────────────────────── */}
      <section id="pricing" className="max-w-5xl mx-auto px-6 py-28">
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Simple pricing.</h2>
          <p className="text-[#6B7280] text-lg">Start free. Upgrade when the ROI is obvious — and it will be.</p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Free */}
          <ScrollReveal delay={0}>
            <div className="h-full p-7 rounded-2xl border border-[#1F2937] bg-[#111827]/60">
              <div className="mb-6">
                <div className="text-xs text-[#6B7280] uppercase tracking-widest mb-2">Free</div>
                <div className="text-5xl font-black text-white">$0</div>
                <div className="text-sm text-[#6B7280] mt-1">Forever</div>
              </div>
              <ul className="space-y-3 mb-8">
                {FREE_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-[#9CA3AF]">
                    <span className="text-[#22C55E] mt-0.5 flex-shrink-0"><Icon path={IC.check} size={16} /></span>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="#install"
                className="block text-center py-3 border border-[#374151] hover:border-[#4B5563] text-[#9CA3AF] hover:text-white font-semibold rounded-xl transition-all duration-200 text-sm"
              >
                Get Started Free
              </a>
            </div>
          </ScrollReveal>

          {/* Pro */}
          <ScrollReveal delay={100}>
            <div className="card-pro h-full p-7 rounded-2xl">
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-[#22D3EE] uppercase tracking-widest font-bold">Pro</div>
                  <span className="text-xs bg-[#2563EB]/20 text-[#22D3EE] border border-[#2563EB]/30 px-2.5 py-0.5 rounded-full font-semibold">
                    Most popular
                  </span>
                </div>
                <div className="text-5xl font-black text-white mt-2">$9</div>
                <div className="text-sm text-[#6B7280] mt-1">per month · cancel anytime</div>
                <div className="mt-2 text-xs text-[#22C55E] font-medium">
                  Pays for itself after 26 context copies. Average user saves ~$77/month.
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {PRO_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-[#C9D1D9]">
                    <span className="text-[#22D3EE] mt-0.5 flex-shrink-0"><Icon path={IC.check} size={16} /></span>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="#install"
                className="block text-center py-3 bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-bold rounded-xl transition-all duration-200 text-sm glow-primary shadow-lg shadow-blue-900/40"
              >
                Start Pro — $9/month
              </a>
            </div>
          </ScrollReveal>
        </div>
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
                href="https://marketplace.visualstudio.com"
                className="flex items-center gap-2 px-8 py-4 bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-bold rounded-xl text-lg transition-all duration-200 shadow-2xl shadow-blue-900/50 glow-primary"
              >
                <Icon path={IC.zap} />
                Install Free
              </a>
              <Link href="/dashboard" className="text-sm text-[#6B7280] hover:text-[#9CA3AF] transition-colors">
                View dashboard demo →
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
                <svg width="30" height="30" viewBox="0 0 34 34" fill="none" aria-hidden="true">
                  <path d="M17 2L3 8v10c0 8.3 5.8 15.8 14 17.7C25.2 33.8 31 26.3 31 18V8L17 2z" fill="url(#fg)" />
                  <defs>
                    <linearGradient id="fg" x1="3" y1="2" x2="31" y2="35" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#22D3EE" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="font-bold text-white text-lg">LoopGuard</span>
              </div>
              <p className="text-[#4B5563] text-sm leading-relaxed max-w-xs mb-6">
                Stop AI loops. Cut token spend by 93%. Built for developers on Windows, macOS and Linux who use AI every day.
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
