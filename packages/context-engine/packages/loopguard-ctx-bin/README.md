# loopguard-ctx-bin

Pre-built binary distribution of [loopguard-ctx](https://github.com/rodthenewcomer/loopguard) for LoopGuard setup flows and agent integrations.

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
curl -fsSL https://loopguard.vercel.app/install.sh | sh

# Homebrew (macOS/Linux)
brew tap rodthenewcomer/tap/loopguard-ctx && brew install rodthenewcomer/tap/loopguard-ctx

# Cargo (requires Rust)
cargo install loopguard-ctx
```

## Links

- [Documentation](https://loopguard.vercel.app/docs)
- [GitHub](https://github.com/rodthenewcomer/loopguard)
- [crates.io](https://crates.io/crates/loopguard-ctx)
