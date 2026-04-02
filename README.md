# LoopGuard

LoopGuard is a local-first AI coding guardrail built to save time and reduce API waste.

It does two jobs:

1. It catches repeat-fix loops in VS Code-based editors before another twenty minutes disappear.
2. It keeps the next AI turn smaller so you send fewer useless tokens and spend less money on noisy prompts.

LoopGuard is built for people using VS Code, Cursor, Windsurf, Codex CLI, Claude Code, GitHub Copilot, and other MCP-friendly workflows who want fewer wasted retries, smaller prompts, and lower AI bills.

## What It Actually Does

- Watches editor diagnostics and repeated edit patterns to detect when a session is looping.
- Shows time wasted in the status bar and the in-editor dashboard.
- Copies focused context for the current problem instead of pasting entire files into chat.
- Exposes a local helper (`loopguard-ctx`) for MCP tools and shell workflows.
- Keeps source code on the device. Sign-in is optional and only used for syncing anonymized session metrics to the web dashboard.

## Honest Positioning

- LoopGuard is designed to cut focused prompt size by 70%+ in normal use, especially when the native helper is active.
- The `93%` figure used in product copy is a measured high-end example, not a universal promise.
- Exact savings vary by file, workflow, and read mode.
- The product value is not “fancy compression.” It is saving time, trimming tokens, and making AI coding sessions cheaper to run.

## Outcome First

- Save time by cutting off repeat-fix loops before they quietly consume the next half hour.
- Save tokens by sending focused context instead of whole files and noisy terminal output.
- Save money by reducing how much irrelevant code reaches paid AI models over a week or month of heavy use.

## Product Surfaces

### 1. VS Code Extension

This is the main product surface.

- Loop detection
- Status bar metrics
- In-editor dashboard
- Focused context copy
- Sign-in for optional web sync

Install:

```bash
ext install LoopGuard.loopguard
```

### 2. Local Helper (`loopguard-ctx`)

The native helper powers deeper focused reads, MCP setup, and shell output cleanup.

Typical uses:

- Codex CLI MCP setup
- Claude Code MCP setup
- Cursor or Windsurf MCP setup
- Shell hooks for cleaner terminal output before it reaches an AI tool

Optional install:

```bash
brew install rodthenewcomer/tap/loopguard-ctx
```

Or use the installer script:

```bash
curl -fsSL https://loopguard.vercel.app/install.sh | sh
```

### 3. Web Dashboard

If you sign in, LoopGuard can sync anonymized session metrics so you can review time saved, tokens saved, and session trends in the browser.

Core protection still works without an account.

## Quick Start

### Editor path

1. Install the extension.
2. Open any workspace.
3. Let LoopGuard start tracking diagnostics and edit loops automatically.
4. Use `LoopGuard: Copy Optimized Context` when you want a smaller prompt.

### Agent path

1. Install `loopguard-ctx`.
2. Run `LoopGuard: Configure MCP Server` from the extension, or use the helper directly.
3. Restart the target tool so it reloads the MCP config.

## Supported Workflows

- VS Code
- Cursor
- Windsurf
- Codex CLI
- Claude Code
- GitHub Copilot / VS Code MCP
- bash, zsh, and fish shell helper flows

## Privacy

LoopGuard’s core promise is simple:

**Your code never leaves your machine.**

Loop detection and focused context selection run locally. If you sign in, the backend stores anonymized metrics such as loop counts, session timing, and token-saved estimates. It does not store source code or file contents.

See the full policy at [loopguard.vercel.app/privacy](https://loopguard.vercel.app/privacy).

## Repository Layout

```text
apps/
  extension/   VS Code extension
  web/         marketing site + web dashboard
  api/         auth, sync, and support APIs

packages/
  core/        loop detection + selection logic
  context-engine/
               local helper tooling and binary integration
  types/       shared types
  utils/       shared utilities
```

## Development

From the repo root:

```bash
npm install
npm run build
npm run type-check
```

Useful package targets:

```bash
cd apps/web && npm run dev
cd apps/extension && npm run build
cd packages/context-engine/rust && cargo check
```

## Docs

- Product docs: [loopguard.vercel.app/docs](https://loopguard.vercel.app/docs)
- Setup guide: [loopguard.vercel.app/setup](https://loopguard.vercel.app/setup)
- Support: [loopguard.vercel.app/support](https://loopguard.vercel.app/support)

## Support The Project

LoopGuard keeps the core product free.

- Support it: [buymeacoffee.com/rodthenewcomer](https://buymeacoffee.com/rodthenewcomer)
- Report bugs: [github.com/rodthenewcomer/loopguard/issues](https://github.com/rodthenewcomer/loopguard/issues)

## License

This repository is currently released under the MIT License. See [LICENSE](LICENSE).
