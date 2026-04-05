# LoopGuard — Claude Code Intelligence Layer

> You are embedded in the LoopGuard engineering team.
> Read this file completely before touching any code.

---

## What We're Building

**LoopGuard** is a VS Code / Cursor IDE extension that does two things:

1. **Loop Detection** — Detects when a developer is stuck repeating the same AI-assisted fix with no progress. Shows time wasted. Breaks the loop.
2. **Context Engine** — Filters and selects only the relevant code context before AI calls. In normal use it keeps prompts dramatically smaller by sending focused context instead of whole files.

**Stack:** TypeScript · VS Code Extension API · Node.js · Supabase · Stripe · Next.js · Turborepo
**Support model:** Free core + optional direct support
**Privacy law:** User code never leaves the device. Backend stores only metrics.

---

## Prime Directive

You write **production-level code only**.

- Simple > clever
- Explicit > implicit
- Modular > monolithic
- Local > remote (extension-first)
- Never guess behavior — state uncertainty and ask

If a solution is complex, fragile, or hard to understand → reject it and find the simpler path.

---

## Architecture Rules (Non-Negotiable)

### Extension — Local Brain
- All loop detection and context filtering runs **locally**. No cloud round-trips for core functionality.
- Extension must activate in **< 500ms**
- Every event listener must be **debounced** (minimum 300ms for file changes, 500ms for diagnostics)
- Every subscription must be **disposed** on deactivation — no memory leaks
- No `console.log` in production — use the `logger` utility

### Backend — Lightweight Support Layer
- Handles: authentication, billing, and anonymized usage metrics **only**
- Never stores source code or file contents
- All endpoints require authentication (Supabase JWT)
- Input validation with Zod on every route

### Context Engine — Competitive Moat
- **Selection over compression** — decide what to send, not just how to shrink it
- **Delta-first** — only send what changed since the last request
- **Memory cache** — never resend context already processed this session
- Token savings must be measurable and reported to the user

### Privacy Guarantee
- User source code never leaves the device
- Market this explicitly: *"Your code never leaves your machine"*

---

## Code Quality Standards

### Always
- TypeScript strict mode — no `any`, no `!` non-null assertions without justification
- Functions under 30 lines
- Explicit error handling — every `try/catch` logs and returns a safe fallback
- Named constants — no magic numbers
- Single responsibility per module

### Never
- Deep nesting (> 3 levels — refactor to early returns)
- Duplicated logic
- `console.log` in extension or API code
- Mutations of input parameters
- Unhandled promise rejections

---

## File Structure

```
loopguard/
├── apps/
│   ├── extension/          # VS Code / Cursor extension (core product)
│   ├── web/                # Next.js landing page + user dashboard
│   └── api/                # Express API — auth, billing, analytics
├── packages/
│   ├── core/               # Loop detection + context engine (framework-agnostic)
│   ├── types/              # Shared TypeScript interfaces
│   ├── ui/                 # Shared React component library
│   └── utils/              # Shared utilities (hash, similarity, debounce, etc.)
├── docs/                   # Architecture, design system, ADRs
├── CLAUDE.md               # This file — AI intelligence layer
├── RULES.md                # Development rules
└── .ai-context             # Session context for Cursor / Copilot
```

---

## Current Phase: MVP

**In scope:**
- Loop detection via VS Code diagnostics API
- Session time tracking
- Status bar + notification alerts
- Basic context snapshot (relevant lines around error)

**Out of scope for MVP:**
- Prompt history tracking
- Smart suggestions (AI-powered)
- Web dashboard
- Team features
- Multi-model routing

**Validation target:** 100 installs → 5 paying users → then expand

---

## Before Every Response

1. Which role(s) apply to this task?
2. What is the simplest working solution?
3. What edge cases exist?
4. Does this break any architectural rule above?
5. Will this still work when the user has 10,000 sessions in state?
