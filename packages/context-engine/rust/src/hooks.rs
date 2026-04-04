use std::path::PathBuf;

fn resolve_binary_path() -> String {
    std::env::current_exe()
        .map(|p| p.to_string_lossy().to_string())
        .unwrap_or_else(|_| "loopguard-ctx".to_string())
}

fn resolve_binary_path_for_bash() -> String {
    let path = resolve_binary_path();
    to_bash_compatible_path(&path)
}

pub fn to_bash_compatible_path(path: &str) -> String {
    let path = path.replace('\\', "/");
    if path.len() >= 2 && path.as_bytes()[1] == b':' {
        let drive = (path.as_bytes()[0] as char).to_ascii_lowercase();
        format!("/{drive}{}", &path[2..])
    } else {
        path
    }
}

pub fn install_agent_hook(agent: &str, global: bool) {
    match agent {
        "claude" | "claude-code" => install_claude_hook(global),
        "cursor" => install_cursor_hook(global),
        "gemini" => install_gemini_hook(),
        "codex" => install_codex_hook(),
        "windsurf" => install_windsurf_rules(global),
        "cline" | "roo" => install_cline_rules(global),
        "copilot" => install_copilot_hook(),
        "pi" => install_pi_hook(global),
        _ => {
            eprintln!("Unknown agent: {agent}");
            eprintln!("Supported: claude, cursor, gemini, codex, windsurf, cline, copilot, pi");
            std::process::exit(1);
        }
    }
}

fn install_claude_hook(global: bool) {
    let home = match dirs::home_dir() {
        Some(h) => h,
        None => {
            eprintln!("Cannot resolve home directory");
            return;
        }
    };

    let hooks_dir = home.join(".claude").join("hooks");
    let _ = std::fs::create_dir_all(&hooks_dir);

    let script_path = hooks_dir.join("loopguard-ctx-rewrite.sh");
    let binary = resolve_binary_path_for_bash();
    let script = format!(
        r#"#!/usr/bin/env bash
# loopguard-ctx PreToolUse hook — rewrites bash commands to loopguard-ctx equivalents
set -euo pipefail

LOOPGUARD_CTX_BIN="{binary}"

INPUT=$(cat)
TOOL=$(echo "$INPUT" | grep -o '"tool_name":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ "$TOOL" != "Bash" ] && [ "$TOOL" != "bash" ]; then
  exit 0
fi

CMD=$(echo "$INPUT" | grep -o '"command":"[^"]*"' | head -1 | cut -d'"' -f4)

if echo "$CMD" | grep -qE "^(loopguard-ctx |$LOOPGUARD_CTX_BIN )"; then
  exit 0
fi

REWRITE=""
case "$CMD" in
  git\ *)       REWRITE="$LOOPGUARD_CTX_BIN -c $CMD" ;;
  gh\ *)        REWRITE="$LOOPGUARD_CTX_BIN -c $CMD" ;;
  cargo\ *)     REWRITE="$LOOPGUARD_CTX_BIN -c $CMD" ;;
  npm\ *)       REWRITE="$LOOPGUARD_CTX_BIN -c $CMD" ;;
  pnpm\ *)      REWRITE="$LOOPGUARD_CTX_BIN -c $CMD" ;;
  yarn\ *)      REWRITE="$LOOPGUARD_CTX_BIN -c $CMD" ;;
  docker\ *)    REWRITE="$LOOPGUARD_CTX_BIN -c $CMD" ;;
  kubectl\ *)   REWRITE="$LOOPGUARD_CTX_BIN -c $CMD" ;;
  pip\ *|pip3\ *)  REWRITE="$LOOPGUARD_CTX_BIN -c $CMD" ;;
  ruff\ *)      REWRITE="$LOOPGUARD_CTX_BIN -c $CMD" ;;
  go\ *)        REWRITE="$LOOPGUARD_CTX_BIN -c $CMD" ;;
  curl\ *)      REWRITE="$LOOPGUARD_CTX_BIN -c $CMD" ;;
  grep\ *|rg\ *)  REWRITE="$LOOPGUARD_CTX_BIN -c $CMD" ;;
  find\ *)      REWRITE="$LOOPGUARD_CTX_BIN -c $CMD" ;;
  cat\ *|head\ *|tail\ *)  REWRITE="$LOOPGUARD_CTX_BIN -c $CMD" ;;
  ls\ *|ls)     REWRITE="$LOOPGUARD_CTX_BIN -c $CMD" ;;
  eslint*|prettier*|tsc*)  REWRITE="$LOOPGUARD_CTX_BIN -c $CMD" ;;
  pytest*|ruff\ *|mypy*)   REWRITE="$LOOPGUARD_CTX_BIN -c $CMD" ;;
  aws\ *)       REWRITE="$LOOPGUARD_CTX_BIN -c $CMD" ;;
  helm\ *)      REWRITE="$LOOPGUARD_CTX_BIN -c $CMD" ;;
  *)            exit 0 ;;
