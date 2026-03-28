'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

function ShieldIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true">
      <path
        d="M17 2L3 8v10c0 8.3 5.8 15.8 14 17.7C25.2 33.8 31 26.3 31 18V8L17 2z"
        fill="url(#sg)"
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
        <linearGradient id="sg" x1="3" y1="2" x2="31" y2="35" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#22D3EE" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Docs', href: '/docs' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0B1220]/85 backdrop-blur-xl border-b border-[#1F2937]/80 shadow-xl'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <ShieldIcon />
          <span className="text-[17px] font-bold text-white tracking-tight">LoopGuard</span>
        </Link>

        {/* Nav */}
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

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="hidden sm:block text-sm text-[#9CA3AF] hover:text-white transition-colors duration-200"
          >
            Dashboard
          </Link>
          <a
            href="#install"
            className="px-4 py-2 bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-sm font-semibold rounded-lg transition-colors duration-200 shadow-lg shadow-blue-900/30"
          >
            Get Extension
          </a>
        </div>
      </div>
    </header>
  );
}
