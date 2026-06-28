use std::path::PathBuf;

fn archive_dir() -> PathBuf {
    dirs::home_dir()
        .unwrap_or_else(|| PathBuf::from("."))
        .join(".loopguard-ctx")
        .join("archive")
}

pub fn handle(content: &str, label: Option<&str>, tags: &[String]) -> String {
    let dir = archive_dir();
    let _ = std::fs::create_dir_all(&dir);

    let ts = chrono::Local::now().format("%Y%m%d-%H%M%S").to_string();
    let name = label.unwrap_or("output");
    let id = format!("{ts}-{name}");
    let file = dir.join(format!("{id}.json"));

    let entry = serde_json::json!({
        "id": id,
        "label": label,
        "tags": tags,
        "content": content,
        "size": content.len(),
        "archived_at": chrono::Local::now().to_rfc3339(),
    });

    let _ = std::fs::write(&file, entry.to_string());
    format!(
        "ctx_archive — output archived\n\
         ID:   {id}\n\
         Tags: {}\n\
         Size: {} chars\n\
         File: {}",
        tags.join(", "),
        content.len(),
        file.display()
    )
}
