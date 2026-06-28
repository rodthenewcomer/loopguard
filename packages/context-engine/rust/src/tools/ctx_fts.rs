use std::path::PathBuf;

fn archive_dir() -> PathBuf {
    dirs::home_dir()
        .unwrap_or_else(|| PathBuf::from("."))
        .join(".loopguard-ctx")
        .join("archive")
}

pub fn handle(query: &str, limit: usize, tag: Option<&str>) -> String {
    let dir = archive_dir();
    if !dir.exists() {
        return "ctx_fts — archive is empty. Use ctx_archive to store outputs first.".to_string();
    }

    let query_lower = query.to_lowercase();
    let mut matches: Vec<String> = Vec::new();

    let entries = std::fs::read_dir(&dir).ok().into_iter().flatten().flatten();
    for entry in entries {
        let path = entry.path();
        if !path
            .extension()
            .and_then(|e| e.to_str())
            .map(|e| e == "json")
            .unwrap_or(false)
        {
            continue;
        }
        let raw = std::fs::read_to_string(&path).unwrap_or_default();
        let v: serde_json::Value = serde_json::from_str(&raw).unwrap_or_default();

        if let Some(filter_tag) = tag {
            let has_tag = v
                .get("tags")
                .and_then(|t| t.as_array())
                .map(|arr| arr.iter().any(|t| t.as_str() == Some(filter_tag)))
                .unwrap_or(false);
            if !has_tag {
                continue;
            }
        }

        let content = v.get("content").and_then(|c| c.as_str()).unwrap_or("");
        if content.to_lowercase().contains(&query_lower) {
            let id = v.get("id").and_then(|i| i.as_str()).unwrap_or("?");
            let snippet: String = content[content.to_lowercase().find(&query_lower).unwrap_or(0)..]
                .chars()
                .take(80)
                .collect();
            matches.push(format!("  [{id}] ...{snippet}..."));
        }
        if matches.len() >= limit {
            break;
        }
    }

    if matches.is_empty() {
        return format!("ctx_fts — no matches for '{query}' in archive");
    }
    format!(
        "ctx_fts — {} match(es) for '{}'\n{}\n{}",
        matches.len(),
        query,
        "═".repeat(50),
        matches.join("\n")
    )
}
