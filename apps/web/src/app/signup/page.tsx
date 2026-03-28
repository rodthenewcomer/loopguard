import Link from 'next/link';
import type { Metadata } from 'next';
import SignupClient from './SignupClient';

export const metadata: Metadata = {
  title: 'Create account — LoopGuard',
};

const PRO_FEATURES = [
  'Rust engine — 89–99% token reduction',
  'MCP server for Cursor, Claude Code, Windsurf',
  'Shell hooks — compress CLI output automatically',
  '30-day session history',
  'Token savings dashboard',
];

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-[#0B1220] flex flex-col">
      {/* Header */}
      <header className="border-b border-[#1F2937]">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <svg width="28" height="28" viewBox="0 0 34 34" fill="none" aria-hidden="true">
              <path d="M17 2L3 8v10c0 8.3 5.8 15.8 14 17.7C25.2 33.8 31 26.3 31 18V8L17 2z" fill="url(#sg)" />
              <defs>
                <linearGradient id="sg" x1="3" y1="2" x2="31" y2="35" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#22D3EE" />
                </linearGradient>
              </defs>
            </svg>
            <span className="font-bold text-white">LoopGuard</span>
          </Link>
          <Link href="/login" className="text-sm text-[#6B7280] hover:text-[#9CA3AF] transition-colors">
            Already have an account? Sign in →
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

          {/* Left — value prop */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#22C55E]/10 border border-[#22C55E]/25 rounded-full text-[#22C55E] text-xs font-bold uppercase tracking-wide mb-6">
              Free forever
            </div>
            <h1 className="text-4xl font-bold text-white leading-tight mb-4">
              Start free.
              <br />
              <span className="text-[#22D3EE]">Upgrade when you see the ROI.</span>
            </h1>
            <p className="text-[#6B7280] text-base leading-relaxed mb-8">
              LoopGuard Free gives you unlimited loop detection, session tracking, and the TypeScript context engine (~80% reduction). No credit card required.
            </p>

            <div className="text-sm text-[#6B7280] mb-3 font-medium">Pro includes:</div>
            <ul className="space-y-2.5">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-[#9CA3AF]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22D3EE" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Right — form */}
          <div>
            <div
              className="rounded-2xl border border-[#1F2937] p-6"
              style={{ background: 'linear-gradient(145deg, #111827, #0f172a)' }}
            >
              <SignupClient />
            </div>

            {/* Install instead CTA */}
            <div className="mt-5 p-4 rounded-xl border border-[#1F2937] flex items-center gap-3">
              <div className="flex-1">
                <div className="text-sm text-[#F9FAFB] font-medium">Just want to install?</div>
                <div className="text-xs text-[#6B7280] mt-0.5">No account needed. Install the extension and start free.</div>
              </div>
              <a
                href="https://marketplace.visualstudio.com"
                className="flex-shrink-0 px-3 py-2 bg-[#1F2937] hover:bg-[#374151] text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Install →
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
