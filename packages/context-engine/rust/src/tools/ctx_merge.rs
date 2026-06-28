pub fn handle(sources: &[String]) -> String {
    if sources.is_empty() {
        return "ctx_merge — no sources provided. Pass agent label names from ctx_agent."
            .to_string();
    }

    let mut parts: Vec<String> = Vec::new();
    let mut missing: Vec<&str> = Vec::new();

    for source in sources {
        // Try agent scratchpad first, then shared slots
        let from_agent = read_agent_note(source);
        if let Some(content) = from_agent {
            parts.push(format!("--- [{source}] ---\n{content}"));
        } else {
            missing.push(source);
        }
    }

    if parts.is_empty() {
        return format!("ctx_merge — none of the sources found: {:?}\nUse ctx_agent(action=list) to see available notes.", missing);
    }

    format!(
        "ctx_merge — merged {} source(s){}\n{}\n{}",
        parts.len(),
        if missing.is_empty() {
            String::new()
        } else {
            format!(" ({} missing)", missing.len())
        },
        "═".repeat(50),
        parts.join("\n\n")
    )
}

fn read_agent_note(label: &str) -> Option<String> {
    let file = dirs::home_dir()?
        .join(".loopguard-ctx")
        .join("agent-scratchpad.json");
    let raw = std::fs::read_to_string(file).ok()?;
    let v: serde_json::Value = serde_json::from_str(&raw).ok()?;
    v.get("notes")?
        .as_array()?
        .iter()
        .find(|n| n.get("label").and_then(|l| l.as_str()) == Some(label))
        .and_then(|n| n.get("content")?.as_str().map(|s| s.to_string()))
}
