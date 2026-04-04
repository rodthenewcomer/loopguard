import { EDITORS } from '../../lib/landingData';

export default function RunsInBar() {
  return (
    <div className="border-y border-white/8 bg-black/20">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-5 gap-y-2 px-6 py-4">
        <span className="text-xs uppercase tracking-[0.28em] text-[#7B95AE]">Runs in</span>
        {EDITORS.map((w) => (
          <span key={w} className="rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-[#A5B8CA]">
            {w}
          </span>
        ))}
        <span className="text-white/15">·</span>
        <span className="text-xs text-[#4E6B88]">Free · no account required · works offline</span>
      </div>
    </div>
  );
}
