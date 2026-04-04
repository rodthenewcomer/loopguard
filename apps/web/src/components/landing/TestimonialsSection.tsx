import ScrollReveal from '../ScrollReveal';

const TESTIMONIALS = [
  {
    quote: 'Caught the loop on turn 3 and pointed me at the actual root cause. Saved me from spending another hour on the same Prisma migration error.',
    author: 'Backend engineer, fintech startup',
  },
  {
    quote: 'The focused-read output is genuinely different from just copy-pasting a file. The model stops re-explaining things it already knows.',
    author: 'Solo developer, SaaS product',
  },
  {
    quote: "Status bar showing '32 min lost in loops' was the wake-up call I needed. Didn't realise how much time was going into repetition.",
    author: 'Full-stack developer, agency',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
      <ScrollReveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map(({ quote, author }) => (
            <div
              key={author}
              className="rounded-[24px] border border-white/8 bg-white/3 px-6 py-6"
            >
              <p className="text-sm leading-7 text-[#A8BECF]">&ldquo;{quote}&rdquo;</p>
              <p className="mt-4 text-xs font-medium text-[#5B7A93]">— {author}</p>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}
