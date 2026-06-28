use std::path::Path;

pub fn handle(path: &str, kind: &str) -> String {
    let content = match std::fs::read_to_string(path) {
        Ok(c) => c,
        Err(e) => return format!("ctx_symbols — cannot read {path}: {e}"),
    };
    let ext = Path::new(path)
        .extension()
        .and_then(|e| e.to_str())
        .unwrap_or("");
    let patterns: &[(&str, &str)] = match kind {
        "fn" => &[("fn", r"fn\s+(\w+)")],
        "class" => &[("class", r"class\s+(\w+)"), ("struct", r"struct\s+(\w+)")],
        "type" => &[
            ("type", r"type\s+(\w+)"),
            ("interface", r"interface\s+(\w+)"),
            ("enum", r"enum\s+(\w+)"),
        ],
        "const" => &[
            ("const", r"const\s+(\w+)"),
            ("let", r"^export\s+const\s+(\w+)"),
        ],
        _ => &[
            ("fn", r"fn\s+(\w+)"),
            ("struct", r"struct\s+(\w+)"),
            ("enum", r"enum\s+(\w+)"),
            ("type", r"type\s+(\w+)"),
            ("const", r"const\s+(\w+)"),
        ],
    };

    let mut symbols: Vec<String> = Vec::new();
    for (line_no, line) in content.lines().enumerate() {
        for (label, pat) in patterns {
            if let Some(m) = simple_match(line, pat) {
                symbols.push(format!("  {label:8} {:4} {m}", line_no + 1));
            }
        }
    }

    if symbols.is_empty() {
        return format!("ctx_symbols — no {kind} symbols found in {path} (.{ext})");
    }
    let mut out = vec![format!(
        "ctx_symbols — {} symbol(s) in {} [kind={}]",
        symbols.len(),
        crate::core::protocol::shorten_path(path),
        kind
    )];
    out.push("═".repeat(50));
    out.extend(symbols.into_iter().take(80));
    out.join("\n")
}

fn simple_match<'a>(line: &'a str, pattern: &str) -> Option<&'a str> {
    let keyword = pattern.split(r"\s+").next()?;
    let keyword = keyword
        .trim_start_matches('^')
        .trim_start_matches("export")
        .trim_start_matches(r"\s+");
    let idx = line.find(keyword)?;
    let rest = line[idx + keyword.len()..].trim_start();
    let end = rest
        .find(|c: char| !c.is_alphanumeric() && c != '_')
        .unwrap_or(rest.len());
    if end == 0 {
        return None;
    }
    Some(&rest[..end])
}
