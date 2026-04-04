const VERSIONS = [
  { v: 'v1', label: 'Extension Core', color: '#22C55E', upcoming: false },
  { v: 'v2', label: 'CLI + Sync Pipeline', color: '#22D3EE', upcoming: false },
  { v: 'v3', label: 'Intelligence Layer', color: '#A78BFA', upcoming: false },
  { v: 'v4', label: 'Multi-session Memory', color: '#F59E0B', upcoming: true },
];

export default function RoadmapSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
      <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(160deg,rgba(9,18,30,0.9),rgba(5,12,20,0.88))] px-8 py-10 sm:px-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#7B95AE]">Roadmap</div>
            <h2 className="text-3xl font-bold tracking-[-0.05em] text-white sm:text-4xl">
              Three versions shipped since launch.
              <br />
              <span className="text-[#F59E0B]">v4 — multi-session memory — now in active development.</span>
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[#8CA1B8]">
              See the full feature list for every version — what each one adds for VS Code, Cursor, Windsurf, Claude Code, Codex CLI, and GitHub Copilot. v4 brings cross-session pattern memory and proactive loop prediction.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {VERSIONS.map(({ v, label, color, upcoming }) => (
                <span
                  key={v}
                  className="rounded-full px-2.5 py-1 text-xs font-semibold"
                  style={{
                    color,
                    background: upcoming ? `${color}08` : `${color}18`,
                    border: upcoming ? `1px dashed ${color}55` : `1px solid ${color}33`,
                  }}
                >
                  {v} — {label}{upcoming ? ' ✦' : ''}
                </span>
              ))}
            </div>
          </div>
          <a
            href="/roadmap"
            className="inline-flex flex-shrink-0 items-center gap-2 rounded-full border border-white/12 bg-white/[0.07] px-6 py-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10"
          >
            View full roadmap
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
