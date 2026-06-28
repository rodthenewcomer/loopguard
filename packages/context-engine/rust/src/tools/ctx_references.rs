pub fn handle(symbol: &str, search_path: &str) -> String {
    let cmd = format!(
        "grep -rn --include='*.rs' --include='*.ts' --include='*.tsx' --include='*.js' --include='*.py' --include='*.go' -w '{symbol}' '{search_path}' 2>/dev/null | head -40"
    );
    let (shell, flag) = crate::shell::shell_and_flag();
    let out = std::process::Command::new(&shell)
        .arg(&flag)
        .arg(&cmd)
        .output()
        .map(|o| String::from_utf8_lossy(&o.stdout).to_string())
        .unwrap_or_default();

    if out.trim().is_empty() {
        return format!("ctx_references — no references to '{symbol}' found in {search_path}");
    }

    let lines: Vec<&str> = out.lines().collect();
    format!(
        "ctx_references — {} reference(s) to '{}'\n{}\n{}",
        lines.len(),
        symbol,
        "═".repeat(50),
        lines.join("\n")
    )
}
