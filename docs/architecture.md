# LoopGuard — Architecture

> Architecture decisions, data flows, and system boundaries.
> Update this file when architectural decisions change.

---

## System Overview

LoopGuard is a **local-first, two-in-one system**:
1. **Loop detection** — watches diagnostics and edit patterns, alerts when you're stuck
2. **Focused context** — trims prompts and shell output before they reach AI tools

The VS Code extension does all meaningful work on the developer's machine. The cloud backend is a support layer — not the product.

### Three Delivery Modes

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        loopguard-ctx (Rust binary)                          │
│  Focused reads · shell cleanup · saved helper sessions                      │
│  MCP server · language-aware parsing · local helper workflows               │
└───────────────────────┬────────────────────┬───────────────────────────────┘
                        │                    │                    │
           ┌────────────▼──────┐  ┌──────────▼────────┐  ┌──────▼───────────┐
           │  VS Code Extension │  │    MCP Server      │  │   Shell Hooks    │
           │  Loop detection   │  │  21 context tools  │  │  Compress CLI    │
           │  Status bar       │  │  for Cursor/Claude │  │  output pre-AI   │
           │  Clipboard copy   │  │  Windsurf/Copilot  │  │  (npm/git/docker)│
           └───────────────────┘  └────────────────────┘  └──────────────────┘
```

The binary is the local helper layer. The extension is the main delivery surface.

```
┌──────────────────────────────────────────────────────────────────┐
│                     Developer's Machine                          │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                 VS Code / Cursor IDE                       │  │
│  │                                                           │  │
│  │  ┌─────────────────┐     ┌──────────────────────────┐    │  │
│  │  │  Diagnostics API │────▶│     DiagnosticListener   │    │  │
│  │  │  (VS Code core)  │     │     (debounced 500ms)    │    │  │
│  │  └─────────────────┘     └──────────┬───────────────┘    │  │
│  │                                     │                     │  │
│  │  ┌─────────────────┐     ┌──────────▼───────────────┐    │  │
│  │  │  TextDocument   │────▶│       LoopEngine          │    │  │
│  │  │  Events         │     │  ┌─────────────────────┐  │    │  │
│  │  └─────────────────┘     │  │    LoopDetector      │  │    │  │
│  │                          │  │  (packages/core)     │  │    │  │
│  │                          │  └─────────────────────┘  │    │  │
│  │                          └──────────┬───────────────┘    │  │
│  │                                     │                     │  │
│  │           ┌─────────────────────────┼──────────────────┐ │  │
│  │           │                         │                  │ │  │
│  │  ┌────────▼──────┐    ┌─────────────▼──────┐  ┌───────▼─┤ │  │
│  │  │ SessionTracker│    │  ContextEngine      │  │StatusBar│ │  │
│  │  │ (time wasted) │    │  (token optimizer)  │  │AlertUI  │ │  │
│  │  └───────┬───────┘    └────────────────────┘  └─────────┘ │  │
│  │          │                                                  │  │
│  │  ┌───────▼───────────────┐                                  │  │
│  │  │  DashboardPanel       │  WebviewPanel singleton          │  │
│  │  │  (live session UI)    │  updated on every loop event     │  │
│  │  └───────────────────────┘                                  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  AuthService (SecretStorage)  ←→  ApiClient (HTTP)        │  │
│  │  JWT stored in OS keychain         Best-effort sync        │  │
│  └───────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
                              │
                    HTTPS (auth/billing/metrics)
                    No source code ever transmitted
                              │
              ┌───────────────▼────────────────────┐
              │         Backend API (Express)        │
              │  /api/v1/metrics/session             │
              │  /api/v1/metrics/loop                │
              │  /api/v1/metrics/summary             │
              │                                    │
              │  ┌──────────┐  ┌────────────────┐  │
              │  │ Supabase │  │    Stripe       │  │
              │  │ Auth+DB  │  │   Billing       │  │
              │  └──────────┘  └────────────────┘  │
              │                                    │
              └────────────────────────────────────┘
                              │
              ┌───────────────▼────────────────────┐
              │    Next.js Web Dashboard            │
              │  /dashboard  →  useDashboardData()  │
              │  Reads JWT from localStorage        │
              │  Falls back to demo data if unauth  │
              └────────────────────────────────────┘
