use std::path::PathBuf;

fn sessions_dir() -> PathBuf {
    dirs::home_dir()
        .unwrap_or_else(|| PathBuf::from("."))
        .join(".loopguard-ctx")
        .join("sessions")
}

pub fn handle(session_a: Option<&str>, session_b: Option<&str>) -> String {
    let dir = sessions_dir();
    if !dir.exists() {
        return "ctx_compare — no sessions directory found. Sessions are saved as you work."
            .to_string();
    }

    let mut sessions: Vec<String> = std::fs::read_dir(&dir)
        .ok()
        .into_iter()
        .flatten()
        .flatten()
        .filter_map(|e| e.file_name().into_string().ok())
        .filter(|n| n.ends_with(".json"))
        .collect();
    sessions.sort();

    if sessions.len() < 2 {
        return format!(
            "ctx_compare — need at least 2 sessions to compare (found {})",
            sessions.len()
        );
    }

    let a_name = session_a.unwrap_or_else(|| &sessions[sessions.len() - 2]);
    let b_name = session_b.unwrap_or_else(|| sessions.last().map(|s| s.as_str()).unwrap_or(""));

    let read_stat = |name: &str| -> (u64, u64) {
        let raw = std::fs::read_to_string(dir.join(name)).unwrap_or_default();
        let v: serde_json::Value = serde_json::from_str(&raw).unwrap_or_default();
        let saved = v
            .get("total_tokens_saved")
            .and_then(|x| x.as_u64())
            .unwrap_or(0);
        let orig = v
            .get("total_tokens_original")
            .and_then(|x| x.as_u64())
            .unwrap_or(1);
        (saved, orig)
    };

    let (a_saved, a_orig) = read_stat(a_name);
    let (b_saved, b_orig) = read_stat(b_name);
    let a_rate = a_saved * 100 / a_orig.max(1);
    let b_rate = b_saved * 100 / b_orig.max(1);

    format!(
        "ctx_compare — session comparison\n{}\n  [A] {a_name}: {a_saved}t saved ({a_rate}%)\n  [B] {b_name}: {b_saved}t saved ({b_rate}%)\n  Δ saved: {}t | Δ rate: {}%",
        "═".repeat(50),
        (b_saved as i64 - a_saved as i64),
        (b_rate as i64 - a_rate as i64),
    )
}
