pub fn handle(base: &str, include_tests: bool) -> String {
    let (shell, flag) = crate::shell::shell_and_flag();
    let cmd = format!("git diff --name-only {base} 2>&1");
    let out = std::process::Command::new(&shell)
        .arg(&flag)
        .arg(&cmd)
        .output()
        .map(|o| String::from_utf8_lossy(&o.stdout).to_string())
        .unwrap_or_default();

    let files: Vec<&str> = out.lines().filter(|l| !l.is_empty()).collect();
    if files.is_empty() {
        return format!("ctx_pr_pack — no changes vs {base}");
    }

    let test_files: Vec<&&str> = files
        .iter()
        .filter(|f| f.contains("test") || f.contains("spec"))
        .collect();
    let src_files: Vec<&&str> = files
        .iter()
        .filter(|f| !f.contains("test") && !f.contains("spec"))
        .collect();

    let mut out_lines = vec![
        format!("ctx_pr_pack — PR bundle vs {base}"),
        "═".repeat(50),
        format!("  Source files: {}", src_files.len()),
    ];
    if include_tests {
        out_lines.push(format!("  Test files:   {}", test_files.len()));
    }
    out_lines.push(format!(
        "  Total:        {}",
        if include_tests {
            files.len()
        } else {
            src_files.len()
        }
    ));
    out_lines.push(String::new());
    out_lines.push("Changed files:".to_string());
    for f in &files {
        if !include_tests && (f.contains("test") || f.contains("spec")) {
            continue;
        }
        out_lines.push(format!("  {f}"));
    }
    out_lines.push(String::new());
    out_lines.push(format!(
        "Read all: ctx_multi_read(paths=[{}])",
        files
            .iter()
            .take(10)
            .map(|f| format!("'{f}'"))
            .collect::<Vec<_>>()
            .join(", ")
    ));
    out_lines.join("\n")
}
