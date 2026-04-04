use anyhow::Result;
use loopguard_ctx::{cli, core, dashboard, doctor, setup, shell, sync, tools};

fn main() {
    let args: Vec<String> = std::env::args().collect();

    if args.len() > 1 {
        let rest = args[2..].to_vec();

        match args[1].as_str() {
            "-c" | "exec" => {
                let command = shell_join(&args[2..]);
                if std::env::var("LOOPGUARD_CTX_ACTIVE").is_ok() {
                    passthrough(&command);
                }
                let code = shell::exec(&command);
                std::process::exit(code);
            }
            "shell" | "--shell" => {
                shell::interactive();
                return;
            }
            "notify" => {
                if let Some(line) = core::stats::format_notify_line() {
                    println!("{line}");
                }
                if let Some(warn) = core::stats::stale_hooks_warning() {
                    eprintln!("{warn}");
                }
                return;
            }
            "gain" => {
                if rest.iter().any(|a| a == "--live" || a == "--watch") {
                    core::stats::gain_live();
                    return;
                }
                let output = if rest.iter().any(|a| a == "--graph") {
                    core::stats::format_gain_graph()
                } else if rest.iter().any(|a| a == "--daily") {
                    core::stats::format_gain_daily()
                } else if rest.iter().any(|a| a == "--json") {
                    core::stats::format_gain_json()
                } else {
                    core::stats::format_gain()
                };
                println!("{output}");
                return;
            }
            "cep" => {
                println!("{}", core::stats::format_cep_report());
                return;
            }
            "dashboard" => {
                let port = rest
                    .first()
                    .and_then(|p| p.strip_prefix("--port=").or_else(|| p.strip_prefix("-p=")))
                    .and_then(|p| p.parse().ok());
                run_async(dashboard::start(port));
                return;
            }
            "init" => {
                cli::cmd_init(&rest);
                return;
            }
            "setup" => {
                setup::run_setup_for_agents(&rest);
                return;
            }
            "read" => {
                cli::cmd_read(&rest);
                return;
            }
            "diff" => {
                cli::cmd_diff(&rest);
                return;
            }
            "grep" => {
                cli::cmd_grep(&rest);
                return;
            }
            "find" => {
                cli::cmd_find(&rest);
                return;
            }
            "ls" => {
                cli::cmd_ls(&rest);
                return;
            }
            "deps" => {
                cli::cmd_deps(&rest);
                return;
            }
            "discover" => {
                cli::cmd_discover(&rest);
                return;
            }
            "session" => {
                cli::cmd_session();
                return;
            }
            "wrapped" => {
                cli::cmd_wrapped(&rest);
                return;
            }
            "sessions" => {
                cli::cmd_sessions(&rest);
                return;
            }
            "benchmark" => {
                cli::cmd_benchmark(&rest);
                return;
            }
            "config" => {
                cli::cmd_config(&rest);
                return;
            }
            "tee" => {
                cli::cmd_tee(&rest);
                return;
            }
            "slow-log" => {
                cli::cmd_slow_log(&rest);
                return;
            }
            "update" | "--self-update" => {
                core::updater::run(&rest);
                return;
            }
            "sync" => {
                sync::run();
                return;
            }
            "doctor" => {
                doctor::run();
                return;
            }
            "--version" | "-V" => {
                println!("loopguard-ctx 2.7.0");
                return;
            }
            "--help" | "-h" => {
                print_help();
                return;
            }
            "hint" => {
                let error_text = rest.join(" ");
                let crp_mode = tools::CrpMode::from_env();
                println!("{}", tools::ctx_loop_hint::handle(&error_text, crp_mode));
                return;
            }
            "forecast" => {
                let task = rest.iter().filter(|a| !a.starts_with("--")).cloned().collect::<Vec<_>>().join(" ");
                let files: Vec<String> = vec![];
                println!("{}", tools::ctx_forecast::handle(&task, &files, None));
                return;
            }
            "predict" => {
                let task = rest.iter().filter(|a| !a.starts_with("--")).cloned().collect::<Vec<_>>().join(" ");
                let path = rest.iter().find(|a| a.starts_with("--path=")).map(|a| a[7..].to_string()).unwrap_or_else(|| ".".to_string());
                let limit = rest.iter().find(|a| a.starts_with("--limit=")).and_then(|a| a[8..].parse::<usize>().ok()).unwrap_or(10);
                println!("{}", tools::ctx_predict::handle(&task, &path, limit, &[]));
                return;
            }
            "memory" => {
                let action = rest.first().map(|s| s.as_str()).unwrap_or("list").to_string();
                let mut map = std::collections::HashMap::<String, String>::new();
                map.insert("action".to_string(), action.clone());
                if action == "query" || action == "record" {
                    let text = rest[1..].iter().filter(|a| !a.starts_with("--")).cloned().collect::<Vec<_>>().join(" ");
                    if !text.is_empty() {
                        map.insert("error_text".to_string(), text);
                    }
                    for arg in &rest {
                        if let Some(v) = arg.strip_prefix("--fix-file=") {
                            map.insert("fix_file".to_string(), v.to_string());
                        }
                        if let Some(v) = arg.strip_prefix("--fix-desc=") {
                            map.insert("fix_description".to_string(), v.to_string());
                        }
                    }
                }
                println!("{}", tools::ctx_memory::handle(&action, &map));
                return;
            }
            "mcp" => {
                // fall through to MCP server startup below
            }
            _ => {
                eprintln!("loopguard-ctx: unknown command '{}'\n", args[1]);
                print_help();
                std::process::exit(1);
            }
        }
    }

    if let Err(e) = run_mcp_server() {
        eprintln!("loopguard-ctx: {e}");
        std::process::exit(1);
    }
}

