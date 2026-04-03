use serde::{Deserialize, Serialize};
use std::io::Read;
use std::path::PathBuf;

use crate::core::stats;

const API_BASE: &str = "https://loopguardapi-production.up.railway.app";

#[derive(Serialize, Deserialize)]
struct DeviceIdentity {
    device_id: String,
}

#[derive(Serialize)]
struct DeviceSyncPayload {
    device_id: String,
    total_tokens_original: u64,
    total_tokens_compressed: u64,
    total_tokens_saved: u64,
    total_commands: u64,
    total_sessions: u64,
    daily_breakdown: Vec<DailyEntry>,
}

#[derive(Serialize)]
struct DailyEntry {
    date: String,
    tokens_saved: u64,
    commands: u64,
}

fn device_path() -> Option<PathBuf> {
    dirs::home_dir().map(|h| h.join(".loopguard-ctx").join("device.json"))
}

fn generate_uuid_v4() -> String {
    let mut bytes = [0u8; 16];
    // Try OS random source first
    if let Ok(mut f) = std::fs::File::open("/dev/urandom") {
        let _ = f.read_exact(&mut bytes);
    } else {
        // Fallback: mix time + PID (not crypto-random, fine for device identity)
        let t = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap_or_default();
        let pid = std::process::id();
        let secs = t.as_secs().to_le_bytes();
        let nano = t.subsec_nanos().to_le_bytes();
        let pidb = pid.to_le_bytes();
        bytes[..8].copy_from_slice(&secs);
        bytes[8..12].copy_from_slice(&nano);
        bytes[12..16].copy_from_slice(&pidb);
    }
    // Set version (4) and variant bits per RFC 4122
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    format!(
        "{:02x}{:02x}{:02x}{:02x}-{:02x}{:02x}-{:02x}{:02x}-{:02x}{:02x}-{:02x}{:02x}{:02x}{:02x}{:02x}{:02x}",
        bytes[0], bytes[1], bytes[2], bytes[3],
        bytes[4], bytes[5],
        bytes[6], bytes[7],
        bytes[8], bytes[9],
        bytes[10], bytes[11], bytes[12], bytes[13], bytes[14], bytes[15],
    )
}

fn load_or_create_device_id() -> Option<String> {
    let path = device_path()?;

    if path.exists() {
        if let Ok(content) = std::fs::read_to_string(&path) {
            if let Ok(id) = serde_json::from_str::<DeviceIdentity>(&content) {
                return Some(id.device_id);
            }
        }
    }

    let uuid = generate_uuid_v4();
    let identity = DeviceIdentity { device_id: uuid.clone() };
    if let Ok(json) = serde_json::to_string(&identity) {
        if let Some(dir) = path.parent() {
            let _ = std::fs::create_dir_all(dir);
        }
        let _ = std::fs::write(&path, json);
    }
    Some(uuid)
}

/// Sync local stats to the LoopGuard API (anonymous, device-UUID-based).
/// Runs silently — any failure is logged to stderr but never crashes the caller.
pub fn run() {
    let device_id = match load_or_create_device_id() {
        Some(id) => id,
        None => {
            eprintln!("[loopguard-ctx sync] Could not resolve home directory, skipping");
            return;
        }
    };

    let store = stats::load();

    // Map daily shell compression stats (last 30 days)
    let daily_breakdown: Vec<DailyEntry> = store
        .daily
        .iter()
        .rev()
        .take(30)
        .map(|d| DailyEntry {
            date: d.date.clone(),
            tokens_saved: d.input_tokens.saturating_sub(d.output_tokens),
            commands: d.commands,
        })
        .collect();

    let tokens_saved = store
        .cep
        .total_tokens_original
        .saturating_sub(store.cep.total_tokens_compressed);

    let payload = DeviceSyncPayload {
        device_id,
        total_tokens_original: store.cep.total_tokens_original,
        total_tokens_compressed: store.cep.total_tokens_compressed,
        total_tokens_saved: tokens_saved,
        total_commands: store.total_commands,
        total_sessions: store.cep.sessions,
        daily_breakdown,
    };

    let url = format!("{API_BASE}/api/v1/metrics/device-sync");
    match ureq::post(&url).send_json(&payload) {
        Ok(_) => {}
        Err(e) => eprintln!("[loopguard-ctx sync] API error (non-fatal): {e}"),
    }
}
