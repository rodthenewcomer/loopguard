pub fn handle(text: &str, limit: usize) -> String {
    let mut quotes = Vec::new();
    let mut chars = text.chars().peekable();
    let mut in_quote = false;
    let mut current = String::new();

    for c in chars.by_ref() {
        if c == '"' {
            if in_quote && current.len() > 10 {
                quotes.push(current.clone());
                current.clear();
            }
            in_quote = !in_quote;
        } else if in_quote {
            current.push(c);
        }
    }

    if quotes.is_empty() {
        return format!(
            "ctx_quotes — no quoted strings found in {}-char input",
            text.len()
        );
    }

    let shown: Vec<&String> = quotes.iter().take(limit).collect();
    let mut out = vec![format!("ctx_quotes — {} quote(s) found", shown.len())];
    out.push("═".repeat(50));
    for (i, q) in shown.iter().enumerate() {
        out.push(format!(
            "  [{}] \"{}\"",
            i + 1,
            q.chars().take(120).collect::<String>()
        ));
    }
    out.join("\n")
}
