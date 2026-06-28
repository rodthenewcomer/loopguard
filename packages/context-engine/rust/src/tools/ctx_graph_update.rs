use std::path::PathBuf;

fn updates_file() -> PathBuf {
    dirs::home_dir()
        .unwrap_or_else(|| PathBuf::from("."))
        .join(".loopguard-ctx")
        .join("graph-updates.jsonl")
}

pub fn handle(action: &str, node: Option<&str>, edge: Option<&str>, value: Option<&str>) -> String {
    let file = updates_file();
    if let Some(parent) = file.parent() {
        let _ = std::fs::create_dir_all(parent);
    }

    match action {
        "add" | "set" => {
            let entry = serde_json::json!({
                "action": action,
                "node": node,
                "edge": edge,
                "value": value,
                "updated_at": chrono::Local::now().to_rfc3339(),
            });
            let _ = std::fs::OpenOptions::new()
                .append(true)
                .create(true)
                .open(&file)
                .and_then(|mut f| {
                    use std::io::Write;
                    writeln!(f, "{entry}")
                });
            format!(
                "ctx_graph_update {action} - queued graph update for node '{}'",
                node.unwrap_or("unknown")
            )
        }
        "list" => {
            let raw = std::fs::read_to_string(&file).unwrap_or_default();
            let entries: Vec<&str> = raw.lines().rev().take(10).collect();
            if entries.is_empty() {
                return "ctx_graph_update list - no graph updates recorded".to_string();
            }
            format!(
                "ctx_graph_update list - last {} update(s):\n{}",
                entries.len(),
                entries.into_iter().rev().collect::<Vec<_>>().join("\n")
            )
        }
        "clear" => {
            let _ = std::fs::remove_file(&file);
            "ctx_graph_update clear - graph update queue removed".to_string()
        }
        _ => "ctx_graph_update - unknown action. Use: add, set, list, clear".to_string(),
    }
}
