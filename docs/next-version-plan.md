# LoopGuard Next Version Plan

Last updated: 2026-04-04

## Current state

v3 (Intelligence Layer) is live. The following work shipped since the last plan update:

- **Sidebar panel** — persistent Activity Bar panel for VS Code, Cursor, Windsurf (`SidebarPanel` WebviewViewProvider, registered to `loopguard.sidebar`)
- **JWT silent refresh** — refresh_token stored in SecretStorage; `ApiClient._tryRefresh()` silently renews expired tokens; no more silent 401s causing zero dashboard metrics
- **Web landing page** — comprehensive audit pass across all org roles; metadata/SEO, JSON-LD, WCAG AA contrast fixes, social proof, GitHub stars component, three developer testimonials, CTA clarity ("Opens VS Code Marketplace · 1-click install"), roadmap v4 teaser
- **lib/constants.ts** — SUPPORT_URL, GITHUB_URL, MARKETPLACE_URL deduped across web app
- **Rust format string fixes** — three Windows PowerShell hook generation errors fixed in `hooks.rs`

## Next release: v0.2.0

v0.2.0 is the support-layer reliability release. It should make the pipeline behind the product as solid as the product itself.

### Core priorities for v0.2.0

- **Durable metrics retry / offline queueing** — if the backend is unavailable during a session, metrics should be queued and replayed on next online event rather than silently dropped
- **Billing and entitlement enforcement** — Stripe integration where applicable; clear "free vs supporter" distinction in the UI
- **CI hardening** — regression tests for loop-state sync, edit-loop resolution, web dashboard polling
- **Broader MCP verification** — verified end-to-end setup across Claude Code, Cursor, Windsurf, Codex CLI from a clean machine

### Strong candidates for v0.2.0

- Better session history surface on the web dashboard
- Cleaner support and account flows in the extension
- More explicit Codex onboarding in the product itself
- Marketplace listing copy refresh to reflect v3 + sidebar panel

## Target for v4 (no version number yet)

v4 is the multi-session intelligence release:

- Cross-session pattern memory — LoopGuard remembers which errors you hit in past sessions and surfaces them when you hit them again
- Proactive loop prediction — predicts you're about to loop before the third repeat, based on session history
- Smarter context recall — knows which files were relevant in past sessions for similar errors

## Bottom line

Ship v0.2.0 as: **"the pipeline catches up with the product."**

v4 follows once the support layer is solid.
