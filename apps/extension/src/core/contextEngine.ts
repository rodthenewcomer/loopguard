import * as vscode from 'vscode';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { existsSync } from 'fs';
import { join } from 'path';
import { selectRelevantLines, DeltaProcessor } from '@loopguard/core';
import type { ContextSnapshot, LoopGuardConfig } from '@loopguard/types';
import { estimateTokens } from '@loopguard/utils';
import { logger } from '../utils/logger';

const execFileAsync = promisify(execFile);
const CONTEXT_RADIUS = 30;

/**
 * Context Engine — two-tier architecture:
 *
 * Tier 1 (Rust binary): AST signatures, Shannon entropy, Myers delta, 90+ CLI patterns
 *   → 89–99% token reduction. Used when loopguard-ctx binary is available.
 *
 * Tier 2 (TypeScript): Line selection + delta processing
 *   → ~80% token reduction. Used as fallback when binary is not present.
 *
 * The extension tries Tier 1 first on every call. Fallback is automatic.
 * Users never need to know which tier is running.
 */
export class ContextEngine {
  private readonly deltaProcessor = new DeltaProcessor();
  private enabled: boolean = true;
  private binaryPath: string | null = null;
  private binaryChecked = false;
  /** True when binaryPath is a bare command name on PATH (skip existsSync check) */
  private binaryIsOnPath = false;

  constructor(config: LoopGuardConfig, extensionUri?: vscode.Uri) {
    this.enabled = config.enableContextEngine;
    if (extensionUri !== undefined) {
      this.binaryPath = this.resolveBinaryPath(extensionUri.fsPath);
    }
  }

  /**
   * Builds a ContextSnapshot focused around the given error line.
   * Uses Rust binary (AST + entropy) if available, TypeScript fallback otherwise.
   */
  async getSnapshotAsync(
    document: vscode.TextDocument,
    errorLine?: number,
  ): Promise<ContextSnapshot> {
    const uri = document.uri.toString();
    const content = document.getText();

    if (!this.enabled) return this.buildFullSnapshot(document, content);

    const targetLine = errorLine ?? this.findFirstErrorLine(document);

    try {
      const binary = await this.findBinary();
      if (binary !== null) {
        return await this.getSnapshotFromBinary(binary, document, targetLine);
      }
    } catch (error) {
      logger.warn('Rust binary failed, using TypeScript fallback', { error });
    }

    return this.getSnapshotFromTS(document, content, targetLine, uri);
  }

  /**
   * Synchronous snapshot — always uses TypeScript engine.
   * Use getSnapshotAsync() for Rust-powered compression.
   */
  getSnapshot(document: vscode.TextDocument, errorLine?: number): ContextSnapshot {
    const uri = document.uri.toString();
    const content = document.getText();
    if (!this.enabled) return this.buildFullSnapshot(document, content);
    const targetLine = errorLine ?? this.findFirstErrorLine(document);
    return this.getSnapshotFromTS(document, content, targetLine, uri);
  }

  getDelta(document: vscode.TextDocument): { delta: string; tokensSaved: number } {
    if (!this.enabled) return { delta: document.getText(), tokensSaved: 0 };
    try {
      return this.deltaProcessor.process(document.uri.toString(), document.getText());
    } catch (error) {
      logger.error('Failed to compute delta', { error });
      return { delta: document.getText(), tokensSaved: 0 };
    }
  }

  clearCache(uri?: string): void {
    if (uri !== undefined) {
      this.deltaProcessor.invalidate(uri);
    } else {
      this.deltaProcessor.clear();
    }
  }

  updateConfig(config: LoopGuardConfig): void {
    this.enabled = config.enableContextEngine;
  }

  async isBinaryAvailable(): Promise<boolean> {
    return (await this.findBinary()) !== null;
  }

  /** Returns the resolved binary path (bundled or system), or null if unavailable. */
  async getResolvedBinaryPath(): Promise<string | null> {
    return this.findBinary();
  }

