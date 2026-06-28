use std::path::PathBuf;

fn store_dir() -> PathBuf {
    dirs::home_dir()
        .unwrap_or_else(|| PathBuf::from("."))
        .join(".loopguard-ctx")
        .join("store")
}

pub fn handle(key: &str) -> String {
    let dir = store_dir();
    let candidates: Vec<_> = std::fs::read_dir(&dir)
        .ok()
        .into_iter()
        .flatten()
        .flatten()
        .filter_map(|e| {
            let name = e.file_name().into_string().ok()?;
            if name.contains(key) {
                Some(e.path())
            } else {
                None
            }
        })
        .collect();

    if candidates.is_empty() {
        return format!(
            "ctx_retrieve — key '{key}' not found in store\n\
             Store: {}\n\
             The store is populated as files are compressed via ctx_read.",
            dir.display()
        );
    }
    let path = &candidates[0];
    let content = std::fs::read_to_string(path).unwrap_or_else(|e| format!("read error: {e}"));
    format!(
        "ctx_retrieve — key '{}'\nFile: {}\n{}\n{}",
        key,
        path.display(),
        "═".repeat(50),
        content.chars().take(2000).collect::<String>()
    )
}
