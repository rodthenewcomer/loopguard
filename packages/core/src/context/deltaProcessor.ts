import { estimateTokens } from '@loopguard/utils';

interface Snapshot {
  content: string;
  lines: string[];
  timestamp: number;
}

interface DeltaResult {
  delta: string;
  tokensSaved: number;
}

const CONTEXT_RADIUS = 3; // lines of context around each changed line
const MAX_CACHE_ENTRIES = 20;

/**
 * Computes incremental deltas between file snapshots.
 *
 * Instead of sending a full file on every AI call, DeltaProcessor
 * tracks the previous snapshot and sends only what changed — with
 * a few lines of surrounding context for readability.
 *
 * Cache is bounded to MAX_CACHE_ENTRIES using LRU-style eviction.
 */
export class DeltaProcessor {
  private readonly cache: Map<string, Snapshot> = new Map();

  /**
   * Processes a file's current content and returns the delta
   * against the last known snapshot. On first call for a URI,
   * returns the full content (no delta available yet).
   *
   * @param uri        File URI used as cache key
   * @param newContent Current full content of the file
   */
  process(uri: string, newContent: string): DeltaResult {
    const previous = this.cache.get(uri);
    const fullTokens = estimateTokens(newContent);

    this.updateCache(uri, newContent);

    // First time seeing this file — no delta possible
    if (previous === undefined) {
      return { delta: newContent, tokensSaved: 0 };
    }

    const changedChunks = this.computeChangedChunks(previous.lines, newContent.split('\n'));

    // No changes detected — send nothing
    if (changedChunks.length === 0) {
      return { delta: '[No changes since last snapshot]', tokensSaved: fullTokens };
    }

    const delta = this.formatDelta(changedChunks);
    const deltaTokens = estimateTokens(delta);
    const tokensSaved = Math.max(0, fullTokens - deltaTokens);

    return { delta, tokensSaved };
  }

  /**
   * Invalidates the cached snapshot for a URI.
   * Call this when a file is saved or externally modified.
   */
  invalidate(uri: string): void {
    this.cache.delete(uri);
  }

  /**
   * Clears all cached snapshots.
   */
  clear(): void {
    this.cache.clear();
  }

  private updateCache(uri: string, content: string): void {
    // LRU eviction when cache is full
    if (this.cache.size >= MAX_CACHE_ENTRIES && !this.cache.has(uri)) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(uri, {
      content,
      lines: content.split('\n'),
      timestamp: Date.now(),
    });
  }

  private computeChangedChunks(
    oldLines: string[],
    newLines: string[],
  ): Array<{ startLine: number; lines: string[] }> {
    const chunks: Array<{ startLine: number; lines: string[] }> = [];
    let currentChunk: { startLine: number; lines: string[] } | null = null;

    const maxLen = Math.max(oldLines.length, newLines.length);

    for (let i = 0; i < maxLen; i++) {
      const oldLine = oldLines[i] ?? '';
      const newLine = newLines[i] ?? '';

      if (oldLine !== newLine) {
        if (currentChunk === null) {
          // Start a new chunk with leading context
          const contextStart = Math.max(0, i - CONTEXT_RADIUS);
          const contextLines = newLines.slice(contextStart, i);
          currentChunk = {
            startLine: contextStart + 1,
            lines: contextLines,
          };
        }
        currentChunk.lines.push(newLine);
      } else if (currentChunk !== null) {
        // Add trailing context
        currentChunk.lines.push(newLine);

        // Check if we've added enough trailing context
        const trailingCount = currentChunk.lines.length - (i - currentChunk.startLine);
        if (trailingCount >= CONTEXT_RADIUS) {
          chunks.push(currentChunk);
          currentChunk = null;
        }
      }
    }

    if (currentChunk !== null) {
      chunks.push(currentChunk);
    }

    return chunks;
  }

  private formatDelta(chunks: Array<{ startLine: number; lines: string[] }>): string {
    const sections = chunks.map(({ startLine, lines }) => {
      const formatted = lines
        .map((line, i) => `${String(startLine + i).padStart(4)}: ${line}`)
        .join('\n');
      return `// --- Changed lines starting at ${startLine} ---\n${formatted}`;
    });

    return sections.join('\n\n');
  }
}
