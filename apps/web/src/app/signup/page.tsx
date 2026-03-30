import Link from 'next/link';
import type { Metadata } from 'next';
import SignupClient from './SignupClient';

export const metadata: Metadata = {
  title: 'Create free account — LoopGuard',
  description: 'Create a free LoopGuard account to unlock the web dashboard, session history, and all features.',
};

const FREE_ACCOUNT_PERKS = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
    title: 'Web dashboard',
    desc: 'See all your loops, token savings, and time wasted across every session — in your browser, not just inside VS Code.',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10zm0-10V7"/>
      </svg>
    ),
    title: '30-day session history',
    desc: 'Your loop patterns and token spend are saved. See which day cost you the most — and whether it improved.',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: 'Your code never leaves your machine',
    desc: 'Only anonymised metrics sync to the cloud — no source code, no file names, no error messages. Ever.',
  },
];

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-[#0B1220] flex flex-col">
      {/* Header */}
      <header className="border-b border-[#1F2937]">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/icon-192x192.png" alt="LoopGuard" width="28" height="28" className="rounded-lg" />
            <span className="font-bold text-white">LoopGuard</span>
          </Link>
          <Link href="/login" className="text-sm text-[#6B7280] hover:text-[#9CA3AF] transition-colors">
            Already have an account? Sign in →
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

          {/* Left — what you actually get */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#22C55E]/10 border border-[#22C55E]/25 rounded-full text-[#22C55E] text-xs font-bold uppercase tracking-wide mb-6">
              Free · No credit card
            </div>

            <h1 className="text-4xl font-bold text-white leading-tight mb-3">
              What does a free account give you?
            </h1>
            <p className="text-[#6B7280] text-sm leading-relaxed mb-8">
              The extension works without an account — loop detection and context compression run 100% locally.
              An account adds the <strong className="text-[#9CA3AF]">web dashboard</strong> so you can see your data
              outside of VS Code, and keeps your session history across devices.
            </p>

            <div className="space-y-5 mb-10">
              {FREE_ACCOUNT_PERKS.map((perk) => (
                <div key={perk.title} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#22C55E]/10 flex items-center justify-center flex-shrink-0">
                    {perk.icon}
                  </div>
                  <div>
                    <div className="text-[#F9FAFB] font-semibold text-sm mb-0.5">{perk.title}</div>
                    <div className="text-[#6B7280] text-sm leading-relaxed">{perk.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Everything is free */}
            <div className="rounded-xl border border-[#22C55E]/25 bg-[#22C55E]/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                <span className="text-xs font-bold text-[#22C55E] uppercase tracking-wide">Everything included — free</span>
              </div>
              <p className="text-[#6B7280] text-xs leading-relaxed">
                Rust engine (89–99% token reduction), MCP server, shell hooks, and full session history
                are all available from day one. No upgrade required, ever.
              </p>
            </div>
          </div>

          {/* Right — form */}
          <div>
            <div
              className="rounded-2xl border border-[#1F2937] p-6"
              style={{ background: 'linear-gradient(145deg, #111827, #0f172a)' }}
            >
              <h2 className="text-lg font-bold text-white mb-5">Create your free account</h2>
              <SignupClient />
            </div>

            {/* Skip account CTA */}
            <div className="mt-4 p-4 rounded-xl border border-[#1F2937] flex items-center gap-3">
              <div className="flex-1">
                <div className="text-sm text-[#F9FAFB] font-medium">Just want the extension?</div>
                <div className="text-xs text-[#6B7280] mt-0.5">
                  No account needed. Install and everything works immediately.
                </div>
              </div>
              <Link
                href="/setup"
                className="flex-shrink-0 px-3 py-2 bg-[#1F2937] hover:bg-[#374151] text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Install →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