```

---

## Package Architecture

### `packages/context-engine` — The Local Helper Layer

The Rust binary and TypeScript bridge power focused reads, agent setup, saved
helper sessions, and shell cleanup.

```
packages/context-engine/
  rust/                    → loopguard-ctx Rust binary (16,000+ lines)
    src/
      main.rs              → CLI entry point (read, setup, init, mcp, doctor)
      server.rs            → MCP server and helper instructions
      compression/         → Read modes, delta reuse, shell cleanup patterns
      languages/           → Language-aware parsers for common source files
      memory/              → Saved helper session state and re-read reuse
    Cargo.toml             → name: "loopguard-ctx"

  src/
    bridge.ts              → TypeScript ↔ Rust binary bridge (spawns subprocess)
    rustEngine.ts          → Direct Rust interface: signatures/map/entropy/full/compressOutput
    fallbackEngine.ts      → TS fallback using selectRelevantLines for smaller focused prompts
    index.ts               → Exports
```

**Binary read modes:**
| Mode | Description | Typical reduction |
|------|-------------|-------------------|
| `signatures` | API surface only | Highest reduction |
| `map` | Imports, exports, key dependencies | Strong reduction |
| `entropy` | High-signal lines from larger files | Moderate reduction |
| `full` | Full file with session-aware delta reuse on re-read | Variable |

### `packages/core` — The Algorithm Layer

Framework-agnostic TypeScript. No VS Code dependencies. Can be tested in isolation with plain Node.js.

```
packages/core/src/
  loop/
    detectLoop.ts      → LoopDetector class
                         - Tracks DiagnosticRecord occurrences per hash
                         - Detects loops when threshold + time window met
                         - Returns LoopEvent on detection, null otherwise

  context/
    fileSelector.ts    → selectRelevantLines(content, errorLine, radius)
                         - Extracts focused view of file around error
                         - Includes import statements from file header

    deltaProcessor.ts  → DeltaProcessor class
                         - Computes file delta since last snapshot
                         - Returns changed lines + context + token savings estimate
```

**Why separate?** Enables unit testing without VS Code environment. Enables future CLI or web usage of the same algorithms.

### `packages/types` — The Contract Layer

All shared TypeScript interfaces. Any change here is a breaking change that requires updating all consumers.

```typescript
// Core business entities
LoopEvent          // A detected loop (id, uri, hash, occurrences, timestamps, status)
DiagnosticRecord   // A single error occurrence to be tracked
ContextSnapshot    // A filtered view of context (lines, imports, tokenEstimate)
SessionMetrics     // Session-level aggregates (loops detected, time wasted, tokens saved)
LoopGuardConfig    // User configuration preferences
AlertAction        // User response to an alert
```

### `apps/extension` — The Delivery Layer

Connects `packages/core` algorithms to VS Code APIs.

```
src/
  extension.ts           → activate() / deactivate() — the entry point
                           Wires everything together, manages subscriptions
                           Registers URI handler for auth callback
                           Starts 5-minute periodic sync timer

  core/
    loopEngine.ts        → Adapts LoopDetector to work with vscode.Uri + vscode.Diagnostic
    contextEngine.ts     → Two-tier: Rust binary first, TS fallback. Spawns loopguard-ctx subprocess.
    sessionTracker.ts    → Accumulates SessionMetrics across the session
    editTracker.ts       → Edit-pattern loop detection (4 edits, ±5 lines, 3-min window)

  listeners/
    diagnosticListener.ts  → vscode.languages.onDidChangeDiagnostics → loopEngine (debounced 500ms)
    fileListener.ts        → vscode.workspace.onDidChangeTextDocument → editTracker (debounced 300ms)

  ui/
    statusBar.ts         → Status bar item with real-time metrics
    alertPanel.ts        → Notification popups with action buttons
    dashboardPanel.ts    → Singleton WebviewPanel (live session metrics, loops list, token savings)
    sidebarPanel.ts      → WebviewViewProvider for Activity Bar persistent panel
                           VIEW_ID: loopguard.sidebar
                           update(metrics, activeLoops, summary) — re-renders HTML
                           setAuthState(), setEngineTier() for external state

  services/
    apiClient.ts         → Best-effort HTTP client for backend sync
                           sendSession(payload) — POST /api/v1/metrics/session
                           sendLoop(payload)    — POST /api/v1/metrics/loop
                           8s timeout via AbortController
                           All calls no-op when token is null (unauthenticated)

    authService.ts       → JWT lifecycle manager
                           initialize() — restore JWT from SecretStorage on activation
                           signIn()     — open browser to /auth/extension
                           handleCallback(token, email) — store JWT, wire to ApiClient
                           signOut()    — clear all credentials

  utils/
    logger.ts            → OutputChannel wrapper (replaces console.log)
    config.ts            → Reads and reacts to configuration changes
