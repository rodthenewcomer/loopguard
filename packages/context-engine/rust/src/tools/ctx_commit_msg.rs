pub fn handle(base: &str, style: &str) -> String {
    let (shell, flag) = crate::shell::shell_and_flag();
    let stat_cmd = format!("git diff {base} --stat 2>&1 | tail -5");
    let stat = std::process::Command::new(&shell)
        .arg(&flag)
        .arg(&stat_cmd)
        .output()
        .map(|o| String::from_utf8_lossy(&o.stdout).to_string())
        .unwrap_or_default();

    let files_cmd = format!("git diff {base} --name-only 2>&1 | head -10");
    let files = std::process::Command::new(&shell)
        .arg(&flag)
        .arg(&files_cmd)
        .output()
        .map(|o| String::from_utf8_lossy(&o.stdout).to_string())
        .unwrap_or_default();

    let scope = files
        .lines()
        .next()
        .and_then(|f| f.split('/').nth(1))
        .unwrap_or("core");

    let template = if style == "simple" {
        "Update <describe what changed>\n\n<optional body>".to_string()
    } else {
        format!("feat({scope}): <describe what was added>\n\n<optional body explaining why>\n\nFiles changed:\n{}", files.trim())
    };

    format!(
        "ctx_commit_msg — commit message template\nBase: {base} | Style: {style}\n\nDiff stat:\n{}\n{}\n{template}",
        stat.trim(), "─".repeat(50)
    )
}
