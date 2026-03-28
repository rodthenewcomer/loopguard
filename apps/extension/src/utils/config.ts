import * as vscode from 'vscode';
import type { LoopGuardConfig, Sensitivity } from '@loopguard/types';
import { SENSITIVITY_THRESHOLDS } from '@loopguard/types';

const CONFIG_SECTION = 'loopguard';

/**
 * Module-level pro status — set by auth layer when ready.
 * Default false for beta: all features unlocked, gate wired but open.
 */
let _proUser = false;

/**
 * Called by auth layer (future) or manually for beta testing.
 * Non-blocking: setting false just defaults everything to free tier behavior.
 */
export function setProUser(value: boolean): void {
  _proUser = value;
}

/**
 * Reads the current LoopGuard configuration from VS Code workspace settings.
 * Always returns a valid config with safe defaults.
 */
export function getConfig(): LoopGuardConfig {
  const cfg = vscode.workspace.getConfiguration(CONFIG_SECTION);

  const sensitivity = (cfg.get<string>('sensitivity') ?? 'medium') as Sensitivity;
  const customThreshold = cfg.get<number>('loopThreshold') ?? 3;

  return {
    sensitivity,
    enableContextEngine: cfg.get<boolean>('enableContextEngine') ?? true,
    enableNotifications: cfg.get<boolean>('enableNotifications') ?? true,
    loopThreshold: customThreshold > 0 ? customThreshold : SENSITIVITY_THRESHOLDS[sensitivity],
    proUser: _proUser,
  };
}

/**
 * Registers a callback to be invoked when LoopGuard configuration changes.
 * Returns a Disposable — add to context.subscriptions.
 */
export function onConfigChange(
  callback: (config: LoopGuardConfig) => void,
): vscode.Disposable {
  return vscode.workspace.onDidChangeConfiguration((event) => {
    if (event.affectsConfiguration(CONFIG_SECTION)) {
      callback(getConfig());
    }
  });
}
