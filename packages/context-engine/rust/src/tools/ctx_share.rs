use std::path::PathBuf;

fn shared_dir() -> PathBuf {
    dirs::home_dir()
        .unwrap_or_else(|| PathBuf::from("."))
        .join(".loopguard-ctx")
        .join("shared")
}

pub fn handle(action: &str, slot: Option<&str>, content: Option<&str>) -> String {
    let dir = shared_dir();
    let _ = std::fs::create_dir_all(&dir);

    match action {
        "set" => {
            let slot = slot.unwrap_or("default");
            let content = content.unwrap_or("");
            let entry = serde_json::json!({ "slot": slot, "content": content, "updated": chrono::Local::now().to_rfc3339() });
            let _ = std::fs::write(dir.join(format!("{slot}.json")), entry.to_string());
            format!("ctx_share set — slot '{slot}' ({} chars)", content.len())
        }
        "get" => {
            let slot = slot.unwrap_or("default");
            let file = dir.join(format!("{slot}.json"));
            if !file.exists() {
                return format!("ctx_share — slot '{slot}' not found");
            }
            let raw = std::fs::read_to_string(&file).unwrap_or_default();
            let v: serde_json::Value = serde_json::from_str(&raw).unwrap_or_default();
            format!(
                "ctx_share get — slot '{slot}'\n{}",
                v.get("content").and_then(|c| c.as_str()).unwrap_or("")
            )
        }
        "list" => {
            let entries: Vec<String> = std::fs::read_dir(&dir)
                .ok()
                .into_iter()
                .flatten()
                .flatten()
                .filter_map(|e| e.file_name().into_string().ok())
                .filter(|n| n.ends_with(".json"))
                .map(|n| n.trim_end_matches(".json").to_string())
                .collect();
            format!(
                "ctx_share list — {} slot(s):\n{}",
                entries.len(),
                entries
                    .iter()
                    .map(|e| format!("  {e}"))
                    .collect::<Vec<_>>()
                    .join("\n")
            )
        }
        "delete" => {
            let slot = slot.unwrap_or("default");
            let file = dir.join(format!("{slot}.json"));
            let _ = std::fs::remove_file(&file);
            format!("ctx_share delete — slot '{slot}' removed")
        }
        _ => format!("ctx_share — unknown action '{action}'. Use: set, get, list, delete"),
    }
}
