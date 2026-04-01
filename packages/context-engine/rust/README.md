# loopguard-ctx

**Context Intelligence Engine with CCP + TDD. Shell Hook + MCP Server. 21 MCP tools, 90+ shell patterns, cross-session memory (CCP), LITM-aware positioning, tree-sitter AST for 14 languages. Single Rust binary.**

[![CI](https://github.com/yvgude/loopguard-ctx/actions/workflows/ci.yml/badge.svg)](https://github.com/yvgude/loopguard-ctx/actions/workflows/ci.yml)
[![Security Check](https://github.com/yvgude/loopguard-ctx/actions/workflows/security-check.yml/badge.svg)](https://github.com/yvgude/loopguard-ctx/actions/workflows/security-check.yml)
[![Crates.io](https://img.shields.io/crates/v/loopguard-ctx)](https://crates.io/crates/loopguard-ctx)
[![Downloads](https://img.shields.io/crates/d/loopguard-ctx)](https://crates.io/crates/loopguard-ctx)
[![AUR](https://img.shields.io/aur/version/loopguard-ctx)](https://aur.archlinux.org/packages/loopguard-ctx)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Discord](https://img.shields.io/badge/Discord-Join-5865F2?logo=discord&logoColor=white)](https://discord.gg/pTHkG9Hew9)

[Website](https://loopguardctx.com) · [Install](#installation) · [Quick Start](#quick-start) · [CLI Reference](#cli-commands) · [MCP Tools](#21-mcp-tools) · [Changelog](CHANGELOG.md) · [vs RTK](#loopguard-ctx-vs-rtk) · [Discord](https://discord.gg/pTHkG9Hew9)

---

loopguard-ctx reduces LLM token consumption by **up to 99%** through two complementary strategies in a single binary:

1. **Shell Hook** — Transparently compresses CLI output (90+ patterns) before it reaches the LLM. Works without LLM cooperation.
2. **MCP Server** — 21 tools for cached file reads, adaptive mode selection, incremental deltas, dependency maps, intent detection, cross-file dedup, project graph, cross-session memory (CCP), and session metrics. Works with Cursor, GitHub Copilot, Claude Code, Windsurf, OpenAI Codex, Google Antigravity, OpenCode, and any MCP-compatible editor.
3. **AI Tool Hooks** — One-command integration for Claude Code, Cursor, Gemini CLI, Codex, Windsurf, and Cline via `loopguard-ctx init --agent <tool>`.

## Token Savings (Typical Cursor/Claude Code Session)

| Operation | Frequency | Standard | loopguard-ctx | Savings |
|---|---|---|---|---|
| File reads (cached) | 15x | 30,000 | 195 | **-99%** |
| File reads (map mode) | 10x | 20,000 | 2,000 | **-90%** |
| ls / find | 8x | 6,400 | 1,280 | **-80%** |
| git status/log/diff | 10x | 8,000 | 2,400 | **-70%** |
| grep / rg | 5x | 8,000 | 2,400 | **-70%** |
| cargo/npm build | 5x | 5,000 | 1,000 | **-80%** |
| Test runners | 4x | 10,000 | 1,000 | **-90%** |
| curl (JSON) | 3x | 1,500 | 165 | **-89%** |
| docker ps/build | 3x | 900 | 180 | **-80%** |
| **Total** | | **~89,800** | **~10,620** | **-88%** |

> Estimates based on medium-sized TypeScript/Rust projects. MCP cache hits reduce re-reads to ~13 tokens each.

## Installation

### Homebrew (macOS / Linux)

```bash
brew tap yvgude/loopguard-ctx
brew install loopguard-ctx
```

### Arch Linux (AUR)

```bash
yay -S loopguard-ctx        # builds from source (crates.io)
# or
yay -S loopguard-ctx-bin    # pre-built binary (GitHub Releases)
```

### Cargo

```bash
cargo install loopguard-ctx
```

### Build from Source

```bash
git clone https://github.com/yvgude/loopguard-ctx.git
cd loopguard-ctx/rust
cargo build --release
cp target/release/loopguard-ctx ~/.local/bin/
```

> Add `~/.local/bin` to your PATH if needed:
> ```bash
> echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc  # or ~/.bashrc
> ```

### Verify Installation

```bash
loopguard-ctx --version   # Should show "loopguard-ctx 2.1.1"
loopguard-ctx gain        # Should show token savings stats
```

## Token Dense Dialect (TDD)

loopguard-ctx introduces **TDD mode** — enabled by default. TDD compresses LLM communication using mathematical symbols and short identifiers:

| Symbol | Meaning |
|---|---|
| `λ` | function/handler |
| `§` | struct/class/module |
| `∂` | interface/trait |
| `τ` | type alias |
| `ε` | enum |
| `α1, α2...` | short identifier IDs |

**How it works:**
- Signatures use compact notation: `λ+handle(⊕,path:s)→s` instead of `fn pub async handle(&self, path: String) -> String`
- Long identifiers (>12 chars) are mapped to `α1, α2...` with a `§MAP` at the end
- MCP instructions tell the LLM to respond in Token Dense Dialect — shorter responses, less thinking tokens

**Result**: 8-25% additional savings on top of existing compression.

Configure with `LEAN_CTX_CRP_MODE`:
- `tdd` (default) — Maximum compression with symbol shorthand
- `compact` — Moderate: skip filler words, use abbreviations
- `off` — Standard output, no CRP instructions

## Quick Start

```bash
# 1. Install
cargo install loopguard-ctx

# 2. Set up shell hook (auto-installs aliases)
loopguard-ctx init --global

# 3. Configure your editor (example: Cursor)
# Add to ~/.cursor/mcp.json:
# { "mcpServers": { "loopguard-ctx": { "command": "loopguard-ctx" } } }

# 4. Restart your shell + editor, then test
git status       # Automatically compressed via shell hook
loopguard-ctx gain    # Check your savings
```

The shell hook transparently wraps commands (e.g., `git status` → `loopguard-ctx -c git status`) and compresses the output. The LLM never sees the rewrite — it just gets compact output.

## How It Works

```
  Without loopguard-ctx:                              With loopguard-ctx:

  LLM --"read auth.ts"--> Editor --> File        LLM --"ctx_read auth.ts"--> loopguard-ctx --> File
    ^                                  |           ^                           |            |
    |      ~2,000 tokens (full file)   |           |   ~13 tokens (cached)     | cache+hash |
    +----------------------------------+           +------ (compressed) -------+------------+

  LLM --"git status"-->  Shell  -->  git         LLM --"git status"-->  loopguard-ctx  -->  git
    ^                                 |            ^                       |              |
    |     ~800 tokens (raw output)    |            |   ~150 tokens         | compress     |
    +---------------------------------+            +------ (filtered) -----+--------------+
```

Four strategies applied per command type:

1. **Smart Filtering** — Removes noise (progress bars, ANSI codes, whitespace, boilerplate)
2. **Grouping** — Aggregates similar items (files by directory, errors by type)
3. **Truncation** — Keeps relevant context, cuts redundancy
4. **Deduplication** — Collapses repeated log lines with counts

## CLI Commands

### Shell Hook

```bash
loopguard-ctx -c "git status"       # Execute + compress output
loopguard-ctx exec "cargo build"    # Same as -c
loopguard-ctx shell                 # Interactive REPL with compression
```

### File Operations

```bash
loopguard-ctx read file.rs                    # Full content (with structured header)
loopguard-ctx read file.rs -m map             # Dependency graph + API signatures (~10% tokens)
loopguard-ctx read file.rs -m signatures      # Function/class signatures only (~15% tokens)
loopguard-ctx read file.rs -m aggressive      # Syntax-stripped content (~40% tokens)
loopguard-ctx read file.rs -m entropy         # Shannon entropy filtered (~30% tokens)
loopguard-ctx read file.rs -m "lines:10-50,80-90"  # Specific line ranges (comma-separated)
loopguard-ctx diff file1.rs file2.rs          # Compressed file diff
loopguard-ctx grep "pattern" src/             # Grouped search results
loopguard-ctx find "*.rs" src/                # Compact find results
loopguard-ctx ls src/                         # Token-optimized directory listing
loopguard-ctx deps .                          # Project dependencies summary
```

### Setup & Analytics

```bash
loopguard-ctx init --global         # Install 23 shell aliases (.zshrc/.bashrc/.config/fish)
loopguard-ctx init --agent claude   # Install Claude Code PreToolUse hook
loopguard-ctx init --agent cursor   # Install Cursor hooks.json
loopguard-ctx init --agent gemini   # Install Gemini CLI BeforeTool hook
loopguard-ctx init --agent codex    # Install Codex AGENTS.md
loopguard-ctx init --agent windsurf # Install .windsurfrules
loopguard-ctx init --agent cline    # Install .clinerules
loopguard-ctx gain                  # Persistent token savings (CLI)
loopguard-ctx gain --graph          # ASCII chart of last 30 days
loopguard-ctx gain --daily          # Day-by-day breakdown
loopguard-ctx gain --json           # Raw JSON export of all stats
loopguard-ctx dashboard             # Web dashboard at localhost:3333
loopguard-ctx dashboard --port=8080 # Custom port
loopguard-ctx discover              # Find uncompressed commands in shell history
loopguard-ctx session               # Show adoption statistics
loopguard-ctx config                # Show configuration (~/.loopguard-ctx/config.toml)
loopguard-ctx config init           # Create default config file
loopguard-ctx doctor                # Diagnostics: PATH, config, aliases, MCP, ports
loopguard-ctx wrapped               # Shareable savings report (CCP)
loopguard-ctx wrapped --week        # Weekly savings report
loopguard-ctx sessions list         # List CCP sessions
loopguard-ctx sessions show <id>    # Show session details
loopguard-ctx sessions cleanup      # Remove old sessions
loopguard-ctx benchmark run         # Real project benchmark (terminal)
loopguard-ctx benchmark run --json  # Machine-readable JSON output
loopguard-ctx benchmark report      # Shareable Markdown report
loopguard-ctx --version             # Show version
loopguard-ctx --help                # Full help
```

### MCP Server

```bash
loopguard-ctx                       # Start MCP server (stdio) — used by editors
```

## Shell Hook Patterns (90+)

The shell hook applies pattern-based compression for 90+ commands across 34 categories:

| Category | Commands | Savings |
|---|---|---|
| **Git** (19) | status, log, diff, add, commit, push, pull, fetch, clone, branch, checkout, switch, merge, stash, tag, reset, remote, blame, cherry-pick | -70-95% |
| **Docker** (10) | build, ps, images, logs, compose ps/up/down, exec, network, volume, inspect | -70-90% |
| **npm/pnpm/yarn** (6) | install, test, run, list, outdated, audit | -70-90% |
| **Cargo** (3) | build, test, clippy | -80% |
| **GitHub CLI** (9) | pr list/view/create/merge, issue list/view/create, run list/view | -60-80% |
| **Kubernetes** (8) | get pods/services/deployments, logs, describe, apply, delete, exec, top, rollout | -60-85% |
| **Python** (7) | pip install/list/outdated/uninstall/check, ruff check/format | -60-80% |
| **Ruby** (4) | rubocop, bundle install/update, rake test, rails test (minitest) | -60-85% |
| **Linters** (4) | eslint, biome, prettier, stylelint | -60-70% |
| **Build Tools** (3) | tsc, next build, vite build | -60-80% |
| **Test Runners** (8) | jest, vitest, pytest, go test, playwright, cypress, rspec, minitest | -90% |
| **Terraform** | init, plan, apply, destroy, validate, fmt, state, import, workspace | -60-85% |
| **Make** | make targets, parallel jobs (`-j`), dry-run (`-n`) | -60-80% |
| **Maven / Gradle** | compile, test, package, install, clean, dependency trees | -60-85% |
| **.NET** | `dotnet` build, test, restore, run, publish, pack | -60-85% |
| **Flutter / Dart** | flutter pub, analyze, test, build; dart pub, analyze, test | -60-85% |
| **Poetry / uv** | install, sync, lock, run, add, remove; uv pip/sync/run | -60-85% |
| **AWS** (7) | s3, ec2, lambda, cloudformation, ecs, logs, sts | -60-80% |
| **Databases** (2) | psql, mysql/mariadb | -50-80% |
| **Prisma** (6) | generate, migrate, db push/pull, format, validate | -70-85% |
| **Helm** (5) | list, install, upgrade, status, template | -60-80% |
| **Bun** (3) | test, install, build | -60-85% |
| **Deno** (5) | test, lint, check, fmt, task | -60-85% |
| **Swift** (3) | test, build, package resolve | -60-80% |
| **Zig** (2) | test, build | -60-80% |
| **CMake** (3) | configure, build, ctest | -60-80% |
| **Ansible** (2) | playbook recap, task summary | -60-80% |
| **Composer** (3) | install, update, outdated | -60-80% |
| **Mix** (5) | test, deps, compile, format, credo/dialyzer | -60-80% |
| **Bazel** (3) | test, build, query | -60-80% |
| **systemd** (2) | systemctl, journalctl | -50-80% |
| **Utils** (5) | curl, grep/rg, find, ls, wget | -50-89% |
| **Data** (3) | env (filtered), JSON schema extraction, log deduplication | -50-80% |

Unrecognized commands get generic compression: ANSI stripping, empty line removal, and long output truncation.

### 23 Auto-Rewritten Aliases

After `loopguard-ctx init --global`, these commands are transparently compressed:

```
git, npm, pnpm, yarn, cargo, docker, docker-compose, kubectl, k,
gh, pip, pip3, ruff, go, golangci-lint, eslint, prettier, tsc,
ls, find, grep, curl, wget
```

Commands already using `loopguard-ctx` pass through unchanged.

## Examples

**Directory listing:**

```
# ls -la src/ (22 lines, ~239 tokens)      # loopguard-ctx -c "ls -la src/" (8 lines, ~46 tokens)
total 96                                     core/
drwxr-xr-x  4 user staff  128 ...           tools/
drwxr-xr-x  11 user staff 352 ...           cli.rs  9.0K
-rw-r--r--  1 user staff  9182 ...           main.rs  4.0K
-rw-r--r--  1 user staff  4096 ...           server.rs  11.9K
...                                          shell.rs  5.2K
                                             4 files, 2 dirs
                                             [loopguard-ctx: 239→46 tok, -81%]
```

**File reading (map mode):**

```
# Full read (284 lines, ~2078 tokens)       # loopguard-ctx read stats.rs -m map (~30 tokens)
use serde::{Deserialize, Serialize};         stats.rs [284L]
use std::collections::HashMap;                 deps: serde::
use std::path::PathBuf;                        exports: StatsStore, load, save, record, format_gain
                                               API:
#[derive(Serialize, Deserialize)]                cl ⊛ StatsStore
pub struct StatsStore {                          fn ⊛ load() → StatsStore
    pub total_commands: u64,                     fn ⊛ save(store:&StatsStore)
    pub total_input_tokens: u64,                 fn ⊛ record(command:s, input_tokens:n, output_tokens:n)
    ...                                          fn ⊛ format_gain() → String
(284 more lines)                             [2078 tok saved (100%)]
```

**curl (JSON):**

```
# curl -s httpbin.org/json (428 bytes)       # loopguard-ctx -c "curl -s httpbin.org/json"
{                                            JSON (428 bytes):
  "slideshow": {                             {
    "author": "Yours Truly",                   slideshow: {4K}
    "date": "date of publication",           }
    "slides": [                              [loopguard-ctx: 127→14 tok, -89%]
      {
        "title": "Wake up to WonderWidgets!",
        "type": "all"
      },
      ...
```

**Visual terminal dashboard** with ANSI colors, Unicode block bars, sparklines, and USD estimates (cost uses **$2.50 per 1M tokens** consistently with the web dashboard and MCP metrics):

```
$ loopguard-ctx gain

  ◆ loopguard-ctx  Token Savings Dashboard
  ────────────────────────────────────────────────────────

   1.7M          76.8%         520          $4.25
   tokens saved   compression    commands       USD saved

  Since 2026-03-23 (2 days)  ▁█

  Top Commands
  ────────────────────────────────────────────────────────
  curl                48x  ████████████████████ 728.1K  97%
  git commit          34x  ██████████▎          375.2K  50%
  git rm               7x  ████████▌            313.4K  100%
  ctx_read           103x  █▌                    59.1K  38%
  cat                 15x  ▊                     29.3K  92%
    ... +33 more commands

  Recent Days
  ────────────────────────────────────────────────────────
  03-23    101 cmds      9.4K saved   46.0%
  03-24    419 cmds      1.7M saved   77.0%

  loopguard-ctx v2.1.1  |  loopguardctx.com  |  loopguard-ctx dashboard
```

## 21 MCP Tools

When configured as an MCP server, loopguard-ctx provides 21 tools that replace or augment your editor's built-in tools:

### Core Tools

| Tool | Purpose | Savings |
|---|---|---|
| `ctx_read` | File reads — 6 modes + `lines:N-M`. Supports `fresh=true` to bypass cache. | 74-99% |
| `ctx_multi_read` | Multiple file reads in one round trip | 74-99% |
| `ctx_tree` | Directory listings (ls, find, Glob) | 34-60% |
| `ctx_shell` | Shell commands with 90+ compression patterns | 60-90% |
| `ctx_search` | Code search (Grep) | 50-80% |
| `ctx_compress` | Context checkpoint for long conversations | 90-99% |

### Intelligence Tools

| Tool | Purpose |
|---|---|
| `ctx_smart_read` | Adaptive mode selection — automatically picks full/map/signatures/diff based on file type, size, and cache state |
| `ctx_delta` | Incremental file updates — only sends changed hunks via Myers diff |
| `ctx_dedup` | Cross-file deduplication — finds shared imports and boilerplate across cached files |
| `ctx_fill` | Priority-based context filling — maximizes information within a token budget |
| `ctx_intent` | Semantic intent detection — classifies queries and auto-loads relevant files |
| `ctx_response` | Response compression — removes filler content, applies TDD shortcuts |
| `ctx_context` | Multi-turn session overview — tracks what the LLM already knows |
| `ctx_graph` | Project intelligence graph — dependency analysis and related file discovery |
| `ctx_discover` | Shell history analysis — finds missed compression opportunities |

### Session Continuity Tools (new in v2.0.0)

| Tool | Purpose |
|---|---|
| `ctx_session` | Cross-session memory — persist task, findings, decisions, files across chats and context compactions |
| `ctx_wrapped` | Shareable savings report — "Spotify Wrapped" for your token savings |

### Analysis Tools

| Tool | Purpose |
|---|---|
| `ctx_benchmark` | Single-file or project-wide benchmark with preservation scores |
| `ctx_metrics` | Session statistics with USD cost estimates ($2.50/1M) |
| `ctx_analyze` | Shannon entropy analysis + mode recommendation |
| `ctx_cache` | Cache management: status, clear, invalidate |

### ctx_read Modes

| Mode | When to use | Token cost |
|---|---|---|
| `full` | Files you will edit (cached re-reads = ~13 tokens). Set `fresh=true` to force re-read. | 100% first read, ~0% cached |
| `map` | Understanding a file without reading it — dependency graph + exports + API | ~5-15% |
| `signatures` | API surface with more detail than map | ~10-20% |
| `diff` | Re-reading files that changed | only changed lines |
| `aggressive` | Large files with boilerplate | ~30-50% |
| `entropy` | Files with repetitive patterns (Shannon + Jaccard filtering) | ~20-40% |
| `lines:N-M` | Only specific line ranges (e.g. `lines:10-50,80-90`) | proportional to selected lines |

### Cache Safety

The session cache auto-clears after 5 minutes of inactivity (configurable via `LEAN_CTX_CACHE_TTL`). This handles new chats, context compaction, and session resets server-side without relying on the LLM.

For explicit control:
- Use `ctx_read` with `fresh=true` to bypass cache and get full content
- Call `ctx_cache(action: "clear")` to reset the entire cache
- Call `ctx_cache(action: "invalidate", path: "...")` to reset a single file

### Context Continuity Protocol (CCP)

New in v2.0.0: CCP provides cross-session memory that persists across chats, context compactions, and IDE restarts. The session state captures your current task, findings, decisions, and files touched — automatically loaded into every new conversation.

**How it works:**
- Session state is stored as JSON in `~/.loopguard-ctx/sessions/`
- Automatically loaded into server instructions on startup
- Uses LITM-aware positioning: critical context placed at the beginning and end of the LLM's context window (where attention is highest), avoiding the "Lost in the Middle" degradation zone
- Incrementally updated after each tool call
- Auto-saved during checkpoints and idle cache expiry

**CLI commands:**
```bash
loopguard-ctx sessions list              # List all sessions
loopguard-ctx sessions show <id>         # Show session details
loopguard-ctx sessions cleanup           # Remove old sessions
loopguard-ctx wrapped                    # Shareable savings report
loopguard-ctx wrapped --week             # Weekly report
loopguard-ctx benchmark run              # Real project benchmark
loopguard-ctx benchmark report           # Shareable Markdown report
```

**MCP usage:**
```json
{"tool": "ctx_session", "arguments": {"action": "status"}}
{"tool": "ctx_session", "arguments": {"action": "task", "value": "Implement auth module"}}
{"tool": "ctx_session", "arguments": {"action": "finding", "value": "Auth uses JWT with RS256"}}
{"tool": "ctx_session", "arguments": {"action": "decision", "value": "Use middleware pattern for auth"}}
{"tool": "ctx_wrapped", "arguments": {}}
```

## Editor Configuration

### Cursor

Add to `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "loopguard-ctx": {
      "command": "loopguard-ctx"
    }
  }
}
```

### GitHub Copilot

Add `.github/copilot/mcp.json` to your project:

```json
{
  "servers": {
    "loopguard-ctx": {
      "command": "loopguard-ctx"
    }
  }
}
```

### Claude Code

```bash
claude mcp add loopguard-ctx loopguard-ctx
```

> **Important — enforcement required for Claude Code**
>
> Registering the MCP server is not enough. Claude Code's model defaults to its built-in Read and
> Grep tools and treats MCP server instructions as advisory only. Without two additional enforcement
> steps the model will ignore loopguard-ctx and all token savings will be lost.
>
> **Why this happens:**
> - Claude Code is trained to reach for Read, Grep, and Bash first.
> - MCP instructions are injected into the system prompt, but the model can choose to ignore them.
> - A PreToolUse hook and a CLAUDE.md global rule are required to block the built-in tools.
>
> **Required extra steps:**
>
> **1. Add a PreToolUse hook** — create `~/.claude/hooks/loopguard-ctx-rewrite.sh` (see full script
> in the LoopGuard user guide, section 8) and register it in `~/.claude/settings.json`:
>
> ```json
> {
>   "hooks": {
>     "PreToolUse": [
>       {
>         "matcher": "Bash|bash|Read|read|Grep|grep",
>         "hooks": [
>           {
>             "type": "command",
>             "command": "~/.claude/hooks/loopguard-ctx-rewrite.sh"
>           }
>         ]
>       }
>     ]
>   }
> }
> ```
>
> **2. Add a global CLAUDE.md rule** — create `~/.claude/CLAUDE.md` with the mandatory substitution
> table (Read → ctx_read, Grep → ctx_search, Bash file reads → ctx_shell, ls/find → ctx_tree).
>
> **3. Verify** — run `mcp__loopguard-ctx__ctx_metrics` at the end of a session to confirm MCP
> tools are being used and token savings are non-zero.
>
> **Emergency bypass:** `LOOPGUARD_BYPASS=1 claude` disables the hook for that session.
>
> See the [user guide](../../../../docs/user-guide.md#claude-code--why-the-model-ignores-loopguard-ctx-instructions-by-default) for complete setup instructions.

### Windsurf

Add to `~/.codeium/windsurf/mcp_config.json`:

```json
{
  "mcpServers": {
    "loopguard-ctx": {
      "command": "loopguard-ctx"
    }
  }
}
```

> **Troubleshooting:** If Windsurf detects the server but tools don't load, use the **full path** to the binary (e.g., `/Users/you/.cargo/bin/loopguard-ctx` or `/usr/local/bin/loopguard-ctx`). Windsurf spawns MCP servers with a minimal PATH that may not include `~/.cargo/bin`. Find your path with `which loopguard-ctx`.

### OpenAI Codex

Add to `~/.codex/config.toml`:

```toml
[mcp_servers.loopguard-ctx]
command = "loopguard-ctx"
args = []
```

Or via CLI: `codex mcp add loopguard-ctx`

### Google Antigravity

Add to `~/.gemini/antigravity/mcp_config.json`:

```json
{
  "mcpServers": {
    "loopguard-ctx": {
      "command": "loopguard-ctx"
    }
  }
}
```

### OpenCode

Add to `~/.config/opencode/opencode.json` (global) or `opencode.json` (project):

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "loopguard-ctx": {
      "type": "local",
      "command": ["loopguard-ctx"],
      "enabled": true
    }
  }
}
```

### OpenClaw

OpenClaw uses a skills-based system instead of MCP. LoopGuard CTX integrates via the **shell hook** — all commands OpenClaw runs through its `exec` tool are automatically compressed when the loopguard-ctx aliases are active.

```bash
# 1. Install shell aliases (if not done already)
loopguard-ctx init --global
source ~/.zshrc

# 2. (Optional) Install the LoopGuard CTX skill for deeper integration
mkdir -p ~/.openclaw/skills/loopguard-ctx
cp skills/loopguard-ctx/SKILL.md ~/.openclaw/skills/loopguard-ctx/
```

The skill teaches OpenClaw to prefer `loopguard-ctx -c <command>` for shell operations, use compressed file reads, and leverage the dashboard for analytics.

### Cursor Terminal Profile

Add a loopguard-ctx terminal profile for automatic shell hook in Cursor:

```json
{
  "terminal.integrated.profiles.osx": {
    "loopguard-ctx": {
      "path": "loopguard-ctx",
      "args": ["shell"],
      "icon": "terminal"
    }
  }
}
```

### Cursor Rule (Optional)

For maximum token savings, add a Cursor rule to your project:

```bash
cp rust/examples/loopguard-ctx.mdc .cursor/rules/loopguard-ctx.mdc
```

This instructs the LLM to prefer loopguard-ctx tools and use compact output patterns (CRP v2).

## Configuration

### Shell Hook Setup

```bash
loopguard-ctx init --global
```

This adds 23 aliases (git, npm, pnpm, yarn, cargo, docker, kubectl, gh, pip, ruff, go, golangci-lint, eslint, prettier, tsc, ls, find, grep, curl, wget, and more) to your `.zshrc` / `.bashrc` / `config.fish`.

Or add manually to your shell profile:

```bash
alias git='loopguard-ctx -c git'
alias npm='loopguard-ctx -c npm'
alias pnpm='loopguard-ctx -c pnpm'
alias cargo='loopguard-ctx -c cargo'
alias docker='loopguard-ctx -c docker'
alias kubectl='loopguard-ctx -c kubectl'
alias gh='loopguard-ctx -c gh'
alias pip='loopguard-ctx -c pip'
alias curl='loopguard-ctx -c curl'
# ... and 14 more (run loopguard-ctx init --global for all)
```

Or use the interactive shell:

```bash
loopguard-ctx shell
```

## Persistent Stats & Web Dashboard

loopguard-ctx tracks all compressions (both MCP tools and shell hook) in `~/.loopguard-ctx/stats.json`:

- Per-command breakdown with token counts and USD estimates ($2.50/1M tokens, aligned with MCP)
- Color-coded compression bars with Unicode block characters
- Sparkline trends showing savings trajectory
- Daily statistics (last 90 days) with rate coloring
- Total lifetime savings with 4 KPI metrics

View in the terminal with the **visual dashboard**:

```bash
loopguard-ctx gain             # Visual dashboard (colors, bars, sparklines)
loopguard-ctx gain --graph     # 30-day savings chart
loopguard-ctx gain --daily     # Bordered day-by-day table with USD
loopguard-ctx gain --json      # Raw JSON export
```

Or open the web dashboard:

```bash
loopguard-ctx dashboard
```

Opens `http://localhost:3333` with:
- 5 KPI cards (tokens saved, savings rate, commands, days active, cost saved)
- 5 interactive charts (cumulative savings, daily rate, activity, top commands, distribution)
- MCP vs Shell Hook breakdown
- Command table with compression bars
- Daily history

## loopguard-ctx vs RTK

| Feature | RTK | loopguard-ctx |
|---|---|---|
| **Architecture** | Shell hook only | **Hybrid: Shell hook + MCP server** |
| **Language** | Rust | Rust |
| **CLI compression** | ~50 commands | **90+ patterns** (git, npm, cargo, docker, gh, kubectl, pip, ruff, eslint, prettier, tsc, go, terraform, make, maven, gradle, dotnet, flutter, dart, poetry, uv, playwright, rubocop, bundle, vitest, aws, psql, mysql, prisma, helm, bun, deno, swift, zig, cmake, ansible, composer, mix, bazel, systemd, curl, wget, JSON, logs...) |
| **File reading** | `rtk read` (signatures mode) | **Modes: full (cached), map, signatures, diff, aggressive, entropy, lines:N-M** |
| **File caching** | ✗ | ✓ MD5 session cache (re-reads = ~13 tokens) |
| **Signature engine** | Line-by-line regex | **tree-sitter AST (14 languages)** |
| **Dependency maps** | ✗ | ✓ import/export extraction (14 languages via tree-sitter) |
| **Context checkpoints** | ✗ | ✓ `ctx_compress` for long conversations |
| **Token counting** | Estimated | tiktoken-exact (o200k_base) |
| **Entropy analysis** | ✗ | ✓ Shannon entropy + Jaccard similarity |
| **Cost tracking** | ✗ | ✓ USD estimates per session ($2.50/1M) |
| **Token Dense Dialect** | ✗ | ✓ TDD mode: symbol shorthand (λ, §, ∂) + identifier mapping (8-25% extra) |
| **Thinking reduction** | ✗ | ✓ CRP v2 (30-60% fewer thinking tokens via Cursor Rules) |
| **Stats & Graphs** | ✓ `rtk gain` (SQLite + ASCII graph) | ✓ Visual terminal dashboard (ANSI colors, Unicode bars, sparklines, USD) + `--graph` + `--daily` + `--json` + web dashboard |
| **Auto-setup** | ✓ `rtk init` | ✓ `loopguard-ctx init` |
| **Editors** | Claude Code, OpenCode, Gemini CLI | **All MCP editors (Cursor, Copilot, Claude Code, Windsurf, Codex, Antigravity, OpenCode) + shell hook (OpenClaw, any terminal)** |
| **Config file** | TOML | ✓ TOML (`~/.loopguard-ctx/config.toml`) |
| **History analysis** | ✗ | ✓ `loopguard-ctx discover` — find uncompressed commands |
| **Homebrew** | ✓ | ✓ `brew tap yvgude/loopguard-ctx && brew install loopguard-ctx` |
| **Adoption tracking** | ✗ | ✓ `loopguard-ctx session` — adoption % |
| **Cross-session memory** | ✗ | ✓ CCP — persists task, findings, decisions across chats |
| **LITM-aware positioning** | ✗ | ✓ Attention-optimal context placement (primacy/recency) |
| **Savings reports** | ✗ | ✓ `loopguard-ctx wrapped` — shareable savings summary |
| **Real project benchmarks** | ✗ | ✓ `loopguard-ctx benchmark run` — scans project files, measures tokens/latency/quality |

**Key difference**: RTK compresses CLI output only. loopguard-ctx compresses CLI output *and* file reads, search results, and project context through the MCP protocol — reaching up to 99% savings on cached re-reads and 60-90% on CLI output. With CCP (v2.0.0), loopguard-ctx additionally eliminates cold-start overhead by persisting session state across conversations.

## tree-sitter Signature Engine

Since v1.5.0, loopguard-ctx uses [tree-sitter](https://tree-sitter.github.io/tree-sitter/) for AST-based signature extraction (enabled by default). This replaces the previous regex-based extractor with accurate parsing of multi-line signatures, arrow functions, and nested definitions.

**14 languages supported**: TypeScript, JavaScript, Rust, Python, Go, Java, C, C++, Ruby, C#, Kotlin, Swift, PHP

| Capability | Regex (old) | tree-sitter (new) |
|---|---|---|
| Multi-line signatures | Missed | Fully parsed |
| Arrow functions | Missed | Fully parsed |
| Nested classes/methods | Heuristic | AST scope tracking |
| Languages | 4 | **14** |

Build without tree-sitter for a smaller binary (~5.7 MB vs ~17 MB):

```bash
cargo install loopguard-ctx --no-default-features
```

## Uninstall

```bash
# Remove shell aliases
loopguard-ctx init --global  # re-run to see what was added, then remove from shell profile

# Remove binary
cargo uninstall loopguard-ctx

# Remove stats
rm -rf ~/.loopguard-ctx
```

## Contributing

Contributions welcome! Please open an issue or PR on [GitHub](https://github.com/yvgude/loopguard-ctx).

- [Discord](https://discord.gg/pTHkG9Hew9)
- [Buy me a coffee](https://buymeacoffee.com/yvgude)

## Security

loopguard-ctx is a **local-only** tool — zero network requests, zero telemetry. See [SECURITY.md](SECURITY.md) for:

- Vulnerability reporting process
- Automated CI security checks (cargo audit, clippy, dangerous pattern scans)
- Dependency audit (all 29 deps are established, MIT/Apache-2.0 licensed crates)
- VirusTotal false positive explanation (common with Rust binaries)
- Build reproducibility instructions

> **Note on VirusTotal:** Rust binaries are frequently flagged by ML-based heuristic scanners (e.g., Microsoft's `Wacatac.B!ml`). This is a [known issue](https://users.rust-lang.org/t/rust-programs-flagged-as-malware/49799) affecting many Rust projects. 1/72 engines flagging = false positive. Build from source with `cargo install loopguard-ctx` to verify.

## License

MIT License — see [LICENSE](LICENSE) for details.