esac

if [ -n "$REWRITE" ]; then
  echo "{{\"command\":\"$REWRITE\"}}"
fi
"#
    );

    write_file(&script_path, &script);
    make_executable(&script_path);

    // --- Read/Grep enforcement hook (PreToolUse, exits 2 to block) ---
    let enforce_path = hooks_dir.join("loopguard-ctx-enforce.sh");
    let enforce_script = r#"#!/usr/bin/env bash
# loopguard-ctx Read/Grep enforcement — blocks built-in Read and Grep, redirects to MCP tools
# Exits 2 to cancel the tool call and surface the error to the model.
[ "${LOOPGUARD_BYPASS:-0}" = "1" ] && exit 0

INPUT=$(cat)
TOOL=$(echo "$INPUT" | grep -o '"tool_name":"[^"]*"' | head -1 | cut -d'"' -f4)

case "$TOOL" in
  Read|read)
    echo "Use ctx_read instead of Read. Example: ctx_read(path='/path/to/file')" >&2
    echo "ctx_read has session caching — re-reads cost ~13 tokens instead of full file." >&2
    exit 2
    ;;
  Grep|grep)
    echo "Use ctx_search instead of Grep. Example: ctx_search(pattern='fn main', path='src/')" >&2
    echo "ctx_search returns compact, token-efficient results." >&2
    exit 2
    ;;
  *)
    exit 0
    ;;
esac
"#;
    write_file(&enforce_path, enforce_script);
    make_executable(&enforce_path);

    let settings_path = home.join(".claude").join("settings.json");
    let settings_content = if settings_path.exists() {
        std::fs::read_to_string(&settings_path).unwrap_or_default()
    } else {
        String::new()
    };

    // --- session-start hook (UserPromptSubmit) ---
    // Fires on every user prompt. Injects the mandatory session protocol on the
    // first prompt only, then injects a ctx_metrics reminder every 10 prompts.
    let session_start_path = hooks_dir.join("loopguard-ctx-session-start.sh");
    let session_start_script = 
        r#"#!/usr/bin/env bash
# LoopGuard UserPromptSubmit hook
# - First prompt: inject session restore + proactive tools protocol
# - Every 10 prompts: inject ctx_metrics + ctx_compress reminder

LOOPGUARD_DIR="${{HOME}}/.loopguard-ctx"
mkdir -p "$LOOPGUARD_DIR"

START_FLAG="$LOOPGUARD_DIR/.session-start-injected"
COUNTER_FILE="$LOOPGUARD_DIR/.session-prompt-count"
METRICS_INTERVAL=10

count=$(cat "$COUNTER_FILE" 2>/dev/null || echo 0)
count=$((count + 1))
echo "$count" > "$COUNTER_FILE"

