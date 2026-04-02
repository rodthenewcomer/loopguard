# loopguard-ctx

`loopguard-ctx` is the local helper behind LoopGuard.

It does three practical jobs:

1. It gives agents a smaller, more focused way to read code through MCP tools such as `ctx_read`, `ctx_search`, `ctx_tree`, and `ctx_shell`.
2. It trims noisy terminal output before you paste it into an AI chat or route it through an agent.
3. It can restore lightweight session notes when you want continuity across longer agent workflows.

This is a local binary, not a hosted service. It does not send your code to LoopGuard servers.

## What It Is For

- Claude Code, Codex CLI, Cursor, Windsurf, and other MCP-friendly tools
- Smaller shell output for commands like `git status`, `npm install`, `cargo test`, and `docker build`
- Focused reads that keep the next AI turn narrower than a full-file paste

## Install

The safest public install path today is the installer script:

```bash
curl -fsSL https://loopguard.vercel.app/install.sh | sh
loopguard-ctx --version
```

If you prefer to build from source:

```bash
cd packages/context-engine/rust
cargo build --release
./target/release/loopguard-ctx --version
```

## Quick Start

### 1. Shell helper

```bash
loopguard-ctx init
```

Restart your shell and then try a noisy command:

```bash
loopguard-ctx -c git status
```

### 2. Agent setup

Configure the helper for a specific tool:

```bash
loopguard-ctx setup --agent=claude
loopguard-ctx setup --agent=cursor
loopguard-ctx setup --agent=windsurf
loopguard-ctx setup --agent=codex
```

Run agent-specific setup from a project root when you want project-local guidance files such as:

- `.cursor/rules/loopguard-ctx.mdc`
- `.windsurfrules`

### 3. Verify

```bash
loopguard-ctx doctor
```

## Core Commands

### Shell output

```bash
loopguard-ctx -c git diff
loopguard-ctx -c cargo test
loopguard-ctx -c npm install
```

### Focused reads

```bash
loopguard-ctx read src/app.ts
loopguard-ctx read src/app.ts -m map
loopguard-ctx read src/app.ts -m signatures
loopguard-ctx read src/app.ts -m diff
```

### MCP server

```bash
loopguard-ctx
```

When run without a subcommand, `loopguard-ctx` starts the MCP server over stdio.

## Session Restore

If you want lightweight continuity across longer agent sessions, use:

```bash
ctx_session load
ctx_session task "what you are working on"
ctx_session finding "file:line — what you learned"
ctx_session save
```

This is optional. LoopGuard still works without session restore.

## Public Positioning

- `loopguard-ctx` is not a general “AI research engine.”
- It is the local helper that makes LoopGuard’s focused reads, shell cleanup, and agent integrations work.
- The value is not abstract compression. The value is smaller prompts, less noise, and less wasted model spend.

## Related Docs

- Product docs: [https://loopguard.vercel.app/docs](https://loopguard.vercel.app/docs)
- Setup guide: [https://loopguard.vercel.app/setup](https://loopguard.vercel.app/setup)
- Repo: [https://github.com/rodthenewcomer/loopguard](https://github.com/rodthenewcomer/loopguard)

## Development

```bash
cd packages/context-engine/rust
cargo check
cargo test
```
