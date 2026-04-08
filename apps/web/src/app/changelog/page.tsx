import type { Metadata } from 'next';
import Link from 'next/link';
import LoopGuardLogo from '../../components/LoopGuardLogo';

export const metadata: Metadata = {
  title: 'Changelog — LoopGuard',
  description: 'Every release, every fix, every improvement to LoopGuard.',
};

interface ReleaseSection {
  label: string;
  color: string;
  items: string[];
}

interface Release {
  version: string;
  date: string;
  tag: string;
  tagColor: string;
  summary: string;
  sections: ReleaseSection[];
}

const RELEASES: Release[] = [
  {
    version: 'v2.8.2',
    date: 'April 2026',
    tag: 'Latest',
    tagColor: '#22C55E',
    summary: 'Cleans up first-run onboarding: one public site domain, clearer setup/docs flows, corrected Gemini/Windsurf/Codex guidance, and dashboard/account totals that are easier to trust.',
    sections: [
      {
        label: 'New-user onboarding',
        color: '#2563EB',
        items: [
          'Normalized the public site and install links around loopguard.vercel.app so setup, docs, and auth all point to the same place',
          'Rewrote the setup/docs comparison points so extension-first users can get started without reading the advanced helper sections first',
          'Clarified the helper-only path for Claude Code, Codex CLI, Windsurf, and Gemini-family tools',
        ],
      },
      {
        label: 'Dashboard and sync trust',
        color: '#22D3EE',
        items: [
          'All-time totals are now surfaced consistently in the signed-in dashboard flows',
          'Web dashboard auth and API surfaces are aligned with the live public site origin',
          'Extension and web docs now explain exactly which features are local-only versus synced',
        ],
      },
      {
        label: 'Release cleanup',
        color: '#F59E0B',
        items: [
          'LoopGuard helper help text and install surfaces now report the current 2.8.2 version line',
          'Windsurf and Gemini-family setup paths no longer get skipped during helper setup',
          'Project-level agent guidance files are ready to commit for Cursor and Windsurf users',
        ],
      },
    ],
  },
  {
    version: 'v2.8.0',
    date: 'April 2026',
    tag: 'New',
    tagColor: '#22D3EE',
    summary: 'Adds ctx_knowledge and ctx_agent — persistent project knowledge and multi-agent scratchpad. Any MCP-connected agent can now read and write shared facts, making handoffs between Claude Code, Cursor, Codex CLI, and Gemini-family tools seamless. Adds Gemini CLI / Antigravity support. npm distribution now live.',
    sections: [
      {
        label: 'ctx_knowledge — Project Knowledge Store',
        color: '#22D3EE',
        items: [
          'Persistent categorized knowledge store at ~/.loopguard-ctx/knowledge.json',
          'Actions: set, get, list, delete, clear — all scoped per project automatically',
          'Fuzzy key matching on get — no exact spelling required',
          'Grouped-by-category output on list for readable overviews',
          'Capped at 2,000 entries with LRU eviction — never grows unbounded',
          'All agents on the same machine share the same knowledge file',
        ],
      },
      {
        label: 'ctx_agent — Multi-Agent Scratchpad',
        color: '#A78BFA',
        items: [
          'Shared scratchpad at ~/.loopguard-ctx/agent-scratchpad.json',
          'Actions: write, read, list, delete, clear — notes scoped per project and labeled per agent',
          'TTL support — notes auto-expire after a configurable number of hours',
          'Fuzzy label matching on read — finds related notes even with inexact queries',
          'Grouped-by-agent output on list so you can see what each agent last wrote',
          'Hard cap at 500 notes with recency eviction',
          'Enables start-in-one-agent, continue-in-another handoffs without re-explaining context',
        ],
      },
      {
        label: 'Gemini CLI / Antigravity',
        color: '#F59E0B',
        items: [
          'Gemini-family integration — MCP + instruction layer via the local helper guidance file',
          'loopguard-ctx setup --agent=gemini writes the MCP config and intelligence hooks',
          'Automatic URI scheme detection for Gemini-family forks was added to the extension auth flow',
        ],
      },
      {
        label: 'Distribution',
        color: '#22C55E',
        items: [
          'npm package loopguard-ctx-bin now published on every release tag — npm install -g loopguard-ctx-bin',
          'Homebrew formula updated to homebrew-core compatible structure with real SHA256s',
          'Release CI now auto-publishes to npm and auto-updates the Homebrew formula with checksums',
          'GitHub Release notes now include npm install instructions alongside Homebrew and curl paths',
        ],
      },
      {
        label: 'Docs & Setup',
        color: '#2563EB',
        items: [
          '"What you get in 60 seconds" callout added at the top of the setup page',
          'Glossary callout defining token, MCP, and context added to docs page',
          '"Zero-gap setup" renamed to "One-command agent setup" with plain-English description',
          'Setup page subtitle and helper path cards rewritten to remove MCP jargon',
          'ctx_knowledge and ctx_agent fully documented in docs page with usage examples',
        ],
      },
    ],
  },
  {
    version: 'v0.1.0',
    date: 'March 2026',
    tag: 'Initial Release',
    tagColor: '#22C55E',
    summary: 'First public release of LoopGuard. Loop detection, focused context copy, MCP support, and shell hooks are all part of the local-first product story.',
    sections: [
      {
        label: 'Loop Detection',
        color: '#F59E0B',
        items: [
          'Diagnostic-based loop detection via VS Code diagnostics API — works on all languages VS Code supports',
          'Edit-pattern loop detection — catches loops even when the error message changes between attempts',
          'Configurable sensitivity: Low (5 occurrences), Medium (3 occurrences), High (2 occurrences)',
          'Real-time status bar showing active loop count and total time wasted this session',
          'Alert notification with three actions: Try New Approach, View Details, Ignore',
          'Session dashboard webview panel — live session metrics, active loops, and token estimates',
          'Session reset command — clears all loop state and restarts the timer',
          'Toggle detection on/off without reloading the extension',
        ],
      },
      {
        label: 'Context Engine',
        color: '#22D3EE',
        items: [
          'Built-in focused context copy works out of the box with no binary setup',
          'The native helper can make prompts much smaller on some files and MCP workflows',
          'Focused context copy from the current file using imports plus nearby error context',
          'A stronger local read path is available through the loopguard-ctx helper',
          'The extension UI reports quick local token estimates after each copy',
          'Copy Optimized Context command (Ctrl+Shift+P) — copies compressed context to clipboard',
          'Measured reductions vary by file, language, and mode rather than staying fixed at one percentage',
          'Loop detection is language-agnostic because it follows IDE diagnostics',
        ],
      },
      {
        label: 'MCP Server',
        color: '#A78BFA',
        items: [
          'loopguard-ctx exposes a larger MCP toolset for compatible AI clients',
          'Supported setup targets include Claude Code, Cursor, Windsurf, Codex CLI, Zed, and VS Code / Copilot',
          'ctx_read — focused file reads with multiple modes',
          'ctx_search — compact code search results',
          'ctx_tree — compressed directory structure',
          'ctx_shell — cleaner shell output for AI-facing workflows',
          'LoopGuard: Configure MCP Server writes the right config file for the selected tool',
          'The MCP server is the local loopguard-ctx binary — no Node wrapper required',
        ],
      },
      {
        label: 'Shell Hooks',
        color: '#F59E0B',
        items: [
          'Shell helper path for reducing noisy CLI output before you paste it into AI tools',
          'Supports bash, zsh, fish on Windows (WSL), macOS, and Linux',
          '60–90% reduction on npm install, git log, docker build, cargo build output',
          'Install via LoopGuard: Install Shell Hooks or loopguard-ctx init',
        ],
      },
      {
        label: 'Auth & Sync',
        color: '#2563EB',
        items: [
          'Sign In command — opens browser to loopguard.vercel.app/auth/extension',
          'Google OAuth and email + password sign-in supported',
          'JWT stored in VS Code SecretStorage (macOS Keychain / Windows Credential Manager / Linux libsecret)',
          'Session metrics sync to API every 5 minutes and on session end',
          'Loop events sync individually — each detection fires a single lightweight API call',
          'Works on VS Code, Cursor, and Windsurf — IDE callback URI auto-detected from vscode.env.uriScheme',
        ],
      },
      {
        label: 'Platform Support',
        color: '#22C55E',
        items: [
          'Windows 10 / 11 — x64 and ARM64',
          'macOS 12+ — x64 (Intel) and ARM64 (Apple Silicon)',
          'Linux — x64 and ARM64 (glibc 2.17+)',
          'Rust binary distributed as platform-specific VSIX — no Cargo, no build step required',
          'Loop detection uses VS Code diagnostics API — identical behavior on all platforms',
        ],
      },
    ],
  },
];

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-[#0B1220]">
      {/* Header */}
      <div className="border-b border-[#1F2937]">
        <div className="max-w-3xl mx-auto px-4 py-5 flex items-center justify-between sm:px-6 sm:py-6">
          <Link href="/" className="flex items-center gap-2.5">
            <LoopGuardLogo showWordmark size={28} />
          </Link>
          <Link href="/docs" className="text-sm text-[#6B7280] hover:text-[#9CA3AF] transition-colors">
            Docs →
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10 sm:px-6 sm:py-16">
        <h1 className="text-3xl font-bold text-white mb-2 sm:text-4xl">Changelog</h1>
        <p className="text-[#6B7280] mb-16">Every release, every fix, every improvement.</p>

        <div className="space-y-16">
          {RELEASES.map((release) => (
            <div key={release.version}>
              {/* Release header */}
              <div className="flex flex-wrap items-center gap-3 mb-8">
                <span className="text-2xl font-black text-white font-mono">{release.version}</span>
                <span
                  className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                  style={{ background: release.tagColor + '20', color: release.tagColor, border: `1px solid ${release.tagColor}40` }}
                >
                  {release.tag}
                </span>
                <span className="text-sm text-[#4B5563] ml-auto">{release.date}</span>
              </div>

              <p className="text-[#9CA3AF] text-sm leading-relaxed mb-8 pl-4 border-l-2 border-[#1F2937]">
                {release.summary}
              </p>

              <div className="space-y-8">
                {release.sections.map((section) => (
                  <div key={section.label}>
                    <div
                      className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider"
                      style={{ color: section.color }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: section.color }} />
                      {section.label}
                    </div>
                    <ul className="space-y-2">
                      {section.items.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-sm text-[#6B7280]">
                          <span className="text-[#374151] mt-1.5 flex-shrink-0">—</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Coming next */}
        <div className="mt-16 pt-8 border-t border-[#1F2937]">
          <p className="text-sm text-[#4B5563]">
            See what&rsquo;s coming next on the{' '}
            <Link href="/roadmap" className="text-[#6B7280] hover:text-[#9CA3AF] underline underline-offset-2 transition-colors">
              Roadmap
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
