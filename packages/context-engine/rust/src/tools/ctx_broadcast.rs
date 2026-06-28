use std::path::PathBuf;

fn broadcast_file() -> PathBuf {
    dirs::home_dir()
        .unwrap_or_else(|| PathBuf::from("."))
        .join(".loopguard-ctx")
        .join("broadcast.json")
}

pub fn handle(message: &str, level: &str) -> String {
    let file = broadcast_file();
    if let Some(parent) = file.parent() {
        let _ = std::fs::create_dir_all(parent);
    }

    let mut entries: Vec<serde_json::Value> = std::fs::read_to_string(&file)
        .ok()
        .and_then(|s| serde_json::from_str(&s).ok())
        .unwrap_or_default();

    let entry = serde_json::json!({
        "level": level,
        "message": message,
        "timestamp": chrono::Local::now().to_rfc3339(),
    });
    entries.push(entry);
    if entries.len() > 100 {
        entries.drain(0..entries.len() - 100);
    }

    let _ = std::fs::write(
        &file,
        serde_json::to_string_pretty(&entries).unwrap_or_default(),
    );
    format!("ctx_broadcast [{level}] — message queued for all agents\n  {message}")
}