```

**Binary resolution order for `contextEngine.ts`:**
```
1. extensionPath/bin/{platform}-{arch}/loopguard-ctx  ← bundled in VSIX (preferred)
2. loopguard-ctx on system PATH                        ← installed by user
3. TypeScript fallback                                 ← always available
```

**Binary directory structure in VSIX:**
```
apps/extension/
  bin/
    darwin-arm64/loopguard-ctx   ← macOS Apple Silicon
    darwin-x64/loopguard-ctx     ← macOS Intel
    win32-x64/loopguard-ctx.exe  ← Windows x64
    linux-x64/loopguard-ctx      ← Linux x64
    linux-arm64/loopguard-ctx    ← Linux ARM64
```

---

## Data Flow: Loop Detection

```
1. Developer writes code
2. VS Code runs language server
3. Language server emits diagnostic errors

4. vscode.languages.onDidChangeDiagnostics fires
5. DiagnosticListener receives event (debounced 500ms)

6. For each URI in event.uris:
   a. Get current diagnostics (Error severity only)
   b. For each diagnostic: create DiagnosticRecord
      - hash = hashString(uri + message + line)
      - seenAt = [Date.now()]

7. LoopEngine.handleDiagnosticChange(uri, diagnostics)
   a. Pass each DiagnosticRecord to LoopDetector.record()
   b. LoopDetector checks: same hash seen >= threshold times in time window?
   c. If yes: return LoopEvent

8. If LoopEvent returned:
   a. SessionTracker.recordLoop(event) — accumulate metrics
   b. void ApiClient.sendLoop({...}) — fire-and-forget to backend
   c. StatusBar.update(metrics, activeLoopCount) — update status bar
   d. DashboardPanel.update(metrics, activeLoops) — update webview if open
   e. AlertPanel.showLoopAlert(event, metrics) — show notification

9. User acts on notification:
   - "Try New Approach" → dismiss, user changes strategy
   - "View Details" → DashboardPanel.show() — open webview
   - "Ignore" → resolve this loop in LoopDetector + clear EditTracker for URI
```

---

## Data Flow: Context Engine

```
1. User triggers "Copy Optimized Context" (command or clipboard shortcut)

2. ContextEngine.getSnapshotAsync(activeDocument, errorLine)

   Tier 1 path (Rust binary available):
   a. Find binary: check bundled bin/{platform}-{arch}/loopguard-ctx, then PATH
   b. Spawn: loopguard-ctx read <file> --mode=entropy [--focus-line=N]
   c. Binary applies language-aware selection, entropy scoring, and delta reuse
   d. Return ContextSnapshot with stdout as relevantLines

   Tier 2 path (no binary):
   a. selectRelevantLines(content, errorLine, radius=30)
   b. Extract import statements from file header
   c. DeltaProcessor.process() for delta compression
   d. Return ContextSnapshot

