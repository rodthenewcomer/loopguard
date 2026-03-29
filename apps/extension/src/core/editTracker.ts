import type { LoopEvent } from '@loopguard/types';
import { createId, formatDuration, hashString } from '@loopguard/utils';

interface EditRecord {
  lineStart: number;
  lineEnd: number;
  timestamp: number;
}

const EDIT_LOOP_THRESHOLD = 4;
const EDIT_TIME_WINDOW_MS = 3 * 60 * 1000;
const LINE_PROXIMITY = 5;

export class EditTracker {
  private readonly editHistory: Map<string, EditRecord[]> = new Map();
  private readonly loops: Map<string, LoopEvent> = new Map();

  record(uri: string, lineStart: number, lineEnd: number): LoopEvent | null {
    const now = Date.now();
    const history = this.editHistory.get(uri) ?? [];

    history.push({ lineStart, lineEnd, timestamp: now });

    const windowStart = now - EDIT_TIME_WINDOW_MS;
    const recent = history.filter((entry) => entry.timestamp >= windowStart);
    this.editHistory.set(uri, recent);

    const regionHash = hashString(`edit:${uri}:${lineStart}`);
    const regionEdits = recent.filter(
      (entry) =>
        Math.abs(entry.lineStart - lineStart) <= LINE_PROXIMITY ||
        Math.abs(entry.lineEnd - lineEnd) <= LINE_PROXIMITY,
    );

    const existing = this.loops.get(regionHash);
    if (existing !== undefined && existing.status === 'active') {
      this.loops.set(regionHash, {
        ...existing,
        occurrences: Math.max(existing.occurrences + 1, regionEdits.length),
        lastSeen: now,
        errorMessage: buildMessage(lineStart, lineEnd, Math.max(existing.occurrences + 1, regionEdits.length), now - existing.firstSeen),
      });
      return null;
    }

    if (regionEdits.length < EDIT_LOOP_THRESHOLD) return null;

    const firstEdit = regionEdits[0];
    const timeWasted = now - (firstEdit?.timestamp ?? now);
    const loopEvent: LoopEvent = {
      id: createId(),
      fileUri: uri,
      errorMessage: buildMessage(lineStart, lineEnd, regionEdits.length, timeWasted),
      errorHash: regionHash,
      occurrences: regionEdits.length,
      firstSeen: firstEdit?.timestamp ?? now,
      lastSeen: now,
      status: 'active',
    };

    this.loops.set(regionHash, loopEvent);
    return loopEvent;
  }

  getActiveLoops(): LoopEvent[] {
    return Array.from(this.loops.values()).filter((loop) => loop.status === 'active');
  }

  getAllLoops(): LoopEvent[] {
    return Array.from(this.loops.values());
  }

  resolveLoop(hash: string): void {
    const existing = this.loops.get(hash);
    if (existing === undefined || existing.status !== 'active') return;

    this.loops.set(hash, {
      ...existing,
      status: 'resolved',
      lastSeen: Date.now(),
    });
  }

  clearUri(uri: string): void {
    this.editHistory.delete(uri);

    for (const [hash, loop] of this.loops) {
      if (loop.fileUri !== uri || loop.status !== 'active') continue;
      this.loops.set(hash, {
        ...loop,
        status: 'resolved',
        lastSeen: Date.now(),
      });
    }
  }

  reset(): void {
    this.editHistory.clear();
    this.loops.clear();
  }
}

function buildMessage(
  lineStart: number,
  lineEnd: number,
  occurrences: number,
  timeWastedMs: number,
): string {
  return `Lines ${lineStart}–${lineEnd} edited ${occurrences}× in ${formatDuration(timeWastedMs)} — possible edit loop`;
}
