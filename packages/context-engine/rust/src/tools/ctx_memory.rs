//! ctx_memory — Local session pattern memory.
//!
//! Stores a local index of error→fix mappings so LoopGuard can surface
//! "last time this error appeared, the fix was in X:line" automatically.
//!
//! Data lives at ~/.loopguard-ctx/memory.json — never synced to server.

use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::path::PathBuf;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MemoryEntry {
    pub id: String,
    /// Normalised error fingerprint (lowercase, stripped of line numbers)
    pub error_fingerprint: String,
    /// Raw error text (first 200 chars)
    pub error_text: String,
    /// File where the fix was applied
    pub fix_file: String,
    /// Line number of the fix (optional)
    pub fix_line: Option<u32>,
    /// Short description of what the fix was
    pub fix_description: String,
    /// Project root this entry was recorded in
    pub project: String,
    /// How many times this same error has been seen + fixed
    pub seen_count: u32,
    /// Unix timestamp (ms) of last occurrence
    pub last_seen: i64,
}

#[derive(Debug, Default, Serialize, Deserialize)]
struct MemoryStore {
    entries: Vec<MemoryEntry>,
}

fn memory_path() -> PathBuf {
    dirs::home_dir()
        .unwrap_or_else(|| PathBuf::from("."))
        .join(".loopguard-ctx")
        .join("memory.json")
}

fn load() -> MemoryStore {
    let path = memory_path();
    if !path.exists() {
        return MemoryStore::default();
    }
    std::fs::read_to_string(&path)
        .ok()
        .and_then(|s| serde_json::from_str(&s).ok())
        .unwrap_or_default()
}

fn save(store: &MemoryStore) -> bool {
    let path = memory_path();
    if let Some(parent) = path.parent() {
        let _ = std::fs::create_dir_all(parent);
    }
    serde_json::to_string_pretty(store)
        .ok()
        .and_then(|s| std::fs::write(&path, s).ok())
        .is_some()
}

fn fingerprint(error_text: &str) -> String {
    // Strip line numbers, column numbers, and UUIDs — keep the semantic core
    let lower = error_text.to_lowercase();
    let stripped: String = lower
        .chars()
        .map(|c| if c.is_ascii_digit() { '0' } else { c })
        .collect();
    // Trim whitespace and take first 120 chars
    stripped.trim().chars().take(120).collect()
}

fn similarity(a: &str, b: &str) -> f32 {
    // Jaccard similarity on word sets — good enough for error matching
    let words_a: std::collections::HashSet<&str> = a.split_whitespace().collect();
    let words_b: std::collections::HashSet<&str> = b.split_whitespace().collect();
    if words_a.is_empty() && words_b.is_empty() {
        return 1.0;
    }
    let intersection = words_a.intersection(&words_b).count();
    let union = words_a.union(&words_b).count();
    if union == 0 {
        0.0
    } else {
        intersection as f32 / union as f32
    }
}

pub fn handle(action: &str, args: &HashMap<String, String>) -> String {
    match action {
        "record" => handle_record(args),
        "query"  => handle_query(args),
        "list"   => handle_list(args),
        "clear"  => handle_clear(),
        "stats"  => handle_stats(),
        _ => format!("Unknown action '{action}'. Use: record, query, list, clear, stats"),
    }
}

fn handle_record(args: &HashMap<String, String>) -> String {
    let error_text = match args.get("error_text") {
        Some(v) => v.clone(),
        None => return "error_text is required for record".to_string(),
    };
    let fix_file = match args.get("fix_file") {
        Some(v) => v.clone(),
        None => return "fix_file is required for record".to_string(),
    };
    let fix_description = args.get("fix_description").cloned().unwrap_or_default();
    let fix_line = args.get("fix_line").and_then(|v| v.parse::<u32>().ok());
    let project = args.get("project").cloned().unwrap_or_else(|| {
        std::env::current_dir()
            .ok()
            .and_then(|p| p.file_name().map(|n| n.to_string_lossy().to_string()))
            .unwrap_or_else(|| "unknown".to_string())
    });

    let fp = fingerprint(&error_text);
    let mut store = load();

    // Find existing entry with high similarity
    let existing_idx = store.entries.iter().position(|e| {
        similarity(&e.error_fingerprint, &fp) > 0.72
    });

    let now = chrono::Local::now().timestamp_millis();

    if let Some(idx) = existing_idx {
        store.entries[idx].seen_count += 1;
        store.entries[idx].last_seen = now;
        store.entries[idx].fix_file = fix_file.clone();
        store.entries[idx].fix_line = fix_line;
        if !fix_description.is_empty() {
            store.entries[idx].fix_description = fix_description;
        }
        let count = store.entries[idx].seen_count;
        save(&store);
        format!(
            "Memory updated — seen {count}x\n  Error: {}\n  Fix: {}:{}",
            error_text.chars().take(80).collect::<String>(),
            crate::core::protocol::shorten_path(&fix_file),
            fix_line.map_or("?".to_string(), |l| l.to_string()),
        )
    } else {
        let id = format!("mem_{:x}", now as u64 & 0xFFFFFF);
        store.entries.push(MemoryEntry {
            id: id.clone(),
            error_fingerprint: fp,
            error_text: error_text.chars().take(200).collect(),
            fix_file: fix_file.clone(),
            fix_line,
            fix_description,
            project,
            seen_count: 1,
            last_seen: now,
        });
        // Keep most recent 500 entries
        if store.entries.len() > 500 {
            store.entries.sort_by(|a, b| b.last_seen.cmp(&a.last_seen));
            store.entries.truncate(500);
        }
        save(&store);
        format!(
            "Memory recorded [{}]\n  Error: {}\n  Fix: {}:{}",
            id,
            error_text.chars().take(80).collect::<String>(),
            crate::core::protocol::shorten_path(&fix_file),
            fix_line.map_or("?".to_string(), |l| l.to_string()),
        )
    }
}

