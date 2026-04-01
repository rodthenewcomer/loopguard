use crate::core::config::Config;
use crate::core::session::SessionState;
use crate::core::stats;

#[allow(dead_code)]
pub struct WrappedReport {
    pub period: String,
    pub tokens_saved: u64,
    pub tokens_input: u64,
    pub cost_avoided_usd: f64,
    pub total_commands: u64,
    pub sessions_count: usize,
    pub top_commands: Vec<(String, u64, f64)>,
    pub cache_hit_rate: f64,
    pub files_touched: u64,
}

impl WrappedReport {
    pub fn generate(period: &str) -> Self {
        let store = stats::load();
        let sessions = SessionState::list_sessions();

        let (tokens_saved, tokens_input, total_commands) = match period {
            "week" => aggregate_recent_stats(&store, 7),
            "month" => aggregate_recent_stats(&store, 30),
            _ => (
                store
                    .total_input_tokens
                    .saturating_sub(store.total_output_tokens),
                store.total_input_tokens,
                store.total_commands,
            ),
        };

        let price_per_m = Config::load().effective_input_price();
        let cost_avoided_usd = tokens_saved as f64 * price_per_m / 1_000_000.0;

        let sessions_count = match period {
            "week" => count_recent_sessions(&sessions, 7),
            "month" => count_recent_sessions(&sessions, 30),
            _ => sessions.len(),
        };

        let mut top_commands: Vec<(String, u64, f64)> = store
            .commands
            .iter()
            .map(|(cmd, stats)| {
                let saved = stats.input_tokens.saturating_sub(stats.output_tokens);
                let pct = if stats.input_tokens > 0 {
                    saved as f64 / stats.input_tokens as f64 * 100.0
                } else {
                    0.0
                };
                (cmd.clone(), saved, pct)
            })
            .collect();
        top_commands.sort_by(|a, b| b.1.cmp(&a.1));
        top_commands.truncate(5);

        let cache_hit_rate = if tokens_input > 0 {
            tokens_saved as f64 / tokens_input as f64 * 100.0
        } else {
            0.0
        };

        let files_touched: u64 = sessions.iter().map(|s| s.tool_calls as u64).sum();

        WrappedReport {
            period: period.to_string(),
            tokens_saved,
            tokens_input,
            cost_avoided_usd,
            total_commands,
            sessions_count,
            top_commands,
            cache_hit_rate,
            files_touched,
        }
    }

    /// Shareable ASCII card — screenshot-worthy, Spotify Wrapped-style.
    pub fn format_ascii(&self) -> String {
        let period_label = match self.period.as_str() {
            "week" => format!("Week of {}", chrono::Utc::now().format("%B %d, %Y")),
            "month" => format!("Month of {}", chrono::Utc::now().format("%B %Y")),
            _ => "All Time".to_string(),
        };

        let saved_str = format_tokens(self.tokens_saved);
        let cost_str = if self.cost_avoided_usd >= 0.01 {
            format!("${:.2}", self.cost_avoided_usd)
        } else {
            format!("${:.3}", self.cost_avoided_usd)
        };

        let top_str = if self.top_commands.is_empty() {
            "no data yet".to_string()
        } else {
            self.top_commands
                .iter()
                .take(3)
                .map(|(cmd, _, pct)| format!("{cmd} {pct:.0}%"))
                .collect::<Vec<_>>()
                .join("  ·  ")
        };

        // ANSI colours
        let rst   = "\x1b[0m";
        let bold  = "\x1b[1m";
        let dim   = "\x1b[2m";
        let green = "\x1b[32m";
        let cyan  = "\x1b[36m";
        let yel   = "\x1b[33m";
        let mag   = "\x1b[35m";
        let white = "\x1b[97m";

        let w = 56usize;
        let top_border    = format!("  \u{256D}{}{}\u{256E}", "\u{2500}".repeat(w), rst);
        let bot_border    = format!("  \u{2570}{}{}\u{256F}", "\u{2500}".repeat(w), rst);
        let mid_div       = format!("  \u{251C}{}{}\u{2524}", "\u{2500}".repeat(w), rst);
        let blank_row     = format!("  \u{2502}{}{}\u{2502}", " ".repeat(w), rst);

        let pad = |s: &str| {
            let visible = strip_ansi(s);
            let padding = w.saturating_sub(visible.len());
            format!("  \u{2502} {}{}{} \u{2502}", s, " ".repeat(padding.saturating_sub(2)), rst)
        };

        let title = format!("{bold}{white}◆ LOOPGUARD CTX WRAPPED{rst}  {dim}{period_label}{rst}");
        let row_saved = format!(
            "{green}{bold}{:<16}{rst}  {yel}{bold}{:<16}{rst}",
            format!("{} saved", saved_str),
            format!("{} avoided", cost_str),
        );
        let row_counts = format!(
            "{cyan}{bold}{:<16}{rst}  {mag}{bold}{:<16}{rst}",
            format!("{} cmds", self.total_commands),
            format!("{} sessions", self.sessions_count),
        );
        let row_top    = format!("{dim}Top:{rst} {white}{}{rst}", top_str);
        let row_cache  = format!("{dim}Cache efficiency:{rst} {green}{bold}{:.1}%{rst}", self.cache_hit_rate);
        let row_quote  = format!("{dim}\"Your AI saw only what mattered.\"{rst}");
        let row_url    = format!("{dim}loopguard.vercel.app{rst}");

        let mut lines = vec![
            String::new(),
            top_border,
            blank_row.clone(),
            pad(&title),
            blank_row.clone(),
            mid_div.clone(),
            blank_row.clone(),
            pad(&row_saved),
            pad(&row_counts),
            blank_row.clone(),
            mid_div.clone(),
            blank_row.clone(),
            pad(&row_top),
            pad(&row_cache),
            blank_row.clone(),
            mid_div,
            blank_row.clone(),
            pad(&row_quote),
            pad(&row_url),
            blank_row,
            bot_border,
            String::new(),
        ];

        // Append plain-text share hint (no ANSI, copy-paste friendly)
        lines.push(format!(
            "  {dim}Share-friendly copy:{rst}"
        ));
        lines.push(format!(
            "  {dim}loopguard-ctx wrapped --plain{rst}"
        ));
        lines.push(String::new());

        lines.join("\n")
    }