fn passthrough(command: &str) -> ! {
    let (shell, flag) = shell::shell_and_flag();
    let status = std::process::Command::new(&shell)
        .arg(&flag)
        .arg(command)
        .status()
        .map(|s| s.code().unwrap_or(1))
        .unwrap_or(127);
    std::process::exit(status);
}

fn run_async<F: std::future::Future>(future: F) -> F::Output {
    tokio::runtime::Runtime::new()
        .expect("failed to create async runtime")
        .block_on(future)
}

fn run_mcp_server() -> Result<()> {
    use rmcp::ServiceExt;
    use tracing_subscriber::EnvFilter;

    let rt = tokio::runtime::Runtime::new()?;
    rt.block_on(async {
        tracing_subscriber::fmt()
            .with_env_filter(EnvFilter::from_default_env())
            .with_writer(std::io::stderr)
            .init();

        tracing::info!("loopguard-ctx v{} MCP server starting", env!("CARGO_PKG_VERSION"));

        let server = tools::create_server();
        let transport = rmcp::transport::io::stdio();
        let service = server.serve(transport).await?;
        service.waiting().await?;

        Ok(())
    })
}

fn shell_join(args: &[String]) -> String {
    args.iter()
        .map(|a| shell_quote(a))
        .collect::<Vec<_>>()
        .join(" ")
}

fn shell_quote(s: &str) -> String {
    if s.is_empty() {
        return "''".to_string();
    }
    if s.bytes()
        .all(|b| b.is_ascii_alphanumeric() || b"-_./=:@,+%^".contains(&b))
    {
        return s.to_string();
    }
    format!("'{}'", s.replace('\'', "'\\''"))
}

