# loopguard-ctx — Token Optimization

loopguard-ctx is configured as an MCP server. Use loopguard-ctx MCP tools instead of built-in tools:

| Built-in | Use instead | Why |
|----------|-------------|-----|
| Read / cat / head | `ctx_read` | Session caching, 6 compression modes, re-reads cost ~13 tokens |
| Bash (shell commands) | `ctx_shell` | Pattern-based compression for git, npm, cargo, docker, tsc |
| Grep / rg | `ctx_search` | Compact context, token-efficient results |
| ls / find | `ctx_tree` | Compact directory maps with file counts |

For shell commands that don't have MCP equivalents, prefix with `loopguard-ctx -c`:

```bash
loopguard-ctx -c git status    # compressed output
loopguard-ctx -c cargo test    # compressed output
loopguard-ctx -c npm install   # compressed output
```

## ctx_read Modes

- `full` — cached read (use for files you will edit)
- `map` — deps + API signatures (use for context-only files)
- `signatures` — API surface only
- `diff` — changed lines only (after edits)
- `aggressive` — syntax stripped
- `entropy` — Shannon + Jaccard filtering

Write, Edit, Delete have no loopguard-ctx equivalent — use them normally.

## Session Continuity (CCP)

**At the start of every new session**, run this first:

```
ctx_session load
```

This restores context from your previous session: task in progress, files already read, key findings, and architectural decisions. Skipping this means starting cold — re-reading files you already read, losing prior reasoning.

After restoring, record your current task:

```
ctx_session task "brief description of what you are working on"
```

Record key findings as you go:

```
ctx_session finding "src/auth.rs:142 — JWT expiry not validated"
```

The session auto-saves. At the end of a long session, run:

```
ctx_session save
```
