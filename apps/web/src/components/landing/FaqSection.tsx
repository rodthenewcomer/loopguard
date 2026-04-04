import ScrollReveal from '../ScrollReveal';

const FAQS = [
  {
    q: 'Do I need an account?',
    a: 'No. Loop detection and context filtering run entirely on your machine with no sign-in required. Create a free account later only if you want session history on the web dashboard.',
  },
  {
    q: 'Does this send my code anywhere?',
    a: 'Never. All processing happens locally inside the extension. If you sign in, the backend stores only anonymized metrics — counts and durations. No source code, no file contents, no file paths.',
  },
  {
    q: 'Does it work offline?',
    a: 'Yes. The core extension is entirely offline-capable. Loop detection, context filtering, and the sidebar panel all work without an internet connection. Backend sync is optional and best-effort.',
  },
  {
    q: 'Is LoopGuard really free? Will it stay free?',
    a: 'Yes. Loop detection, focused context, sidebar panel, and MCP integration are free — there is no paid tier that gates any of these features. If it helps you, you can support the project voluntarily.',
  },
];

export default function FaqSection() {
  return (
    <section id="faq" className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
      <ScrollReveal className="mb-10 max-w-2xl">
        <div className="text-sm font-semibold uppercase tracking-[0.3em] text-[#7B95AE]">Common questions</div>
        <h2 className="mt-3 text-3xl font-bold tracking-[-0.05em] text-white sm:text-4xl">
          Before you install.
        </h2>
      </ScrollReveal>
      <ScrollReveal>
        <div className="grid overflow-hidden rounded-[28px] gap-px bg-white/8 sm:grid-cols-2">
          {FAQS.map(({ q, a }) => (
            <div key={q} className="bg-[#07111C] px-7 py-6">
              <div className="mb-2 text-sm font-semibold text-white">{q}</div>
              <div className="text-sm leading-7 text-[#8CA1B8]">{a}</div>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}
