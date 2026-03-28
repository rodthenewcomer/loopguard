'use client';
import Link from 'next/link';
import { useDashboardData, fmtMs, DEMO_DATA, type SummaryData } from './DashboardData';
import WeekChart from './WeekChart';

/* ── Icon helper ─────────────────────────────────── */
function Icon({ path, size = 18 }: { path: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  );
}

/* ── Stat card ───────────────────────────────────── */
function StatCard({
  label, value, sub, accent, icon,
}: {
  label: string; value: string; sub: string; accent: string; icon: string;
}) {
  return (
    <div
      className="p-5 rounded-2xl border border-[#1F2937] hover:border-[#374151] transition-colors duration-300"
      style={{ background: 'linear-gradient(145deg, #111827, #0f172a)' }}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: accent + '18', color: accent }}
        >
          <Icon path={icon} />
        </div>
        <span className="text-xs text-[#4B5563]">{sub}</span>
      </div>
      <div className="text-3xl font-black tabular-nums" style={{ color: accent }}>{value}</div>
      <div className="text-sm text-[#6B7280] mt-1">{label}</div>
    </div>
  );
}

/* ── Status pill ─────────────────────────────────── */
function StatusPill({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    active:   { label: 'Active',   color: '#EF4444', bg: '#EF444422' },
    resolved: { label: 'Resolved', color: '#22C55E', bg: '#22C55E22' },
    ignored:  { label: 'Ignored',  color: '#6B7280', bg: '#6B728022' },
  };
  const s = map[status] ?? map['ignored']!;
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide"
      style={{ color: s.color, background: s.bg }}
    >
      {s.label}
    </span>
  );
}

/* ── Loading skeleton ────────────────────────────── */
function Skeleton() {
  return (
    <div className="animate-pulse space-y-6 py-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-[#111827] border border-[#1F2937]" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 h-64 rounded-2xl bg-[#111827] border border-[#1F2937]" />
        <div className="h-64 rounded-2xl bg-[#111827] border border-[#1F2937]" />
      </div>
    </div>
  );
}

/* ── Not authed state ────────────────────────────── */
function NotAuthed() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-center mb-6">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-white mb-3">Connect your extension</h2>
      <p className="text-[#6B7280] text-sm max-w-sm leading-relaxed mb-8">
        Install the VS Code extension and sign in to start syncing your session metrics here.
        Loop counts, time wasted, and tokens saved — all in one place.
      </p>
      <div className="flex items-center gap-3">
        <a
          href="https://marketplace.visualstudio.com/items?itemName=loopguard-dev.loopguard"
          className="px-5 py-2.5 bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-bold rounded-xl transition-colors text-sm"
        >
          Install Extension
        </a>
        <Link
          href="/docs"
          className="px-5 py-2.5 border border-[#374151] hover:border-[#4B5563] text-[#9CA3AF] hover:text-white font-medium rounded-xl transition-colors text-sm"
        >
          View docs
        </Link>
      </div>
    </div>
  );
}

