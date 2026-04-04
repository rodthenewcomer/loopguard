<div align="center">

<img src="icon.png" width="64" alt="LoopGuard" />

# LoopGuard

**Break the loop. Ship faster.**

[![VS Code Marketplace](https://img.shields.io/visual-studio-marketplace/v/LoopGuard.loopguard?label=version&logo=visualstudiocode&logoColor=white&color=0066B8)](https://marketplace.visualstudio.com/items?itemName=LoopGuard.loopguard)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/LoopGuard.loopguard?color=0066B8&label=installs)](https://marketplace.visualstudio.com/items?itemName=LoopGuard.loopguard)
[![License: MIT](https://img.shields.io/badge/license-MIT-22c55e)](LICENSE)

</div>

---

LoopGuard watches your editor in real time. When you apply the same AI fix and hit the same error again and again, it tells you — shows the time wasted, fires an alert, and gives you a focused context snapshot so the next prompt actually has a chance of working.

## Features

- **Loop detection** — tracks repeated diagnostics and edit patterns; alerts when you're stuck
- **Status bar timer** — shows elapsed loop time so the cost of being stuck is always visible
- **In-editor dashboard** — session overview with loop count, time wasted, and token savings
- **Focused context copy** — copies only the lines relevant to the current error, not the whole file
- **Sidebar panel** — persistent Activity Bar panel with live loop count, time wasted, token savings, and auth state
- **MCP integration** — pairs with the optional `loopguard-ctx` native helper for Claude Code, Cursor, Windsurf, and Codex CLI
- **Shell hooks** — cleans terminal output before it reaches AI models
- **Optional sync** — anonymized session metrics can sync to your web dashboard; source code never leaves your device

## Commands

| Command | Description |
|---|---|
| `LoopGuard: Show Dashboard` | Open the in-editor session overview |
| `LoopGuard: Copy Optimized Context` | Copy focused context for the current file and error |
| `LoopGuard: Configure MCP Server` | Set up the local MCP helper for your AI tool |
| `LoopGuard: Install Shell Hooks` | Add shell hooks to clean output before AI calls |
| `LoopGuard: Focus Sidebar` | Open or focus the sidebar panel in the Activity Bar |
| `LoopGuard: Reset Session` | Clear loop state and timer |
| `LoopGuard: Toggle Detection` | Pause or resume loop detection |
| `LoopGuard: Sign In` | Optional — enables web dashboard sync |
| `LoopGuard: Sign Out` | Sign out of your account |

## Settings

| Setting | Default | Description |
|---|---|---|
| `loopguard.sensitivity` | `medium` | Loop trigger speed: `low` (5 hits), `medium` (3), `high` (2) |
| `loopguard.loopThreshold` | `3` | Custom count — overrides the sensitivity preset |
| `loopguard.enableContextEngine` | `true` | Filter context before AI calls |
| `loopguard.enableNotifications` | `true` | Show popup alerts when a loop is detected |

## Quick Start

1. Install the extension — it activates automatically when a workspace opens.
2. Work as usual. LoopGuard watches diagnostics in the background.
3. When a loop is detected, the status bar and sidebar panel update and an alert fires.
4. Run **LoopGuard: Copy Optimized Context** to get a focused prompt instead of pasting the whole file.

### Add MCP / Agent Support (optional)

Install the local helper binary:

```bash
brew install rodthenewcomer/loopguard/loopguard-ctx
# or
curl -fsSL https://loopguard.vercel.app/install.sh | sh
```

Then run **LoopGuard: Configure MCP Server** and restart your AI tool.

## Privacy

**Your code never leaves your machine.**

All loop detection and context filtering runs locally inside the extension. If you choose to sign in, the backend stores only anonymized metrics — loop counts, session durations, token-saved estimates. No source code. No file contents.

## Resources

- Homepage: [loopguard.vercel.app](https://loopguard.vercel.app)
- Docs: [loopguard.vercel.app/docs](https://loopguard.vercel.app/docs)
- Issues: [github.com/rodthenewcomer/loopguard/issues](https://github.com/rodthenewcomer/loopguard/issues)
- Repository: [github.com/rodthenewcomer/loopguard](https://github.com/rodthenewcomer/loopguard)