3. Token savings computed: fullTokens - compressedTokens
4. SessionTracker.addTokensSaved(saved)
5. Clipboard written. Notification shown with reduction % and engine tier.
6. DashboardPanel.update(metrics, activeLoops) — reflect saved tokens
```

---

## Data Flow: Authentication

```
1. User runs: Ctrl+Shift+P → "LoopGuard: Sign In"

2. AuthService.signIn() opens browser:
   vscode.env.openExternal('https://loopguard.dev/auth/extension')

3. User authenticates on /auth/extension (Supabase OAuth / email)

4. After auth, page redirects to:
   vscode://LoopGuard.loopguard/auth?token=JWT&email=user@example.com

5. VS Code URI handler fires (registered via vscode.window.registerUriHandler):
   a. Parses token + email from URI query params
   b. Web app also passes refresh_token (stored in auth_codes DB row)
   c. authService.handleCallback(token, email, refreshToken)
      - Stores JWT in vscode.SecretStorage (OS keychain — never localStorage)
      - Stores refresh_token in SecretStorage (key: loopguard.auth.refreshToken)
      - Sets both on ApiClient
      - Shows success notification

6. All subsequent ApiClient calls include Bearer token
7. On 401 response: ApiClient._tryRefresh() calls POST /api/v1/auth/refresh
   with stored refreshToken → receives new JWT + refreshToken → auto-persists
8. On next VS Code launch: authService.initialize() restores both from SecretStorage
```

**JWT storage:** `vscode.SecretStorage` (OS keychain on macOS, Credential Manager on Windows, libsecret on Linux). Never stored in settings.json or localStorage.

---

## Data Flow: Backend Sync (Authenticated Only)

```
All sync is best-effort. ApiClient never throws to callers.
All calls are no-ops when token is null.

1. On every loop detected:
   POST /api/v1/metrics/loop {
     sessionId,
     errorHash,    // anonymized fingerprint — no error message text
     occurrences,
     timeWastedMs,
     fileType,     // "ts", "py" — no path
     detectedAt,
     status,
   }

2. Every 5 minutes (setInterval):
   POST /api/v1/metrics/session {
     sessionId,
     startedAt,
     loopsDetected,     // count only
     timeWastedMs,
     tokensSaved,
     fileTypes,         // ["ts", "py"] — no paths
     extensionVersion,
   }

3. On deactivation (extension closes):
   POST /api/v1/metrics/session { ...same, endedAt: Date.now() }
   (called synchronously in deactivate via syncSession(Date.now()))

4. Backend pipeline:
   Express → auth middleware (JWT verify via Supabase) → Zod validation → Supabase insert
   Row-Level Security: users can only read/write their own rows
```

---

## Data Flow: Web Dashboard

```
1. User visits /dashboard on the web app

2. useDashboardData() hook:
   a. Read JWT from localStorage.getItem('loopguard_jwt')
      (set by the /auth/extension callback page on successful auth)
   b. If null → state: 'not-authed' → show "Connect Extension" prompt
   c. If JWT present → fetch /api/v1/metrics/summary?days=7
   d. On success → state: 'live', real data rendered
   e. On error → state: 'demo', DEMO_DATA rendered with error banner

3. Summary endpoint returns:
   {
     thisWeek:  { loops, timeWastedMs, tokensSaved, costSaved },
     today:     { loops, timeWastedMs, tokensSaved, costSaved },
     weeklyBreakdown: [ { date, loops, tokensSaved } × 7 ],
     recentLoops:     [ { id, errorHash, occurrences, timeWastedMs, fileType, status, detectedAt } ],
     topErrorHashes:  [ { hash, count } ],
   }
