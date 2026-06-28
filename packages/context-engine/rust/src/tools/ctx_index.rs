pub fn handle(path: &str, force: bool) -> String {
    let mut count = 0usize;
    let mut exts: std::collections::HashMap<String, usize> = std::collections::HashMap::new();
    count_files(path, &mut count, &mut exts, 6);

    let mut ext_list: Vec<(&String, &usize)> = exts.iter().collect();
    ext_list.sort_by(|a, b| b.1.cmp(a.1));
    let top: Vec<String> = ext_list
        .iter()
        .take(8)
        .map(|(k, v)| format!(".{k}:{v}"))
        .collect();

    format!(
        "ctx_index — search index for {path}\n\
         Files: {count}\n\
         Types: {}\n\
         Force: {force}\n\n\
         For a real dependency graph index, use:\n\
           ctx_graph(action='build', project_root='{path}')",
        top.join(" ")
    )
}

fn count_files(
    dir: &str,
    count: &mut usize,
    exts: &mut std::collections::HashMap<String, usize>,
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
                count_files(&path.to_string_lossy(), count, exts, depth - 1);
            }
        } else {
            *count += 1;
            if let Some(ext) = path.extension().and_then(|e| e.to_str()) {
                *exts.entry(ext.to_string()).or_insert(0) += 1;
            }
        }
    }
}
