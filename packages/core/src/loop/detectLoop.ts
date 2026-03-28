import type { DiagnosticRecord, LoopEvent } from '@loopguard/types';
import { DEFAULT_TIME_WINDOW_MS } from '@loopguard/types';
import { createId } from '@loopguard/utils';

interface LoopDetectorConfig {
  sensitivityThreshold: number;
  timeWindowMs: number;
}

const DEFAULT_CONFIG: LoopDetectorConfig = {
  sensitivityThreshold: 3,
  timeWindowMs: DEFAULT_TIME_WINDOW_MS,
};

/**
 * Core loop detection algorithm — framework-agnostic.
 *
 * Tracks DiagnosticRecord occurrences per hash. When the same error hash
 * is seen >= sensitivityThreshold times within the timeWindowMs, a LoopEvent
 * is emitted. Subsequent detections on the same hash are suppressed until
 * the loop is resolved or the detector is reset.
 */
export class LoopDetector {
  // Not readonly — updateConfig() mutates this intentionally
  private config: LoopDetectorConfig;
  /** Map of error hash → array of DiagnosticRecords for that hash */
  private readonly records: Map<string, DiagnosticRecord[]> = new Map();
  /** Set of hashes that have already fired a LoopEvent (suppresses duplicates) */
  private readonly emittedLoops: Set<string> = new Set();
  /** Active loop events indexed by hash */
  private readonly activeLoops: Map<string, LoopEvent> = new Map();

  constructor(config: Partial<LoopDetectorConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Records a new occurrence of a diagnostic error.
   * Returns a LoopEvent if this observation triggers loop detection,
   * or null if no loop has been detected yet.
   */
  record(incoming: DiagnosticRecord): LoopEvent | null {
    const now = Date.now();
    const { hash } = incoming;

    // If we've already emitted a loop for this hash, keep tracking time but don't re-emit
    if (this.emittedLoops.has(hash)) {
      const existing = this.activeLoops.get(hash);
      if (existing !== undefined && existing.status === 'active') {
        this.activeLoops.set(hash, {
          ...existing,
          lastSeen: now,
          occurrences: existing.occurrences + 1,
        });
      }
      return null;
    }

    // Get or initialize history for this hash
    const history = this.records.get(hash) ?? [];
    history.push({ ...incoming, seenAt: [now] });
    this.records.set(hash, history);

    // Count occurrences within the time window
    const windowStart = now - this.config.timeWindowMs;
    const recentOccurrences = history.filter(
      (r) => r.seenAt[0] !== undefined && r.seenAt[0] >= windowStart,
    );

    if (recentOccurrences.length < this.config.sensitivityThreshold) {
      return null;
    }

    // Loop detected — build and store the event
    const firstOccurrence = recentOccurrences[0];
    const loopEvent: LoopEvent = {
      id: createId(),
      fileUri: incoming.uri,
      errorMessage: incoming.message,
      errorHash: hash,
      occurrences: recentOccurrences.length,
      firstSeen: firstOccurrence?.seenAt[0] ?? now,
      lastSeen: now,
      status: 'active',
    };

    this.emittedLoops.add(hash);
    this.activeLoops.set(hash, loopEvent);

    return loopEvent;
  }

  /**
   * Marks a loop as resolved — clears its history so it can be re-detected
   * if the error returns.
   */
  resolve(hash: string): void {
    const loop = this.activeLoops.get(hash);
    if (loop !== undefined) {
      this.activeLoops.set(hash, { ...loop, status: 'resolved', lastSeen: Date.now() });
    }
    this.emittedLoops.delete(hash);
    this.records.delete(hash);
  }

  /**
   * Returns all loops currently in 'active' status.
   */
  getActiveLoops(): LoopEvent[] {
    return Array.from(this.activeLoops.values()).filter((l) => l.status === 'active');
  }

  /**
   * Clears all state — call at session reset.
   */
  reset(): void {
    this.records.clear();
    this.emittedLoops.clear();
    this.activeLoops.clear();
  }

  /**
   * Updates the detection config (e.g., when user changes sensitivity in settings).
   */
  updateConfig(config: Partial<LoopDetectorConfig>): void {
    Object.assign(this.config, config);
  }
}
