# loopguard-ctx — MANDATORY tool routing

The loopguard-ctx MCP server is active. You MUST use its tools instead of built-in equivalents.

## Required substitutions (enforced by PreToolUse hook)

| Built-in (FORBIDDEN)  | loopguard-ctx replacement              |
|-----------------------|----------------------------------------|
| Read                  | mcp__loopguard-ctx__ctx_read           |
| Bash (file reading)   | mcp__loopguard-ctx__ctx_shell          |
| Grep                  | mcp__loopguard-ctx__ctx_search         |
| Bash (ls/find)        | mcp__loopguard-ctx__ctx_tree           |

## Tools you CAN still use directly

- Write, Edit — no loopguard replacement
- Glob — no loopguard replacement
- Agent, Task — orchestration only

## Why

ctx_read compresses file content by 80-90% before it reaches this context window.
Using Read instead wastes tokens and defeats the purpose of the tool.

---

## MANDATORY SESSION PROTOCOL

Run these at the START of every session, before reading any file or answering any question:

```
1. ctx_session load          — restore previous session (cross-chat memory)
2. ctx_overview(task)        — get task-relevant project map
```

Run this at the END of every session (or when the user asks for a summary):

```
3. ctx_wrapped("session")    — show tokens saved + dollars avoided this session
```

These are NOT optional. The UserPromptSubmit hook will remind you on every new chat.

## PROACTIVE tools — use without being asked

| Tool | When |
|---|---|
| `ctx_session load` | First message of every new chat |
| `ctx_overview(task)` | Before reading files for any new task |
| `ctx_compress` | When context window grows large |
| `ctx_metrics` | Periodically to verify savings |
| `ctx_wrapped("session")` | End of session or when user asks about savings/cost |
| `ctx_wrapped("today")` | When user asks about today's usage |
| `ctx_wrapped("week")` | When user asks about weekly usage |
