#!/usr/bin/env node
/**
 * postinstall.js — downloads the platform-specific loopguard-ctx binary.
 * Uses only Node.js built-ins; no npm dependencies.
 *
 * Skips download when:
 *   - LOOPGUARD_SKIP_DOWNLOAD=1 (explicit opt-out)
 *   - CI=true / VERCEL=1 / GITHUB_ACTIONS=true (CI environments — not an end-user install)
 *   - npm_config_global is not set (local workspace dependency, not `npm install -g`)
 *   - LOOPGUARD_BINARY_PATH is set (pre-built binary provided)
 */
'use strict';

const https = require('https');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

const VERSION = require('./package.json').version;
const BASE_URL = `https://github.com/rodthenewcomer/loopguard/releases/download/v${VERSION}`;
const BIN_DIR = path.join(__dirname, 'bin');

/** Map (platform, arch) → release asset name */
function assetName() {
  const plat = process.platform;
  const arch = process.arch;

  if (plat === 'darwin' && arch === 'arm64') return 'loopguard-ctx-aarch64-apple-darwin.tar.gz';
  if (plat === 'darwin' && arch === 'x64')   return 'loopguard-ctx-x86_64-apple-darwin.tar.gz';
  if (plat === 'linux'  && arch === 'x64')   return 'loopguard-ctx-x86_64-unknown-linux-musl.tar.gz';
  if (plat === 'linux'  && arch === 'arm64') return 'loopguard-ctx-aarch64-unknown-linux-gnu.tar.gz';
  if (plat === 'win32'  && arch === 'x64')   return 'loopguard-ctx-x86_64-pc-windows-msvc.zip';
  return null;
}

