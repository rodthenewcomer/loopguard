import * as vscode from 'vscode';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private readonly channel: vscode.OutputChannel;
  private debugEnabled: boolean = false;

  constructor() {
    this.channel = vscode.window.createOutputChannel('LoopGuard');
  }

  debug(message: string, data?: unknown): void {
    if (!this.debugEnabled) return;
    this.write('DEBUG', message, data);
  }

  info(message: string, data?: unknown): void {
    this.write('INFO', message, data);
  }

  warn(message: string, data?: unknown): void {
    this.write('WARN', message, data);
  }

  error(message: string, data?: unknown): void {
    this.write('ERROR', message, data);
    this.channel.show(true); // Reveal on error
  }

  enableDebug(): void {
    this.debugEnabled = true;
    this.info('Debug logging enabled');
  }

  dispose(): void {
    this.channel.dispose();
  }

  private write(level: Uppercase<LogLevel>, message: string, data?: unknown): void {
    const timestamp = new Date().toISOString().slice(11, 23); // HH:MM:SS.mmm
    const dataStr = data !== undefined ? ` ${JSON.stringify(data, null, 0)}` : '';
    this.channel.appendLine(`[${timestamp}] [${level}] ${message}${dataStr}`);
  }
}

// Singleton — import this in all extension modules
export const logger = new Logger();