if [ ! -f "$START_FLAG" ]; then
  touch "$START_FLAG"
  # Surface last session task for a concrete restore hint
  SESSION_FILE=$(ls -t "$LOOPGUARD_DIR/sessions/"*.json 2>/dev/null | head -1)
  LAST_TASK=""
  if [ -n "$SESSION_FILE" ]; then
    LAST_TASK=$(python3 -c "
import json,sys
try:
  d=json.load(open(sys.argv[1]))
  t=d.get(chr(116)+chr(97)+chr(115)+chr(107),{})
  desc=(t.get(chr(100)+chr(101)+chr(115)+chr(99)+chr(114)+chr(105)+chr(112)+chr(116)+chr(105)+chr(111)+chr(110))or chr(32)) if isinstance(t,dict) else chr(32)
  files=len(d.get(chr(102)+chr(105)+chr(108)+chr(101)+chr(115),[]))
  desc=desc.strip()[:72]
  if desc and desc != chr(32): print((chr(76)+chr(97)+chr(115)+chr(116)+chr(32)+chr(116)+chr(97)+chr(115)+chr(107)+chr(58)+chr(32))+desc+((" · "+str(files)+" files") if files else ""))
except: pass
" "$SESSION_FILE" 2>/dev/null || true)
  fi
  echo "[LOOPGUARD SESSION PROTOCOL — run these now, before anything else]"
  [ -n "$LAST_TASK" ] && echo "  $LAST_TASK"
  echo "1. ctx_session load               — restore previous session state"
  echo "2. ctx_forecast(task)             — estimate token cost before starting"
  echo "3. ctx_predict(task)              — predict relevant files before reading"
  echo "4. ctx_overview(task)             — get task-relevant project map"
  echo "5. At end: ctx_wrapped(\"session\") — show tokens saved + dollars avoided"
  echo ""
  echo "After fixing a loop: ctx_memory(action=\"record\", ...) — store the fix pattern"
  echo "Do NOT skip 1-4. They are mandatory, not optional."
  exit 0
fi

if (( count % METRICS_INTERVAL == 0 )); then
  echo "[LOOPGUARD CHECKPOINT — prompt ${{count}}]"
  echo "Run ctx_metrics now to verify token savings."
  echo "If context is growing large, also run ctx_compress to checkpoint."
fi
"#;
    write_file(&session_start_path, session_start_script);
    make_executable(&session_start_path);

    // --- summary hook (Stop) ---
    // Clears all session flags and counter so the next session starts fresh.
    let summary_path = hooks_dir.join("loopguard-ctx-summary.sh");
    let summary_script = format!(
        r#"#!/usr/bin/env bash
# LoopGuard end-of-session summary — fires when Claude Code session ends
[ "${{LOOPGUARD_BYPASS:-0}}" = "1" ] && exit 0
command -v "{binary}" &>/dev/null || exit 0
# Clear all session flags and counter so next session starts fresh
rm -f "${{HOME}}/.loopguard-ctx/.session-restored" 2>/dev/null || true
rm -f "${{HOME}}/.loopguard-ctx/.session-start-injected" 2>/dev/null || true
rm -f "${{HOME}}/.loopguard-ctx/.session-prompt-count" 2>/dev/null || true
"{binary}" notify 2>/dev/null || true
"{binary}" sync &>/dev/null &
"#
    );
    write_file(&summary_path, &summary_script);
    make_executable(&summary_path);

    // --- periodic hook (PostToolUse) ---
    // First call of each session: show session restore hint + token savings.
    // Subsequent calls: show token savings every 15 minutes.
    let periodic_path = hooks_dir.join("loopguard-ctx-periodic.sh");
    let periodic_script = format!(
        r#"#!/usr/bin/env bash
# LoopGuard PostToolUse hook — session restore hint on first call + periodic savings summary
[ "${{LOOPGUARD_BYPASS:-0}}" = "1" ] && exit 0
command -v "{binary}" &>/dev/null || exit 0

DIR="${{HOME}}/.loopguard-ctx"
RESTORED="$DIR/.session-restored"
STAMP="$DIR/.last-notify"
INTERVAL=900

# ── First call of session: show restore hint ─────────────────────────────────
if [ ! -f "$RESTORED" ]; then
    touch "$RESTORED"
    SESSION=$("{binary}" sessions show 2>/dev/null || true)
    if [ -n "$SESSION" ] && ! echo "$SESSION" | grep -q "not found\|No session"; then
        printf '\n  \033[1m\033[35m◆ LoopGuard\033[0m  \033[2mPrevious session found — run \033[0m\033[36mctx_session load\033[0m\033[2m to restore context\033[0m\n'
        echo "$SESSION" | head -8 | sed 's/^/  /'
        printf '\n'
    fi
    "{binary}" notify 2>/dev/null || true
    date +%s > "$STAMP"
    exit 0
fi

# ── Subsequent calls: periodic summary every 15 min ──────────────────────────
if [ -f "$STAMP" ]; then
    LAST=$(cat "$STAMP" 2>/dev/null || echo 0)
    NOW=$(date +%s)
    if [ $((NOW - LAST)) -lt $INTERVAL ]; then
        exit 0
    fi
fi

date +%s > "$STAMP"
"{binary}" notify 2>/dev/null || true
"#
    );
    write_file(&periodic_path, &periodic_script);
    make_executable(&periodic_path);

    // Build the full desired hooks JSON
    // PreToolUse layer 1: Bash rewrite (exit 0 = allow with rewritten command)
    // PreToolUse layer 2: Read/Grep enforcement (exit 2 = block + show error)
    // PostToolUse: periodic savings summary (every 15 min)
    // Stop: end-of-session savings summary
    let full_hooks = serde_json::json!({
        "PreToolUse": [
            {
                "matcher": "Bash|bash",
                "hooks": [{
                    "type": "command",
                    "command": script_path.to_string_lossy()
                }]
            },
            {
                "matcher": "Read|Grep",
                "hooks": [{
                    "type": "command",
                    "command": enforce_path.to_string_lossy()
                }]
            }
        ],
        "PostToolUse": [{
            "matcher": ".*",
            "hooks": [{
                "type": "command",
                "command": periodic_path.to_string_lossy()
            }]
        }],
        "Stop": [{
            "matcher": ".*",
            "hooks": [{
                "type": "command",
                "command": summary_path.to_string_lossy()
            }]
        }],
        "UserPromptSubmit": [{
            "matcher": ".*",
            "hooks": [{
                "type": "command",
                "command": session_start_path.to_string_lossy()
            }]
        }]
    });

    let needs_update = !settings_content.contains("loopguard-ctx-summary")
        || !settings_content.contains("loopguard-ctx-periodic")
        || !settings_content.contains("loopguard-ctx-rewrite")
        || !settings_content.contains("loopguard-ctx-enforce")
        || !settings_content.contains("loopguard-ctx-session-start");

    if !needs_update {
        println!("Claude Code hooks already fully configured.");
    } else {
        let hook_entry = serde_json::json!({ "hooks": full_hooks });

        if settings_content.is_empty() {
            write_file(
                &settings_path,
                &serde_json::to_string_pretty(&hook_entry).unwrap(),
            );
        } else if let Ok(mut existing) =
            serde_json::from_str::<serde_json::Value>(&settings_content)
        {
            if let Some(obj) = existing.as_object_mut() {
                obj.insert("hooks".to_string(), hook_entry["hooks"].clone());
                write_file(
                    &settings_path,
                    &serde_json::to_string_pretty(&existing).unwrap(),
                );
            }
        }
        println!("Installed Claude Code hooks (Bash rewrite + Read/Grep enforcement + periodic summary + end-of-session summary)");
    }

    // --- Global ~/.claude/CLAUDE.md (layer 4: instruction-level enforcement) ---
    let global_claude_md = home.join(".claude").join("CLAUDE.md");
    let global_claude_dir = home.join(".claude");
    let _ = std::fs::create_dir_all(&global_claude_dir);

    let global_md_content = include_str!("templates/CLAUDE.md");
    let needs_global_md = if global_claude_md.exists() {
        let md = std::fs::read_to_string(&global_claude_md).unwrap_or_default();
        // Re-install if missing loopguard-ctx OR if the mandatory session protocol
        // section is absent (catches users with old installs that predate the protocol).
        !md.contains("loopguard-ctx") || !md.contains("MANDATORY SESSION PROTOCOL")
    } else {
        true
    };

    if needs_global_md {
        write_file(&global_claude_md, global_md_content);
        println!("Installed global ~/.claude/CLAUDE.md (instruction-level enforcement).");
    } else {
        println!("~/.claude/CLAUDE.md already configured.");
    }

    // --- Project-local CLAUDE.md (unless global flag) ---
    if !global {
        let claude_md = PathBuf::from("CLAUDE.md");
        if !claude_md.exists()
            || !std::fs::read_to_string(&claude_md)
                .unwrap_or_default()
                .contains("loopguard-ctx")
        {
            let content = include_str!("templates/CLAUDE.md");
            write_file(&claude_md, content);
            println!("Created CLAUDE.md in current project directory.");
        } else {
            println!("CLAUDE.md already configured.");
        }
    }
}

