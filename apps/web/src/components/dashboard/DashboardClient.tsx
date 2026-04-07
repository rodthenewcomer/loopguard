'use client';

import Link from 'next/link';
import { useDashboardData, fmtMs, type SummaryData } from './DashboardData';
import WeekChart from './WeekChart';
import LoopGuardLogo from '../LoopGuardLogo';

// ─── helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

function timeAgo(ms: number): string {
  const min = Math.max(1, Math.round((Date.now() - ms) / 60_000));
  if (min < 60) return `${min}m ago`;
  return `${Math.floor(min / 60)}h ago`;
}

// ─── sub-components ───────────────────────────────────────────────────────────

function StatusDot({ live }: { live: boolean }) {
  return (
    <span className="flex items-center gap-1.5 rounded-full border border-[#1A2740] bg-[#0D1826] px-3 py-1">
      <span
        className={`inline-block h-1.5 w-1.5 rounded-full ${live ? 'animate-pulse bg-emerald-400' : 'bg-slate-500'}`}
      />
      <span className="text-[11px] font-medium text-slate-400">
        {live ? 'Live metrics' : 'Demo mode'}
      </span>
    </span>
  );
}

function TopBar({ live, updatedAt }: { live: boolean; updatedAt: number | null }) {
  return (
    <header className="sticky top-0 z-30 border-b border-[#1A2740] bg-[#050B14]/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <LoopGuardLogo showWordmark size={22} />
          <span className="hidden text-xs text-slate-600 sm:inline">/ dashboard</span>
        </Link>
        <div className="flex items-center gap-3">
          <StatusDot live={live} />
          {updatedAt !== null && (
            <span className="hidden text-xs text-slate-700 sm:inline">
              {timeAgo(updatedAt)}
            </span>
          )}
          {!live && (
            <Link
              href="/login"
              className="rounded-lg bg-[#0D1826] border border-[#1A2740] px-3 py-1.5 text-xs font-medium text-slate-400 transition hover:border-[#22D3EE]/30 hover:text-slate-200"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

function DemoBanner({ error }: { error?: string }) {
  return (
    <div className="border-b border-amber-500/15 bg-amber-500/[0.04]">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
        <p className="text-xs text-amber-400/70">
          {error
            ? `Could not reach the API — showing demo data.`
            : 'Showing demo data. Sign in to see your real session metrics.'}
        </p>
        <Link
          href="/login"
          className="flex-shrink-0 rounded-lg border border-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-400 transition hover:border-amber-500/40 hover:text-amber-300"
        >
          Sign in →
        </Link>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub: string;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-[#1A2740] bg-[#0D1826] p-6">
      <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
        {label}
      </div>
      <div className={`font-mono text-3xl font-bold tabular-nums ${accent}`}>
        {value}
      </div>
      <div className="mt-2 text-xs text-slate-600">{sub}</div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active:   'bg-red-500/10 text-red-400 border border-red-500/20',
    resolved: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    ignored:  'bg-slate-800 text-slate-500 border border-slate-700',
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${styles[status] ?? styles['ignored']}`}>
      {status}
    </span>
  );
}

function LoopRow({ loop }: { loop: SummaryData['recentLoops'][number] }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#1A2740] px-6 py-4 last:border-0 transition-colors hover:bg-white/[0.015]">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-slate-300">{loop.errorHash}</span>
          <span className="rounded bg-[#1A2740] px-1.5 py-0.5 font-mono text-[10px] text-slate-500">.{loop.fileType}</span>
        </div>
        <div className="mt-1 text-[11px] text-slate-600">
          {loop.occurrences}× repeated · {fmtMs(loop.timeWastedMs)} lost
        </div>
      </div>
      <div className="flex flex-shrink-0 items-center gap-3">
        <span className="text-[11px] text-slate-700">{timeAgo(loop.detectedAt)}</span>
        <StatusPill status={loop.status} />
      </div>
    </div>
  );
}

function EmptyLoops() {
  return (
    <div className="flex flex-col items-center py-14 text-center">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
      </div>
      <div className="text-sm font-medium text-slate-400">No loops detected</div>
      <div className="mt-1 text-xs text-slate-600">Next alert will appear here automatically.</div>
    </div>
  );
}

function TopPatterns({ hashes }: { hashes: SummaryData['topErrorHashes'] }) {
  if (hashes.length === 0) return null;
  const max = hashes[0]?.count ?? 1;
  return (
    <div className="rounded-2xl border border-[#1A2740] bg-[#0D1826] p-6">
      <div className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
        Top patterns
      </div>
      <div className="space-y-4">
        {hashes.slice(0, 5).map((h) => (
          <div key={h.hash}>
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <span className="font-mono text-xs text-slate-400">{h.hash}</span>
              <span className="text-xs font-bold text-amber-400">{h.count}×</span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-[#1A2740]">
              <div
                className="h-full rounded-full bg-amber-400/50 transition-all"
                style={{ width: `${Math.round((h.count / max) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActiveAlert({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-red-500/20 bg-red-500/[0.04] p-5">
      <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-400">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
      </div>
      <div>
        <div className="text-sm font-semibold text-red-400">
          {count} active loop{count > 1 ? 's' : ''} right now
        </div>
        <div className="mt-1 text-xs text-slate-500">
          Stop retrying the same fix. Narrow the prompt to one failing case, strip the bug to its smallest reproduction, then paste focused context.
        </div>
      </div>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse space-y-5 px-6 py-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-[#0D1826]" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="h-64 rounded-2xl bg-[#0D1826] lg:col-span-2" />
        <div className="h-64 rounded-2xl bg-[#0D1826]" />
      </div>
      <div className="h-56 rounded-2xl bg-[#0D1826]" />
    </div>
  );
}

// ─── main dashboard body ──────────────────────────────────────────────────────

function NoActivityYet() {
  return (
    <div className="rounded-2xl border border-[#1A2740] bg-[#0D1826] p-6">
      <div className="flex items-start gap-4">
        <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-[#22D3EE]/20 bg-[#22D3EE]/5 text-[#22D3EE]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-300">No activity recorded yet</div>
          <p className="mt-1 text-xs leading-5 text-slate-600">
            LoopGuard is connected and watching. Metrics appear here as you work:
          </p>
          <ul className="mt-2 space-y-1 text-xs text-slate-600">
            <li className="flex items-center gap-2">
              <span className="text-amber-400">→</span>
              <span><strong className="text-slate-500">Loop detection:</strong> trigger the same diagnostic error 3× in one session</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#22D3EE]">→</span>
              <span><strong className="text-slate-500">Token savings:</strong> use <code className="rounded bg-[#1A2740] px-1 text-[10px]">Copy Optimized Context</code> from the LoopGuard sidebar</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function DashboardBody({ data, isLive }: { data: SummaryData; isLive: boolean }) {
  const activeCount = data.recentLoops.filter((l) => l.status === 'active').length;
  const hasActivity = data.allTime.loops > 0 || data.allTime.tokensSaved > 0;

  return (
    <div className="mx-auto max-w-6xl space-y-5 px-4 py-6 sm:px-6 sm:py-8">
      {/* KPI row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Loops today"
          value={String(data.today.loops)}
          sub={`${data.thisWeek.loops} this week`}
          accent={data.today.loops > 0 ? 'text-amber-400' : 'text-slate-200'}
        />
        <MetricCard
          label="Time wasted"
          value={fmtMs(data.today.timeWastedMs)}
          sub={`${fmtMs(data.thisWeek.timeWastedMs)} this week`}
          accent={data.today.timeWastedMs > 0 ? 'text-amber-400' : 'text-slate-200'}
        />
        <MetricCard
          label="Tokens saved"
          value={fmt(data.allTime.tokensSaved)}
          sub={`${fmt(data.thisWeek.tokensSaved)} this week`}
          accent="text-[#22D3EE]"
        />
        <MetricCard
          label="Cost saved"
          value={`$${data.allTime.costSaved.toFixed(2)}`}
          sub={`$${data.thisWeek.costSaved.toFixed(2)} this week`}
          accent="text-emerald-400"
        />
      </div>

      {/* no activity yet — only in live mode with no data */}
      {isLive && !hasActivity && <NoActivityYet />}

      {/* active loops alert */}
      <ActiveAlert count={activeCount} />

      {/* chart + patterns */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-[#1A2740] bg-[#0D1826] p-6 lg:col-span-2">
          <div className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
            Token savings · 7 days
          </div>
          <WeekChart data={data.weeklyBreakdown} />
        </div>
        <TopPatterns hashes={data.topErrorHashes} />
      </div>

      {/* recent loops */}
      <div className="rounded-2xl border border-[#1A2740] bg-[#0D1826]">
        <div className="flex items-center justify-between border-b border-[#1A2740] px-6 py-4">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
            Recent loops
          </div>
          {activeCount > 0 && (
            <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold text-red-400">
              {activeCount} active
            </span>
          )}
        </div>
        {data.recentLoops.length === 0 ? (
          <EmptyLoops />
        ) : (
          data.recentLoops.slice(0, 10).map((l) => <LoopRow key={l.id} loop={l} />)
        )}
      </div>
    </div>
  );
}

// ─── root ─────────────────────────────────────────────────────────────────────

export default function DashboardClient() {
  const state = useDashboardData();

  if (state.status === 'loading') {
    return (
      <div className="min-h-screen bg-[#050B14]">
        <TopBar live={false} updatedAt={null} />
        <Skeleton />
      </div>
    );
  }

  const isLive = state.status === 'live';
  const showBanner = state.status === 'demo' || state.status === 'not-authed';
  const error = state.status === 'demo' ? state.error : undefined;
  const updatedAt = state.status !== 'not-authed' ? state.updatedAt : null;
  const data = state.status === 'live' || state.status === 'demo' ? state.data : DEMO_DATA;

  return (
    <div className="min-h-screen bg-[#050B14]">
      <TopBar live={isLive} updatedAt={updatedAt} />
      {showBanner && <DemoBanner error={error} />}
      <DashboardBody data={data} isLive={isLive} />
      <footer className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 border-t border-[#1A2740] px-4 py-5 text-xs text-slate-700 sm:px-6 sm:py-6">
        <span>Your code never leaves your machine.</span>
        <Link href="/privacy" className="transition hover:text-slate-500">Privacy</Link>
      </footer>
    </div>
  );
}

// ─── demo / fallback data ─────────────────────────────────────────────────────

const DEMO_DATA: SummaryData = {
  thisWeek: { loops: 7, timeWastedMs: 38 * 60 * 1000, tokensSaved: 84_200, costSaved: 0.25 },
  today:    { loops: 2, timeWastedMs: 14 * 60 * 1000, tokensSaved: 12_400, costSaved: 0.04 },
  allTime:  { loops: 41, timeWastedMs: 6 * 60 * 60 * 1000, tokensSaved: 1_240_000, costSaved: 3.72 },
  weeklyBreakdown: [
    { date: 'Mon', loops: 1, tokensSaved: 8_200 },
    { date: 'Tue', loops: 2, tokensSaved: 21_000 },
    { date: 'Wed', loops: 0, tokensSaved: 14_600 },
    { date: 'Thu', loops: 1, tokensSaved: 19_400 },
    { date: 'Fri', loops: 2, tokensSaved: 11_800 },
    { date: 'Sat', loops: 0, tokensSaved: 5_200 },
    { date: 'Sun', loops: 1, tokensSaved: 4_000 },
  ],
  recentLoops: [
    { id: '1', errorHash: 'a1b2c3d4', occurrences: 4, timeWastedMs: 32 * 60 * 1000, fileType: 'ts', status: 'resolved', detectedAt: Date.now() - 90 * 60 * 1000 },
    { id: '2', errorHash: 'e5f6g7h8', occurrences: 3, timeWastedMs: 18 * 60 * 1000, fileType: 'ts', status: 'active',   detectedAt: Date.now() - 30 * 60 * 1000 },
    { id: '3', errorHash: 'i9j0k1l2', occurrences: 2, timeWastedMs:  9 * 60 * 1000, fileType: 'py', status: 'resolved', detectedAt: Date.now() - 3 * 60 * 60 * 1000 },
  ],
  topErrorHashes: [
    { hash: 'a1b2c3d4', count: 4 },
    { hash: 'e5f6g7h8', count: 3 },
    { hash: 'i9j0k1l2', count: 2 },
  ],
};