```

---

## Privacy Architecture

The privacy guarantee is enforced at the architecture level, not just policy:

| Data | Stored Locally | Sent to Backend |
|------|---------------|-----------------|
| Source code | In memory only | ❌ Never |
| File paths | In memory only | ❌ Never |
| Error messages | In memory only | ❌ Never |
| Error hash (fingerprint) | In memory + analytics | ✅ Anonymous only |
| Loop count | In memory + analytics | ✅ Count only |
| Time wasted | In memory + analytics | ✅ Duration (ms) |
| File extensions | In memory + analytics | ✅ Type only (`.ts`) |
| Session duration | In memory + analytics | ✅ |
| User ID | SecretStorage | ✅ JWT only |

**How to audit:**
- Every `POST` to the backend is in `apps/extension/src/services/apiClient.ts`
- Every backend schema is in `apps/api/src/routes/metrics.ts` (Zod schemas)
- Database schema + RLS policies: `apps/api/supabase/schema.sql`

---

## Configuration Architecture

VS Code workspace settings flow:

```
settings.json (user/workspace)
    │
    ▼ vscode.workspace.getConfiguration('loopguard')
    │
    ▼ apps/extension/src/utils/config.ts → getConfig(): LoopGuardConfig
    │
    ├──▶ LoopEngine.updateConfig(config) → update thresholds
    ├──▶ ContextEngine.updateConfig(config) → enable/disable
    └──▶ AlertPanel.updateConfig(config) → enable/disable notifications
```

Configuration changes take effect immediately without extension restart.

---

## Error Handling Strategy

```
Layer 1 — VS Code API errors:
  Caught in listeners. Logged. Extension continues functioning.
  Never crash the extension on a single diagnostic change failure.

Layer 2 — Core algorithm errors:
  Caught in LoopEngine / ContextEngine wrappers.
  Return safe fallbacks (empty array, null).
  Log with context for debugging.

Layer 3 — Backend API errors:
  All backend calls are fire-and-forget.
  ApiClient: catches all errors, logs warnings, swallows — never rethrows.
  Auth failures → graceful degradation (all ApiClient calls no-op).
  Never block extension functionality on backend unavailability.

Layer 4 — Auth errors:
  handleCallback failure → logged, extension continues unauthenticated.
  initialize() failure → logged, extension continues unauthenticated.
  signIn() failure → error message shown to user, extension continues.
```

---

## Performance Architecture

### Activation

The extension uses `"activationEvents": ["onStartupFinished", "onUri"]` to avoid slowing down VS Code startup. Core initialization is < 5ms. Heavy modules are lazy-loaded.

### Event Handling

```
All events debounced:
  onDidChangeTextDocument:    300ms debounce
  onDidChangeDiagnostics:     500ms debounce

Processing budget:
  DiagnosticRecord creation:  < 0.5ms per diagnostic
  Hash computation:           < 0.1ms
  LoopDetector.record():      < 1ms
  Full loop check pipeline:   < 5ms
  ApiClient.sendLoop():       fire-and-forget, does not block pipeline
```

### Memory

- `LoopDetector` state: O(unique error hashes) — bounded by session length
- `DeltaProcessor` cache: bounded to last 20 documents (LRU eviction)
- `SessionTracker`: O(loops detected) — bounded by session length, cleared on reset
- `DashboardPanel`: single WebviewPanel, disposed on extension deactivation

---

## CI/CD: Release Pipeline

Push a `v*.*.*` tag (e.g., `git tag v0.2.0 && git push --tags`) to trigger:

```
Job 1 — build-binary (matrix: 5 platforms in parallel)
  Runs on native/cross-compilation runners
  cargo build --release --target <rust-target>
  Uploads binary as artifact: binary-{vscode-platform}

  Platforms:
    aarch64-apple-darwin      → darwin-arm64    (macos-14 runner)
    x86_64-apple-darwin       → darwin-x64      (macos-13 runner)
    x86_64-pc-windows-msvc    → win32-x64       (windows-latest)
    x86_64-unknown-linux-musl → linux-x64       (ubuntu-22.04)
    aarch64-unknown-linux-musl→ linux-arm64     (ubuntu-22.04, cross-compiled)

