//! Environment diagnostics for loopguard-ctx installation and integration.

use std::net::TcpListener;
use std::path::PathBuf;

const GREEN: &str = "\x1b[32m";
const RED: &str = "\x1b[31m";
const BOLD: &str = "\x1b[1m";
const RST: &str = "\x1b[0m";
const DIM: &str = "\x1b[2m";
const WHITE: &str = "\x1b[97m";
const YELLOW: &str = "\x1b[33m";

const VERSION: &str = env!("CARGO_PKG_VERSION");

struct Outcome {
    ok: bool,
    line: String,
}

fn print_check(outcome: &Outcome) {
    let mark = if outcome.ok {
        format!("{GREEN}✓{RST}")
    } else {
        format!("{RED}✗{RST}")
    };
    println!("  {mark}  {}", outcome.line);
}

fn path_in_path_env() -> bool {
    if let Ok(path) = std::env::var("PATH") {
        for dir in std::env::split_paths(&path) {
            if dir.join("loopguard-ctx").is_file() {
                return true;
            }
            if cfg!(windows)
                && (dir.join("loopguard-ctx.exe").is_file() || dir.join("loopguard-ctx.cmd").is_file())
            {
                return true;
            }
        }
    }
    false
}

fn resolve_loopguard_ctx_binary() -> Option<PathBuf> {
    #[cfg(unix)]
    {
        let output = std::process::Command::new("/bin/sh")
            .arg("-c")
            .arg("command -v loopguard-ctx")
            .env("LOOPGUARD_CTX_ACTIVE", "1")
            .output()
            .ok()?;
        if !output.status.success() {
            return None;
        }
        let s = String::from_utf8_lossy(&output.stdout).trim().to_string();
        if s.is_empty() {
            None
        } else {
            Some(PathBuf::from(s))
        }
    }

    #[cfg(windows)]
    {
        let output = std::process::Command::new("where.exe")
            .arg("loopguard-ctx")
            .env("LOOPGUARD_CTX_ACTIVE", "1")
            .output()
            .ok()?;
        if !output.status.success() {
            return None;
        }
        let stdout = String::from_utf8_lossy(&output.stdout);
        let lines: Vec<&str> = stdout
            .lines()
            .map(|l| l.trim())
            .filter(|l| !l.is_empty())
            .collect();
        let exe_line = lines.iter().find(|l| l.ends_with(".exe"));
        let best = exe_line.or(lines.first()).map(|s| s.to_string());
        best.map(PathBuf::from)
    }
}

fn loopguard_ctx_version_from_path() -> Outcome {
    let resolved = resolve_loopguard_ctx_binary();
    let bin = resolved
        .clone()
        .unwrap_or_else(|| std::env::current_exe().unwrap_or_else(|_| "loopguard-ctx".into()));

    let try_run = |cmd: &std::path::Path| -> Result<String, String> {
        let output = std::process::Command::new(cmd)
            .args(["--version"])
            .env("LOOPGUARD_CTX_ACTIVE", "1")
            .output()
            .map_err(|e| e.to_string())?;
        if !output.status.success() {
            return Err(format!(
                "exited with {}",
                output.status.code().unwrap_or(-1)
            ));
        }
        let text = String::from_utf8_lossy(&output.stdout).trim().to_string();
        if text.is_empty() {
            return Err("empty output".to_string());
        }
        Ok(text)
    };

    match try_run(&bin) {
        Ok(text) => Outcome {
            ok: true,
            line: format!("{BOLD}loopguard-ctx version{RST}  {WHITE}{text}{RST}"),
        },
        Err(_first_err) => {
            #[cfg(windows)]
            {
                let candidates = [
                    bin.with_extension("exe"),
                    bin.parent()
                        .unwrap_or(std::path::Path::new("."))
                        .join("node_modules")
                        .join("loopguard-ctx-bin")
                        .join("bin")
                        .join("loopguard-ctx.exe"),
                ];
                for candidate in &candidates {
                    if candidate.is_file() {
                        if let Ok(text) = try_run(candidate) {
                            return Outcome {
                                ok: true,
                                line: format!(
                                    "{BOLD}loopguard-ctx version{RST}  {WHITE}{text}{RST}  {DIM}(via {}){RST}",
                                    candidate.display()
                                ),
                            };
                        }
                    }
                }
            }

            let current_exe_result = std::env::current_exe();
            if let Ok(ref exe) = current_exe_result {
                if exe != &bin {
                    if let Ok(text) = try_run(exe) {
                        return Outcome {
                            ok: true,
                            line: format!("{BOLD}loopguard-ctx version{RST}  {WHITE}{text}{RST}  {DIM}(this binary){RST}"),
                        };
                    }
                }
            }

            Outcome {
                ok: false,
                line: format!(
                    "{BOLD}loopguard-ctx version{RST}  {RED}failed to run `loopguard-ctx --version`: {_first_err}{RST}  {DIM}(resolved: {}){RST}",
                    bin.display()
                ),
            }
        }
    }
}

