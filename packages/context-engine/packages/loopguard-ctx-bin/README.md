# loopguard-ctx-bin

Pre-built binary distribution of [loopguard-ctx](https://github.com/yvgude/loopguard-ctx) — the Cognitive Filter for AI Engineering.

No Rust toolchain required. The correct binary for your platform is downloaded automatically during `npm install`.

## Install

```bash
npm install -g loopguard-ctx-bin
```

After installing, run the one-command setup:

```bash
loopguard-ctx setup
```

This auto-detects your shell and editors, installs shell aliases, creates MCP configs, and verifies everything.

## Supported Platforms

| Platform | Architecture |
|----------|-------------|
| Linux | x86_64, aarch64 |
| macOS | x86_64, Apple Silicon |
| Windows | x86_64 |

## Alternative Install Methods

```bash
# Universal installer (no Rust needed)
curl -fsSL https://loopguardctx.com/install.sh | sh

# Homebrew (macOS/Linux)
brew tap yvgude/loopguard-ctx && brew install loopguard-ctx

# Cargo (requires Rust)
cargo install loopguard-ctx
```

## Links

- [Documentation](https://loopguardctx.com/docs/getting-started)
- [GitHub](https://github.com/yvgude/loopguard-ctx)
- [crates.io](https://crates.io/crates/loopguard-ctx)
- [Discord](https://discord.gg/pTHkG9Hew9)
