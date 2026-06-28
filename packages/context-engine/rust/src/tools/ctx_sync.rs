use std::path::PathBuf;

fn sync_file() -> PathBuf {
    dirs::home_dir()
        .unwrap_or_else(|| PathBuf::from("."))
        .join(".loopguard-ctx")
        .join("sync.json")
}

pub fn handle(direction: &str) -> String {
    let file = sync_file();
    if let Some(parent) = file.parent() {
        let _ = std::fs::create_dir_all(parent);
    }

    let session_summary = crate::core::session::SessionState::load_latest()
        .map(|s| s.format_compact())
        .unwrap_or_else(|| "no session".to_string());

    match direction {
        "push" | "both" => {
            let payload = serde_json::json!({
                "direction": direction,
                "synced_at": chrono::Local::now().to_rfc3339(),
                "session": session_summary,
            });
            let _ = std::fs::write(&file, payload.to_string());
            format!(
                "ctx_sync {direction} — session state synced to {}",
                file.display()
            )
        }
        "pull" => {
            if !file.exists() {
                return "ctx_sync pull — no sync state found".to_string();
            }
            let raw = std::fs::read_to_string(&file).unwrap_or_default();
            format!("ctx_sync pull — loaded sync state\n{raw}")
        }
        _ => format!("ctx_sync — unknown direction '{direction}'. Use: push, pull, both"),
    }
}
