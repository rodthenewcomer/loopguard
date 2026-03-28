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
      <div
        className="h-full rounded-2xl border border-[#1F2937] p-5"
        style={{ background: 'linear-gradient(145deg, #111827, #0f172a)' }}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-sm font-semibold text-[#F9FAFB]">This Week</div>
            <div className="text-xs text-[#6B7280] mt-0.5">Tokens saved per day</div>
          </div>
          <div className="text-xs text-[#22D3EE] font-bold">
            {TOKENS.reduce((a, b) => a + b, 0).toLocaleString()} total
          </div>
        </div>

        {/* Bar chart */}
        <div className="flex items-end gap-2 h-28">
          {DAYS.map((day, i) => {
            const heightPct = maxTokens > 0 ? (TOKENS[i]! / maxTokens) * 100 : 0;
            const isToday = i === todayIdx;
            const loops = LOOPS[i]!;

            return (
              <div key={day} className="flex-1 flex flex-col items-center gap-1.5 group">
                {/* Tooltip */}
                <div className="relative">
                  <div
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-[#1F2937] border border-[#374151] rounded-lg text-[10px] text-[#F9FAFB] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"
                  >
                    {TOKENS[i]!.toLocaleString()} tokens · {loops} loops
                  </div>
                </div>

                {/* Bar */}
                <div className="w-full relative flex items-end" style={{ height: '96px' }}>
                  <div
                    className="w-full rounded-t-md transition-all duration-700"
                    style={{
                      height: visible ? `${heightPct}%` : '0%',
                      minHeight: TOKENS[i]! > 0 ? '4px' : '0',
                      background: isToday
                        ? 'linear-gradient(180deg, #22D3EE, #2563EB)'
                        : loops > 0
                        ? 'linear-gradient(180deg, #374151, #1F2937)'
                        : '#1F2937',
                      transitionDelay: `${i * 60}ms`,
                      opacity: TOKENS[i]! === 0 ? 0.3 : 1,
                    }}
                  />
                </div>

                {/* Day label */}
                <div
                  className={`text-[10px] ${
                    isToday ? 'text-[#22D3EE] font-bold' : 'text-[#4B5563]'
                  }`}
                >
                  {day}
                </div>

                {/* Loop dots */}
                {loops > 0 && (
                  <div className="flex gap-0.5">
                    {Array.from({ length: Math.min(loops, 5) }).map((_, j) => (
                      <div
                        key={j}
                        className="w-1 h-1 rounded-full"
                        style={{ background: loops >= 4 ? '#EF4444' : '#F59E0B' }}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex items-center gap-4 text-[10px] text-[#4B5563]">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: 'linear-gradient(135deg, #22D3EE, #2563EB)' }} />
            Today
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-[#374151]" />
            Tokens saved
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
            Loops
          </div>
        </div>
      </div>
    </div>
  );
}
