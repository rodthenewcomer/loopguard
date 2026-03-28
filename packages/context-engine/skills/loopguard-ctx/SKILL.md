---
name: loopguard-ctx
description: Context Intelligence Engine with CEP + CCP — 21 MCP tools, 90+ shell patterns, tree-sitter AST for 14 languages, Cognitive Efficiency Protocol (CEP), cross-session memory (CCP), LITM-aware positioning. Compresses LLM context by up to 99%.
metadata: {"openclaw": {"requires": {"bins": ["loopguard-ctx"]}, "install": [{"id": "brew", "kind": "brew", "formula": "loopguard-ctx", "bins": ["loopguard-ctx"], "label": "Install LoopGuard CTX (brew tap yvgude/loopguard-ctx)"}]}}
---

# LoopGuard CTX v2.6.0 — Context Intelligence Engine + CEP + CCP + Persistent Project Graph

LoopGuard CTX is a Rust binary that optimizes LLM context through 22 MCP tools, 90+ shell compression patterns, and tree-sitter AST parsing for 14 languages (TS/JS, Rust, Python, Go, Java, C, C++, Ruby, C#, Kotlin, Swift, PHP). It provides adaptive file reading with per-language entropy thresholds, incremental deltas, intent detection, cross-file deduplication with TF-IDF cosine similarity, task-conditioned relevance scoring, a heuristic attention prediction model, a project intelligence graph, the **Cognitive Efficiency Protocol (CEP)** with output token budgets, the **Context Continuity Protocol (CCP)** for cross-session memory with LITM-aware positioning, and a feedback loop for learning optimal compression parameters.

## When to use loopguard-ctx

Always prefer `loopguard-ctx -c <command>` over running commands directly when:
- The command produces verbose output (build logs, git diffs, dependency trees, test results)
- You are reading files and only need the structure or API surface
- You want to check token savings for the current session

## Shell commands (use instead of raw exec)

```bash
loopguard-ctx -c git status          # Compressed git output
loopguard-ctx -c git diff            # Only meaningful diff lines
loopguard-ctx -c git log --oneline -10
loopguard-ctx -c npm install         # Strips progress bars, noise
loopguard-ctx -c cargo build
loopguard-ctx -c cargo test
loopguard-ctx -c docker ps
loopguard-ctx -c kubectl get pods
loopguard-ctx -c aws ec2 describe-instances
loopguard-ctx -c helm list
loopguard-ctx -c prisma migrate dev
loopguard-ctx -c curl -s <url>       # JSON schema extraction
loopguard-ctx -c ls -la <dir>        # Grouped directory listing
```

Supported: git, npm, pnpm, yarn, bun, deno, cargo, docker, kubectl, helm, gh, pip, ruff, go, eslint, prettier, tsc, aws, psql, mysql, prisma, swift, zig, cmake, ansible, composer, mix, bazel, systemd, terraform, make, maven, dotnet, flutter, poetry, rubocop, playwright, curl, wget, and more.

## File reading (compressed modes)

```bash
loopguard-ctx read <file>                    # Full content with structured header
loopguard-ctx read <file> -m map             # Dependency graph + exports + API (~5-15% tokens)
loopguard-ctx read <file> -m signatures      # Function/class signatures only (~10-20% tokens)
loopguard-ctx read <file> -m aggressive      # Syntax-stripped (~30-50% tokens)
loopguard-ctx read <file> -m entropy         # Shannon entropy filtered (~20-40% tokens)
loopguard-ctx read <file> -m diff            # Only changed lines since last read
```

Use `map` mode when you need to understand what a file does without reading every line.
Use `signatures` mode when you need the API surface of a module (tree-sitter for 14 languages).
Use `full` mode only when you will edit the file.

## AI Tool Integration

```bash
loopguard-ctx init --global          # Install shell aliases
loopguard-ctx init --agent claude    # Claude Code PreToolUse hook
loopguard-ctx init --agent cursor    # Cursor hooks.json
loopguard-ctx init --agent gemini    # Gemini CLI BeforeTool hook
loopguard-ctx init --agent codex     # Codex AGENTS.md
loopguard-ctx init --agent windsurf  # .windsurfrules
loopguard-ctx init --agent cline     # .clinerules
loopguard-ctx init --agent copilot   # VS Code / Copilot .vscode/mcp.json
```

## New in v2.6.0 — Scientific Optimization

MCP tools:
- `ctx_overview(task="fix auth bug")` — multi-resolution project map with task-relevant file grouping
- Adaptive per-language entropy thresholds (Rust, Python, Go, TS, Java, etc.)
- TF-IDF cosine similarity for semantic duplicate detection in `ctx_dedup`
- Feedback loop for learning optimal compression parameters across sessions
- Output token budget guidance in CEP (Mechanical: 50 tok, Standard: 200, Architectural: full)
- Prefix-cache aligned system prompt (stable prefix, variable session state at end)

## Session Continuity (CCP)

```bash
loopguard-ctx sessions list          # List all CCP sessions
loopguard-ctx sessions show          # Show latest session state
loopguard-ctx wrapped                # Weekly savings report card
loopguard-ctx wrapped --month        # Monthly savings report card
loopguard-ctx benchmark run          # Real project benchmark (terminal output)
loopguard-ctx benchmark run --json   # Machine-readable JSON output
loopguard-ctx benchmark report       # Shareable Markdown report
```

MCP tools for CCP:
- `ctx_session status` — show current session state (~400 tokens)
- `ctx_session load` — restore previous session (cross-chat memory)
- `ctx_session task "description"` — set current task
- `ctx_session finding "file:line — summary"` — record key finding
- `ctx_session decision "summary"` — record architectural decision
- `ctx_session save` — force persist session to disk
- `ctx_wrapped` — generate savings report card in chat

## Analytics

```bash
loopguard-ctx gain                   # Visual token savings dashboard
loopguard-ctx dashboard              # Web dashboard at localhost:3333
loopguard-ctx session                # Adoption statistics
loopguard-ctx discover               # Find uncompressed commands in shell history
```

## Tips

- The output suffix `[loopguard-ctx: 5029→197 tok, -96%]` shows original vs compressed token count
- For large outputs, loopguard-ctx automatically truncates while preserving relevant context
- JSON responses from curl/wget are reduced to schema outlines
- Build errors are grouped by type with counts
- Test results show only failures with summary counts
- Cached re-reads cost only ~13 tokens
