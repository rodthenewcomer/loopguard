import { describe, it, expect } from 'vitest';
import { selectRelevantLines } from './fileSelector';

function makeFile(lineCount: number): string {
  return Array.from({ length: lineCount }, (_, i) => `const v${i + 1} = ${i + 1};`).join('\n');
}

describe('selectRelevantLines', () => {
  describe('error line window', () => {
    it('includes the error line in the output', () => {
      const file = makeFile(100);
      const result = selectRelevantLines(file, 50);
      expect(result).toContain('>>> ');
      expect(result).toContain('v50 = 50');
    });

    it('marks the error line with >>> prefix', () => {
      const file = makeFile(10);
      const result = selectRelevantLines(file, 5);
      const lines = result.split('\n');
      const errorLine = lines.find((l) => l.includes('>>>'));
      expect(errorLine).toBeDefined();
      expect(errorLine).toContain('v5 = 5');
    });

    it('includes surrounding lines within the radius', () => {
      const file = makeFile(100);
      const result = selectRelevantLines(file, 50, 5);
      // Line 45 and 55 should both appear
      expect(result).toContain('v45 = 45');
      expect(result).toContain('v55 = 55');
    });

    it('does not include lines far outside the radius', () => {
      const file = makeFile(100);
      const result = selectRelevantLines(file, 50, 5);
      // Line 1 and 100 should NOT appear (too far)
      expect(result).not.toContain('v1 = 1');
      expect(result).not.toContain('v100 = 100');
    });

    it('clamps to the file start when error line is near beginning', () => {
      const file = makeFile(10);
      expect(() => selectRelevantLines(file, 1)).not.toThrow();
      const result = selectRelevantLines(file, 1);
      expect(result).toContain('>>>');
    });

    it('clamps to the file end when error line is near end', () => {
      const file = makeFile(10);
      expect(() => selectRelevantLines(file, 10)).not.toThrow();
      const result = selectRelevantLines(file, 10);
      expect(result).toContain('>>>');
    });
  });

  describe('no error line (errorLine <= 0)', () => {
    it('returns first 60 lines when errorLine is 0', () => {
      const file = makeFile(100);
      const result = selectRelevantLines(file, 0);
      // Should not contain a >>> marker
      expect(result).not.toContain('>>>');
      // Should have content from start
      expect(result).toContain('v1 = 1');
    });

    it('returns first 60 lines when errorLine is negative', () => {
      const file = makeFile(100);
      const result = selectRelevantLines(file, -5);
      expect(result).not.toContain('>>>');
      expect(result).toContain('v1 = 1');
    });
  });

  describe('import extraction', () => {
    it('extracts import statements into an imports section', () => {
      const file = [
        "import { foo } from './foo';",
        "import React from 'react';",
        'const x = 1;',
        'const y = 2;',
        'const error = here;',
      ].join('\n');
      const result = selectRelevantLines(file, 5);
      expect(result).toContain('// --- Imports ---');
      expect(result).toContain("import { foo } from './foo'");
      expect(result).toContain("import React from 'react'");
    });

    it('includes require() calls as imports when line starts with require', () => {
      const file = [
        "require('./sideEffect');",
        'const x = 1;',
        'throw new Error();',
      ].join('\n');
      const result = selectRelevantLines(file, 3);
      expect(result).toContain('// --- Imports ---');
      expect(result).toContain("require('./sideEffect')");
    });

    it('does not add imports section when there are none', () => {
      const file = makeFile(10);
      const result = selectRelevantLines(file, 5);
      expect(result).not.toContain('// --- Imports ---');
    });
  });

  describe('line number formatting', () => {
    it('includes line numbers in output', () => {
      const file = makeFile(20);
      const result = selectRelevantLines(file, 10);
      // Look for right-padded line numbers like "  10:" or "  10"
      expect(result).toMatch(/\d+:/);
    });
  });

  describe('small files', () => {
    it('handles a 1-line file without throwing', () => {
      expect(() => selectRelevantLines('const x = 1;', 1)).not.toThrow();
    });

    it('handles empty file without throwing', () => {
      expect(() => selectRelevantLines('', 0)).not.toThrow();
    });
  });
});
