//! ctx_knowledge — Persistent categorised project knowledge store.
//!
//! Stores facts, decisions, and conventions by category so any agent
//! in the same project can retrieve them without re-deriving them.
//!
//! Data lives at ~/.loopguard-ctx/knowledge.json — never leaves the device.

use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::path::PathBuf;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct KnowledgeEntry {
    pub key: String,
    pub category: String,
    pub value: String,
    pub project: String,
    pub created_at: i64,
    pub updated_at: i64,
}

#[derive(Debug, Default, Serialize, Deserialize)]
struct KnowledgeStore {
    entries: Vec<KnowledgeEntry>,
}

fn store_path() -> PathBuf {
    dirs::home_dir()
        .unwrap_or_else(|| PathBuf::from("."))
        .join(".loopguard-ctx")
        .join("knowledge.json")
}

fn current_project() -> String {
    std::env::current_dir()
        .ok()
        .and_then(|p| p.file_name().map(|n| n.to_string_lossy().to_string()))
        .unwrap_or_else(|| "unknown".to_string())
}

fn load() -> KnowledgeStore {
    let path = store_path();
    if !path.exists() {
        return KnowledgeStore::default();
    }
    std::fs::read_to_string(&path)
        .ok()
        .and_then(|s| serde_json::from_str(&s).ok())
        .unwrap_or_default()
}

fn save(store: &KnowledgeStore) -> bool {
    let path = store_path();
    if let Some(parent) = path.parent() {
        let _ = std::fs::create_dir_all(parent);
    }
    serde_json::to_string_pretty(store)
        .ok()
        .and_then(|s| std::fs::write(&path, s).ok())
        .is_some()
}

pub fn handle(action: &str, args: &HashMap<String, String>) -> String {
    match action {
        "set"    => handle_set(args),
        "get"    => handle_get(args),
        "list"   => handle_list(args),
        "delete" => handle_delete(args),
        "clear"  => handle_clear(args),
        _ => format!(
            "Unknown action '{action}'. Use: set, get, list, delete, clear"
        ),
    }
}

fn handle_set(args: &HashMap<String, String>) -> String {
    let key = match args.get("key") {
        Some(v) => v.clone(),
        None => return "key is required for set".to_string(),
    };
    let value = match args.get("value") {
        Some(v) => v.clone(),
        None => return "value is required for set".to_string(),
    };
    let category = args
        .get("category")
        .cloned()
        .unwrap_or_else(|| "general".to_string());
    let project = args.get("project").cloned().unwrap_or_else(current_project);

    let now = chrono::Local::now().timestamp_millis();
    let mut store = load();

    let existing = store
        .entries
        .iter_mut()
        .find(|e| e.key == key && e.project == project);

    if let Some(entry) = existing {
        entry.value = value.clone();
        entry.category = category.clone();
        entry.updated_at = now;
        save(&store);
        format!(
            "Knowledge updated — [{category}] {key}\n  Value: {}",
            value.chars().take(120).collect::<String>()
        )
    } else {
        store.entries.push(KnowledgeEntry {
            key: key.clone(),
            category: category.clone(),
            value: value.clone(),
            project,
            created_at: now,
            updated_at: now,
        });
        // Cap at 2000 entries per project
        if store.entries.len() > 2000 {
            store.entries.sort_by(|a, b| b.updated_at.cmp(&a.updated_at));
            store.entries.truncate(2000);
        }
        save(&store);
        format!(
            "Knowledge stored — [{category}] {key}\n  Value: {}",
            value.chars().take(120).collect::<String>()
        )
    }
}

fn handle_get(args: &HashMap<String, String>) -> String {
    let key = match args.get("key") {
        Some(v) => v.clone(),
        None => return "key is required for get".to_string(),
    };
    let project = args.get("project").cloned().unwrap_or_else(current_project);
    let store = load();

    // Exact match first
    if let Some(entry) = store
        .entries
        .iter()
        .find(|e| e.key == key && e.project == project)
    {
        return format!(
            "[{}] {}\n{}",
            entry.category, entry.key, entry.value
        );
    }

    // Fuzzy: key contains query or query contains key
    let key_lower = key.to_lowercase();
    let mut matches: Vec<&KnowledgeEntry> = store
        .entries
        .iter()
        .filter(|e| {
            e.project == project
                && (e.key.to_lowercase().contains(&key_lower)
                    || key_lower.contains(&e.key.to_lowercase()))
        })
        .collect();
    matches.sort_by(|a, b| b.updated_at.cmp(&a.updated_at));

    if matches.is_empty() {
        return format!("No knowledge found for key '{key}' in project '{project}'.");
    }

    let mut out = vec![format!(
        "ctx_knowledge — {} fuzzy match(es) for '{key}':",
        matches.len()
    )];
    for entry in matches.iter().take(5) {
        out.push(format!(
            "  [{category}] {key}: {value}",
            category = entry.category,
            key = entry.key,
            value = entry.value.chars().take(120).collect::<String>()
        ));
    }
    out.join("\n")
}

fn handle_list(args: &HashMap<String, String>) -> String {
    let project = args.get("project").cloned().unwrap_or_else(current_project);
    let category_filter = args.get("category").cloned();
    let limit = args
        .get("limit")
        .and_then(|v| v.parse::<usize>().ok())
        .unwrap_or(30);

    let store = load();
    let mut entries: Vec<&KnowledgeEntry> = store
        .entries
        .iter()
        .filter(|e| {
            e.project == project
                && category_filter
                    .as_deref()
                    .is_none_or(|cat| e.category == cat)
        })
        .collect();
    entries.sort_by(|a, b| {
        a.category.cmp(&b.category).then(a.key.cmp(&b.key))
    });

    if entries.is_empty() {
        let cat_hint = category_filter
            .as_deref()
            .map(|c| format!(" in category '{c}'"))
            .unwrap_or_default();
        return format!(
            "No knowledge entries{cat_hint} for project '{project}'."
        );
    }

    // Group by category
    let mut by_cat: HashMap<&str, Vec<&KnowledgeEntry>> = HashMap::new();
    for e in entries.iter().take(limit) {
        by_cat.entry(&e.category).or_default().push(e);
    }

    let mut out = vec![format!(
        "ctx_knowledge — {} entries for '{project}'",
        entries.len().min(limit)
    )];
    let mut cats: Vec<&str> = by_cat.keys().cloned().collect();
    cats.sort_unstable();

    for cat in cats {
        out.push(format!("\n[{cat}]"));
        for entry in &by_cat[cat] {
            out.push(format!(
                "  {}: {}",
                entry.key,
                entry.value.chars().take(100).collect::<String>()
            ));
        }
    }

    out.join("\n")
}

fn handle_delete(args: &HashMap<String, String>) -> String {
    let key = match args.get("key") {
        Some(v) => v.clone(),
        None => return "key is required for delete".to_string(),
    };
    let project = args.get("project").cloned().unwrap_or_else(current_project);
    let mut store = load();
    let before = store.entries.len();
    store.entries.retain(|e| !(e.key == key && e.project == project));
    let removed = before - store.entries.len();
    if removed == 0 {
        return format!("No entry found for key '{key}' in project '{project}'.");
    }
    save(&store);
    format!("Deleted '{key}' from project '{project}'.")
}

fn handle_clear(args: &HashMap<String, String>) -> String {
    let project = args.get("project").cloned().unwrap_or_else(current_project);
    let mut store = load();
    let before = store.entries.len();
    store.entries.retain(|e| e.project != project);
    let removed = before - store.entries.len();
    save(&store);
    format!("Cleared {removed} entries for project '{project}'.")
}
