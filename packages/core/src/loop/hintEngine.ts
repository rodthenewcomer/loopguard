/**
 * hintEngine — Loop root cause pattern library.
 *
 * Analyzes raw error message text and returns a specific diagnosis +
 * actionable suggestion. Runs entirely locally — no LLM call needed
 * for the common 90% of cases.
 */

export interface LoopHint {
  /** Short name for the pattern class */
  pattern: string;
  /** One-sentence root cause diagnosis */
  diagnosis: string;
  /** Specific actionable suggestion */
  suggestion: string;
  /** 0–1 confidence that this pattern matched */
  confidence: number;
}

interface HintPattern {
  name: string;
  // One or more substrings that must appear in the lowercased error text
  matches: string[];
  diagnosis: string;
  suggestion: string;
  weight: number;
}

const PATTERNS: HintPattern[] = [
  // ── Null / undefined access ─────────────────────────────────────
  {
    name: 'null_access',
    matches: ['cannot read properties of undefined', 'cannot read property'],
    diagnosis: 'A value is undefined before it is accessed.',
    suggestion: 'Add optional chaining (?.) or a guard: `if (value === undefined) return`.',
    weight: 1.0,
  },
  {
    name: 'null_access',
    matches: ['typeerror: null'],
    diagnosis: 'A null value is being accessed as an object.',
    suggestion: 'Check the assignment before this line — the value may never be initialised.',
    weight: 0.9,
  },
  {
    name: 'null_access',
    matches: ['object is possibly \'undefined\'', "object is possibly 'null'"],
    diagnosis: 'TypeScript caught a potential null/undefined access at compile time.',
    suggestion: 'Use optional chaining (?.) or a non-null assertion (!.) only if you are certain it is safe.',
    weight: 1.0,
  },

  // ── Type mismatches ─────────────────────────────────────────────
  {
    name: 'type_mismatch',
    matches: ['is not assignable to type'],
    diagnosis: 'The value type does not match the expected type.',
    suggestion: 'Check the interface/type definition. A missing property or wrong shape is the usual cause.',
    weight: 1.0,
  },
  {
    name: 'type_narrowing',
    matches: ['property', 'does not exist on type'],
    diagnosis: 'A property is being accessed on a type that does not include it.',
    suggestion: 'Narrow the union type with a type guard, or check the interface — the property may have been renamed.',
    weight: 0.95,
  },
  {
    name: 'type_narrowing',
    matches: ['overload', 'no overload matches'],
    diagnosis: 'No overload of this function accepts the given argument types.',
    suggestion: 'Check the function signature. The argument type or order may be wrong.',
    weight: 0.9,
  },

  // ── Async / Promise ─────────────────────────────────────────────
  {
    name: 'async_misuse',
    matches: ['promise', 'await', 'async'],
    diagnosis: 'An async operation may not be awaited or may be resolving to a Promise object instead of its value.',
    suggestion: 'Add `await` before the async call, or check that the function is marked `async`.',
    weight: 0.7,
  },
  {
    name: 'unhandled_promise',
    matches: ['unhandledpromiserejection', 'unhandled promise rejection'],
    diagnosis: 'A rejected Promise has no catch handler.',
    suggestion: 'Add `.catch(err => ...)` or wrap in `try/catch` with `await`.',
    weight: 1.0,
  },

  // ── Import / module ─────────────────────────────────────────────
  {
    name: 'missing_import',
    matches: ['cannot find module', 'module not found'],
    diagnosis: 'A module cannot be resolved — likely a wrong path, missing package, or build output issue.',
    suggestion: 'Check the import path (case-sensitive on Linux), run `npm install`, and verify tsconfig paths.',
    weight: 1.0,
  },
  {
    name: 'missing_export',
    matches: ['has no exported member', 'does not provide an export'],
    diagnosis: 'The imported name does not exist in the target module.',
    suggestion: 'Check the exact export name — it may have been renamed or moved.',
    weight: 1.0,
  },

  // ── Not a function ───────────────────────────────────────────────
  {
    name: 'not_a_function',
    matches: ['is not a function', 'typeerror:', 'not a function'],
    diagnosis: 'A value expected to be callable is not a function at runtime.',
    suggestion: 'Log the value before calling it: `console.log(typeof myFn, myFn)` — it may be undefined or an object.',
    weight: 0.8,
  },

  // ── Rust / Cargo ─────────────────────────────────────────────────
  {
    name: 'borrow_conflict',
    matches: ['cannot borrow', 'already borrowed', 'borrow checker'],
    diagnosis: 'The Rust borrow checker detected a conflicting borrow.',
    suggestion: 'Introduce an explicit scope or clone the value. Avoid holding a mutable reference while an immutable one is alive.',
    weight: 1.0,
  },
  {
    name: 'lifetime_error',
    matches: ['lifetime', 'does not live long enough', 'borrowed value'],
    diagnosis: 'A borrowed value is used after it may have been dropped.',
    suggestion: 'Move the binding earlier, return an owned value instead of a reference, or use `Arc`/`Rc`.',
    weight: 1.0,
  },

  // ── React / JSX ──────────────────────────────────────────────────
  {
    name: 'react_key',
    matches: ['each child in a list', 'key prop', 'unique "key"'],
    diagnosis: 'React requires a unique `key` prop on each element in a list.',
    suggestion: 'Add `key={item.id}` to each element in the `.map()` call — never use array index if the list can reorder.',
    weight: 1.0,
  },
  {
    name: 'react_hook_order',
    matches: ['rules of hooks', 'hook', 'rendered fewer hooks'],
    diagnosis: 'A React hook is being called conditionally or in a different order between renders.',
    suggestion: 'Hooks must be called unconditionally at the top level — move the hook call outside of any if/loop.',
    weight: 1.0,
  },

  // ── Generic fallback ─────────────────────────────────────────────
  {
    name: 'repeated_error',
    matches: [],
    diagnosis: 'The same error has recurred — this suggests the root cause is upstream of where the error appears.',
    suggestion: 'Stop fixing the symptom. Find where the bad value originates and fix it there instead.',
    weight: 0.3,
  },
];

/**
 * Returns the best matching hint for the given error message,
 * or a generic fallback if no pattern matches confidently.
 */
export function getHint(errorMessage: string): LoopHint {
  const lower = errorMessage.toLowerCase();

  let best: { pattern: HintPattern; score: number } | null = null;

  for (const pattern of PATTERNS) {
    if (pattern.matches.length === 0) continue; // skip fallback in scoring pass

    const hits = pattern.matches.filter((m) => lower.includes(m)).length;
    if (hits === 0) continue;

    const score = (hits / pattern.matches.length) * pattern.weight;
    if (best === null || score > best.score) {
      best = { pattern, score };
    }
  }

  if (best !== null && best.score >= 0.5) {
    return {
      pattern: best.pattern.name,
      diagnosis: best.pattern.diagnosis,
      suggestion: best.pattern.suggestion,
      confidence: Math.min(best.score, 1.0),
    };
  }

  // Generic fallback
  const fallback = PATTERNS[PATTERNS.length - 1]!;
  return {
    pattern: fallback.name,
    diagnosis: fallback.diagnosis,
    suggestion: fallback.suggestion,
    confidence: 0.3,
  };
}

/**
 * Returns true if the hint is specific enough to show in the alert.
 * Filters out low-confidence generic hints that would add noise.
 */
export function isHintUseful(hint: LoopHint): boolean {
  return hint.confidence >= 0.5 && hint.pattern !== 'repeated_error';
}
