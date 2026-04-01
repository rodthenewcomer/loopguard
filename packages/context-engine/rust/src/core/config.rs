use serde::{Deserialize, Serialize};
use std::path::PathBuf;

/// (model_name, input_price_per_million, output_price_per_million)
pub const MODEL_PRICING: &[(&str, f64, f64)] = &[
    ("claude-opus-4-6",          15.00, 75.00),
    ("claude-sonnet-4-6",         3.00, 15.00),
    ("claude-haiku-4-5",          0.80,  4.00),
    ("claude-haiku-4-5-20251001", 0.80,  4.00),
    ("gpt-4o",                    2.50, 10.00),
    ("gpt-4o-mini",               0.15,  0.60),
    ("o1",                       15.00, 60.00),
    ("o1-mini",                   1.10,  4.40),
    ("o3",                       10.00, 40.00),
    ("o3-mini",                   1.10,  4.40),
    ("gemini-1.5-pro",            1.25,  5.00),
    ("gemini-1.5-flash",          0.075, 0.30),
    ("gemini-2.0-flash",          0.10,  0.40),
];

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(default)]
pub struct Config {
    pub ultra_compact: bool,
    pub tee_on_error: bool,
    pub checkpoint_interval: u32,
    pub excluded_commands: Vec<String>,
    pub custom_aliases: Vec<AliasEntry>,
    /// Commands taking longer than this threshold (ms) are recorded in the slow log.
    /// Set to 0 to disable slow logging.
    pub slow_command_threshold_ms: u64,
    /// Model name for accurate USD estimates (e.g. "claude-sonnet-4-6").
    /// Run: loopguard-ctx config set model claude-sonnet-4-6
    pub model: String,
    /// Override input token price per million USD (0 = auto-lookup from model table).
    pub input_price_per_million: f64,
    /// Override output token price per million USD (0 = auto-lookup from model table).
    pub output_price_per_million: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AliasEntry {
    pub command: String,
    pub alias: String,
}

impl Default for Config {
    fn default() -> Self {
        Self {
            ultra_compact: false,
            tee_on_error: false,
            checkpoint_interval: 15,
            excluded_commands: Vec::new(),
            custom_aliases: Vec::new(),
            slow_command_threshold_ms: 5000,
            model: "claude-sonnet-4-6".to_string(),
            input_price_per_million: 0.0,
            output_price_per_million: 0.0,
        }
    }
}

impl Config {
    pub fn path() -> Option<PathBuf> {
        dirs::home_dir().map(|h| h.join(".loopguard-ctx").join("config.toml"))
    }

    pub fn load() -> Self {
        let path = match Self::path() {
            Some(p) => p,
            None => return Self::default(),
        };
        match std::fs::read_to_string(&path) {
            Ok(content) => toml::from_str(&content).unwrap_or_default(),
            Err(_) => Self::default(),
        }
    }

    pub fn save(&self) -> Result<(), String> {
        let path = Self::path().ok_or("cannot determine home directory")?;
        if let Some(parent) = path.parent() {
            std::fs::create_dir_all(parent).map_err(|e| e.to_string())?;
        }
        let content = toml::to_string_pretty(self).map_err(|e| e.to_string())?;
        std::fs::write(&path, content).map_err(|e| e.to_string())
    }

    /// Returns input price per million tokens to use for USD estimates.
    /// Uses explicit override if set, otherwise looks up from the model table.
    /// Defaults to Sonnet 4.6 ($3.00/M) if model is unrecognized.
    pub fn effective_input_price(&self) -> f64 {
        if self.input_price_per_million > 0.0 {
            return self.input_price_per_million;
        }
        MODEL_PRICING
            .iter()
            .find(|(m, _, _)| *m == self.model.as_str())
            .map(|(_, input, _)| *input)
            .unwrap_or(3.0)
    }

    /// Returns a formatted table of all known models and their prices.
    pub fn list_models() -> String {
        let mut lines = vec![
            "  Model                              Input/M    Output/M".to_string(),
            "  ────────────────────────────────────────────────────────".to_string(),
        ];
        for (model, input, output) in MODEL_PRICING {
            lines.push(format!("  {:<36} ${:<9.3} ${:.3}", model, input, output));
        }
        lines.join("\n")
    }

    pub fn show(&self) -> String {
        let path = Self::path()
            .map(|p| p.to_string_lossy().to_string())
            .unwrap_or_else(|| "~/.loopguard-ctx/config.toml".to_string());
        let content = toml::to_string_pretty(self).unwrap_or_default();
        format!("Config: {path}\n\n{content}")
    }
}
