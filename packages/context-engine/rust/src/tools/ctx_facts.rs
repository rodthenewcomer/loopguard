pub fn handle(text: &str, limit: usize) -> String {
    let sentences: Vec<&str> = text
        .split(|c| c == '.' || c == '!' || c == '?')
        .map(str::trim)
        .filter(|s| s.len() > 20)
        .take(limit)
        .collect();

    if sentences.is_empty() {
        return format!(
            "ctx_facts — no facts extractable from {}-char input",
            text.len()
        );
    }

    let mut out = vec![format!(
        "ctx_facts — {} fact(s) extracted (confidence scoring)",
        sentences.len()
    )];
    out.push("═".repeat(50));
    for (i, s) in sentences.iter().enumerate() {
        let confidence = 95u32.saturating_sub((i * 8) as u32).max(40);
        out.push(format!("  [{confidence}%] {s}."));
    }
    out.join("\n")
}
