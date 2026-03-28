#!/usr/bin/env node
/**
 * bundle-binary.js
 *
 * Copies the compiled loopguard-ctx binary into the extension's bin/ directory
 * for the specified platform and architecture, so it gets bundled inside the VSIX.
 *
 * Usage (called by npm package:* scripts):
 *   node scripts/bundle-binary.js <platform> <arch>
 *   node scripts/bundle-binary.js darwin arm64
 *   node scripts/bundle-binary.js win32 x64
 *   node scripts/bundle-binary.js linux x64
 *
 * Binary source locations (Rust release build targets):
 *   darwin/arm64  → target/aarch64-apple-darwin/release/loopguard-ctx
 *   darwin/x64    → target/x86_64-apple-darwin/release/loopguard-ctx
 *   win32/x64     → target/x86_64-pc-windows-gnu/release/loopguard-ctx.exe
 *   linux/x64     → target/x86_64-unknown-linux-musl/release/loopguard-ctx
 *   linux/arm64   → target/aarch64-unknown-linux-musl/release/loopguard-ctx
 */

const { cpSync, mkdirSync, existsSync, chmodSync } = require('fs');
const { join, resolve } = require('path');

const [, , platform, arch] = process.argv;

if (!platform || !arch) {
  console.error('Usage: node scripts/bundle-binary.js <platform> <arch>');
  process.exit(1);
}

const RUST_ROOT = resolve(__dirname, '../../../packages/context-engine/rust');
const BIN_DIR = resolve(__dirname, '../bin');

// Map VS Code platform/arch to Rust target triple and binary name
const TARGET_MAP = {
  'darwin/arm64': { triple: 'aarch64-apple-darwin',       exe: 'loopguard-ctx' },
  'darwin/x64':   { triple: 'x86_64-apple-darwin',        exe: 'loopguard-ctx' },
  'win32/x64':    { triple: 'x86_64-pc-windows-gnu',      exe: 'loopguard-ctx.exe' },
  'linux/x64':    { triple: 'x86_64-unknown-linux-musl',  exe: 'loopguard-ctx' },
  'linux/arm64':  { triple: 'aarch64-unknown-linux-musl', exe: 'loopguard-ctx' },
};

const key = `${platform}/${arch}`;
const target = TARGET_MAP[key];

if (!target) {
  console.error(`Unsupported platform/arch: ${key}`);
  console.error('Supported:', Object.keys(TARGET_MAP).join(', '));
  process.exit(1);
}

// Look for the binary in cross-compiled target directory first, then native
const candidates = [
  join(RUST_ROOT, 'target', target.triple, 'release', target.exe),
  join(RUST_ROOT, 'target', 'release', target.exe), // native build fallback
];

let sourcePath = null;
for (const candidate of candidates) {
  if (existsSync(candidate)) {
    sourcePath = candidate;
    break;
  }
}

if (!sourcePath) {
  console.error(`[bundle-binary] Binary not found for ${key}.`);
  console.error('Build it first:');
  console.error(`  cd packages/context-engine/rust`);
  console.error(`  cargo build --release --target ${target.triple}`);
  console.error('Or for native build:');
  console.error(`  cargo build --release`);
  process.exit(1);
}

const destDir = join(BIN_DIR, `${platform}-${arch}`);
const destPath = join(destDir, target.exe);

mkdirSync(destDir, { recursive: true });
cpSync(sourcePath, destPath);

// Make executable on non-Windows
if (platform !== 'win32') {
  chmodSync(destPath, 0o755);
}

const sizeKb = Math.round(require('fs').statSync(destPath).size / 1024);
console.log(`[bundle-binary] ✓ ${key} → bin/${platform}-${arch}/${target.exe} (${sizeKb} KB)`);
