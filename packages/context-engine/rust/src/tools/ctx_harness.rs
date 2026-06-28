use std::path::PathBuf;

fn harness_file() -> PathBuf {
    dirs::home_dir()
        .unwrap_or_else(|| PathBuf::from("."))
        .join(".loopguard-ctx")
        .join("harness.json")
}

pub fn handle(action: &str, agent: Option<&str>, task: Option<&str>) -> String {
    let file = harness_file();
    if let Some(parent) = file.parent() {
        let _ = std::fs::create_dir_all(parent);
    }

    let mut registry: serde_json::Value = std::fs::read_to_string(&file)
        .ok()
        .and_then(|s| serde_json::from_str(&s).ok())
        .unwrap_or_else(|| serde_json::json!({"agents": []}));

    match action {
        "status" | "list" => {
            let agents = registry
                .get("agents")
                .and_then(|a| a.as_array())
                .cloned()
                .unwrap_or_default();
            if agents.is_empty() {
                return "ctx_harness — no agents registered".to_string();
            }
            let lines: Vec<String> = agents
                .iter()
                .map(|a| {
                    let name = a.get("name").and_then(|n| n.as_str()).unwrap_or("?");
                    let task = a.get("task").and_then(|t| t.as_str()).unwrap_or("idle");
                    format!("  {name}: {task}")
                })
                .collect();
            format!(
                "ctx_harness — {} agent(s)\n{}",
                agents.len(),
                lines.join("\n")
            )
        }
        "register" => {
            let name = agent.unwrap_or("unknown");
            let t = task.unwrap_or("idle");
            let agents = registry.get_mut("agents").and_then(|a| a.as_array_mut());
            if let Some(arr) = agents {
                arr.push(serde_json::json!({ "name": name, "task": t, "registered": chrono::Local::now().to_rfc3339() }));
            }
            let _ = std::fs::write(&file, registry.to_string());
            format!("ctx_harness register — '{name}' registered with task: {t}")
        }
        "deregister" => {
            let name = agent.unwrap_or("unknown");
            if let Some(arr) = registry.get_mut("agents").and_then(|a| a.as_array_mut()) {
                arr.retain(|a| a.get("name").and_then(|n| n.as_str()) != Some(name));
            }
            let _ = std::fs::write(&file, registry.to_string());
            format!("ctx_harness deregister — '{name}' removed")
        }
        _ => format!(
            "ctx_harness — unknown action '{action}'. Use: status, list, register, deregister"
        ),
    }
}