fn rc_contains_loopguard_ctx(path: &PathBuf) -> bool {
    match std::fs::read_to_string(path) {
        Ok(s) => s.contains("loopguard-ctx"),
        Err(_) => false,
    }
}

fn shell_aliases_outcome() -> Outcome {
    let home = match dirs::home_dir() {
        Some(h) => h,
        None => {
            return Outcome {
                ok: false,
                line: format!(
                    "{BOLD}Shell aliases{RST}  {RED}could not resolve home directory{RST}"
                ),
            };
        }
    };

    let mut parts = Vec::new();

    let zsh = home.join(".zshrc");
    if rc_contains_loopguard_ctx(&zsh) {
        parts.push(format!("{DIM}~/.zshrc{RST}"));
    }
    let bash = home.join(".bashrc");
    if rc_contains_loopguard_ctx(&bash) {
        parts.push(format!("{DIM}~/.bashrc{RST}"));
    }

    #[cfg(windows)]
    {
        let ps_profile = home
            .join("Documents")
            .join("PowerShell")
            .join("Microsoft.PowerShell_profile.ps1");
        let ps_profile_legacy = home
            .join("Documents")
            .join("WindowsPowerShell")
            .join("Microsoft.PowerShell_profile.ps1");
        if rc_contains_loopguard_ctx(&ps_profile) {
            parts.push(format!("{DIM}PowerShell profile{RST}"));
        } else if rc_contains_loopguard_ctx(&ps_profile_legacy) {
            parts.push(format!("{DIM}WindowsPowerShell profile{RST}"));
        }
    }

    if parts.is_empty() {
        let hint = if cfg!(windows) {
            "no \"loopguard-ctx\" in PowerShell profile, ~/.zshrc or ~/.bashrc"
        } else {
            "no \"loopguard-ctx\" in ~/.zshrc or ~/.bashrc"
        };
        Outcome {
            ok: false,
            line: format!("{BOLD}Shell aliases{RST}  {RED}{hint}{RST}"),
        }
    } else {
        Outcome {
            ok: true,
            line: format!(
                "{BOLD}Shell aliases{RST}  {GREEN}loopguard-ctx referenced in {}{RST}",
                parts.join(", ")
            ),
        }
    }
}

struct McpLocation {
    name: &'static str,
    display: &'static str,
    path: PathBuf,
}

