pub fn handle(query: &str, search_path: &str, limit: usize) -> String {
    let keywords: Vec<String> = query
        .split_whitespace()
        .filter(|w| w.len() > 2)
        .map(|w| w.to_lowercase())
        .collect();

    let mut scored: Vec<(usize, String)> = Vec::new();

    collect_files(search_path, &keywords, &mut scored, 4);

    scored.sort_by(|a, b| b.0.cmp(&a.0));
    scored.dedup_by(|a, b| a.1 == b.1);
    scored.truncate(limit);

    if scored.is_empty() {
        return format!("ctx_semantic — no relevant files found for '{query}' in {search_path}");
    }
    let mut out = vec![format!(
        "ctx_semantic — top {} file(s) for '{}'",
        scored.len(),
        query
    )];
    out.push("═".repeat(50));
    for (score, path) in &scored {
        out.push(format!(
            "  [{score:3}] {}",
            crate::core::protocol::shorten_path(path)
        ));
    }
    out.join("\n")
}

fn collect_files(dir: &str, keywords: &[String], out: &mut Vec<(usize, String)>, depth: usize) {
    if depth == 0 {
        return;
    }
    let entries = match std::fs::read_dir(dir) {
        Ok(e) => e,
        Err(_) => return,
    };
    for entry in entries.flatten() {
        let path = entry.path();
        let path_str = path.to_string_lossy().to_string();
        if path.is_dir() {
            let name = path.file_name().and_then(|n| n.to_str()).unwrap_or("");
            if !name.starts_with('.') && name != "node_modules" && name != "target" {
                collect_files(&path_str, keywords, out, depth - 1);
            }
        } else {
            let lower = path_str.to_lowercase();
            let score: usize = keywords
                .iter()
                .filter(|k| lower.contains(k.as_str()))
                .count();
            if score > 0 {
                out.push((score, path_str));
            }
        }
    }
}
