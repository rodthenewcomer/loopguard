# LoopGuard tools

LoopGuard is available as a local MCP server for focused reads and smaller shell output.

## Prefer these mappings

| Instead of | Use |
|---|---|
| Read | `ctx_read` |
| Grep / rg | `ctx_search` |
| terminal commands with long output | `ctx_shell` |
| ls / find | `ctx_tree` |

For shell commands without a direct MCP equivalent, you can still use:

```bash
loopguard-ctx -c git status
loopguard-ctx -c cargo test
loopguard-ctx -c npm install
```

## Optional session restore

If you are resuming earlier work, run:

```text
ctx_session load
```
