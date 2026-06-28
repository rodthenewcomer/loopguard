use std::path::Path;

pub fn handle(path: &str, limit: usize) -> String {
    let p = Path::new(path);
    let ext = p.extension().and_then(|e| e.to_str()).unwrap_or("");
    let stem = p
        .file_stem()
        .and_then(|s| s.to_str())
        .unwrap_or("")
        .to_lowercase();
    let search_root = p
        .parent()
        .and_then(|pr| pr.parent())
        .unwrap_or(Path::new("."));

    let mut similar: Vec<(usize, String)> = Vec::new();
    collect_similar(search_root, ext, &stem, path, &mut similar, 5);
    similar.sort_by(|a, b| b.0.cmp(&a.0));
    similar.truncate(limit);

    if similar.is_empty() {
        return format!("ctx_similar — no similar .{ext} files found near {path}");
    }

    let mut out = vec![format!(
        "ctx_similar — {} file(s) similar to {}",
        similar.len(),
        crate::core::protocol::shorten_path(path)
    )];
    out.push("═".repeat(50));
    for (score, f) in &similar {
        out.push(format!(
            "  [{score:3}pts] {}",
            crate::core::protocol::shorten_path(f)
        ));
    }
    out.join("\n")
}

fn collect_similar(
    dir: &Path,
    ext: &str,
    stem: &str,
    exclude: &str,
    out: &mut Vec<(usize, String)>,
    depth: usize,
) {
    if depth == 0 {
        return;
    }
    let entries = match std::fs::read_dir(dir) {
        Ok(e) => e,
        Err(_) => return,
    };
    for entry in entries.flatten() {
        let path = entry.path();
        if path.is_dir() {
            let name = path.file_name().and_then(|n| n.to_str()).unwrap_or("");
            if !name.starts_with('.') && name != "node_modules" && name != "target" {
                collect_similar(&path, ext, stem, exclude, out, depth - 1);
            }
        } else {
            let path_str = path.to_string_lossy().to_string();
            if path_str == exclude {
                continue;
            }
            let file_ext = path.extension().and_then(|e| e.to_str()).unwrap_or("");
            if file_ext != ext {
                continue;
            }
            let file_stem = path
                .file_stem()
                .and_then(|s| s.to_str())
                .unwrap_or("")
                .to_lowercase();
            let score = common_prefix_len(stem, &file_stem);
            if score > 0 {
                out.push((score, path_str));
            }
        }
    }
}

fn common_prefix_len(a: &str, b: &str) -> usize {
    a.chars().zip(b.chars()).take_while(|(x, y)| x == y).count()
}
