import * as vscode from 'vscode';
import type { AlertAction, LoopEvent, SessionMetrics } from '@loopguard/types';
import { formatDuration } from '@loopguard/utils';

const ISSUES_URL = 'https://github.com/rodthenewcomer/loopguard/issues/new';
const DOCS_URL = 'https://loopguard.vercel.app/docs';

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
  async showLoopAlert(event: LoopEvent, metrics: SessionMetrics, hint?: { diagnosis: string; suggestion: string } | null): Promise<AlertAction> {
    const timeWasted = formatDuration(event.lastSeen - event.firstSeen);
    const totalWasted = formatDuration(metrics.totalTimeWasted);

    const title =
      `⚠️ LoopGuard: You're stuck in a loop — same error ${event.occurrences}× · ${timeWasted} wasted`;

    const tryNewApproach = 'Try New Approach';
    const viewDetails = 'View Details';
    const ignore = 'Ignore';

    const hintDetail = hint !== undefined && hint !== null
      ? `${hint.diagnosis}\n\n💡 ${hint.suggestion}\n\nTotal wasted this session: ${totalWasted}`
      : `Total wasted this session: ${totalWasted}`;

    const selection = await vscode.window.showWarningMessage(
      title,
      { modal: false, detail: hintDetail },
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
   * First-time welcome notification — shown once on fresh install.
   * Provides four actionable paths for new users.
   */
  showWelcome(): void {
    void vscode.window
      .showInformationMessage(
        "LoopGuard is active — loop detection is running. Start coding and LoopGuard will alert you when you're stuck.",
        'Sign In',
        'Copy Context',
        'View Docs',
        'Report Issue',
      )
      .then((action) => {
        if (action === 'Sign In') {
          void vscode.commands.executeCommand('loopguard.signIn');
        } else if (action === 'Copy Context') {
          void vscode.commands.executeCommand('loopguard.copyContext');
        } else if (action === 'View Docs') {
          void vscode.env.openExternal(vscode.Uri.parse(DOCS_URL));
        } else if (action === 'Report Issue') {
          void vscode.env.openExternal(vscode.Uri.parse(ISSUES_URL));
        }
      });
  }

  private async showNewApproachTips(): Promise<void> {
    const tips = [
      'Isolate the problem: reproduce the error in a smaller file',
      'Ask AI to explain the error instead of fix it',
      'Check your inputs/assumptions, not just the output',
      'Search for the exact error message online',
      'Take a 5-minute break — seriously',
      'Open a GitHub issue if this keeps happening',
    ];

    const tip = tips[Math.floor(Math.random() * tips.length)];
    await vscode.window.showInformationMessage(`💡 Suggestion: ${tip}`);
  }
}
