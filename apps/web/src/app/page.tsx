import type { Metadata } from 'next';
import Navbar from '../components/Navbar';
import LoopGuardLogo from '../components/LoopGuardLogo';
import ScrollReveal from '../components/ScrollReveal';
import HeroCta from '../components/HeroCta';
import GitHubStars from '../components/GitHubStars';
import { SUPPORT_URL } from '../lib/constants';

export const metadata: Metadata = {
  title: 'LoopGuard — Stop AI retry loops. Cut token spend.',
  description:
    'LoopGuard detects when AI-assisted coding sessions get stuck in repeat-fix loops and filters prompts to only the context that matters. Saves time, tokens, and money. Free VS Code extension.',
  openGraph: {
    title: 'LoopGuard — Stop AI retry loops. Cut token spend.',
    description:
      'Detects repeat-fix loops and shrinks AI prompts before they hit the model. Free VS Code extension. Your code never leaves your machine.',
    type: 'website',
    url: 'https://loopguard.dev',
    siteName: 'LoopGuard',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LoopGuard — Stop AI retry loops. Cut token spend.',
    description:
      'Detects repeat-fix loops and shrinks AI prompts before they hit the model. Free VS Code extension.',
  },
};

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
  alert: 'M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01',
  arrow: 'M5 12h14M12 5l7 7-7 7',
  check: 'M20 6L9 17l-5-5',
  code: 'M16 18l6-6-6-6M8 6l-6 6 6 6',
  coffee: 'M18 8h1a4 4 0 010 8h-1M2 8h16v5a5 5 0 01-5 5H7a5 5 0 01-5-5V8zm2 13h12',
  copy: 'M8 7V4a2 2 0 012-2h9a2 2 0 012 2v9a2 2 0 01-2 2h-3M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h9a2 2 0 002-2v-3M8 7h9a2 2 0 012 2v9',
  github: 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22',
  loop: 'M17 1l4 4-4 4M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 01-4 4H3',
  spark: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  terminal: 'M4 17l6-6-6-6M12 19h8',
  timer: 'M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10zm0-10V7',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
};

const SURFACES = [
  {
    badge: 'Loop Detection',
    title: 'Catch the repeat before it eats the hour',
    copy:
      'LoopGuard watches diagnostics and repeated edits locally. When the same problem keeps resurfacing, it steps in before another half hour disappears into the same bad fix.',
    accent: '#F59E0B',
  },
  {
    badge: 'Context Engine',
    title: 'Shrink the prompt before it hits the bill',
    copy:
      'Instead of pasting a whole file, LoopGuard lifts the error window, the nearby definitions, and the parts that changed. Smaller prompts mean fewer wasted tokens and less money burned on noise.',
    accent: '#22D3EE',
  },
  {
    badge: 'Visibility',
    title: 'See the waste in plain numbers',
    copy:
      'The extension and dashboard make the cost visible: time lost, tokens trimmed, and estimated API spend avoided across real coding sessions.',
    accent: '#22C55E',
  },
];

const METRICS = [
  { value: '$77/mo', label: 'Estimated API spend avoided for heavy AI coding use\u00b9', tone: '#22C55E' },
  { value: '47min', label: 'Average time recovered per day from avoided retry spirals\u00b2', tone: '#F59E0B' },
  { value: '70%+', label: 'Smaller focused prompts in normal use, with some reads going much higher', tone: '#22D3EE' },
  { value: '8.4k', label: 'Tokens saved in one measured focused-read example', tone: '#A78BFA' },
];

const TIMELINE = [
  { time: '14:03', title: 'First repeat', body: 'The same undefined error shows up again after another AI patch.', state: 'quiet' },
  { time: '14:11', title: 'Pattern confirmed', body: 'LoopGuard now sees the same problem resurfacing and tracks the lost time.', state: 'warning' },
  { time: '14:27', title: 'Circuit breaker', body: 'You get a clear alert before the next retry buries the root cause even deeper.', state: 'danger' },
];

const CONTEXT_LINES = [
  { kind: 'dim', text: "import { fetchInvoices } from './billing';" },
  { kind: 'dim', text: "import { formatCurrency } from './format';" },
  { kind: 'focus', text: 'const rows = invoices.map((invoice) => formatCurrency(invoice.total));' },
  { kind: 'focus', text: '               ^ TypeError: cannot read properties of undefined' },
  { kind: 'dim', text: 'function Summary({ invoices }: Props) {' },
  { kind: 'dim', text: '  return <InvoiceTable rows={rows} />;' },
];