fn install_cursor_hook(global: bool) {
    let home = match dirs::home_dir() {
        Some(h) => h,
        None => {
            eprintln!("Cannot resolve home directory");
            return;
        }
    };

    let hooks_dir = home.join(".cursor").join("hooks");
    let _ = std::fs::create_dir_all(&hooks_dir);

    let script_path = hooks_dir.join("loopguard-ctx-rewrite.sh");
    let binary = resolve_binary_path_for_bash();
    let script = format!(
        r#"#!/usr/bin/env bash
# loopguard-ctx Cursor hook — rewrites shell commands
set -euo pipefail
LOOPGUARD_CTX_BIN="{binary}"
INPUT=$(cat)
CMD=$(echo "$INPUT" | grep -o '"command":"[^"]*"' | head -1 | cut -d'"' -f4 2>/dev/null || echo "")
if [ -z "$CMD" ] || echo "$CMD" | grep -qE "^(loopguard-ctx |$LOOPGUARD_CTX_BIN )"; then exit 0; fi
case "$CMD" in
  git\ *|gh\ *|cargo\ *|npm\ *|pnpm\ *|docker\ *|kubectl\ *|pip\ *|ruff\ *|go\ *|curl\ *|grep\ *|rg\ *|find\ *|ls\ *|ls|cat\ *|aws\ *|helm\ *)
    echo "{{\"command\":\"$LOOPGUARD_CTX_BIN -c $CMD\"}}" ;;
  *) exit 0 ;;
