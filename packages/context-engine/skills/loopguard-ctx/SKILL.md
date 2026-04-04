---
name: loopguard-ctx
description: Local helper for focused reads, smaller shell output, MCP setup, and optional session restore across AI coding tools.
metadata: {"openclaw":{"requires":{"bins":["loopguard-ctx"]}}}
---

# LoopGuard CTX

Use `loopguard-ctx` when the task involves noisy shell output, oversized file reads, or MCP-based agent setup.

## Session protocol (run at start of every chat)

```
ctx_session load          — restore previous session state
ctx_overview(task)        — get task-relevant project map before reading files
```

## Session summary (run at end of session or when asked about savings)

```
ctx_wrapped("session")   — tokens saved + dollars avoided this session
ctx_wrapped("today")     — today's totals
ctx_wrapped("week")      — weekly totals
```

Note: `loopguard-ctx notify` (CLI) is the terminal equivalent of `ctx_wrapped` — it is not an MCP tool and cannot be called from inside Claude.

## Reach for it when

- a command will produce too much output to be useful raw
- you need the shape of a file before you need every line
- you are wiring LoopGuard into Claude Code, Cursor, Windsurf, or Codex
- you want to resume a previous helper session with a lighter restore path

## Shell output

Prefer:

```bash
loopguard-ctx -c git status
loopguard-ctx -c git diff
loopguard-ctx -c cargo test
loopguard-ctx -c npm install
```

## Focused reads

Prefer:

```bash
loopguard-ctx read <file>
loopguard-ctx read <file> -m map
loopguard-ctx read <file> -m signatures
loopguard-ctx read <file> -m diff
```

Use:

- `map` for fast understanding
- `signatures` for API surface
- `full` when you are about to edit
- `diff` after changes

## Setup commands

```bash
loopguard-ctx setup --agent=claude
loopguard-ctx setup --agent=cursor
loopguard-ctx setup --agent=windsurf
loopguard-ctx setup --agent=codex
loopguard-ctx doctor
```

## Session state commands

```bash
ctx_session load
ctx_session task "brief task summary"
ctx_session finding "file:line — key finding"
ctx_session save
```
