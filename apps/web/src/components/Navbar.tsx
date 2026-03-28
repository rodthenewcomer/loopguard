'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

function Logo() {
  return (
    <svg width="32" height="32" viewBox="0 0 34 34" fill="none" aria-hidden="true">
      <path
        d="M17 2L3 8v10c0 8.3 5.8 15.8 14 17.7C25.2 33.8 31 26.3 31 18V8L17 2z"
        fill="url(#nav-grad)"
      />
      <path
        d="M11.5 17c0-3 2.5-5.5 5.5-5.5s5.5 2.5 5.5 5.5-2.5 5.5-5.5 5.5-5.5-2.5-5.5-5.5z"
        stroke="rgba(255,255,255,0.8)"
        strokeWidth="1.4"
        fill="none"
      />
      <path
        d="M13.5 17h2.2l1.1-2.2 1.6 4.4 1.1-2.2H21"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <defs>
        <linearGradient id="nav-grad" x1="3" y1="2" x2="31" y2="35" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#22D3EE" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const NAV_LINKS = [
  { label: 'Features',    href: '/#features' },
  { label: 'How it works',href: '/#how-it-works' },
  { label: 'Pricing',     href: '/#pricing' },
  { label: 'Docs',        href: '/docs' },
];

// Placeholder — replace with real Marketplace URL once published
const MARKETPLACE_URL = '/setup';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0B1220]/90 backdrop-blur-xl border-b border-[#1F2937]/80 shadow-xl'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <Logo />
          <span className="text-[17px] font-bold text-white tracking-tight">LoopGuard</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm text-[#9CA3AF] hover:text-white transition-colors duration-200"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/login"
            className="px-4 py-2 text-sm text-[#9CA3AF] hover:text-white transition-colors duration-200"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 border border-[#374151] hover:border-[#4B5563] text-sm text-[#D1D5DB] hover:text-white rounded-lg transition-colors duration-200"
          >
            Sign up free
          </Link>
          <a
            href={MARKETPLACE_URL}
            className="px-4 py-2 bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-sm font-semibold rounded-lg transition-colors duration-200 shadow-lg shadow-blue-900/30"
          >
            Install extension
          </a>
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden p-2 text-[#9CA3AF] hover:text-white transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            {mobileOpen
              ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
              : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0B1220]/95 backdrop-blur-xl border-b border-[#1F2937]">
          <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="py-2.5 text-sm text-[#9CA3AF] hover:text-white transition-colors"
              >
                {l.label}
              </a>
            ))}
            <div className="border-t border-[#1F2937] mt-2 pt-4 flex flex-col gap-2">
              <Link href="/login" onClick={() => setMobileOpen(false)} className="py-2.5 text-sm text-[#9CA3AF] hover:text-white transition-colors">
                Log in
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileOpen(false)}
                className="py-2.5 text-center border border-[#374151] text-sm text-white rounded-lg"
              >
                Sign up free
              </Link>
              <a
                href={MARKETPLACE_URL}
                className="py-2.5 text-center bg-[#2563EB] text-white text-sm font-semibold rounded-lg"
              >
                Install extension
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
