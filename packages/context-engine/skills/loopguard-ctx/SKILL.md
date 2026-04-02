---
name: loopguard-ctx
description: Local helper for focused reads, smaller shell output, MCP setup, and optional session restore across AI coding tools.
metadata: {"openclaw":{"requires":{"bins":["loopguard-ctx"]}}}
---

# LoopGuard CTX

Use `loopguard-ctx` when the task involves noisy shell output, oversized file reads, or MCP-based agent setup.

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

Run Cursor and Windsurf setup from the project root if you want project-local guidance files too.

## Optional session restore

```bash
ctx_session load
ctx_session task "brief task summary"
ctx_session finding "file:line — key finding"
ctx_session save
```

Use session restore when it helps. It is optional, not a requirement for every task.