esac
"#
    );

    write_file(&script_path, &script);
    make_executable(&script_path);

    // --- periodic hook (postToolUse) --- notify + sync every 15 min
    let periodic_path = hooks_dir.join("loopguard-ctx-cursor-periodic.sh");
    let periodic_script = format!(
        r#"#!/usr/bin/env bash
# loopguard-ctx Cursor postToolUse hook — periodic notify + sync
[ "${{LOOPGUARD_BYPASS:-0}}" = "1" ] && exit 0
command -v "{binary}" &>/dev/null || exit 0
STAMP="${{HOME}}/.loopguard-ctx/.cursor-last-sync"
INTERVAL=900
if [ -f "$STAMP" ]; then
    LAST=$(cat "$STAMP" 2>/dev/null || echo 0)
    NOW=$(date +%s)
    [ $((NOW - LAST)) -lt $INTERVAL ] && exit 0
fi
date +%s > "$STAMP"
"{binary}" notify 2>/dev/null || true
"{binary}" sync &>/dev/null &
"#
    );
    write_file(&periodic_path, &periodic_script);
    make_executable(&periodic_path);

    let hooks_json = home.join(".cursor").join("hooks.json");
    let hook_config = serde_json::json!({
        "hooks": [
            {
                "event": "preToolUse",
                "matcher": { "tool": "terminal_command" },
                "command": script_path.to_string_lossy()
            },
            {
                "event": "postToolUse",
                "matcher": { "tool": ".*" },
                "command": periodic_path.to_string_lossy()
            }
        ]
    });

    let content = if hooks_json.exists() {
        std::fs::read_to_string(&hooks_json).unwrap_or_default()
    } else {
        String::new()
    };

    if content.contains("loopguard-ctx-rewrite") && content.contains("loopguard-ctx-cursor-periodic") {
        println!("Cursor hook already configured.");
    } else {
        write_file(
            &hooks_json,
            &serde_json::to_string_pretty(&hook_config).unwrap(),
        );
        println!("Installed Cursor hook at {}", hooks_json.display());
    }

    if !global {
        let rules_dir = PathBuf::from(".cursor").join("rules");
        let _ = std::fs::create_dir_all(&rules_dir);
        let rule_path = rules_dir.join("loopguard-ctx.mdc");
        if !rule_path.exists() {
            let rule_content = include_str!("templates/loopguard-ctx.mdc");
            write_file(&rule_path, rule_content);
            println!("Created .cursor/rules/loopguard-ctx.mdc in current project.");
        } else {
            println!("Cursor rule already exists.");
        }
    } else {
        println!("Global mode: skipping project-local .cursor/rules/ (use without --global in a project).");
    }

    println!("Restart Cursor to activate.");
}

