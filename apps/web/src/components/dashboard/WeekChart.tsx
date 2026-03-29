'use client';
import { useEffect, useRef, useState } from 'react';

const DEMO_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DEMO_LOOPS  = [2, 5, 1, 7, 3, 0, 4];
const DEMO_TOKENS = [3200, 8100, 1400, 11200, 4800, 0, 6400];

export type WeekDayData = { date: string; loops: number; tokensSaved: number };

export default function WeekChart({ data }: { data?: WeekDayData[] }) {
  const TOKENS = data ? data.map((d) => d.tokensSaved) : DEMO_TOKENS;
  const LOOPS  = data ? data.map((d) => d.loops)       : DEMO_LOOPS;
  const DAYS   = data
    ? data.map((d) => {
        const day = new Date(d.date).getUTCDay(); // 0=Sun
        return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day] ?? d.date.slice(5);
      })
    : DEMO_DAYS;
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const maxTokens = Math.max(...TOKENS);
  const today = new Date().getDay(); // 0=Sun ... 6=Sat
  const todayIdx = today === 0 ? 6 : today - 1; // convert to Mon=0

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="h-full">
      <div className="relative h-full overflow-hidden rounded-[30px] border border-white/8 bg-[linear-gradient(145deg,rgba(11,22,37,0.96),rgba(8,16,29,0.88))] p-5 shadow-[0_28px_80px_rgba(0,0,0,0.22)] sm:p-6">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-y-0 right-0 w-[44%] bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.12),transparent_62%)]" />
        </div>

        <div className="relative flex items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">Weekly rhythm</div>
            <div className="mt-2 text-xl font-semibold tracking-[-0.03em] text-white">Token savings by day</div>
            <div className="mt-1 text-sm text-slate-400">See where the context engine carried the most weight.</div>
          </div>
          <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold text-cyan-300">
            {TOKENS.reduce((a, b) => a + b, 0).toLocaleString()} total
          </div>
        </div>

        <div className="relative mt-8 flex h-40 items-end gap-2 sm:gap-3">
          {DAYS.map((day, i) => {
            const heightPct = maxTokens > 0 ? (TOKENS[i]! / maxTokens) * 100 : 0;
            const isToday = i === todayIdx;
            const loops = LOOPS[i]!;

            return (
              <div key={day} className="group flex flex-1 flex-col items-center gap-2">
                <div className="relative">
                  <div
                    className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 rounded-xl border border-white/10 bg-[#09111e]/95 px-2.5 py-1 text-[10px] text-slate-100 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    {TOKENS[i]!.toLocaleString()} tokens · {loops} loops
                  </div>
                </div>

                <div className="flex w-full items-end rounded-[18px] border border-white/6 bg-white/[0.03] px-1.5 pb-1.5 pt-6" style={{ height: '132px' }}>
                  <div
                    className="w-full rounded-[14px] transition-all duration-700"
                    style={{
                      height: visible ? `${heightPct}%` : '0%',
                      minHeight: TOKENS[i]! > 0 ? '8px' : '0',
                      background: isToday
                        ? 'linear-gradient(180deg, #67E8F9, #2563EB)'
                        : loops > 0
                          ? 'linear-gradient(180deg, rgba(96,165,250,0.68), rgba(30,41,59,0.95))'
                          : 'rgba(51,65,85,0.55)',
                      transitionDelay: `${i * 70}ms`,
                      opacity: TOKENS[i]! === 0 ? 0.35 : 1,
                      boxShadow: isToday ? '0 16px 34px rgba(34,211,238,0.18)' : 'none',
                    }}
                  />
                </div>

                <div
                  className={`text-[10px] uppercase tracking-[0.2em] ${
                    isToday ? 'font-semibold text-cyan-300' : 'text-slate-500'
                  }`}
                >
                  {day}
                </div>

                {loops > 0 && (
                  <div className="flex gap-0.5">
                    {Array.from({ length: Math.min(loops, 5) }).map((_, j) => (
                      <div
                        key={j}
                        className="w-1 h-1 rounded-full"
                        style={{ background: loops >= 4 ? '#FB7185' : '#F59E0B' }}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4 text-[10px] uppercase tracking-[0.18em] text-slate-500">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-sm" style={{ background: 'linear-gradient(135deg, #67E8F9, #2563EB)' }} />
            Today
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-sm bg-slate-500" />
            Tokens saved
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            Loops
          </div>
        </div>
      </div>
    </div>
  );
}
