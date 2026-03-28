/**
 * @loopguard/types
 * Shared TypeScript interfaces for the LoopGuard system.
 * Any change here is a breaking change — update all consumers.
 */

export type LoopStatus = 'active' | 'resolved' | 'ignored';
export type AlertAction = 'try-new-approach' | 'ignore' | 'view-details' | 'dismiss';
export type Sensitivity = 'low' | 'medium' | 'high';

/**
 * A single error occurrence tracked by the loop detector.
 * The hash is derived from uri + message + line — never stored on the backend.
 */
export interface DiagnosticRecord {
  hash: string;
  message: string;
  line: number;
  col: number;
  /** Unix timestamps (ms) for each time this error was observed */
  seenAt: number[];
  uri: string;
}

/**
 * A detected loop — emitted when the same error repeats above threshold.
 */
export interface LoopEvent {
  id: string;
  fileUri: string;
  /** Raw error message — kept in memory only, never sent to backend */
  errorMessage: string;
  /** Anonymous hash of (uri + message + line) — safe for analytics */
  errorHash: string;
  occurrences: number;
  firstSeen: number;
  lastSeen: number;
  status: LoopStatus;
}

/**
 * A filtered context snapshot — replaces sending the entire file to AI.
 */
export interface ContextSnapshot {
  fileUri: string;
  /** Lines surrounding the error, with line numbers */
  relevantLines: string;
  /** Import/require statements from the top of the file */
  imports: string;
  /** The specific error context if available */
  errorContext: string | null;
  /** Estimated token count for this snapshot */
  tokenEstimate: number;
  timestamp: number;
}

/**
 * Aggregated metrics for the current session.
 */
export interface SessionMetrics {
  sessionId: string;
  startTime: number;
  /** Total number of loop events detected this session */
  totalLoopsDetected: number;
  /** Sum of (lastSeen - firstSeen) for all loops — ms */
  totalTimeWasted: number;
  /** Estimated tokens saved by the context engine this session */
  tokensSaved: number;
}

/**
 * User-facing configuration, mapped from VS Code workspace settings.
 */
export interface LoopGuardConfig {
  sensitivity: Sensitivity;
  enableContextEngine: boolean;
  enableNotifications: boolean;
  /** Custom loop occurrence threshold — overrides sensitivity preset */
  loopThreshold: number;
  proUser: boolean;
}

/**
 * Sensitivity preset → occurrence threshold mapping.
 */
export const SENSITIVITY_THRESHOLDS: Record<Sensitivity, number> = {
  low: 5,
  medium: 3,
  high: 2,
} as const;

/** Default time window for loop detection: 5 minutes */
export const DEFAULT_TIME_WINDOW_MS = 5 * 60 * 1000;
