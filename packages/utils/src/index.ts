/**
 * @loopguard/utils
 * Shared utilities — no framework dependencies, pure TypeScript.
 */

/**
 * djb2 hash — fast, deterministic, suitable for error fingerprinting.
 * Returns an 8-character hex string.
 */
export function hashString(s: string): string {
  let hash = 5381;
  for (let i = 0; i < s.length; i++) {
    hash = (hash * 33) ^ s.charCodeAt(i);
    hash = hash >>> 0; // keep unsigned 32-bit
  }
  return hash.toString(16).padStart(8, '0');
}

/**
 * Character n-gram similarity between two strings.
 * Returns a value between 0 (no overlap) and 1 (identical).
 * Uses trigrams (n=3) for a good balance of precision and recall.
 */
export function similarity(a: string, b: string): number {
  if (a === b) return 1;
  if (a.length < 3 || b.length < 3) return 0;

  const n = 3;
  const getNgrams = (str: string): Set<string> => {
    const ngrams = new Set<string>();
    for (let i = 0; i <= str.length - n; i++) {
      ngrams.add(str.slice(i, i + n));
    }
    return ngrams;
  };

  const ngramsA = getNgrams(a.toLowerCase());
  const ngramsB = getNgrams(b.toLowerCase());

  let intersection = 0;
  for (const ngram of ngramsA) {
    if (ngramsB.has(ngram)) intersection++;
  }

  const union = ngramsA.size + ngramsB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

/**
 * Standard debounce — delays execution until `ms` milliseconds
 * have passed since the last call.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => void>(fn: T, ms: number): T {
  let timer: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: Parameters<T>): void => {
    if (timer !== null) clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
      timer = null;
    }, ms);
  };

  return debounced as T;
}

/**
 * Formats a duration in milliseconds to a human-readable string.
 *
 * @example
 * formatDuration(4200000) // "1h 10min"
 * formatDuration(2700000) // "45min"
 * formatDuration(12000)   // "12s"
 * formatDuration(500)     // "< 1s"
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) return '< 1s';

  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
  }

  if (minutes > 0) {
    return `${minutes}min`;
  }

  return `${seconds}s`;
}

/**
 * Rough token count estimate based on character length.
 * GPT-4 / Claude average ~4 characters per token for English code.
 */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Generates a short, unique ID using timestamp + random suffix.
 * Not cryptographically secure — used for session/event IDs only.
 */
export function createId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 7);
  return `${timestamp}-${random}`;
}