/** Follow redirects and download URL to destPath */
function download(url, destPath) {
  return new Promise((resolve, reject) => {
    const follow = (u) => {
      https.get(u, { headers: { 'User-Agent': 'loopguard-ctx-npm-installer' } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          follow(res.headers.location);
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} downloading ${u}`));
          return;
        }
        const out = fs.createWriteStream(destPath);
        res.pipe(out);
        out.on('finish', () => out.close(resolve));
        out.on('error', reject);
      }).on('error', reject);
    };
    follow(url);
  });
}

/** Extract .tar.gz using system tar — reliable on all Unix platforms */
function extractTarGz(archivePath, destDir) {
  // Extract into a temp subdirectory so we can find the binary regardless of archive structure
  const tmpDir = path.join(os.tmpdir(), `loopguard-extract-${Date.now()}`);
  fs.mkdirSync(tmpDir, { recursive: true });

  try {
    execSync(`tar -xzf "${archivePath}" -C "${tmpDir}"`, { stdio: 'pipe' });
  } catch (err) {
    throw new Error(`tar extraction failed: ${err.message}`);
  }

  // Find the binary recursively (may be at root or inside a subdirectory)
  const findBinary = (dir) => {
    for (const entry of fs.readdirSync(dir)) {
      const full = path.join(dir, entry);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        const found = findBinary(full);
        if (found) return found;
      } else if (entry === 'loopguard-ctx') {
        return full;
      }
    }
    return null;
  };

  const found = findBinary(tmpDir);
  if (!found) throw new Error('loopguard-ctx binary not found in archive');

  const dest = path.join(destDir, 'loopguard-ctx');
  fs.copyFileSync(found, dest);
  fs.chmodSync(dest, 0o755);

  // Cleanup temp dir
  try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (_) {}

  return dest;
}

/** Extract .zip on Windows using PowerShell */
function extractZip(archivePath, destDir) {
  const tmpDir = path.join(os.tmpdir(), `loopguard-extract-${Date.now()}`);
  fs.mkdirSync(tmpDir, { recursive: true });

  execSync(
    `powershell -NoProfile -Command "Expand-Archive -Force '${archivePath}' '${tmpDir}'"`,
    { stdio: 'inherit' }
  );

  // Find .exe
  const findExe = (dir) => {
    for (const entry of fs.readdirSync(dir)) {
      const full = path.join(dir, entry);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        const found = findExe(full);
        if (found) return found;
      } else if (entry === 'loopguard-ctx.exe') {
        return full;
      }
    }
    return null;
  };

  const found = findExe(tmpDir);
  if (!found) throw new Error('loopguard-ctx.exe not found in zip');

  const dest = path.join(destDir, 'loopguard-ctx.exe');
  fs.copyFileSync(found, dest);

  try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (_) {}

  return dest;
}

async function main() {
  // Skip in CI/Vercel/GitHub Actions — this package is not needed as a build dependency
  const isCI = process.env.CI === 'true'
    || process.env.VERCEL === '1'
    || process.env.GITHUB_ACTIONS === 'true'
    || process.env.LOOPGUARD_SKIP_DOWNLOAD === '1';

  if (isCI) {
    console.log('loopguard-ctx: CI environment detected, skipping binary download.');
    return;
  }

  // Skip when installed as a local workspace dependency (not `npm install -g`)
  const isGlobal = process.env.npm_config_global === 'true';
  if (!isGlobal) {
    // Silently skip — this is a local dev/workspace install, not an end-user global install
    return;
  }

  // Allow pointing at a pre-built binary
  if (process.env.LOOPGUARD_BINARY_PATH) {
    const src = process.env.LOOPGUARD_BINARY_PATH;
    const ext = process.platform === 'win32' ? '.exe' : '';
    const dest = path.join(BIN_DIR, `loopguard-ctx${ext}`);
    fs.mkdirSync(BIN_DIR, { recursive: true });
    fs.copyFileSync(src, dest);
    if (process.platform !== 'win32') fs.chmodSync(dest, 0o755);
    console.log(`loopguard-ctx: installed from LOOPGUARD_BINARY_PATH (${dest})`);
    return;
  }

  const asset = assetName();
  if (!asset) {
    console.error(
      `loopguard-ctx: unsupported platform ${process.platform}/${process.arch}.\n` +
      `Download manually from: ${BASE_URL}`
    );
    process.exit(1);
  }

  const url = `${BASE_URL}/${asset}`;
  const tmpPath = path.join(os.tmpdir(), asset);

  fs.mkdirSync(BIN_DIR, { recursive: true });

  process.stdout.write(`loopguard-ctx: downloading ${asset} …`);
  try {
    await download(url, tmpPath);
    process.stdout.write(' done\n');
  } catch (err) {
    process.stdout.write('\n');
    console.error(
      `loopguard-ctx: download failed: ${err.message}\n` +
      `Manual install: ${url}\n` +
      `Or set LOOPGUARD_BINARY_PATH=/path/to/loopguard-ctx to skip download.`
    );
    process.exit(1);
  }

  try {
    if (asset.endsWith('.zip')) {
      extractZip(tmpPath, BIN_DIR);
    } else {
      extractTarGz(tmpPath, BIN_DIR);
    }
  } catch (err) {
    console.error(`loopguard-ctx: extraction failed: ${err.message}`);
    process.exit(1);
  } finally {
    try { fs.unlinkSync(tmpPath); } catch (_) {}
  }

  // Verify the binary works
  try {
    const ext = process.platform === 'win32' ? '.exe' : '';
    const binary = path.join(BIN_DIR, `loopguard-ctx${ext}`);
    const out = execSync(`"${binary}" --version`, { encoding: 'utf8' }).trim();
    console.log(`loopguard-ctx: installed — ${out}`);
    console.log(`loopguard-ctx: run "loopguard-ctx setup --agent=claude" to complete setup`);
  } catch (err) {
    console.error(`loopguard-ctx: binary verification failed: ${err.message}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(`loopguard-ctx postinstall: ${err.message}`);
  process.exit(1);
});