fn install_gemini_hook() {
    let home = match dirs::home_dir() {
        Some(h) => h,
        None => {
            eprintln!("Cannot resolve home directory");
            return;
        }
    };

    let hooks_dir = home.join(".gemini").join("hooks");
    let _ = std::fs::create_dir_all(&hooks_dir);

    let script_path = hooks_dir.join("loopguard-ctx-hook-gemini.sh");
    let binary = resolve_binary_path_for_bash();
    let script = format!(
        r#"#!/usr/bin/env bash
# loopguard-ctx Gemini CLI BeforeTool hook
set -euo pipefail
LOOPGUARD_CTX_BIN="{binary}"
INPUT=$(cat)
CMD=$(echo "$INPUT" | grep -o '"command":"[^"]*"' | head -1 | cut -d'"' -f4 2>/dev/null || echo "")
if [ -z "$CMD" ] || echo "$CMD" | grep -qE "^(loopguard-ctx |$LOOPGUARD_CTX_BIN )"; then exit 0; fi
case "$CMD" in
  git\ *|gh\ *|cargo\ *|npm\ *|pnpm\ *|docker\ *|kubectl\ *|pip\ *|ruff\ *|go\ *|curl\ *|grep\ *|rg\ *|find\ *|ls\ *|ls|cat\ *|aws\ *|helm\ *)
    echo "{{\"command\":\"$LOOPGUARD_CTX_BIN -c $CMD\"}}" ;;
  *) exit 0 ;;
esac
"#
    );

    write_file(&script_path, &script);
    make_executable(&script_path);

    let settings_path = home.join(".gemini").join("settings.json");
    let settings_content = if settings_path.exists() {
        std::fs::read_to_string(&settings_path).unwrap_or_default()
    } else {
        String::new()
    };

    if settings_content.contains("loopguard-ctx") {
        println!("Gemini CLI hook already configured.");
    } else {
        let hook_config = serde_json::json!({
            "hooks": {
                "BeforeTool": [{
                    "command": script_path.to_string_lossy()
                }]
            }
        });

        if settings_content.is_empty() {
            write_file(
                &settings_path,
                &serde_json::to_string_pretty(&hook_config).unwrap(),
            );
        } else if let Ok(mut existing) =
            serde_json::from_str::<serde_json::Value>(&settings_content)
        {
            if let Some(obj) = existing.as_object_mut() {
                obj.insert("hooks".to_string(), hook_config["hooks"].clone());
                write_file(
                    &settings_path,
                    &serde_json::to_string_pretty(&existing).unwrap(),
                );
            }
        }
        println!("Installed Gemini CLI hook at {}", script_path.display());
    }
}

