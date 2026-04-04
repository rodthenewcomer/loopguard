import ScrollReveal from '../ScrollReveal';
import { Icon, IC } from '../Icon';
import { SUPPORT_URL } from '../../lib/constants';

export default function SupportSection() {
  return (
    <section className="px-6 py-24 lg:px-10">
      <ScrollReveal>
        <div className="mx-auto max-w-5xl overflow-hidden rounded-[36px] border border-white/10 bg-[linear-gradient(160deg,rgba(10,20,32,0.96),rgba(7,16,25,0.9))] px-8 py-10 shadow-[0_35px_100px_rgba(0,0,0,0.35)] sm:px-12">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.3em] text-[#7B95AE]">Support the project</div>
              <h2 className="mt-3 text-4xl font-bold tracking-[-0.05em] text-white sm:text-5xl">
                LoopGuard stays free.
                <br />
                Back the build if it helped.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-8 text-[#90A4B9]">
                The core product is still free. If LoopGuard saved you a late night, a broken deploy,
                or a few wasted agent retries, you can keep it moving with a coffee instead of a paywall.
              </p>
            </div>

            <div className="space-y-4">
              <a
                href={SUPPORT_URL}
                className="flex items-center justify-between rounded-[24px] border border-[#F59E0B]/25 bg-[#F59E0B]/10 px-5 py-4 transition hover:-translate-y-0.5 hover:bg-[#F59E0B]/14"
              >
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F8C76B]">Buy me a coffee</div>
                  <div className="mt-1 text-sm leading-6 text-[#F5E6C7]">Support LoopGuard without locking core features.</div>
                </div>
                <span className="text-[#F59E0B]"><Icon path={IC.coffee} size={20} /></span>
              </a>

              <a
                href="https://github.com/rodthenewcomer/loopguard"
                className="flex items-center justify-between rounded-[24px] border border-white/10 px-5 py-4 transition hover:border-white/20 hover:bg-white/5"
              >
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8CA1B8]">Open source</div>
                  <div className="mt-1 text-sm leading-6 text-[#C8D7E6]">Star the repo, file issues, or follow the next changes.</div>
                </div>
                <span className="text-white"><Icon path={IC.github} size={20} /></span>
              </a>

              <div className="rounded-[24px] border border-white/8 bg-black/20 px-5 py-4 text-sm leading-7 text-[#8CA1B8]">
                Need sync history? Create an account later. Need protection right now? Install the extension and start coding.
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
