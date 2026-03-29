# LoopGuard Next Version Plan

Last updated: 2026-03-29

## Recommended next release

**Version:** `v0.1.9`

This should be a stabilization and truth-alignment release, not a feature-hype release.

It packages the work already completed locally:

- Loop metrics now stay in sync with live loop state instead of only updating on first detection
- Edit-loop tracking is more accurate and can resolve correctly
- The web dashboard now refreshes periodically for signed-in users instead of behaving like a one-load snapshot
- Codex CLI is now a first-class MCP setup target in the extension
- Docs, setup, privacy, landing page, roadmap, changelog, upgrade copy, and README are closer to what the code really does today
- Codex can now use `loopguard-ctx` globally on this machine through `~/.codex/config.toml`

## Why `v0.1.9`

`v0.1.9` is the right next version because the current changes improve correctness, compatibility, and product honesty without changing the project’s phase or scope enough to justify `v0.2.0`.

This is mainly:

- bug fixing
- onboarding improvement
- integration expansion
- documentation repair

not a new product generation.

## What should ship in `v0.1.9`

### Extension

- Live loop-state refresh in the extension dashboard and status bar
- Better edit-loop lifecycle handling
- Codex CLI listed in `LoopGuard: Configure MCP Server`
- Final-session sync path kept intact

### Web

- Dashboard polling for signed-in users
- Docs and setup pages updated to reflect real commands, real settings, real MCP config, and real sync behavior
- Landing page updated to mention Codex and avoid overclaiming
- Privacy wording corrected from `SHA-256` to anonymized error fingerprint wording

### Repo / product narrative

- README aligned with real behavior
- Changelog, roadmap, and upgrade page softened where the product story was ahead of implementation

## Release checklist for `v0.1.9`

1. Bump extension version from `0.1.8` to `0.1.9` in `apps/extension/package.json`.
2. If you want repo/package parity, update any other surfaced version references that should match the release.
3. Add a short `v0.1.9` changelog entry focused on:
   - live metrics accuracy
   - Codex MCP support
   - web dashboard refresh
   - docs and setup corrections
4. Push and deploy the web app so the updated public docs and setup flow are live.
5. Package and publish the extension as `0.1.9`.
6. Smoke test after publish:
   - VS Code install from Marketplace
   - `LoopGuard: Show Dashboard`
   - `LoopGuard: Copy Optimized Context`
   - `LoopGuard: Configure MCP Server → Codex CLI`
   - `LoopGuard: Configure MCP Server → Cursor`
   - sign-in callback flow
7. Open a fresh Codex session and verify:
   - `codex mcp list` shows `loopguard-ctx`
   - Codex can see the MCP server in `/mcp`
   - focused LoopGuard modes actually reduce context on a real file

## Immediate next steps after push

### Product / trust

- Deploy the updated website immediately after push
- Re-check the live `/docs`, `/setup`, `/upgrade`, and homepage after deployment
- Make sure the Marketplace listing copy matches the new restrained language

### Extension / integration

- Publish `0.1.9`
- Verify Codex setup from a clean machine or clean user account
- Verify MCP setup writes the correct config for:
  - Claude Code
  - Cursor
  - Windsurf
  - Codex CLI
  - VS Code / Copilot

### Quality

- Add regression tests for loop-state syncing
- Add regression tests for edit-loop resolution
- Add a simple test or script covering web dashboard polling behavior

## What should **not** be promised in `v0.1.9`

Do not market these as fully complete unless they are verified end to end:

- durable offline metrics queueing
- strong billing / subscription enforcement
- fully live web dashboard in the strict realtime sense
- universal `89–99%` reduction on every file or every workflow
- “every file read is automatically compressed” across all agents without validating their exact MCP/tool-use behavior

## Recommended target for `v0.2.0`

`v0.2.0` should be the release where the support layer catches up with the product story.

### Core priorities

- durable metrics retry / offline queueing
- billing and entitlement enforcement
- clearer free vs pro gating in product behavior
- broader MCP verification across supported tools
- test coverage and CI hardening

### Strong candidates

- marketplace-ready release automation
- better session history surfaces
- cleaner pricing and account flows
- more explicit Codex onboarding in the product itself, not just docs

## Suggested owner sequence

1. Ship `v0.1.9` with the current working tree.
2. Deploy the website.
3. Publish the extension.
4. Verify Codex and Marketplace from a clean fresh session.
5. Start a focused `v0.2.0` branch around support-layer reliability:
   - sync durability
   - billing
   - CI/tests

## Bottom line

The current tree is good enough for a `v0.1.9` release.

It is **not** yet the point where LoopGuard should pretend the support layer is fully mature.

Ship `v0.1.9` as:

**“more accurate, more honest, and now Codex-compatible.”**