fn mcp_config_locations(home: &std::path::Path) -> Vec<McpLocation> {
    let mut locations = vec![
        McpLocation {
            name: "Cursor",
            display: "~/.cursor/mcp.json",
            path: home.join(".cursor").join("mcp.json"),
        },
        McpLocation {
            name: "Claude Code",
            display: "~/.claude.json",
            path: home.join(".claude.json"),
        },
        McpLocation {
            name: "Windsurf",
            display: "~/.codeium/windsurf/mcp_config.json",
            path: home
                .join(".codeium")
                .join("windsurf")
                .join("mcp_config.json"),
        },
        McpLocation {
            name: "Codex",
            display: "~/.codex/config.toml",
            path: home.join(".codex").join("config.toml"),
        },
        McpLocation {
            name: "Gemini CLI",
            display: "~/.gemini/settings/mcp.json",
            path: home.join(".gemini").join("settings").join("mcp.json"),
        },
    ];

    #[cfg(unix)]
    {
        let zed_cfg = home.join(".config").join("zed").join("settings.json");
        locations.push(McpLocation {
            name: "Zed",
            display: "~/.config/zed/settings.json",
            path: zed_cfg,
        });
        let opencode_cfg = home.join(".config").join("opencode").join("opencode.json");
        locations.push(McpLocation {
            name: "OpenCode",
            display: "~/.config/opencode/opencode.json",
            path: opencode_cfg,
        });
    }

    #[cfg(target_os = "macos")]
    {
        let vscode_mcp = home.join("Library/Application Support/Code/User/mcp.json");
        locations.push(McpLocation {
            name: "VS Code / Copilot",
            display: "~/Library/Application Support/Code/User/mcp.json",
            path: vscode_mcp,
        });
    }
    #[cfg(target_os = "linux")]
    {
        let vscode_mcp = home.join(".config/Code/User/mcp.json");
        locations.push(McpLocation {
            name: "VS Code / Copilot",
            display: "~/.config/Code/User/mcp.json",
            path: vscode_mcp,
        });
    }
    #[cfg(target_os = "windows")]
    {
        if let Ok(appdata) = std::env::var("APPDATA") {
            let vscode_mcp = std::path::PathBuf::from(appdata).join("Code/User/mcp.json");
            locations.push(McpLocation {
                name: "VS Code / Copilot",
                display: "%APPDATA%/Code/User/mcp.json",
                path: vscode_mcp,
            });
        }
    }

    locations
}

fn mcp_config_outcome() -> Outcome {
    let home = match dirs::home_dir() {
        Some(h) => h,
        None => {
            return Outcome {
                ok: false,
                line: format!("{BOLD}MCP config{RST}  {RED}could not resolve home directory{RST}"),
            };
        }
    };

    let locations = mcp_config_locations(&home);
    let mut found: Vec<String> = Vec::new();
    let mut exists_no_ref: Vec<String> = Vec::new();

    for loc in &locations {
        match std::fs::read_to_string(&loc.path) {
            Ok(content) if content.contains("loopguard-ctx") => {
                found.push(format!("{} {DIM}({}){RST}", loc.name, loc.display));
            }
            Ok(_) => {
                exists_no_ref.push(loc.name.to_string());
            }
            Err(_) => {}
        }
    }

    if !found.is_empty() {
        Outcome {
            ok: true,
            line: format!(
                "{BOLD}MCP config{RST}  {GREEN}loopguard-ctx found in: {}{RST}",
                found.join(", ")
            ),
        }
    } else if !exists_no_ref.is_empty() {
        Outcome {
            ok: false,
            line: format!(
                "{BOLD}MCP config{RST}  {YELLOW}config exists for {} but does not reference loopguard-ctx{RST}  {DIM}(run: loopguard-ctx init --agent <editor>){RST}",
                exists_no_ref.join(", ")
            ),
        }
    } else {
        Outcome {
            ok: false,
            line: format!(
                "{BOLD}MCP config{RST}  {YELLOW}no MCP config found{RST}  {DIM}(checked: Cursor, Claude, Windsurf, Codex, Gemini, Zed){RST}"
            ),
        }
    }
}

fn port_3333_outcome() -> Outcome {
    match TcpListener::bind("127.0.0.1:3333") {
        Ok(_listener) => Outcome {
            ok: true,
            line: format!("{BOLD}Dashboard port 3333{RST}  {GREEN}available on 127.0.0.1{RST}"),
        },
        Err(e) => Outcome {
            ok: false,
            line: format!("{BOLD}Dashboard port 3333{RST}  {RED}not available: {e}{RST}"),
        },
    }
}

