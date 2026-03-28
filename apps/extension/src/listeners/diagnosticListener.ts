import * as vscode from 'vscode';
import type { LoopEvent } from '@loopguard/types';
import { debounce } from '@loopguard/utils';
import type { LoopEngine } from '../core/loopEngine';
import { logger } from '../utils/logger';

const DEBOUNCE_MS = 500;

/**
 * Listens to VS Code diagnostics changes and feeds them into the LoopEngine.
 *
 * Debounced at 500ms to avoid processing on every keystroke — only acts when
 * the language server has settled on a stable set of diagnostics.
 */
export class DiagnosticListener {
  private readonly loopEngine: LoopEngine;
  private readonly onLoopDetected: (events: LoopEvent[]) => void;

  constructor(loopEngine: LoopEngine, onLoopDetected: (events: LoopEvent[]) => void) {
    this.loopEngine = loopEngine;
    this.onLoopDetected = onLoopDetected;
  }

  /**
   * Activates the listener and returns a Disposable.
   * Add the returned Disposable to context.subscriptions.
   */
  activate(): vscode.Disposable {
    const debouncedHandler = debounce(
      (event: vscode.DiagnosticChangeEvent) => this.handleChange(event),
      DEBOUNCE_MS,
    );

    return vscode.languages.onDidChangeDiagnostics(debouncedHandler);
  }

  private handleChange(event: vscode.DiagnosticChangeEvent): void {
    const allDetected: LoopEvent[] = [];

    for (const uri of event.uris) {
      try {
        const diagnostics = vscode.languages.getDiagnostics(uri);
        const detected = this.loopEngine.handleDiagnosticChange(uri, diagnostics);
        allDetected.push(...detected);
      } catch (error) {
        logger.error('DiagnosticListener: error processing URI', {
          uri: uri.fsPath,
          error,
        });
      }
    }

    if (allDetected.length > 0) {
      this.onLoopDetected(allDetected);
    }
  }
}
