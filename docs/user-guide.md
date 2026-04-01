# LoopGuard — Complete User Guide

> Everything you need to install, configure, and get the most out of LoopGuard.

---

## Table of Contents

1. [What is LoopGuard?](#1-what-is-loopguard)
2. [Installation](#2-installation)
3. [First Launch](#3-first-launch)
4. [Feature 1 — Loop Detection](#4-feature-1--loop-detection)
5. [Feature 2 — Context Engine](#5-feature-2--context-engine)
6. [Dashboard](#6-dashboard)
7. [Account & Sync](#7-account--sync)
8. [MCP Server Integration](#8-mcp-server-integration)
9. [Shell Hooks](#9-shell-hooks)
10. [Commands Reference](#10-commands-reference)
11. [Status Bar](#11-status-bar)
12. [Configuration](#12-configuration)
13. [Privacy](#13-privacy)
14. [Troubleshooting](#14-troubleshooting)

---

## 1. What is LoopGuard?

LoopGuard is a VS Code / Cursor extension that solves **two of the biggest problems with AI-assisted development**:

### Problem 1 — The AI Loop

You're coding with Cursor, Copilot, or Claude Code. You hit an error. You ask AI to fix it. It gives you a fix. The fix doesn't work — or introduces a new error. You ask again. And again. Forty-five minutes later you realize you've been going in circles.

This is an **AI loop** — and it happens to every developer who uses AI tools regularly.

LoopGuard watches your code in real time. The moment it detects you're stuck in a loop, it shows you:
- **How many times** you've hit the same error
- **How much time** you've wasted on it
- **An action prompt** to break the cycle before you waste more

### Problem 2 — Context Waste

When you paste code into an AI chat (or when Cursor reads your file), it sends far more than the AI needs. A 1,200-line file for a bug on line 47? The AI gets all 1,200 lines, wastes tokens on irrelevant code, and gives worse answers because of the noise.

LoopGuard's **Context Engine** extracts only what matters — the relevant lines, imports, and error context — before it reaches the AI. Powered by a Rust engine that uses AST analysis and Shannon entropy filtering.

```
Your 1,200-line file:    ~4,800 tokens sent to AI
With LoopGuard:            ~340 tokens sent to AI

Token reduction: 93%   Monthly API cost: significantly lower
```

---

## 2. Installation

### Option A — VS Code Marketplace (recommended)

1. Open VS Code or Cursor
2. Press `Ctrl+Shift+X` (`Cmd+Shift+X` on Mac) to open Extensions
3. Search for **LoopGuard**
4. Click **Install**

Or install from the terminal:

```bash
code --install-extension LoopGuard.loopguard
```

**The Rust binary is bundled inside the extension.** No Cargo, no Rust, no extra install steps. The platform-specific binary is included automatically when VS Code installs the correct VSIX for your platform.

### Option B — Install from VSIX (manual / beta)

If you have a `.vsix` file (e.g., from a private beta or a local build):

1. Open VS Code
2. Press `Ctrl+Shift+P` → type **"Install from VSIX"**
3. Select the `.vsix` file
4. Reload VS Code when prompted

Or from the terminal:

```bash
code --install-extension loopguard-darwin-arm64.vsix
```

**Download the correct VSIX for your platform:**

| VSIX file | Platform |
|-----------|---------|
| `loopguard-darwin-arm64.vsix` | macOS Apple Silicon (M1/M2/M3/M4) |
| `loopguard-darwin-x64.vsix` | macOS Intel |
| `loopguard-win32-x64.vsix` | Windows x64 |
| `loopguard-linux-x64.vsix` | Linux x64 |
| `loopguard-linux-arm64.vsix` | Linux ARM64 |

### Option C — Build from source

```bash
# Clone the repository
git clone https://github.com/loopguard/loopguard
cd loopguard

# Install dependencies
npm install

# Build all packages
npm run build

# Package the extension (platform-specific)
cd apps/extension
npm run package:darwin-arm64   # or package:darwin-x64, package:win32-x64, etc.

# Install the generated VSIX
code --install-extension loopguard-darwin-arm64.vsix
```

### System Requirements

| Requirement | Minimum |
|-------------|---------|
| VS Code | 1.90.0 or later |
| Cursor | Any current version |
| Node.js | Not required at runtime |
| Rust | Not required (binary is bundled in VSIX) |
| OS | macOS · Windows · Linux |

---

## 3. First Launch

After installing, **LoopGuard activates automatically** the next time you open a workspace. No configuration required.

You'll see a welcome notification:

```
Welcome to LoopGuard!
Loop detection is now active. We'll alert you if you get stuck.
```

The **status bar** in the bottom-left of VS Code will show:

```
✓ LoopGuard
```

That's it. LoopGuard is running.

---

## 4. Feature 1 — Loop Detection

### How it works

LoopGuard watches for loops using two independent detection methods running in parallel:

#### Method A — Diagnostic Loop Detection

Monitors VS Code's error/warning diagnostics (the red underlines in your code). When the **same error hash** (same error message on the same line) appears **3 or more times** within a **5-minute window**, a loop is triggered.

```
Error appears at line 42  →  you fix it  →  it comes back  →  fix again  →  LOOP DETECTED
```

Works with all languages that produce VS Code diagnostics: TypeScript, Python, Rust, Go, C/C++, Java, and more.

#### Method B — Edit Pattern Detection

Monitors your edit history. When you make **4 or more edits** to the **same line region** (±5 lines) within **3 minutes**, a loop is triggered — even if the error message changes.

This catches the harder case: you're editing the same area over and over, error messages are different each time, but you're clearly stuck.

```
Edit line 38–44  →  edit same region again  →  again  →  again  →  LOOP DETECTED
```

### The Alert

When a loop is detected, you'll see a VS Code notification:

```
⚠️  LoopGuard — You're in a loop
"Cannot read properties of undefined (reading 'map')"
Repeated 4 times · 38 minutes wasted on this session

  [ Try New Approach ]    [ View Details ]    [ Ignore ]
```

### Alert Actions

| Button | What it does |
|--------|-------------|
| **Try New Approach** | Dismisses the alert. Reminder that you need a different strategy. |
| **View Details** | Opens the session dashboard — all loops, total time wasted, tokens saved. |
| **Ignore** | Marks this loop as resolved. LoopGuard won't re-alert on it until the error reappears fresh. |

### What counts as a "loop"?

A loop is declared when:
- **Method A:** Same error (same file + line + message fingerprint) seen ≥ 3 times within 5 minutes
- **Method B:** ≥ 4 edits to the same line region (±5 lines) within 3 minutes

The threshold is configurable — see [Configuration](#12-configuration).

### Sensitivity Settings

| Setting | Threshold | Use when |
|---------|-----------|----------|
| `low` | 5 occurrences | You're exploring and expect lots of iteration |
| `medium` (default) | 3 occurrences | Normal development pace |
| `high` | 2 occurrences | You want to catch loops early and aggressively |

---

## 5. Feature 2 — Context Engine

The Context Engine is LoopGuard's **token reduction system**. It extracts only the relevant parts of your code before sending it to an AI tool.

### The Two-Tier System

LoopGuard uses two engines depending on what's available:

```
┌─────────────────────────────────────────────────────────────────┐
│  Tier 1: Rust Engine (loopguard-ctx binary)  —  89–99% reduction │
│  AST analysis · Shannon entropy · Myers delta · CCP memory       │
│  Used automatically — binary is bundled inside the VSIX          │
└─────────────────────────────────────────────────────────────────┘
        ↓ Falls back to if binary not found ↓
┌─────────────────────────────────────────────────────────────────┐
│  Tier 2: TypeScript Engine  —  ~80% reduction                   │
│  Line selection around error · Import extraction · Delta cache   │
│  Always available, no binary needed                              │
└─────────────────────────────────────────────────────────────────┘
```

You never choose which tier runs — LoopGuard picks automatically.

### How to use it — Copy Optimized Context

1. Open any file in VS Code
2. Press `Ctrl+Shift+P` → **LoopGuard: Copy Optimized Context**
3. Paste into your AI chat

What gets copied:
- The **imports** from the top of your file
- The **lines around the error** (focused window, not the whole file)
- The **error context** (`// Error near line 42`) so the AI knows where to look

What gets stripped:
- Unrelated functions and classes
- Comments and documentation blocks
- Boilerplate and repetitive code
- Anything the AI doesn't need to fix your specific error

**After copying, you'll see:**

```
LoopGuard: Context copied via Rust engine (340 tokens · 93% reduction).
```

### What the Rust Engine actually does

When the `loopguard-ctx` binary is available, it applies a multi-pass compression:

#### 1. AST Signatures
Parses your file's Abstract Syntax Tree (14 languages supported). Extracts only function signatures, class definitions, and type declarations — drops the bodies of functions that aren't relevant.

```typescript
// Before (full function body sent to AI):
function processOrders(orders: Order[]): ProcessedOrder[] {
  const result: ProcessedOrder[] = [];
  for (const order of orders) {
    // ... 40 lines of logic ...
  }
  return result;
}

// After (signature only):
function processOrders(orders: Order[]): ProcessedOrder[] { ... }
```

#### 2. Shannon Entropy Filtering
Measures the "information density" of each line. Keeps lines that carry unique, high-value information. Drops lines that are low-entropy (whitespace, simple assignments, `}`, repeated patterns).

#### 3. Myers Delta
On re-reads of the same file, only the **changed sections** are transmitted. A file you've already sent costs ~13 tokens to re-read instead of its full size.

#### 4. CLI Pattern Compression
When used with shell hooks, compresses terminal output (npm install logs, git history, docker build output) using 90+ command-specific patterns. A `npm install` log that was 3,000 tokens becomes ~200 tokens.

### Supported Languages

The Rust engine supports 14 languages:
TypeScript · JavaScript · Python · Rust · Go · Java · C · C++ · C# · Ruby · PHP · Swift · Kotlin · Scala

The TypeScript fallback works with any text file.

---

## 6. Dashboard

The LoopGuard dashboard gives you a real-time view of your session: loops detected, time wasted, tokens saved, and active loop details.

### Opening the Dashboard

- Click the status bar item (`✓ LoopGuard` or `⚠ 2 loops`)
- Run `Ctrl+Shift+P` → **LoopGuard: Show Dashboard**
- Click **View Details** in any loop alert

The dashboard is a **live webview panel** inside VS Code. It updates automatically every time a loop is detected or context is copied.

### What's in the Dashboard

**Session Stats (4 cards)**
- Loops detected this session
- Total time wasted
- Tokens saved via context engine
- Number of active loops currently tracked

**Token Reduction Progress Bar**
Shows the overall reduction percentage for the current session.

**Active Loops List**
Each detected loop with: error hash, occurrence count, time wasted, file type, detected time, and status (active / resolved / ignored).

**Break-the-Loop Tips**
Contextual suggestions when you're stuck.

**Pro Upgrade CTA**
Visible to free tier users — unlocks dashboard history and advanced analytics.

### Web Dashboard

The web dashboard at `https://loopguard.dev/dashboard` shows your aggregated metrics across all sessions. Requires signing in — see [Account & Sync](#7-account--sync).

---

## 7. Account & Sync

Signing in is **optional**. LoopGuard works fully offline without an account. An account unlocks:
- Historical metrics across sessions (web dashboard)
- Loop trends over time
- Pro tier features (when subscribed)

### Signing In

1. Press `Ctrl+Shift+P` → **LoopGuard: Sign In**
2. Your browser opens `https://loopguard.dev/auth/extension`
3. Sign in with your email or Google account
4. VS Code opens automatically with your session — you're connected

Your JWT is stored securely in your **OS keychain** (macOS Keychain / Windows Credential Manager / Linux libsecret). It persists across VS Code restarts. No plaintext credentials anywhere.

### Signing Out

Press `Ctrl+Shift+P` → **LoopGuard: Sign Out**

All credentials are removed from your keychain. The extension continues working locally without sync.

### What Gets Synced

Every loop detected and every session is synced to the backend in real time (when authenticated). Sync is fire-and-forget — the extension never blocks on it.

**What is synced (privacy-safe):**
- Session duration, loop count, tokens saved
- Loop event: hash, occurrence count, time wasted, file extension, status
- Extension version, file types used (e.g., `["ts", "py"]`)

**What is never synced:**
- Source code
- File paths
- Error messages (full text)
- Any personally identifiable information beyond your account email

---

## 8. MCP Server Integration

**MCP (Model Context Protocol)** is a standard that lets AI tools call external tools directly. Instead of copying context to your clipboard, you can wire LoopGuard directly into your AI tool so it compresses context automatically on every request.

### What you get

When configured as an MCP server, LoopGuard gives your AI tool **21 context tools**:

| Tool | What it does |
|------|-------------|
| `read_file` | Read file with Rust-powered compression |
| `read_signatures` | Return only function/class signatures |
| `read_map` | Return dependency map (imports/exports) |
| `read_entropy` | Return high-information-density sections |
| `compress_output` | Compress CLI output (npm, git, docker…) |
| `get_delta` | Return only what changed since last read |
| … | 16 more context and compression tools |

### How to set it up

1. Press `Ctrl+Shift+P`
2. Type **LoopGuard: Configure MCP Server**
3. Select your AI tool:

```
Which AI tool do you want to configure?
> Cursor
  Claude Code
  Windsurf
  GitHub Copilot
```

4. LoopGuard runs `loopguard-ctx setup --agent=cursor` (or your chosen tool)
5. **Restart your AI tool** — MCP is now active

After setup, your AI tool will automatically use LoopGuard's compression on every file read.

---

### Claude Code — Why the model ignores loopguard-ctx instructions by default

When you register loopguard-ctx as an MCP server in Claude Code, the MCP server sends usage instructions to the model. However, Claude Code's training strongly favours built-in tools (Read, Grep, Bash). MCP server instructions are advisory — they do not block built-in tool calls. Without enforcement, the model continues using Read and Grep, bypassing loopguard-ctx entirely.

**Two enforcement mechanisms are required:**

1. A `CLAUDE.md` global rule that explicitly forbids the built-in tools and maps them to MCP equivalents.
2. A `PreToolUse` hook in `~/.claude/settings.json` that intercepts Read and Grep calls and returns an error, forcing the model to use ctx_read / ctx_search instead.

---

### Required setup steps for Claude Code users

#### Step 1 — Register the MCP server

```bash
claude mcp add loopguard-ctx loopguard-ctx
```

Or add to `~/.claude.json` manually:

```json
{
  "mcpServers": {
    "loopguard-ctx": {
      "command": "loopguard-ctx"
    }
  }
}
```

#### Step 2 — Add the PreToolUse hook

Create `~/.claude/hooks/loopguard-ctx-rewrite.sh`:

```bash
#!/usr/bin/env bash
# loopguard-ctx PreToolUse hook — blocks Read/Grep and rewrites Bash commands
set -euo pipefail

LOOPGUARD_CTX_BIN="$(which loopguard-ctx 2>/dev/null || echo '')"

# Emergency bypass: LOOPGUARD_BYPASS=1 lets all tools through unchanged.
if [ "${LOOPGUARD_BYPASS:-0}" = "1" ]; then
  exit 0
fi

INPUT=$(cat)
TOOL=$(echo "$INPUT" | grep -o '"tool_name":"[^"]*"' | head -1 | cut -d'"' -f4)

case "$TOOL" in
  Read|read)
    if [ -z "$LOOPGUARD_CTX_BIN" ]; then exit 0; fi
    echo "loopguard-ctx: use mcp__loopguard-ctx__ctx_read instead of the Read tool. ctx_read compresses file content by 80-99% before it enters the context window. Set LOOPGUARD_BYPASS=1 to bypass this check in emergencies." >&2
    exit 2
    ;;
  Grep|grep)
    if [ -z "$LOOPGUARD_CTX_BIN" ]; then exit 0; fi
    echo "loopguard-ctx: use mcp__loopguard-ctx__ctx_search instead of the Grep tool. ctx_search compresses search results by 50-80% before they enter the context window. Set LOOPGUARD_BYPASS=1 to bypass this check in emergencies." >&2
    exit 2
    ;;
esac

if [ "$TOOL" != "Bash" ] && [ "$TOOL" != "bash" ]; then
  exit 0
fi

CMD=$(echo "$INPUT" | grep -o '"command":"[^"]*"' | head -1 | cut -d'"' -f4)
if echo "$CMD" | grep -qE "^(loopguard-ctx )"; then exit 0; fi

REWRITE=""
case "$CMD" in
  git\ *|gh\ *|cargo\ *|npm\ *|pnpm\ *|yarn\ *|docker\ *|kubectl\ *)
    REWRITE="loopguard-ctx -c $CMD" ;;
  grep\ *|rg\ *|find\ *|cat\ *|head\ *|tail\ *|ls\ *|ls)
    REWRITE="loopguard-ctx -c $CMD" ;;
  curl\ *|pip\ *|pip3\ *|ruff\ *|go\ *|aws\ *|helm\ *)
    REWRITE="loopguard-ctx -c $CMD" ;;
  *)
    exit 0 ;;
esac

if [ -n "$REWRITE" ]; then
  echo "{\"command\":\"$REWRITE\"}"
fi
```

Make it executable:

```bash
chmod +x ~/.claude/hooks/loopguard-ctx-rewrite.sh
```

Register the hook in `~/.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash|bash|Read|read|Grep|grep",
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/hooks/loopguard-ctx-rewrite.sh"
          }
        ]
      }
    ]
  }
}
```

#### Step 3 — Add the global CLAUDE.md rule

Create `~/.claude/CLAUDE.md`:

```markdown
# loopguard-ctx — MANDATORY tool routing

The loopguard-ctx MCP server is active. You MUST use its tools instead of built-in equivalents.

## Required substitutions (enforced by PreToolUse hook)

| Built-in (FORBIDDEN)  | loopguard-ctx replacement              |
|-----------------------|----------------------------------------|
| Read                  | mcp__loopguard-ctx__ctx_read           |
| Bash (file reading)   | mcp__loopguard-ctx__ctx_shell          |
| Grep                  | mcp__loopguard-ctx__ctx_search         |
| Bash (ls/find)        | mcp__loopguard-ctx__ctx_tree           |

## Tools you CAN still use directly

- Write, Edit — no loopguard replacement
- Glob — no loopguard replacement
- Agent, Task — orchestration only

## Why

ctx_read compresses file content by 80-90% before it reaches this context window.
Using Read instead wastes tokens and defeats the purpose of the tool.
```

#### Step 4 — Verify with ctx_metrics

After a session, check that loopguard-ctx is being used:

```bash
# In a Claude Code session, ask Claude to run:
mcp__loopguard-ctx__ctx_metrics
```

You should see non-zero counts for `ctx_read` and `ctx_search` calls and significant token savings. If you see zero MCP calls, check that the hook file is executable and the matcher in settings.json includes `Read|Grep`.

#### Bypass

If you need to temporarily allow native Read/Grep (for debugging or emergencies):

```bash
LOOPGUARD_BYPASS=1 claude
```

### Requirements

The MCP integration requires the `loopguard-ctx` binary. The binary is bundled inside the VSIX — it should be available automatically after installing the extension.

If LoopGuard shows an error message:

> LoopGuard: The loopguard-ctx binary is required for MCP setup.

Click **"Download from GitHub"** in the error dialog to get the binary directly from the GitHub releases page.

---

## 9. Shell Hooks

Shell hooks pipe your terminal output through LoopGuard's compression engine **before** it reaches an AI context window. When you run a command and paste the output into an AI chat, it's already compressed.

### What gets compressed

| Command type | Example | Typical reduction |
|-------------|---------|------------------|
| Package managers | `npm install`, `pip install`, `cargo build` | 70–90% |
| Git | `git log`, `git diff`, `git status` | 60–80% |
| Docker | `docker build`, `docker compose up` | 65–85% |
| Test runners | `jest`, `pytest`, `cargo test` | 60–75% |
| Compiler output | `tsc`, `gcc`, `rustc` | 50–70% |

### How to set it up

1. Press `Ctrl+Shift+P`
2. Type **LoopGuard: Install Shell Hooks**
3. LoopGuard runs `loopguard-ctx init`
4. **Restart your terminal**

From that point on, long CLI outputs are automatically compressed. You'll see a summary line at the end of compressed output:

```
[LoopGuard: compressed 3,420 → 280 tokens · 91% reduction]
```

---

## 10. Commands Reference

Access all commands via the Command Palette: `Ctrl+Shift+P` (Windows/Linux) · `Cmd+Shift+P` (Mac)

| Command | Description |
|---------|-------------|
| **LoopGuard: Show Dashboard** | Full session summary: loops, time wasted, tokens saved |
| **LoopGuard: Reset Session** | Clear all session data and start fresh |
| **LoopGuard: Toggle Detection** | Pause or resume loop detection |
| **LoopGuard: Copy Optimized Context** | Compress current file and copy to clipboard |
| **LoopGuard: Configure MCP Server** | Wire Cursor / Claude / Windsurf to use LoopGuard tools |
| **LoopGuard: Install Shell Hooks** | Compress terminal output automatically |
| **LoopGuard: Sign In** | Open browser to sign in and connect to dashboard |
| **LoopGuard: Sign Out** | Remove credentials from OS keychain |

---

## 11. Status Bar

The LoopGuard status bar item lives in the **bottom-left** of VS Code. Click it at any time to open your session dashboard.

| What you see | Meaning |
|-------------|---------|
| `✓ LoopGuard` | All clear — no loops detected this session |
| `⚠ 2 loops · 38min` | 2 active loops, 38 minutes of wasted time tracked |
| `⊘ LoopGuard` | Detection is paused (toggle it back via Command Palette) |

---

## 12. Configuration

Open VS Code Settings (`Ctrl+,`) and search **"LoopGuard"**, or add these to your `settings.json`:

```json
{
  "loopguard.sensitivity": "medium",
  "loopguard.enableContextEngine": true,
  "loopguard.enableNotifications": true,
  "loopguard.loopThreshold": 3
}
```

### Settings Reference

#### `loopguard.sensitivity`
**Type:** `"low" | "medium" | "high"` · **Default:** `"medium"`

Controls how quickly LoopGuard fires a loop alert.

| Value | Occurrences needed | Best for |
|-------|--------------------|---------|
| `"low"` | 5 | Exploratory work, lots of intentional iteration |
| `"medium"` | 3 | Normal day-to-day development |
| `"high"` | 2 | You want alerts fast, catch loops immediately |

---

#### `loopguard.enableContextEngine`
**Type:** `boolean` · **Default:** `true`

Enables or disables the Context Engine. When disabled, `Copy Optimized Context` copies the full file content without any compression.

Set to `false` if you want loop detection only and don't use the context copy feature.

---

#### `loopguard.enableNotifications`
**Type:** `boolean` · **Default:** `true`

Controls whether LoopGuard shows popup alerts when a loop is detected.

If `false`, LoopGuard still detects loops and updates the status bar — it just won't interrupt you with a notification. Check the status bar manually.

---

#### `loopguard.loopThreshold`
**Type:** `number` (2–10) · **Default:** `3`

Custom loop detection threshold. Overrides the count implied by `sensitivity`.

Use this when the preset sensitivity levels don't match your workflow. For example, `"loopThreshold": 4` with `"sensitivity": "high"` fires after 4 occurrences (not 2).

**Note:** When `loopThreshold` is set, it takes precedence over `sensitivity` for the occurrence count.

---

## 13. Privacy

> **Your code never leaves your machine.**

This is an architectural guarantee, not just a policy.

### What LoopGuard processes locally (never transmitted):

- Your source code
- File paths and file names
- Error messages (full text)
- Edit history

### What LoopGuard may send to the backend (authenticated users only):

| Data | Format | Purpose |
|------|--------|---------|
| Session duration | Duration in ms | Usage analytics |
| Loops detected | Count only (e.g., `4`) | Usage analytics |
| Tokens saved | Estimated number | Usage analytics |
| File extensions | Type only (`.ts`, `.py`) — no path | Language popularity |
| Error hash | Anonymized fingerprint | Frequency analytics |
| User ID | JWT token only | Authentication |

No error messages. No file contents. No file paths. No code.

### How to verify

Every network call the extension makes is in `apps/extension/src/services/apiClient.ts`. The TypeScript payload types enforce what can and cannot be sent. Backend Zod schemas in `apps/api/src/routes/metrics.ts` enforce the same contract server-side.

---

## 14. Troubleshooting

### LoopGuard isn't detecting loops

**Check 1:** Is detection enabled?
- Look at the status bar. If it shows `⊘ LoopGuard`, detection is paused.
- Run `Ctrl+Shift+P` → **LoopGuard: Toggle Detection** to re-enable.

**Check 2:** Is your sensitivity too low?
- With `"sensitivity": "low"`, you need 5 occurrences of the same error within 5 minutes.
- Try `"sensitivity": "high"` to catch loops after 2 occurrences.

**Check 3:** Are errors showing in VS Code?
- LoopGuard reads VS Code diagnostics. If your language extension isn't producing errors (red underlines), LoopGuard can't detect them.
- Verify you have the relevant language extension installed (e.g., Pylance for Python, Rust Analyzer for Rust).

**Check 4:** Check the Output panel
- View → Output → select **LoopGuard** from the dropdown
- Any errors during activation or detection will appear here.

---

### Copy Optimized Context gives minimal reduction

**If the notification shows "TS engine"**, the Rust binary wasn't found.

The binary should be bundled in your VSIX. Check:
1. Verify your VSIX was platform-specific: the filename should include `darwin-arm64`, `win32-x64`, etc.
2. If you installed a generic VSIX without a platform target, reinstall with the correct platform-specific file.
3. If you built from source, run `node apps/extension/scripts/bundle-binary.js darwin arm64` before packaging.

Alternatively, install the binary to your system PATH:
```bash
# Download from GitHub Releases page
# Then verify it's available:
loopguard-ctx --version
```

After resolving, **reload VS Code** (`Ctrl+Shift+P` → **Developer: Reload Window**).

---

### Sign In doesn't work

1. Verify your browser opened `https://loopguard.dev/auth/extension`
2. After authenticating, VS Code should receive a `vscode://` URI callback automatically
3. If VS Code doesn't open, the browser may have blocked the deep link — click "Open VS Code" if prompted

Check the Output panel (View → Output → LoopGuard) for any auth callback errors.

---

### MCP setup command failed

The setup command requires `loopguard-ctx` binary. If it fails:

1. Click **"Download from GitHub"** in the error dialog
2. Place the downloaded binary in a directory on your system PATH
3. Verify it works: `loopguard-ctx --version`
4. Retry: `Ctrl+Shift+P` → **LoopGuard: Configure MCP Server**

Also check the Output panel (View → Output → LoopGuard) for the specific error.

---

### Shell hooks aren't compressing output

1. Verify installation: run `loopguard-ctx init` directly in your terminal and check for errors
2. **Restart your terminal** — hooks require a new shell session to activate
3. If using a non-standard shell (fish, nushell), manual configuration may be needed. Check `loopguard-ctx init --help` for shell-specific instructions.

---

### Status bar isn't visible

The LoopGuard status bar item may be hidden if your status bar is crowded.

1. Right-click the VS Code status bar
2. Make sure **LoopGuard** is checked in the list

---

### Extension fails to activate

1. Check your VS Code version: minimum `1.90.0`
2. Open the Output panel (View → Output → **Extension Host**)
3. Look for errors starting with `[LoopGuard]`
4. Report the error at: https://github.com/loopguard/loopguard/issues

---

## Quick Reference Card

```
INSTALL
  Marketplace: search "LoopGuard" in Extensions panel (binary bundled automatically)
  VSIX:        Ctrl+Shift+P → "Install from VSIX" (use platform-specific file)

LOOP DETECTION — automatic, no setup needed
  Triggers when: same error ×3 in 5 min  OR  same region edited ×4 in 3 min
  Alert actions: Try New Approach / View Details / Ignore
  Toggle:        Ctrl+Shift+P → "LoopGuard: Toggle Detection"

CONTEXT ENGINE — manual trigger
  Copy context: Ctrl+Shift+P → "LoopGuard: Copy Optimized Context"
  Then paste directly into your AI chat
  Engine shown: "Rust engine (340 tokens · 93% reduction)"

DASHBOARD
  Click status bar  OR  Ctrl+Shift+P → "LoopGuard: Show Dashboard"
  Live session metrics updated on every loop and copy-context action

ACCOUNT & SYNC — optional
  Sign in:  Ctrl+Shift+P → "LoopGuard: Sign In"
  Sign out: Ctrl+Shift+P → "LoopGuard: Sign Out"
  Web dashboard: https://loopguard.dev/dashboard

MCP SERVER — one-time setup
  Ctrl+Shift+P → "LoopGuard: Configure MCP Server" → pick your AI tool
  Restart the AI tool — done

SHELL HOOKS — one-time setup
  Ctrl+Shift+P → "LoopGuard: Install Shell Hooks"
  Restart your terminal — done

SETTINGS (settings.json)
  "loopguard.sensitivity":        "low" | "medium" | "high"  (default: medium)
  "loopguard.enableContextEngine": true | false               (default: true)
  "loopguard.enableNotifications": true | false               (default: true)
  "loopguard.loopThreshold":       2–10                       (default: 3)
```

---

*Found a bug or have a question? Open an issue at https://github.com/loopguard/loopguard/issues*
