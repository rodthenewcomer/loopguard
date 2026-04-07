# pi-loopguard-ctx

[Pi Coding Agent](https://github.com/badlogic/pi-mono) extension that routes all tool output through [loopguard-ctx](https://loopguard.dev) for **60-90% token savings**.

## What it does

Overrides Pi's built-in tools to route them through `loopguard-ctx`:

| Tool | Compression |
|------|------------|
| `bash` | All shell commands compressed via loopguard-ctx's 90+ patterns |
| `read` | Smart mode selection (full/map/signatures) based on file type and size |
| `grep` | Results grouped and compressed via ripgrep + loopguard-ctx |
| `find` | File listings compressed and .gitignore-aware |
| `ls` | Directory output compressed |

## Install

```bash
# 1. Install loopguard-ctx (if not already installed)
cargo install loopguard-ctx
# or: brew tap rodthenewcomer/tap/loopguard-ctx && brew install rodthenewcomer/tap/loopguard-ctx

# 2. Install the Pi package
pi install npm:pi-loopguard-ctx
```

## Binary Resolution

The extension locates the `loopguard-ctx` binary in this order:

1. `LOOPGUARD_CTX_BIN` environment variable
2. `~/.cargo/bin/loopguard-ctx`
3. `~/.local/bin/loopguard-ctx` (Linux) or `%APPDATA%\Local\loopguard-ctx\loopguard-ctx.exe` (Windows)
4. `/usr/local/bin/loopguard-ctx` (macOS/Linux)
5. `loopguard-ctx` on PATH

## Smart Read Modes

The `read` tool automatically selects the optimal loopguard-ctx mode:

| File Type | Size | Mode |
|-----------|------|------|
| `.md`, `.json`, `.toml`, `.yaml`, etc. | Any | `full` |
| Code files (55+ extensions) | < 24 KB | `full` |
| Code files | 24–160 KB | `map` (deps + API signatures) |
| Code files | > 160 KB | `signatures` (AST extraction) |
| Other files | < 48 KB | `full` |
| Other files | > 48 KB | `map` |

Code extensions include: `.rs`, `.ts`, `.tsx`, `.js`, `.jsx`, `.py`, `.go`, `.java`, `.c`, `.cpp`, `.cs`, `.rb`, `.php`, `.swift`, `.kt`, `.vue`, `.svelte`, `.astro`, `.html`, `.css`, `.scss`, `.lua`, `.zig`, `.dart`, `.scala`, `.sql`, `.graphql`, `.proto`, `.tf`, `.sh`, `.bash`, `.zsh`, `.fish`, `.ps1`, and more.

**Partial reads** (with `offset`/`limit`) are also routed through loopguard-ctx using `lines:N-M` mode for compression.

## Slash Command

Use `/loopguard-ctx` in Pi to check which binary is being used.

## Links

- [loopguard-ctx](https://loopguard.dev) — Local context tools for LoopGuard
- [GitHub](https://github.com/rodthenewcomer/loopguard)
