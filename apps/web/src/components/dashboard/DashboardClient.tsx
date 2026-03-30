'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { DEMO_DATA, fmtMs, type SummaryData, useDashboardData } from './DashboardData';
import WeekChart from './WeekChart';

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

function getSessionTone(data: SummaryData): {
  headline: string;
  copy: string;
  badge: string;
  badgeClass: string;
} {
  if (data.today.loops === 0 && data.today.timeWastedMs === 0) {
    return {
      headline: 'Quiet session. Keep your prompts sharp.',
      copy: 'No repeat-debugging pressure today. Use the context engine to stay lean before the next error snowballs.',
      badge: 'Calm signal',
      badgeClass: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300',
    };
  }

  if (data.today.timeWastedMs >= 30 * 60 * 1000 || data.today.loops >= 3) {
    return {
      headline: 'Loop pressure is building today.',
      copy: 'You have enough signal to intervene now: tighten the prompt, isolate the bug, and send smaller context before repetition hardens.',
      badge: 'Needs attention',
      badgeClass: 'border-amber-400/20 bg-amber-400/10 text-amber-300',
    };
  }

  return {
    headline: 'A few repeats showed up, but the session is still recoverable.',
    copy: 'Watch the active patterns, keep context narrow, and you can prevent small retries from turning into a long debugging spiral.',
    badge: 'Watch closely',
    badgeClass: 'border-sky-400/20 bg-sky-400/10 text-sky-300',
  };
}

function getActiveLoopCount(data: SummaryData): number {
  return data.recentLoops.filter((loop) => loop.status === 'active').length;
}

function getTopPatternLabel(data: SummaryData): string {
  const top = data.topErrorHashes[0];
  if (top === undefined) return 'No recurring pattern';
  return `${top.hash} · ${top.count} repeats`;
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: 'border-rose-400/20 bg-rose-400/10 text-rose-300',
    resolved: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300',
    ignored: 'border-white/10 bg-white/5 text-slate-400',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] ${
        map[status] ?? map.ignored
      }`}
    >
      {status}
    </span>
  );
}

function formatUpdatedLabel(updatedAt: number): string {
  const elapsedMs = Date.now() - updatedAt;
  const elapsedSeconds = Math.max(0, Math.round(elapsedMs / 1000));

  if (elapsedSeconds < 10) return 'Updated just now';
  if (elapsedSeconds < 60) return `Updated ${elapsedSeconds}s ago`;

  const elapsedMinutes = Math.round(elapsedSeconds / 60);
  if (elapsedMinutes < 60) return `Updated ${elapsedMinutes}m ago`;

  const elapsedHours = Math.round(elapsedMinutes / 60);
  return `Updated ${elapsedHours}h ago`;
}

function DashboardShell({
  children,
  mode,
  updatedAt,
}: {
  children: ReactNode;
  mode: 'live' | 'demo' | 'static';
  updatedAt?: number;
}) {
  return (
    <div className="min-h-screen overflow-hidden bg-[#07111f] text-[#E5E7EB]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-[380px] bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),transparent_58%)]" />
        <div className="absolute right-[-12%] top-[22%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.14),transparent_65%)] blur-3xl" />
        <div className="absolute left-[-10%] bottom-[-8%] h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.12),transparent_60%)] blur-3xl" />
      </div>
      <TopBar mode={mode} updatedAt={updatedAt} />
      <main className="relative mx-auto flex w-full max-w-7xl flex-col gap-6 px-5 py-6 sm:px-6 lg:px-8 lg:py-8">
        {children}
      </main>
    </div>
  );
}

function TopBar({
  mode,
  updatedAt,
}: {
  mode: 'live' | 'demo' | 'static';
  updatedAt?: number;
}) {
  const isLive = mode === 'live';
  const isDemo = mode === 'demo';

  return (
    <header className="sticky top-0 z-40 border-b border-white/8 bg-[#07111f]/72 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-sky-400/20 bg-sky-400/10 shadow-[0_0_24px_rgba(34,211,238,0.12)]">
              <svg width="24" height="24" viewBox="0 0 34 34" fill="none" aria-hidden="true">
                <path d="M17 2L3 8v10c0 8.3 5.8 15.8 14 17.7C25.2 33.8 31 26.3 31 18V8L17 2z" fill="url(#topbarShield)" />
                <defs>
                  <linearGradient id="topbarShield" x1="3" y1="2" x2="31" y2="35" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#22D3EE" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-500">LoopGuard</div>
              <div className="text-sm font-semibold text-white">Dashboard</div>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-medium ${
              isLive
                ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300'
                : isDemo
                  ? 'border-amber-400/20 bg-amber-400/10 text-amber-300'
                  : 'border-white/10 bg-white/[0.04] text-slate-300'
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                isLive ? 'bg-emerald-300 animate-pulse' : isDemo ? 'bg-amber-300' : 'bg-slate-400'
              }`}
            />
            {isLive ? 'Live metrics' : isDemo ? 'Demo metrics' : 'Dashboard'}
          </div>
          {mode !== 'static' && (
            <div className="hidden rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-medium text-slate-300 sm:inline-flex">
              {isLive && updatedAt !== undefined ? formatUpdatedLabel(updatedAt) : 'Retrying every 15s'}
            </div>
          )}
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-[11px] font-medium text-emerald-300 transition hover:border-emerald-400/40 hover:bg-emerald-400/15"
          >
            Free · all features
          </Link>
        </div>
      </div>
    </header>
  );
}

