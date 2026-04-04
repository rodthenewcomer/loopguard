//! ctx_forecast — Pre-send token and cost estimator.
//!
//! Estimates how many tokens a task will consume and what it will cost
//! across the main model families, before the session starts.

struct ModelPricing {
    name: &'static str,
    input_per_1m: f64,
    output_per_1m: f64,
}

const MODELS: &[ModelPricing] = &[
    ModelPricing { name: "Claude Sonnet 4.6",   input_per_1m: 3.0,    output_per_1m: 15.0   },
    ModelPricing { name: "Claude Haiku 4.5",    input_per_1m: 0.80,   output_per_1m: 4.0    },
    ModelPricing { name: "GPT-4o",              input_per_1m: 5.0,    output_per_1m: 15.0   },
    ModelPricing { name: "Gemini 2.0 Flash",    input_per_1m: 0.10,   output_per_1m: 0.40   },
];

// Rough bytes-to-token ratio for source code (~3.5 chars/token on average)
const BYTES_PER_TOKEN: f64 = 3.5;

// Output tokens are typically 20-35% of input for coding tasks
const OUTPUT_RATIO: f64 = 0.28;

/// Complexity keywords that increase the token multiplier
const HIGH_COMPLEXITY_WORDS: &[&str] = &[
    "refactor", "rewrite", "migrate", "architecture", "redesign",
    "all", "entire", "complete", "full", "system", "pipeline",
];

const MEDIUM_COMPLEXITY_WORDS: &[&str] = &[
    "implement", "add", "build", "create", "integrate",
    "update", "feature", "endpoint", "component", "module",
];

pub fn handle(task: &str, files: &[String], model_filter: Option<&str>) -> String {
    let (base_tokens, file_details) = estimate_from_files(files);
    let task_tokens = estimate_from_task(task);

    // If no files given, use task complexity to estimate workspace slice
    let raw_tokens = if base_tokens > 0 {
        base_tokens
    } else {
        task_tokens * 8 // assume task description is ~12% of what will actually be sent
    };

    let complexity = classify_complexity(task);
    let multiplier = complexity.multiplier();
    let estimated_input = (raw_tokens as f64 * multiplier) as u64;
    let estimated_output = (estimated_input as f64 * OUTPUT_RATIO) as u64;

    // Focused slice estimate: LoopGuard typically keeps 15-25% of raw context
    let focused_input = (estimated_input as f64 * 0.20) as u64;
    let focused_output = (focused_input as f64 * OUTPUT_RATIO) as u64;

    let mut out = Vec::new();
    out.push(format!("ctx_forecast — {}", task.chars().take(72).collect::<String>()));
    out.push("═".repeat(56));

    // Complexity
    out.push(format!("Complexity: {}  (multiplier: {:.1}x)", complexity.label(), multiplier));
    if !file_details.is_empty() {
        out.push(format!("Files: {} ({} estimated tokens raw)", files.len(), format_tokens(base_tokens as u64)));
        for detail in &file_details {
            out.push(format!("  {detail}"));
        }
    } else {
        out.push(format!("Estimated scope: {} tokens (from task description)", format_tokens(raw_tokens as u64)));
    }

    out.push(String::new());
    out.push("Token estimates".to_string());
    out.push("─".repeat(40));
    out.push(format!("  Without LoopGuard  input: {:>8}  output: {:>7}", format_tokens(estimated_input), format_tokens(estimated_output)));
    out.push(format!("  With LoopGuard     input: {:>8}  output: {:>7}  (focused slice ~20%)", format_tokens(focused_input), format_tokens(focused_output)));

    out.push(String::new());
    out.push("Cost by model".to_string());
    out.push("─".repeat(56));
    out.push(format!("  {:<22} {:>10}  {:>10}", "Model", "Without LG", "With LG"));
    out.push("  ".to_string() + &"─".repeat(46));

    let target_models: Vec<&ModelPricing> = if let Some(filter) = model_filter {
        MODELS.iter().filter(|m| m.name.to_lowercase().contains(&filter.to_lowercase())).collect()
    } else {
        MODELS.iter().collect()
    };

    let mut cheapest_with: Option<(&str, f64)> = None;

    for m in &target_models {
        let cost_without = cost(estimated_input, estimated_output, m.input_per_1m, m.output_per_1m);
        let cost_with    = cost(focused_input,   focused_output,   m.input_per_1m, m.output_per_1m);
        let saving_pct   = if cost_without > 0.0 { (1.0 - cost_with / cost_without) * 100.0 } else { 0.0 };

        out.push(format!(
            "  {:<22} {:>10}  {:>10}  (-{:.0}%)",
            m.name,
            format!("${:.4}", cost_without),
            format!("${:.4}", cost_with),
            saving_pct,
        ));

        if cheapest_with.is_none_or(|(_, c)| cost_with < c) {
            cheapest_with = Some((m.name, cost_with));
        }
    }

    out.push(String::new());
    out.push("Recommendation".to_string());
    out.push("─".repeat(40));

    if focused_input > 40_000 {
        out.push(format!(
            "⚠  Large session (~{}). Run ctx_overview first to identify the minimal relevant slice.",
            format_tokens(focused_input)
        ));
        out.push("   ctx_predict can narrow scope further before you start.".to_string());
    } else if focused_input > 15_000 {
        out.push("✓  Medium session. ctx_read with 'map' mode for large files to keep context lean.".to_string());
    } else {
        out.push("✓  Small session. Proceed. ctx_compress at midpoint if context grows.".to_string());
    }

    if let Some((model, cost_val)) = cheapest_with {
        if cost_val < 0.01 {
            out.push(format!("   Cheapest option: {model} at ${cost_val:.4} with LoopGuard focused reads."));
        }
    }

    out.join("\n")
}

