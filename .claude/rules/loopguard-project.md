---
paths:
  - "**/*"
---
# LoopGuard Project Rules

> Auto-loaded on every session in this project.
> Activates and extends all relevant ECC rules for the LoopGuard stack.

## Stack

- **Extension:** TypeScript · VS Code Extension API · esbuild
- **Web:** Next.js 15 · React 19 · Tailwind v4 · Supabase
- **API:** Express · Zod · Supabase service role
- **Core:** TypeScript · vitest
- **Context Engine:** Rust (loopguard-ctx binary) + TypeScript fallback
- **Infra:** Vercel (web) · Railway (API) · Supabase (DB) · GitHub Actions (CI/CD)
- **Monorepo:** Turborepo · npm workspaces

## Active ECC Rule Sets (always apply)

### Common (all files)
- `~/.claude/rules/common/coding-style.md` — immutability, naming, no mutations
- `~/.claude/rules/common/git-workflow.md` — branch hygiene, commit messages
- `~/.claude/rules/common/testing.md` — test structure, coverage expectations
- `~/.claude/rules/common/performance.md` — performance budgets, profiling
- `~/.claude/rules/common/patterns.md` — architecture patterns
- `~/.claude/rules/common/security.md` — OWASP, secrets, injection
- `~/.claude/rules/common/agents.md` — agent orchestration patterns

### TypeScript (*.ts, *.tsx)
- `~/.claude/rules/typescript/coding-style.md`
- `~/.claude/rules/typescript/patterns.md`
- `~/.claude/rules/typescript/security.md`
- `~/.claude/rules/typescript/testing.md`

### Rust (*.rs)
- `~/.claude/rules/rust/coding-style.md`
- `~/.claude/rules/rust/patterns.md`
- `~/.claude/rules/rust/security.md`
- `~/.claude/rules/rust/testing.md`

## LoopGuard-Specific Constraints (NON-NEGOTIABLE)

### Privacy
- User source code NEVER leaves the device — no exceptions
- Backend stores only: loop counts, session durations, token savings, error hashes (SHA-256 only)
- Any new backend endpoint must be reviewed against this constraint before merging

### Extension Performance
- Activation time < 500ms
- Loop check < 5ms
- All event listeners debounced: file changes ≥ 300ms, diagnostics ≥ 500ms
- Every `vscode.Disposable` must be pushed to `context.subscriptions`
- No `console.log` — use the `logger` utility

### TypeScript Strict
- `strict: true` in all tsconfigs — no `any`, no `!` without justification
- Functions ≤ 30 lines
- No unhandled promise rejections
- Zod validation on all API route inputs

### Rust
- `cargo clippy -- -D warnings` must pass clean (CI enforces this)
- No unsafe blocks without explicit justification comment
- All test modules go BEFORE the `#[cfg(test)] mod tests {}` block (clippy: items_after_test_module)
- Use `.div_ceil()` not manual ceiling division

### Database / Supabase
- Every new table needs RLS policies
- Never store source code or file paths in the database
- Auth codes expire in 5 minutes, cleaned hourly via cron

### API
- All routes require Supabase JWT authentication
- Zod schema on every request body
- Consistent error shape: `{ error: string, code: string }`

## Relevant Commands Available

Use these slash commands during development:

| Command | When to use |
|---|---|
| `/code-review` | Before any PR or major change |
| `/rust-review` | After touching any Rust files |
| `/rust-test` | After Rust changes to verify clippy + tests |
| `/tdd` | When writing new features (test first) |
| `/e2e` | When adding new user-facing flows |
| `/security-scan` | Before any auth/billing changes |
| `/checkpoint` | Save progress mid-session |
| `/verify` | End-of-task verification pass |
| `/refactor-clean` | After features land, clean up cruft |
| `/quality-gate` | Before pushing to main |
| `/docs` | After new features ship |
| `/plan` | Before starting any non-trivial task |

## Workspace Layout (memorized)

```
apps/extension/          VS Code extension (core product)
apps/web/                Next.js 15 dashboard + landing page
apps/api/                Express API — auth, billing, analytics
packages/core/           Loop detection algorithm (vitest)
packages/context-engine/ TypeScript wrapper + Rust binary
packages/types/          Shared TypeScript interfaces
packages/utils/          Shared utilities
supabase/migrations/     Database schema + RLS + pg_cron
.github/workflows/       ci.yml · release.yml · keepalive.yml
```

## On Every Session Start

1. Check `git status` if there are pending changes
2. Apply all rule sets above automatically
3. Use the role system from CLAUDE.md (Senior VS Code Engineer, Backend Engineer, etc.) based on the task
4. Run `/quality-gate` before any push to main
