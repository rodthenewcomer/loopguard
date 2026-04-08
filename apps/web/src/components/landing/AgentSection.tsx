import ScrollReveal from '../ScrollReveal';
import { Icon, IC } from '../Icon';

const AGENT_BADGES = [
  { label: 'Claude Code', icon: IC.terminal },
  { label: 'Cursor', icon: IC.code },
  { label: 'Codex CLI', icon: IC.terminal },
  { label: 'Windsurf', icon: IC.code },
  { label: 'GitHub Copilot', icon: IC.code },
  { label: 'Gemini CLI', icon: IC.terminal },
];

const AGENT_COMMANDS = [
  { label: 'Claude Code', cmd: 'loopguard-ctx setup --agent=claude', detail: 'MCP + shell hook + guidance file' },
  { label: 'Cursor', cmd: 'loopguard-ctx setup --agent=cursor', detail: 'MCP + cursor rule file' },
  { label: 'Codex CLI', cmd: 'loopguard-ctx setup --agent=codex', detail: 'MCP + local instruction file' },
  { label: 'Gemini CLI', cmd: 'loopguard-ctx setup --agent=gemini', detail: 'MCP + instruction layer' },
];

export default function AgentSection() {
  return (
    <>
      {/* ICP divider — secondary audience: developers building with AI agents */}
      <div className="border-t border-white/8 bg-black/30">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
          <div className="flex flex-wrap items-center gap-4">
            <div className="h-px flex-1 bg-white/8" />
            <span className="text-xs font-semibold uppercase tracking-[0.28em] text-[#7B95AE]">
              For developers building with AI agents
            </span>
            <div className="h-px flex-1 bg-white/8" />
          </div>
        </div>
      </div>

      <section id="agent-integration" className="mx-auto max-w-7xl px-4 pb-16 pt-4 sm:px-6 sm:pb-24 lg:px-10">
        <ScrollReveal>
          <div className="mb-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.3em] text-[#7B95AE]">Agent integration</div>
              <h2 className="mt-3 text-3xl font-bold tracking-[-0.05em] text-white sm:text-4xl">
                Wire LoopGuard into your
                <br />
                automated workflows.
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-7 text-[#8CA1B8]">
                Already using the VS Code extension? Add the local helper binary to give Claude Code, Cursor, Codex CLI, and other agents focused read, search, and shell compression tools via MCP — no cloud, no API key, no extra cost.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 lg:justify-end">
              {AGENT_BADGES.map(({ label, icon }) => (
                <span key={label} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-[#8CA1B8]">
                  <Icon path={icon} size={11} />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="overflow-hidden rounded-[28px] border border-white/8 bg-black/20">
            <div className="border-b border-white/8 px-6 py-5">
              <div className="text-xs uppercase tracking-[0.28em] text-[#7B95AE]">One command per agent</div>
            </div>
            <div className="grid gap-px bg-white/8 sm:grid-cols-2 lg:grid-cols-4">
              {AGENT_COMMANDS.map((opt) => (
                <div key={opt.label} className="bg-[#07111C] px-5 py-5">
                  <div className="mb-1 text-xs font-semibold text-white">{opt.label}</div>
                  <code className="block font-mono text-[11px] text-[#8AE8FF]">{opt.cmd}</code>
                  <p className="mt-2 text-[11px] text-[#7B95AE]">{opt.detail}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/8 px-6 py-4">
              <p className="text-xs text-[#7B95AE]">
                Run <code className="text-[#8AE8FF]">loopguard-ctx doctor</code> to verify every layer is green.
                Install via <code className="text-[#8AE8FF]">brew install loopguard-ctx</code> or <code className="text-[#8AE8FF]">npm i -g loopguard-ctx-bin</code>.
              </p>
              <a
                href="/setup#codex"
                className="inline-flex flex-shrink-0 items-center gap-1.5 text-sm font-semibold text-[#8AE8FF] transition hover:text-white"
              >
                Full agent setup guide
                <Icon path={IC.arrow} size={14} />
              </a>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}