fn print_help() {
    println!(
        "loopguard-ctx 2.7.0 — Local helper for focused reads and smaller shell output

90+ shell patterns | 21 MCP tools | optional session restore

USAGE:
    loopguard-ctx                       Start MCP server (stdio)
    loopguard-ctx -c \"command\"          Execute with compressed output
    loopguard-ctx exec \"command\"        Same as -c
    loopguard-ctx shell                 Interactive shell with compression

COMMANDS:
    notify                         One-line token savings summary (session + today + all-time)
    gain                           Visual dashboard (colors, bars, sparklines, USD)
    gain --live                    Live mode: auto-refreshes every 2s in-place
    gain --graph                   30-day savings chart
    gain --daily                   Bordered day-by-day table with USD
    gain --json                    Raw JSON export of all stats
    cep                            Helper efficiency report (score trends, cache, modes)
    dashboard [--port=N]           Open web dashboard (default: http://localhost:3333)
    wrapped [--week|--month|--all] [--plain]  Savings card (shareable; --plain for copy-paste)
    sessions [list|show|cleanup]   Manage saved helper sessions (~/.loopguard-ctx/sessions/)
    benchmark run [path] [--json]  Run real benchmark on project files
    benchmark report [path]        Generate shareable Markdown report
    setup                          One-command setup: shell + editor + verify
    init [--global]                Install shell aliases (zsh/bash/fish/PowerShell)
    init --agent pi                Install Pi Coding Agent extension (pi-loopguard-ctx)
    read <file> [-m mode]          Read file with compression
    diff <file1> <file2>           Compressed file diff
    grep <pattern> [path]          Search with compressed output
    find <pattern> [path]          Find files with compressed output
    ls [path]                      Directory listing with compression
    deps [path]                    Show project dependencies
    discover                       Find uncompressed commands in shell history
    session                        Show adoption statistics
    config                         Show/edit configuration (~/.loopguard-ctx/config.toml)
    config set model <name>        Set model for accurate USD estimates (e.g. claude-sonnet-4-6)
    config models                  List all supported models and their pricing
    tee [list|clear|show <file>]   Manage error log files (~/.loopguard-ctx/tee/)
    slow-log [list|clear]          Show/clear slow command log (~/.loopguard-ctx/slow-commands.log)
    update [--check]               Self-update loopguard-ctx binary from GitHub Releases
    doctor                         Run installation and environment diagnostics

SHELL HOOK PATTERNS (90+):
    git       status, log, diff, add, commit, push, pull, fetch, clone,
              branch, checkout, switch, merge, stash, tag, reset, remote
    docker    build, ps, images, logs, compose, exec, network
    npm/pnpm  install, test, run, list, outdated, audit
    cargo     build, test, check, clippy
    gh        pr list/view/create, issue list/view, run list/view
    kubectl   get pods/services/deployments, logs, describe, apply
    python    pip install/list/outdated, ruff check/format, poetry, uv
    linters   eslint, biome, prettier, golangci-lint
    builds    tsc, next build, vite build
    ruby      rubocop, bundle install/update, rake test, rails test
    tests     jest, vitest, pytest, go test, playwright, rspec, minitest
    iac       terraform, make, maven, gradle, dotnet, flutter, dart
    utils     curl, grep/rg, find, ls, wget, env
    data      JSON schema extraction, log deduplication

READ MODES:
    full (default)                 Full content (cached re-reads = 13 tokens)
    map                            Dependency graph + API signatures
    signatures                     language-aware API surface extraction
    aggressive                     Syntax-stripped content
    entropy                        Shannon entropy filtered
    diff                           Changed lines only
    lines:N-M                      Specific line ranges (e.g. lines:10-50,80)

OPTIONS:
    --version, -V                  Show version
    --help, -h                     Show this help

EXAMPLES:
    loopguard-ctx -c \"git status\"       Compressed git output
    loopguard-ctx -c \"kubectl get pods\" Compressed k8s output
    loopguard-ctx -c \"gh pr list\"       Compressed GitHub CLI output
    loopguard-ctx gain                  Visual terminal dashboard
    loopguard-ctx gain --live           Live auto-updating terminal dashboard
    loopguard-ctx gain --graph          30-day savings chart
    loopguard-ctx gain --daily          Day-by-day breakdown with USD
    loopguard-ctx dashboard             Open web dashboard at localhost:3333
    loopguard-ctx wrapped               Weekly savings report card
    loopguard-ctx wrapped --month       Monthly savings report card
    loopguard-ctx sessions list         List saved helper sessions
    loopguard-ctx sessions show         Show latest session state
    loopguard-ctx discover              Find missed savings in shell history
    loopguard-ctx setup                 One-command setup (shell + editors + verify)
    loopguard-ctx init --global         Install shell aliases (includes loopguard-ctx-on/off/status)
    loopguard-ctx-on                    Enable all compression aliases (after init)
    loopguard-ctx-off                   Disable all compression aliases (human-readable mode)
    loopguard-ctx-status                Show whether compression is active
    loopguard-ctx init --agent pi       Install Pi Coding Agent extension
    loopguard-ctx doctor                Check PATH, config, MCP, and dashboard port
    loopguard-ctx read src/main.rs -m map
    loopguard-ctx grep \"pub fn\" src/
    loopguard-ctx deps .

WEBSITE: https://loopguard.vercel.app
GITHUB:  https://github.com/rodthenewcomer/loopguard
"
    );
}
