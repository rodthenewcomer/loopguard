import { describe, it, expect, beforeEach } from 'vitest';
import { DeltaProcessor } from './deltaProcessor';

const URI = 'file:///src/app.ts';

describe('DeltaProcessor', () => {
  let dp: DeltaProcessor;

  beforeEach(() => {
    dp = new DeltaProcessor();
  });

  describe('first call (no prior snapshot)', () => {
    it('returns full content on first process', () => {
      const content = 'const x = 1;\nconst y = 2;';
      const result = dp.process(URI, content);
      expect(result.delta).toBe(content);
      expect(result.tokensSaved).toBe(0);
    });
  });

  describe('subsequent calls (delta)', () => {
    it('returns no-change sentinel when content is identical', () => {
      const content = 'const x = 1;\nconst y = 2;';
      dp.process(URI, content);
      const result = dp.process(URI, content);
      expect(result.delta).toBe('[No changes since last snapshot]');
      expect(result.tokensSaved).toBeGreaterThan(0);
    });

    it('includes only changed lines (plus context) in delta', () => {
      const original = Array.from({ length: 20 }, (_, i) => `line ${i + 1}`).join('\n');
      const modified = original.replace('line 10', 'line 10 CHANGED');
      dp.process(URI, original);
      const result = dp.process(URI, modified);
      expect(result.delta).toContain('line 10 CHANGED');
      expect(result.delta).not.toContain('[No changes since last snapshot]');
    });

    it('saves tokens when a small change is made to a large file', () => {
      const bigFile = Array.from({ length: 200 }, (_, i) => `const v${i} = ${i};`).join('\n');
      dp.process(URI, bigFile);
      const modified = bigFile.replace('const v100 = 100;', 'const v100 = 999;');
      const result = dp.process(URI, modified);
      expect(result.tokensSaved).toBeGreaterThan(0);
    });

    it('delta includes line numbers in output', () => {
      const original = 'line 1\nline 2\nline 3\nline 4\nline 5';
      const modified = 'line 1\nline 2\nCHANGED\nline 4\nline 5';
      dp.process(URI, original);
      const result = dp.process(URI, modified);
      expect(result.delta).toMatch(/\d+:/); // at least one "N: " line number
    });
  });

  describe('invalidate', () => {
    it('forces full content on next call after invalidation', () => {
      const content = 'hello world';
      dp.process(URI, content);
      dp.invalidate(URI);
      const result = dp.process(URI, content);
      // After invalidation, no snapshot — should return full content
      expect(result.delta).toBe(content);
      expect(result.tokensSaved).toBe(0);
    });

    it('is a no-op for a URI that was never cached', () => {
      expect(() => dp.invalidate('file:///never-seen.ts')).not.toThrow();
    });
  });

  describe('clear', () => {
    it('clears all snapshots and forces full content on next call', () => {
      const a = 'file:///a.ts';
      const b = 'file:///b.ts';
      dp.process(a, 'content a');
      dp.process(b, 'content b');
      dp.clear();
      expect(dp.process(a, 'content a').tokensSaved).toBe(0);
      expect(dp.process(b, 'content b').tokensSaved).toBe(0);
    });
  });

  describe('multiple URIs', () => {
    it('tracks each URI independently', () => {
      const uriA = 'file:///a.ts';
      const uriB = 'file:///b.ts';
      dp.process(uriA, 'a original');
      dp.process(uriB, 'b original');

      // Unchanged B — should show no-change
      const bResult = dp.process(uriB, 'b original');
      expect(bResult.delta).toBe('[No changes since last snapshot]');

      // Changed A — should show delta
      const aResult = dp.process(uriA, 'a CHANGED');
      expect(aResult.delta).toContain('a CHANGED');
    });
  });
});