Job 2 — package-extension (matrix: 5 platforms, needs: build-binary)
  Downloads binary artifact
  Places binary in apps/extension/bin/{vscode-platform}/
  npm run build
  vsce package --no-dependencies --target {vscode-platform}
  Uploads VSIX as artifact: vsix-{vscode-platform}

Job 3 — release (needs: package-extension)
  Downloads all 5 VSIX artifacts
  Creates GitHub Release with all VSIXs attached
  Auto-generates release notes

Job 4 — publish (needs: package-extension, only on non-pre-release tags)
  Downloads all 5 VSIX artifacts
  Publishes each to VS Code Marketplace (uses VSCE_TOKEN secret)
```

**Required GitHub secrets:**
- `VSCE_TOKEN` — Personal access token from VS Code Marketplace publisher page

---

## Monorepo Build Graph (Turborepo)

```
packages/types         ──────────────────────────────────────┐
                                                             │
packages/utils         ──────────────────────────────────────┤
                                                             │
packages/core          ←── depends on types + utils         │
                                                             ▼
packages/context-engine ←── depends on types + utils   apps/extension
  └── rust/loopguard-ctx  (cargo build --release)      apps/web
                                                        apps/api
```

Build order is enforced automatically by Turborepo dependency graph.

**Note:** The Rust binary is pre-compiled and committed to `bin/` per platform. `npm run build` does not rebuild Rust.
- Rebuild Rust: `cd packages/context-engine/rust && cargo build --release`
- Bundle for packaging: `node apps/extension/scripts/bundle-binary.js darwin arm64`

---

## ADR Log (Architecture Decision Records)

### ADR-001: Local-first processing
**Decision:** All loop detection and context filtering runs on the developer's machine.
**Rationale:** Privacy guarantee is a product differentiator. Latency is better local. Offline-capable.
**Consequences:** Cannot do ML-based loop detection in v1. Context engine must be rule-based.

### ADR-002: Monorepo with Turborepo
**Decision:** Single repo with multiple apps and shared packages.
**Rationale:** Shared types prevent drift between extension and API. Single `npm install`. Coordinated releases.
**Consequences:** More complex initial setup. Requires Turborepo knowledge.

### ADR-003: diagnostics API for loop detection (v1)
**Decision:** Use `vscode.languages.onDidChangeDiagnostics` as the loop signal.
**Rationale:** Available without any AI API. Works with all languages. Zero cost. Immediate value.
**Consequences:** Cannot detect loops in conversations that don't produce diagnostic errors (e.g., wrong logic with no compiler errors). This is a v2 problem (prompt history tracking).

### ADR-004: support-first monetization
**Decision:** Keep the core product free while validating direct support and optional paid add-ons later.
**Rationale:** Lower friction for installation, faster trust, and cleaner product messaging while the workflow is still being refined.
**Consequences:** Revenue arrives later. Revisit once the product story and support funnel are stable.

### ADR-005: esbuild for extension bundling
**Decision:** Use esbuild instead of webpack for bundling the extension.
**Rationale:** 10–100x faster build times. Simpler configuration. Good source map support.
**Consequences:** Less ecosystem than webpack. Some edge cases with CommonJS interop.

### ADR-006: Rust binary as subprocess (not WASM or FFI)
**Decision:** Spawn `loopguard-ctx` as a child process via `execFileAsync`, not via WASM or native Node.js FFI.
**Rationale:** Simpler distribution (bundle the binary per platform, no build step at install time). Binary already has its own CLI contract. No Node.js Rust binding maintenance.
**Consequences:** Cold start latency (~20ms per call) on first run. Mitigated by the binary being fast and calls being infrequent (only on explicit copy-context action).

### ADR-007: Three delivery modes share one binary
**Decision:** The VS Code extension, MCP server mode, and shell hooks all use `loopguard-ctx` as the shared engine.
**Rationale:** One codebase to maintain for compression logic. Extension sets up MCP/shell by running `loopguard-ctx setup --agent=X` and `loopguard-ctx init`. Users can adopt as deeply as they want.
**Consequences:** Extension is a thin coordination layer. Intelligence is in the binary. Binary must be available for Tier 1 features.

### ADR-008: Edit-pattern loop detection (EditTracker)
**Decision:** Add a second loop detection path based on repeated edits to the same line region.
**Rationale:** Diagnostic-based detection misses "error A → error B → error A" cycles and edits that don't produce compiler errors. Real loops often manifest as edit thrashing before errors change.
**Consequences:** More false positives possible. Tuning required. Threshold: 4 edits, ±5 lines, 3-minute window.

### ADR-009: Platform-specific VSIX with bundled binaries
**Decision:** Ship 5 separate platform-specific VSIXs (darwin-arm64, darwin-x64, win32-x64, linux-x64, linux-arm64), each containing the pre-compiled `loopguard-ctx` binary for that platform.
**Rationale:** Normal users cannot and should not need Rust/Cargo to install a VS Code extension. Binary bundling is the standard approach for extension authors (VS Code Marketplace supports `--target` flag). Zero install friction.
**Consequences:** 5× build jobs in CI/CD. Each VSIX is larger (~5–8 MB). Marketplace automatically serves the correct VSIX per platform. Local dev uses `node scripts/bundle-binary.js {platform} {arch}` before `vsce package`.

### ADR-010: JWT stored in vscode.SecretStorage, not settings
**Decision:** Store the auth JWT in `vscode.SecretStorage` rather than in workspace/user settings or `globalState`.
**Rationale:** `SecretStorage` maps to the OS keychain (macOS Keychain, Windows Credential Manager, libsecret on Linux). Tokens in settings.json are plaintext on disk. `globalState` is also plaintext. SecretStorage is the VS Code-recommended mechanism for sensitive values.
**Consequences:** Token survives VS Code restarts. Cannot be read by other extensions (namespaced). Cleared when extension is uninstalled. Cannot be bulk-exported in settings sync — users must re-authenticate on new machines.

### ADR-012: SidebarPanel as WebviewViewProvider (Activity Bar)
**Decision:** Implement the sidebar panel using `vscode.WebviewViewProvider` registered to `loopguard.sidebar` view, alongside the existing `DashboardPanel` WebviewPanel.
**Rationale:** `WebviewViewProvider` gives a persistent Activity Bar slot that stays visible as the developer navigates files — no click required to keep metrics visible. `WebviewPanel` (DashboardPanel) is retained for the detailed tabbed view. Both update from the same `refreshLoopState()` call.
**Consequences:** Two rendering surfaces sharing the same data source. `retainContextWhenHidden: true` keeps sidebar DOM alive when collapsed, at the cost of ~a few MB memory. Both panels must stay in sync via the same update call.

### ADR-011: ApiClient is fire-and-forget (never blocks extension)
**Decision:** Every ApiClient method is async, swallows all errors internally, and is called with `void` prefix from `extension.ts`.
**Rationale:** The extension's core value (loop detection, context copy) must work 100% of the time, regardless of backend availability, network conditions, or auth state. Sync failures are a degraded experience, not a broken one.
**Consequences:** No retry logic in v1. Metrics may be lost if the user is offline during a session. Acceptable for analytics; unacceptable for billing (handled separately via Stripe).

### ADR-013: Silent JWT refresh via stored refresh_token
**Decision:** Store Supabase refresh_token alongside the access_token in SecretStorage. On 401, `ApiClient._tryRefresh()` calls `POST /api/v1/auth/refresh` to get a new token pair without user interaction.
**Rationale:** Supabase JWTs expire in ~1 hour. Without refresh, authenticated sessions silently failed after the first hour, causing zero metrics to be written to the backend. The fix threads refresh_token through the entire auth chain: web auth page → auth_codes DB → exchange endpoint → extension SecretStorage → auto-retry on 401.
**Consequences:** One extra network call on 401. Refresh token is also stored in OS keychain. New `/api/v1/auth/refresh` endpoint added to the API (proxies Supabase token refresh endpoint). `auth_codes` table gained a nullable `refresh_token` column (migration 20260404000001).
