#!/usr/bin/env node
'use strict';

const { execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const ext = process.platform === 'win32' ? '.exe' : '';
const localBinary = path.join(__dirname, `loopguard-ctx${ext}`);

// Prefer the bundled binary; fall back to PATH
const binary = fs.existsSync(localBinary) ? localBinary : `loopguard-ctx${ext}`;

try {
  execFileSync(binary, process.argv.slice(2), { stdio: 'inherit' });
} catch (err) {
  process.exit(err.status ?? 1);
}