fn install_codex_hook() {
    let home = match dirs::home_dir() {
        Some(h) => h,
        None => {
            eprintln!("Cannot resolve home directory");
            return;
        }
    };

    let codex_dir = home.join(".codex");
    let _ = std::fs::create_dir_all(&codex_dir);

    let agents_path = codex_dir.join("AGENTS.md");
    let agents_content = "# Global Agent Instructions\n\n@LOOPGUARD-CTX.md\n";

    let loopguard_ctx_md = codex_dir.join("LOOPGUARD-CTX.md");
    let binary = resolve_binary_path();
    let loopguard_ctx_content = format!(
        r#"# LoopGuard CTX — Shell Compression

Prefix all shell commands with `{binary} -c` for compressed output:

```bash
{binary} -c git status    # instead of: git status
{binary} -c cargo test    # instead of: cargo test
{binary} -c ls src/       # instead of: ls src/
```

This keeps terminal output smaller and easier to paste into an AI tool. Works with: git, cargo, npm, pnpm, docker, kubectl, pip, ruff, go, curl, grep, find, ls, aws, helm, and more.
"#
    );

    if agents_path.exists() {
        let content = std::fs::read_to_string(&agents_path).unwrap_or_default();
        if content.contains("loopguard-ctx")
            || content.contains("LOOPGUARD-CTX")
        {
            println!("Codex AGENTS.md already configured.");
            return;
        }
    }

    write_file(&agents_path, agents_content);
    write_file(&loopguard_ctx_md, &loopguard_ctx_content);
    println!("Installed Codex instructions at {}", codex_dir.display());
}

fn install_windsurf_rules(global: bool) {
    if global {
        println!("Global mode: skipping project-local .windsurfrules (use without --global in a project).");
        return;
    }

    let rules_path = PathBuf::from(".windsurfrules");
    if rules_path.exists() {
        let content = std::fs::read_to_string(&rules_path).unwrap_or_default();
        if content.contains("loopguard-ctx") {
            println!(".windsurfrules already configured.");
            return;
        }
    }

    let rules = include_str!("templates/windsurfrules.txt");
    write_file(&rules_path, rules);
    println!("Installed .windsurfrules in current project.");
}

fn install_cline_rules(global: bool) {
    if global {
        println!(
            "Global mode: skipping project-local .clinerules (use without --global in a project)."
        );
        return;
    }

    let rules_path = PathBuf::from(".clinerules");
    if rules_path.exists() {
        let content = std::fs::read_to_string(&rules_path).unwrap_or_default();
        if content.contains("loopguard-ctx") {
            println!(".clinerules already configured.");
            return;
        }
    }

    let binary = resolve_binary_path();
    let rules = format!(
        r#"# loopguard-ctx Shell Optimization
# Prefix all shell commands with `{binary} -c` for 60-90% token savings.

When running shell commands, always prefix them with `{binary} -c` to compress output. For example:
- `{binary} -c git status` instead of `git status`
- `{binary} -c cargo test` instead of `cargo test`
- `{binary} -c ls src/` instead of `ls src/`

Supported commands: git, cargo, npm, pnpm, docker, kubectl, pip, ruff, go, curl, grep, find, ls, aws, helm, and 90+ more.
"#
    );

    write_file(&rules_path, &rules);
    println!("Installed .clinerules in current project.");
}

fn install_pi_hook(global: bool) {
    let has_pi = std::process::Command::new("pi")
        .arg("--version")
        .output()
        .is_ok();

    if !has_pi {
        println!("Pi Coding Agent not found in PATH.");
        println!("Install Pi first: npm install -g @mariozechner/pi-coding-agent");
        println!();
    }

    println!("Installing pi-loopguard-ctx Pi Package...");
    println!();

    let install_result = std::process::Command::new("pi")
        .args(["install", "npm:pi-loopguard-ctx"])
        .status();

    match install_result {
        Ok(status) if status.success() => {
            println!("Installed pi-loopguard-ctx Pi Package.");
        }
        _ => {
            println!("Could not auto-install pi-loopguard-ctx. Install manually:");
            println!("  pi install npm:pi-loopguard-ctx");
            println!();
        }
    }

    if !global {
        let agents_md = PathBuf::from("AGENTS.md");
        if !agents_md.exists()
            || !std::fs::read_to_string(&agents_md)
                .unwrap_or_default()
                .contains("loopguard-ctx")
        {
            let content = include_str!("templates/PI_AGENTS.md");
            write_file(&agents_md, content);
            println!("Created AGENTS.md in current project directory.");
        } else {
            println!("AGENTS.md already contains loopguard-ctx configuration.");
        }
    } else {
        println!(
            "Global mode: skipping project-local AGENTS.md (use without --global in a project)."
        );
    }

    println!();
    println!(
        "Setup complete. All Pi tools (bash, read, grep, find, ls) now route through loopguard-ctx."
    );
    println!("Use /loopguard-ctx in Pi to verify the binary path.");
}

