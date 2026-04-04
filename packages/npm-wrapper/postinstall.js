#!/usr/bin/env node
/**
 * postinstall.js — downloads the platform-specific loopguard-ctx binary
 * Uses only Node.js built-ins; no npm dependencies.
 */
'use strict';

const https = require('https');
const fs = require('fs');
const path = require('path');
const os = require('os');
const zlib = require('zlib');
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

/** Extract .tar.gz — pulls out the single binary file */
function extractTarGz(archivePath, destDir) {
  return new Promise((resolve, reject) => {
    const input = fs.createReadStream(archivePath);
    const gunzip = zlib.createGunzip();
    let buffer = Buffer.alloc(0);

    input.pipe(gunzip);
    gunzip.on('data', (chunk) => { buffer = Buffer.concat([buffer, chunk]); });
    gunzip.on('end', () => {
      // Parse TAR manually — find the first regular file entry
      let offset = 0;
      while (offset + 512 <= buffer.length) {
        const header = buffer.slice(offset, offset + 512);
        const name = header.slice(0, 100).toString('utf8').replace(/\0/g, '').trim();
        const sizeStr = header.slice(124, 136).toString('utf8').replace(/\0/g, '').trim();
        const typeFlag = header.slice(156, 157).toString('utf8');
        const size = parseInt(sizeStr, 8) || 0;

        offset += 512;

        if (typeFlag === '0' || typeFlag === '' || typeFlag === '\0') {
          // Regular file — extract the binary (last path component, no directory entries)
          const baseName = path.basename(name);
          if (baseName && baseName !== '' && !name.endsWith('/')) {
            const outPath = path.join(destDir, 'loopguard-ctx');
            fs.writeFileSync(outPath, buffer.slice(offset, offset + size));
            fs.chmodSync(outPath, 0o755);
            resolve(outPath);
            return;
          }
        }
        // Align to 512-byte blocks
        offset += Math.ceil(size / 512) * 512;
      }
      reject(new Error('No binary found in tar archive'));
    });
    gunzip.on('error', reject);
    input.on('error', reject);
  });
}

/** Extract .zip on Windows using PowerShell (no native unzip in Node built-ins for zip) */
function extractZip(archivePath, destDir) {
  const outPath = path.join(destDir, 'loopguard-ctx.exe');
  execSync(
    `powershell -Command "Expand-Archive -Force '${archivePath}' '${destDir}'"`,
    { stdio: 'inherit' }
  );
  // Rename first .exe found
  const entries = fs.readdirSync(destDir);
  const exe = entries.find((f) => f.endsWith('.exe') && f !== 'loopguard-ctx.exe');
  if (exe) fs.renameSync(path.join(destDir, exe), outPath);
  return outPath;
}

async function main() {
  // Allow skipping download (e.g. CI environments that provide the binary separately)
  if (process.env.LOOPGUARD_SKIP_DOWNLOAD === '1') {
    console.log('loopguard-ctx: LOOPGUARD_SKIP_DOWNLOAD=1, skipping binary download.');
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
      await extractTarGz(tmpPath, BIN_DIR);
    }
  } catch (err) {
    console.error(`loopguard-ctx: extraction failed: ${err.message}`);
    process.exit(1);
  } finally {
    try { fs.unlinkSync(tmpPath); } catch (_) {}
  }

  // Verify
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
