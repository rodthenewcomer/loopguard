import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Upgrade to Pro — LoopGuard',
  description: 'LoopGuard Pro — Rust context helper, MCP setup, shell helpers, and premium usage surfaces. $9/month, cancel anytime.',
};

const PRO_FEATURES = [
  {
    title: 'Rust context engine',
    detail: 'The local Rust helper can achieve much deeper reductions on some files and MCP workflows. It brings richer read modes, structure-aware extraction, and stronger shell compression than the built-in TypeScript fallback.',
    saving: 'Saves ~$77/month on AI API costs',
  },
  {
    title: 'MCP server — 21 tools',
    detail: 'Wires LoopGuard into compatible MCP clients including Claude Code, Cursor, Windsurf, Codex CLI, and VS Code / Copilot. The strongest savings come when your agent uses focused MCP reads instead of full-file reads.',
    saving: 'Works with any MCP-compatible AI agent',
  },
  {
    title: 'Shell hooks',
    detail: 'npm install, git log, docker build — the shell helper trims noise before you paste output into AI tools or route command output through LoopGuard-compatible workflows.',
    saving: 'Supports bash, zsh, fish',
  },
  {
    title: 'Premium history and reporting',
    detail: 'Longer retention, better summaries, and clearer usage surfaces are part of the paid-tier direction as LoopGuard\'s billing and entitlement wiring rolls out.',
    saving: 'Premium visibility',
  },
];

const COMPARE = [
  { feature: 'Loop detection',                    free: true,  pro: true  },
  { feature: 'Edit-pattern loop detection',       free: true,  pro: true  },
  { feature: 'TypeScript context engine (~80%)',  free: true,  pro: true  },
  { feature: 'VS Code + web dashboard',           free: true,  pro: true  },
  { feature: 'Premium history and reporting',     free: 'Basic', pro: 'Expanded' },
  { feature: 'Rust context helper',               free: false, pro: true  },
  { feature: 'MCP server integration',            free: false, pro: true  },
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
            <img src="/icon-192x192.png" alt="LoopGuard" width="28" height="28" className="rounded-lg" />
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
            Average user can save meaningful AI spend with smaller context reads. Pro is for the heavier MCP, shell, and Rust-helper workflows.
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
            You need a free account first. Sign up, then upgrade from the dashboard as paid-tier wiring rolls out.
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
            After signing in, paid-tier controls will live in the dashboard as billing rollout completes.
          </p>
        </div>

        {/* What Pro actually is */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-2">What Pro unlocks</h2>
          <p className="text-[#6B7280] text-sm mb-8">
            Free gives you loop detection and focused local context copy. Pro is aimed at the deeper LoopGuard pipeline.
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
              { q: 'Can I cancel anytime?', a: 'Yes. Once billing is active, cancellation will live in the dashboard and access will continue until the end of the billing period.' },
              { q: 'Is there a free trial?', a: 'No trial — but the Free tier is unlimited and gives you a real sense of the product before you pay.' },
              { q: 'What happens if I cancel?', a: 'Your account will revert to the free experience when the paid period ends, while local loop detection and focused context copy remain available.' },
              { q: 'Do prices change?', a: 'We may adjust pricing with notice as the paid product matures.' },
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
          <p className="text-xs text-[#4B5563] mt-4">No credit card for Free · Paid-tier rollout is being tightened before wider promotion</p>
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