    /// Plain-text one-liner for sharing in Slack / Discord / X.
    pub fn format_plain(&self) -> String {
        let saved_str = format_tokens(self.tokens_saved);
        let cost_str = format!("${:.2}", self.cost_avoided_usd);
        let top_str = self
            .top_commands
            .iter()
            .take(3)
            .map(|(cmd, _, pct)| format!("{cmd} {pct:.0}%"))
            .collect::<Vec<_>>()
            .join(" | ");
        let period_label = match self.period.as_str() {
            "week" => "this week".to_string(),
            "month" => "this month".to_string(),
            _ => "all time".to_string(),
        };

        format!(
            "◆ LoopGuard CTX Wrapped ({period_label}): {saved_str} tokens saved · {cost_str} avoided · {} sessions · {} cmds · Top: {} · Cache: {:.1}% — loopguard.vercel.app",
            self.sessions_count,
            self.total_commands,
            if top_str.is_empty() { "n/a".to_string() } else { top_str },
            self.cache_hit_rate,
        )
    }

    pub fn format_compact(&self) -> String {
        let saved_str = format_tokens(self.tokens_saved);
        let cost_str = format!("${:.2}", self.cost_avoided_usd);
        let top_str = self
            .top_commands
            .iter()
            .take(3)
            .map(|(cmd, _, pct)| format!("{cmd} {pct:.0}%"))
            .collect::<Vec<_>>()
            .join(" | ");

        format!(
            "WRAPPED [{}]: {} tok saved, {} avoided, {} sessions, {} cmds | Top: {} | Cache: {:.1}%",
            self.period, saved_str, cost_str, self.sessions_count,
            self.total_commands, top_str, self.cache_hit_rate,
        )
    }
}

fn aggregate_recent_stats(store: &stats::StatsStore, days: usize) -> (u64, u64, u64) {
    let recent_days: Vec<&stats::DayStats> = store.daily.iter().rev().take(days).collect();

    let input: u64 = recent_days.iter().map(|d| d.input_tokens).sum();
    let output: u64 = recent_days.iter().map(|d| d.output_tokens).sum();
    let commands: u64 = recent_days.iter().map(|d| d.commands).sum();
    let saved = input.saturating_sub(output);

    (saved, input, commands)
}

fn count_recent_sessions(sessions: &[crate::core::session::SessionSummary], days: i64) -> usize {
    let cutoff = chrono::Utc::now() - chrono::Duration::days(days);
    sessions.iter().filter(|s| s.updated_at > cutoff).count()
}

fn format_tokens(tokens: u64) -> String {
    if tokens >= 1_000_000 {
        format!("{:.1}M", tokens as f64 / 1_000_000.0)
    } else if tokens >= 1_000 {
        format!("{:.1}K", tokens as f64 / 1_000.0)
    } else {
        format!("{tokens}")
    }
}

/// Strip ANSI escape codes to measure visible string length.
fn strip_ansi(s: &str) -> String {
    let mut out = String::new();
    let mut in_escape = false;
    for ch in s.chars() {
        if ch == '\x1b' {
            in_escape = true;
        } else if in_escape {
            if ch == 'm' {
                in_escape = false;
            }
        } else {
            out.push(ch);
        }
    }
    out
}
