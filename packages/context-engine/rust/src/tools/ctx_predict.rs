//! ctx_predict — Predictive context pre-selection.
//!
//! Given a task description, ranks files in the workspace by predicted
//! relevance before any code is read. Selection happens before the prompt,
//! not compression after — this is the core v3 moat.

use std::collections::HashSet;
use std::path::Path;

const STOP_WORDS: &[&str] = &[
    "a", "an", "the", "in", "on", "at", "to", "for", "of", "and", "or",
    "but", "is", "it", "this", "that", "with", "from", "by", "as", "be",
    "are", "was", "were", "will", "would", "should", "could", "have",
    "has", "had", "do", "does", "did", "not", "no", "i", "we", "you",
    "they", "he", "she", "my", "our", "your", "their", "its",
];

const SKIP_DIRS: &[&str] = &[
    ".git", "node_modules", "target", "dist", "build", ".next",
    "__pycache__", ".cache", "coverage", ".nyc_output",
];

const SKIP_EXTS: &[&str] = &[
    "png", "jpg", "jpeg", "gif", "svg", "ico", "woff", "woff2", "ttf",
    "eot", "otf", "mp4", "mp3", "pdf", "zip", "tar", "gz", "lock",
];

const CODE_EXTS: &[&str] = &[
    "ts", "tsx", "js", "jsx", "rs", "py", "go", "java", "c", "cpp",
    "h", "cs", "rb", "swift", "kt", "scala", "php", "vue", "svelte",
];

const CONFIG_EXTS: &[&str] = &[
    "json", "toml", "yaml", "yml", "env", "md",
];

#[derive(Debug)]
struct ScoredFile {
    path: String,
    score: f32,
    reasons: Vec<String>,
    size_bytes: u64,
}

pub fn handle(task: &str, root: &str, limit: usize, session_files: &[String]) -> String {
    let keywords = extract_keywords(task);
    if keywords.is_empty() {
        return "No searchable keywords found in task description.".to_string();
    }

    let session_set: HashSet<&str> = session_files.iter().map(String::as_str).collect();
    let root_path = Path::new(root);

    let files = collect_files(root_path, 5);
    if files.is_empty() {
        return format!("No source files found under: {root}");
    }

    let mut scored: Vec<ScoredFile> = files.into_iter()
        .map(|(path, size)| score_file(&path, size, &keywords, &session_set))
        .filter(|f| f.score > 0.0)
        .collect();

    scored.sort_by(|a, b| b.score.partial_cmp(&a.score).unwrap_or(std::cmp::Ordering::Equal));
    let total_candidates = scored.len();
    scored.truncate(limit);

    if scored.is_empty() {
        return format!(
            "No files matched keywords: {}\nExpand or rephrase the task description.",
            keywords.join(", ")
        );
    }

    let mut out = Vec::new();
    out.push(format!("ctx_predict — {}", task.chars().take(72).collect::<String>()));
    out.push("═".repeat(56));
    out.push(format!(
        "Keywords: {}",
        keywords.iter().take(10).cloned().collect::<Vec<_>>().join(", ")
    ));
    out.push(format!("Scanned: {} files  →  {} matched", total_candidates, scored.len()));
    out.push(String::new());
    out.push("Predicted relevant files (ranked by score)".to_string());
    out.push("─".repeat(50));

    for (i, f) in scored.iter().enumerate() {
        let short = crate::core::protocol::shorten_path(&f.path);
        let size_str = if f.size_bytes > 1024 {
            format!("{}KB", f.size_bytes / 1024)
        } else {
            format!("{}B", f.size_bytes)
        };
        out.push(format!(
            "  {:2}. [{:4.0}] {}  ({})",
            i + 1,
            f.score * 100.0,
            short,
            size_str,
        ));
        if !f.reasons.is_empty() {
            out.push(format!("       Signals: {}", f.reasons.join(" · ")));
        }
    }

    out.push(String::new());
    out.push("Next step".to_string());
    out.push("─".repeat(40));
    let top_paths: Vec<&str> = scored.iter().take(3).map(|f| f.path.as_str()).collect();
    out.push(format!(
        "  ctx_multi_read(paths=[{}], mode='signatures')",
        top_paths.iter()
            .map(|p| format!("\"{}\"", crate::core::protocol::shorten_path(p)))
            .collect::<Vec<_>>()
            .join(", ")
    ));
    out.push("  Then ctx_read(path, mode='map') on files you'll edit.".to_string());

    out.join("\n")
}

