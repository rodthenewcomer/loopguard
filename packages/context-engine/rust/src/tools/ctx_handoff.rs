use std::path::PathBuf;

fn handoff_dir() -> PathBuf {
    dirs::home_dir()
        .unwrap_or_else(|| PathBuf::from("."))
        .join(".loopguard-ctx")
        .join("handoff")
}

pub fn handle(to: &str, summary: &str, include_session: bool) -> String {
    let dir = handoff_dir();
    let _ = std::fs::create_dir_all(&dir);
    let file = dir.join(format!("{to}.json"));

    let session_note = if include_session {
        crate::core::session::SessionState::load_latest()
            .map(|s| s.format_compact())
            .unwrap_or_else(|| "no session".to_string())
    } else {
        String::new()
    };

    let entry = serde_json::json!({
        "to": to,
        "from": "loopguard-ctx",
        "summary": summary,
        "session": session_note,
        "timestamp": chrono::Local::now().to_rfc3339(),
    });

    let _ = std::fs::write(&file, entry.to_string());
    format!(
        "ctx_handoff — context transferred to '{to}'\n\
         File:    {}\n\
         Summary: {}\n\
         Session: {}",
        file.display(),
        summary.chars().take(100).collect::<String>(),
        if include_session {
            "included"
        } else {
            "excluded"
        }
    )
}
