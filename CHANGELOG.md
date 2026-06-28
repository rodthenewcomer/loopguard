# Changelog

All notable changes to LoopGuard are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

### Added
- Privacy policy page at `/privacy`
- `CHANGELOG.md` at monorepo root
- `scripts/set-version.sh` — atomic version bump across all packages
- Root ESLint config with `no-console` enforcement
- `LoopDetector` supplementary unit tests with deterministic fake-timer coverage
- `detectLoop.extra.test.ts` — time-window boundary, `getAllLoops()`, resolve-status tests

---

## [2.8.2] — 2026-06-28

### Fixed
- Sidebar panel now shows all-time token savings fetched from API summary endpoint
- Syncing placeholder display corrected in sidebar panel

---

## [2.8.1] — 2026-06

### Fixed
- Minor stability and sync fixes

---

## [2.8.0] — 2026-06

### Added
- Codex CLI support in `loopguard-ctx setup --agent=codex`
- Refreshed Codex setup documentation in `docs/`

---

## [v0.1.16 / 2.7.x] — 2026

### Changed
- Extension version bump and internal refactors

---

## [3.0.0 — v3: Intelligence Layer] — 2026

### Added
- **Root cause hints** — `ctx_loop_hint(error_text)` / `loopguard-ctx hint "<error>"`: diagnoses error pattern, returns fix suggestion without an LLM call
- **Predictive context ranking** — `ctx_predict(task, path?)`: scores workspace files by relevance before any reads
- **Session fix memory** — `ctx_memory(action, ...)` / `loopguard-ctx memory <action>`: records and recalls which fix resolved which error pattern
- **Cost forecasting** — `ctx_forecast(task)` / `loopguard-ctx forecast "<task>"`: token cost + dollar estimate across Sonnet, Haiku, GPT-4o, Gemini Flash
- **Sidebar panel** — persistent Activity Bar view for VS Code, Cursor, Windsurf (`loopguard.sidebar` WebviewViewProvider); stays visible while navigating files
- **Silent JWT refresh** — refresh_token stored in SecretStorage; `ApiClient._tryRefresh()` renews expired tokens on 401 without user interaction; no more silent dashboard failures after 1 hour
- WCAG AA contrast fixes, JSON-LD structured data, and social proof updates to landing page
- `lib/constants.ts` — `SUPPORT_URL`, `GITHUB_URL`, `MARKETPLACE_URL` deduplicated across web app

### Fixed
- Three Windows PowerShell hook generation errors in Rust `hooks.rs`

---

## [2.0.0 — v2: CLI + Sync Pipeline] — 2026

### Added
- **`loopguard-ctx` Rust binary** — native context engine (16,000+ lines of Rust)
  - Tree-sitter language-aware parsing for 14 languages
  - Six read modes: `full`, `signatures`, `map`, `entropy`, `diff`, `aggressive`
  - Session-aware delta reuse (skip re-sending context already seen this session)
- **MCP server** — 21 tools for Claude Code, Cursor, Windsurf, Codex CLI
- **`loopguard-ctx setup --agent=X`** — one-command MCP config, CLAUDE.md rules, and shell aliases for each AI tool
- **`loopguard-ctx doctor`** — verifies every layer of the integration is working
- **Homebrew tap** — `brew install loopguard-ctx`
- **npm global package** — `npm install -g loopguard-ctx`
- **curl installer** — `curl -fsSL https://loopguard.vercel.app/install.sh | sh`
- **Anonymous device sync** — `loopguard-ctx` CLI syncs aggregate token stats at session end (opt-in, device UUID only, no code)
- **`/wrapped`** — session savings summary (`ctx_wrapped`)
- **Shell hooks** — `loopguard-ctx init` wires bash/zsh/fish to compress CLI output before it reaches AI models

---

## [1.0.0 — v1: Extension Core] — 2025

### Added
- VS Code loop detection via `vscode.languages.onDidChangeDiagnostics`
- **EditTracker** — secondary loop detection via edit-pattern analysis (4 edits, ±5 lines, 3-min window)
- Status bar item with real-time time-wasted counter
- Alert panel with "Try New Approach" / "View Details" / "Ignore" actions
- `LoopGuard: Copy Optimized Context` command — copies focused file context around the current error
- TypeScript fallback context engine (no binary required)
- `DashboardPanel` — singleton WebviewPanel with session metrics, loop list, token savings
- Auth flow via `vscode.SecretStorage` → Supabase JWT (OS keychain on all platforms)
- Best-effort API sync every 5 minutes and on deactivation
- VS Code, Cursor, Windsurf editor support
- MIT license
