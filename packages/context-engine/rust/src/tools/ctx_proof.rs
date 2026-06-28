use crate::core::cache::SessionCache;

pub fn handle(path: Option<&str>, cache: &SessionCache) -> String {
    let entries = cache.get_all_entries();
    if entries.is_empty() {
        return "ctx_proof — cache is empty. Read some files first with ctx_read.".to_string();
    }

    let mut out = vec![
        "ctx_proof — compression proof report".to_string(),
        "═".repeat(50),
    ];
    let mut total_orig = 0usize;
    let mut total_out = 0usize;

    for (p, entry) in &entries {
        if let Some(filter) = path {
            if !p.contains(filter) {
                continue;
            }
        }
        let ratio = if entry.original_tokens > 0 {
            (entry.original_tokens - entry.original_tokens.min(entry.original_tokens)) as f64
                / entry.original_tokens as f64
        } else {
            0.0
        };
        total_orig += entry.original_tokens;
        total_out += entry.original_tokens; // stub: same until store implemented
        out.push(format!(
            "  {} — {}t original | hash: {} | reads: {}x | ratio: {:.0}%",
            crate::core::protocol::shorten_path(p),
            entry.original_tokens,
            entry.hash,
            entry.read_count,
            ratio * 100.0
        ));
    }
    out.push("─".repeat(50));
    out.push(format!(
        "  Total original: {total_orig}t | Output: {total_out}t"
    ));
    out.push("  Note: full reversibility store (CCR) — coming in next release.".to_string());
    out.join("\n")
}
