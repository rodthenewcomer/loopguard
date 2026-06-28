pub fn handle(pr: Option<&str>, base: &str) -> String {
    let (shell, flag) = crate::shell::shell_and_flag();

    let (header, cmd) = if let Some(pr_id) = pr {
        (
            format!("PR #{pr_id}"),
            format!("gh pr diff {pr_id} 2>&1 | head -200"),
        )
    } else {
        (
            format!("local vs {base}"),
            format!("git diff {base} --stat 2>&1 && git diff {base} -- 2>&1 | head -150"),
        )
    };

    let out = std::process::Command::new(&shell)
        .arg(&flag)
        .arg(&cmd)
        .output()
        .map(|o| {
            let s = String::from_utf8_lossy(&o.stdout).to_string();
            let e = String::from_utf8_lossy(&o.stderr).to_string();
            if s.is_empty() {
                e
            } else {
                s
            }
        })
        .unwrap_or_default();

    format!(
        "ctx_pr_review — review context for {header}\n{}\n{}",
        "═".repeat(50),
        out.trim()
    )
}
