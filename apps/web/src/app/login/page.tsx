import Link from 'next/link';
import type { Metadata } from 'next';
import LoginClient from './LoginClient';

export const metadata: Metadata = {
  title: 'Sign in — LoopGuard',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0B1220] flex flex-col">
      {/* Header */}
      <header className="border-b border-[#1F2937]">
        <div className="max-w-md mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <svg width="28" height="28" viewBox="0 0 34 34" fill="none" aria-hidden="true">
              <path d="M17 2L3 8v10c0 8.3 5.8 15.8 14 17.7C25.2 33.8 31 26.3 31 18V8L17 2z" fill="url(#lg)" />
              <defs>
                <linearGradient id="lg" x1="3" y1="2" x2="31" y2="35" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#22D3EE" />
                </linearGradient>
              </defs>
            </svg>
            <span className="font-bold text-white">LoopGuard</span>
          </Link>
          <Link href="/signup" className="text-sm text-[#6B7280] hover:text-[#9CA3AF] transition-colors">
            Create account →
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
            <p className="text-[#6B7280] text-sm">Sign in to view your session dashboard and token savings.</p>
          </div>

          <div
            className="rounded-2xl border border-[#1F2937] p-6"
            style={{ background: 'linear-gradient(145deg, #111827, #0f172a)' }}
          >
            <LoginClient />
          </div>
        </div>
      </main>
    </div>
  );
}
