use std::path::PathBuf;

fn store_dir() -> PathBuf {
    dirs::home_dir()
        .unwrap_or_else(|| PathBuf::from("."))
        .join(".loopguard-ctx")
        .join("store")
}

pub fn handle(hash: Option<&str>, path: Option<&str>) -> String {
    let dir = store_dir();
    match (hash, path) {
        (Some(h), _) => {
            let file = dir.join(format!("{h}.orig"));
            if file.exists() {
                std::fs::read_to_string(&file).unwrap_or_else(|e| format!("read error: {e}"))
            } else {
                format!(
                    "ctx_expand — hash '{h}' not in store\n\
                     Store: {}\n\
                     The content-addressed store is populated as files are compressed.\n\
                     Use ctx_read(mode=full, fresh=true) to get original file content.",
                    dir.display()
                )
            }
        }
        (None, Some(p)) => {
            format!(
                "ctx_expand — original content for {p}\n\
                 Store not yet populated for this path.\n\
                 Use ctx_read(path='{p}', mode='full', fresh=true) to read original."
            )
        }
        _ => "ctx_expand — provide hash or path to retrieve original content".to_string(),
    }
}