  private async getSnapshotFromBinary(
    binary: string,
    document: vscode.TextDocument,
    errorLine: number,
  ): Promise<ContextSnapshot> {
    const filePath = document.uri.fsPath;
    const args = ['read', filePath, '--mode=entropy'];
    if (errorLine > 0) args.push(`--focus-line=${errorLine}`);

    const { stdout } = await execFileAsync(binary, args, { timeout: 8000 });
    const compressedTokens = estimateTokens(stdout);

    return {
      fileUri: document.uri.toString(),
      relevantLines: stdout,
      imports: '',
      errorContext: errorLine > 0 ? `Error near line ${errorLine}` : null,
      tokenEstimate: compressedTokens,
      timestamp: Date.now(),
    };
  }

  private getSnapshotFromTS(
    document: vscode.TextDocument,
    content: string,
    targetLine: number,
    uri: string,
  ): ContextSnapshot {
    try {
      const relevantLines = selectRelevantLines(content, targetLine, CONTEXT_RADIUS);
      const imports = this.extractImports(content);
      return {
        fileUri: uri,
        relevantLines,
        imports,
        errorContext: targetLine > 0 ? `Error near line ${targetLine}` : null,
        tokenEstimate: estimateTokens(relevantLines + imports),
        timestamp: Date.now(),
      };
    } catch (error) {
      logger.error('Failed to build TS context snapshot', { error, uri });
      return this.buildFullSnapshot(document, content);
    }
  }

  private async findBinary(): Promise<string | null> {
    if (this.binaryChecked) {
      if (this.binaryPath === null) return null;
      // Path-based binary: verify the file still exists (VSIX could be updated)
      if (!this.binaryIsOnPath && !existsSync(this.binaryPath)) {
        this.binaryPath = null;
        return null;
      }
      return this.binaryPath;
    }
    this.binaryChecked = true;

    // 1. Try bundled path first (absolute path resolved from extensionUri)
    if (this.binaryPath !== null && existsSync(this.binaryPath)) {
      try {
        await execFileAsync(this.binaryPath, ['--version'], { timeout: 2000 });
        logger.info('Using bundled loopguard-ctx binary', { path: this.binaryPath });
        this.binaryIsOnPath = false;
        return this.binaryPath;
      } catch {
        // fall through to PATH check
      }
    }

    // 2. Try system PATH (bare command name — existsSync is meaningless here)
    try {
      await execFileAsync('loopguard-ctx', ['--version'], { timeout: 2000 });
      this.binaryPath = 'loopguard-ctx';
      this.binaryIsOnPath = true;
      logger.info('Using system loopguard-ctx binary');
      return 'loopguard-ctx';
    } catch {
      logger.info('loopguard-ctx binary not found, using TypeScript fallback');
      this.binaryPath = null;
      return null;
    }
  }

  private buildFullSnapshot(
    document: vscode.TextDocument,
    content: string,
  ): ContextSnapshot {
    return {
      fileUri: document.uri.toString(),
      relevantLines: content,
      imports: '',
      errorContext: null,
      tokenEstimate: estimateTokens(content),
      timestamp: Date.now(),
    };
  }

  private extractImports(content: string): string {
    const lines = content.split('\n').slice(0, 50);
    const importPattern = /^(import|require|from|#include|use |using )/;
    return lines.filter((l) => importPattern.test(l.trimStart())).join('\n');
  }

  private findFirstErrorLine(document: vscode.TextDocument): number {
    const diagnostics = vscode.languages.getDiagnostics(document.uri);
    const firstError = diagnostics.find(
      (d) => d.severity === vscode.DiagnosticSeverity.Error,
    );
    return firstError !== undefined ? firstError.range.start.line + 1 : 0;
  }

  private resolveBinaryPath(extensionPath: string): string {
    const platform = process.platform;
    const arch = process.arch;
    const binaryName = platform === 'win32' ? 'loopguard-ctx.exe' : 'loopguard-ctx';
    return join(extensionPath, 'bin', `${platform}-${arch}`, binaryName);
  }
}
