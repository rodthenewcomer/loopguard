'use client';
import { useEffect, useState } from 'react';

type Phase = 0 | 1 | 2 | 3;

const LOOP_COUNT_MAX = 4;

export default function HeroMockup() {
  const [phase, setPhase] = useState<Phase>(0);
  const [loopCount, setLoopCount] = useState(1);
  const [timeWasted, setTimeWasted] = useState(12);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 700);
    const t2 = setTimeout(() => setPhase(2), 1800);
    const t3 = setTimeout(() => setPhase(3), 2600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  useEffect(() => {
    if (phase < 3) return;
    let count = 1;
    const interval = setInterval(() => {
      count++;
      setLoopCount(count);
      setTimeWasted((t) => t + 6);
      if (count >= LOOP_COUNT_MAX) clearInterval(interval);
    }, 700);
    return () => clearInterval(interval);
  }, [phase]);

  return (
    <div className="relative w-full max-w-[580px] animate-float">
      {/* Ambient glow */}
      <div
        className="absolute -inset-8 rounded-3xl pointer-events-none animate-pulse-glow"
        style={{ background: 'radial-gradient(ellipse at center, rgba(37,99,235,0.25) 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      {/* Window */}
      <div className="relative bg-[#0d1117] rounded-xl border border-[#21262d] shadow-2xl overflow-hidden">
        {/* Title bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-[#21262d]">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
            <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
            <div className="w-3 h-3 rounded-full bg-[#28C840]" />
          </div>
          <div className="flex items-center gap-1 text-[11px]">
            <span className="px-2.5 py-1 bg-[#0d1117] text-[#C9D1D9] rounded-md border border-[#30363d]">
              userData.ts
            </span>
            <span className="px-2.5 py-1 text-[#6E7681] rounded-md">api.ts</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div
              className={`w-2 h-2 rounded-full transition-colors duration-500 ${
                phase >= 2 ? 'bg-[#F59E0B]' : 'bg-[#22C55E]'
              }`}
            />
            <span className="text-[11px] text-[#22D3EE] font-medium">LoopGuard</span>
          </div>
        </div>

        {/* Editor */}
        <div className="flex font-mono text-[12.5px] leading-[22px]">
          {/* Line numbers */}
          <div className="py-4 px-3 text-right text-[#4B5563] select-none min-w-[44px] border-r border-[#21262d]">
            {[37, 38, 39, 40, 41, 42, 43, 44, 45].map((n) => (
              <div key={n}>{n}</div>
            ))}
          </div>

          {/* Code area */}
          <div className="py-4 pl-4 pr-3 flex-1 overflow-hidden">
            <div className="text-[#C9D1D9]">
              <div>
                <span className="text-[#FF7B72]">async function </span>
                <span className="text-[#D2A8FF]">fetchUser</span>
                <span className="text-[#8B949E]">(</span>
                <span className="text-[#FFA657]">id</span>
                <span className="text-[#8B949E]">: </span>
                <span className="text-[#79C0FF]">string</span>
                <span className="text-[#8B949E]">) {'{'}</span>
              </div>
              <div>
                <span className="text-[#8B949E]">  </span>
                <span className="text-[#FF7B72]">const </span>
                <span className="text-[#C9D1D9]">res </span>
                <span className="text-[#8B949E]">= </span>
                <span className="text-[#FF7B72]">await </span>
                <span className="text-[#C9D1D9]">api.</span>
                <span className="text-[#D2A8FF]">get</span>
                <span className="text-[#8B949E]">(`/users/${'{'}</span>
                <span className="text-[#C9D1D9]">id</span>
                <span className="text-[#8B949E]">{'}'}`)</span>
              </div>
              <div
                className={`transition-colors duration-400 ${
                  phase >= 1 ? 'bg-[#EF4444]/10' : ''
                }`}
              >
                <span className="text-[#8B949E]">  </span>
                <span className="text-[#FF7B72]">return </span>
                <span className="text-[#C9D1D9]">res.data.</span>
                <span
                  className={`transition-all duration-300 ${
                    phase >= 1
                      ? 'text-[#EF4444] underline decoration-wavy decoration-[#EF4444]'
                      : 'text-[#D2A8FF]'
                  }`}
                >
                  map
                </span>
                <span className="text-[#8B949E]">(x =&gt; x.</span>
                <span
                  className={phase >= 1 ? 'text-[#EF4444]' : 'text-[#C9D1D9]'}
                >
                  value
                </span>
                <span className="text-[#8B949E]">)</span>
              </div>
              <div>
                <span className="text-[#8B949E]">{'}'}</span>
              </div>
              <div>&nbsp;</div>
              <div>
                <span className="text-[#FF7B72]">const </span>
                <span className="text-[#C9D1D9]">user </span>
                <span className="text-[#8B949E]">= </span>
                <span className="text-[#FF7B72]">await </span>
                <span className="text-[#D2A8FF]">fetchUser</span>
                <span className="text-[#8B949E]">(</span>
                <span className="text-[#C9D1D9]">userId</span>
                <span className="text-[#8B949E]">)</span>
              </div>
              <div
                className={`transition-colors duration-400 ${
                  phase >= 1 ? 'bg-[#EF4444]/10' : ''
                }`}
              >
                <span className="text-[#C9D1D9]">console.</span>
                <span className="text-[#D2A8FF]">log</span>
                <span className="text-[#8B949E]">(user.</span>
                <span
                  className={phase >= 1 ? 'text-[#EF4444] underline decoration-wavy decoration-[#EF4444]' : 'text-[#C9D1D9]'}
                >
                  profile
                </span>
                <span className="text-[#8B949E]">.</span>
                <span className={phase >= 1 ? 'text-[#EF4444]' : 'text-[#C9D1D9]'}>name</span>
                <span className="text-[#8B949E]">)</span>
                <span className="animate-blink text-[#C9D1D9]">|</span>
              </div>
              <div>&nbsp;</div>
            </div>
          </div>
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between px-4 py-1 bg-[#2563EB] text-[11px] text-white/90">
          <span>TypeScript</span>
          <span>
            {phase >= 1 ? (
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] inline-block" />
                2 errors
              </span>
            ) : (
              'No problems'
            )}
          </span>
          <span>Ln 44, Col 28</span>
        </div>

        {/* LoopGuard Alert */}
        {phase >= 2 && (
          <div
            className="absolute bottom-8 right-3 w-[240px] rounded-lg border border-[#F59E0B]/40 shadow-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, #1a1f2e, #111827)',
              animation: 'alert-in 0.45s cubic-bezier(0.16,1,0.3,1) forwards',
            }}
          >
            {/* Alert header */}
            <div className="flex items-center gap-2 px-3 py-2 border-b border-[#1F2937]">
              <span className="text-[#F59E0B] text-base">⚠</span>
              <span className="text-[11px] font-bold text-[#F59E0B] uppercase tracking-widest">
                Loop Detected
              </span>
            </div>
            {/* Alert body */}
            <div className="px-3 py-2.5">
              <p className="text-[11px] text-[#9CA3AF] mb-3 leading-relaxed">
                Cannot read properties of undefined
              </p>
              <div className="flex items-end justify-between mb-3">
                <div>
                  <div className="text-[22px] font-bold text-white tabular-nums leading-none">
                    {loopCount}×
                  </div>
                  <div className="text-[10px] text-[#6B7280] mt-0.5">same error</div>
                </div>
                <div className="text-right">
                  <div className="text-[16px] font-bold text-[#F59E0B] tabular-nums leading-none">
                    {timeWasted}min
                  </div>
                  <div className="text-[10px] text-[#6B7280] mt-0.5">wasted</div>
                </div>
              </div>
              {/* Progress bar */}
              <div className="w-full h-1 bg-[#1F2937] rounded-full mb-3">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${(loopCount / LOOP_COUNT_MAX) * 100}%`,
                    background: loopCount >= 3
                      ? 'linear-gradient(90deg, #F59E0B, #EF4444)'
                      : '#F59E0B',
                  }}
                />
              </div>
              <button className="w-full py-1.5 bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-[11px] font-semibold rounded-md transition-colors">
                Try New Approach →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