fn install_copilot_hook() {
    let binary = resolve_binary_path();

    let vscode_dir = PathBuf::from(".vscode");
    let _ = std::fs::create_dir_all(&vscode_dir);

    let mcp_path = vscode_dir.join("mcp.json");
    if mcp_path.exists() {
        let content = std::fs::read_to_string(&mcp_path).unwrap_or_default();
        if content.contains("loopguard-ctx") {
            println!("VS Code / Copilot MCP already configured in .vscode/mcp.json");
            return;
        }

        if let Ok(mut json) = serde_json::from_str::<serde_json::Value>(&content) {
            if let Some(obj) = json.as_object_mut() {
                let servers = obj
                    .entry("servers")
                    .or_insert_with(|| serde_json::json!({}));
                if let Some(servers_obj) = servers.as_object_mut() {
                    servers_obj.insert(
                        "loopguard-ctx".to_string(),
                        serde_json::json!({ "command": binary, "args": [] }),
                    );
                }
                write_file(
                    &mcp_path,
                    &serde_json::to_string_pretty(&json).unwrap_or_default(),
                );
                println!("Added loopguard-ctx to existing .vscode/mcp.json");
                return;
            }
        }
    }

    let config = serde_json::json!({
        "servers": {
            "loopguard-ctx": {
                "command": binary,
                "args": []
            }
        }
    });

    write_file(
        &mcp_path,
        &serde_json::to_string_pretty(&config).unwrap_or_default(),
    );
    println!(
        "Created .vscode/mcp.json with loopguard-ctx MCP server.\n\
         GitHub Copilot will now have access to ctx_read, ctx_shell, ctx_search, ctx_tree.\n\
         Restart VS Code to activate."
    );
}

fn write_file(path: &PathBuf, content: &str) {
    if let Err(e) = std::fs::write(path, content) {
        eprintln!("Error writing {}: {e}", path.display());
    }
}

#[cfg(unix)]
fn make_executable(path: &PathBuf) {
    use std::os::unix::fs::PermissionsExt;
    let _ = std::fs::set_permissions(path, std::fs::Permissions::from_mode(0o755));
}

#[cfg(not(unix))]
fn make_executable(_path: &PathBuf) {}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn bash_path_unix_unchanged() {
        assert_eq!(
            to_bash_compatible_path("/usr/local/bin/loopguard-ctx"),
            "/usr/local/bin/loopguard-ctx"
        );
    }

    #[test]
    fn bash_path_home_unchanged() {
        assert_eq!(
            to_bash_compatible_path("/home/user/.cargo/bin/loopguard-ctx"),
            "/home/user/.cargo/bin/loopguard-ctx"
        );
    }

    #[test]
    fn bash_path_windows_drive_converted() {
        assert_eq!(
            to_bash_compatible_path("C:\\Users\\Fraser\\bin\\loopguard-ctx.exe"),
            "/c/Users/Fraser/bin/loopguard-ctx.exe"
        );
    }

    #[test]
    fn bash_path_windows_lowercase_drive() {
        assert_eq!(
            to_bash_compatible_path("D:\\tools\\loopguard-ctx.exe"),
            "/d/tools/loopguard-ctx.exe"
        );
    }

    #[test]
    fn bash_path_windows_forward_slashes() {
        assert_eq!(
            to_bash_compatible_path("C:/Users/Fraser/bin/loopguard-ctx.exe"),
            "/c/Users/Fraser/bin/loopguard-ctx.exe"
        );
    }

    #[test]
    fn bash_path_bare_name_unchanged() {
        assert_eq!(to_bash_compatible_path("loopguard-ctx"), "loopguard-ctx");
    }
}
