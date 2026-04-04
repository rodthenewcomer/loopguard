'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import LoopGuardLogo from './LoopGuardLogo';
import { supabase } from '../lib/supabase';
import { GITHUB_URL, MARKETPLACE_URL } from '../lib/constants';

const NAV_LINKS = [
  { label: 'Features',     href: '/#features' },
  { label: 'How it works', href: '/#how-it-works' },
  { label: 'Roadmap',      href: '/roadmap' },
  { label: 'Docs',         href: '/docs' },
];

function GitHubIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
    </svg>
  );
}

// Skeleton placeholder — same shape as the action buttons, prevents auth flash
function NavSkeleton() {
  return (
    <div className="hidden md:flex items-center gap-2" aria-hidden="true">
      <div className="h-8 w-16 rounded-lg bg-white/5 animate-pulse" />
      <div className="h-8 w-32 rounded-lg bg-[#2563EB]/20 animate-pulse" />
    </div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userEmail, setUserEmail]   = useState<string | null>(null);
  const [authReady, setAuthReady]   = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUserEmail(data.session?.user?.email ?? null);
      setAuthReady(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const isLoggedIn = authReady && userEmail !== null;

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
          <LoopGuardLogo
            size={30}
            showWordmark
            wordmarkClassName="text-[17px] font-bold text-white tracking-tight"
          />
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
          {/* GitHub star — always visible */}
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 border border-[#374151] hover:border-[#4B5563] text-sm text-[#9CA3AF] hover:text-white rounded-lg transition-colors duration-200"
          >
            <GitHubIcon />
            Star
          </a>

          {/* Render skeleton until auth resolves — avoids layout flash */}
          {!authReady ? (
            <NavSkeleton />
          ) : isLoggedIn ? (
            <>
              <span className="px-3 py-1.5 text-xs text-[#6B7280] border border-[#1F2937] rounded-lg truncate max-w-[160px]">
                {userEmail}
              </span>
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-sm font-semibold rounded-lg transition-colors duration-200 shadow-lg shadow-blue-900/30"
              >
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-sm text-[#9CA3AF] hover:text-white transition-colors duration-200"
              >
                Log in
              </Link>
              <a
                href={MARKETPLACE_URL}
                className="px-4 py-2 bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-sm font-semibold rounded-lg transition-colors duration-200 shadow-lg shadow-blue-900/30"
              >
                Install free
              </a>
            </>
          )}
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
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="py-2.5 flex items-center justify-center gap-1.5 border border-[#374151] text-sm text-[#9CA3AF] rounded-lg"
              >
                <GitHubIcon />
                Star on GitHub
              </a>
              {isLoggedIn ? (
                <>
                  <span className="py-2 text-xs text-[#4B5563] truncate">{userEmail}</span>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="py-2.5 text-center bg-[#2563EB] text-white text-sm font-semibold rounded-lg"
                  >
                    Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="py-2.5 text-sm text-[#9CA3AF] hover:text-white transition-colors"
                  >
                    Log in
                  </Link>
                  <a
                    href={MARKETPLACE_URL}
                    className="py-2.5 text-center bg-[#2563EB] text-white text-sm font-semibold rounded-lg"
                  >
                    Install free
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
