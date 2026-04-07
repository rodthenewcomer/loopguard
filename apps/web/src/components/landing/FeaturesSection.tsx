import ScrollReveal from '../ScrollReveal';
import { Icon, IC } from '../Icon';

const LOOP_TURNS = [
  { tone: '#5B6C82', label: 'Turn 1', detail: 'AI proposes a fix. The error disappears for one edit.' },
  { tone: '#F59E0B', label: 'Turn 2', detail: 'The same failure returns in a nearby shape. You try again.' },
  { tone: '#EF4444', label: 'Turn 4', detail: 'You are now paying for repetition instead of progress.' },
];

const FEATURE_BULLETS = [
  'Diagnostic loops and repeated edit patterns are both tracked locally.',
  'Session metrics update live in the sidebar panel and status bar as you code.',
  'The web dashboard is optional. Core protection still works fully offline.',
];

export default function FeaturesSection() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-10">
      <div className="grid gap-16 lg:grid-cols-[1fr_0.92fr] lg:items-start">
        <ScrollReveal direction="left">
          <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(9,18,30,0.9),rgba(5,12,20,0.9))]">
            <div className="border-b border-white/8 px-6 py-5">
              <div className="text-xs uppercase tracking-[0.28em] text-[#7B95AE]">What a loop looks like</div>
              <div className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
                Same error.
                <br />
                Different patch.
              </div>
            </div>
            <div className="space-y-5 px-6 py-6">
              {LOOP_TURNS.map((item) => (
                <div key={item.label} className="grid gap-4 border-t border-white/8 pt-5 first:border-t-0 first:pt-0 sm:grid-cols-[150px_1fr]">
                  <div className="text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: item.tone }}>
                    {item.label}
                  </div>
                  <div className="text-sm leading-7 text-[#8CA1B8]">{item.detail}</div>
                </div>
              ))}
            </div>
            {/* LoopGuard alert fires here — the intervention moment */}
            <div className="mx-6 mb-6 overflow-hidden rounded-2xl border border-[#F59E0B]/30 bg-[#F59E0B]/5">
              <div className="flex items-start gap-3 px-4 py-4">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F59E0B]/20 text-sm">
                  ⚠️
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-[#F59E0B]">LoopGuard detected a loop</div>
                  <div className="mt-0.5 text-xs text-[#A5B8CA]">Same error 3× &nbsp;·&nbsp; 23 min wasted</div>
                </div>
              </div>
              <div className="flex gap-2 border-t border-[#F59E0B]/15 px-4 py-3">
                <button className="rounded-lg bg-[#F59E0B] px-4 py-1.5 text-xs font-semibold text-black">Get Unstuck</button>
                <button className="rounded-lg border border-white/10 px-4 py-1.5 text-xs font-medium text-[#8CA1B8]">Dismiss</button>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="right">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.3em] text-[#7B95AE]">Why it matters</div>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.05em] text-white sm:text-4xl lg:text-5xl">
              Stop the retry spiral
              <br />
              before it hardens.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-[#90A4B9]">
              AI coding tools are fast at the first guess and expensive at the fifth. LoopGuard is
              there for the moment the session stops learning. It measures the waste, points out the
              repetition, and gives you a cleaner next move instead of another blind rerun.
            </p>

            <div className="mt-8 space-y-4">
              {FEATURE_BULLETS.map((item) => (
                <div key={item} className="flex items-start gap-3 border-t border-white/8 pt-4 text-sm leading-7 text-[#8CA1B8]">
                  <span className="mt-1 text-[#F59E0B]"><Icon path={IC.check} size={16} /></span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
