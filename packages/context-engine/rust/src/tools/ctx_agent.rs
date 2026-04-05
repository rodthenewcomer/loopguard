//! ctx_agent — Multi-agent shared scratchpad.
//!
//! Multiple agents (Claude Code, Cursor, Codex, Antigravity) can write
//! named notes and read each other's notes from the same scratchpad.
//! Enables real-time handoff: start a task in one agent, continue in another.
//!
//! Data lives at ~/.loopguard-ctx/agent-scratchpad.json — local only.

use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::path::PathBuf;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AgentNote {
    pub id: String,
    pub agent: String,
    pub label: String,
    pub content: String,
    pub project: String,
    pub created_at: i64,
    pub updated_at: i64,
    pub ttl_hours: Option<u32>,
}

#[derive(Debug, Default, Serialize, Deserialize)]
struct Scratchpad {
    notes: Vec<AgentNote>,
}

fn scratchpad_path() -> PathBuf {
    dirs::home_dir()
        .unwrap_or_else(|| PathBuf::from("."))
        .join(".loopguard-ctx")
        .join("agent-scratchpad.json")
}

fn current_project() -> String {
    std::env::current_dir()
        .ok()
        .and_then(|p| p.file_name().map(|n| n.to_string_lossy().to_string()))
        .unwrap_or_else(|| "unknown".to_string())
}

fn now_ms() -> i64 {
    chrono::Local::now().timestamp_millis()
}

fn load() -> Scratchpad {
    let path = scratchpad_path();
    if !path.exists() {
        return Scratchpad::default();
    }
    std::fs::read_to_string(&path)
        .ok()
        .and_then(|s| serde_json::from_str(&s).ok())
        .unwrap_or_default()
}

fn save(pad: &Scratchpad) -> bool {
    let path = scratchpad_path();
    if let Some(parent) = path.parent() {
        let _ = std::fs::create_dir_all(parent);
    }
    serde_json::to_string_pretty(pad)
        .ok()
        .and_then(|s| std::fs::write(&path, s).ok())
        .is_some()
}

fn purge_expired(pad: &mut Scratchpad) {
    let now = now_ms();
    pad.notes.retain(|n| {
        match n.ttl_hours {
            None => true,
            Some(h) => {
                let expires = n.created_at + (h as i64 * 3_600_000);
                now < expires
            }
        }
    });
}

pub fn handle(action: &str, args: &HashMap<String, String>) -> String {
    match action {
        "write"  => handle_write(args),
        "read"   => handle_read(args),
        "list"   => handle_list(args),
        "delete" => handle_delete(args),
        "clear"  => handle_clear(args),
        _ => format!(
            "Unknown action '{action}'. Use: write, read, list, delete, clear"
        ),
    }
}

fn handle_write(args: &HashMap<String, String>) -> String {
    let label = match args.get("label") {
        Some(v) => v.clone(),
        None => return "label is required for write".to_string(),
    };
    let content = match args.get("content") {
        Some(v) => v.clone(),
        None => return "content is required for write".to_string(),
    };
    let agent = args
        .get("agent")
        .cloned()
        .unwrap_or_else(|| "unknown".to_string());
    let project = args.get("project").cloned().unwrap_or_else(current_project);
    let ttl_hours = args.get("ttl_hours").and_then(|v| v.parse::<u32>().ok());

    let now = now_ms();
    let mut pad = load();
    purge_expired(&mut pad);

    // Update existing note with same label + project
    let existing = pad
        .notes
        .iter_mut()
        .find(|n| n.label == label && n.project == project);

    if let Some(note) = existing {
        note.content = content.clone();
        note.agent = agent.clone();
        note.updated_at = now;
        if let Some(ttl) = ttl_hours {
            note.ttl_hours = Some(ttl);
        }
        save(&pad);
        return format!(
            "Agent note updated — [{agent}] {label}\n  {}",
            content.chars().take(120).collect::<String>()
        );
    }

    let id = format!("note_{:x}", now as u64 & 0xFFFFFF);
    pad.notes.push(AgentNote {
        id: id.clone(),
        agent: agent.clone(),
        label: label.clone(),
        content: content.clone(),
        project,
        created_at: now,
        updated_at: now,
        ttl_hours,
    });

    // Cap at 500 notes total
    if pad.notes.len() > 500 {
        pad.notes.sort_by(|a, b| b.updated_at.cmp(&a.updated_at));
        pad.notes.truncate(500);
    }

    save(&pad);
    format!(
        "Agent note written [{}] — [{agent}] {label}\n  {}",
        id,
        content.chars().take(120).collect::<String>()
    )
}

