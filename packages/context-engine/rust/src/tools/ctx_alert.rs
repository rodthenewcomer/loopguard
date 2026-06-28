use std::path::PathBuf;

fn alert_file() -> PathBuf {
    dirs::home_dir()
        .unwrap_or_else(|| PathBuf::from("."))
        .join(".loopguard-ctx")
        .join("alerts.jsonl")
}

pub fn handle(action: &str, message: Option<&str>, threshold: Option<i64>) -> String {
    let file = alert_file();
    if let Some(parent) = file.parent() {
        let _ = std::fs::create_dir_all(parent);
    }

    match action {
        "add" => {
            let msg = message.unwrap_or("LoopGuard alert");
            let entry = serde_json::json!({
                "message": msg,
                "threshold": threshold,
                "created_at": chrono::Local::now().to_rfc3339(),
            });
            let _ = std::fs::OpenOptions::new()
                .append(true)
                .create(true)
                .open(&file)
                .and_then(|mut f| {
                    use std::io::Write;
                    writeln!(f, "{entry}")
                });
            format!("ctx_alert add - alert recorded: {msg}")
        }
        "list" => {
            let raw = std::fs::read_to_string(&file).unwrap_or_default();
            let entries: Vec<&str> = raw.lines().rev().take(10).collect();
            if entries.is_empty() {
                return "ctx_alert list - no alerts recorded".to_string();
            }
            format!(
                "ctx_alert list - last {} alert(s):\n{}",
                entries.len(),
                entries.into_iter().rev().collect::<Vec<_>>().join("\n")
            )
        }
        "clear" => {
            let _ = std::fs::remove_file(&file);
            "ctx_alert clear - alerts removed".to_string()
        }
        _ => "ctx_alert - unknown action. Use: add, list, clear".to_string(),
    }
}
