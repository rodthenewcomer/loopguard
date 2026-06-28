pub fn handle(path: &str, line_start: Option<i64>, line_end: Option<i64>) -> String {
    let range_flag = match (line_start, line_end) {
        (Some(s), Some(e)) => format!("-L {s},{e} "),
        (Some(s), None) => format!("-L {s},{} ", s + 20),
        _ => String::new(),
    };
    let cmd = format!("git blame {range_flag}--date=short '{path}' 2>&1 | head -60");
    let (shell, flag) = crate::shell::shell_and_flag();
    let raw = std::process::Command::new(&shell)
        .arg(&flag)
        .arg(&cmd)
        .output()
        .map(|o| String::from_utf8_lossy(&o.stdout).to_string())
        .unwrap_or_default();

    // Compress: group consecutive lines by same author+date prefix
    let mut out_lines: Vec<String> = Vec::new();
    let mut prev_prefix = String::new();
    for line in raw.lines() {
        let prefix: String = line.chars().take(30).collect();
        if prefix == prev_prefix {
            out_lines.push(format!(
                "       │ {}",
                &line[line.find(')').map(|i| i + 1).unwrap_or(0)..].trim_start()
            ));
        } else {
            out_lines.push(line.to_string());
            prev_prefix = prefix;
        }
    }

    format!(
        "ctx_blame — git blame for {}\n{}\n{}",
        crate::core::protocol::shorten_path(path),
        "═".repeat(50),
        out_lines.join("\n")
    )
}
