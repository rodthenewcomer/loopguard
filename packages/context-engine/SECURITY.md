# Security

`loopguard-ctx` is a local helper binary. Security issues should be reported privately.

## Report a vulnerability

- Open a private security advisory on GitHub: [https://github.com/rodthenewcomer/loopguard/security/advisories/new](https://github.com/rodthenewcomer/loopguard/security/advisories/new)
- Or email: [support@loopguard.dev](mailto:support@loopguard.dev)

Please avoid opening a public issue for undisclosed vulnerabilities.

## Verification

If you install a release binary:

1. Download it from the official GitHub releases page.
2. Verify the checksum if release checksums are provided.
3. Run `loopguard-ctx --version` after install.

Official releases:

- [https://github.com/rodthenewcomer/loopguard/releases](https://github.com/rodthenewcomer/loopguard/releases)

## Scope

The most important security property of `loopguard-ctx` is simple:

- it runs locally
- it reads local files only when asked
- it is meant to reduce what reaches an AI tool, not transmit code to LoopGuard servers

If you are evaluating the broader LoopGuard privacy model, also read:

- [https://loopguard.dev/privacy](https://loopguard.dev/privacy)
