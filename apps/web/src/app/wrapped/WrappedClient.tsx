'use client';

import Link from 'next/link';
import { useCallback, useState } from 'react';

const API_BASE =
  process.env['NEXT_PUBLIC_API_URL'] ?? 'https://loopguardapi-production.up.railway.app';

interface DeviceStats {
  deviceId: string;
  firstSeen: string;
  lastSynced: string;
  totalTokensSaved: number;
  totalCommands: number;
  totalSessions: number;
  costSaved: number;
  dailyBreakdown: { date: string; tokens_saved: number; commands: number }[];
}

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

function SparkBar({ value, max }: { value: number; max: number }) {
  const pct = max === 0 ? 0 : Math.max(4, Math.round((value / max) * 100));
  return (
    <div className="flex h-full items-end">
      <div
        className="w-full rounded-t-sm bg-gradient-to-t from-cyan-500 to-sky-400 transition-all"
        style={{ height: `${pct}%` }}
      />
    </div>
  );
}

function StatsCard({ stats, shareUrl }: { stats: DeviceStats; shareUrl: string }) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [shareUrl]);

  const days = [...stats.dailyBreakdown].sort((a, b) => a.date.localeCompare(b.date)).slice(-14);
  const maxTokens = Math.max(...days.map((d) => d.tokens_saved), 1);
  const sinceDays = Math.round(
    (Date.now() - new Date(stats.firstSeen).getTime()) / (1000 * 60 * 60 * 24),
  );

  return (
    <div className="relative w-full max-w-lg">
      {/* Glow */}
      <div className="pointer-events-none absolute inset-0 rounded-[40px] bg-[radial-gradient(ellipse_at_top,rgba(34,211,238,0.22),transparent_60%)]" />

      <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-[#080f1c] shadow-[0_40px_120px_rgba(0,0,0,0.6)]">
        {/* Header stripe */}
        <div className="border-b border-white/8 bg-[linear-gradient(135deg,rgba(37,99,235,0.18),rgba(6,182,212,0.12))] px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-400">
                LoopGuard Wrapped
              </div>
              <div className="mt-1 text-sm text-slate-400">
                {sinceDays > 0 ? `${sinceDays} days of sessions` : 'Your session history'}
              </div>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-300" aria-hidden="true">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Hero stat */}
        <div className="px-8 pt-8 pb-6">
          <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
            Total tokens saved
          </div>
          <div className="mt-2 text-6xl font-semibold tracking-[-0.06em] text-white">
            {fmt(stats.totalTokensSaved)}
          </div>
          <div className="mt-2 text-lg font-semibold tracking-[-0.03em] text-emerald-400">
            ${stats.costSaved.toFixed(2)} saved
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3 px-8 pb-6">
          <div className="rounded-[20px] border border-white/8 bg-white/[0.04] p-4">
            <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Sessions</div>
            <div className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-white">
              {stats.totalSessions.toLocaleString()}
            </div>
          </div>
          <div className="rounded-[20px] border border-white/8 bg-white/[0.04] p-4">
            <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Commands</div>
            <div className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-cyan-300">
              {fmt(stats.totalCommands)}
            </div>
          </div>
        </div>

        {/* Spark chart */}
        {days.length > 2 && (
          <div className="px-8 pb-6">
            <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500 mb-3">
              Last 14 days
            </div>
            <div className="flex h-16 items-end gap-1">
              {days.map((d) => (
                <div key={d.date} className="flex-1 h-full">
                  <SparkBar value={d.tokens_saved} max={maxTokens} />
                </div>
              ))}
            </div>
            <div className="mt-1 flex justify-between text-[10px] text-slate-600">
              <span>{days[0]?.date.slice(5) ?? ''}</span>
              <span>{days[days.length - 1]?.date.slice(5) ?? ''}</span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-white/8 px-8 py-5 flex items-center justify-between gap-3">
          <div className="text-[11px] text-slate-600">loopguard.vercel.app</div>
          <button
            onClick={() => void copy()}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/10"
          >
            {copied ? (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                Copied
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                Share stats
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function LookupForm() {
  const [deviceId, setDeviceId] = useState('');
  const [stats, setStats] = useState<DeviceStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lookup = useCallback(async (id: string) => {
    const trimmed = id.trim();
    if (!/^[0-9a-f-]{36}$/.test(trimmed)) {
      setError('Paste the full UUID from ~/.loopguard-ctx/device.json');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${API_BASE}/api/v1/metrics/device-stats?device_id=${encodeURIComponent(trimmed)}`,
      );
      if (res.status === 404) {
        setError('No data synced yet. Run a session first — sync happens automatically at session end.');
        setLoading(false);
        return;
      }
      if (!res.ok) throw new Error(`API ${res.status}`);
      const data = await res.json() as DeviceStats;
      setStats(data);
      window.history.replaceState(null, '', `/wrapped?device_id=${encodeURIComponent(trimmed)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed');
    } finally {
      setLoading(false);
    }
  }, []);

  if (stats !== null) {
    const shareUrl = `https://loopguard.vercel.app/wrapped?device_id=${encodeURIComponent(stats.deviceId)}`;
    return <StatsCard stats={stats} shareUrl={shareUrl} />;
  }

  return (
    <div className="w-full max-w-lg space-y-6">
      <div className="rounded-[32px] border border-white/10 bg-[#0a1525]/80 p-8">
        <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-400">
          Enter your device ID
        </div>
        <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">
          Your stats sync automatically.
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Every Claude Code or Cursor session saves stats locally and syncs them at session end.
          Paste your device ID to see your card.
        </p>

        <div className="mt-5 rounded-[16px] border border-white/8 bg-[#060d18] px-4 py-3 font-mono text-xs text-slate-400">
          cat ~/.loopguard-ctx/device.json
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') void lookup(deviceId); }}
            placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            className="flex-1 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:border-cyan-400/30 focus:ring-1 focus:ring-cyan-400/20"
          />
          <button
            onClick={() => void lookup(deviceId)}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-full bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-50"
          >
            {loading ? 'Loading…' : 'View card'}
          </button>
        </div>

        {error !== null && <p className="mt-3 text-sm text-rose-400">{error}</p>}
      </div>

      <p className="text-center text-xs text-slate-600">
        Don&apos;t have loopguard-ctx yet?{' '}
        <Link href="/setup" className="text-sky-400 transition hover:text-sky-300">
          Install in 60 seconds
        </Link>
      </p>
    </div>
  );
}

interface Props {
  deviceId: string | null;
  initialStats: DeviceStats | null;
}

export default function WrappedClient({ deviceId, initialStats }: Props) {
  const shareUrl = deviceId
    ? `https://loopguard.vercel.app/wrapped?device_id=${encodeURIComponent(deviceId)}`
    : '';

  return (
    <div className="min-h-screen overflow-hidden bg-[#05090f] text-[#E5E7EB]">
      {/* Background glows */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-x-0 top-0 h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.15),transparent_55%)]" />
        <div className="absolute right-0 top-[30%] h-[400px] w-[400px] rounded-full sm:right-[-15%] bg-[radial-gradient(circle,rgba(37,99,235,0.12),transparent_60%)] blur-3xl" />
      </div>

      <main className="relative mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-8 px-4 py-12 sm:px-5 sm:py-16">
        {/* Page header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-300">
            ← loopguard.vercel.app
          </Link>
          <h1 className="mt-6 text-4xl font-semibold tracking-[-0.06em] text-white sm:text-5xl">
            LoopGuard <span className="text-cyan-400">Wrapped</span>
          </h1>
          <p className="mt-3 text-slate-400">
            Your AI coding session stats, shareable in one link.
          </p>
        </div>

        {/* Card or lookup form */}
        {initialStats !== null && deviceId !== null ? (
          <StatsCard stats={initialStats} shareUrl={shareUrl} />
        ) : (
          <LookupForm />
        )}

        {/* How it works */}
        {initialStats === null && (
          <div className="w-full max-w-lg rounded-[24px] border border-white/8 bg-white/[0.03] p-6 text-sm leading-6 text-slate-400">
            <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500 mb-3">How sync works</div>
            <ol className="space-y-2 list-none">
              <li className="flex gap-3"><span className="text-cyan-400 font-semibold">1.</span>Install loopguard-ctx and set up hooks for Claude Code or Cursor</li>
              <li className="flex gap-3"><span className="text-cyan-400 font-semibold">2.</span>Run a few sessions — stats accumulate in <code className="font-mono text-xs text-slate-300">~/.loopguard-ctx/stats.json</code></li>
              <li className="flex gap-3"><span className="text-cyan-400 font-semibold">3.</span>At session end the Stop hook syncs anonymously via your device UUID</li>
              <li className="flex gap-3"><span className="text-cyan-400 font-semibold">4.</span>Paste your device ID here to see and share your card</li>
            </ol>
          </div>
        )}
      </main>
    </div>
  );
}
