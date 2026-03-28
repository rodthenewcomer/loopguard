# LoopGuard — Development Rules

> These rules apply to all code in this repository.
> They are non-negotiable. Review before every PR.

---

## 1. Architecture Rules

### Extension (Local-First)
- Core logic runs **locally** — no network calls for loop detection or context filtering
- Extension activates in **< 500ms** — lazy-load anything heavy
- **Debounce all listeners** — minimum 300ms for text changes, 500ms for diagnostics
- **Dispose every subscription** — track all `Disposable` objects in `context.subscriptions`
- Never block the VS Code UI thread — use `async/await` everywhere

### Backend (Minimal Surface)
- Backend does three things only: **auth, billing, analytics**
- **Never store source code** — only anonymized metrics (file extension, error hash, session duration)
- All routes require **Supabase JWT authentication**
- **Validate all inputs** with Zod before processing

### Context Engine (Core Moat)
- **Selection > compression** — remove irrelevant context, don't just shrink it
- **Delta processing** — send only what changed since last snapshot
- **Cache aggressively** — never resend context already sent this session
- Measure token savings and surface them to the user

---

## 2. TypeScript Rules

```typescript
// ✅ CORRECT
function processError(message: string, line: number): DiagnosticRecord {
  const hash = hashString(`${message}:${line}`);
  return { hash, message, line, col: 0, seenAt: [Date.now()], uri: '' };
}

// ❌ WRONG — any type, magic number, no return type
function processError(message: any, line: any) {
  const hash = message.slice(0, 8);  // magic
  return { hash, message };
}
```

### Strict mode — always
- No `any` — if you need escape hatches, use `unknown` and narrow
- No `!` non-null assertions without a comment explaining why it's safe
- No implicit `any` from missing type annotations
- Unused variables and parameters are errors, not warnings

### Error handling — explicit
```typescript
// ✅ CORRECT
try {
  const result = await fetchDiagnostics(uri);
  return result;
} catch (error) {
  logger.error('Failed to fetch diagnostics', { uri, error });
  return [];
}

// ❌ WRONG — swallowed error, silent failure
try {
  return await fetchDiagnostics(uri);
} catch {}
```

### Naming — clear over short
```typescript
// ✅
const loopDetectionThreshold = 3;
const diagnosticChangeHandler = debounce(handleDiagnosticChange, 500);

// ❌
const n = 3;
const h = debounce(f, 500);
```

---

## 3. Code Structure Rules

### Functions — small and focused
- Max ~30 lines per function
- One responsibility per function
- Extract when nesting exceeds 3 levels

```typescript
// ✅ Early returns — no deep nesting
function detectLoop(records: DiagnosticRecord[]): LoopEvent | null {
  if (records.length < LOOP_THRESHOLD) return null;
  if (!isWithinTimeWindow(records)) return null;
  return buildLoopEvent(records);
}

// ❌ Deep nesting
function detectLoop(records: DiagnosticRecord[]): LoopEvent | null {
  if (records.length >= LOOP_THRESHOLD) {
    if (isWithinTimeWindow(records)) {
      if (records[0].uri) {
        // ...more nesting
      }
    }
  }
  return null;
}
```

### No magic numbers — named constants
```typescript
// ✅
const LOOP_DETECTION_THRESHOLD = 3;
const TIME_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const DEBOUNCE_DIAGNOSTIC_MS = 500;

// ❌
if (records.length >= 3) { ... }
```

### No duplicated logic — extract shared utilities
- If the same logic appears twice, extract it to `packages/utils` or a local helper
- Shared types always go in `packages/types`

---

## 4. Extension-Specific Rules

### Activation
```typescript
// ✅ Dispose everything
export function activate(context: vscode.ExtensionContext): void {
  const disposables = [
    statusBar,
    diagnosticListener.activate(),
    fileListener.activate(),
    vscode.commands.registerCommand('loopguard.showDashboard', showDashboard),
  ];
  context.subscriptions.push(...disposables);
}

// ✅ Clean deactivation
export function deactivate(): void {
  logger.dispose();
}
```

