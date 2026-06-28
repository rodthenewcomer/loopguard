pub fn handle(path: &str, questions: &[String]) -> String {
    let content = std::fs::read_to_string(path).unwrap_or_default();
    let n = questions.len();
    let mut results: Vec<String> = Vec::new();

    for (i, q) in questions.iter().enumerate() {
        let keywords: Vec<&str> = q.split_whitespace().filter(|w| w.len() > 3).collect();
        let found = keywords
            .iter()
            .any(|kw| content.to_lowercase().contains(&kw.to_lowercase()));
        results.push(format!(
            "  Q{}: {} — {}",
            i + 1,
            q.chars().take(60).collect::<String>(),
            if found {
                "✓ answerable"
            } else {
                "✗ may be missing"
            }
        ));
    }

    format!(
        "ctx_verify — compression verification for {}\n\
         Questions: {n}\n{}\n{}",
        crate::core::protocol::shorten_path(path),
        "═".repeat(50),
        results.join("\n")
    )
}
