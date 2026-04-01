> **MANDATORY — run this before anything else at the start of every session:**
> ```
> ctx_session load
> ```
> This restores your previous context: task in progress, files already read, key findings.
> **Skipping this means re-reading files you already read and losing prior reasoning.**
> After loading, acknowledge what was restored before proceeding.

# loopguard-ctx — MANDATORY Tool Routing

loopguard-ctx is active as an MCP server. Built-in Read and Grep are **blocked** — use the loopguard-ctx equivalents at all times:

| Built-in (BLOCKED) | Use instead | Why |
|--------------------|-------------|-----|
| Read / cat / head  | `ctx_read`  | Session caching — re-reads cost ~13 tokens, not the full file |
| Grep / rg          | `ctx_search`| Compact, token-efficient search results |
| Bash (shell)       | `ctx_shell` | Pattern-based compression for git, npm, cargo, docker, tsc |
| ls / find          | `ctx_tree`  | Compact directory maps with file counts |

For shell commands without MCP equivalents, prefix with `loopguard-ctx -c`:

```bash
loopguard-ctx -c git status
loopguard-ctx -c cargo test
loopguard-ctx -c npm install
```

Write, Edit, Delete have no loopguard-ctx equivalent — use them normally.

## ctx_read Modes

- `full` — cached read (use for files you will edit)
- `map` — deps + API signatures (use for context-only files)
- `signatures` — API surface only
- `diff` — changed lines only (after edits)
- `aggressive` — syntax stripped
- `entropy` — Shannon + Jaccard filtering

## Session Continuity (CCP)

Record your task after loading:

```
ctx_session task "brief description of what you are working on"
```

Record key findings as you discover them:

```
ctx_session finding "src/auth.rs:142 — JWT expiry not validated"
```

The session auto-saves continuously. Force-save before ending a long session:

```
ctx_session save
```