### No blocking the UI thread
```typescript
// ✅ Async processing
vscode.languages.onDidChangeDiagnostics(async (event) => {
  for (const uri of event.uris) {
    await processUri(uri);  // never blocks UI
  }
});

// ❌ Synchronous heavy work
vscode.languages.onDidChangeDiagnostics((event) => {
  const result = heavySyncComputation(event);  // blocks UI
});
```

### Webview Content Security Policy
```typescript
// ✅ Always set CSP for webviews
const cspSource = webviewView.webview.cspSource;
const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta http-equiv="Content-Security-Policy"
          content="default-src 'none'; style-src ${cspSource}; script-src ${cspSource};">
  </head>
  ...`;
```

---

## 5. Security Rules

| Rule | Enforcement |
|------|-------------|
| No API keys in source code | Git hooks + manual review |
| No user code sent to backend | Architecture constraint + privacy audit |
| All backend inputs validated | Zod schemas required on all routes |
| HTTPS only for API calls | Hardcoded in API client |
| Webview CSP headers | Required in all webview HTML |
| Supabase RLS enabled | All tables have row-level security policies |

---

## 6. Performance Budgets

| Metric | Budget |
|--------|--------|
| Extension activation time | < 500ms |
| Loop detection check | < 5ms |
| Context snapshot generation | < 50ms |
| Status bar update | < 1ms |
| Diagnostic listener debounce | 500ms |
| File change listener debounce | 300ms |

---

## 7. Privacy Rules

The privacy guarantee is a **product commitment**, not just a policy:

> **User source code never leaves the device.**

In practice:
- Extension sends to backend: session ID, loop count, time wasted (ms), file extension (not path), error hash (not message), subscription status
- Extension **never** sends: file contents, file paths, error messages, code snippets

Any change that would send user code to the backend requires:
1. Explicit user opt-in with clear disclosure
2. GDPR-compliant data processing agreement update
3. Privacy Policy update
4. Sign-off from Legal role

---

## 8. Testing Rules

### Unit tests — packages/core
- `LoopDetector`: test threshold, time window, hash collision, reset
- `DeltaProcessor`: test changed lines detection, token savings calculation
- `similarity()`: test edge cases (empty strings, identical strings, completely different)

### Integration tests — apps/extension
- Use `@vscode/test-electron`
- Test: extension activates without error
- Test: loop detected after N repeated diagnostics
- Test: session metrics update correctly
- Test: deactivation cleans up all disposables

### Test naming convention
```typescript
describe('LoopDetector', () => {
  it('returns null when occurrences are below threshold', () => { ... });
  it('returns LoopEvent when threshold is reached within time window', () => { ... });
  it('does not detect loop when occurrences span beyond time window', () => { ... });
});
```

---

## 9. Git Rules

### Branch naming
```
feat/loop-detection-threshold-config
fix/status-bar-dispose-leak
chore/update-vscode-engine-version
docs/add-architecture-diagram
```

### Commit message format
```
feat(extension): add sensitivity configuration for loop threshold

Users can now set sensitivity to low/medium/high in settings,
mapping to 5/3/2 occurrences respectively.
```

### PR checklist
- [ ] TypeScript compiles with no errors (`turbo type-check`)
- [ ] No `console.log` in extension or API code
- [ ] All new subscriptions added to `context.subscriptions`
- [ ] No hardcoded values — constants defined and named
- [ ] Privacy rule respected — no user code in any new API calls
- [ ] Performance budget respected for any new event handlers

---

## 10. The Anti-Patterns List

These patterns are banned. If you see them in a PR, reject it.

```typescript
// ❌ Any type
function process(data: any) { ... }

// ❌ Magic number
if (count > 3) { ... }

// ❌ Swallowed error
try { ... } catch {}

// ❌ Non-null assertion without comment
const doc = editor!.document;

// ❌ console.log in production
console.log('Debug:', data);

// ❌ Mutation of input
function addRecord(records: DiagnosticRecord[], newRecord: DiagnosticRecord) {
  records.push(newRecord);  // mutates input
}

// ❌ Deep nesting
if (a) { if (b) { if (c) { if (d) { ... } } } }

// ❌ Unhandled promise
someAsyncFunction();  // fire and forget with no error handling
```