fn extract_keywords(task: &str) -> Vec<String> {
    let stop: HashSet<&str> = STOP_WORDS.iter().copied().collect();
    task.split(|c: char| !c.is_alphanumeric() && c != '_')
        .map(|w| w.to_lowercase())
        .filter(|w| w.len() >= 3 && !stop.contains(w.as_str()))
        .collect::<HashSet<_>>()
        .into_iter()
        .collect()
}

fn collect_files(root: &Path, max_depth: usize) -> Vec<(String, u64)> {
    let mut out = Vec::new();
    collect_recursive(root, root, max_depth, 0, &mut out);
    out
}

fn collect_recursive(
    _root: &Path,
    dir: &Path,
    max_depth: usize,
    depth: usize,
    out: &mut Vec<(String, u64)>,
) {
    if depth > max_depth {
        return;
    }
    let Ok(entries) = std::fs::read_dir(dir) else { return };

    for entry in entries.flatten() {
        let path = entry.path();
        let name = path.file_name()
            .and_then(|n| n.to_str())
            .unwrap_or("");

        if name.starts_with('.') && depth == 0 {
            // Allow .env, .github etc at root but skip .git
            if SKIP_DIRS.contains(&name) { continue; }
        }
        if SKIP_DIRS.contains(&name) { continue; }

        if path.is_dir() {
            collect_recursive(_root, &path, max_depth, depth + 1, out);
        } else if let Some(ext) = path.extension().and_then(|e| e.to_str()) {
            if SKIP_EXTS.contains(&ext) { continue; }
            let size = std::fs::metadata(&path).map(|m| m.len()).unwrap_or(0);
            if size == 0 || size > 500_000 { continue; } // skip empty and huge
            if let Some(s) = path.to_str() {
                out.push((s.to_string(), size));
            }
        }
    }
}

fn score_file(
    path: &str,
    size_bytes: u64,
    keywords: &[String],
    session_files: &HashSet<&str>,
) -> ScoredFile {
    let path_lower = path.to_lowercase();
    let filename = Path::new(path)
        .file_stem()
        .and_then(|s| s.to_str())
        .unwrap_or("")
        .to_lowercase();
    let ext = Path::new(path)
        .extension()
        .and_then(|e| e.to_str())
        .unwrap_or("");

    let mut score = 0.0f32;
    let mut reasons = Vec::new();

    // Keyword match in filename (high weight)
    let filename_hits: Vec<&str> = keywords.iter()
        .filter(|kw| filename.contains(kw.as_str()))
        .map(String::as_str)
        .collect();
    if !filename_hits.is_empty() {
        let hit_score = filename_hits.len() as f32 * 0.40;
        score += hit_score;
        reasons.push(format!("filename:{}", filename_hits.join("+")));
    }

    // Keyword match in path segments (medium weight)
    let path_hits: usize = keywords.iter()
        .filter(|kw| path_lower.contains(kw.as_str()) && !filename.contains(kw.as_str()))
        .count();
    if path_hits > 0 {
        score += path_hits as f32 * 0.15;
        reasons.push(format!("path:{path_hits}"));
    }

    // Source code files get a baseline boost
    if CODE_EXTS.contains(&ext) {
        score += 0.05;
    }

    // Config/data files that match keywords
    if CONFIG_EXTS.contains(&ext) && score > 0.1 {
        score *= 0.8; // slight penalty — less likely to be the fix location
    }

    // Session file boost — already read this session means it's relevant
    if session_files.contains(path) {
        score += 0.30;
        reasons.push("in_session".to_string());
    }

    // Prefer smaller files (they're faster to read and more focused)
    if size_bytes < 5_000 && score > 0.0 {
        score *= 1.1;
        reasons.push("compact".to_string());
    } else if size_bytes > 50_000 {
        score *= 0.85;
    }

    ScoredFile { path: path.to_string(), score, reasons, size_bytes }
}
