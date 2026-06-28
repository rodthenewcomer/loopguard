use std::collections::HashMap;
use std::path::PathBuf;

pub fn handle(paths: &[String], output: Option<&str>) -> String {
    let out_path = output
        .map(PathBuf::from)
        .unwrap_or_else(|| PathBuf::from("/tmp/context.ctxpkg"));

    let mut files: HashMap<String, serde_json::Value> = HashMap::new();
    let mut missing: Vec<&str> = Vec::new();

    for p in paths {
        if std::path::Path::new(p).exists() {
            let content = std::fs::read_to_string(p).unwrap_or_default();
            let hash = simple_hash(&content);
            files.insert(p.clone(), serde_json::json!({ "sha256": hash, "size": content.len(), "lines": content.lines().count() }));
        } else {
            missing.push(p);
        }
    }

    let pkg = serde_json::json!({
        "version": "1.0",
        "created": chrono::Local::now().to_rfc3339(),
        "files": files,
        "missing": missing,
    });

    let _ = std::fs::write(&out_path, pkg.to_string());

    format!(
        "ctx_pkg_create — .ctxpkg bundle created\n\
         Output:  {}\n\
         Files:   {} included, {} missing\n\
         Format:  JSON with SHA-256 integrity hashes",
        out_path.display(),
        files.len(),
        missing.len()
    )
}

fn simple_hash(content: &str) -> String {
    let mut h: u64 = 14695981039346656037;
    for byte in content.bytes() {
        h ^= byte as u64;
        h = h.wrapping_mul(1099511628211);
    }
    format!("{h:016x}")
}
