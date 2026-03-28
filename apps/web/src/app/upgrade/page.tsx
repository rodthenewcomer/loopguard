import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Upgrade to Pro — LoopGuard',
  description: 'LoopGuard Pro — Rust context engine, MCP server, shell hooks, and 12-month history. $9/month, cancel anytime.',
};

const PRO_FEATURES = [
  {
    title: 'Rust context engine',
    detail: '89–99% token reduction per clipboard copy. Full AST parse, Shannon entropy scoring, Myers delta. The TypeScript engine gives you ~80% — the Rust engine squeezes out the rest.',
    saving: 'Saves ~$77/month on AI API costs',
  },
  {
    title: 'MCP server — 21 tools',
    detail: 'Wires LoopGuard\'s context engine directly into Claude Code, Cursor, Windsurf, and GitHub Copilot. Every file read is compressed automatically — no copy-paste needed.',
    saving: 'Works with any MCP-compatible AI agent',
  },
  {
    title: 'Shell hooks',
    detail: 'npm install, git log, docker build — compressed 60–90% before they reach your AI. Paste terminal output directly into any chat without the noise.',
    saving: 'Supports bash, zsh, fish',
  },
  {
    title: '12-month session history',
    detail: 'Free tier keeps 30 days. Pro keeps 12 months — see long-term trends, identify which projects cause the most loops, and track your improvement over time.',
    saving: 'Full history, exportable as JSON',
  },
];

const COMPARE = [
  { feature: 'Loop detection',                    free: true,  pro: true  },
  { feature: 'Edit-pattern loop detection',       free: true,  pro: true  },
  { feature: 'TypeScript context engine (~80%)',  free: true,  pro: true  },
  { feature: 'VS Code + web dashboard',           free: true,  pro: true  },
  { feature: 'Session history',                   free: '30 days', pro: '12 months' },
  { feature: 'Rust context engine (89–99%)',      free: false, pro: true  },
  { feature: 'MCP server — 21 AI tools',          free: false, pro: true  },
  { feature: 'Shell hooks (bash/zsh/fish)',        free: false, pro: true  },
  { feature: 'Priority support',                  free: false, pro: true  },
];

