use std::path::PathBuf;

fn stash_dir() -> PathBuf {
    dirs::home_dir()
        .unwrap_or_else(|| PathBuf::from("."))
        .join(".loopguard-ctx")
        .join("stash")
}

pub fn handle(action: &str, name: Option<&str>) -> String {
    let dir = stash_dir();
    let _ = std::fs::create_dir_all(&dir);
    let stash_name = name.unwrap_or("default");
    let file = dir.join(format!("{stash_name}.json"));

    match action {
        "save" => {
            let entry = serde_json::json!({ "name": stash_name, "saved_at": chrono::Local::now().to_rfc3339() });
            let _ = std::fs::write(&file, entry.to_string());
            format!(
                "ctx_stash save — saved snapshot '{stash_name}'\n  Path: {}",
                file.display()
            )
        }
        "restore" => {
            if !file.exists() {
                return format!("ctx_stash — no stash named '{stash_name}'");
            }
            let content = std::fs::read_to_string(&file).unwrap_or_default();
            format!("ctx_stash restore — restored '{stash_name}'\n{content}")
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
            if entries.is_empty() {
                return "ctx_stash — no stashes saved".to_string();
            }
            format!(
                "ctx_stash list — {} stash(es):\n{}",
                entries.len(),
                entries
                    .iter()
                    .map(|e| format!("  {e}"))
                    .collect::<Vec<_>>()
                    .join("\n")
            )
        }
        "drop" => {
            if file.exists() {
                let _ = std::fs::remove_file(&file);
                format!("ctx_stash drop — removed '{stash_name}'")
            } else {
                format!("ctx_stash — no stash named '{stash_name}'")
            }
        }
        _ => format!("ctx_stash — unknown action '{action}'. Use: save, restore, list, drop"),
    }
}
