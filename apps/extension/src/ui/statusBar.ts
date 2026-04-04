import * as vscode from 'vscode';
import type { SessionMetrics } from '@loopguard/types';
import { formatDuration } from '@loopguard/utils';

/**
 * Status bar item showing real-time loop detection state.
 *
 * States:
 *   Clean:    "$(check) LoopGuard"            — neutral, all good
 *   Warning:  "$(warning) 2 loops · 38min"   — active loops detected
 *   Paused:   "$(circle-slash) LoopGuard"     — detection disabled
 */
export class StatusBar {
  private readonly item: vscode.StatusBarItem;
  private activeLoops: number = 0;
  private metrics: SessionMetrics | null = null;
  private detectionEnabled: boolean = true;
  private forecastTooltip: string | null = null;

  constructor() {
    this.item = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Left,
      100,
    );
    this.item.command = 'loopguard.showDashboard';
    this.item.tooltip = 'LoopGuard — Click to view session summary';
    this.item.show();
    this.renderClean();
  }

  update(metrics: SessionMetrics, activeLoops: number): void {
    this.metrics = metrics;
    this.activeLoops = activeLoops;
    this.render();
  }

  setDetectionEnabled(enabled: boolean): void {
    this.detectionEnabled = enabled;
    this.render();
  }

  setForecast(forecast: string): void {
    // Store first line as tooltip hint (forecast can be multi-line)
    this.forecastTooltip = forecast.split('\n')[0] ?? null;
    this.render();
  }

  dispose(): void {
    this.item.dispose();
  }

  private render(): void {
    if (!this.detectionEnabled) {
      this.renderPaused();
      return;
    }

    if (this.activeLoops > 0 && this.metrics !== null) {
      this.renderWarning();
      return;
    }

    this.renderClean();
  }

  private renderClean(): void {
    this.item.text = '$(check) LoopGuard';
    this.item.color = undefined;
    this.item.backgroundColor = undefined;
    this.item.tooltip = this.forecastTooltip !== null
      ? `LoopGuard — ${this.forecastTooltip}\nClick to view session summary.`
      : 'LoopGuard — No loops detected. Click to view session summary.';
  }

  private renderWarning(): void {
    const timeStr = this.metrics !== null
      ? formatDuration(this.metrics.totalTimeWasted)
      : '';
    const loopLabel = this.activeLoops === 1 ? 'loop' : 'loops';

    this.item.text = `$(warning) ${this.activeLoops} ${loopLabel}${timeStr ? ` · ${timeStr}` : ''}`;
    this.item.color = new vscode.ThemeColor('statusBarItem.warningForeground');
    this.item.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
    this.item.tooltip =
      `LoopGuard — ${this.activeLoops} active loop(s) detected.\n` +
      `${timeStr ? `Time wasted: ${timeStr}.\n` : ''}` +
      `Click to view session summary.`;
  }

  private renderPaused(): void {
    this.item.text = '$(circle-slash) LoopGuard';
    this.item.color = new vscode.ThemeColor('statusBarItem.remoteForeground');
    this.item.backgroundColor = undefined;
    this.item.tooltip = 'LoopGuard — Detection paused. Click to view options.';
  }
}