fn handle_query(args: &HashMap<String, String>) -> String {
    let query = match args.get("query") {
        Some(v) => v.clone(),
        None => return "query is required".to_string(),
    };
    let limit = args.get("limit")
        .and_then(|v| v.parse::<usize>().ok())
        .unwrap_or(5);

    let store = load();
    if store.entries.is_empty() {
        return "Memory is empty — no patterns recorded yet.\nRun ctx_memory(action='record', ...) after fixing a loop to start building memory.".to_string();
    }

    let query_fp = fingerprint(&query);
    let mut scored: Vec<(f32, &MemoryEntry)> = store.entries.iter()
        .map(|e| {
            let score = similarity(&e.error_fingerprint, &query_fp)
                + similarity(&e.error_text.to_lowercase(), &query.to_lowercase()) * 0.5;
            (score, e)
        })
        .filter(|(score, _)| *score > 0.1)
        .collect();

    scored.sort_by(|a, b| b.0.partial_cmp(&a.0).unwrap_or(std::cmp::Ordering::Equal));
    scored.truncate(limit);

    if scored.is_empty() {
        return format!("No matching patterns for: {}", query.chars().take(80).collect::<String>());
    }

    let mut out = vec![format!(
        "ctx_memory — {} match(es) for: {}",
        scored.len(),
        query.chars().take(72).collect::<String>()
    )];
    out.push("═".repeat(50));

    for (score, entry) in &scored {
        out.push(format!(
            "  [{:.0}%] {} (seen {}x, last: {})",
            score * 100.0,
            entry.error_text.chars().take(72).collect::<String>(),
            entry.seen_count,
            format_age(entry.last_seen),
        ));
        let line_str = entry.fix_line.map_or(String::new(), |l| format!(":{l}"));
        out.push(format!(
            "         → {}{}",
            crate::core::protocol::shorten_path(&entry.fix_file),
            line_str,
        ));
        if !entry.fix_description.is_empty() {
            out.push(format!("           {}", entry.fix_description.chars().take(100).collect::<String>()));
        }
    }

    out.join("\n")
}

fn handle_list(args: &HashMap<String, String>) -> String {
    let limit = args.get("limit")
        .and_then(|v| v.parse::<usize>().ok())
        .unwrap_or(20);
    let project_filter = args.get("project").cloned();

    let store = load();
    if store.entries.is_empty() {
        return "Memory is empty.".to_string();
    }

    let mut entries: Vec<&MemoryEntry> = store.entries.iter()
        .filter(|e| project_filter.as_deref().is_none_or(|p| e.project.contains(p)))
        .collect();
    entries.sort_by(|a, b| b.last_seen.cmp(&a.last_seen));
    entries.truncate(limit);

    let mut out = vec![format!("ctx_memory — {} entries (most recent first)", entries.len())];
    out.push("═".repeat(50));

    for entry in entries {
        let line_str = entry.fix_line.map_or(String::new(), |l| format!(":{l}"));
        out.push(format!(
            "  [{}] {} ({}x)",
            entry.id,
            entry.error_text.chars().take(60).collect::<String>(),
            entry.seen_count,
        ));
        out.push(format!(
            "         → {}{}  [{}]",
            crate::core::protocol::shorten_path(&entry.fix_file),
            line_str,
            format_age(entry.last_seen),
        ));
    }

    out.join("\n")
}

fn handle_clear() -> String {
    let store = MemoryStore::default();
    if save(&store) {
        "Memory cleared.".to_string()
    } else {
        "Failed to clear memory store.".to_string()
    }
}

fn handle_stats() -> String {
    let store = load();
    let total = store.entries.len();
    let mut by_project: HashMap<&str, usize> = HashMap::new();
    for e in &store.entries {
        *by_project.entry(&e.project).or_insert(0) += 1;
    }
    let top_seen = store.entries.iter()
        .max_by_key(|e| e.seen_count)
        .map(|e| format!("  Most seen ({} times): {}", e.seen_count, e.error_text.chars().take(72).collect::<String>()))
        .unwrap_or_default();

    let mut out = vec!["ctx_memory stats".to_string(), "═".repeat(40)];
    out.push(format!("Total entries: {total}"));
    if !top_seen.is_empty() {
        out.push(top_seen);
    }
    if !by_project.is_empty() {
        out.push("By project:".to_string());
        let mut projects: Vec<(&&str, &usize)> = by_project.iter().collect();
        projects.sort_by(|a, b| b.1.cmp(a.1));
        for (proj, count) in projects.iter().take(5) {
            out.push(format!("  {proj}: {count}"));
        }
    }
    out.join("\n")
}

fn format_age(timestamp_ms: i64) -> String {
    let now = chrono::Local::now().timestamp_millis();
    let diff_secs = ((now - timestamp_ms) / 1000).max(0);
    if diff_secs < 60 {
        "just now".to_string()
    } else if diff_secs < 3600 {
        format!("{}m ago", diff_secs / 60)
    } else if diff_secs < 86400 {
        format!("{}h ago", diff_secs / 3600)
    } else {
        format!("{}d ago", diff_secs / 86400)
    }
}
