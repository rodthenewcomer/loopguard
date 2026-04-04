import { FOOTER_COLS } from '../../lib/landingData';

export default function LandingFooter() {
  return (
    <footer className="border-t border-white/8 px-6 pb-10 pt-16 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-[1.3fr_repeat(3,1fr)]">
          <div>
            <div className="text-2xl font-bold tracking-[-0.04em] text-white">LoopGuard</div>
            <p className="mt-4 max-w-sm text-sm leading-7 text-[#72879D]">
              The local guardrail for AI coding sessions that start repeating instead of moving.
            </p>
          </div>

          {FOOTER_COLS.map((column) => (
            <div key={column.heading}>
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7B95AE]">{column.heading}</div>
              <div className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="block text-sm text-[#8CA1B8] transition hover:text-white"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/8 pt-6 text-xs text-[#5C7287] sm:flex-row sm:items-center sm:justify-between">
          <div>© 2026 LoopGuard · Windows · macOS · Linux</div>
          <div>Your code never leaves your machine unless you explicitly choose to sync metrics.</div>
        </div>
      </div>
    </footer>
  );
}
