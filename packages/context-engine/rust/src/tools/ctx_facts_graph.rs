pub fn handle(text: &str, project: Option<&str>) -> String {
    let project = project.unwrap_or("current");
    let facts: Vec<&str> = text
        .split(|c| c == '.' || c == '!' || c == '?')
        .map(str::trim)
        .filter(|s| s.len() > 20)
        .take(12)
        .collect();

    if facts.is_empty() {
        return format!("ctx_facts_graph - no graph facts extracted for project '{project}'");
    }

    let mut out = vec![format!(
        "ctx_facts_graph - {} fact node(s) extracted for project '{project}'",
        facts.len()
    )];
    out.push("=".repeat(50));
    for (idx, fact) in facts.iter().enumerate() {
        out.push(format!("  fact:{idx} -> {fact}"));
    }
    out.push("Use ctx_graph_update to persist selected nodes.".to_string());
    out.join("\n")
}
