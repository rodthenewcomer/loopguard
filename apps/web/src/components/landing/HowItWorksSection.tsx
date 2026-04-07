import ScrollReveal from '../ScrollReveal';
import { Icon, IC } from '../Icon';
import { SURFACES } from '../../lib/landingData';

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-10">
      <ScrollReveal className="mb-12 max-w-2xl">
        <div className="text-sm font-semibold uppercase tracking-[0.3em] text-[#7B95AE]">How it works</div>
        <h2 className="mt-3 text-3xl font-bold tracking-[-0.05em] text-white sm:text-4xl lg:text-5xl">
          One guardrail layer.
          <br />
          Three concrete wins.
        </h2>
      </ScrollReveal>

      <div className="grid gap-10 border-t border-white/8 pt-8 lg:grid-cols-3">
        {SURFACES.map((surface) => (
          <ScrollReveal key={surface.badge}>
            <div className="border-l border-white/10 pl-6">
              <div
                className="mb-4 inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]"
                style={{
                  color: surface.accent,
                  background: `${surface.accent}16`,
                  border: `1px solid ${surface.accent}33`,
                }}
              >
                <span className="mr-2 inline-flex">
                  <Icon
                    path={
                      surface.accent === '#F59E0B'
                        ? IC.loop
                        : surface.accent === '#22D3EE'
                          ? IC.copy
                          : IC.check
                    }
                    size={14}
                  />
                </span>
                {surface.badge}
              </div>
              <h3 className="text-2xl font-semibold tracking-[-0.04em] text-white">{surface.title}</h3>
              <p className="mt-3 max-w-sm text-sm leading-7 text-[#8CA1B8]">{surface.copy}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
