use std::path::PathBuf;

fn live_file() -> PathBuf {
    dirs::home_dir()
        .unwrap_or_else(|| PathBuf::from("."))
        .join(".loopguard-ctx")
        .join("mcp-live.json")
}

pub fn handle(interval: i64) -> String {
    let raw = std::fs::read_to_string(live_file()).unwrap_or_default();
    let v: serde_json::Value = serde_json::from_str(&raw).unwrap_or_default();
    let updated = v
        .get("updated_at")
        .and_then(|x| x.as_str())
        .unwrap_or("never");

    format!(
        "ctx_watch — live context monitor (snapshot)\n\
         Updated:   {updated}\n\
         Interval:  {interval}s\n\
         Saved:     {}t ({}%)\n\
         Calls:     {}\n\
         Files:     {}\n\
         CEP score: {}/100\n\
         Complexity:{}\n\n\
         For live TUI: ctx_shell('watch -n{interval} loopguard-ctx metrics')",
        v.get("tokens_saved").and_then(|x| x.as_u64()).unwrap_or(0),
        v.get("compression_rate")
            .and_then(|x| x.as_u64())
            .unwrap_or(0),
        v.get("tool_calls").and_then(|x| x.as_u64()).unwrap_or(0),
        v.get("files_cached").and_then(|x| x.as_u64()).unwrap_or(0),
        v.get("cep_score").and_then(|x| x.as_u64()).unwrap_or(0),
        v.get("task_complexity")
            .and_then(|x| x.as_str())
            .unwrap_or("?"),
    )
}
