pub fn handle(pattern: &str, search_path: &str, context_lines: usize) -> String {
    let ctx = context_lines.min(10);
    let cmd = format!(
        "grep -rn --include='*.rs' --include='*.ts' --include='*.tsx' --include='*.js' --include='*.py' --include='*.go' -B{ctx} -A{ctx} '{pattern}' '{search_path}' 2>/dev/null | head -120"
    );
    let (shell, flag) = crate::shell::shell_and_flag();
    let out = std::process::Command::new(&shell)
        .arg(&flag)
        .arg(&cmd)
        .output()
        .map(|o| String::from_utf8_lossy(&o.stdout).to_string())
        .unwrap_or_default();

    if out.trim().is_empty() {
        return format!("ctx_scan — no matches for '{pattern}' in {search_path}");
    }

    // Count match count
    let match_count = out
        .lines()
        .filter(|l| l.contains(':') && !l.starts_with("--"))
        .count();
    format!(
        "ctx_scan — '{}' in {} [context={ctx}]\n~{match_count} match(es)\n{}\n{}",
        pattern,
        search_path,
        "═".repeat(50),
        out.trim()
    )
}
