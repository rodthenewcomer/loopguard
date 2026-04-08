# loopguard-ctx Rust crate

This directory contains the Rust implementation of `loopguard-ctx`, the local helper used by LoopGuard for:

- focused MCP reads
- shell output cleanup
- helper-side diagnostics
- optional session restore support

## Build

```bash
cargo build --release
```

## Check

```bash
cargo check
cargo test
```

## Binary

The release binary is:

```bash
target/release/loopguard-ctx
```

For user-facing setup and install guidance, use the parent docs:

- [../README.md](../README.md)
- [https://loopguard.vercel.app/setup](https://loopguard.vercel.app/setup)