function HeroMetric({
  label,
  value,
  detail,
  valueClass,
}: {
  label: string;
  value: string;
  detail: string;
  valueClass: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm">
      <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">{label}</div>
      <div className={`mt-3 text-3xl font-semibold tracking-[-0.04em] ${valueClass}`}>{value}</div>
      <div className="mt-2 text-sm leading-6 text-slate-400">{detail}</div>
    </div>
  );
}

function UtilityCard({
  label,
  value,
  detail,
  accentClass,
  icon,
}: {
  label: string;
  value: string;
  detail: string;
  accentClass: string;
  icon: string;
}) {
  return (
    <div className="rounded-[26px] border border-white/8 bg-[#0d1827]/85 p-5 shadow-[0_24px_60px_rgba(0,0,0,0.18)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">{label}</div>
          <div className={`mt-4 text-[2rem] font-semibold tracking-[-0.05em] ${accentClass}`}>{value}</div>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl border border-white/8 bg-white/[0.04] ${accentClass}`}>
          <Icon path={icon} />
        </div>
      </div>
      <div className="mt-3 text-sm leading-6 text-slate-400">{detail}</div>
    </div>
  );
}

function SectionFrame({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[30px] border border-white/8 bg-[#0b1625]/88 p-5 shadow-[0_28px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl sm:p-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">{eyebrow}</div>
          <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-white">{title}</h2>
          <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function StateBanner({
  title,
  copy,
  ctaHref,
  ctaLabel,
}: {
  title: string;
  copy: string;
  ctaHref: string;
  ctaLabel: string;
}) {
  return (
    <div className="rounded-[28px] border border-sky-400/20 bg-[linear-gradient(145deg,rgba(37,99,235,0.12),rgba(8,15,30,0.72))] p-5 shadow-[0_18px_48px_rgba(8,15,30,0.3)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-2xl">
          <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-300">Account status</div>
          <h2 className="mt-2 text-lg font-semibold tracking-[-0.03em] text-white">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">{copy}</p>
        </div>
        <Link
          href={ctaHref}
          className="inline-flex items-center justify-center rounded-full bg-sky-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
        >
          {ctaLabel}
        </Link>
      </div>
    </div>
  );
}

function RecentLoopsPanel({ data }: { data: SummaryData }) {
  return (
    <SectionFrame
      eyebrow="Recent loops"
      title="Where the session started repeating"
      subtitle="A clean list of the most recent patterns, with just enough context to act."
    >
      <div className="overflow-hidden rounded-[24px] border border-white/8">
        {data.recentLoops.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-slate-500">
            No loops detected yet. Keep the session moving.
          </div>
        ) : (
          <div className="divide-y divide-white/6">
            {data.recentLoops.map((loop) => {
              const minutesAgo = Math.max(1, Math.round((Date.now() - loop.detectedAt) / 60_000));
              const timeLabel = minutesAgo < 60
                ? `${minutesAgo}m ago`
                : `${Math.floor(minutesAgo / 60)}h ago`;

              return (
                <div
                  key={loop.id}
                  className="grid gap-3 bg-white/[0.03] px-5 py-4 transition hover:bg-white/[0.05] sm:grid-cols-[1fr_auto]"
                >
                  <div>
                    <div className="font-mono text-xs tracking-[0.18em] text-slate-300">{loop.errorHash}</div>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-slate-500">
                      <span>.{loop.fileType}</span>
                      <span>{loop.occurrences} repeats</span>
                      <span>{fmtMs(loop.timeWastedMs)} wasted</span>
                      <span>{timeLabel}</span>
                    </div>
                  </div>
                  <div className="flex items-center sm:justify-end">
                    <StatusPill status={loop.status} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </SectionFrame>
  );
}

function PatternPanel({ data }: { data: SummaryData }) {
  const maxCount = data.topErrorHashes[0]?.count ?? 1;

  return (
    <SectionFrame
      eyebrow="Pattern radar"
      title="This week’s repeat offenders"
      subtitle="Frequency-first ranking so the noisiest error hashes surface immediately."
    >
      <div className="space-y-4">
        {data.topErrorHashes.length === 0 && (
          <div className="rounded-[24px] border border-white/8 bg-white/[0.03] px-5 py-8 text-sm text-slate-500">
            No recurring hashes yet.
          </div>
        )}

        {data.topErrorHashes.map((entry, index) => {
          const width = Math.max(10, (entry.count / maxCount) * 100);
          const barClass = index === 0
            ? 'from-rose-400 via-amber-300 to-cyan-300'
            : 'from-blue-500 to-cyan-300';

          return (
            <div key={entry.hash} className="space-y-2 rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-[11px] tracking-[0.18em] text-slate-300">{entry.hash}</span>
                <span className="text-sm font-semibold text-white">{entry.count}x</span>
              </div>
              <div className="h-2 rounded-full bg-white/8">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${barClass} transition-[width] duration-700`}
                  style={{ width: `${width}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </SectionFrame>
  );
}

function EnginePanel({ data }: { data: SummaryData }) {
  return (
    <SectionFrame
      eyebrow="Context engine"
      title="Compression that keeps prompts readable"
      subtitle="Smaller context, better interventions, lower cost."
    >
      <div className="space-y-4">
        <div className="rounded-[24px] border border-cyan-400/15 bg-[linear-gradient(145deg,rgba(8,15,30,0.88),rgba(15,32,53,0.9))] p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">Engine mode</div>
              <div className="mt-2 text-lg font-semibold tracking-[-0.03em] text-white">Rust engine 89–99%</div>
            </div>
            <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-300">
              Optimal
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Week tokens saved</div>
              <div className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-cyan-300">
                {data.thisWeek.tokensSaved.toLocaleString()}
              </div>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Week cost saved</div>
              <div className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-emerald-300">
                ${data.thisWeek.costSaved.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
          <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">More tools</div>
          <h3 className="mt-2 text-lg font-semibold tracking-[-0.03em] text-white">Wire MCP and shell hooks into the same loop guardrail.</h3>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Shell hooks, MCP setup, and the full context engine are all free. Follow the setup guide to activate them.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/setup"
              className="inline-flex items-center justify-center rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
            >
              Setup guide
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white transition hover:border-cyan-400/25 hover:bg-cyan-400/10"
            >
              Create free account
            </Link>
          </div>
        </div>
      </div>
    </SectionFrame>
  );
}

function ActionPanel({ data }: { data: SummaryData }) {
  const activeLoops = getActiveLoopCount(data);
  const actions = [
    'Ask the model to explain the error before proposing code.',
    'Strip the bug into the smallest reproduction before the next prompt.',
    'Use LoopGuard context instead of sending the whole file.',
  ];

  return (
    <SectionFrame
      eyebrow="Intervene"
      title={activeLoops > 0 ? `${activeLoops} active loop${activeLoops === 1 ? '' : 's'} need a calmer next move` : 'No active loop is screaming right now'}
      subtitle="These are the next actions that reduce repeat debugging instead of decorating it."
    >
      <div className="space-y-3">
        {actions.map((action, index) => (
          <div key={action} className="flex gap-3 rounded-[22px] border border-white/8 bg-white/[0.03] p-4">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-sky-400/20 bg-sky-400/10 text-sm font-semibold text-sky-300">
              {index + 1}
            </div>
            <p className="pt-1 text-sm leading-6 text-slate-300">{action}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-[24px] border border-white/8 bg-[#081220] p-5">
        <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">Quick facts</div>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-300">
          <div>
            <div className="text-slate-500">Active loops</div>
            <div className="mt-1 text-xl font-semibold tracking-[-0.03em] text-white">{activeLoops}</div>
          </div>
          <div>
            <div className="text-slate-500">Top pattern</div>
            <div className="mt-1 text-sm font-medium text-white">{getTopPatternLabel(data)}</div>
          </div>
        </div>
      </div>
    </SectionFrame>
  );
}

function Skeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-[300px] rounded-[32px] border border-white/8 bg-white/[0.04]" />
      <div className="grid gap-4 lg:grid-cols-4">
        {[0, 1, 2, 3].map((index) => (
          <div key={index} className="h-36 rounded-[26px] border border-white/8 bg-white/[0.04]" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <div className="h-[420px] rounded-[30px] border border-white/8 bg-white/[0.04]" />
        <div className="h-[420px] rounded-[30px] border border-white/8 bg-white/[0.04]" />
      </div>
    </div>
  );
}

function DashboardBody({
  data,
  isDemo,
  error,
}: {
  data: SummaryData;
  isDemo: boolean;
  error?: string;
}) {
  const tone = getSessionTone(data);
  const activeLoops = getActiveLoopCount(data);

  return (
    <>
      {isDemo && (
        <StateBanner
          title="You’re looking at sample metrics."
          copy={
            error
              ? `The API is currently unavailable (${error}), so the dashboard fell back to demo data. Your layout and interactions are real; the numbers are placeholders.`
              : 'Install the extension and sign in to replace the sample numbers with your real session history automatically.'
          }
          ctaHref="/setup"
          ctaLabel="Install extension"
        />
      )}

      <section className="relative overflow-hidden rounded-[32px] border border-white/8 bg-[linear-gradient(145deg,rgba(11,22,37,0.96),rgba(9,18,33,0.82))] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.28)] sm:p-8">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-y-0 right-0 w-[52%] bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.16),transparent_58%)]" />
          <div className="absolute left-0 top-0 h-24 w-full bg-[linear-gradient(90deg,rgba(59,130,246,0.2),transparent)]" />
        </div>

        <div className="relative grid gap-6 xl:grid-cols-[1.45fr_0.95fr] xl:gap-8">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <div className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] ${tone.badgeClass}`}>
                {tone.badge}
              </div>
              <div className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                Private by default
              </div>
            </div>

            <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.06em] text-white sm:text-5xl">
              {tone.headline}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              {tone.copy}
            </p>

            <div className="mt-8 grid gap-3 md:grid-cols-3">
              <HeroMetric
                label="Time wasted today"
                value={fmtMs(data.today.timeWastedMs)}
                detail={`${fmtMs(data.thisWeek.timeWastedMs)} this week`}
                valueClass="text-rose-300"
              />
              <HeroMetric
                label="Tokens saved today"
                value={data.today.tokensSaved.toLocaleString()}
                detail={`${data.thisWeek.tokensSaved.toLocaleString()} this week`}
                valueClass="text-cyan-300"
              />
              <HeroMetric
                label="Loops detected today"
                value={String(data.today.loops)}
                detail={`${data.thisWeek.loops} this week`}
                valueClass="text-amber-300"
              />
            </div>
          </div>

          <aside className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
            <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">Session readout</div>
            <div className="mt-4 grid gap-4">
              <div className="rounded-[22px] border border-white/8 bg-[#081220] p-4">
                <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Active loops</div>
                <div className="mt-2 text-4xl font-semibold tracking-[-0.05em] text-white">{activeLoops}</div>
                <div className="mt-2 text-sm leading-6 text-slate-400">
                  {activeLoops === 0
                    ? 'No unresolved loops are visible in recent activity.'
                    : 'Use the context engine before the next retry compounds the same pattern.'}
                </div>
              </div>

              <div className="rounded-[22px] border border-white/8 bg-[#081220] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Top pattern</div>
                  <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-300">
                    This week
                  </div>
                </div>
                <div className="mt-3 font-mono text-sm tracking-[0.18em] text-slate-200">{getTopPatternLabel(data)}</div>
              </div>

              <div className="rounded-[22px] border border-white/8 bg-[#081220] p-4">
                <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Immediate actions</div>
                <div className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
                  <div>1. Narrow the prompt to the failing inputs and exact error.</div>
                  <div>2. Reproduce the bug in the smallest possible file.</div>
                  <div>3. Let LoopGuard feed the model a smaller context window.</div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <UtilityCard
          label="Loops this week"
          value={String(data.thisWeek.loops)}
          detail="How many times repeat diagnostics crossed the threshold."
          accentClass="text-amber-300"
          icon="M17 1l4 4-4 4M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 01-4 4H3"
        />
        <UtilityCard
          label="Time lost this week"
          value={fmtMs(data.thisWeek.timeWastedMs)}
          detail="The emotional cost number. This is the one users feel first."
          accentClass="text-rose-300"
          icon="M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10zm0-10V7"
        />
        <UtilityCard
          label="Tokens saved this week"
          value={data.thisWeek.tokensSaved.toLocaleString()}
          detail="Context trimmed away before it became prompt noise."
          accentClass="text-cyan-300"
          icon="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 6v4l3 3"
        />
        <UtilityCard
          label="Cost saved this week"
          value={`$${data.thisWeek.costSaved.toFixed(2)}`}
          detail="Estimated using the dashboard’s current token-cost model."
          accentClass="text-emerald-300"
          icon="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"
        />
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
        <WeekChart data={data.weeklyBreakdown} />
        <PatternPanel data={data} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.95fr]">
        <RecentLoopsPanel data={data} />
        <div className="grid gap-6">
          <ActionPanel data={data} />
          <EnginePanel data={data} />
        </div>
      </div>
    </>
  );
}

