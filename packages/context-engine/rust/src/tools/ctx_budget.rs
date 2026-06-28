use std::path::PathBuf;

fn budget_file() -> PathBuf {
    dirs::home_dir()
        .unwrap_or_else(|| PathBuf::from("."))
        .join(".loopguard-ctx")
        .join("budget.json")
}

pub fn handle(action: &str, tokens: Option<i64>, warn_pct: i64) -> String {
    let file = budget_file();
    if let Some(parent) = file.parent() {
        let _ = std::fs::create_dir_all(parent);
    }

    match action {
        "set" => {
            let t = tokens.unwrap_or(100_000);
            let entry = serde_json::json!({ "budget": t, "warn_pct": warn_pct, "set_at": chrono::Local::now().to_rfc3339() });
            let _ = std::fs::write(&file, entry.to_string());
            format!("ctx_budget set — budget: {t} tokens | warn at {warn_pct}%")
        }
        "check" => {
            let raw = std::fs::read_to_string(&file).unwrap_or_default();
            let v: serde_json::Value = serde_json::from_str(&raw).unwrap_or_default();
            let budget = v.get("budget").and_then(|b| b.as_i64()).unwrap_or(0);
            let live = std::fs::read_to_string(
                dirs::home_dir()
                    .unwrap_or_default()
                    .join(".loopguard-ctx")
                    .join("mcp-live.json"),
            )
            .unwrap_or_default();
            let lv: serde_json::Value = serde_json::from_str(&live).unwrap_or_default();
            let used = lv
                .get("tokens_original")
                .and_then(|x| x.as_i64())
                .unwrap_or(0);
            let pct = if budget > 0 { used * 100 / budget } else { 0 };
            let warn = v.get("warn_pct").and_then(|w| w.as_i64()).unwrap_or(80);
            let status = if pct >= warn {
                format!("⚠ WARNING: {pct}% used")
            } else {
                format!("✓ OK: {pct}% used")
            };
            format!(
                "ctx_budget check — {status}\n  Budget: {budget} | Used: {used} | Remaining: {}",
                budget.saturating_sub(used)
            )
        }
        "reset" => {
            let _ = std::fs::remove_file(&file);
            "ctx_budget reset — budget cleared".to_string()
        }
        _ => format!("ctx_budget — unknown action '{action}'. Use: set, check, reset"),
    }
}
