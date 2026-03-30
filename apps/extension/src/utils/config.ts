import * as vscode from 'vscode';
import type { LoopGuardConfig, Sensitivity } from '@loopguard/types';
import { SENSITIVITY_THRESHOLDS } from '@loopguard/types';

const CONFIG_SECTION = 'loopguard';

/**
 * All features are free — proUser is always true.
 */
const _proUser = true;

/** No-op: kept for compatibility, all users have full access. */
export function setProUser(_value: boolean): void {
  // All features are free — no-op
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
