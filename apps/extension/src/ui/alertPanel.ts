import * as vscode from 'vscode';
import type { AlertAction, LoopEvent, SessionMetrics } from '@loopguard/types';
import { formatDuration } from '@loopguard/utils';

/**
 * Manages alert notifications for loop detection events.
 *
 * Alerts are dismissible and non-blocking — they never interrupt
 * the developer's flow. They provide a clear, honest message about
 * what's happening and an easy path forward.
 */
export class AlertPanel {
  /**
   * Shows a warning notification when a loop is detected.
   * Returns the action the user took.
   */
  async showLoopAlert(event: LoopEvent, metrics: SessionMetrics): Promise<AlertAction> {
    const timeWasted = formatDuration(event.lastSeen - event.firstSeen);
    const totalWasted = formatDuration(metrics.totalTimeWasted);

    const title =
      `⚠️ LoopGuard: You're stuck in a loop — same error ${event.occurrences}× · ${timeWasted} wasted`;

    const tryNewApproach = 'Try New Approach';
    const viewDetails = 'View Details';
    const ignore = 'Ignore';

    const selection = await vscode.window.showWarningMessage(
      title,
      { modal: false, detail: `Total wasted this session: ${totalWasted}` },
      tryNewApproach,
      viewDetails,
      ignore,
    );

    switch (selection) {
      case tryNewApproach:
        await this.showNewApproachTips();
        return 'try-new-approach';
      case viewDetails:
        return 'view-details';
      case ignore:
        return 'ignore';
      default:
        return 'dismiss';
    }
  }

  /**
   * Shows a session summary as an information notification.
   */
  showSessionSummary(metrics: SessionMetrics): void {
    const timeWasted = formatDuration(metrics.totalTimeWasted);
    const tokenStr =
      metrics.tokensSaved > 0
        ? ` · ${metrics.tokensSaved.toLocaleString()} tokens saved`
        : '';

    vscode.window.showInformationMessage(
      `LoopGuard Session: ${metrics.totalLoopsDetected} loop(s) detected · ${timeWasted} wasted${tokenStr}`,
    );
  }

  /**
   * First-time welcome notification.
   */
  showWelcome(): void {
    vscode.window.showInformationMessage(
      '👋 LoopGuard is active. It will alert you when you\'re stuck in an AI coding loop.',
      'Got it',
    );
  }

  private async showNewApproachTips(): Promise<void> {
    const tips = [
      'Isolate the problem: reproduce the error in a smaller file',
      'Ask AI to explain the error instead of fix it',
      'Check your inputs/assumptions, not just the output',
      'Search for the exact error message online',
      'Take a 5-minute break — seriously',
    ];

    const tip = tips[Math.floor(Math.random() * tips.length)];
    await vscode.window.showInformationMessage(`💡 Suggestion: ${tip}`);
  }
}
