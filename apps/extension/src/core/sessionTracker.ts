import type { LoopEvent, SessionMetrics } from '@loopguard/types';
import { createId, formatDuration } from '@loopguard/utils';
import { logger } from '../utils/logger';

/**
 * Tracks session-level metrics: loops detected, time wasted, tokens saved.
 *
 * "Time wasted" is calculated as the sum of (lastSeen - firstSeen) for each
 * loop event — representing the real wall-clock time spent stuck in that loop.
 */
export class SessionTracker {
  private sessionId: string = '';
  private startTime: number = 0;
  private loops: LoopEvent[] = [];
  private tokensSaved: number = 0;

  startSession(): void {
    this.sessionId = createId();
    this.startTime = Date.now();
    this.loops = [];
    this.tokensSaved = 0;
    logger.info('Session started', { sessionId: this.sessionId });
  }

  recordLoop(event: LoopEvent): void {
    // Update or append
    const existing = this.loops.findIndex((l) => l.errorHash === event.errorHash);
    if (existing >= 0) {
      this.loops[existing] = event;
    } else {
      this.loops.push(event);
    }
    logger.info('Loop recorded', {
      hash: event.errorHash,
      occurrences: event.occurrences,
      timeWasted: formatDuration(event.lastSeen - event.firstSeen),
    });
  }

  addTokensSaved(count: number): void {
    this.tokensSaved += count;
  }

  syncLoops(loops: LoopEvent[]): void {
    this.loops = loops.map((loop) => ({ ...loop }));
  }

  getMetrics(): SessionMetrics {
    const totalTimeWasted = this.loops.reduce((sum, loop) => {
      return sum + Math.max(0, loop.lastSeen - loop.firstSeen);
    }, 0);

    return {
      sessionId: this.sessionId,
      startTime: this.startTime,
      totalLoopsDetected: this.loops.length,
      totalTimeWasted,
      tokensSaved: this.tokensSaved,
    };
  }

  formatTimeWasted(): string {
    const metrics = this.getMetrics();
    return formatDuration(metrics.totalTimeWasted);
  }

  reset(): void {
    logger.info('Session reset', {
      previousSession: this.sessionId,
      loopsDetected: this.loops.length,
    });
    this.startSession();
  }
}