/// Run diagnostic checks and print colored results to stdout.
pub fn run() {
    let mut passed = 0u32;
    let total = 15u32;

    println!("{BOLD}{WHITE}loopguard-ctx doctor{RST}  {DIM}diagnostics{RST}\n");

    // 1) Binary on PATH
    let path_bin = resolve_loopguard_ctx_binary();
    let also_in_path_dirs = path_in_path_env();
    let bin_ok = path_bin.is_some() || also_in_path_dirs;
    if bin_ok {
        passed += 1;
    }
    let bin_line = if let Some(p) = path_bin {
        format!("{BOLD}loopguard-ctx in PATH{RST}  {WHITE}{}{RST}", p.display())
    } else if also_in_path_dirs {
        format!(
            "{BOLD}loopguard-ctx in PATH{RST}  {YELLOW}found via PATH walk (not resolved by `command -v`){RST}"
        )
    } else {
        format!("{BOLD}loopguard-ctx in PATH{RST}  {RED}not found{RST}")
    };
    print_check(&Outcome {
        ok: bin_ok,
        line: bin_line,
    });

    // 2) Version from PATH binary
    let ver = if bin_ok {
        loopguard_ctx_version_from_path()
    } else {
        Outcome {
            ok: false,
            line: format!("{BOLD}loopguard-ctx version{RST}  {RED}skipped (binary not in PATH){RST}"),
        }
    };
    if ver.ok {
        passed += 1;
    }
    print_check(&ver);

    // 3) ~/.loopguard-ctx directory
    let lean_dir = dirs::home_dir().map(|h| h.join(".loopguard-ctx"));
    let dir_outcome = match &lean_dir {
        Some(p) if p.is_dir() => {
            passed += 1;
            Outcome {
                ok: true,
                line: format!(
                    "{BOLD}~/.loopguard-ctx/{RST}  {GREEN}exists{RST}  {DIM}{}{RST}",
                    p.display()
                ),
            }
        }
        Some(p) => Outcome {
            ok: false,
            line: format!(
                "{BOLD}~/.loopguard-ctx/{RST}  {RED}missing or not a directory{RST}  {DIM}{}{RST}",
                p.display()
            ),
        },
        None => Outcome {
            ok: false,
            line: format!("{BOLD}~/.loopguard-ctx/{RST}  {RED}could not resolve home directory{RST}"),
        },
    };
    print_check(&dir_outcome);

    // 4) stats.json + size
    let stats_path = lean_dir.as_ref().map(|d| d.join("stats.json"));
    let stats_outcome = match stats_path.as_ref().and_then(|p| std::fs::metadata(p).ok()) {
        Some(m) if m.is_file() => {
            passed += 1;
            let size = m.len();
            Outcome {
                ok: true,
                line: format!(
                    "{BOLD}stats.json{RST}  {GREEN}exists{RST}  {WHITE}{size} bytes{RST}  {DIM}{}{RST}",
                    stats_path.as_ref().unwrap().display()
                ),
            }
        }
        Some(_m) => Outcome {
            ok: false,
            line: format!(
                "{BOLD}stats.json{RST}  {RED}not a file{RST}  {DIM}{}{RST}",
                stats_path.as_ref().unwrap().display()
            ),
        },
        None => {
            passed += 1;
            Outcome {
                ok: true,
                line: match &stats_path {
                    Some(p) => format!(
                        "{BOLD}stats.json{RST}  {YELLOW}not yet created{RST}  {DIM}(will appear after first use) {}{RST}",
                        p.display()
                    ),
                    None => format!("{BOLD}stats.json{RST}  {RED}could not resolve path{RST}"),
                },
            }
        }
    };
    print_check(&stats_outcome);

    // 5) config.toml (missing is OK)
    let config_path = lean_dir.as_ref().map(|d| d.join("config.toml"));
    let config_outcome = match &config_path {
        Some(p) => match std::fs::metadata(p) {
            Ok(m) if m.is_file() => {
                passed += 1;
                Outcome {
                    ok: true,
                    line: format!(
                        "{BOLD}config.toml{RST}  {GREEN}exists{RST}  {DIM}{}{RST}",
                        p.display()
                    ),
                }
            }
            Ok(_) => Outcome {
                ok: false,
                line: format!(
                    "{BOLD}config.toml{RST}  {RED}exists but is not a regular file{RST}  {DIM}{}{RST}",
                    p.display()
                ),
            },
            Err(_) => {
                passed += 1;
                Outcome {
                    ok: true,
                    line: format!(
                        "{BOLD}config.toml{RST}  {YELLOW}not found, using defaults{RST}  {DIM}(expected at {}){RST}",
                        p.display()
                    ),
                }
            }
        },
        None => Outcome {
            ok: false,
            line: format!("{BOLD}config.toml{RST}  {RED}could not resolve path{RST}"),
        },
    };
    print_check(&config_outcome);

    // 6) Shell aliases
    let aliases = shell_aliases_outcome();
    if aliases.ok {
        passed += 1;
    }
    print_check(&aliases);

    // 7) MCP
    let mcp = mcp_config_outcome();
    if mcp.ok {
        passed += 1;
    }
    print_check(&mcp);

    // 8) Port
    let port = port_3333_outcome();
    if port.ok {
        passed += 1;
    }
    print_check(&port);

    // ── Claude Code enforcement layers ────────────────────────────────
    println!();
    println!("  {BOLD}{WHITE}Claude Code enforcement{RST}  {DIM}(setup --agent=claude){RST}");

    let claude_home = dirs::home_dir().map(|h| h.join(".claude"));

    // 9) Bash rewrite hook
    let rewrite_hook = claude_home.as_ref().map(|d| d.join("hooks").join("loopguard-ctx-rewrite.sh"));
    let rewrite_ok = rewrite_hook.as_ref().is_some_and(|p| p.is_file());
    if rewrite_ok { passed += 1; }
    print_check(&Outcome {
        ok: rewrite_ok,
        line: if rewrite_ok {
            format!("{BOLD}Bash rewrite hook{RST}  {GREEN}installed{RST}  {DIM}~/.claude/hooks/loopguard-ctx-rewrite.sh{RST}")
        } else {
            format!("{BOLD}Bash rewrite hook{RST}  {RED}missing{RST}  {DIM}run: loopguard-ctx setup --agent=claude{RST}")
        },
    });

    // 10) Read/Grep enforcement hook
    let enforce_hook = claude_home.as_ref().map(|d| d.join("hooks").join("loopguard-ctx-enforce.sh"));
    let enforce_ok = enforce_hook.as_ref().is_some_and(|p| p.is_file());
    if enforce_ok { passed += 1; }
    print_check(&Outcome {
        ok: enforce_ok,
        line: if enforce_ok {
            format!("{BOLD}Read/Grep enforce hook{RST}  {GREEN}installed{RST}  {DIM}~/.claude/hooks/loopguard-ctx-enforce.sh{RST}")
        } else {
            format!("{BOLD}Read/Grep enforce hook{RST}  {RED}missing{RST}  {DIM}run: loopguard-ctx setup --agent=claude{RST}")
        },
    });

    // 11) settings.json has Read|Grep matcher
    let settings_path = claude_home.as_ref().map(|d| d.join("settings.json"));
    let settings_content = settings_path.as_ref()
        .and_then(|p| std::fs::read_to_string(p).ok())
        .unwrap_or_default();
    let settings_ok = settings_content.contains("loopguard-ctx-enforce")
        && settings_content.contains("Read|Grep");
    if settings_ok { passed += 1; }
    print_check(&Outcome {
        ok: settings_ok,
        line: if settings_ok {
            format!("{BOLD}settings.json Read|Grep matcher{RST}  {GREEN}configured{RST}  {DIM}~/.claude/settings.json{RST}")
        } else {
            format!("{BOLD}settings.json Read|Grep matcher{RST}  {RED}missing{RST}  {DIM}run: loopguard-ctx setup --agent=claude{RST}")
        },
    });

    // 12) Global ~/.claude/CLAUDE.md
    let global_claude_md = claude_home.as_ref().map(|d| d.join("CLAUDE.md"));
    let global_md_ok = global_claude_md.as_ref()
        .is_some_and(|p| p.is_file() && rc_contains_loopguard_ctx(p));
    if global_md_ok { passed += 1; }
    print_check(&Outcome {
        ok: global_md_ok,
        line: if global_md_ok {
            format!("{BOLD}~/.claude/CLAUDE.md{RST}  {GREEN}installed{RST}  {DIM}global instruction-level enforcement{RST}")
        } else {
            format!("{BOLD}~/.claude/CLAUDE.md{RST}  {RED}missing or incomplete{RST}  {DIM}run: loopguard-ctx setup --agent=claude{RST}")
        },
    });

    // 13) Stop + PostToolUse hooks (summary + periodic)
    let summary_hook = claude_home.as_ref().map(|d| d.join("hooks").join("loopguard-ctx-summary.sh"));
    let periodic_hook = claude_home.as_ref().map(|d| d.join("hooks").join("loopguard-ctx-periodic.sh"));
    let session_hooks_ok = summary_hook.as_ref().is_some_and(|p| p.is_file())
        && periodic_hook.as_ref().is_some_and(|p| p.is_file());
    if session_hooks_ok { passed += 1; }
    print_check(&Outcome {
        ok: session_hooks_ok,
        line: if session_hooks_ok {
            format!("{BOLD}Session hooks (Stop + PostToolUse){RST}  {GREEN}installed{RST}  {DIM}token summary + session restore{RST}")
        } else {
            format!("{BOLD}Session hooks (Stop + PostToolUse){RST}  {RED}missing{RST}  {DIM}run: loopguard-ctx setup --agent=claude{RST}")
        },
    });

    // ── Per-agent rules files ─────────────────────────────────────────
    println!();
    println!("  {BOLD}{WHITE}Agent rules files{RST}  {DIM}(project-local — run doctor from your project root){RST}");

    // 14) Cursor .mdc rule (project-local)
    let cursor_mdc = PathBuf::from(".cursor").join("rules").join("loopguard-ctx.mdc");
    let cursor_mdc_ok = cursor_mdc.is_file();
    if cursor_mdc_ok { passed += 1; }
    print_check(&Outcome {
        ok: cursor_mdc_ok,
        line: if cursor_mdc_ok {
            format!("{BOLD}Cursor .mdc rule{RST}  {GREEN}installed{RST}  {DIM}.cursor/rules/loopguard-ctx.mdc{RST}")
        } else {
            format!("{BOLD}Cursor .mdc rule{RST}  {YELLOW}not found in CWD{RST}  {DIM}run from project root: loopguard-ctx setup --agent=cursor{RST}")
        },
    });

    // 15) Windsurf .windsurfrules (project-local)
    let windsurf_rules = PathBuf::from(".windsurfrules");
    let windsurf_ok = windsurf_rules.is_file()
        && std::fs::read_to_string(&windsurf_rules)
            .unwrap_or_default()
            .contains("loopguard-ctx");
    if windsurf_ok { passed += 1; }
    print_check(&Outcome {
        ok: windsurf_ok,
        line: if windsurf_ok {
            format!("{BOLD}Windsurf .windsurfrules{RST}  {GREEN}installed{RST}  {DIM}.windsurfrules{RST}")
        } else {
            format!("{BOLD}Windsurf .windsurfrules{RST}  {YELLOW}not found in CWD{RST}  {DIM}run from project root: loopguard-ctx setup --agent=windsurf{RST}")
        },
    });

    println!();
    println!("  {BOLD}{WHITE}Summary:{RST}  {GREEN}{passed}{RST}{DIM}/{total}{RST} checks passed");
    if passed < total {
        println!("  {YELLOW}Fix missing Claude Code layers:{RST}  {DIM}loopguard-ctx setup --agent=claude{RST}");
        println!("  {YELLOW}Fix missing agent rules:{RST}  {DIM}run loopguard-ctx setup --agent=<cursor|windsurf> from your project root{RST}");
    }
    println!("  {DIM}This binary: loopguard-ctx {VERSION} (Cargo package version){RST}");
}