/* ── Dashboard body (live + demo) ────────────────── */
function DashboardBody({
  data,
  isDemo,
  error,
}: {
  data: SummaryData;
  isDemo: boolean;
  error?: string;
}) {
  const maxHash = data.topErrorHashes[0]?.count ?? 1;

  return (
    <>
      {/* Demo / error banner */}
      {isDemo && (
        <div className="mb-6 p-4 rounded-xl border border-[#F59E0B]/30 bg-[#F59E0B]/5 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[#F59E0B]">⚡</span>
            <span className="text-sm font-bold text-[#F59E0B]">Demo Mode</span>
          </div>
          <p className="text-sm text-[#9CA3AF] flex-1">
            {error
              ? `API unavailable (${error}) — showing sample data. Install the extension to sync live metrics.`
              : 'This is sample data. Install the VS Code extension and sign in to see your real metrics.'}
          </p>
          <a
            href="https://marketplace.visualstudio.com/items?itemName=loopguard-dev.loopguard"
            className="flex-shrink-0 text-xs px-3 py-1.5 bg-[#F59E0B]/15 hover:bg-[#F59E0B]/25 text-[#F59E0B] border border-[#F59E0B]/30 rounded-lg transition-colors font-medium whitespace-nowrap"
          >
            Install Extension →
          </a>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Loops today"
          value={String(data.today.loops)}
          sub={`${data.thisWeek.loops} this week`}
          accent="#F59E0B"
          icon="M17 1l4 4-4 4M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 01-4 4H3"
        />
        <StatCard
          label="Time wasted today"
          value={fmtMs(data.today.timeWastedMs)}
          sub={`${fmtMs(data.thisWeek.timeWastedMs)} this week`}
          accent="#EF4444"
          icon="M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10zm0-10V7"
        />
        <StatCard
          label="Tokens saved today"
          value={data.today.tokensSaved.toLocaleString()}
          sub={`${data.thisWeek.tokensSaved.toLocaleString()} this week`}
          accent="#22D3EE"
          icon="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 6v4l3 3"
        />
        <StatCard
          label="Cost saved this week"
          value={`$${data.thisWeek.costSaved.toFixed(2)}`}
          sub="at $0.03 / 1k tokens"
          accent="#22C55E"
          icon="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"
        />
      </div>

      {/* Chart + Upgrade CTA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2">
          <WeekChart data={data.weeklyBreakdown} />
        </div>

        <div
          className="card-pro rounded-2xl p-6 flex flex-col justify-between"
          style={{ background: 'linear-gradient(145deg, #131f35, #0f1c32)' }}
        >
          <div>
            <div className="text-xs text-[#22D3EE] font-bold uppercase tracking-widest mb-3">Unlock Pro</div>
            <h3 className="text-white font-bold text-lg leading-snug mb-3">
              Save even more.<br />
              <span className="text-[#22D3EE]">Rust gets you 93%.</span>
            </h3>
            <p className="text-[#6B7280] text-sm mb-5 leading-relaxed">
              MCP server, shell hooks, and 30 days of session history.
            </p>
            <ul className="space-y-2 mb-6">
              {['Rust engine (89–99% reduction)', 'MCP server for Cursor & Claude', 'Shell hooks — compress CLI output', '30-day session history'].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-[#9CA3AF]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22D3EE" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <a
            href="/#pricing"
            className="block text-center py-2.5 bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-bold rounded-xl transition-all duration-200 text-sm glow-primary"
          >
            Upgrade to Pro — $9/mo
          </a>
        </div>
      </div>

      {/* Recent loops + top errors */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div
          className="lg:col-span-2 rounded-2xl border border-[#1F2937]"
          style={{ background: 'linear-gradient(145deg, #111827, #0f172a)' }}
        >
          <div className="px-5 py-4 border-b border-[#1F2937] flex items-center justify-between">
            <span className="text-sm font-semibold text-[#F9FAFB]">Recent loops</span>
            <span className="text-xs text-[#6B7280]">{data.recentLoops.length} total</span>
          </div>
          <div className="divide-y divide-[#1F2937]">
            {data.recentLoops.map((loop) => {
              const minsAgo = Math.round((Date.now() - loop.detectedAt) / 60_000);
              const timeLabel = minsAgo < 60
                ? `${minsAgo}m ago`
                : `${Math.floor(minsAgo / 60)}h ago`;
              return (
                <div key={loop.id} className="px-5 py-3.5 hover:bg-[#1F2937]/30 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="font-mono text-xs text-[#9CA3AF] truncate mb-1">
                        {loop.errorHash}
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-[#4B5563]">
                        <span className="uppercase tracking-wide">.{loop.fileType}</span>
                        <span>{loop.occurrences}× · {fmtMs(loop.timeWastedMs)}</span>
                        <span>{timeLabel}</span>
                      </div>
                    </div>
                    <StatusPill status={loop.status} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top error patterns */}
        <div
          className="rounded-2xl border border-[#1F2937]"
          style={{ background: 'linear-gradient(145deg, #111827, #0f172a)' }}
        >
          <div className="px-5 py-4 border-b border-[#1F2937]">
            <span className="text-sm font-semibold text-[#F9FAFB]">Top error patterns</span>
            <p className="text-xs text-[#4B5563] mt-0.5">This week by frequency</p>
          </div>
          <div className="p-5 space-y-4">
            {data.topErrorHashes.map((e, i) => {
              const pct = (e.count / maxHash) * 100;
              return (
                <div key={e.hash}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-[11px] text-[#9CA3AF] truncate flex-1 mr-2">{e.hash}</span>
                    <span className="text-[11px] font-bold text-[#F9FAFB] tabular-nums flex-shrink-0">{e.count}×</span>
                  </div>
                  <div className="h-1.5 bg-[#1F2937] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${pct}%`,
                        background: i === 0
                          ? 'linear-gradient(90deg, #EF4444, #F59E0B)'
                          : 'linear-gradient(90deg, #2563EB, #22D3EE)',
                        transitionDelay: `${i * 100}ms`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Context engine status */}
          <div className="px-5 pb-5 pt-1">
            <div className="p-4 rounded-xl border border-[#1F2937] bg-[#0d1117]">
              <div className="text-xs text-[#4B5563] uppercase tracking-widest mb-3">Context engine</div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#6B7280]">Week tokens saved</span>
                <span className="text-[#22D3EE] font-bold text-xs">{data.thisWeek.tokensSaved.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-[#6B7280]">Cost saved</span>
                <span className="text-[#22C55E] font-bold">${data.thisWeek.costSaved.toFixed(2)}</span>
              </div>
              <div className="mt-3 pt-3 border-t border-[#1F2937]">
                <a href="/docs#mcp" className="text-xs text-[#2563EB] hover:text-[#3B82F6] transition-colors">
                  → Set up MCP for 99% reduction
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Top bar ─────────────────────────────────────── */
function TopBar({ isLive }: { isLive: boolean }) {
  return (
    <header className="border-b border-[#1F2937] bg-[#0d1219]/80 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <svg width="26" height="26" viewBox="0 0 34 34" fill="none" aria-hidden="true">
              <path d="M17 2L3 8v10c0 8.3 5.8 15.8 14 17.7C25.2 33.8 31 26.3 31 18V8L17 2z" fill="url(#db)" />
              <defs>
                <linearGradient id="db" x1="3" y1="2" x2="31" y2="35" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#22D3EE" />
                </linearGradient>
              </defs>
            </svg>
            <span className="font-bold text-white text-sm">LoopGuard</span>
          </Link>
          <div className="h-4 w-px bg-[#1F2937]" aria-hidden="true" />
          <span className="text-sm text-[#6B7280]">Dashboard</span>
        </div>

        <div className="flex items-center gap-3">
          {isLive ? (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
              <span className="text-xs text-[#22C55E] font-medium">Live data</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
              <span className="text-xs text-[#F59E0B] font-medium">Demo</span>
            </div>
          )}
          <a
            href="/#pricing"
            className="flex items-center gap-1.5 px-3 py-1 bg-[#1F2937] rounded-full hover:bg-[#374151] transition-colors"
          >
            <span className="text-xs text-[#6B7280] font-medium">Free plan</span>
            <span className="text-[10px] text-[#2563EB] font-bold">→ Upgrade</span>
          </a>
        </div>
      </div>
    </header>
  );
}

/* ── Root export ─────────────────────────────────── */
export default function DashboardClient() {
  const state = useDashboardData();

  if (state.status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0B1220]">
        <TopBar isLive={false} />
        <main className="max-w-7xl mx-auto px-6 py-8">
          <Skeleton />
        </main>
      </div>
    );
  }

  if (state.status === 'not-authed') {
    return (
      <div className="min-h-screen bg-[#0B1220]">
        <TopBar isLive={false} />
        <main className="max-w-7xl mx-auto px-6 py-8">
          <NotAuthed />
        </main>
      </div>
    );
  }

  const data = state.status === 'live' ? state.data : (state.data ?? DEMO_DATA);
  const isDemo = state.status === 'demo';
  const error = state.status === 'demo' ? state.error : undefined;

  return (
    <div className="min-h-screen bg-[#0B1220]">
      <TopBar isLive={state.status === 'live'} />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-[#6B7280] text-sm mt-1">
            {state.status === 'live'
              ? 'Your live session metrics'
              : 'Sample data — install the extension to see live metrics'}
          </p>
        </div>
        <DashboardBody data={data} isDemo={isDemo} error={error} />
        <div className="mt-8 pt-6 border-t border-[#1F2937] flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-[#4B5563]">
            Your code never leaves your machine ·{' '}
            <Link href="/docs" className="text-[#6B7280] hover:text-[#9CA3AF] transition-colors underline underline-offset-2">
              Privacy docs
            </Link>
          </div>
          <Link href="/" className="text-xs text-[#6B7280] hover:text-[#9CA3AF] transition-colors">
            ← Back to homepage
          </Link>
        </div>
      </main>
    </div>
  );
}