function Check({ color = '#22C55E' }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
function Cross() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

export default function UpgradePage() {
  return (
    <div className="min-h-screen bg-[#0B1220]">
      {/* Header */}
      <header className="border-b border-[#1F2937] sticky top-0 z-40 bg-[#0B1220]/95 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <svg width="26" height="26" viewBox="0 0 34 34" fill="none" aria-hidden="true">
              <path d="M17 2L3 8v10c0 8.3 5.8 15.8 14 17.7C25.2 33.8 31 26.3 31 18V8L17 2z" fill="url(#upgr)" />
              <defs>
                <linearGradient id="upgr" x1="3" y1="2" x2="31" y2="35" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#22D3EE" />
                </linearGradient>
              </defs>
            </svg>
            <span className="font-bold text-white">LoopGuard</span>
            <span className="text-[#374151] mx-1">/</span>
            <span className="text-sm text-[#6B7280]">Upgrade to Pro</span>
          </Link>
          <Link href="/dashboard" className="text-sm text-[#6B7280] hover:text-[#9CA3AF] transition-colors">
            My dashboard →
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16">

        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#2563EB]/10 border border-[#2563EB]/30 rounded-full text-[#22D3EE] text-xs font-bold uppercase tracking-wide mb-5">
            LoopGuard Pro
          </div>
          <h1 className="text-5xl font-black text-white mb-4">$9 <span className="text-2xl font-normal text-[#6B7280]">/ month</span></h1>
          <p className="text-[#6B7280] text-lg max-w-lg mx-auto mb-3">
            Average user saves ~$77/month on AI API costs. Pro pays for itself after 26 context copies.
          </p>
          <p className="text-sm text-[#4B5563]">Cancel any time. No commitment. Billed via Stripe — your card data never touches LoopGuard.</p>
        </div>

        {/* CTA card */}
        <div
          className="rounded-2xl border border-[#2563EB]/40 p-8 mb-16 text-center"
          style={{ background: 'linear-gradient(145deg, #0f1c32, #111827)' }}
        >
          <div className="text-white font-bold text-xl mb-2">Ready to upgrade?</div>
          <p className="text-[#6B7280] text-sm mb-6">
            You need a free account first. Sign up, then upgrade instantly from your dashboard.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/signup"
              className="px-8 py-3.5 bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-bold rounded-xl transition-colors text-sm shadow-lg shadow-blue-900/40"
            >
              Create free account → then upgrade
            </Link>
            <Link
              href="/login"
              className="px-8 py-3.5 border border-[#374151] hover:border-[#4B5563] text-[#9CA3AF] hover:text-white font-medium rounded-xl transition-colors text-sm"
            >
              Already have an account
            </Link>
          </div>
          <p className="text-xs text-[#4B5563] mt-4">
            After signing in, go to <strong className="text-[#6B7280]">Dashboard → Billing → Upgrade to Pro</strong>
          </p>
        </div>

        {/* What Pro actually is */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-2">What Pro unlocks</h2>
          <p className="text-[#6B7280] text-sm mb-8">
            Free gives you loop detection + the TypeScript context engine. Pro activates the full pipeline.
          </p>

          <div className="space-y-4">
            {PRO_FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="p-6 rounded-2xl border border-[#1F2937] hover:border-[#374151] transition-colors"
                style={{ background: 'linear-gradient(145deg, #111827, #0f172a)' }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-7 h-7 rounded-full bg-[#2563EB]/15 border border-[#2563EB]/30 flex items-center justify-center text-xs font-black text-[#22D3EE] flex-shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="text-white font-semibold">{f.title}</h3>
                      <span className="text-xs text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/20 px-2 py-0.5 rounded-full font-medium flex-shrink-0">
                        {f.saving}
                      </span>
                    </div>
                    <p className="text-[#6B7280] text-sm leading-relaxed">{f.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Free vs Pro comparison */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8">Free vs Pro — full comparison</h2>
          <div className="rounded-2xl border border-[#1F2937] overflow-hidden">
            <div className="grid grid-cols-3 bg-[#111827] px-5 py-3 border-b border-[#1F2937]">
              <div className="text-xs uppercase tracking-widest text-[#4B5563] font-semibold">Feature</div>
              <div className="text-center text-xs uppercase tracking-widest text-[#4B5563] font-semibold">Free</div>
              <div className="text-center text-xs uppercase tracking-widest text-[#22D3EE] font-semibold">Pro</div>
            </div>
            {COMPARE.map((row, i) => (
              <div
                key={row.feature}
                className={`grid grid-cols-3 px-5 py-3.5 border-b border-[#1F2937]/50 last:border-0 ${i % 2 === 0 ? 'bg-transparent' : 'bg-[#111827]/30'}`}
              >
                <div className="text-sm text-[#9CA3AF]">{row.feature}</div>
                <div className="flex items-center justify-center">
                  {row.free === true ? <Check color="#22C55E" /> :
                   row.free === false ? <Cross /> :
                   <span className="text-xs text-[#6B7280]">{row.free}</span>}
                </div>
                <div className="flex items-center justify-center">
                  {row.pro === true ? <Check color="#22D3EE" /> :
                   row.pro === false ? <Cross /> :
                   <span className="text-xs text-[#22D3EE] font-semibold">{row.pro}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Billing details */}
        <div
          className="rounded-2xl border border-[#1F2937] p-7 mb-12"
          style={{ background: 'linear-gradient(145deg, #111827, #0f172a)' }}
        >
          <h2 className="text-lg font-bold text-white mb-5">Billing details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {[
              { q: 'How do I pay?', a: 'Via Stripe. We accept all major cards. LoopGuard never stores your card number — Stripe handles everything.' },
              { q: 'Can I cancel anytime?', a: 'Yes. Cancel from your dashboard in one click. You keep Pro access until the end of your billing period. No questions asked.' },
              { q: 'Is there a free trial?', a: 'No trial — but the Free tier is unlimited and gives you a real sense of the product before you pay.' },
              { q: 'What happens if I cancel?', a: 'Your account reverts to Free at the end of the billing period. Your data stays. The Rust engine and MCP features stop working.' },
              { q: 'Do prices change?', a: 'We may adjust pricing with 30 days notice. Your existing subscription stays at the price you signed up at.' },
              { q: 'Refunds?', a: 'No partial-month refunds, except where required by law. If you have a billing issue, email support@loopguard.dev.' },
            ].map((item) => (
              <div key={item.q} className="p-4 rounded-xl bg-[#0d1117] border border-[#1F2937]">
                <div className="text-white font-semibold text-xs mb-1.5">{item.q}</div>
                <div className="text-[#6B7280] text-xs leading-relaxed">{item.a}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-10 py-4 bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-bold rounded-xl text-lg transition-colors shadow-xl shadow-blue-900/40"
          >
            Start free — upgrade when ready
          </Link>
          <p className="text-xs text-[#4B5563] mt-4">No credit card for Free · Upgrade to Pro from your dashboard at any time</p>
        </div>
      </main>

      <footer className="border-t border-[#1F2937] mt-16">
        <div className="max-w-4xl mx-auto px-6 py-8 flex items-center justify-between">
          <p className="text-xs text-[#4B5563]">© 2026 LoopGuard.</p>
          <div className="flex items-center gap-4 text-xs text-[#4B5563]">
            <Link href="/" className="hover:text-[#6B7280] transition-colors">Home</Link>
            <Link href="/terms" className="hover:text-[#6B7280] transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-[#6B7280] transition-colors">Privacy</Link>
            <a href="mailto:support@loopguard.dev" className="hover:text-[#6B7280] transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
