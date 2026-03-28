import type { LoopEvent } from '@loopguard/types';
import { createId, hashString, formatDuration } from '@loopguard/utils';

/**
 * Detects edit-based loops — the pattern diagnostic detection misses.
 *
 * Real AI loops often look like:
 *   Error A → AI fix → Error B → AI fix → Error A again
 * The error hash changes every time, so the diagnostic detector never fires.
 *
 * This tracker watches WHICH LINES are being repeatedly edited.
 * If the same line range is modified 4+ times in 3 minutes without clearing,
 * it signals a loop regardless of what the errors say.
 *
 * Non-blocking: emits loop events through the same callback as diagnostics.
 * Threshold intentionally higher (4) to avoid false positives from normal editing.
 */

interface EditRecord {
  lineStart: number;
  lineEnd: number;
  timestamp: number;
}

const EDIT_LOOP_THRESHOLD = 4;
const EDIT_TIME_WINDOW_MS = 3 * 60 * 1000; // 3 minutes
// Lines within this radius are considered the "same region"
const LINE_PROXIMITY = 5;

export class EditTracker {
  private readonly editHistory: Map<string, EditRecord[]> = new Map();
  private readonly emittedHashes: Set<string> = new Set();

  /**
   * Records an edit to a line range in a file.
   * Returns a LoopEvent if this edit triggers loop detection, null otherwise.
   */
  record(uri: string, lineStart: number, lineEnd: number): LoopEvent | null {
    const now = Date.now();
    const history = this.editHistory.get(uri) ?? [];

    history.push({ lineStart, lineEnd, timestamp: now });
    // Keep only entries within the time window to avoid unbounded growth
    const windowStart = now - EDIT_TIME_WINDOW_MS;
    const recent = history.filter((e) => e.timestamp >= windowStart);
    this.editHistory.set(uri, recent);

    // Find how many recent edits are in the same region as this one
    const regionEdits = recent.filter(
      (e) =>
        Math.abs(e.lineStart - lineStart) <= LINE_PROXIMITY ||
        Math.abs(e.lineEnd - lineEnd) <= LINE_PROXIMITY,
    );

    if (regionEdits.length < EDIT_LOOP_THRESHOLD) return null;

    // Build a stable hash for this region to avoid re-emitting
    const regionHash = hashString(`edit:${uri}:${lineStart}`);
    if (this.emittedHashes.has(regionHash)) return null;

    this.emittedHashes.add(regionHash);

    const firstEdit = regionEdits[0];
    const timeWasted = now - (firstEdit?.timestamp ?? now);

    return {
      id: createId(),
      fileUri: uri,
      errorMessage: `Lines ${lineStart}–${lineEnd} edited ${regionEdits.length}× in ${formatDuration(timeWasted)} — possible edit loop`,
      errorHash: regionHash,
      occurrences: regionEdits.length,
      firstSeen: firstEdit?.timestamp ?? now,
      lastSeen: now,
      status: 'active',
    };
  }

  /**
   * Clears edit history for a URI — call when errors clear or session resets.
   */
  clearUri(uri: string): void {
    this.editHistory.delete(uri);
    // Also clear emitted hashes for this URI so it can re-detect
    for (const hash of this.emittedHashes) {
      if (hash.includes(uri)) this.emittedHashes.delete(hash);
    }
  }

  reset(): void {
    this.editHistory.clear();
    this.emittedHashes.clear();
  }
}
