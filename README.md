<div align="center">

<img src="apps/web/public/loopguard-infinity-white.svg" width="72" alt="LoopGuard" />

# LoopGuard

**Stop wasting time and money on AI coding loops.**

[![VS Code Marketplace](https://img.shields.io/visual-studio-marketplace/v/LoopGuard.loopguard?label=VS%20Code&logo=visualstudiocode&logoColor=white&color=0066B8)](https://marketplace.visualstudio.com/items?itemName=LoopGuard.loopguard)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/LoopGuard.loopguard?color=0066B8&label=installs)](https://marketplace.visualstudio.com/items?itemName=LoopGuard.loopguard)
[![Build](https://github.com/rodthenewcomer/loopguard/actions/workflows/release.yml/badge.svg)](https://github.com/rodthenewcomer/loopguard/actions/workflows/release.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-22c55e)](LICENSE)

</div>

---

LoopGuard is a local-first VS Code extension that catches repeated AI-assisted fix loops before they silently consume your next half hour — and keeps prompts dramatically smaller so you spend less on tokens.

## The Problem

You paste an error into Claude, Copilot, or Cursor. You apply the fix. The same error comes back. You paste it again. Twenty minutes later you're still in the same loop, burning time and API credits on identical context.

LoopGuard catches this automatically, shows you how long you've been stuck, and gives you a focused context snapshot instead of the whole file.

## What It Does

| | |
|---|---|
| **Loop detection** | Watches VS Code diagnostics and edit patterns — alerts when you've hit the same error multiple times |
| **Time wasted counter** | Shows elapsed loop time in the status bar so the cost is always visible |
| **Focused context copy** | Copies only the relevant lines around the current error, not the whole file |
| **MCP integration** | Exposes a local `loopguard-ctx` helper for Claude Code, Cursor, Windsurf, and Codex CLI |
| **Shell hooks** | Cleans terminal output before it reaches AI models |
| **Web dashboard** | Optional sync of anonymized session metrics — source code never leaves your device |

## Install

**VS Code Marketplace:**

```
ext install LoopGuard.loopguard
```

Search `LoopGuard` in the Extensions sidebar, or install from the [Marketplace page](https://marketplace.visualstudio.com/items?itemName=LoopGuard.loopguard).

## Quick Start

### Editor

1. Install the extension — it activates automatically on workspace open.
2. Work normally. When you hit a loop, the status bar shows time wasted and an alert fires.
3. Run `LoopGuard: Copy Optimized Context` to get a focused prompt instead of pasting the whole file.

### Agent / MCP

1. Install the local helper:
   ```bash
   brew install rodthenewcomer/loopguard/loopguard-ctx
   # or
   curl -fsSL https://loopguard.vercel.app/install.sh | sh
   ```
2. Run `LoopGuard: Configure MCP Server` from the command palette.
3. Restart your AI tool so it picks up the new MCP config.

## Commands

| Command | What It Does |
|---|---|
| `LoopGuard: Show Dashboard` | Open the in-editor session overview |
| `LoopGuard: Copy Optimized Context` | Copy focused context for the current file and error |
| `LoopGuard: Configure MCP Server` | Set up the local MCP helper for your AI tool |
| `LoopGuard: Install Shell Hooks` | Add shell hooks to clean output before AI calls |
| `LoopGuard: Reset Session` | Clear loop state and timer |
| `LoopGuard: Toggle Detection` | Pause or resume loop detection |
| `LoopGuard: Sign In` | Optional — enables web dashboard sync |

## v3 MCP Tools (Intelligence Layer)

Available via `loopguard-ctx` MCP to all supported tools (Claude Code, Cursor, Windsurf, Codex CLI):

| Tool | What It Does |
|---|---|
| `ctx_loop_hint(error_text)` / `loopguard-ctx hint "<error>"` | Root cause hint — diagnoses the error pattern, returns fix suggestion. No LLM call. |
| `ctx_forecast(task)` / `loopguard-ctx forecast "<task>"` | Token cost estimator — complexity + cost table across Sonnet, Haiku, GPT-4o, Gemini Flash |
| `ctx_memory(action, ...)` / `loopguard-ctx memory <action>` | Local fix memory — record/query/list fix patterns. Shown in extension dashboard. |
| `ctx_predict(task, path?)` / `loopguard-ctx predict "<task>"` | Predictive file ranking — scores workspace files by relevance before any reads |

**Session protocol (Claude Code / Cursor / Windsurf):**

```
1. ctx_session load     — restore previous task + findings
2. ctx_forecast(task)   — estimate token cost before starting
3. ctx_predict(task)    — rank relevant files before reading
4. ctx_overview(task)   — get project map for context
5. ctx_wrapped          — session savings summary at end
```

After resolving a loop:
```
ctx_memory(action="record", error_text="...", fix_file="file:line", fix_description="what fixed it")
```

## Settings

| Setting | Default | Description |
|---|---|---|
| `loopguard.sensitivity` | `medium` | Loop trigger speed: `low` (5 hits), `medium` (3), `high` (2) |
| `loopguard.loopThreshold` | `3` | Custom count, overrides sensitivity preset |
| `loopguard.enableContextEngine` | `true` | Filter context before AI calls |
| `loopguard.enableNotifications` | `true` | Show popup alerts on loop detection |

## Supported Editors & Workflows

- VS Code
- Cursor
- Windsurf
- Codex CLI
- Claude Code
- GitHub Copilot (VS Code MCP)
- bash · zsh · fish (via shell hooks)

## Privacy

**Your code never leaves your machine.**

Loop detection and context selection run entirely locally. If you sign in, the backend stores only anonymized metrics — loop counts, session durations, token-saved estimates. No source code, no file contents.

Full policy: [loopguard.vercel.app/privacy](https://loopguard.vercel.app/privacy)

## Honest Positioning

- LoopGuard cuts focused prompt size by **70%+ in normal use**, especially with the native helper active.
- The `93%` figure in product copy is a measured high-end result, not a universal promise.
- Exact savings vary by file, workflow, and read mode.
- The value is not compression — it is saving time, trimming tokens, and making AI sessions cheaper to run.

## Roadmap

| Version | Status | Focus |
|---|---|---|
| **v1 — Extension Core** | Shipped | Loop detection, status bar, focused context copy, VS Code/Cursor/Windsurf |
| **v2 — CLI + Sync Pipeline** | Current | loopguard-ctx binary, MCP tools, Homebrew, anonymous device sync, /wrapped |
| **v3 — Intelligence Layer** | Current | Root cause hints, predictive context, session memory, cost forecasting |

Full details at [loopguard.vercel.app/roadmap](https://loopguard.vercel.app/roadmap).

## Architecture

```
apps/
  extension/        VS Code extension — core product (TypeScript)
  web/              Next.js landing page + web dashboard
  api/              Auth, sync, and support APIs (Supabase + Express)

packages/
  core/             Loop detection + context selection logic
  context-engine/   Native Rust helper binary + MCP tooling
  types/            Shared TypeScript interfaces
  utils/            Shared utilities
```

**Key constraints:**
- Core runs **locally** — no cloud round-trips required
- Extension activates in **< 500ms**, loop checks in **< 5ms**
- Backend stores **no source code** — anonymized metrics only

## Development

```bash
npm install
npm run build
npm run type-check
```

```bash
cd apps/web && npm run dev           # web dashboard
cd apps/extension && npm run build   # extension
cd packages/context-engine/rust && cargo check  # Rust binary
```

## Links

- Homepage: [loopguard.vercel.app](https://loopguard.vercel.app)
- Docs: [loopguard.vercel.app/docs](https://loopguard.vercel.app/docs)
- Roadmap: [loopguard.vercel.app/roadmap](https://loopguard.vercel.app/roadmap)
- Issues: [github.com/rodthenewcomer/loopguard/issues](https://github.com/rodthenewcomer/loopguard/issues)
- Support: [buymeacoffee.com/rodthenewcomer](https://buymeacoffee.com/rodthenewcomer)

## License

MIT — see [LICENSE](LICENSE).
