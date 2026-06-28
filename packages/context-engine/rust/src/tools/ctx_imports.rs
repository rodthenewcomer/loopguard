pub fn handle(path: &str, depth: usize) -> String {
    let content = match std::fs::read_to_string(path) {
        Ok(c) => c,
        Err(e) => return format!("ctx_imports — cannot read {path}: {e}"),
    };

    let mut imports: Vec<String> = Vec::new();
    for (i, line) in content.lines().enumerate() {
        let t = line.trim();
        if t.starts_with("import ")
            || t.starts_with("use ")
            || t.starts_with("require(")
            || t.starts_with("from ")
            || t.starts_with("extern crate")
        {
            imports.push(format!(
                "  {:4}  {}",
                i + 1,
                t.chars().take(100).collect::<String>()
            ));
        }
    }

    if imports.is_empty() {
        return format!("ctx_imports — no import statements found in {path}");
    }

    let mut out = vec![format!(
        "ctx_imports — {} import(s) in {} [depth={}]",
        imports.len(),
        crate::core::protocol::shorten_path(path),
        depth
    )];
    out.push("═".repeat(50));
    out.extend(imports);
    out.join("\n")
}
