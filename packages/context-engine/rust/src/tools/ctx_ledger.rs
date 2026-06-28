use std::path::PathBuf;

fn ledger_file() -> PathBuf {
    dirs::home_dir()
        .unwrap_or_else(|| PathBuf::from("."))
        .join(".loopguard-ctx")
        .join("ledger.jsonl")
}

fn simple_hash(s: &str) -> String {
    let mut h: u64 = 14695981039346656037;
    for byte in s.bytes() {
        h ^= byte as u64;
        h = h.wrapping_mul(1099511628211);
    }
    format!("{h:016x}")
}

pub fn handle(action: &str, amount: Option<i64>, note: Option<&str>) -> String {
    let file = ledger_file();
    if let Some(parent) = file.parent() {
        let _ = std::fs::create_dir_all(parent);
    }

    match action {
        "append" => {
            let prev_lines = std::fs::read_to_string(&file).unwrap_or_default();
            let prev_hash = prev_lines
                .lines()
                .last()
                .and_then(|l| serde_json::from_str::<serde_json::Value>(l).ok())
                .and_then(|v| {
                    v.get("hash")
                        .and_then(|h| h.as_str())
                        .map(|s| s.to_string())
                })
                .unwrap_or_else(|| "genesis".to_string());

            let ts = chrono::Local::now().to_rfc3339();
            let payload = format!("{}|{}|{}", ts, amount.unwrap_or(0), note.unwrap_or(""));
            let hash = simple_hash(&format!("{prev_hash}|{payload}"));
            let entry = serde_json::json!({ "ts": ts, "tokens_saved": amount.unwrap_or(0), "note": note, "prev": prev_hash, "hash": hash });
            let _ = std::fs::OpenOptions::new()
                .append(true)
                .create(true)
                .open(&file)
                .and_then(|mut f| {
                    use std::io::Write;
                    writeln!(f, "{entry}")
                });
            format!("ctx_ledger append — entry recorded [hash: {hash}]")
        }
        "tail" => {
            let raw = std::fs::read_to_string(&file).unwrap_or_default();
            let last: Vec<&str> = raw.lines().rev().take(5).collect();
            format!(
                "ctx_ledger tail — last 5 entries:\n{}",
                last.into_iter().rev().collect::<Vec<_>>().join("\n")
            )
        }
        "verify" => {
            let raw = std::fs::read_to_string(&file).unwrap_or_default();
            let count = raw.lines().count();
            format!("ctx_ledger verify — {count} entries in ledger (chain integrity check: stub)")
        }
        "export" => {
            let raw = std::fs::read_to_string(&file).unwrap_or_default();
            format!("ctx_ledger export:\n{raw}")
        }
        _ => format!("ctx_ledger — unknown action '{action}'. Use: append, tail, verify, export"),
    }
}
