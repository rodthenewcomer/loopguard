import { describe, it, expect } from 'vitest';
import { getHint, isHintUseful } from './hintEngine';

describe('getHint', () => {
  it('detects null/undefined access from "Cannot read properties of undefined"', () => {
    const hint = getHint('Cannot read properties of undefined (reading "map")');
    expect(hint.pattern).toBe('null_access');
    expect(hint.confidence).toBeGreaterThanOrEqual(0.5);
    expect(hint.diagnosis).toBeTruthy();
    expect(hint.suggestion).toBeTruthy();
  });

  it('detects null access from "TypeError: null"', () => {
    const hint = getHint('TypeError: null is not an object');
    expect(hint.pattern).toBe('null_access');
  });

  it('detects TypeScript null from "Object is possibly undefined"', () => {
    const hint = getHint("Object is possibly 'undefined'");
    expect(hint.pattern).toBe('null_access');
    expect(hint.confidence).toBeGreaterThanOrEqual(0.5);
  });

  it('detects type mismatch from "is not assignable to type"', () => {
    const hint = getHint("Type 'string' is not assignable to type 'number'");
    expect(hint.pattern).toBe('type_mismatch');
    expect(hint.confidence).toBeGreaterThanOrEqual(0.9);
  });

  it('detects property-does-not-exist type narrowing', () => {
    const hint = getHint("Property 'foo' does not exist on type 'Bar'");
    expect(hint.pattern).toBe('type_narrowing');
  });

  it('detects missing import/module errors', () => {
    const hint = getHint("Cannot find module './utils' or its corresponding type declarations");
    expect(hint.pattern).toBe('missing_import');
    expect(hint.confidence).toBeGreaterThanOrEqual(0.5);
  });

  it('detects missing export', () => {
    const hint = getHint("Module '@loopguard/types' has no exported member 'Foo'");
    expect(hint.pattern).toBe('missing_export');
  });

  it('detects unhandled promise rejection', () => {
    const hint = getHint('UnhandledPromiseRejection: database connection failed');
    expect(hint.pattern).toBe('unhandled_promise');
  });

  it('detects React key prop error', () => {
    const hint = getHint('Each child in a list should have a unique key prop');
    expect(hint.pattern).toBe('react_key');
    expect(hint.confidence).toBeGreaterThanOrEqual(0.5);
  });

  it('detects React hooks order violation', () => {
    const hint = getHint('Invalid hook call. Hooks can only be called inside the body of a function component. Rendered fewer hooks than expected — rules of hooks violated');
    expect(hint.pattern).toBe('react_hook_order');
  });

  it('detects Rust borrow checker errors', () => {
    const hint = getHint('cannot borrow `x` as mutable because it is also already borrowed as immutable');
    expect(hint.pattern).toBe('borrow_conflict');
    expect(hint.confidence).toBeGreaterThanOrEqual(0.5);
  });

  it('detects Rust lifetime errors', () => {
    const hint = getHint('borrowed value does not live long enough');
    expect(hint.pattern).toBe('lifetime_error');
  });

  it('returns generic fallback for unknown error text', () => {
    const hint = getHint('zzz totally unknown error xyz');
    expect(hint.pattern).toBe('repeated_error');
    expect(hint.confidence).toBe(0.3);
  });

  it('is case-insensitive in matching', () => {
    const hint = getHint('CANNOT FIND MODULE — build failed');
    expect(hint.pattern).toBe('missing_import');
  });

  it('prefers higher-weight pattern when multiple match', () => {
    // "is not a function" + "TypeError:" both match not_a_function patterns
    const hint = getHint('TypeError: foo is not a function');
    expect(['not_a_function', 'null_access']).toContain(hint.pattern);
    expect(hint.confidence).toBeGreaterThanOrEqual(0.5);
  });
});

describe('isHintUseful', () => {
  it('returns true for high-confidence specific hints', () => {
    const hint = getHint('Cannot read properties of undefined');
    expect(isHintUseful(hint)).toBe(true);
  });

  it('returns false for the generic fallback', () => {
    const hint = getHint('zzz totally unknown error xyz');
    expect(isHintUseful(hint)).toBe(false);
  });

  it('returns false for low-confidence hints (< 0.5)', () => {
    expect(isHintUseful({ pattern: 'async_misuse', diagnosis: 'x', suggestion: 'y', confidence: 0.4 })).toBe(false);
  });
});
