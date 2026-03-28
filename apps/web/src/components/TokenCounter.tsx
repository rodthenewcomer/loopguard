'use client';
import { useEffect, useRef, useState } from 'react';

function useScrollCounter(from: number, to: number, duration = 1600) {
  const [value, setValue] = useState(from);
  const triggered = useRef(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered.current) {
          triggered.current = true;
          const startTime = performance.now();
          const tick = (now: number) => {
            const t = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            setValue(Math.round(from + (to - from) * eased));
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [from, to, duration]);

  return { value, ref };
}

export default function TokenCounter() {
  const FULL = 12400;
  const COMPRESSED = 840;
  const { value, ref } = useScrollCounter(FULL, COMPRESSED);
  const pct = Math.round(((FULL - value) / FULL) * 100);
  const barWidth = (value / FULL) * 100;

  return (
    <div ref={ref} className="w-full">
      <div
        className="rounded-2xl border border-[#1F2937] p-6"
        style={{ background: 'linear-gradient(145deg, #111827, #0f172a)' }}
      >
        <div className="text-xs text-[#6B7280] uppercase tracking-widest mb-5 font-medium">
          Context window — live compression
        </div>

        {/* Before */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm text-[#6B7280]">Without LoopGuard</span>
            <span className="font-mono text-sm text-[#EF4444]">
              {FULL.toLocaleString()} tokens
            </span>
          </div>
          <div className="h-2 w-full bg-[#1F2937] rounded-full">
            <div className="h-full w-full bg-[#EF4444]/50 rounded-full" />
          </div>
        </div>

        {/* After — animated */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm text-[#9CA3AF]">With LoopGuard</span>
            <span className="font-mono text-base font-bold text-[#22D3EE] tabular-nums">
              {value.toLocaleString()} tokens
            </span>
          </div>
          <div className="h-2.5 w-full bg-[#1F2937] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-75"
              style={{
                width: `${barWidth}%`,
                background: 'linear-gradient(90deg, #2563EB, #22D3EE)',
              }}
            />
          </div>
        </div>

        {/* Reduction stat */}
        <div className="flex items-center justify-between pt-4 border-t border-[#1F2937]">
          <div>
            <div className="text-xs text-[#6B7280]">Token reduction</div>
            <div className="text-3xl font-bold text-[#22D3EE] tabular-nums mt-0.5">
              {pct}%
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-[#6B7280]">Cost saved / session</div>
            <div className="text-3xl font-bold text-[#22C55E] tabular-nums mt-0.5">
              ~${(((FULL - value) / 1000) * 0.03).toFixed(2)}
            </div>
          </div>
        </div>

        {/* Engine badge */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#1F2937]">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-full">
            <span className="text-[#F59E0B] text-[10px] font-bold uppercase tracking-wide">
              Rust engine
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#22D3EE]/10 border border-[#22D3EE]/20 rounded-full">
            <span className="text-[#22D3EE] text-[10px] font-bold uppercase tracking-wide">
              AST + Entropy
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-full">
            <span className="text-[#22C55E] text-[10px] font-bold uppercase tracking-wide">
              14 languages
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