fn handle_read(args: &HashMap<String, String>) -> String {
    let label = match args.get("label") {
        Some(v) => v.clone(),
        None => return "label is required for read".to_string(),
    };
    let project = args.get("project").cloned().unwrap_or_else(current_project);

    let mut pad = load();
    purge_expired(&mut pad);

    // Exact match
    if let Some(note) = pad
        .notes
        .iter()
        .find(|n| n.label == label && n.project == project)
    {
        let age = format_age(note.updated_at);
        return format!(
            "[{agent}] {label}  ({age})\n{content}",
            agent = note.agent,
            label = note.label,
            age = age,
            content = note.content
        );
    }

    // Fuzzy: label contains query
    let label_lower = label.to_lowercase();
    let mut matches: Vec<&AgentNote> = pad
        .notes
        .iter()
        .filter(|n| {
            n.project == project && n.label.to_lowercase().contains(&label_lower)
        })
        .collect();
    matches.sort_by(|a, b| b.updated_at.cmp(&a.updated_at));

    if matches.is_empty() {
        return format!("No agent note found for label '{label}' in project '{project}'.");
    }

    let mut out = vec![format!(
        "ctx_agent — {} fuzzy match(es) for '{label}':",
        matches.len()
    )];
    for note in matches.iter().take(5) {
        out.push(format!(
            "\n[{agent}] {label}  ({age})\n{content}",
            agent = note.agent,
            label = note.label,
            age = format_age(note.updated_at),
            content = note.content.chars().take(300).collect::<String>()
        ));
    }
    out.join("\n")
}

fn handle_list(args: &HashMap<String, String>) -> String {
    let project = args.get("project").cloned().unwrap_or_else(current_project);
    let agent_filter = args.get("agent").cloned();
    let limit = args
        .get("limit")
        .and_then(|v| v.parse::<usize>().ok())
        .unwrap_or(20);

    let mut pad = load();
    purge_expired(&mut pad);

    let mut notes: Vec<&AgentNote> = pad
        .notes
        .iter()
        .filter(|n| {
            n.project == project
                && agent_filter
                    .as_deref()
                    .is_none_or(|a| n.agent == a)
        })
        .collect();
    notes.sort_by(|a, b| b.updated_at.cmp(&a.updated_at));

    if notes.is_empty() {
        return format!("No agent notes for project '{project}'.");
    }

    let total = notes.len();
    notes.truncate(limit);

    // Group by agent
    let mut by_agent: HashMap<&str, Vec<&AgentNote>> = HashMap::new();
    for n in &notes {
        by_agent.entry(&n.agent).or_default().push(n);
    }

    let mut out = vec![format!(
        "ctx_agent scratchpad — {total} notes for '{project}'"
    )];
    let mut agents: Vec<&str> = by_agent.keys().cloned().collect();
    agents.sort_unstable();

    for agent in agents {
        out.push(format!("\n[{agent}]"));
        for note in &by_agent[agent] {
            out.push(format!(
                "  {label}  ({age}): {preview}",
                label = note.label,
                age = format_age(note.updated_at),
                preview = note.content.chars().take(80).collect::<String>()
            ));
        }
    }

    out.join("\n")
}

fn handle_delete(args: &HashMap<String, String>) -> String {
    let label = match args.get("label") {
        Some(v) => v.clone(),
        None => return "label is required for delete".to_string(),
    };
    let project = args.get("project").cloned().unwrap_or_else(current_project);
    let mut pad = load();
    let before = pad.notes.len();
    pad.notes.retain(|n| !(n.label == label && n.project == project));
    let removed = before - pad.notes.len();
    if removed == 0 {
        return format!("No note found for label '{label}' in project '{project}'.");
    }
    save(&pad);
    format!("Deleted note '{label}' from project '{project}'.")
}

fn handle_clear(args: &HashMap<String, String>) -> String {
    let project = args.get("project").cloned().unwrap_or_else(current_project);
    let mut pad = load();
    let before = pad.notes.len();
    pad.notes.retain(|n| n.project != project);
    let removed = before - pad.notes.len();
    save(&pad);
    format!("Cleared {removed} agent notes for project '{project}'.")
}

fn format_age(timestamp_ms: i64) -> String {
    let now = chrono::Local::now().timestamp_millis();
    let diff = ((now - timestamp_ms) / 1000).max(0);
    if diff < 60 {
        "just now".to_string()
    } else if diff < 3600 {
        format!("{}m ago", diff / 60)
    } else if diff < 86400 {
        format!("{}h ago", diff / 3600)
    } else {
        format!("{}d ago", diff / 86400)
    }
}
