#!/usr/bin/env bash
# set-version.sh — Atomically update the version string across all package.json
# files and Cargo.toml. Run this before tagging a release.
#
# Usage:
#   ./scripts/set-version.sh 2.9.0
#
# After running:
#   git add -A
#   git commit -m "chore: bump version to <version>"
#   git tag v<version> && git push origin v<version>

set -euo pipefail

NEW_VERSION="${1:?Usage: set-version.sh <new-version>  (e.g. 2.9.0)}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Validate semver format
if ! [[ "$NEW_VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+(-[a-zA-Z0-9.]+)?$ ]]; then
  echo "Error: '${NEW_VERSION}' is not a valid semver string (expected X.Y.Z or X.Y.Z-pre)." >&2
  exit 1
fi

echo "Bumping LoopGuard to v${NEW_VERSION}..."
echo ""

bump_package_json() {
  local file="$1"
  if [[ -f "$file" ]]; then
    sed -i.bak "s/\"version\": \"[^\"]*\"/\"version\": \"${NEW_VERSION}\"/" "$file" \
      && rm -f "${file}.bak"
    echo "  ✓  $file"
  fi
}

# ── package.json files ─────────────────────────────────────────────
bump_package_json "$ROOT/package.json"
bump_package_json "$ROOT/apps/extension/package.json"
bump_package_json "$ROOT/apps/web/package.json"
bump_package_json "$ROOT/apps/api/package.json"
bump_package_json "$ROOT/packages/core/package.json"
bump_package_json "$ROOT/packages/types/package.json"
bump_package_json "$ROOT/packages/utils/package.json"
bump_package_json "$ROOT/packages/npm-wrapper/package.json"

# ── Cargo.toml (context-engine Rust binary) ───────────────────────
CARGO="$ROOT/packages/context-engine/rust/Cargo.toml"
if [[ -f "$CARGO" ]]; then
  # Match only the top-level package version line (not dependency versions)
  sed -i.bak "/^\[package\]/,/^\[/{s/^version = \"[^\"]*\"/version = \"${NEW_VERSION}\"/}" \
    "$CARGO" && rm -f "${CARGO}.bak"
  echo "  ✓  $CARGO"
fi

# ── Hardcoded version string in API health check ──────────────────
API_INDEX="$ROOT/apps/api/src/index.ts"
if [[ -f "$API_INDEX" ]]; then
  sed -i.bak "s/version: '[^']*'/version: '${NEW_VERSION}'/" "$API_INDEX" \
    && rm -f "${API_INDEX}.bak"
  echo "  ✓  $API_INDEX (health check version string)"
fi

echo ""
echo "Done. All files updated to v${NEW_VERSION}."
echo ""
echo "Next steps:"
echo "  git add -A"
echo "  git commit -m \"chore: bump version to ${NEW_VERSION}\""
echo "  git tag v${NEW_VERSION} && git push origin v${NEW_VERSION}"
