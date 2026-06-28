pub fn handle(
    path: Option<&str>,
    limit: usize,
    author: Option<&str>,
    since: Option<&str>,
) -> String {
    let mut args = format!("--oneline -n {limit}");
    if let Some(a) = author {
        args.push_str(&format!(" --author='{a}'"));
    }
    if let Some(s) = since {
        args.push_str(&format!(" --since='{s}'"));
    }
    if let Some(p) = path {
        args.push_str(&format!(" -- '{p}'"));
    }

    let cmd = format!("git log {args} 2>&1");
    let (shell, flag) = crate::shell::shell_and_flag();
    let out = std::process::Command::new(&shell)
        .arg(&flag)
        .arg(&cmd)
        .output()
        .map(|o| String::from_utf8_lossy(&o.stdout).to_string())
        .unwrap_or_default();

    if out.trim().is_empty() {
        return format!(
            "ctx_git_log — no commits found (path={path:?}, author={author:?}, since={since:?})"
        );
    }
    format!(
        "ctx_git_log — last {} commit(s){}\n{}\n{}",
        limit,
        path.map(|p| format!(" on {p}")).unwrap_or_default(),
        "═".repeat(50),
        out.trim()
    )
}
