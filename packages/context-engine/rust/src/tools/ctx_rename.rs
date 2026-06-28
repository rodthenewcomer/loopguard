pub fn handle(old_name: &str, new_name: &str, search_path: &str, ext: Option<&str>) -> String {
    let ext_filter = ext.map(|e| format!("--include='*.{e}'"))
        .unwrap_or_else(|| "--include='*.rs' --include='*.ts' --include='*.tsx' --include='*.js' --include='*.py' --include='*.go'".to_string());

    let cmd =
        format!("grep -rn {ext_filter} -w '{old_name}' '{search_path}' 2>/dev/null | head -50");
    let (shell, flag) = crate::shell::shell_and_flag();
    let out = std::process::Command::new(&shell)
        .arg(&flag)
        .arg(&cmd)
        .output()
        .map(|o| String::from_utf8_lossy(&o.stdout).to_string())
        .unwrap_or_default();

    if out.trim().is_empty() {
        return format!("ctx_rename — '{old_name}' not found in {search_path}");
    }

    let lines: Vec<&str> = out.lines().collect();
    let files: std::collections::HashSet<&str> =
        lines.iter().filter_map(|l| l.split(':').next()).collect();

    format!(
        "ctx_rename — dry run: '{}' → '{}'\n\
         {} file(s) affected, {} occurrence(s)\n{}\n{}\n\n\
         To apply:\n  ctx_shell(\"grep -rl --include='*.rs' -w '{old_name}' '{search_path}' | xargs sed -i 's/\\b{old_name}\\b/{new_name}/g'\")",
        old_name, new_name, files.len(), lines.len(), "═".repeat(50), out.trim()
    )
}
