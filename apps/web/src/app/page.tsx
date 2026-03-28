import Link from 'next/link';
import Navbar from '../components/Navbar';
import HeroMockup from '../components/HeroMockup';
import TokenCounter from '../components/TokenCounter';
import ScrollReveal from '../components/ScrollReveal';

/* ── Icon helpers ───────────────────────────────────── */
function Icon({ path }: { path: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

const ICONS = {
  loop: 'M17 1l4 4-4 4M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 01-4 4H3',
  context: 'M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2v-4M9 21H5a2 2 0 01-2-2v-4m0 0h18',
  mcp: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  check: 'M20 6L9 17l-5-5',
  zap: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  clock: 'M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10zm0-10V7',
  token: 'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 6v4l3 3',
  code: 'M16 18l6-6-6-6M8 6l-6 6 6 6',
  terminal: 'M4 17l6-6-6-6M12 19h8',
  plug: 'M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z',
  arrow: 'M5 12h14M12 5l7 7-7 7',
  star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
};

/* ── Section: Pain ──────────────────────────────────── */
const PAIN_CARDS = [
  {
    emoji: '😤',
    title: 'Same error. Different variable name.',
    body: 'AI gives you the fix you tried 20 minutes ago — but renamed. You don\'t even notice until you\'re 3 attempts in.',
  },
  {
    emoji: '💸',
    title: 'You pasted 800 lines for a 3-line bug.',
    body: 'The AI gets your entire codebase every time. It wastes tokens on code it doesn\'t need — and gives you worse answers because of the noise.',
  },
  {
    emoji: '🕐',
    title: 'It\'s been 2 hours. You lost count.',
    body: 'You don\'t realize you\'ve been on the same bug for two hours until you check the clock. There was no warning. There was no circuit breaker.',
  },
];

/* ── Section: Features ──────────────────────────────── */
const LOOP_DETECTION_FEATURES = [
  'Watches VS Code diagnostics in real time',
  'Detects edit-pattern loops (same region, no progress)',
  'Fires alert with exact time wasted — not an estimate',
  'Actions: try new approach, view details, ignore',
  'Session dashboard: all loops, all time, token spend',
  'Works with TypeScript, Python, Rust, Go, Java + more',
];

const CONTEXT_ENGINE_FEATURES = [
  'Rust engine: 89–99% token reduction per request',
  'AST signatures — function stubs, not full bodies',
  'Shannon entropy — keeps high-value lines, drops noise',
  'Myers delta — re-reads cost ~13 tokens, not thousands',
  'TypeScript fallback — always works, even without binary',
  '14 languages supported out of the box',
];

/* ── Section: Integrations ──────────────────────────── */
const INTEGRATIONS = [
  {
    icon: ICONS.code,
    title: 'VS Code Extension',
    sub: 'Zero config. Activates on install.',
    desc: 'Loop detection, status bar, clipboard context copy. Works the moment you install — no setup, no config.',
    badge: 'Free',
    badgeColor: '#22C55E',
  },
  {
    icon: ICONS.mcp,
    title: 'MCP Server',
    sub: 'Cursor · Claude Code · Windsurf',
    desc: '21 context tools wired directly into your AI tool. Run once: LoopGuard: Configure MCP Server.',
    badge: 'Pro',
    badgeColor: '#2563EB',
  },
  {
    icon: ICONS.terminal,
    title: 'Shell Hooks',
    sub: 'Compresses CLI output before AI sees it',
    desc: 'npm install, git log, docker build — all compressed 60–90% before they ever reach your AI context window.',
    badge: 'Pro',
    badgeColor: '#2563EB',
  },
];

/* ── Section: Stats ─────────────────────────────────── */
const STATS = [
  { value: '93%', label: 'Average token reduction', color: '#22D3EE' },
  { value: '47min', label: 'Average time saved per day', color: '#F59E0B' },
  { value: '2-in-1', label: 'Loop detection + context engine', color: '#A78BFA' },
  { value: '$0', label: 'Cost to start — free tier', color: '#22C55E' },
];

/* ── Section: Pricing ───────────────────────────────── */
const FREE_FEATURES = [
  'Loop detection — unlimited',
  'Session time tracking',
  'Alert notifications',
  'Context Engine (TypeScript, ~80% reduction)',
  'Status bar + dashboard',
];
const PRO_FEATURES = [
  'Everything in Free',
  'Rust engine (89–99% reduction)',
  'MCP server integration',
  'Shell hooks — CLI compression',
  'Session history — 30 days',
  'Token savings dashboard',
  'Smart suggestions (coming soon)',
];

/* ── How it works steps ─────────────────────────────── */
const STEPS = [
  {
    n: '01',
    title: 'Install the extension',
    body: 'One click from the VS Code Marketplace. Zero configuration. LoopGuard activates automatically on workspace open.',
    icon: ICONS.zap,
  },
  {
    n: '02',
    title: 'Code normally',
    body: 'Work with Cursor, Copilot, Claude Code, or any AI tool. LoopGuard watches silently — no changes to your workflow.',
    icon: ICONS.code,
  },
  {
    n: '03',
    title: 'Get alerted before it costs you',
    body: 'When a loop is detected, you see exactly how many times you\'ve hit the same error and how many minutes you\'ve lost. Break the cycle.',
    icon: ICONS.shield,
  },
];

/* ── Component ──────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />

      {/* ── HERO ──────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-grid opacity-40" aria-hidden="true" />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 0%, rgba(37,99,235,0.18) 0%, rgba(34,211,238,0.08) 40%, transparent 70%)',
          }}
          aria-hidden="true"
        />

        <div className="relative max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
          {/* Left — copy */}
          <div className="max-w-lg">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#1F2937] shimmer-badge mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
              <span className="text-xs text-[#9CA3AF] font-medium">Now with Rust-powered 93% token reduction</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl font-bold leading-[1.1] tracking-tight mb-6">
              <span className="text-white">You&rsquo;re stuck.</span>
              <br />
              <span className="gradient-text">Your AI</span>
              <br />
              <span className="text-white">doesn&rsquo;t know it.</span>
            </h1>

            {/* Sub-copy */}
            <p className="text-[#9CA3AF] text-lg leading-relaxed mb-8">
              LoopGuard watches every session in real time. The moment you cycle through the same
              error — it knows. Alerts you. Then cuts what you send to AI by{' '}
              <span className="text-[#22D3EE] font-semibold">93%</span>.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 mb-10">
              <a
                id="install"
                href="https://marketplace.visualstudio.com"
                className="flex items-center gap-2 px-6 py-3 bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-900/40 hover:shadow-blue-900/60 glow-primary"
              >
                <Icon path={ICONS.zap} />
                Install Free
              </a>
              <a
                href="#how-it-works"
                className="flex items-center gap-2 px-6 py-3 border border-[#1F2937] hover:border-[#374151] text-[#9CA3AF] hover:text-white font-medium rounded-xl transition-all duration-200"
              >
                See how it works
                <Icon path={ICONS.arrow} />
              </a>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap items-center gap-5 text-sm text-[#6B7280]">
              <span className="flex items-center gap-1.5">
                <Icon path={ICONS.shield} />
                Your code never leaves your machine
              </span>
              <span className="flex items-center gap-1.5">
                <Icon path={ICONS.check} />
                VS Code &amp; Cursor
              </span>
              <span className="flex items-center gap-1.5">
                <Icon path={ICONS.star} />
                Free tier — no credit card
              </span>
            </div>
          </div>

          {/* Right — animated mockup */}
          <div className="flex justify-center lg:justify-end">
            <HeroMockup />
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ─────────────────────────────────── */}
      <div className="border-y border-[#1F2937] bg-[#0d1219]/60">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-wrap items-center justify-center gap-6 text-sm text-[#4B5563]">
          <span className="text-xs uppercase tracking-widest">Works with</span>
          {['VS Code', 'Cursor', 'Claude Code', 'Windsurf', 'GitHub Copilot'].map((name) => (
            <span
              key={name}
              className="px-3 py-1 border border-[#1F2937] rounded-full text-[#6B7280] text-xs font-medium hover:border-[#374151] hover:text-[#9CA3AF] transition-colors cursor-default"
            >
              {name}
            </span>
          ))}
        </div>
      </div>

      {/* ── PAIN ──────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-28">
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Sound familiar?</h2>
          <p className="text-[#6B7280] text-lg max-w-xl mx-auto">
            Every developer using AI tools hits these walls. LoopGuard was built to break them.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PAIN_CARDS.map((card, i) => (
            <ScrollReveal key={card.title} delay={i * 100}>
              <div className="h-full p-6 rounded-2xl border border-[#1F2937] bg-[#111827]/60 hover:border-[#374151] transition-colors duration-300 group">
                <div className="text-3xl mb-4">{card.emoji}</div>
                <h3 className="text-[#F9FAFB] font-semibold text-lg mb-3 leading-tight">
                  {card.title}
                </h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">{card.body}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── FEATURE 1: LOOP DETECTION ─────────────────── */}
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
              <div className="relative">
                {/* Loop timeline mockup */}
                <div className="rounded-2xl border border-[#1F2937] overflow-hidden" style={{ background: '#0d1117' }}>
                  <div className="px-4 py-3 bg-[#161b22] border-b border-[#21262d] flex items-center justify-between">
                    <span className="text-sm text-[#C9D1D9] font-medium">Loop Timeline</span>
                    <span className="text-xs text-[#F59E0B]">● 4 loops this session</span>
                  </div>
                  <div className="p-4 space-y-3">
                    {[
                      { time: '14:03', msg: 'Cannot read property "map"', n: 1, min: 8, col: '#6B7280' },
                      { time: '14:11', msg: 'Cannot read property "map"', n: 2, min: 16, col: '#F59E0B' },
                      { time: '14:19', msg: 'Cannot read property "map"', n: 3, min: 24, col: '#F59E0B' },
                      { time: '14:27', msg: 'Cannot read property "map"', n: 4, min: 32, col: '#EF4444' },
                    ].map((row) => (
                      <div
                        key={row.n}
                        className="flex items-center gap-3 p-2.5 rounded-lg"
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
                          <div className="text-[11px] font-bold" style={{ color: row.col }}>
                            {row.min}min
                          </div>
                          <div className="text-[10px] text-[#4B5563]">{row.time}</div>
                        </div>
                      </div>
                    ))}
                    <div className="mt-2 p-3 rounded-xl border border-[#EF4444]/30 bg-[#EF4444]/5">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[#EF4444] text-sm">⚠</span>
                        <span className="text-[11px] font-bold text-[#EF4444] uppercase tracking-wide">
                          Loop Detected — 32 minutes wasted
                        </span>
                      </div>
                      <button className="w-full py-1.5 bg-[#2563EB] text-white text-[11px] font-semibold rounded-lg">
                        Try New Approach →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Right: copy */}
            <ScrollReveal direction="right">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-full text-[#F59E0B] text-xs font-bold uppercase tracking-wider mb-5">
                  <Icon path={ICONS.loop} />
                  Loop Detection
                </div>
                <h2 className="text-4xl font-bold text-white leading-tight mb-5">
                  Know the moment you&rsquo;re stuck — not 2 hours later.
                </h2>
                <p className="text-[#6B7280] text-base leading-relaxed mb-8">
                  LoopGuard watches both your diagnostics and your edit patterns. Two independent
                  detection methods that catch every type of loop — even when the error message changes.
                </p>
                <ul className="space-y-3">
                  {LOOP_DETECTION_FEATURES.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[#9CA3AF] text-sm">
                      <span className="text-[#22C55E] mt-0.5 flex-shrink-0">
                        <Icon path={ICONS.check} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── FEATURE 2: CONTEXT ENGINE ─────────────────── */}
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
                  <Icon path={ICONS.context} />
                  Context Engine
                </div>
                <h2 className="text-4xl font-bold text-white leading-tight mb-5">
                  Stop sending noise. Send only what matters.
                </h2>
                <p className="text-[#6B7280] text-base leading-relaxed mb-8">
                  Our Rust-powered engine extracts AST signatures, high-entropy lines, and error context
                  from your files — and strips everything else. The AI gets a sharper signal. You get a lower bill.
                </p>
                <ul className="space-y-3 mb-8">
                  {CONTEXT_ENGINE_FEATURES.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[#9CA3AF] text-sm">
                      <span className="text-[#22D3EE] mt-0.5 flex-shrink-0">
                        <Icon path={ICONS.check} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                  <span className="px-2 py-1 bg-[#1F2937] rounded-md font-mono">Ctrl+Shift+P</span>
                  <span>→ LoopGuard: Copy Optimized Context</span>
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

      {/* ── HOW IT WORKS ──────────────────────────────── */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-28">
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Up in 60 seconds.</h2>
          <p className="text-[#6B7280] text-lg max-w-xl mx-auto">
            No configuration. No API keys. No workflow changes.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector line */}
          <div
            className="hidden md:block absolute top-8 left-1/3 right-1/3 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, #1F2937, transparent)' }}
            aria-hidden="true"
          />

          {STEPS.map((step, i) => (
            <ScrollReveal key={step.n} delay={i * 120}>
              <div className="relative text-center p-6 rounded-2xl border border-[#1F2937] bg-[#111827]/40 hover:border-[#374151] transition-colors duration-300 group">
                {/* Step number */}
                <div className="text-4xl font-black text-[#1F2937] group-hover:text-[#374151] transition-colors mb-4 leading-none">
                  {step.n}
                </div>
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#2563EB]/10 border border-[#2563EB]/20 text-[#2563EB] mb-4">
                  <Icon path={step.icon} />
                </div>
                <h3 className="text-white font-semibold text-lg mb-3">{step.title}</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">{step.body}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── INTEGRATIONS ──────────────────────────────── */}
      <section className="relative overflow-hidden py-28">
        <div className="absolute inset-0 bg-[#0d1219]/40" aria-hidden="true" />
        <div className="relative max-w-6xl mx-auto px-6">
          <ScrollReveal className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Three ways to use it.</h2>
            <p className="text-[#6B7280] text-lg max-w-xl mx-auto">
              Start with the extension. Go deeper with MCP and shell hooks.
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

      {/* ── STATS ─────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#1F2937] rounded-2xl overflow-hidden">
          {STATS.map((s, i) => (
            <ScrollReveal key={s.label} delay={i * 80}>
              <div className="bg-[#0B1220] p-8 text-center h-full">
                <div
                  className="text-4xl font-black tabular-nums mb-2"
                  style={{ color: s.color }}
                >
                  {s.value}
                </div>
                <div className="text-xs text-[#6B7280] leading-snug">{s.label}</div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────────── */}
      <section id="pricing" className="max-w-5xl mx-auto px-6 py-28">
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Simple pricing.</h2>
          <p className="text-[#6B7280] text-lg">
            Start free. Upgrade when the ROI is obvious — and it will be.
          </p>
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
                    <span className="text-[#22C55E] mt-0.5 flex-shrink-0">
                      <Icon path={ICONS.check} />
                    </span>
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
                <div className="text-sm text-[#6B7280] mt-1">per month</div>
              </div>
              <ul className="space-y-3 mb-8">
                {PRO_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-[#C9D1D9]">
                    <span className="text-[#22D3EE] mt-0.5 flex-shrink-0">
                      <Icon path={ICONS.check} />
                    </span>
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
              <p className="text-center text-xs text-[#4B5563] mt-3">No contracts. Cancel anytime.</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────── */}
      <section className="relative overflow-hidden py-28">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 50% 100%, rgba(37,99,235,0.2) 0%, rgba(34,211,238,0.08) 40%, transparent 70%)',
          }}
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
              It takes 60 seconds to install. The next time you hit a loop,
              LoopGuard will catch it — and tell you exactly how much time you just saved.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#install"
                className="flex items-center gap-2 px-8 py-4 bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-bold rounded-xl text-lg transition-all duration-200 shadow-2xl shadow-blue-900/50 glow-primary"
              >
                <Icon path={ICONS.zap} />
                Install Free — VS Code &amp; Cursor
              </a>
              <Link
                href="/dashboard"
                className="text-sm text-[#6B7280] hover:text-[#9CA3AF] transition-colors"
              >
                View dashboard demo →
              </Link>
            </div>
            <p className="text-xs text-[#4B5563] mt-6">
              Free forever · No credit card · Your code never leaves your machine
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────── */}
      <footer className="border-t border-[#1F2937] bg-[#0d1219]/60">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <svg width="28" height="28" viewBox="0 0 34 34" fill="none" aria-hidden="true">
                  <path d="M17 2L3 8v10c0 8.3 5.8 15.8 14 17.7C25.2 33.8 31 26.3 31 18V8L17 2z" fill="url(#fg)" />
                  <defs>
                    <linearGradient id="fg" x1="3" y1="2" x2="31" y2="35" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#22D3EE" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="font-bold text-white">LoopGuard</span>
              </div>
              <p className="text-[#4B5563] text-sm leading-relaxed max-w-xs">
                Stop AI loops. Cut token spend by 93%. Built for developers who use AI every day.
              </p>
            </div>

            <div>
              <div className="text-xs text-[#4B5563] uppercase tracking-widest mb-4">Product</div>
              <div className="space-y-2.5">
                {['Features', 'Pricing', 'Changelog', 'Roadmap'].map((l) => (
                  <a key={l} href="#" className="block text-sm text-[#6B7280] hover:text-[#9CA3AF] transition-colors">
                    {l}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs text-[#4B5563] uppercase tracking-widest mb-4">Resources</div>
              <div className="space-y-2.5">
                {['Docs', 'GitHub', 'Privacy Policy', 'Terms of Service'].map((l) => (
                  <a key={l} href="#" className="block text-sm text-[#6B7280] hover:text-[#9CA3AF] transition-colors">
                    {l}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-[#1F2937] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#4B5563]">© 2026 LoopGuard. MIT License.</p>
            <p className="text-xs text-[#4B5563]">
              Your code never leaves your machine —{' '}
              <a href="#" className="text-[#6B7280] hover:text-[#9CA3AF] transition-colors underline underline-offset-2">
                Privacy Architecture
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
