import LoopGuardLogo from '../LoopGuardLogo';
import ScrollReveal from '../ScrollReveal';
import HeroCta from '../HeroCta';
import GitHubStars from '../GitHubStars';
import { Icon, IC } from '../Icon';
import { METRICS, TIMELINE, CONTEXT_LINES } from '../../lib/landingData';

export default function HeroSection() {
  return (
    <section id="main-content" className="relative overflow-hidden pt-16">
      <div className="absolute inset-0 bg-grid opacity-25 animate-[grid-drift_22s_linear_infinite]" aria-hidden="true" />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 18% 18%, rgba(239,68,68,0.12), transparent 30%), radial-gradient(circle at 80% 12%, rgba(37,99,235,0.18), transparent 34%), radial-gradient(circle at 62% 72%, rgba(34,211,238,0.1), transparent 35%)',
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto grid min-h-[calc(100svh-4rem)] max-w-7xl gap-16 px-6 py-14 lg:grid-cols-[1.02fr_0.98fr] lg:items-end lg:px-10 lg:py-20">
        <div className="flex flex-col justify-center">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-[#9FB0C4] backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-[#22C55E]" />
              v3 live · v4 in active development
            </div>
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#22C55E]/20 bg-[#22C55E]/8 px-3 py-1.5 text-xs font-medium text-[#86EFAC] backdrop-blur">
              <Icon path={IC.shield} size={12} />
              Your code never leaves your machine
            </div>
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#A78BFA]/20 bg-[#A78BFA]/8 px-3 py-1.5 text-xs font-medium text-[#C4B5FD] backdrop-blur">
              <Icon path={IC.check} size={12} />
              Free forever · no paid tier
            </div>
          </div>

          <div className="max-w-2xl">
            <div className="mb-5 flex items-center gap-3">
              <LoopGuardLogo size={34} />
              <div className="text-sm font-semibold uppercase tracking-[0.36em] text-[#7B95AE]">
                LoopGuard
              </div>
            </div>
            <p className="mb-2 text-base font-semibold leading-7 text-[#D6E3F1]">
              The local guardrail for AI coding sessions that start repeating instead of moving.
            </p>
            <p className="mb-4 text-sm font-medium text-[#7B95AE]">
              Runs in VS Code, Cursor, and Windsurf. Free.
            </p>
            <h1 className="text-5xl font-black leading-[0.96] tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl">
              Save the hour.
              <br />
              <span className="text-[#8AE8FF]">Cut the token bill.</span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-[#9FB0C4] sm:text-lg">
              LoopGuard watches your coding session locally, fires when the same problem
              keeps resurfacing, and trims the next prompt to only the context the model
              actually needs — so each retry costs less and moves faster.
            </p>
          </div>

          <HeroCta />
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <p className="text-xs text-[#5B7A93]">
              Opens VS Code Marketplace · 1-click install · no account needed
            </p>
            <GitHubStars />
          </div>

          <div className="mt-8 grid max-w-2xl gap-3 text-sm text-[#8CA1B8] sm:grid-cols-3">
            <div className="flex items-start gap-2">
              <span className="mt-0.5 text-[#F59E0B]"><Icon path={IC.alert} size={16} /></span>
              Stops retry spirals before they quietly eat another 20 to 40 minutes
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-0.5 text-[#22D3EE]"><Icon path={IC.copy} size={16} /></span>
              Cuts prompt size by 70%+ in normal focused reads, with some measured sessions going much higher
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-0.5 text-[#22C55E]"><Icon path={IC.check} size={16} /></span>
              Makes the payoff visible in minutes saved, tokens saved, and spend avoided
            </div>
          </div>

          <div className="mt-12 overflow-hidden rounded-[28px] border border-white/10 bg-black/20 backdrop-blur">
            {/* $77/mo — primary metric, full-width */}
            <div className="border-b border-white/8 bg-[#08121D] px-6 py-5">
              <div className="flex flex-wrap items-baseline gap-3">
                <div className="text-5xl font-black tracking-[-0.06em]" style={{ color: METRICS[0].tone }}>
                  {METRICS[0].value}
                </div>
                <div className="text-sm leading-6 text-[#8CA1B8]">{METRICS[0].label}</div>
              </div>
            </div>
            {/* Secondary metrics */}
            <div className="grid gap-px bg-white/8 sm:grid-cols-3">
              {METRICS.slice(1).map((metric) => (
                <div key={metric.value} className="bg-[#08121D] px-5 py-5">
                  <div className="text-3xl font-black tracking-[-0.05em]" style={{ color: metric.tone }}>
                    {metric.value}
                  </div>
                  <div className="mt-2 text-xs uppercase tracking-[0.22em] text-[#7B95AE]">
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-white/8 px-5 py-3">
              <p className="text-[11px] leading-5 text-[#7B95AE]">
                <sup>1</sup> Based on 2 h/day heavy AI coding at GPT-4o pricing with 70% prompt reduction applied.{' '}
                <sup>2</sup> Measured across sessions where LoopGuard detected 3+ repeat loops per day.
              </p>
            </div>
          </div>
        </div>

        <ScrollReveal direction="right">
          <div className="relative">
            <div className="absolute inset-x-10 top-10 h-56 rounded-full bg-[#2563EB]/20 blur-3xl" aria-hidden="true" />
            <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[linear-gradient(160deg,rgba(11,22,36,0.96),rgba(7,16,25,0.92))] shadow-[0_40px_120px_rgba(0,0,0,0.45)]">
              <div className="border-b border-white/8 px-6 py-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-[0.28em] text-[#7B95AE]">Live session</div>
                    <div className="mt-2 text-2xl font-bold tracking-[-0.04em] text-white">
                      Claude fixed the file.
                      <br />
                      The bug came back anyway.
                    </div>
                  </div>
                  <div className="rounded-full border border-[#EF4444]/30 bg-[#EF4444]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#FFB0B0]">
                    loop pressure
                  </div>
                </div>
              </div>

              <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="border-b border-white/8 px-6 py-6 lg:border-b-0 lg:border-r">
                  <div className="mb-5 flex items-center justify-between">
                    <div className="text-sm font-semibold text-white">Session timeline</div>
                    <div className="text-xs uppercase tracking-[0.22em] text-[#7B95AE]">32 min lost</div>
                  </div>
                  <div className="space-y-4">
                    {TIMELINE.map((item) => {
                      const tone =
                        item.state === 'danger'
                          ? '#EF4444'
                          : item.state === 'warning'
                            ? '#F59E0B'
                            : '#5B6C82';

                      return (
                        <div key={item.time} className="grid grid-cols-[auto_1fr] gap-4">
                          <div className="flex flex-col items-center">
                            <div
                              className="h-10 w-10 rounded-full border text-xs font-black"
                              style={{ borderColor: `${tone}55`, background: `${tone}16`, color: tone }}
                            >
                              <div className="flex h-full items-center justify-center">{item.time}</div>
                            </div>
                            <div className="mt-2 h-full w-px bg-white/8" />
                          </div>
                          <div className="pb-5">
                            <div className="text-sm font-semibold text-white">{item.title}</div>
                            <div className="mt-1 text-sm leading-6 text-[#8CA1B8]">{item.body}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="px-6 py-6">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-white">Focused context</div>
                      <div className="mt-0.5 text-[11px] text-[#50657D]">340-line file · 24 lines kept</div>
                    </div>
                    <div className="text-xs uppercase tracking-[0.22em] text-[#7B95AE]">7% kept</div>
                  </div>
                  <div className="rounded-[24px] border border-white/8 bg-black/20 p-4">
                    <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#7B95AE]">
                      <span className="h-2 w-2 rounded-full bg-[#22D3EE]" />
                      summary.tsx
                    </div>
                    <div className="space-y-2 font-mono text-[12px] leading-6">
                      {CONTEXT_LINES.map((line, index) => (
                        <div
                          key={index}
                          className={line.kind === 'focus' ? 'text-[#DFF9FF]' : 'text-[#50657D]'}
                        >
                          {line.text}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 space-y-3 text-sm text-[#8CA1B8]">
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 text-[#22C55E]"><Icon path={IC.check} size={16} /></span>
                      Keep the failing window, nearby definitions, and recent edits
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 text-[#22C55E]"><Icon path={IC.check} size={16} /></span>
                      Drop the long helper branches and untouched boilerplate
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 text-[#22C55E]"><Icon path={IC.check} size={16} /></span>
                      Reuse prior reads so the same file is not resent over and over
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
