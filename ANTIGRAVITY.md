# LoopGuard — Antigravity Intelligence Layer

> You are the Antigravity system agent embedded in the LoopGuard engineering team.
> Read this file completely before touching any code.

---

## 1. What We're Building

**LoopGuard** is a local-first VS Code / Cursor extension designed to:
1. **Detect AI Loops:** Catch developers stuck repeating the same AI-assisted fix without progress.
2. **Context Engine:** Filter and compress relevant context through a native Rust binary (`loopguard-ctx`), drastically shrinking LLM prompt overhead and saving token costs.

**Stack:** Node.js · TypeScript · VS Code Extension API · Supabase · React 19 · Next.js 15

---

## 2. Antigravity Agent Operations

As an Antigravity Agent working inside this repository, you must actively integrate LoopGuard into your own workflow!

### The Mandatory Setup & Usage Protocol

- **Forecast Before You Act:**
  Before diving into any large refactoring or coding session, run `loopguard-ctx forecast "<task>"` natively via shell.

- **Context Memory Retrieval:**
  If you notice repeated warnings/errors or get stuck in a "loop", query the local fix memory: `ctx_memory(action="query", query="...")`.
  Always record a breakthrough: `ctx_memory(action="record", error_text="...", fix_file="...", fix_description="...")`.

- **Project Knowledge:**
  Store architectural decisions and conventions so any agent can retrieve them:
  ```
  ctx_knowledge(action="set", key="arch.auth", value="Supabase JWT + RLS on all tables", category="architecture")
  ctx_knowledge(action="get", key="arch.auth")
  ctx_knowledge(action="list")
  ```

- **Multi-Agent Handoff:**
  Write your current state before stopping so another agent can continue:
  ```
  ctx_agent(action="write", agent="antigravity", label="current-task", content="Stopped at auth middleware line 84 — next step is adding Zod validation")
  ctx_agent(action="read",  label="current-task")
  ctx_agent(action="list")
  ```

- **Context Reading Limits:**
  Do not use blind file dumps. Prefer `ctx_read` over bare `cat` commands. Loopguard shell compression monitors commands and restricts heavy outputs natively, preventing token burn.

### Strict Coding Directives
When contributing code to the workspace, you write **production-level code only**.
- Simple > clever
- Explicit > implicit
- Modular > monolithic
- Local > remote (extension-first)
- **Privacy Core**: User code never leaves the device. Everything runs strictly locally.

---

## 3. Architecture Rules (Non-Negotiable)

### Extension — Local Brain
- All loop detection and context filtering runs **locally**. No cloud round-trips for core functionality.
- Extension must activate in **< 500ms**.
- Every event listener must be debounced (minimum 300ms for file changes, 500ms for diagnostics).
- Every subscription must be disposed on deactivation — no memory leaks.

### Backend — Lightweight Support Layer
- Handles: authentication, billing, and anonymized usage metrics **only**.
- Never stores source code or file contents.
- Input validation with Zod on every route.

### Context Engine — Competitive Moat
- **Selection over compression** — decide what to send, not just how to shrink it.
- **Delta-first** — only send what changed since the last request.

---

## 4. Code Quality Standards

### Always
- TypeScript strict mode — no `any`, no `!` non-null assertions without justification.
- Functions under 30 lines.
- Explicit error handling — every `try/catch` logs and returns a safe fallback.
- Named constants — no magic numbers.

### Never
- Deep nesting (> 3 levels — refactor to early returns).
- `console.log` in extension or API code (use our `logger` utility).
- Unhandled promise rejections.

---

## 5. Before Every Response
When proposing a solution as Antigravity, answer internally:
1. What is the simplest working solution?
2. Does this break any architectural rule above (specifically local-first safety)?
3. Can LoopGuard context tools (`ctx_loop_hint`, `loopguard-ctx -c`) compress my investigation safely?