// Editors and AI tools you work inside — install methods (Homebrew, npm) are in the setup section
const EDITORS = ['VS Code', 'Cursor', 'Windsurf'];
const AI_TOOLS = ['Codex CLI', 'Claude Code', 'GitHub Copilot'];

const FOOTER_COLS = [
  {
    heading: 'Product',
    links: [
      { label: 'Features', href: '/#features' },
      { label: 'How it works', href: '/#how-it-works' },
      { label: 'Roadmap', href: '/roadmap' },
      { label: 'Dashboard', href: '/dashboard' },
    ],
  },
  {
    heading: 'Docs',
    links: [
      { label: 'Getting started', href: '/docs' },
      { label: 'Setup guide', href: '/setup' },
      { label: 'Privacy', href: '/privacy' },
    ],
  },
  {
    heading: 'Project',
    links: [
      { label: 'GitHub', href: 'https://github.com/rodthenewcomer/loopguard' },
      { label: 'Support', href: SUPPORT_URL },
      { label: 'Contact', href: 'mailto:support@loopguard.dev' },
    ],
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'LoopGuard',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Windows, macOS, Linux',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description:
    'VS Code extension that detects AI retry loops and optimizes prompt context to save time and token spend.',
  url: 'https://loopguard.dev',
};

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#071019]">
      {/* Accessibility: skip to main content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-[#2563EB] focus:px-4 focus:py-2 focus:text-white focus:text-sm focus:font-semibold"
      >
        Skip to main content
      </a>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      <section id="main-content" className="relative overflow-hidden pt-16">
        <div className="absolute inset-0 bg-grid opacity-25 animate-[grid-drift_22s_linear_infinite]" aria-hidden="true" />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 18% 18%, rgba(239,68,68,0.12), transparent 30%), radial-gradient(circle at 80% 12%, rgba(37,99,235,0.18), transparent 34%), radial-gradient(circle at 62% 72%, rgba(34,211,238,0.1), transparent 35%)',
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto grid min-h-[calc(100svh-4rem)] max-w-7xl gap-16 px-6 py-14 lg:grid-cols-[1.02fr_0.98fr] lg:items-end lg:px-10 lg:py-20">
          <div className="flex flex-col justify-center">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-[#9FB0C4] backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-[#22C55E]" />
                Save time and API spend, locally on your machine
              </div>
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#22C55E]/20 bg-[#22C55E]/8 px-3 py-1.5 text-xs font-medium text-[#86EFAC] backdrop-blur">
                <Icon path={IC.shield} size={12} />
                Your code never leaves your machine
              </div>
            </div>

            <div className="max-w-2xl">
              <div className="mb-5 flex items-center gap-3">
                <LoopGuardLogo size={34} />
                <div className="text-sm font-semibold uppercase tracking-[0.36em] text-[#7B95AE]">
                  LoopGuard
                </div>
              </div>
              <p className="mb-4 text-sm font-semibold text-[#C4D4E4]">
                A VS Code extension. Catches AI retry loops. Focuses your prompts. Free.
              </p>
              <h1 className="text-5xl font-black leading-[0.96] tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl">
                Save the hour.
                <br />
                <span className="text-[#8AE8FF]">Cut the token bill.</span>
              </h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-[#9FB0C4] sm:text-lg">
                LoopGuard watches your coding session locally, fires when the same problem
                keeps resurfacing, and trims the next prompt to only the context the model
                actually needs — so each retry costs less and moves faster.
              </p>
            </div>

            <HeroCta />
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <p className="text-xs text-[#5B7A93]">
                Opens VS Code Marketplace · 1-click install · no account needed
              </p>
              <GitHubStars />
            </div>

            <div className="mt-8 grid max-w-2xl gap-3 text-sm text-[#8CA1B8] sm:grid-cols-3">
              <div className="flex items-start gap-2">
                <span className="mt-0.5 text-[#F59E0B]"><Icon path={IC.alert} size={16} /></span>
                Stops retry spirals before they quietly eat another 20 to 40 minutes
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-0.5 text-[#22D3EE]"><Icon path={IC.copy} size={16} /></span>
                Cuts prompt size by 70%+ in normal focused reads, with some measured sessions going much higher
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-0.5 text-[#22C55E]"><Icon path={IC.check} size={16} /></span>
                Makes the payoff visible in minutes saved, tokens saved, and spend avoided
              </div>
            </div>

            <div className="mt-12 overflow-hidden rounded-[28px] border border-white/10 bg-black/20 backdrop-blur">
              <div className="grid gap-px bg-white/8 sm:grid-cols-4">
                {METRICS.map((metric) => (
                  <div key={metric.value} className="bg-[#08121D] px-5 py-5">
                    <div className="text-3xl font-black tracking-[-0.05em]" style={{ color: metric.tone }}>
                      {metric.value}
                    </div>
                    <div className="mt-2 text-xs uppercase tracking-[0.22em] text-[#7B95AE]">
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/8 px-5 py-3">
                <p className="text-[11px] leading-5 text-[#4E6B88]">
                  <sup>1</sup> Based on 2 h/day heavy AI coding at GPT-4o pricing with 70% prompt reduction applied.{' '}
                  <sup>2</sup> Measured across sessions where LoopGuard detected 3+ repeat loops per day.
                </p>
              </div>
            </div>
          </div>

          <ScrollReveal direction="right">
            <div className="relative">
              <div className="absolute inset-x-10 top-10 h-56 rounded-full bg-[#2563EB]/20 blur-3xl" aria-hidden="true" />
              <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[linear-gradient(160deg,rgba(11,22,36,0.96),rgba(7,16,25,0.92))] shadow-[0_40px_120px_rgba(0,0,0,0.45)]">
                <div className="border-b border-white/8 px-6 py-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-xs uppercase tracking-[0.28em] text-[#7B95AE]">Live session</div>
                      <div className="mt-2 text-2xl font-bold tracking-[-0.04em] text-white">
                        Claude fixed the file.
                        <br />
                        The bug came back anyway.
                      </div>
                    </div>
                    <div className="rounded-full border border-[#EF4444]/30 bg-[#EF4444]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#FFB0B0]">
                      loop pressure
                    </div>
                  </div>
                </div>

                <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
                  <div className="border-b border-white/8 px-6 py-6 lg:border-b-0 lg:border-r">
                    <div className="mb-5 flex items-center justify-between">
                      <div className="text-sm font-semibold text-white">Session timeline</div>
                      <div className="text-xs uppercase tracking-[0.22em] text-[#7B95AE]">32 min lost</div>
                    </div>
                    <div className="space-y-4">
                      {TIMELINE.map((item) => {
                        const tone =
                          item.state === 'danger'
                            ? '#EF4444'
                            : item.state === 'warning'
                              ? '#F59E0B'
                              : '#5B6C82';

                        return (
                          <div key={item.time} className="grid grid-cols-[auto_1fr] gap-4">
                            <div className="flex flex-col items-center">
                              <div
                                className="h-10 w-10 rounded-full border text-xs font-black"
                                style={{ borderColor: `${tone}55`, background: `${tone}16`, color: tone }}
                              >
                                <div className="flex h-full items-center justify-center">{item.time}</div>
                              </div>
                              <div className="mt-2 h-full w-px bg-white/8" />
                            </div>
                            <div className="pb-5">
                              <div className="text-sm font-semibold text-white">{item.title}</div>
                              <div className="mt-1 text-sm leading-6 text-[#8CA1B8]">{item.body}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="px-6 py-6">
                    <div className="mb-5 flex items-center justify-between">
                      <div className="text-sm font-semibold text-white">Focused context</div>
                      <div className="text-xs uppercase tracking-[0.22em] text-[#7B95AE]">7% kept</div>
                    </div>
                    <div className="rounded-[24px] border border-white/8 bg-black/20 p-4">
                      <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#7B95AE]">
                        <span className="h-2 w-2 rounded-full bg-[#22D3EE]" />
                        summary.tsx
                      </div>
                      <div className="space-y-2 font-mono text-[12px] leading-6">
                        {CONTEXT_LINES.map((line, index) => (
                          <div
                            key={index}
                            className={line.kind === 'focus' ? 'text-[#DFF9FF]' : 'text-[#50657D]'}
                          >
                            {line.text}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 space-y-3 text-sm text-[#8CA1B8]">
                      <div className="flex items-start gap-2">
                        <span className="mt-0.5 text-[#22C55E]"><Icon path={IC.check} size={16} /></span>
                        Keep the failing window, nearby definitions, and recent edits
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="mt-0.5 text-[#22C55E]"><Icon path={IC.check} size={16} /></span>
                        Drop the long helper branches and untouched boilerplate
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="mt-0.5 text-[#22C55E]"><Icon path={IC.check} size={16} /></span>
                        Reuse prior reads so the same file is not resent over and over
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Works with — editors and AI tools only; install methods (Homebrew, npm) covered in setup section */}
      <div className="border-y border-white/8 bg-black/20">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-3 px-6 py-4 text-sm text-[#8095AA]">
          <span className="text-xs uppercase tracking-[0.28em] text-[#7B95AE]">Editors</span>
          {EDITORS.map((w) => (
            <span key={w} className="rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-[#A5B8CA]">
              {w}
            </span>
          ))}
          <span className="hidden sm:block text-white/20">·</span>
          <span className="text-xs uppercase tracking-[0.28em] text-[#7B95AE]">AI Tools</span>
          {AI_TOOLS.map((w) => (
            <span key={w} className="rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-[#A5B8CA]">
              {w}
            </span>
          ))}
        </div>
      </div>

      <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <ScrollReveal className="mb-12 max-w-2xl">
          <div className="text-sm font-semibold uppercase tracking-[0.3em] text-[#7B95AE]">How it works</div>
          <h2 className="mt-3 text-4xl font-bold tracking-[-0.05em] text-white sm:text-5xl">
            One guardrail layer.
            <br />
            Three concrete wins.
          </h2>
        </ScrollReveal>

        <div className="grid gap-10 border-t border-white/8 pt-8 lg:grid-cols-3">
          {SURFACES.map((surface) => (
            <ScrollReveal key={surface.badge}>
              <div className="border-l border-white/10 pl-6">
                <div
                  className="mb-4 inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]"
                  style={{
                    color: surface.accent,
                    background: `${surface.accent}16`,
                    border: `1px solid ${surface.accent}33`,
                  }}
                >
                  <span className="mr-2 inline-flex">
                    <Icon
                      path={
                        surface.accent === '#F59E0B'
                          ? IC.loop
                          : surface.accent === '#22D3EE'
                            ? IC.copy
                            : IC.check
                      }
                      size={14}
                    />
                  </span>
                  {surface.badge}
                </div>
                <h3 className="text-2xl font-semibold tracking-[-0.04em] text-white">{surface.title}</h3>
                <p className="mt-3 max-w-sm text-sm leading-7 text-[#8CA1B8]">{surface.copy}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="grid gap-16 lg:grid-cols-[1fr_0.92fr] lg:items-start">
          <ScrollReveal direction="left">
            <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(9,18,30,0.9),rgba(5,12,20,0.9))]">
              <div className="border-b border-white/8 px-6 py-5">
                <div className="text-xs uppercase tracking-[0.28em] text-[#7B95AE]">What a loop looks like</div>
                <div className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
                  Same error.
                  <br />
                  Different patch.
                </div>
              </div>
              <div className="space-y-5 px-6 py-6">
                {[
                  { tone: '#5B6C82', label: 'Turn 1', detail: 'AI proposes a fix. The error disappears for one edit.' },
                  { tone: '#F59E0B', label: 'Turn 2', detail: 'The same failure returns in a nearby shape. You try again.' },
                  { tone: '#EF4444', label: 'Turn 4', detail: 'You are now paying for repetition instead of progress.' },
                ].map((item) => (
                  <div key={item.label} className="grid gap-4 border-t border-white/8 pt-5 first:border-t-0 first:pt-0 sm:grid-cols-[150px_1fr]">
                    <div className="text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: item.tone }}>
                      {item.label}
                    </div>
                    <div className="text-sm leading-7 text-[#8CA1B8]">{item.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.3em] text-[#7B95AE]">Why it matters</div>
              <h2 className="mt-3 text-4xl font-bold tracking-[-0.05em] text-white sm:text-5xl">
                Stop the retry spiral
                <br />
                before it hardens.
              </h2>
              <p className="mt-6 max-w-xl text-base leading-8 text-[#90A4B9]">
                AI coding tools are fast at the first guess and expensive at the fifth. LoopGuard is
                there for the moment the session stops learning. It measures the waste, points out the
                repetition, and gives you a cleaner next move instead of another blind rerun.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  'Diagnostic loops and repeated edit patterns are both tracked locally.',
                  'Session metrics update live in the sidebar panel and status bar as you code.',
                  'The web dashboard is optional. Core protection still works fully offline.',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 border-t border-white/8 pt-4 text-sm leading-7 text-[#8CA1B8]">
                    <span className="mt-1 text-[#F59E0B]"><Icon path={IC.check} size={16} /></span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="grid gap-16 lg:grid-cols-[0.92fr_1fr] lg:items-start">
          <ScrollReveal direction="left">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.3em] text-[#7B95AE]">Context engine</div>
              <h2 className="mt-3 text-4xl font-bold tracking-[-0.05em] text-white sm:text-5xl">
                Smaller prompts.
                <br />
                Cleaner answers.
              </h2>
              <p className="mt-6 max-w-xl text-base leading-8 text-[#90A4B9]">
                LoopGuard does not try to summarize everything. It picks the parts the model actually
                needs: the failing lines, nearby definitions, and the pieces that changed. That keeps
                prompts readable and makes retries more deliberate.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  { title: 'Extension copy flow', copy: 'Use Copy Optimized Context when you need one fast, focused prompt.' },
                  { title: 'MCP tools', copy: 'Compatible agents can call focused reads, search, tree, and shell tools directly.' },
                  { title: 'Shell filtering', copy: 'Long terminal output gets reduced to the lines that actually explain the failure.' },
                  { title: 'Local helper path', copy: 'The native helper can cut prompt volume dramatically when it is available.' },
                ].map((item) => (
                  <div key={item.title} className="border-t border-white/8 pt-4">
                    <div className="text-lg font-semibold tracking-[-0.03em] text-white">{item.title}</div>
                    <div className="mt-2 text-sm leading-7 text-[#8CA1B8]">{item.copy}</div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right">
            <div className="overflow-hidden rounded-[32px] border border-white/10 bg-black/20">
              <div className="flex items-center justify-between border-b border-white/8 px-6 py-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.28em] text-[#7B95AE]">Prompt payload</div>
                  <div className="mt-1 text-lg font-semibold text-white">What the model sees next</div>
                </div>
                <div className="rounded-full border border-[#22D3EE]/30 bg-[#22D3EE]/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#8AE8FF]">
                  Focused read
                </div>
              </div>
              <div className="grid gap-px bg-white/8 sm:grid-cols-[0.85fr_1.15fr]">
                <div className="bg-[#08121D] px-6 py-6">
                  <div className="text-xs uppercase tracking-[0.22em] text-[#7B95AE]">Without LoopGuard</div>
                  <div className="mt-4 text-sm leading-7 text-[#60758C]">
                    Whole file
                    <br />
                    Unrelated helpers
                    <br />
                    Old branches
                    <br />
                    Repeated imports
                    <br />
                    Re-sent context
                  </div>
                  <div className="mt-4 text-xs text-[#4E5A6A]">~12,000 tokens</div>
                </div>
                <div className="bg-[#06111B] px-6 py-6">
                  <div className="text-xs uppercase tracking-[0.22em] text-[#7B95AE]">With LoopGuard</div>
                  <div className="mt-4 space-y-3 text-sm leading-7 text-[#D5E7F8]">
                    <div>1. Exact failing window</div>
                    <div>2. Nearby definitions and signatures</div>
                    <div>3. Recent edits that changed the behavior</div>
                    <div>4. Smaller prompt shape for the next retry</div>
                  </div>
                  <div className="mt-4 text-xs text-[#22C55E]">~3,600 tokens — 70% less</div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <ScrollReveal className="mb-12 max-w-2xl">
          <div className="text-sm font-semibold uppercase tracking-[0.3em] text-[#7B95AE]">Install paths</div>
          <h2 className="mt-3 text-4xl font-bold tracking-[-0.05em] text-white sm:text-5xl">
            Start in the editor.
            <br />
            Add agents when you want them.
          </h2>
        </ScrollReveal>

        <div className="grid gap-10 lg:grid-cols-2">
          <ScrollReveal>
            <div className="border-t border-white/10 pt-6">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#2563EB]/25 bg-[#2563EB]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#7FB1FF]">
                <Icon path={IC.code} size={14} />
                VS Code · Cursor · Windsurf
              </div>
              <div className="space-y-5">
                {[
                  'Install the LoopGuard extension and open any workspace.',
                  'Loop detection starts automatically — sidebar panel and status bar update live.',
                  'Sign in only if you want session history on the web dashboard.',
                ].map((item, index) => (
                  <div key={index} className="grid grid-cols-[32px_1fr] gap-4 border-b border-white/8 pb-5 last:border-b-0 last:pb-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-sm font-bold text-white">
                      {index + 1}
                    </div>
                    <div className="text-sm leading-7 text-[#8CA1B8]">{item}</div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="/setup#vscode"
                  className="inline-flex items-center gap-2 rounded-full border border-white/12 px-5 py-3 text-sm font-semibold text-[#D6E3F1] transition hover:border-white/25 hover:text-white"
                >
                  Open setup guide
                  <Icon path={IC.arrow} size={16} />
                </a>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="border-t border-white/10 pt-6">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#22D3EE]/25 bg-[#22D3EE]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#8AE8FF]">
                <Icon path={IC.terminal} size={14} />
                Homebrew · npm · Codex CLI · Claude Code
              </div>
              <div className="space-y-5">
                {[
                  { step: 'Install once via Homebrew, npm, or curl.', options: null },
                  {
                    step: 'Register with your agent in one command:',
                    options: [
                      { label: 'Claude Code', cmd: 'loopguard-ctx setup --agent=claude' },
                      { label: 'Cursor', cmd: 'loopguard-ctx setup --agent=cursor' },
                      { label: 'Codex CLI', cmd: 'loopguard-ctx setup --agent=codex' },
                    ],
                  },
                  { step: 'Run loopguard-ctx doctor to verify every layer is green before you start.', options: null },
                ].map((item, index) => (
                  <div key={index} className="grid grid-cols-[32px_1fr] gap-4 border-b border-white/8 pb-5 last:border-b-0 last:pb-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-sm font-bold text-white">
                      {index + 1}
                    </div>
                    <div>
                      <div className="text-sm leading-7 text-[#8CA1B8]">{item.step}</div>
                      {item.options && (
                        <div className="mt-2 space-y-1.5">
                          {item.options.map((opt) => (
                            <div key={opt.label} className="flex items-center gap-2">
                              <span className="w-24 text-xs text-[#6B8299]">{opt.label}</span>
                              <code className="rounded bg-black/30 px-2 py-0.5 font-mono text-[11px] text-[#8AE8FF]">
                                {opt.cmd}
                              </code>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="/setup#codex"
                  className="inline-flex items-center gap-2 rounded-full border border-white/12 px-5 py-3 text-sm font-semibold text-[#D6E3F1] transition hover:border-white/25 hover:text-white"
                >
                  See agent setup
                  <Icon path={IC.arrow} size={16} />
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(160deg,rgba(9,18,30,0.9),rgba(5,12,20,0.88))] px-8 py-10 sm:px-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#7B95AE]">Roadmap</div>
              <h2 className="text-3xl font-bold tracking-[-0.05em] text-white sm:text-4xl">
                Three versions shipped since launch.
                <br />
                <span className="text-[#F59E0B]">v4 — multi-session memory — now in active development.</span>
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-[#8CA1B8]">
                See the full feature list for every version — what each one adds for VS Code, Cursor, Windsurf, Claude Code, Codex CLI, and GitHub Copilot. v4 brings cross-session pattern memory and proactive loop prediction.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {[
                  { v: 'v1', label: 'Extension Core', color: '#22C55E', upcoming: false },
                  { v: 'v2', label: 'CLI + Sync Pipeline', color: '#22D3EE', upcoming: false },
                  { v: 'v3', label: 'Intelligence Layer', color: '#A78BFA', upcoming: false },
                  { v: 'v4', label: 'Multi-session Memory', color: '#F59E0B', upcoming: true },
                ].map(({ v, label, color, upcoming }) => (
                  <span
                    key={v}
                    className="rounded-full px-2.5 py-1 text-xs font-semibold"
                    style={{
                      color,
                      background: upcoming ? `${color}08` : `${color}18`,
                      border: upcoming ? `1px dashed ${color}55` : `1px solid ${color}33`,
                    }}
                  >
                    {v} — {label}{upcoming ? ' ✦' : ''}
                  </span>
                ))}
              </div>
            </div>
            <a
              href="/roadmap"
              className="inline-flex flex-shrink-0 items-center gap-2 rounded-full bg-white/[0.07] border border-white/12 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10 hover:border-white/20"
            >
              View full roadmap
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <ScrollReveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                quote:
                  "Caught the loop on turn 3 and pointed me at the actual root cause. Saved me from spending another hour on the same Prisma migration error.",
                author: "Backend engineer, fintech startup",
              },
              {
                quote:
                  "The focused-read output is genuinely different from just copy-pasting a file. The model stops re-explaining things it already knows.",
                author: "Solo developer, SaaS product",
              },
              {
                quote:
                  "Status bar showing '32 min lost in loops' was the wake-up call I needed. Didn't realise how much time was going into repetition.",
                author: "Full-stack developer, agency",
              },
            ].map(({ quote, author }) => (
              <div
                key={author}
                className="rounded-[24px] border border-white/8 bg-white/3 px-6 py-6"
              >
                <p className="text-sm leading-7 text-[#A8BECF]">
                  &ldquo;{quote}&rdquo;
                </p>
                <p className="mt-4 text-xs font-medium text-[#5B7A93]">— {author}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      <section className="px-6 py-24 lg:px-10">
        <ScrollReveal>
          <div className="mx-auto max-w-5xl overflow-hidden rounded-[36px] border border-white/10 bg-[linear-gradient(160deg,rgba(10,20,32,0.96),rgba(7,16,25,0.9))] px-8 py-10 shadow-[0_35px_100px_rgba(0,0,0,0.35)] sm:px-12">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.3em] text-[#7B95AE]">Support the project</div>
                <h2 className="mt-3 text-4xl font-bold tracking-[-0.05em] text-white sm:text-5xl">
                  LoopGuard stays free.
                  <br />
                  Back the build if it helped.
                </h2>
                <p className="mt-5 max-w-xl text-base leading-8 text-[#90A4B9]">
                  The core product is still free. If LoopGuard saved you a late night, a broken deploy,
                  or a few wasted agent retries, you can keep it moving with a coffee instead of a paywall.
                </p>
              </div>

              <div className="space-y-4">
                <a
                  href={SUPPORT_URL}
                  className="flex items-center justify-between rounded-[24px] border border-[#F59E0B]/25 bg-[#F59E0B]/10 px-5 py-4 transition hover:-translate-y-0.5 hover:bg-[#F59E0B]/14"
                >
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F8C76B]">Buy me a coffee</div>
                    <div className="mt-1 text-sm leading-6 text-[#F5E6C7]">Support LoopGuard without locking core features.</div>
                  </div>
                  <span className="text-[#F59E0B]"><Icon path={IC.coffee} size={20} /></span>
                </a>

                <a
                  href="https://github.com/rodthenewcomer/loopguard"
                  className="flex items-center justify-between rounded-[24px] border border-white/10 px-5 py-4 transition hover:border-white/20 hover:bg-white/5"
                >
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8CA1B8]">Open source</div>
                    <div className="mt-1 text-sm leading-6 text-[#C8D7E6]">Star the repo, file issues, or follow the next changes.</div>
                  </div>
                  <span className="text-white"><Icon path={IC.github} size={20} /></span>
                </a>

                <div className="rounded-[24px] border border-white/8 bg-black/20 px-5 py-4 text-sm leading-7 text-[#8CA1B8]">
                  Need sync history? Create an account later. Need protection right now? Install the extension and start coding.
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <footer className="border-t border-white/8 px-6 pb-10 pt-16 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 md:grid-cols-[1.3fr_repeat(3,1fr)]">
            <div>
              <div className="text-2xl font-bold tracking-[-0.04em] text-white">LoopGuard</div>
              <p className="mt-4 max-w-sm text-sm leading-7 text-[#72879D]">
                The local guardrail for AI coding sessions that start repeating instead of moving.
              </p>
            </div>

            {FOOTER_COLS.map((column) => (
              <div key={column.heading}>
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7B95AE]">{column.heading}</div>
                <div className="mt-4 space-y-3">
                  {column.links.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="block text-sm text-[#8CA1B8] transition hover:text-white"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 flex flex-col gap-3 border-t border-white/8 pt-6 text-xs text-[#5C7287] sm:flex-row sm:items-center sm:justify-between">
            <div>© 2026 LoopGuard · Windows · macOS · Linux</div>
            <div>Your code never leaves your machine unless you explicitly choose to sync metrics.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