fn estimate_from_files(files: &[String]) -> (usize, Vec<String>) {
    let mut total_tokens = 0usize;
    let mut details = Vec::new();
    for path in files {
        match std::fs::metadata(path) {
            Ok(meta) => {
                let size = meta.len();
                let tokens = (size as f64 / BYTES_PER_TOKEN) as usize;
                total_tokens += tokens;
                details.push(format!(
                    "{} — {} bytes → ~{} tokens",
                    crate::core::protocol::shorten_path(path),
                    size,
                    format_tokens(tokens as u64),
                ));
            }
            Err(_) => {
                details.push(format!("{} (not found)", crate::core::protocol::shorten_path(path)));
            }
        }
    }
    (total_tokens, details)
}

fn estimate_from_task(task: &str) -> usize {
    // Task description itself is typically 10-20x smaller than the context it implies
    (task.len() as f64 / BYTES_PER_TOKEN) as usize
}

fn cost(input_tokens: u64, output_tokens: u64, input_per_1m: f64, output_per_1m: f64) -> f64 {
    (input_tokens as f64 / 1_000_000.0) * input_per_1m
        + (output_tokens as f64 / 1_000_000.0) * output_per_1m
}

#[derive(Debug)]
enum Complexity {
    Low,
    Medium,
    High,
}

impl Complexity {
    fn label(&self) -> &'static str {
        match self {
            Self::Low    => "low",
            Self::Medium => "medium",
            Self::High   => "high",
        }
    }

    fn multiplier(&self) -> f64 {
        match self {
            Self::Low    => 1.0,
            Self::Medium => 1.4,
            Self::High   => 2.2,
        }
    }
}

fn classify_complexity(task: &str) -> Complexity {
    let lower = task.to_lowercase();
    let high = HIGH_COMPLEXITY_WORDS.iter().any(|w| lower.contains(w));
    let medium = MEDIUM_COMPLEXITY_WORDS.iter().any(|w| lower.contains(w));
    let word_count = task.split_whitespace().count();

    if high || word_count > 30 {
        Complexity::High
    } else if medium || word_count > 12 {
        Complexity::Medium
    } else {
        Complexity::Low
    }
}

fn format_tokens(n: u64) -> String {
    if n >= 1_000_000 {
        format!("{:.1}M", n as f64 / 1_000_000.0)
    } else if n >= 1_000 {
        format!("{:.1}k", n as f64 / 1_000.0)
    } else {
        n.to_string()
    }
}

#[allow(dead_code)]
fn count_word_hits(text: &str, words: &[&str]) -> usize {
    let lower = text.to_lowercase();
    words.iter().filter(|w| lower.contains(**w)).count()
}