function Footer() {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-white/8 px-1 pt-2 text-xs text-slate-500">
      <div>
        Your code never leaves your machine.{' '}
        <Link href="/docs" className="text-slate-400 underline underline-offset-4 transition hover:text-white">
          Privacy docs
        </Link>
      </div>
      <Link href="/" className="transition hover:text-white">
        Back to homepage
      </Link>
    </footer>
  );
}

export default function DashboardClient() {
  const state = useDashboardData();

  if (state.status === 'loading') {
    return (
      <DashboardShell mode="static">
        <Skeleton />
      </DashboardShell>
    );
  }

  if (state.status === 'not-authed') {
    return (
      <DashboardShell mode="static">
        <StateBanner
          title="Real metrics start after sign-in."
          copy="You can explore the dashboard right now with sample data, then connect the extension whenever you want live session metrics, history, and sync."
          ctaHref="/signup"
          ctaLabel="Create free account"
        />
        <DashboardBody data={DEMO_DATA} isDemo={false} />
        <Footer />
      </DashboardShell>
    );
  }

  const data = state.status === 'live' ? state.data : (state.data ?? DEMO_DATA);
  const isDemo = state.status === 'demo';
  const error = state.status === 'demo' ? state.error : undefined;

  return (
    <DashboardShell
      mode={state.status === 'live' ? 'live' : 'demo'}
      updatedAt={state.updatedAt}
    >
      <DashboardBody data={data} isDemo={isDemo} error={error} />
      <Footer />
    </DashboardShell>
  );
}
