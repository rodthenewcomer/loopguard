use std::path::Path;

pub fn handle(path: &str, tool: &str) -> String {
    let ext = Path::new(path)
        .extension()
        .and_then(|e| e.to_str())
        .unwrap_or("");
    let effective_tool = if tool == "auto" {
        match ext {
            "rs" => "cargo",
            "ts" | "tsx" => "tsc",
            "js" | "jsx" => "eslint",
            "py" => "pyflakes",
            _ => "unknown",
        }
    } else {
        tool
    };

    let cmd = match effective_tool {
        "cargo" => "cargo check 2>&1 | head -40".to_string(),
        "tsc" => format!("npx tsc --noEmit 2>&1 | head -40"),
        "eslint" => format!("npx eslint '{path}' 2>&1 | head -30"),
        "pyflakes" => format!("python3 -m pyflakes '{path}' 2>&1 | head -30"),
        _ => return format!("ctx_diagnostics — no checker for .{ext} (tool={tool})"),
    };

    let (shell, flag) = crate::shell::shell_and_flag();
    let output = std::process::Command::new(&shell)
        .arg(&flag)
        .arg(&cmd)
        .output()
        .map(|o| {
            let stdout = String::from_utf8_lossy(&o.stdout).to_string();
            let stderr = String::from_utf8_lossy(&o.stderr).to_string();
            if stdout.is_empty() {
                stderr
            } else {
                stdout
            }
        })
        .unwrap_or_else(|e| format!("ERROR: {e}"));

    format!(
        "ctx_diagnostics — {effective_tool} diagnostics for {path}\n{}\n{}",
        "═".repeat(50),
        output.trim()
    )
}
