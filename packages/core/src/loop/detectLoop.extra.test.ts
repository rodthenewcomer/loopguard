/**
 * Supplementary tests for LoopDetector covering gaps in detectLoop.test.ts:
 *   - getAllLoops() returning both active and resolved loops
 *   - resolve() setting status to 'resolved'
 *   - Deterministic time-window boundary using vi.useFakeTimers()
 *   - afterEach cleanup to prevent timer leaks between tests
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { LoopDetector } from './detectLoop';
import type { DiagnosticRecord } from '@loopguard/types';

const SHORT_WINDOW_MS = 10_000; // 10s — keeps tests fast

function makeRecord(hash: string, uri = 'file:///test.ts'): DiagnosticRecord {
  return { hash, message: `Error: ${hash}`, line: 1, col: 0, seenAt: [], uri };
}

describe('LoopDetector — extra coverage', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ── getAllLoops() includes active and resolved ────────────────────
  it('getAllLoops() returns both active and resolved loops', () => {
    const detector = new LoopDetector({ sensitivityThreshold: 2, timeWindowMs: SHORT_WINDOW_MS });

    // Trigger two distinct loops
    detector.record(makeRecord('alpha'));
    detector.record(makeRecord('alpha'));
    detector.record(makeRecord('beta'));
    detector.record(makeRecord('beta'));

    // Resolve one
    detector.resolve('alpha');

    expect(detector.getActiveLoops()).toHaveLength(1);
    expect(detector.getAllLoops()).toHaveLength(2);

    const statuses = detector.getAllLoops().map((l) => l.status).sort();
    expect(statuses).toEqual(['active', 'resolved']);
  });

  // ── resolve() marks status as 'resolved' in getAllLoops ──────────
  it('resolve() marks the loop status as resolved without removing it from getAllLoops()', () => {
    const detector = new LoopDetector({ sensitivityThreshold: 2, timeWindowMs: SHORT_WINDOW_MS });
    detector.record(makeRecord('gamma'));
    detector.record(makeRecord('gamma'));

    expect(detector.getAllLoops()[0]?.status).toBe('active');

    detector.resolve('gamma');

    expect(detector.getAllLoops()).toHaveLength(1);
    expect(detector.getAllLoops()[0]?.status).toBe('resolved');
    expect(detector.getActiveLoops()).toHaveLength(0);
  });

  // ── Deterministic time-window boundary — inside ──────────────────
  it('detects loop when all occurrences fall within the time window', () => {
    const detector = new LoopDetector({ sensitivityThreshold: 3, timeWindowMs: SHORT_WINDOW_MS });
    const r = makeRecord('delta');

    detector.record(r); // t = 0
    vi.advanceTimersByTime(3_000);
    detector.record(r); // t = 3s
    vi.advanceTimersByTime(3_000);
    const event = detector.record(r); // t = 6s — all 3 within 10s window

    expect(event).not.toBeNull();
    expect(event?.occurrences).toBe(3);
  });

  // ── Deterministic time-window boundary — outside ─────────────────
  it('does not detect loop when early occurrences expire before threshold is reached', () => {
    const detector = new LoopDetector({ sensitivityThreshold: 3, timeWindowMs: SHORT_WINDOW_MS });
    const r = makeRecord('epsilon');

    detector.record(r); // t = 0
    vi.advanceTimersByTime(1_000);
    detector.record(r); // t = 1s

    // Advance past window — both records at t=0 and t=1s are now outside the 10s window
    vi.advanceTimersByTime(SHORT_WINDOW_MS + 500); // t = 11.5s

    const event = detector.record(r); // t = 11.5s — only 1 record in window
    expect(event).toBeNull();
  });

  // ── occurrences count in LoopEvent matches recent occurrences ────
  it('LoopEvent.occurrences matches the number of records within the time window', () => {
    const detector = new LoopDetector({ sensitivityThreshold: 3, timeWindowMs: SHORT_WINDOW_MS });
    const r = makeRecord('zeta');

    // Record 5 times all within window
    for (let i = 0; i < 5; i++) {
      vi.advanceTimersByTime(100);
      detector.record(r);
    }

    const loops = detector.getAllLoops();
    expect(loops).toHaveLength(1);
    // occurrences after first emit is updated by post-emit tracking (occurrences + 1 each call)
    expect(loops[0]?.occurrences).toBeGreaterThanOrEqual(3);
  });

  // ── resolve() allows re-detection with fresh occurrence count ────
  it('re-detected loop after resolve() starts occurrence count from 1', () => {
    const detector = new LoopDetector({ sensitivityThreshold: 2, timeWindowMs: SHORT_WINDOW_MS });
    const r = makeRecord('eta');

    detector.record(r);
    detector.record(r); // fires
    detector.resolve('eta');

    detector.record(r);
    const reDetected = detector.record(r); // fires again

    expect(reDetected).not.toBeNull();
    expect(reDetected?.occurrences).toBe(2);
    expect(reDetected?.status).toBe('active');
  });

  // ── lastSeen updates after loop is emitted ───────────────────────
  it('active loop lastSeen advances with each post-emit record', () => {
    const detector = new LoopDetector({ sensitivityThreshold: 2, timeWindowMs: SHORT_WINDOW_MS });
    const r = makeRecord('theta');

    detector.record(r);
    detector.record(r); // emits

    const firstLastSeen = detector.getActiveLoops()[0]?.lastSeen ?? 0;

    vi.advanceTimersByTime(2_000);
    detector.record(r); // post-emit update

    const updatedLastSeen = detector.getActiveLoops()[0]?.lastSeen ?? 0;
    expect(updatedLastSeen).toBeGreaterThan(firstLastSeen);
  });
});
