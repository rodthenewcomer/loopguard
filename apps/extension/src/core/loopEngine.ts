import * as vscode from 'vscode';
import { LoopDetector } from '@loopguard/core';
import type { DiagnosticRecord, LoopEvent, LoopGuardConfig } from '@loopguard/types';
import { SENSITIVITY_THRESHOLDS, DEFAULT_TIME_WINDOW_MS } from '@loopguard/types';
import { hashString } from '@loopguard/utils';
import { logger } from '../utils/logger';
import { getHint, isHintUseful, type LoopHint } from '@loopguard/core';

/**
 * VS Code adapter for the LoopDetector algorithm.
 *
 * Converts vscode.Diagnostic + vscode.Uri into DiagnosticRecord objects
 * and delegates detection logic to the framework-agnostic LoopDetector.
 */
export class LoopEngine {
  private detector: LoopDetector;
  private enabled: boolean = true;

  constructor(config: LoopGuardConfig) {
    this.detector = new LoopDetector({
      sensitivityThreshold: this.resolveThreshold(config),
      timeWindowMs: DEFAULT_TIME_WINDOW_MS,
    });
  }

  /**
   * Processes a batch of diagnostics for a single URI.
   * Returns any LoopEvents detected in this batch.
   * Only processes Error-severity diagnostics.
   */
  handleDiagnosticChange(
    uri: vscode.Uri,
    diagnostics: readonly vscode.Diagnostic[],
  ): LoopEvent[] {
    if (!this.enabled) return [];

    const errorDiagnostics = diagnostics.filter(
      (d) => d.severity === vscode.DiagnosticSeverity.Error,
    );

    // When all errors clear for a URI, resolve any active loops for it
    if (errorDiagnostics.length === 0) {
      this.resolveLoopsForUri(uri.toString());
      return [];
    }

    const detected: LoopEvent[] = [];

    for (const diagnostic of errorDiagnostics) {
      try {
        const record = this.buildRecord(uri, diagnostic);
        const loopEvent = this.detector.record(record);
        if (loopEvent !== null) {
          logger.info('Loop detected', {
            hash: loopEvent.errorHash,
            occurrences: loopEvent.occurrences,
            uri: uri.fsPath,
          });
          detected.push(loopEvent);
        }
      } catch (error) {
        logger.error('Failed to process diagnostic', { error, uri: uri.fsPath });
      }
    }

    return detected;
  }

  resolveLoop(hash: string): void {
    this.detector.resolve(hash);
  }

  getActiveLoops(): LoopEvent[] {
    return this.detector.getActiveLoops();
  }

  getAllLoops(): LoopEvent[] {
    return this.detector.getAllLoops();
  }

  reset(): void {
    this.detector.reset();
    logger.info('Loop engine reset');
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    logger.info(`Loop detection ${enabled ? 'enabled' : 'disabled'}`);
  }

  updateConfig(config: LoopGuardConfig): void {
    this.detector.updateConfig({
      sensitivityThreshold: this.resolveThreshold(config),
    });
  }

  private buildRecord(uri: vscode.Uri, diagnostic: vscode.Diagnostic): DiagnosticRecord {
    const uriStr = uri.toString();
    const line = diagnostic.range.start.line + 1; // VS Code is 0-based, we store 1-based
    const col = diagnostic.range.start.character + 1;
    const message = diagnostic.message.trim();
    const hash = hashString(`${uriStr}:${line}:${message}`);

    return {
      hash,
      message,
      line,
      col,
      seenAt: [Date.now()],
      uri: uriStr,
    };
  }

  private resolveThreshold(config: LoopGuardConfig): number {
    // Custom threshold takes precedence over sensitivity preset
    if (config.loopThreshold > 0) return config.loopThreshold;
    return SENSITIVITY_THRESHOLDS[config.sensitivity];
  }

  private resolveLoopsForUri(uriStr: string): void {
    const activeLoops = this.detector.getActiveLoops();
    for (const loop of activeLoops) {
      if (loop.fileUri === uriStr) {
        this.detector.resolve(loop.errorHash);
      }
    }
  }

  /**
   * Returns a root-cause hint for the given loop event if one is available.
   * Returns null when no useful pattern was matched.
   */
  getHintForLoop(event: { errorMessage: string }): LoopHint | null {
    const hint = getHint(event.errorMessage);
    return isHintUseful(hint) ? hint : null;
  }
}
