import * as vscode from 'vscode';
import type { LoopEvent } from '@loopguard/types';
import { debounce } from '@loopguard/utils';
import type { ContextEngine } from '../core/contextEngine';
import type { EditTracker } from '../core/editTracker';
import { logger } from '../utils/logger';

const DEBOUNCE_MS = 300;

/**
 * Listens to text document changes.
 * - Invalidates the context engine cache on every edit
 * - Feeds changed line ranges into EditTracker for edit-loop detection
 */
export class FileListener {
  private readonly contextEngine: ContextEngine;
  private readonly editTracker: EditTracker;
  private readonly onEditLoopDetected: (event: LoopEvent) => void;

  constructor(
    contextEngine: ContextEngine,
    editTracker: EditTracker,
    onEditLoopDetected: (event: LoopEvent) => void,
  ) {
    this.contextEngine = contextEngine;
    this.editTracker = editTracker;
    this.onEditLoopDetected = onEditLoopDetected;
  }

  activate(): vscode.Disposable {
    const debouncedHandler = debounce(
      (event: vscode.TextDocumentChangeEvent) => this.handleChange(event),
      DEBOUNCE_MS,
    );

    return vscode.workspace.onDidChangeTextDocument(debouncedHandler);
  }

  private handleChange(event: vscode.TextDocumentChangeEvent): void {
    if (event.contentChanges.length === 0) return;

    const uri = event.document.uri.toString();

    try {
      this.contextEngine.clearCache(uri);
    } catch (error) {
      logger.error('FileListener: failed to invalidate cache', { uri, error });
    }

    // Feed each changed range into the edit tracker
    for (const change of event.contentChanges) {
      try {
        const lineStart = change.range.start.line + 1;
        const lineEnd = change.range.end.line + 1;
        const loopEvent = this.editTracker.record(uri, lineStart, lineEnd);
        if (loopEvent !== null) {
          logger.info('Edit loop detected', {
            uri,
            lineStart,
            occurrences: loopEvent.occurrences,
          });
          this.onEditLoopDetected(loopEvent);
        }
      } catch (error) {
        logger.error('FileListener: edit tracker error', { uri, error });
      }
    }
  }
}
