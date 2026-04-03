'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

function Icon({ path, size = 18 }: { path: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

const IC_SPARK  = 'M13 2L3 14h9l-1 8 10-12h-9l1-8z';
const IC_ARROW  = 'M5 12h14M12 5l7 7-7 7';
const IC_GRID   = 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z';

export default function HeroCta() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [ready, setReady]           = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsLoggedIn(!!data.session?.user);
      setReady(true);
    });
  }, []);

  if (!ready) {
    // Invisible placeholder — same height, prevents layout shift
    return <div className="mt-8 flex flex-wrap items-center gap-3 h-[48px]" aria-hidden="true" />;
  }

  if (isLoggedIn) {
    return (
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-full bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(37,99,235,0.35)] transition hover:-translate-y-0.5 hover:bg-[#1D4ED8]"
        >
          <Icon path={IC_GRID} />
          Go to dashboard
        </Link>
        <Link
          href="/docs"
          className="inline-flex items-center gap-2 rounded-full border border-white/12 px-6 py-3 text-sm font-semibold text-[#D6E3F1] transition hover:border-white/25 hover:text-white"
        >
          Read the docs
          <Icon path={IC_ARROW} />
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8 flex flex-wrap items-center gap-3">
      <a
        href="/setup"
        className="inline-flex items-center gap-2 rounded-full bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(37,99,235,0.35)] transition hover:-translate-y-0.5 hover:bg-[#1D4ED8]"
      >
        <Icon path={IC_SPARK} />
        Install extension
      </a>
      <Link
        href="/docs"
        className="inline-flex items-center gap-2 rounded-full border border-white/12 px-6 py-3 text-sm font-semibold text-[#D6E3F1] transition hover:border-white/25 hover:text-white"
      >
        Read the docs
        <Icon path={IC_ARROW} />
      </Link>
    </div>
  );
}
