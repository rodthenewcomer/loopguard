use std::path::PathBuf;

fn live_file() -> PathBuf {
    dirs::home_dir()
        .unwrap_or_else(|| PathBuf::from("."))
        .join(".loopguard-ctx")
        .join("mcp-live.json")
}

pub fn handle(format: &str) -> String {
    let file = live_file();
    if !file.exists() {
        return "ctx_gain — no live stats yet (start using ctx_read to populate)".to_string();
    }
    let raw = std::fs::read_to_string(&file).unwrap_or_default();
    let v: serde_json::Value = serde_json::from_str(&raw).unwrap_or_default();

    let saved = v.get("tokens_saved").and_then(|x| x.as_u64()).unwrap_or(0);
    let original = v
        .get("tokens_original")
        .and_then(|x| x.as_u64())
        .unwrap_or(1);
    let rate = v
        .get("compression_rate")
        .and_then(|x| x.as_u64())
        .unwrap_or(0);
    let calls = v.get("tool_calls").and_then(|x| x.as_u64()).unwrap_or(0);
    let cep = v.get("cep_score").and_then(|x| x.as_u64()).unwrap_or(0);

    if format == "full" {
        format!(
            "ctx_gain — real-time compression gain\n{}\n  Saved:  {saved}t / {original}t ({rate}%)\n  Calls:  {calls}\n  CEP:    {cep}/100\n  Cache:  {}%\n  Mode diversity: {}%",
            "═".repeat(50),
            v.get("cache_utilization").and_then(|x| x.as_u64()).unwrap_or(0),
            v.get("mode_diversity").and_then(|x| x.as_u64()).unwrap_or(0),
        )
    } else {
        format!("gain: {saved}t saved ({rate}%) | {calls} calls | CEP {cep}/100")
    }
}
