pub fn handle(path: &str) -> String {
    let content = match std::fs::read_to_string(path) {
        Ok(c) => c,
        Err(e) => return format!("ctx_pkg_load — cannot read {path}: {e}"),
    };
    let pkg: serde_json::Value = match serde_json::from_str(&content) {
        Ok(v) => v,
        Err(e) => return format!("ctx_pkg_load — invalid .ctxpkg format: {e}"),
    };

    let version = pkg.get("version").and_then(|v| v.as_str()).unwrap_or("?");
    let created = pkg.get("created").and_then(|v| v.as_str()).unwrap_or("?");
    let files = pkg
        .get("files")
        .and_then(|v| v.as_object())
        .map(|m| m.len())
        .unwrap_or(0);

    let file_list: Vec<String> = pkg
        .get("files")
        .and_then(|v| v.as_object())
        .into_iter()
        .flatten()
        .take(20)
        .map(|(k, v)| {
            let hash = v.get("sha256").and_then(|h| h.as_str()).unwrap_or("?");
            format!("  {k} [{hash}]")
        })
        .collect();

    format!(
        "ctx_pkg_load — .ctxpkg bundle loaded\n\
         File:    {path}\n\
         Version: {version}\n\
         Created: {created}\n\
         Files:   {files}\n{}\n{}",
        "═".repeat(50),
        file_list.join("\n")
    )
}
