import ScrollReveal from '../ScrollReveal';

const CTX_BULLETS = [
  { title: 'One-click copy', copy: 'Use Copy Optimized Context to get a focused prompt instead of pasting the whole file.' },
  { title: 'Delta-first reads', copy: 'Each file read is hashed into a session cache. Subsequent reads send only the diff — the model never sees the same unchanged lines twice.' },
  { title: 'Error window first', copy: 'The failing lines, nearby definitions, and recent edits come first. Boilerplate is dropped.' },
  { title: 'Works in every session', copy: 'No setup. The context engine runs automatically when you copy context from the extension.' },
];

export default function ContextEngineSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
      <div className="grid gap-16 lg:grid-cols-[0.92fr_1fr] lg:items-start">
        <ScrollReveal direction="left">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.3em] text-[#7B95AE]">Context engine</div>
            <h2 className="mt-3 text-4xl font-bold tracking-[-0.05em] text-white sm:text-5xl">
              Smaller prompts.
              <br />
              Cleaner answers.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-[#90A4B9]">
              LoopGuard does not try to summarize everything. It picks the parts the model actually
              needs: the failing lines, nearby definitions, and the pieces that changed. That keeps
              prompts readable and makes retries more deliberate.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {CTX_BULLETS.map((item) => (
                <div key={item.title} className="border-t border-white/8 pt-4">
                  <div className="text-lg font-semibold tracking-[-0.03em] text-white">{item.title}</div>
                  <div className="mt-2 text-sm leading-7 text-[#8CA1B8]">{item.copy}</div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="right">
          <div className="overflow-hidden rounded-[32px] border border-white/10 bg-black/20">
            <div className="flex items-center justify-between border-b border-white/8 px-6 py-4">
              <div>
                <div className="text-xs uppercase tracking-[0.28em] text-[#7B95AE]">Prompt payload</div>
                <div className="mt-1 text-lg font-semibold text-white">What the model sees next</div>
              </div>
              <div className="rounded-full border border-[#22D3EE]/30 bg-[#22D3EE]/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#8AE8FF]">
                Focused read
              </div>
            </div>
            <div className="grid gap-px bg-white/8 sm:grid-cols-[0.85fr_1.15fr]">
              <div className="bg-[#08121D] px-6 py-6">
                <div className="text-xs uppercase tracking-[0.22em] text-[#7B95AE]">Without LoopGuard</div>
                <div className="mt-4 text-sm leading-7 text-[#60758C]">
                  Whole file
                  <br />
                  Unrelated helpers
                  <br />
                  Old branches
                  <br />
                  Repeated imports
                  <br />
                  Re-sent context
                </div>
                <div className="mt-4 text-xs text-[#4E5A6A]">~12,000 tokens</div>
              </div>
              <div className="bg-[#06111B] px-6 py-6">
                <div className="text-xs uppercase tracking-[0.22em] text-[#7B95AE]">With LoopGuard</div>
                <div className="mt-4 space-y-3 text-sm leading-7 text-[#D5E7F8]">
                  <div>1. Exact failing window</div>
                  <div>2. Nearby definitions and signatures</div>
                  <div>3. Recent edits that changed the behavior</div>
                  <div>4. Smaller prompt shape for the next retry</div>
                </div>
                <div className="mt-4 text-xs text-[#22C55E]">~3,600 tokens — 70% less</div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
