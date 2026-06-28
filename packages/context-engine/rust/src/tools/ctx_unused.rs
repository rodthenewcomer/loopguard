use std::path::Path;

pub fn handle(path: &str) -> String {
    let ext = Path::new(path)
        .extension()
        .and_then(|e| e.to_str())
        .unwrap_or("");
    let cmd = match ext {
        "rs" => format!("cd '{path}' 2>/dev/null || cargo check 2>&1 | grep 'unused\\|dead_code\\|never used' | head -30; cd -"),
        "ts" | "tsx" => format!("tsc --noUnusedLocals --noUnusedParameters --noEmit '{path}' 2>&1 | head -30"),
        "py" => format!("python3 -m pyflakes '{path}' 2>&1 | grep 'imported but unused\\|defined but never' | head -20"),
        _ => format!("# No unused-symbol checker configured for .{ext} files\n# Supported: .rs, .ts, .tsx, .py"),
    };
    format!(
        "ctx_unused — find unused symbols/imports\n\
         Path: {path}\n\
         Type: .{ext}\n\n\
         Run analysis with:\n  ctx_shell(\"{cmd}\")"
    )
}
