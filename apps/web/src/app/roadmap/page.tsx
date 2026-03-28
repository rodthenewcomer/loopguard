import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Roadmap — LoopGuard',
  description: 'What we are building next for LoopGuard.',
};

const PHASES = [
  {
    phase: 'Shipped',
    tag: 'v0.1.0',
    tagColor: '#22C55E',
    items: [
      { title: 'Loop detection via VS Code diagnostics API', detail: 'Fires when the same error hash appears 2–5× in a session depending on sensitivity setting.' },
      { title: 'Edit-pattern loop detection', detail: 'Detects when you are editing the same region of code repeatedly with no forward progress.' },
      { title: 'TypeScript context engine (~80% token reduction)', detail: 'Free tier. Extracts imports, function signatures, and the 20 lines surrounding your current error.' },
      { title: 'Rust context engine (89–99% token reduction)', detail: 'Pro tier. Full AST parse, Shannon entropy scoring, Myers delta, memory cache.' },
      { title: 'MCP server — 21 context tools', detail: 'Works with Claude Code, Cursor, Windsurf. Configured by the LoopGuard: Configure MCP Server command.' },
      { title: 'Shell hooks — CLI output compression', detail: 'bash, zsh, fish on Windows (WSL), macOS, Linux. 60–90% reduction on npm, git, docker output.' },
      { title: 'Multi-IDE auth — VS Code, Cursor, Windsurf', detail: 'URI callback scheme auto-detected from vscode.env.uriScheme.' },
      { title: 'Windows · macOS · Linux platform support', detail: 'x64 and ARM64. Binary distributed inside platform-specific VSIX.' },
      { title: 'Session sync to web dashboard', detail: 'Metrics sync every 5 minutes and on session end. Loop events sync individually.' },
    ],
  },
  {
    phase: 'In Progress',
    tag: 'v0.2.0',
    tagColor: '#2563EB',
    items: [
      { title: 'Web dashboard — live session data', detail: 'Connect the extension and see all your loops, token savings, and time wasted in your browser in real time.' },
      { title: 'Supabase schema — deploy and run', detail: 'Run apps/api/supabase/schema.sql in the Supabase SQL editor to enable all backend storage.' },
      { title: 'API deployment on Railway', detail: 'Deploy apps/api to Railway so the extension can sync metrics to a live backend.' },
      { title: 'VS Code Marketplace submission', detail: 'Submit the extension for review. Requires VSCE_TOKEN and publisher account.' },
    ],
  },
  {
    phase: 'Next Up',
    tag: 'v0.3.0',
    tagColor: '#F59E0B',
    items: [
      { title: 'Smart suggestions — AI-powered break-out hints', detail: 'When a loop is detected, LoopGuard asks Claude to suggest three fundamentally different approaches — not just renamed versions of the same fix.' },
      { title: 'Prompt history tracking', detail: 'LoopGuard stores a hash of every AI prompt you send. Detects when you re-send the same prompt and warns you before you waste another turn.' },
      { title: 'Per-file loop heatmap', detail: 'Shows which files in your project are causing the most loops across all sessions. Identifies structural bugs, not just session-level issues.' },
      { title: 'Slack / Discord alerts for teams', detail: 'Teams can route loop alerts to a shared channel. Useful for pair debugging and onboarding tracking.' },
    ],
  },
  {
    phase: 'Planned',
    tag: 'v1.0.0',
    tagColor: '#A78BFA',
    items: [
      { title: 'JetBrains IDE support (IntelliJ, PyCharm, WebStorm)', detail: 'Separate plugin using the IntelliJ Platform SDK. Same loop detection and context engine, different activation model.' },
      { title: 'Team plan — shared dashboards', detail: 'Org-level view of loop rates, token spend, and time wasted across all developers. Identify which parts of the codebase create the most AI friction.' },
      { title: 'Token budget enforcement', detail: 'Set a daily token budget per developer. LoopGuard warns when 80% is consumed and blocks context copies when the limit is hit.' },
      { title: 'Multi-model routing', detail: 'Route cheap queries (boilerplate, formatting) to smaller models and only send complex loop-breaking queries to GPT-4 / Claude Opus.' },
      { title: 'Context quality scoring', detail: 'After each AI response, score how relevant it was. Feed this back into the entropy model to improve future context selection.' },
    ],
  },
  {
    phase: 'Research',
    tag: 'Future',
    tagColor: '#6B7280',
    items: [
      { title: 'Offline LLM routing', detail: 'Route context-heavy requests to a local model (Ollama, LM Studio) to eliminate API costs entirely for routine tasks.' },
      { title: 'Cross-session loop database', detail: 'Aggregate loop patterns across all users (opt-in, anonymized) to identify the top 100 error patterns that cost developers the most time industry-wide.' },
      { title: 'CI/CD integration', detail: 'Run LoopGuard in CI to detect loops in automated test runs — useful for flaky test debugging and build pipeline optimization.' },
    ],
  },
];

export default function RoadmapPage() {
  return (
    <div className="min-h-screen bg-[#0B1220]">
      {/* Header */}
      <div className="border-b border-[#1F2937]">
        <div className="max-w-3xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/icon-192x192.png" alt="LoopGuard" width="28" height="28" className="rounded-lg" />
            <span className="font-bold text-white">LoopGuard</span>
          </Link>
          <Link href="/changelog" className="text-sm text-[#6B7280] hover:text-[#9CA3AF] transition-colors">
            Changelog →
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-white mb-2">Roadmap</h1>
        <p className="text-[#6B7280] mb-3">
          What we are building, in order. This is a living document — priorities shift based on user feedback.
        </p>
        <p className="text-xs text-[#4B5563] mb-16">
          Have a feature request?{' '}
          <a href="https://github.com/rodthenewcomer/loopguard/issues" className="text-[#6B7280] hover:text-[#9CA3AF] underline underline-offset-2 transition-colors">
            Open an issue on GitHub
          </a>
        </p>

        <div className="space-y-14">
          {PHASES.map((phase) => (
            <div key={phase.phase}>
              {/* Phase header */}
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-xl font-bold text-white">{phase.phase}</h2>
                <span
                  className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                  style={{ background: phase.tagColor + '20', color: phase.tagColor, border: `1px solid ${phase.tagColor}40` }}
                >
                  {phase.tag}
                </span>
              </div>

              <div className="space-y-4">
                {phase.items.map((item) => (
                  <div
                    key={item.title}
                    className="p-4 rounded-xl border border-[#1F2937] bg-[#111827]/40 hover:border-[#374151] transition-colors duration-200"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                        style={{ background: phase.tagColor }}
                      />
                      <div>
                        <div className="text-[#F9FAFB] text-sm font-semibold mb-1">{item.title}</div>
                        <div className="text-[#6B7280] text-sm leading-relaxed">{item.detail}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
