import ScrollReveal from '../ScrollReveal';
import { Icon, IC } from '../Icon';

const STEPS = [
  { n: '1', text: 'Search "LoopGuard" in the Extensions panel, or click Install extension above.' },
  { n: '2', text: 'Open any workspace. Loop detection starts automatically — no configuration.' },
  { n: '3', text: "The sidebar panel and status bar show live metrics. That's it." },
];

export default function InstallSection() {
  return (
    <section id="install" className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
      <ScrollReveal className="mb-12 max-w-2xl">
        <div className="text-sm font-semibold uppercase tracking-[0.3em] text-[#7B95AE]">Install</div>
        <h2 className="mt-3 text-4xl font-bold tracking-[-0.05em] text-white sm:text-5xl">
          One click in the editor.
          <br />
          No terminal required.
        </h2>
      </ScrollReveal>

      <ScrollReveal>
        <div className="rounded-[32px] border border-[#2563EB]/30 bg-[linear-gradient(160deg,rgba(37,99,235,0.08),rgba(7,16,25,0.9))] p-8 lg:p-10">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-start">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#2563EB]/30 bg-[#2563EB]/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#7FB1FF]">
                <Icon path={IC.code} size={14} />
                VS Code · Cursor · Windsurf — recommended
              </div>
              <div className="max-w-xl space-y-5">
                {STEPS.map((item) => (
                  <div key={item.n} className="grid grid-cols-[32px_1fr] gap-4 border-b border-white/8 pb-5 last:border-b-0 last:pb-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#2563EB]/30 bg-[#2563EB]/12 text-sm font-bold text-[#7FB1FF]">
                      {item.n}
                    </div>
                    <div className="text-sm leading-7 text-[#A8BECF]">{item.text}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3 lg:pt-1">
              <a
                href="/setup"
                className="inline-flex items-center gap-2 rounded-full bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_32px_rgba(37,99,235,0.3)] transition hover:-translate-y-0.5 hover:bg-[#1D4ED8]"
              >
                <Icon path={IC.spark} size={16} />
                Install extension
              </a>
              <a
                href="/setup#vscode"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/12 px-6 py-3 text-sm font-semibold text-[#D6E3F1] transition hover:border-white/25 hover:text-white"
              >
                View setup guide
                <Icon path={IC.arrow} size={16} />
              </a>
              <p className="text-center text-xs text-[#4E6B88]">Opens VS Code Marketplace</p>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
