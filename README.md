<div align="center">

```
██╗      ██████╗  ██████╗ ██████╗  ██████╗ ██╗   ██╗ █████╗ ██████╗ ██████╗
██║     ██╔═══██╗██╔═══██╗██╔══██╗██╔════╝ ██║   ██║██╔══██╗██╔══██╗██╔══██╗
██║     ██║   ██║██║   ██║██████╔╝██║  ███╗██║   ██║███████║██████╔╝██║  ██║
██║     ██║   ██║██║   ██║██╔═══╝ ██║   ██║██║   ██║██╔══██║██╔══██╗██║  ██║
███████╗╚██████╔╝╚██████╔╝██║     ╚██████╔╝╚██████╔╝██║  ██║██║  ██║██████╔╝
╚══════╝ ╚═════╝  ╚═════╝ ╚═╝      ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝
```

**Catch repeat-debugging loops. Trim context before it hits AI. Code with less noise.**

[![Version](https://img.shields.io/badge/version-0.1.0-2563EB?style=flat-square)](https://github.com/rodthenewcomer/loopguard)
[![VS Code](https://img.shields.io/badge/VS%20Code-%5E1.90-22D3EE?style=flat-square&logo=visualstudiocode)](https://marketplace.visualstudio.com/items?itemName=LoopGuard.loopguard)
[![Rust Engine](https://img.shields.io/badge/Rust%20engine-89--99%25%20compression-F59E0B?style=flat-square&logo=rust)](packages/context-engine)
[![License](https://img.shields.io/badge/license-MIT-9CA3AF?style=flat-square)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-2563EB?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Turborepo](https://img.shields.io/badge/monorepo-turborepo-F59E0B?style=flat-square)](https://turbo.build/)

</div>

---

<div align="center">

### LoopGuard is a local-first developer tool for VS Code users working with AI assistants.
### **1)** It detects repeated debugging loops from diagnostics and edit patterns.
### **2)** It copies a smaller, focused context snapshot for your next AI prompt.

</div>

---

## Two Problems. One Tool.

<table>
<tr>
<td width="50%">

### Loop Detection
Watches VS Code diagnostics and your edit patterns in real time. When the same error repeats — or you're editing the same region in circles — LoopGuard fires an alert before you waste another hour.

**What you see:**
```
⚠️  LoopGuard: You're stuck in a loop
Same error repeated 4 times · 38 minutes wasted
[ Try New Approach ]  [ View Details ]  [ Ignore ]
```

</td>
<td width="50%">

### Context Engine
Instead of pasting an entire file into AI chat, LoopGuard extracts a narrower context window around the problem and leaves the rest behind. When the optional Rust helper is available, it can apply deeper compression strategies than the built-in TypeScript fallback.

**One measured example from the Rust helper:**
```
Without LoopGuard:  12,400 tokens → AI
With LoopGuard (Rust):  840 tokens → AI

Example reduction: 93%   Cost saved: ~$0.34/session
```

Actual reduction depends on the file, language, mode, and whether the Rust helper is installed.

</td>
</tr>
</table>

---

## Why This Exists

Every day, developers using Cursor, Copilot, Codex, and Claude Code hit the same wall:

```
You:    "Fix this null pointer error"
AI:     [wrong fix]
You:    "That didn't work, try again"
AI:     [slightly different wrong fix]
You:    "Still broken"
AI:     [same fix with different variable names]
...45 minutes later...
```

This isn't an AI problem. It's a **context problem**.

- The AI doesn't know you've tried this approach 4 times
- The AI is receiving noise — 90% irrelevant code — and making poor decisions
- You have no visibility into how much time and money you're wasting

LoopGuard puts you back in control.

---

## Delivery Modes

LoopGuard ships as three related surfaces around the same local context tooling:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            loopguard-ctx (Rust binary)                      │
│  AST signatures · Shannon entropy · Myers delta · 90+ CLI patterns          │
│  14 languages · MCP server · Shell hooks · Cross-session memory             │
└──────────────────────┬────────────────────┬────────────────────────────────┘
                       │                    │                    │
          ┌────────────▼──────┐  ┌──────────▼────────┐  ┌──────▼──────────────┐
          │  VS Code Extension │  │    MCP Server      │  │   Shell Hooks / CLI  │
          │  Loop detection   │  │  21 tools for      │  │  Compress npm/git/   │
          │  Status bar       │  │  Cursor · Claude   │  │  docker output       │
          │  Clipboard copy   │  │  Windsurf · Codex  │  │  before it hits AI   │
          └───────────────────┘  └────────────────────┘  └─────────────────────┘
```

### Extension (Zero Config)
Install → works immediately for diagnostics-based loop detection and local clipboard context copy.

### MCP Server (Power Mode)
Run `LoopGuard: Configure MCP Server` from the Command Palette. Supports Claude Code, Cursor, Windsurf, Codex CLI, Zed, and VS Code / Copilot with the local `loopguard-ctx` MCP server.

### Shell Hooks (Deep Mode)
Run `LoopGuard: Install Shell Hooks` from the Command Palette. Supported CLI output can be compressed before it reaches an AI context window.

---

## Quick Start

### Install from VS Code Marketplace

```
ext install LoopGuard.loopguard
```

Or search **"LoopGuard"** in the Extensions panel (`Ctrl+Shift+X`).

### That's it.

LoopGuard activates automatically on workspace open. No configuration required. Watch the status bar.

**Optional: enable the Rust helper for deeper compression modes**

```bash
# Install the loopguard-ctx binary (requires Rust)
cargo install loopguard-ctx

# Or use the bundled binary shipped with the extension (no Rust needed)
# — LoopGuard detects it automatically
```

---

## Status Bar

| State | Display |
|-------|---------|
| No loops detected | `$(check) LoopGuard` |
| Active loop | `$(warning) 2 loops · 38min` |
| Detection paused | `$(circle-slash) LoopGuard` |

Click it anytime to see your full session summary.

---

## Commands

| Command | Description |
|---------|-------------|
| `LoopGuard: Show Dashboard` | Session summary — loops, time wasted, tokens saved |
| `LoopGuard: Reset Session` | Clear current session and start fresh |
| `LoopGuard: Toggle Detection` | Pause or resume loop detection |
| `LoopGuard: Copy Optimized Context` | Copy a smaller local context snapshot to the clipboard |
| `LoopGuard: Configure MCP Server` | Wire Claude Code / Cursor / Windsurf / Codex CLI / VS Code / Copilot to use LoopGuard as MCP server |
| `LoopGuard: Install Shell Hooks` | Compress CLI output before it reaches AI context window |

Access via Command Palette (`Ctrl+Shift+P`) or the status bar.

---

## Context Engine — Two Tiers

| Tier | Engine | Typical behavior | When used |
|------|--------|-----------|-----------|
| **Tier 1** | Rust binary (`loopguard-ctx`) | Can achieve very large reductions on some files and CLI workloads | Binary found in extension bundle or system PATH |
| **Tier 2** | TypeScript fallback | Narrow line-window selection around the current error | Binary not available — automatic fallback |

The switch is automatic. You never configure it.

**Rust engine capabilities:**
- AST-level function/class signature extraction (14 languages)
- Shannon entropy filtering — keeps high-information-density lines
- Myers diff delta — re-reads cost ~13 tokens instead of full file
- 90+ CLI-specific output compression patterns
- Cross-session memory (CCP) — prevents re-sending unchanged context

**Important:** the extension's dashboard and toast messages use local token estimates for quick feedback. The Rust CLI/MCP tooling has more exact token accounting than the extension fallback path.

---

## Configuration

```json
{
  "loopguard.sensitivity": "medium",
  "loopguard.enableContextEngine": true,
  "loopguard.enableNotifications": true,
  "loopguard.loopThreshold": 3
}
```

| Setting | Values | Default | Description |
|---------|--------|---------|-------------|
| `sensitivity` | `low` · `medium` · `high` | `medium` | Loop threshold: 5 / 3 / 2 occurrences |
| `enableContextEngine` | `boolean` | `true` | Enable Rust/TS context compression |
| `enableNotifications` | `boolean` | `true` | Show alert popups when loops are detected |
| `loopThreshold` | `number` | `3` | Custom occurrence count (overrides sensitivity) |

---

## Privacy

> **Your code never leaves your machine.**

LoopGuard processes everything locally. The backend receives only:
- Session duration
- Loop count (number only)
- File type (e.g., `.ts`, `.py`) — never the path
- Error hash (anonymized fingerprint — never the message)
- Subscription status

No source code. No file contents. No error messages. No file paths.

---

## Pricing

| | Free | Pro |
|-|------|-----|
| Loop detection | ✅ Unlimited | ✅ Unlimited |
| Session time tracking | ✅ | ✅ |
| Notifications | ✅ | ✅ |
| Context Engine (TS fallback) | ✅ | ✅ |
| Optional Rust helper | ✅ local setup | ✅ |
| MCP Server integration | Manual setup | ✅ |
| Shell hooks | Manual setup | ✅ |
| Expanded history and reporting | ❌ | ✅ |
| Premium usage surfaces | ❌ | ✅ |
| Smart suggestions | ❌ | ✅ Coming soon |
| | Free forever | **$9/month** |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         VS Code / Cursor IDE                             │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                      LoopGuard Extension                          │  │
│  │                                                                   │  │
│  │  ┌─────────────────┐   ┌──────────────────────────────────────┐  │  │
│  │  │ DiagnosticListen│   │           Loop Engine                │  │  │
│  │  │ EditTracker     │──▶│  LoopDetector  ·  SessionTracker     │  │  │
│  │  └─────────────────┘   └──────────────────────────────────────┘  │  │
│  │                                                                   │  │
│  │  ┌─────────────────┐   ┌──────────────────────────────────────┐  │  │
│  │  │  FileListener   │   │          Context Engine              │  │  │
│  │  │                 │──▶│  Tier 1: loopguard-ctx (Rust binary) │  │  │
│  │  └─────────────────┘   │  Tier 2: TS selectRelevantLines      │  │  │
│  │                        │  DeltaProcessor · LRU cache          │  │  │
│  │                        └──────────────────────────────────────┘  │  │
│  │                                                                   │  │
│  │  ┌─────────────────┐   ┌──────────────────────────────────────┐  │  │
│  │  │   Status Bar    │   │    Alert Panel · Notifications       │  │  │
│  │  │   Dashboard     │   │    MCP Setup · Shell Hook Setup      │  │  │
│  │  └─────────────────┘   └──────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                 │                          │
   (auth / billing / metrics only)     (spawned subprocess)
                 │                          │
   ┌─────────────▼──────────┐  ┌────────────▼────────────────────────┐
   │      Backend API       │  │     loopguard-ctx (Rust binary)     │
   │  Supabase · Stripe     │  │  AST · entropy · delta · MCP · CLI  │
   └────────────────────────┘  └─────────────────────────────────────┘
```

**Key principle:** All intelligence runs locally. The backend is a support layer, not the product.

---

## Monorepo Structure

```
loopguard/
├── apps/
│   ├── extension/          # VS Code extension — core product
│   ├── web/                # Next.js landing page + dashboard
│   └── api/                # Express API (auth, billing, analytics)
│
├── packages/
│   ├── core/               # Loop detection + context algorithms (no VS Code deps)
│   ├── types/              # Shared TypeScript interfaces
│   ├── context-engine/     # Rust binary bridge + TypeScript fallback
│   │   └── rust/           # loopguard-ctx — 16k lines, 14 languages, MCP server
│   └── utils/              # hashString, similarity, debounce, formatDuration
│
├── docs/
│   ├── design-system.md    # Color tokens, typography, components
│   └── architecture.md     # Architecture decision records
│
├── CLAUDE.md               # AI intelligence layer (50 team roles + rules)
├── RULES.md                # Development rules
└── .ai-context             # Cursor / Copilot session context
```

---

## Development Setup

### Prerequisites
- Node.js 20+
- npm 10+
- VS Code 1.90+
- Rust + Cargo (optional — only needed to rebuild the binary)

### Install dependencies

```bash
npm install
```

### Build all packages

```bash
npm run build
```

### Build the Rust binary (optional)

```bash
cd packages/context-engine/rust
cargo build --release
# Binary: packages/context-engine/rust/target/release/loopguard-ctx
```

### Develop the extension

```bash
cd apps/extension
npm run watch
```

Then press `F5` in VS Code to open an Extension Development Host.

### Type check everything

```bash
npm run type-check
```

---

## Contributing

1. Fork the repo
2. Create a branch: `feat/your-feature` or `fix/your-bug`
3. Follow `RULES.md` — TypeScript strict mode, no magic numbers, privacy rules
4. Run `npm run type-check && npm run lint` before pushing
5. Open a PR with a clear description of the change and why

---

## Roadmap

| Phase | Feature | Status |
|-------|---------|--------|
| **MVP** | Loop detection — diagnostics + edit patterns | ✅ Done |
| **MVP** | Session time tracking | ✅ Done |
| **MVP** | Status bar + notifications | ✅ Done |
| **MVP** | Context Engine — Rust + TS fallback | ✅ Done |
| **MVP** | MCP Server setup command | ✅ Done |
| **MVP** | Shell hooks setup command | ✅ Done |
| **v1.1** | Token savings dashboard (Pro) | 📋 Planned |
| **v1.1** | Bundled platform binaries in VSIX | 📋 Planned |
| **v1.2** | Smart suggestions (AI-powered breakout) | 📋 Planned |
| **v2.0** | Multi-model routing | 💡 Concept |

---

## License

MIT — see [LICENSE](LICENSE)

---

<div align="center">

Built for developers who are done losing hours to AI loops.

**[Install on VS Code Marketplace](https://marketplace.visualstudio.com)** · **[Report a Bug](https://github.com/loopguard/loopguard/issues)** · **[Pro Plan — $9/mo](#pricing)**

</div>
